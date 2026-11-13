import { useEffect, useMemo, useState } from "react";
import { makeQuiz, answerMatches } from "../../../tools/study.js";
import { CopyButton, DownloadButton } from "../ui.jsx";
import { useNotes, NotesInput, Seg, Toggle, NumberBox, SendTo, printHtml, esc, safeGet, safeSet } from "./common.jsx";

const TYPE_LABEL = { mcq: "Multiple choice", tf: "True or false", fill: "Fill in the blank" };
const BEST_KEY = "ftp-quiz-best";

function verdict(p) {
  if (p >= 90) return "Excellent! You know this well.";
  if (p >= 75) return "Good work. Review the few you missed.";
  if (p >= 50) return "Getting there. Retry the wrong ones, then take a fresh quiz.";
  return "Keep going. Re-read your notes, then retry the wrong ones.";
}

export default function QuizGenerator() {
  const N = useNotes();
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState({ mcq: true, tf: true, fill: true });
  const [difficulty, setDifficulty] = useState("mixed");
  const [mode, setMode] = useState("practice");
  const [timed, setTimed] = useState(false);
  const [seed, setSeed] = useState(7);
  const [only, setOnly] = useState(null); // ids to retry
  const [answers, setAnswers] = useState({});
  const [pos, setPos] = useState(0);
  const [finished, setFinished] = useState(false);
  const [left, setLeft] = useState(null);
  const [best, setBest] = useState(null);

  const typeList = Object.keys(types).filter((k) => types[k]);
  const quiz = useMemo(() => makeQuiz(N.notes, { count: Math.max(3, Math.min(40, Number(count) || 10)), types: typeList.length ? typeList : ["mcq"], seed, difficulty }), [N.notes, count, types, seed, difficulty]);
  const qs = only ? quiz.questions.filter((q) => only.includes(q.id)) : quiz.questions;
  const sig = quiz.questions.map((q) => q.answer).join("|").slice(0, 120);

  const restart = (keepOnly = null) => {
    setAnswers({});
    setPos(0);
    setFinished(false);
    setOnly(keepOnly);
    setLeft(timed ? (keepOnly ? keepOnly.length : quiz.questions.length) * 45 : null);
  };
  useEffect(() => restart(), [sig, timed, mode]);
  useEffect(() => setBest(safeGet(BEST_KEY, {})[sig] ?? null), [sig]);
  useEffect(() => {
    if (left === null || finished) return;
    if (left <= 0) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, finished]);

  const isRight = (q) => (q.type === "fill" ? answerMatches(answers[q.id] || "", q.answer) : answers[q.id] === q.answer);
  const answered = qs.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length;
  const score = qs.filter(isRight).length;
  const pct = qs.length ? Math.round((score / qs.length) * 100) : 0;
  const finish = () => {
    setFinished(true);
    if (!only) {
      const all = safeGet(BEST_KEY, {});
      if (!(all[sig] >= pct)) {
        all[sig] = pct;
        safeSet(BEST_KEY, all);
        setBest(pct);
      }
    }
  };
  useEffect(() => {
    const onKey = (e) => {
      if (finished || /input|textarea|select/i.test(e.target.tagName)) return;
      const q = qs[pos];
      if (!q || !q.options) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length && (mode === "exam" || answers[q.id] === undefined)) setAnswers((a) => ({ ...a, [q.id]: q.options[n - 1] }));
      if (e.key === "Enter" || e.key === "ArrowRight") setPos((p) => Math.min(qs.length - 1, p + 1));
      if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const asText = (withKey = true) =>
    quiz.questions
      .map((q, i) => `${i + 1}. ${q.prompt}${q.options ? "\n" + q.options.map((o, k) => `   ${"ABCD"[k]}) ${o}`).join("\n") : "\n   Answer: ____________"}`)
      .join("\n\n") + (withKey ? "\n\nANSWER KEY\n" + quiz.questions.map((q, i) => `${i + 1}. ${q.options ? "ABCD"[q.options.indexOf(q.answer)] + ") " : ""}${q.answer}`).join("\n") : "");
  const print = () =>
    printHtml(
      "Quiz",
      `<h1>Quiz</h1><p class="muted">Name: ______________________ &nbsp; Date: __________ &nbsp; Score: ____ / ${quiz.questions.length}</p><ol>${quiz.questions
        .map((q) => `<li>${esc(q.prompt)}${q.options ? `<ol class="opts">${q.options.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>` : "<br>Answer: ______________________"}</li>`)
        .join("")}</ol><div class="ans"><h2>Answer key</h2><ol>${quiz.questions.map((q) => `<li>${q.options ? "ABCD"[q.options.indexOf(q.answer)] + ") " : ""}${esc(q.answer)}</li>`).join("")}</ol></div>`
    );

  const q = qs[pos];
  const showFeedback = (qq) => mode === "practice" && answers[qq.id] !== undefined && (qq.type !== "fill" || answers[qq.id + "_done"]);
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="study">
      <div className="io io--split">
        <div className="io__pane">
          <NotesInput id="qz" {...N} rows={10} hint="Questions are written only from what is in your notes, so every answer can be checked against them." />
          <div className="study-opts">
            <NumberBox id="qz-n" label="Questions" value={count} min={3} max={40} onChange={setCount} />
            <Seg label="Difficulty" value={difficulty} onChange={setDifficulty} options={[["easy", "Easy"], ["mixed", "Mixed"], ["hard", "Hard"]]} />
            <div className="field">
              <span className="field__label">Question types</span>
              <div className="study-checks">
                {Object.entries(TYPE_LABEL).map(([k, l]) => (
                  <Toggle key={k} label={l} checked={types[k]} onChange={(v) => setTypes({ ...types, [k]: v })} />
                ))}
              </div>
            </div>
            <Seg label="Mode" value={mode} onChange={setMode} options={[["practice", "Practice (instant feedback)"], ["exam", "Exam (marks at the end)"]]} />
            <Toggle label="Timer (45 seconds per question)" checked={timed} onChange={setTimed} />
          </div>
        </div>
        <div className="io__pane">
          {quiz.error || !qs.length ? (
            <p className="study-empty">{quiz.error || "Not enough material for these question types. Add more notes or turn on more types."}</p>
          ) : !finished ? (
            <div className="quiz">
              <div className="quiz__bar">
                <span>
                  Question {pos + 1} of {qs.length}
                  {only ? " (retry)" : ""}
                </span>
                {left !== null && <span className={`quiz__timer ${left < 30 ? "is-low" : ""}`}>⏱ {mmss(Math.max(0, left))}</span>}
                {best !== null && !only && <span className="quiz__best">Best: {best}%</span>}
              </div>
              <div className="quiz__progress" aria-hidden="true">
                <span style={{ width: `${(answered / qs.length) * 100}%` }} />
              </div>
              <Question q={q} n={pos + 1} value={answers[q.id]} done={answers[q.id + "_done"]} feedback={showFeedback(q)} right={isRight(q)} locked={mode === "practice" && q.type !== "fill" && answers[q.id] !== undefined} onAnswer={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} onCheck={() => setAnswers((a) => ({ ...a, [q.id + "_done"]: true }))} />
              <div className="quiz__nav">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setPos((p) => Math.max(0, p - 1))} disabled={pos === 0}>
                  ← Back
                </button>
                <div className="quiz__dots" aria-label="Jump to question">
                  {qs.map((x, i) => (
                    <button key={x.id} type="button" aria-label={`Question ${i + 1}`} aria-current={i === pos} className={`quiz__dot ${answers[x.id] !== undefined && answers[x.id] !== "" ? (mode === "practice" && showFeedback(x) ? (isRight(x) ? "is-right" : "is-wrong") : "is-done") : ""}`} onClick={() => setPos(i)} />
                  ))}
                </div>
                {pos < qs.length - 1 ? (
                  <button type="button" className="btn btn--primary btn--sm" onClick={() => setPos((p) => p + 1)}>
                    Next →
                  </button>
                ) : (
                  <button type="button" className="btn btn--primary btn--sm" onClick={finish}>
                    Finish & see score
                  </button>
                )}
              </div>
              <p className="field__hint kbd-hint">Keys: 1–4 choose · Enter or → next · ← back</p>
            </div>
          ) : (
            <div className="quiz quiz--result">
              <div className="score">
                <div className="score__ring" style={{ "--p": pct }}>
                  <b>{pct}%</b>
                </div>
                <div>
                  <p className="score__big">
                    {score} / {qs.length} correct
                  </p>
                  <p>{verdict(pct)}</p>
                  {left !== null && left <= 0 && <p className="field__hint">Time ran out; unanswered questions count as wrong.</p>}
                </div>
              </div>
              <div className="row-actions">
                {score < qs.length && (
                  <button type="button" className="btn btn--primary btn--sm" onClick={() => restart(qs.filter((x) => !isRight(x)).map((x) => x.id))}>
                    Retry the {qs.length - score} wrong
                  </button>
                )}
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => restart()}>
                  Retake
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSeed((s) => s + 1)}>
                  New questions
                </button>
              </div>
              <ol className="review">
                {qs.map((x) => (
                  <li key={x.id} className={isRight(x) ? "is-right" : "is-wrong"}>
                    <p className="review__q">{x.prompt}</p>
                    <p>
                      {isRight(x) ? "✓ " : "✗ "}
                      Your answer: <b>{answers[x.id] || "(none)"}</b>
                      {!isRight(x) && (
                        <>
                          {" "}
                          · Correct: <b>{x.answer}</b>
                        </>
                      )}
                    </p>
                    {!isRight(x) && <p className="review__why">{x.explain}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {!quiz.error && qs.length > 0 && (
            <div className="row-actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={print}>
                Print worksheet + answer key
              </button>
              <CopyButton text={() => asText(true)} label="Copy quiz" />
              <DownloadButton text={() => asText(true)} name="quiz.txt" label="Download .txt" />
            </div>
          )}
        </div>
      </div>
      <SendTo text={N.notes} current="quiz-generator" />
    </div>
  );
}

function Question({ q, n, value, done, feedback, right, locked, onAnswer, onCheck }) {
  return (
    <fieldset className="qcard">
      <legend className="qcard__type">{TYPE_LABEL[q.type]}</legend>
      <p className="qcard__prompt">{q.prompt}</p>
      {q.options ? (
        <div className={`qopts ${q.type === "tf" ? "qopts--tf" : ""}`}>
          {q.options.map((o, k) => {
            const chosen = value === o;
            const cls = feedback ? (o === q.answer ? "is-right" : chosen ? "is-wrong" : "") : chosen ? "is-chosen" : "";
            return (
              <button key={o} type="button" className={`qopt ${cls}`} aria-pressed={chosen} disabled={locked && !chosen && o !== q.answer} onClick={() => !locked && onAnswer(o)}>
                <span className="qopt__k">{q.type === "tf" ? "" : "ABCD"[k]}</span>
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="line-in">
          <input className="input" value={value || ""} onChange={(e) => onAnswer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onCheck()} placeholder="Type your answer" aria-label={`Answer to question ${n}`} disabled={done && feedback} />
          {!done && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={onCheck} disabled={!value}>
              Check
            </button>
          )}
        </div>
      )}
      {feedback && (
        <div className={`qfeed ${right ? "is-right" : "is-wrong"}`} role="status">
          <b>{right ? "Correct!" : `Not quite. Answer: ${q.answer}`}</b>
          <p>{q.explain}</p>
        </div>
      )}
    </fieldset>
  );
}
