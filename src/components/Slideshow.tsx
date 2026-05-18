import { useCallback, useEffect, useState } from "react";
import { SLIDES, type SlideCtx } from "./slides";

export default function Slideshow() {
  const [i, setI] = useState(0);
  const [votes, setVotes] = useState({ launched: 0, dropped: 0, tie: 0 });
  const [quiz, setQuiz] = useState<Record<number, number | null>>({});
  const [notesOpen, setNotesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goTo = useCallback((n: number) => setI(Math.max(0, Math.min(SLIDES.length - 1, n))), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goTo(i + 1);
      else if (e.key === "ArrowLeft") goTo(i - 1);
      else if (e.key === "n" || e.key === "N") setNotesOpen((v) => !v);
      else if (e.key === "t" || e.key === "T") setSidebarOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, goTo]);

  const ctx: SlideCtx = {
    votes,
    vote: (k) => setVotes((v) => ({ ...v, [k]: v[k] + 1 })),
    quiz,
    answerQuiz: (s, idx) => setQuiz((q) => (q[s] != null ? q : { ...q, [s]: idx })),
    goTo,
  };

  const slide = SLIDES[i];

  return (
    <div className="fixed inset-0 bg-[var(--navy)] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-black/40 backdrop-blur border-r border-white/10 transition-transform z-30 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-3 text-sm uppercase tracking-wider text-white/60">Slides</div>
        <div className="overflow-y-auto h-[calc(100%-3rem)] px-2 pb-4 space-y-1">
          {SLIDES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${idx === i ? "bg-[var(--yellow)] text-[var(--navy)] font-bold" : "hover:bg-white/10 text-white/80"}`}
            >
              <span className="opacity-60 mr-2">{idx + 1}.</span>{s.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed top-4 left-4 z-40 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm backdrop-blur"
      >
        ☰ Slides
      </button>

      {/* Slide counter */}
      <div className="fixed top-4 right-4 z-20 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm text-white/80">
        Slide {i + 1} of {SLIDES.length}
      </div>

      {/* Slide */}
      <main key={i} className="absolute inset-0 animate-fade-up">
        {slide.render(ctx)}
      </main>

      {/* Nav buttons */}
      <button
        onClick={() => goTo(i - 1)}
        disabled={i === 0}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 hover:bg-[var(--yellow)] hover:text-[var(--navy)] disabled:opacity-20 disabled:hover:bg-white/10 disabled:hover:text-white text-2xl font-bold transition backdrop-blur"
      >‹</button>
      <button
        onClick={() => goTo(i + 1)}
        disabled={i === SLIDES.length - 1}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 hover:bg-[var(--yellow)] hover:text-[var(--navy)] disabled:opacity-20 disabled:hover:bg-white/10 disabled:hover:text-white text-2xl font-bold transition backdrop-blur"
      >›</button>

      {/* Notes panel */}
      {notesOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/70 backdrop-blur-md border-t-4 border-[var(--yellow)] p-6 max-h-[40vh] overflow-y-auto animate-slide-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-2xl text-[var(--yellow)]">Speaker Notes — {slide.title}</h3>
            <button onClick={() => setNotesOpen(false)} className="text-white/60 hover:text-white">✕</button>
          </div>
          <ul className="space-y-2 text-lg">
            {slide.notes.map((n, idx) => (
              <li key={idx} className="flex gap-3"><span className="text-[var(--yellow)]">•</span>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Hint */}
      <div className="fixed bottom-3 right-4 z-20 text-xs text-white/40">
        ← → navigate · N notes · T thumbnails
      </div>
    </div>
  );
}
