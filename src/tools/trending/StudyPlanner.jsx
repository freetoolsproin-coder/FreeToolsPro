import { useMemo, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function emptySession() {
  return {
    id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
    subject: "",
    day: "Monday",
    hours: 1,
  };
}

function daysUntilExam(examDate) {
  if (!examDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate + "T00:00:00");
  const diff = exam.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function StudyPlanner() {
  const [sessions, setSessions] = useState([emptySession()]);
  const [examDate, setExamDate] = useState("");

  const addSession = () => {
    setSessions((prev) => [...prev, emptySession()]);
  };

  const removeSession = (id) => {
    setSessions((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)));
  };

  const updateSession = (id, field, value) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const weeklyBySubject = useMemo(() => {
    const map = {};
    for (const s of sessions) {
      const subject = s.subject.trim() || "Unnamed subject";
      const hrs = Number(s.hours) || 0;
      map[subject] = (map[subject] || 0) + hrs;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [sessions]);

  const totalWeeklyHours = useMemo(
    () => weeklyBySubject.reduce((sum, [, hrs]) => sum + hrs, 0),
    [weeklyBySubject]
  );

  const daysLeft = daysUntilExam(examDate);

  const dailyByDay = useMemo(() => {
    const map = Object.fromEntries(DAYS.map((d) => [d, 0]));
    for (const s of sessions) {
      const hrs = Number(s.hours) || 0;
      if (map[s.day] !== undefined) map[s.day] += hrs;
    }
    return DAYS.map((day) => ({ day, hours: map[day] }));
  }, [sessions]);

  return (
    <>
      <Seo page="studyPlanner" />

      <ToolHeroShell
        category="trending-tools"
        icon={BookOpen}
        title="Study Planner"
        subtitle="Plan weekly study sessions by subject and track hours toward an exam."
        formLabel="Plan sessions"
        layout="stack"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <div>
              <label className={labelClass} htmlFor="sp-exam">
                Exam date (optional)
              </label>
              <input
                id="sp-exam"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className={inputDark}
              />
              {daysLeft !== null && examDate && (
                <p className="mt-1.5 text-xs text-[var(--ftp-ink-soft)]">
                  {daysLeft >= 0
                    ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} until exam`
                    : "Exam date is in the past"}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--ftp-ink)]">Study sessions</h2>
                <button type="button" onClick={addSession} className="age-btn-ghost px-3 py-2 text-sm">
                  <Plus className="h-4 w-4" />
                  Add session
                </button>
              </div>

              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-teal)]">
                      Session {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSession(session.id)}
                      disabled={sessions.length <= 1}
                      className="rounded-lg p-1.5 text-[var(--ftp-ink-soft)] transition hover:bg-[var(--ftp-porcelain)] hover:text-[var(--ftp-ink)] disabled:opacity-40"
                      aria-label="Remove session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className={labelClass} htmlFor={`subject-${session.id}`}>
                        Subject
                      </label>
                      <input
                        id={`subject-${session.id}`}
                        type="text"
                        value={session.subject}
                        onChange={(e) => updateSession(session.id, "subject", e.target.value)}
                        placeholder="Math"
                        className={inputDark}
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor={`day-${session.id}`}>
                        Day
                      </label>
                      <select
                        id={`day-${session.id}`}
                        value={session.day}
                        onChange={(e) => updateSession(session.id, "day", e.target.value)}
                        className={selectDark}
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor={`hours-${session.id}`}>
                        Hours
                      </label>
                      <input
                        id={`hours-${session.id}`}
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={session.hours}
                        onChange={(e) =>
                          updateSession(session.id, "hours", parseFloat(e.target.value) || 0)
                        }
                        className={inputDark}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
              <h2 className="mb-4 text-sm font-semibold text-[var(--ftp-ink)]">
                Weekly summary by subject
              </h2>
              {weeklyBySubject.length > 0 ? (
                <div className="space-y-2">
                  {weeklyBySubject.map(([subject, hours]) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3"
                    >
                      <span className="text-sm font-medium text-[var(--ftp-ink)]">{subject}</span>
                      <span className="text-sm font-semibold text-[var(--ftp-teal)]">
                        {hours} hr{hours === 1 ? "" : "s"}
                      </span>
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--ftp-line)] pt-3">
                    <span className="text-sm font-semibold text-[var(--ftp-ink)]">Total weekly</span>
                    <span className="text-base font-bold text-[var(--ftp-ink)]">
                      {totalWeeklyHours} hr{totalWeeklyHours === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--ftp-ink-soft)]">Add sessions to see totals.</p>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
              <h2 className="mb-4 text-sm font-semibold text-[var(--ftp-ink)]">Hours by day</h2>
              <div className="space-y-2">
                {dailyByDay.map(({ day, hours }) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs font-medium text-[var(--ftp-ink-soft)]">
                      {day.slice(0, 3)}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--ftp-line)]">
                      <div
                        className="h-full rounded-full bg-[var(--ftp-teal)] transition-all"
                        style={{
                          width: totalWeeklyHours
                            ? `${Math.min(100, (hours / totalWeeklyHours) * 100)}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-[var(--ftp-ink)]">
                      {hours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/study-planner"
      />
    </>
  );
}
