import { useEffect, useMemo, useState } from "react";
import { parseTopics, buildRevisionPlan, planToIcs, itemLabel, fmtH, isoDay, parseIso } from "../../../tools/study.js";
import { CopyButton, downloadBlob } from "../ui.jsx";
import { Seg, Tabs, NumberBox, printHtml, esc, safeGet, safeSet } from "./common.jsx";

const SAMPLE_TOPICS = `Physics: Electricity, hard
Physics: Light – reflection and refraction, medium
Chemistry: Acids, bases and salts, hard
Chemistry: Carbon and its compounds, medium
Maths: Trigonometry, hard
Maths: Statistics, easy
Biology: Life processes, medium
English: Grammar, easy, 1h`;
const DONE_KEY = "ftp-revision-done";
const TYPE_NAME = { learn: "Learn", revise: "Revise", mock: "Mock test", final: "Final revision" };
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function localToday() {
  const d = new Date();
  return isoDay(d.getTime() - d.getTimezoneOffset() * 60000);
}
function addDays(iso, n) {
  return isoDay(parseIso(iso) + n * 86400000);
}
function niceDate(iso, opts = { weekday: "short", day: "numeric", month: "short" }) {
  return new Date(parseIso(iso)).toLocaleDateString("en-IN", { ...opts, timeZone: "UTC" });
}

