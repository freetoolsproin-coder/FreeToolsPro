export function optionSelect({ id, label, value, onChange, children }) {
  return (
    <label className="block text-sm text-[var(--ftp-ink)]">
      <span className="mb-1 block font-medium text-[var(--ftp-ink-soft)]">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="age-input min-w-[10rem] py-2"
      >
        {children}
      </select>
    </label>
  );
}

export function optionNumber({ id, label, value, onChange, min = 1, max = 200 }) {
  return (
    <label className="block text-sm text-[var(--ftp-ink)]">
      <span className="mb-1 block font-medium text-[var(--ftp-ink-soft)]">{label}</span>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || min)}
        className="age-input w-28 py-2"
      />
    </label>
  );
}

export function optionCheckbox({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-[var(--ftp-ink)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-black/20"
      />
      {label}
    </label>
  );
}
