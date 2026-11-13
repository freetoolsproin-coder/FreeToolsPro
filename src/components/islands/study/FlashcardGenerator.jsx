import { useEffect, useMemo, useRef, useState } from "react";
import { makeFlashcards, parseCardList, nextBox, BOX_DAYS, isoDay } from "../../../tools/study.js";
import { mulberry32 } from "../../../tools/textlib.js";
import { CopyButton, DownloadButton } from "../ui.jsx";
import { useNotes, NotesInput, Tabs, Toggle, NumberBox, SendTo, printHtml, esc, safeGet, safeSet, packHash, unpackHash } from "./common.jsx";

const PROGRESS_KEY = "ftp-flashcard-progress";
const DECK_KEY = "ftp-flashcard-deck";
const keyOf = (c) => (c.front + "\u0001" + c.back).toLowerCase().slice(0, 200);
const today = () => isoDay(Date.now() - new Date().getTimezoneOffset() * 60000);
const BOX_NAMES = ["", "New / again", "Learning", "Getting there", "Almost", "Known"];

function shuffled(arr, seed) {
  const r = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardGenerator() {
  const N = useNotes();
  const [opt, setOpt] = useState({ defs: true, cloze: true, max: 25 });
  const gen = useMemo(() => makeFlashcards(N.notes, { defs: opt.defs, cloze: opt.cloze, max: Number(opt.max) || 25 }), [N.notes, opt]);
  const [deck, setDeck] = useState(null); // null = follow generated cards
  const [title, setTitle] = useState("My flashcards");
  const [tab, setTab] = useState("cards");
  const [progress, setProgress] = useState({});
  const [shareUrl, setShareUrl] = useState("");
  const cards = deck || gen.cards;

  // Restore saved progress and an edited deck; import a shared deck from the URL hash.
  useEffect(() => {
    setProgress(safeGet(PROGRESS_KEY, {}));
    const h = location.hash.match(/^#d=(.+)$/);
    if (h) {
      unpackHash(h[1])
        .then((d) => {
          if (Array.isArray(d.c)) {
            setDeck(d.c.map(([front, back], i) => ({ id: `s${i}`, front, back, kind: "shared" })));
            setTitle(d.t || "Shared flashcards");
            setTab("study");
          }
        })
        .catch(() => {});
    } else {
      const saved = safeGet(DECK_KEY, null);
      if (saved && Array.isArray(saved.cards) && saved.cards.length && new URLSearchParams(location.search).get("notes") !== "1") {
        setDeck(saved.cards);
        setTitle(saved.title || "My flashcards");
      }
    }
  }, []);
  useEffect(() => {
    if (deck) safeSet(DECK_KEY, { cards: deck, title });
  }, [deck, title]);

  const edit = (fn) => setDeck((d) => fn([...(d || gen.cards)]));
  const grade = (card, g) => {
    setProgress((p) => {
      const k = keyOf(card);
      const box = nextBox(p[k]?.box || 1, g);
      const due = isoDay(Date.parse(today()) + BOX_DAYS[box] * 86400000);
      const next = { ...p, [k]: { box, due } };
      safeSet(PROGRESS_KEY, next);
      return next;
    });
  };
  const boxOf = (c) => progress[keyOf(c)]?.box || 0;
  const counts = [0, 0, 0, 0, 0, 0];
  cards.forEach((c) => counts[boxOf(c)]++);
  const known = counts[4] + counts[5];

  const tsv = () => cards.map((c) => `${c.front.replace(/\t|\n/g, " ")}\t${c.back.replace(/\t|\n/g, " ")}`).join("\n");
  const csv = () => "Front,Back\n" + cards.map((c) => [c.front, c.back].map((x) => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
  const print = () =>
    printHtml(
      title,
      `<h1>${esc(title)}</h1><p class="muted">${cards.length} cards · cut along the dashed lines and fold down the middle</p><div class="cards">${cards
        .map((c) => `<div><b>${esc(c.front)}</b></div><div class="b">${esc(c.back)}</div>`)
        .join("")}</div>`
    );
  const share = async () => {
    const h = await packHash({ t: title, c: cards.map((c) => [c.front, c.back]) });
    const url = `${location.origin}${location.pathname}#d=${h}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <div className="study">
      <div className="io io--split">
        <div className="io__pane">
          <NotesInput id="fc" {...N} setNotes={(v) => { N.setNotes(v); setDeck(null); }} rows={10} hint="Definitions (“Term: meaning”, “X is the…”), Q:/A: pairs and key sentences become cards." />
          <div className="study-opts">
            <Toggle label="Term → definition cards" checked={opt.defs} onChange={(v) => setOpt({ ...opt, defs: v })} />
            <Toggle label="Fill-in-the-blank cards" checked={opt.cloze} onChange={(v) => setOpt({ ...opt, cloze: v })} />
            <NumberBox id="fc-max" label="Maximum cards" value={opt.max} min={5} max={100} step={5} onChange={(v) => setOpt({ ...opt, max: v })} />
          </div>
          {deck && (
            <p className="study-banner">
              You are using an edited deck.{" "}
              <button type="button" className="linkbtn" onClick={() => setDeck(null)}>
                Rebuild from notes
              </button>
            </p>
          )}
        </div>
        <div className="io__pane">
          <div className="deckhead">
            <input className="input deckhead__title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Deck name" />
            <div className="deckhead__meter" title={`${known} of ${cards.length} known`}>
              <span style={{ width: `${cards.length ? (known / cards.length) * 100 : 0}%` }} />
            </div>
            <p className="field__hint">
              {cards.length} cards · {known} known · {counts[0]} not studied yet
            </p>
          </div>
          <Tabs value={tab} onChange={setTab} tabs={[["cards", "Cards", cards.length], ["study", "Study"], ["export", "Export & share"]]} />
          {tab === "cards" && <CardEditor cards={cards} edit={edit} boxOf={boxOf} />}
          {tab === "study" && <StudyMode cards={cards} boxOf={boxOf} progress={progress} grade={grade} reset={() => { setProgress({}); safeSet(PROGRESS_KEY, {}); }} />}
          {tab === "export" && (
            <div className="study-out">
              <p>Import into Anki or Quizlet: copy the tab-separated list and paste it into Quizlet's “Import”, or save the file and use Anki's File → Import.</p>
              <div className="row-actions">
                <CopyButton text={tsv} label="Copy for Quizlet / Anki" />
                <DownloadButton text={tsv} name={`${title.replace(/[^\w-]+/g, "-")}.txt`} label="Download .txt (tab-separated)" />
                <DownloadButton text={csv} name={`${title.replace(/[^\w-]+/g, "-")}.csv`} mime="text/csv" bom label="Download CSV" />
                <button type="button" className="btn btn--ghost btn--sm" onClick={print}>
                  Print fold-over cards
                </button>
              </div>
              <h3 className="sumsec__h">Share this deck</h3>
              <p className="field__hint">The whole deck is packed into the link itself. Nothing is stored on a server.</p>
              <div className="row-actions">
                <button type="button" className="btn btn--primary btn--sm" onClick={share} disabled={!cards.length}>
                  Create share link
                </button>
              </div>
              {shareUrl && (
                <p className="sharebox">
                  <input className="input" readOnly value={shareUrl} onFocus={(e) => e.target.select()} aria-label="Share link" />
                  <span className="field__hint">Copied to your clipboard. {shareUrl.length > 2000 ? "This link is long; some apps may cut it. Share the file instead for big decks." : ""}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <SendTo text={N.notes} current="flashcard-generator" />
    </div>
  );
}

function CardEditor({ cards, edit, boxOf }) {
  const [bulk, setBulk] = useState("");
  const add = () => edit((c) => [...c, { id: `n${Date.now()}`, front: "", back: "", kind: "typed" }]);
  const addBulk = () => {
    const extra = parseCardList(bulk).map((c, i) => ({ ...c, id: `b${Date.now()}${i}` }));
    if (extra.length) edit((c) => [...c, ...extra]);
    setBulk("");
  };
  if (!cards.length)
    return (
      <div className="study-out">
        <p className="study-empty">No cards yet. Paste notes with definitions, or add your own cards below.</p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={add}>
          + Add a card
        </button>
      </div>
    );
  return (
    <div className="study-out">
      <ol className="cardlist">
        {cards.map((c, i) => (
          <li key={c.id} className="cardlist__item">
            <span className={`cardlist__kind kind-${c.kind}`}>{c.kind === "cloze" ? "Fill in" : c.kind === "definition" ? "Term" : c.kind === "qa" ? "Q & A" : "Card"}</span>
            {boxOf(c) >= 4 && <span className="cardlist__known">Known</span>}
            <label className="visually-hidden" htmlFor={`f-${c.id}`}>
              Front of card {i + 1}
            </label>
            <textarea id={`f-${c.id}`} className="input cardlist__front" rows={3} value={c.front} onChange={(e) => edit((d) => d.map((x) => (x.id === c.id ? { ...x, front: e.target.value } : x)))} />
            <label className="visually-hidden" htmlFor={`b-${c.id}`}>
              Back of card {i + 1}
            </label>
            <textarea id={`b-${c.id}`} className="input cardlist__back" rows={3} value={c.back} onChange={(e) => edit((d) => d.map((x) => (x.id === c.id ? { ...x, back: e.target.value } : x)))} />
            <button type="button" className="btn btn--ghost btn--xs cardlist__del" aria-label={`Delete card ${i + 1}`} onClick={() => edit((d) => d.filter((x) => x.id !== c.id))}>
              ✕
            </button>
          </li>
        ))}
      </ol>
      <div className="row-actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={add}>
          + Add a card
        </button>
      </div>
      <details className="bulkadd">
        <summary>Paste a list of cards</summary>
        <textarea className="input textarea textarea--sm" rows={4} value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder={"Mitochondria :: powerhouse of the cell\nOsmosis - movement of water across a membrane\nQ: Unit of force?\nA: Newton"} />
        <button type="button" className="btn btn--ghost btn--sm" onClick={addBulk} disabled={!bulk.trim()}>
          Add {parseCardList(bulk).length || ""} cards
        </button>
      </details>
    </div>
  );
}

function StudyMode({ cards, boxOf, progress, grade, reset }) {
  const [mode, setMode] = useState("due");
  const [reverse, setReverse] = useState(false);
  const [seed, setSeed] = useState(1);
  const [queue, setQueue] = useState([]);
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState(false);
  const [done, setDone] = useState({ right: 0, again: 0 });
  const boxRef = useRef(null);
  const t = today();

  const build = (m = mode, s = seed) => {
    let list = cards.filter((c) => c.front.trim() && c.back.trim());
    if (m === "due") list = list.filter((c) => !progress[keyOf(c)] || progress[keyOf(c)].due <= t);
    if (m === "hard") list = list.filter((c) => boxOf(c) > 0 && boxOf(c) <= 2);
    setQueue(s ? shuffled(list, s) : list);
    setPos(0);
    setFlip(false);
    setDone({ right: 0, again: 0 });
  };
  useEffect(() => build(), [cards.length]);

  const card = queue[pos];
  const answer = (g) => {
    if (!card) return;
    grade(card, g);
    setDone((d) => (g === "again" ? { ...d, again: d.again + 1 } : { ...d, right: d.right + 1 }));
    if (g === "again") setQueue((q) => [...q, card]);
    setFlip(false);
    setPos((p) => p + 1);
  };
  useEffect(() => {
    const onKey = (e) => {
      if (/input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlip((f) => !f);
      } else if (flip && ["1", "2", "3", "4"].includes(e.key)) answer(["again", "hard", "good", "easy"][Number(e.key) - 1]);
      else if (e.key === "ArrowRight") {
        setFlip(false);
        setPos((p) => Math.min(queue.length, p + 1));
      } else if (e.key === "ArrowLeft") {
        setFlip(false);
        setPos((p) => Math.max(0, p - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const front = card ? (reverse ? card.back : card.front) : "";
  const back = card ? (reverse ? card.front : card.back) : "";
  return (
    <div className="study-out">
      <div className="study-opts study-opts--row">
        <div className="seg" role="radiogroup" aria-label="Which cards">
          {[["due", "Due today"], ["all", "All cards"], ["hard", "Struggling"]].map(([v, l]) => (
            <button key={v} type="button" role="radio" aria-checked={mode === v} className="seg__opt" onClick={() => { setMode(v); build(v); }}>
              {l}
            </button>
          ))}
        </div>
        <Toggle label="Show answer side first" checked={reverse} onChange={setReverse} />
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => { const s = seed + 1; setSeed(s); build(mode, s); }}>
          Shuffle
        </button>
      </div>
      {card ? (
        <>
          <p className="field__hint">
            Card {Math.min(pos + 1, queue.length)} of {queue.length} · box {boxOf(card) || "new"}
          </p>
          <button ref={boxRef} type="button" className={`flip ${flip ? "is-flipped" : ""}`} onClick={() => setFlip((f) => !f)} aria-live="polite" aria-label={flip ? `Answer: ${back}` : `Question: ${front}. Press to show the answer.`}>
            <span className="flip__inner">
              <span className="flip__face flip__front">
                <span className="flip__tag">{card.kind === "cloze" && !reverse ? "Fill in the blank" : reverse ? "Answer" : "Question"}</span>
                <span className="flip__text">{front}</span>
                <span className="flip__hint">Tap or press Space to flip</span>
              </span>
              <span className="flip__face flip__back">
                <span className="flip__tag">{reverse ? "Question" : "Answer"}</span>
                <span className="flip__text">{back}</span>
              </span>
            </span>
          </button>
          <div className={`grades ${flip ? "" : "is-hidden"}`} aria-hidden={!flip}>
            {[["again", "Again", "1", "<1 min"], ["hard", "Hard", "2", "today"], ["good", "Good", "3", "later"], ["easy", "Easy", "4", "much later"]].map(([g, l, k, w]) => (
              <button key={g} type="button" className={`grade grade--${g}`} onClick={() => answer(g)} tabIndex={flip ? 0 : -1}>
                <b>{l}</b>
                <span>
                  {k} · {w}
                </span>
              </button>
            ))}
          </div>
          <p className="field__hint kbd-hint">Keys: Space flip · 1 Again · 2 Hard · 3 Good · 4 Easy · ← → move</p>
        </>
      ) : (
        <div className="study-done">
          <p className="study-done__big">{queue.length ? "Session complete" : mode === "due" ? "Nothing due today" : "No cards here"}</p>
          {queue.length > 0 && (
            <p>
              {done.right} remembered · {done.again} to see again
            </p>
          )}
          <p className="field__hint">Cards you mark Good or Easy come back after 1, 3, 7 and 16 days (the Leitner method), so you spend time on what you are forgetting.</p>
          <div className="row-actions">
            <button type="button" className="btn btn--primary btn--sm" onClick={() => { setMode("all"); build("all"); }}>
              Study all cards again
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
              Reset progress
            </button>
          </div>
        </div>
      )}
      <ul className="boxes" aria-label="Cards by Leitner box">
        {[1, 2, 3, 4, 5].map((b) => (
          <li key={b} className={`boxes__b boxes__b--${b}`}>
            <b>{cards.filter((c) => boxOf(c) === b).length}</b>
            <span>{BOX_NAMES[b]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