export default function RevisionPlan() {
  const [topicsText, setTopicsText] = useState(SAMPLE_TOPICS);
  const [start, setStart] = useState("2026-11-02");
  const [exam, setExam] = useState("2027-01-15");
  const [weekday, setWeekday] = useState(3);
  const [weekend, setWeekend] = useState(5);
  const [rest, setRest] = useState("none");
  const [scheme, setScheme] = useState("standard");
  const [finalDays, setFinalDays] = useState(7);
  const [order, setOrder] = useState("hard-first");
  const [pace, setPace] = useState("spread");
  const [view, setView] = useState("list");
  const [done, setDone] = useState({});
  const [today, setToday] = useState("");

  // Dates depend on the visitor's clock, so set them after hydration.
  useEffect(() => {
    const t = localToday();
    setToday(t);
    setStart(t);
    setExam(addDays(t, 70));
    setDone(safeGet(DONE_KEY, {}));
    const saved = safeGet("ftp-revision-inputs", null);
    if (saved) {
      if (saved.topicsText) setTopicsText(saved.topicsText);
      if (saved.exam && saved.exam > t) setExam(saved.exam);
    }
  }, []);
  useEffect(() => {
    if (today) safeSet("ftp-revision-inputs", { topicsText, exam });
  }, [topicsText, exam, today]);

  const topics = useMemo(() => parseTopics(topicsText), [topicsText]);
  const plan = useMemo(() => buildRevisionPlan({ topics, start, exam, weekday: Number(weekday) || 0, weekend: Number(weekend) || 0, rest, scheme, finalDays: Number(finalDays) || 0, order, pace }), [topics, start, exam, weekday, weekend, rest, scheme, finalDays, order, pace]);
  const sig = `${exam}|${topics.map((t) => t.name).join(",")}`.slice(0, 160);
  const itemKey = (d, k) => `${sig}#${d.date}#${k}`;
  const toggle = (key) =>
    setDone((p) => {
      const n = { ...p };
      if (n[key]) delete n[key];
      else n[key] = 1;
      safeSet(DONE_KEY, n);
      return n;
    });

  const allItems = plan.error ? [] : plan.days.flatMap((d) => d.items.map((x, k) => itemKey(d, k)));
  const doneCount = allItems.filter((k) => done[k]).length;
  const daysLeft = today && !plan.error ? Math.max(0, Math.round((parseIso(exam) - parseIso(today)) / 86400000)) : null;
  const todayDay = plan.error ? null : plan.days.find((d) => d.date === today);

  const asText = () =>
    plan.days
      .filter((d) => d.items.length)
      .map((d) => `${niceDate(d.date)} (${fmtH(d.used)})\n${d.items.map((x) => `  [ ] ${itemLabel(x)} – ${fmtH(x.hours)}`).join("\n")}`)
      .join("\n\n");
  const csv = () => "Date,Type,Subject,Topic,Hours\n" + plan.days.flatMap((d) => d.items.map((x) => [d.date, TYPE_NAME[x.type], x.topic?.subject || "", x.topic?.name || "Full mock test", x.hours].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))).join("\n");
  const print = () =>
    printHtml(
      "Revision plan",
      `<h1>Revision plan</h1><p class="muted">${niceDate(start, { day: "numeric", month: "long", year: "numeric" })} to exam on ${niceDate(exam, { day: "numeric", month: "long", year: "numeric" })} · ${plan.stats.topics} topics</p>${plan.days
        .filter((d) => d.items.length)
        .map((d) => `<div class="day"><b>${esc(niceDate(d.date))}</b> · ${fmtH(d.used)}<br>${d.items.map((x) => `<span class="box"></span>${esc(itemLabel(x))} (${fmtH(x.hours)})`).join("<br>")}</div>`)
        .join("")}`
    );

  return (
    <div className="study">
      <div className="io io--split">
        <div className="io__pane">
          <div className="io__bar">
            <label className="field__label" htmlFor="rp-topics">
              Topics (one per line: subject: topic, difficulty, hours)
              <span className="field__count is-under">{topics.length} topics</span>
            </label>
            <div className="io__tools">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setTopicsText(SAMPLE_TOPICS)}>
                Sample
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setTopicsText("")}>
                Clear
              </button>
            </div>
          </div>
          <textarea id="rp-topics" className="input textarea textarea--notes" rows={9} value={topicsText} onChange={(e) => setTopicsText(e.target.value)} placeholder={"Physics: Electricity, hard\nMaths: Statistics, easy, 2h"} />
          <p className="field__hint">Difficulty sets the learning time if you leave hours out: easy 1.5 h, medium 3 h, hard 5 h. Hard topics also get longer revisions.</p>
          <div className="study-opts study-opts--grid">
            <div className="field">
              <label className="field__label" htmlFor="rp-start">
                Start
              </label>
              <input id="rp-start" className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="rp-exam">
                Exam date
              </label>
              <input id="rp-exam" className="input" type="date" value={exam} onChange={(e) => setExam(e.target.value)} />
            </div>
            <NumberBox id="rp-wd" label="Hours on weekdays" value={weekday} min={0} max={14} step={0.5} unit="h" onChange={setWeekday} />
            <NumberBox id="rp-we" label="Hours on weekends" value={weekend} min={0} max={14} step={0.5} unit="h" onChange={setWeekend} />
            <NumberBox id="rp-fd" label="Final revision days" value={finalDays} min={0} max={30} unit="days" onChange={setFinalDays} />
          </div>
          <Seg label="Rest days" value={rest} onChange={setRest} options={[["none", "None"], ["sun", "Sundays"], ["weekend", "Weekends"]]} />
          <Seg label="Spaced revision" value={scheme} onChange={setScheme} options={[["standard", "Standard 1·3·7·14·30"], ["intensive", "Intensive 1·2·4·7·12"], ["light", "Light 2·7·21"]]} />
          <Seg label="Pace" value={pace} onChange={setPace} options={[["spread", "Spread evenly to the exam"], ["fast", "Finish new topics early"]]} />
          <Seg label="Topic order" value={order} onChange={setOrder} options={[["hard-first", "Hardest first"], ["interleave", "Mix subjects"], ["listed", "As listed"]]} />
        </div>

        <div className="io__pane">
          {plan.error ? (
            <p className="study-empty">{plan.error}</p>
          ) : (
            <>
              <dl className="stats">
                <div className="stats__item">
                  <dt>Days to exam</dt>
                  <dd>{daysLeft ?? plan.stats.days}</dd>
                </div>
                <div className="stats__item">
                  <dt>Learning</dt>
                  <dd>{fmtH(plan.stats.learnHours)}</dd>
                </div>
                <div className="stats__item">
                  <dt>Spaced revision</dt>
                  <dd>{fmtH(plan.stats.revHours)}</dd>
                </div>
                <div className={`stats__item ${plan.stats.slack < 0 ? "is-warn" : ""}`}>
                  <dt>{plan.stats.slack < 0 ? "Short by" : "Spare time for practice"}</dt>
                  <dd>{fmtH(Math.abs(plan.stats.slack))}</dd>
                </div>
              </dl>
              {plan.warnings.map((w) => (
                <p key={w} className="study-error">
                  {w}
                </p>
              ))}
              {todayDay && (
                <div className="today-card">
                  <b>Today</b>
                  {todayDay.items.length ? (
                    <ul>
                      {todayDay.items.map((x, k) => (
                        <li key={k}>
                          <label className="tick">
                            <input type="checkbox" checked={!!done[itemKey(todayDay, k)]} onChange={() => toggle(itemKey(todayDay, k))} />
                            <span className={`tag tag--${x.type}`}>{TYPE_NAME[x.type]}</span> {x.topic ? (x.topic.subject ? `${x.topic.subject}: ${x.topic.name}` : x.topic.name) : "Full mock test or past paper"} · {fmtH(x.hours)}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Rest day. Enjoy it!</p>
                  )}
                </div>
              )}
              <div className="plan-progress">
                <div className="smeter">
                  <span style={{ width: `${allItems.length ? (doneCount / allItems.length) * 100 : 0}%` }} />
                </div>
                <span className="field__hint">
                  {doneCount} of {allItems.length} sessions done · ticks are saved in this browser
                </span>
              </div>
              <Tabs value={view} onChange={setView} tabs={[["list", "Day by day"], ["calendar", "Calendar"], ["topics", "By topic"]]} />
              {view === "list" && (
                <ol className="plan">
                  {plan.days.map((d) => (
                    <li key={d.date} className={`plan__day ${d.date === today ? "is-today" : ""} ${!d.items.length ? "is-off" : ""} ${plan.finalStart && d.date >= plan.finalStart ? "is-final" : ""}`}>
                      <div className="plan__date">
                        <b>{niceDate(d.date)}</b>
                        <span>{d.items.length ? fmtH(d.used) : d.cap ? "Free" : "Rest"}</span>
                      </div>
                      <ul>
                        {d.items.map((x, k) => (
                          <li key={k}>
                            <label className="tick">
                              <input type="checkbox" checked={!!done[itemKey(d, k)]} onChange={() => toggle(itemKey(d, k))} />
                              <span className={`tag tag--${x.type}`}>{TYPE_NAME[x.type]}</span>
                              <span className="tick__t">
                                {x.topic ? (x.topic.subject ? `${x.topic.subject}: ${x.topic.name}` : x.topic.name) : "Full mock test or past paper"}
                                {x.part ? " (part)" : ""}
                                {x.round ? ` · round ${x.round}` : ""}
                              </span>
                              <span className="tick__h">{fmtH(x.hours)}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
              {view === "calendar" && <Calendar plan={plan} today={today} done={done} itemKey={itemKey} />}
              {view === "topics" && (
                <div className="table-wrap" tabIndex={0}><table className="table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Learn</th>
                      <th>Revisions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics.map((t) => {
                      const sess = plan.days.flatMap((d) => d.items.filter((x) => x.topic?.id === t.id).map((x) => ({ ...x, date: d.date })));
                      const learn = sess.filter((x) => x.type === "learn");
                      const rev = sess.filter((x) => x.type !== "learn");
                      return (
                        <tr key={t.id}>
                          <td>
                            {t.subject ? `${t.subject}: ` : ""}
                            {t.name} <span className={`tag tag--${t.diff}`}>{t.diff}</span>
                          </td>
                          <td>{learn.length ? `${niceDate(learn[0].date, { day: "numeric", month: "short" })}${learn.length > 1 ? ` – ${niceDate(learn[learn.length - 1].date, { day: "numeric", month: "short" })}` : ""}` : "Not scheduled"}</td>
                          <td>{rev.map((x) => niceDate(x.date, { day: "numeric", month: "short" })).join(", ") || "–"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table></div>
              )}
              <div className="row-actions">
                <button type="button" className="btn btn--primary btn--sm" onClick={() => downloadBlob(new Blob([planToIcs(plan, "Revision plan")], { type: "text/calendar;charset=utf-8" }), "revision-plan.ics")}>
                  Add to Google / Apple Calendar (.ics)
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={print}>
                  Print checklist
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => downloadBlob(new Blob(["﻿" + csv()], { type: "text/csv;charset=utf-8" }), "revision-plan.csv")}>
                  Download CSV
                </button>
                <CopyButton text={asText} label="Copy as text" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Calendar({ plan, today, done, itemKey }) {
  const first = plan.days[0].date;
  const last = plan.days[plan.days.length - 1].date;
  const byDate = new Map(plan.days.map((d) => [d.date, d]));
  const months = [];
  let cur = first.slice(0, 7);
  while (cur <= last.slice(0, 7)) {
    months.push(cur);
    const [y, m] = cur.split("-").map(Number);
    cur = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  }
  return (
    <div className="cal">
      {months.map((mo) => {
        const [y, m] = mo.split("-").map(Number);
        const startWd = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
        const len = new Date(Date.UTC(y, m, 0)).getUTCDate();
        const cells = [...Array(startWd).fill(null), ...Array.from({ length: len }, (_, i) => `${mo}-${String(i + 1).padStart(2, "0")}`)];
        return (
          <section key={mo} className="cal__month">
            <h3 className="sumsec__h">{new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })}</h3>
            <div className="cal__grid">
              {WD.map((w) => (
                <span key={w} className="cal__wd">
                  {w}
                </span>
              ))}
              {cells.map((c, i) => {
                if (!c) return <span key={i} className="cal__cell is-empty" />;
                const d = byDate.get(c);
                const isExam = c === addDays(last, 1);
                const all = d ? d.items.length : 0;
                const fin = d ? d.items.filter((_, k) => done[itemKey(d, k)]).length : 0;
                return (
                  <span key={c} className={`cal__cell ${c === today ? "is-today" : ""} ${isExam ? "is-exam" : ""} ${d && plan.finalStart && c >= plan.finalStart ? "is-final" : ""}`} title={d ? d.items.map(itemLabel).join("\n") : isExam ? "Exam day" : ""}>
                    <b>{Number(c.slice(8))}</b>
                    {isExam && <em>Exam</em>}
                    {d && (
                      <span className="cal__dots">
                        {d.items.map((x, k) => (
                          <i key={k} className={`dot dot--${x.type} ${done[itemKey(d, k)] ? "is-done" : ""}`} />
                        ))}
                      </span>
                    )}
                    {all > 0 && fin === all && <span className="cal__ok">✓</span>}
                  </span>
                );
              })}
            </div>
          </section>
        );
      })}
      <p className="cal__legend">
        <i className="dot dot--learn" /> Learn <i className="dot dot--revise" /> Revise <i className="dot dot--mock" /> Mock test <i className="dot dot--final" /> Final revision
      </p>
    </div>
  );
}
