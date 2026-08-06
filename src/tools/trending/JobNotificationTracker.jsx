import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";


export default function JobNotificationTracker() {
  const [rows, setRows] = useState([
    { id: 1, title: "SSC CGL", board: "SSC", lastDate: "2026-08-15", status: "Open" },
    { id: 2, title: "IBPS PO", board: "IBPS", lastDate: "2026-09-01", status: "Upcoming" },
    { id: 3, title: "UPSC CSE Prelims", board: "UPSC", lastDate: "2026-05-20", status: "Closed" },
  ]);
  const [title, setTitle] = useState("");
  const [board, setBoard] = useState("");
  const [lastDate, setLastDate] = useState("");
  const add = () => {
    if (!title.trim()) return;
    setRows((r) => [{ id: Date.now(), title: title.trim(), board: board.trim() || "—", lastDate: lastDate || "—", status: "Open" }, ...r]);
    setTitle(""); setBoard(""); setLastDate("");
  };

  return (
    <>
      <Seo page="jobNotificationTracker" />
      <ToolHeroShell
        category="trending-tools"
        icon={Briefcase}
        title="Job Notification Tracker"
        subtitle="Organize exam and job alerts with board, last date, and status notes."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <div className="grid gap-3 sm:grid-cols-4">
          <input className={inputDark} placeholder="Exam / post" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className={inputDark} placeholder="Board" value={board} onChange={(e) => setBoard(e.target.value)} />
          <input className={inputDark} type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} />
          <button type="button" onClick={add} className="rounded-[14px] bg-[var(--ftp-ink)] px-4 py-3 text-sm font-semibold text-white">Add alert</button>
        </div>
        <ul className="mt-6 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3 text-sm">
              <div>
                <p className="font-semibold text-[var(--ftp-ink)]">{r.title}</p>
                <p className="text-[var(--ftp-ink-soft)]">{r.board} · Last date {r.lastDate}</p>
              </div>
              <span className="rounded-full bg-[var(--ftp-porcelain)] px-3 py-1 text-xs font-semibold">{r.status}</span>
            </li>
          ))}
        </ul>

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/job-notification-tracker" />
    </>
  );
}
