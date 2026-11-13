import { useEffect, useRef, useState } from "react";
import { Field, downloadBlob } from "./ui.jsx";

const KINDS = [
  ["url", "Link"],
  ["upi", "UPI payment"],
  ["wifi", "Wi-Fi"],
  ["text", "Text"],
  ["phone", "Phone"],
];

const wifiEsc = (s) => s.replace(/([\\;,:"])/g, "\\$1");

function payload(k, d) {
  if (k === "url") return d.url.trim();
  if (k === "text") return d.text;
  if (k === "phone") return d.phone.trim() ? `tel:${d.phone.replace(/[^\d+]/g, "")}` : "";
  if (k === "wifi") return d.ssid ? `WIFI:T:${d.sec};S:${wifiEsc(d.ssid)};P:${d.sec === "nopass" ? "" : wifiEsc(d.pass)};${d.hidden ? "H:true;" : ""};` : "";
  if (k === "upi") {
    if (!d.vpa.trim()) return "";
    const q = new URLSearchParams({ pa: d.vpa.trim(), pn: d.payee.trim() || d.vpa.trim(), cu: "INR" });
    if (Number(d.amount) > 0) q.set("am", Number(d.amount).toFixed(2));
    if (d.note.trim()) q.set("tn", d.note.trim());
    return `upi://pay?${q.toString().replace(/\+/g, "%20")}`;
  }
  return "";
}

export default function QrTool() {
  const [kind, setKind] = useState("url");
  const [d, setD] = useState({ url: "https://freetoolspro.in", text: "", phone: "", ssid: "", pass: "", sec: "WPA", hidden: false, vpa: "", payee: "", amount: "", note: "" });
  const [style, setStyle] = useState({ fg: "#13203b", bg: "#ffffff", ecc: "M", size: 512 });
  const [err, setErr] = useState("");
  const canvas = useRef(null);
  const data = payload(kind, d);
  const set = (k) => (v) => setD((p) => ({ ...p, [k]: v }));
  const setS = (k) => (v) => setStyle((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    let live = true;
    (async () => {
      if (!data) {
        const c = canvas.current;
        c.getContext("2d").clearRect(0, 0, c.width, c.height);
        return;
      }
      try {
        const m = await import("qrcode");
        const QR = m.default && m.default.toCanvas ? m.default : m;
        await QR.toCanvas(canvas.current, data, { width: style.size, margin: 2, errorCorrectionLevel: style.ecc, color: { dark: style.fg, light: style.bg } });
        if (live) setErr("");
      } catch (e) {
        if (live) setErr(/too big|amount of data/i.test(e.message) ? "Too much content for a QR code. Shorten it or lower the error correction." : e.message);
      }
    })();
    return () => {
      live = false;
    };
  }, [data, style]);

  async function svg() {
    const m = await import("qrcode");
    const QR = m.default && m.default.toCanvas ? m.default : m;
    const s = await QR.toString(data, { type: "svg", margin: 2, errorCorrectionLevel: style.ecc, color: { dark: style.fg, light: style.bg } });
    downloadBlob(new Blob([s], { type: "image/svg+xml" }), "qr-code.svg");
  }

  return (
    <div className="builder">
      <form className="panel builder__fields" onSubmit={(e) => e.preventDefault()} aria-label="QR content">
        <Field spec={{ id: "k", label: "QR code for", type: "select", options: KINDS }} value={kind} onChange={setKind} />
        {kind === "url" && <Field spec={{ type: "text", label: "Website address", placeholder: "https://" }} value={d.url} onChange={set("url")} />}
        {kind === "text" && <Field spec={{ type: "textarea", label: "Text", rows: 4 }} value={d.text} onChange={set("text")} />}
        {kind === "phone" && <Field spec={{ type: "text", label: "Phone number", placeholder: "+91 98xxxxxxx" }} value={d.phone} onChange={set("phone")} />}
        {kind === "wifi" && (
          <>
            <Field spec={{ type: "text", label: "Network name (SSID)" }} value={d.ssid} onChange={set("ssid")} />
            <Field spec={{ type: "select", label: "Security", options: [["WPA", "WPA/WPA2/WPA3"], ["WEP", "WEP"], ["nopass", "None"]] }} value={d.sec} onChange={set("sec")} />
            {d.sec !== "nopass" && <Field spec={{ type: "text", label: "Password" }} value={d.pass} onChange={set("pass")} />}
            <Field spec={{ type: "toggle", label: "Hidden network" }} value={d.hidden} onChange={set("hidden")} />
          </>
        )}
        {kind === "upi" && (
          <>
            <Field spec={{ type: "text", label: "UPI ID", placeholder: "name@okbank" }} value={d.vpa} onChange={set("vpa")} />
            <Field spec={{ type: "text", label: "Payee name" }} value={d.payee} onChange={set("payee")} />
            <Field spec={{ type: "text", label: "Amount in ₹ (optional)" }} value={d.amount} onChange={set("amount")} />
            <Field spec={{ type: "text", label: "Note (optional)" }} value={d.note} onChange={set("note")} />
          </>
        )}
        <div className="field-row">
          <Field spec={{ type: "color", label: "Foreground" }} value={style.fg} onChange={setS("fg")} />
          <Field spec={{ type: "color", label: "Background" }} value={style.bg} onChange={setS("bg")} />
        </div>
        <Field
          spec={{ type: "select", label: "Error correction", options: [["L", "Low (7%)"], ["M", "Medium (15%)"], ["Q", "Quartile (25%)"], ["H", "High (30%) for printed codes"]] }}
          value={style.ecc}
          onChange={setS("ecc")}
        />
      </form>
      <div className="builder__out">
        <div className="qr">
          <canvas ref={canvas} className="qr__canvas" width="512" height="512" aria-label="QR code preview" role="img" />
          {!data && <p className="muted">Fill in the details to create the code.</p>}
          {err && (
            <p className="msg msg--error" role="alert">
              {err}
            </p>
          )}
        </div>
        <div className="row-actions">
          <button type="button" className="btn btn--primary" disabled={!data || !!err} onClick={() => canvas.current.toBlob((b) => downloadBlob(b, "qr-code.png"))}>
            Download PNG
          </button>
          <button type="button" className="btn btn--ghost" disabled={!data || !!err} onClick={svg}>
            Download SVG
          </button>
        </div>
        {data && <p className="muted qr__payload">Encoded: {data.length > 140 ? data.slice(0, 140) + "…" : data}</p>}
      </div>
    </div>
  );
}
