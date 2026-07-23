import { useMemo, useState } from "react";
import { GraduationCap, Plus, Trash2, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const GRADE_SCALE = [
  { label: "A+", value: 4.0 },
  { label: "A", value: 4.0 },
  { label: "A-", value: 3.7 },
  { label: "B+", value: 3.3 },
  { label: "B", value: 3.0 },
  { label: "B-", value: 2.7 },
  { label: "C+", value: 2.3 },
  { label: "C", value: 2.0 },
  { label: "C-", value: 1.7 },
  { label: "D+", value: 1.3 },
  { label: "D", value: 1.0 },
  { label: "D-", value: 0.7 },
  { label: "F", value: 0.0 },
];

const emptyCourse = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  name: "",
  credits: 3,
  grade: "A",
});

const panel =
  "rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-5 sm:p-6";

export default function GpaCalculator() {
  const [courses, setCourses] = useState([emptyCourse()]);

  const gpaStats = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const credits = parseFloat(course.credits);
      if (!credits || credits <= 0) return;

      const gradeEntry = GRADE_SCALE.find((g) => g.label === course.grade);
      const points = gradeEntry ? gradeEntry.value : 0;

      totalPoints += points * credits;
      totalCredits += credits;
    });

    if (totalCredits === 0) return null;

    return {
      gpa: totalPoints / totalCredits,
      totalCredits,
      courseCount: courses.filter((c) => parseFloat(c.credits) > 0).length,
    };
  }, [courses]);

  const updateCourse = (id, field, value) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, [field]: value } : course))
    );
  };

  const removeCourse = (id) => {
    setCourses((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.id !== id)));
  };

  const resetCourses = () => setCourses([emptyCourse()]);

  return (
    <>
      <Seo page="gpaCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={GraduationCap}
        title="GPA Calculator"
        subtitle="Add courses with credits and letter grades to compute your cumulative GPA on a 4.0 scale."
        formLabel="Course list"
        formHint="GPA updates as you edit rows"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className={panel}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[var(--ftp-ink)]">Your courses</h2>
              <button
                type="button"
                onClick={resetCourses}
                className="age-btn-ghost px-3 py-2 text-xs"
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="grid gap-2 rounded-2xl border border-[var(--ftp-line)] bg-white p-3 sm:grid-cols-[1fr_80px_100px_36px]"
                >
                  <div>
                    <label
                      className="mb-1 block text-xs font-medium text-[var(--ftp-ink-soft)]"
                      htmlFor={`course-name-${course.id}`}
                    >
                      Course {index + 1}
                    </label>
                    <input
                      id={`course-name-${course.id}`}
                      className={`${inputDark} mt-0`}
                      placeholder="Course name"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1 block text-xs font-medium text-[var(--ftp-ink-soft)]"
                      htmlFor={`course-credits-${course.id}`}
                    >
                      Credits
                    </label>
                    <input
                      id={`course-credits-${course.id}`}
                      type="number"
                      min="0"
                      step="0.5"
                      className={`${inputDark} mt-0`}
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1 block text-xs font-medium text-[var(--ftp-ink-soft)]"
                      htmlFor={`course-grade-${course.id}`}
                    >
                      Grade
                    </label>
                    <select
                      id={`course-grade-${course.id}`}
                      className={`${selectDark} mt-0`}
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                    >
                      {GRADE_SCALE.map((g) => (
                        <option key={g.label} value={g.label}>
                          {g.label} ({g.value.toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    className="flex h-10 items-center justify-center self-end rounded-xl text-[var(--ftp-ink-soft)] transition hover:bg-[var(--ftp-porcelain)] hover:text-[var(--ftp-ink)]"
                    aria-label="Remove course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCourses((prev) => [...prev, emptyCourse()])}
              className="age-btn-ghost mt-4 w-full text-sm sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Add course
            </button>
          </div>

          <div className={`${panel} lg:sticky lg:top-24`}>
            <h2 className="mb-5 text-lg font-bold text-[var(--ftp-ink)]">GPA result</h2>

            {gpaStats ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-[var(--ftp-line)] bg-white p-6 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[var(--ftp-teal)]">
                    Cumulative GPA
                  </span>
                  <span className="text-4xl font-black tracking-tight text-[var(--ftp-ink)]">
                    {gpaStats.gpa.toFixed(2)}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-[var(--ftp-ink-soft)]">
                    Out of 4.00 scale
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
                    <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wider text-[var(--ftp-ink-soft)]">
                      Total credits
                    </span>
                    <strong className="text-base font-bold text-[var(--ftp-ink)]">
                      {gpaStats.totalCredits}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
                    <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wider text-[var(--ftp-ink-soft)]">
                      Courses counted
                    </span>
                    <strong className="text-base font-bold text-[var(--ftp-ink)]">
                      {gpaStats.courseCount}
                    </strong>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-[var(--ftp-ink-soft)]">
                  Weighted average: sum of (grade points x credits) divided by total credits.
                  Courses with zero credits are ignored.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--ftp-line)] bg-white">
                  <GraduationCap size={28} className="text-[var(--ftp-teal)]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[var(--ftp-ink)]">Add course credits</h3>
                <p className="max-w-xs text-sm leading-relaxed text-[var(--ftp-ink-soft)]">
                  Enter at least one course with credits greater than zero to see your GPA.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="calculators"
        currentToolPath="/calculators/gpa-calculator"
      />
    </>
  );
}
