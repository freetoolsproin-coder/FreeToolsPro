import { useMemo, useState } from "react";
import { BUILDERS } from "../../tools/builders.js";
import { Field, CopyButton, DownloadButton, Checks } from "./ui.jsx";

export default function BuilderTool({ id }) {
  const cfg = BUILDERS[id];
  const [v, setV] = useState(() => Object.fromEntries(cfg.fields.map((f) => [f.id, f.def])));
  const out = useMemo(() => {
    try {
      return cfg.build(v);
    } catch {
      return { error: "Check the values you entered." };
    }
  }, [v, id]);
  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));

  return (
    <div className="builder">
      <form className="panel builder__fields" onSubmit={(e) => e.preventDefault()} aria-label="Settings">
        {cfg.fields.map((f) => (!f.show || f.show(v) ? <Field key={f.id} spec={f} value={v[f.id]} onChange={set(f.id)} /> : null))}
      </form>
      <div className="builder__out">
        {out.error && (
          <p className="msg msg--error" role="alert">
            {out.error}
          </p>
        )}
        {out.preview && <Preview p={out.preview} />}
        {out.stats && (
          <dl className="stats">
            {out.stats.map((s) => (
              <div key={s.label} className={`stats__item ${s.warn ? "is-warn" : ""}`}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {out.checks && <Checks items={out.checks} />}
        {out.outputs && (
          <ul className="outs outs--compact">
            {out.outputs.map((o) => (
              <li key={o.label} className="outs__item">
                <div className="outs__head">
                  <span className="outs__label">{o.label}</span>
                  <CopyButton text={o.value} />
                </div>
                <pre className="outs__value">{o.value}</pre>
              </li>
            ))}
          </ul>
        )}
        {out.code !== undefined && (
          <div className="out">
            <div className="io__bar">
              <span className="field__label">Code</span>
              <div className="io__tools">
                <CopyButton text={out.code} label="Copy code" />
                {out.download && <DownloadButton text={out.code} {...out.download} />}
              </div>
            </div>
            <pre className="code" data-lang={out.lang}>
              <code>{out.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function Preview({ p }) {
  if (p.type === "box")
    return (
      <div className={`stage ${p.light ? "stage--light" : ""}`}>
        <div className={`stage__box ${p.tall ? "stage__box--wide" : ""}`} style={p.style} />
      </div>
    );
  if (p.type === "glass")
    return (
      <div className="stage stage--glass">
        <span className="stage__blob stage__blob--1" />
        <span className="stage__blob stage__blob--2" />
        <span className="stage__blob stage__blob--3" />
        <div className="stage__glass" style={p.style}>
          <strong>Frosted panel</strong>
          <span>Text stays readable over a busy background.</span>
        </div>
      </div>
    );
  if (p.type === "color")
    return (
      <div className="swatch">
        <div className="swatch__main" style={{ background: p.hex, color: p.textOn }}>
          <span>Aa</span>
          <span>{p.hex.toUpperCase()}</span>
        </div>
        <ol className="swatch__shades" aria-label="Lighter to darker shades">
          {p.shades.map((s, i) => (
            <li key={i} style={{ background: s }} title={s}>
              <span className="visually-hidden">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  if (p.type === "serp") {
    let crumb = p.url;
    try {
      const u = new URL(p.url);
      crumb = `${u.hostname} › ${u.pathname.split("/").filter(Boolean).join(" › ")}`;
    } catch {}
    return (
      <figure className="serp" aria-label="Search result preview">
        <p className="serp__url">{crumb}</p>
        <p className="serp__title">{p.title.length > 60 ? p.title.slice(0, 58) + "…" : p.title}</p>
        <p className="serp__desc">{p.desc.length > 160 ? p.desc.slice(0, 157) + "…" : p.desc}</p>
        <figcaption className="muted">Approximate preview. Google may show a different title or snippet.</figcaption>
      </figure>
    );
  }
  if (p.type === "serp2")
    return (
      <div className="serp2-wrap">
        {p.items.map((it) => (
          <figure key={it.device} className={`serp2 serp2--${it.device}`} aria-label={`${it.device === "mobile" ? "Mobile" : "Desktop"} search result preview`}>
            {p.items.length > 1 && <figcaption className="serp2__dev">{it.device === "mobile" ? "Mobile" : "Desktop"}</figcaption>}
            <div className="serp2__site">
              <span className="serp2__fav" aria-hidden="true">
                {(it.site || "?").trim().charAt(0).toUpperCase()}
              </span>
              <span className="serp2__src">
                <span className="serp2__name">{it.site}</span>
                <span className="serp2__crumb">
                  {it.origin}
                  {it.crumb}
                </span>
              </span>
            </div>
            <p className="serp2__title">{it.title}</p>
            {it.rating > 0 && (
              <p className="serp2__rich">
                <span className="serp2__stars" style={{ "--r": it.rating }} aria-hidden="true">
                  ★★★★★
                </span>{" "}
                Rating: {it.rating.toFixed(1)}
                {it.reviews ? ` · ${it.reviews} reviews` : ""}
              </p>
            )}
            {it.price && <p className="serp2__rich">{it.price} · In stock</p>}
            <p className="serp2__desc">
              {it.date && <span className="serp2__date">{it.date} — </span>}
              {it.desc}
            </p>
            {it.faq && (
              <ul className="serp2__faq">
                <li>How is EMI calculated?</li>
                <li>Can I prepay my loan?</li>
              </ul>
            )}
          </figure>
        ))}
        <p className="hint">Approximate preview. Google may rewrite titles and choose its own snippet text.</p>
      </div>
    );
  if (p.type === "share")
    return (
      <figure className="share" aria-label="Link preview">
        {p.image ? <img src={p.image} alt="" loading="lazy" className="share__img" onError={(e) => (e.currentTarget.style.visibility = "hidden")} /> : <div className="share__img" />}
        <div className="share__body">
          <p className="share__host">{p.host}</p>
          <p className="share__title">{p.title}</p>
          <p className="share__desc">{p.desc}</p>
        </div>
      </figure>
    );
  return null;
}
