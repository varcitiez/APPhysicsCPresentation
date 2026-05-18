import { useEffect, useState } from "react";

type VoteKey = "launched" | "dropped" | "tie";
type Votes = Record<VoteKey, number>;
type QuizState = Record<number, number | null>; // slide -> chosen index

export interface SlideCtx {
  votes: Votes;
  vote: (k: VoteKey) => void;
  quiz: QuizState;
  answerQuiz: (slide: number, idx: number) => void;
  goTo: (i: number) => void;
}

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div className="text-center">
    <h1 className="font-display text-7xl md:text-8xl font-bold text-[var(--yellow)] drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] animate-fade-up">
      {children}
    </h1>
    {sub && <p className="mt-6 text-2xl md:text-3xl text-white/80 animate-fade-up" style={{ animationDelay: "0.2s" }}>{sub}</p>}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-[var(--navy-2)] border-4 border-[var(--yellow)]/30 rounded-3xl p-8 shadow-2xl ${className}`}>
    {children}
  </div>
);

const VoteButtons: React.FC<{ ctx: SlideCtx }> = ({ ctx }) => {
  const total = ctx.votes.launched + ctx.votes.dropped + ctx.votes.tie;
  const opts: { k: VoteKey; label: string; color: string }[] = [
    { k: "launched", label: "The launched ball 🚀", color: "bg-[var(--pink)]" },
    { k: "dropped", label: "The dropped ball ⬇️", color: "bg-[var(--teal)]" },
    { k: "tie", label: "They tie 🤝", color: "bg-[var(--yellow)] text-[var(--navy)]" },
  ];
  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl">
      {opts.map((o) => {
        const pct = total ? Math.round((ctx.votes[o.k] / total) * 100) : 0;
        return (
          <button
            key={o.k}
            onClick={() => ctx.vote(o.k)}
            className={`relative overflow-hidden ${o.color} text-white rounded-2xl py-6 px-8 text-2xl font-bold hover:scale-[1.02] active:scale-95 transition shadow-lg`}
          >
            <div className="absolute inset-y-0 left-0 bg-black/20" style={{ width: `${pct}%` }} />
            <div className="relative flex justify-between items-center">
              <span>{o.label}</span>
              <span className="font-display text-3xl">{ctx.votes[o.k]}</span>
            </div>
          </button>
        );
      })}
      {total > 0 && <div className="text-center text-white/70 text-lg">Total votes: {total}</div>}
    </div>
  );
};

// ---- Slide components ----

const S1 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-12 px-12">
    <Title>Which Ball Hits First?</Title>
    <div className="flex items-center gap-16 mt-8">
      <div className="flex flex-col items-center gap-5">
        <div className="text-5xl">🚀</div>
        <div className="w-20 h-20 rounded-full bg-[var(--pink)] animate-float shadow-[0_0_40px_rgba(255,93,143,0.6)]" />
        <div className="text-white/70">Launched →</div>
      </div>
      <div className="font-display text-9xl text-[var(--yellow)] animate-pulse">?</div>
      <div className="flex flex-col items-center gap-5">
        <div className="text-5xl">🖐️</div>
        <div className="w-20 h-20 rounded-full bg-[var(--teal)] animate-float shadow-[0_0_40px_rgba(76,201,240,0.6)]" style={{ animationDelay: "0.5s" }} />
        <div className="text-white/70">Dropped ↓</div>
      </div>
    </div>
    <div className="text-2xl flex flex-col text-white/70 translate-y-40">A physics presentation by Gabriel Magwood, Vedu Srinivasan, and Daniel Kim</div>
  </div>
);

const S2: React.FC<{ ctx: SlideCtx }> = ({ ctx }) => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-12">
    <h1 className="font-display text-6xl font-bold text-[var(--yellow)]">Make Your Prediction!</h1>
    <p className="text-2xl text-white/70">Tap your guess. No wrong answers!</p>
    <VoteButtons ctx={ctx} />
  </div>
);

const S3 = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-12">
      <div className="text-9xl animate-float">🤔</div>
      <h1 className="font-display text-6xl font-bold text-[var(--yellow)] text-center px-8">
        Hold that thought{dots}
      </h1>
      <p className="text-3xl text-white/80">Let's build up to the answer</p>
    </div>
  );
};

const S4 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-16 text-center">
    <h2 className="font-display text-5xl text-[var(--yellow)]">What is a Projectile?</h2>
    <Card className="max-w-5xl">
      <p className="text-4xl leading-relaxed">
        A projectile is anything that's <span className="text-[var(--yellow)] font-bold">thrown</span>,{" "}
        <span className="text-[var(--pink)] font-bold">kicked</span>, or{" "}
        <span className="text-[var(--teal)] font-bold">launched</span> — and then left to fly on its own.
      </p>
    </Card>
    <div className="flex gap-12 text-7xl">
      <span className="animate-float">⚽</span>
      <span className="animate-float" style={{ animationDelay: "0.3s" }}>🏀</span>
      <span className="animate-float" style={{ animationDelay: "0.6s" }}>🛩️</span>
    </div>
  </div>
);

const S5 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">The Trajectory</h2>
    <div className="relative w-[800px] h-[400px]">
      <svg viewBox="0 0 800 400" className="w-full h-full">
        <path d="M 50 350 Q 400 -50 750 350" fill="none" stroke="#ffd60a" strokeWidth="6" strokeDasharray="14 10" />
        <circle cx="50" cy="350" r="20" fill="#ff5d8f" />
        <circle cx="750" cy="350" r="20" fill="#4cc9f0" />
        <line x1="20" y1="370" x2="780" y2="370" stroke="#fff" strokeWidth="3" />
      </svg>
    </div>
    <p className="text-3xl text-center max-w-3xl">
      This curved path is called a <span className="text-[var(--yellow)] font-bold font-display">TRAJECTORY</span>.
    </p>
  </div>
);

// NEW Slide A — What Makes Something a Projectile?
const SA = () => {
  const items = [
    { e: "🚀", title: "Rocket", isP: false, why: "Has an engine pushing it the whole way" },
    { e: "⚽", title: "Soccer ball mid-air", isP: true, why: "Nothing pushing it after the kick" },
    { e: "🛩️", title: "Airplane", isP: false, why: "Engines running, wings lifting" },
    { e: "🏹", title: "Arrow after release", isP: true, why: "No more force after the bow" },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)]">What Makes Something a Projectile?</h2>
      <div className="grid grid-cols-2 gap-6 max-w-5xl w-full">
        {items.map((it, i) => (
          <Card key={i} className={`flex items-center gap-5 animate-fade-up border-4 ${it.isP ? "border-[var(--teal)]/60" : "border-[var(--pink)]/60"}`}>
            <div className="text-7xl">{it.e}</div>
            <div className="flex-1">
              <div className={`font-display text-2xl ${it.isP ? "text-[var(--teal)]" : "text-[var(--pink)]"}`}>
                {it.isP ? "✅ Projectile" : "❌ NOT a projectile"}
              </div>
              <div className="text-xl font-bold">{it.title}</div>
              <div className="text-base text-white/70 mt-1">{it.why}</div>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-xl text-white/80 text-center max-w-4xl">
        A projectile has <span className="text-[var(--yellow)] font-bold">no engine, no wings</span> — only{" "}
        <span className="text-[var(--yellow)] font-bold">gravity</span> acts on it.
      </p>
    </div>
  );
};

// NEW Slide B — What Affects the Path?
const SB = () => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown((s) => Math.min(s + 1, 3)), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)]">What Affects the Path?</h2>
      <div className="grid grid-cols-3 gap-6 max-w-6xl w-full">
        {shown > 0 && (
          <Card className="animate-fade-up flex flex-col items-center gap-3 text-center">
            <div className="text-6xl">⚽💨</div>
            <h3 className="font-display text-2xl text-[var(--pink)]">Launch Speed</h3>
            <p className="text-lg text-white/85">Kick it harder → it flies farther.</p>
          </Card>
        )}
        {shown > 1 && (
          <Card className="animate-fade-up flex flex-col items-center gap-3 text-center">
            <svg viewBox="0 0 220 140" className="w-full">
              <path d="M 20 130 Q 60 70 120 130" fill="none" stroke="#4cc9f0" strokeWidth="3" />
              <path d="M 20 130 Q 110 -10 200 130" fill="none" stroke="#ffd60a" strokeWidth="4" />
              <path d="M 20 130 Q 50 30 90 130" fill="none" stroke="#ff5d8f" strokeWidth="3" />
              <text x="160" y="40" fill="#ffd60a" fontSize="22">⭐ 45°</text>
            </svg>
            <h3 className="font-display text-2xl text-[var(--yellow)]">Launch Angle</h3>
            <p className="text-lg text-white/85">45° goes the farthest.</p>
          </Card>
        )}
        {shown > 2 && (
          <Card className="animate-fade-up flex flex-col items-center gap-3 text-center">
            <div className="text-6xl">🏔️⬇️</div>
            <h3 className="font-display text-2xl text-[var(--teal)]">Launch Height</h3>
            <p className="text-lg text-white/85">Higher start = more air time = more distance.</p>
          </Card>
        )}
      </div>
      <p className="text-xl text-white/70 text-center max-w-4xl">
        Three factors decide a projectile's path: <span className="text-[var(--yellow)] font-bold">speed, angle, height</span>.
      </p>
    </div>
  );
};

const S6 = () => {
  const items = [
    { e: "⚽", l: "Soccer kick" }, { e: "🏀", l: "Basketball shot" },
    { e: "🎈", l: "Water balloon" },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)]">Projectiles are EVERYWHERE</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
        {items.map((it, i) => (
          <Card key={i} className="flex flex-col items-center gap-4 animate-fade-up" >
            <div className="text-7xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>{it.e}</div>
            <div className="text-xl font-bold">{it.l}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const S7 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-12 text-center">
    <h2 className="font-display text-5xl md:text-6xl text-[var(--yellow)] leading-tight">
      Horizontal and Vertical motion are <span className="underline decoration-[var(--pink)]">INDEPENDENT</span>.
    </h2>
    <Card className="max-w-4xl">
      <div className="flex items-center gap-6">
        <div className="text-8xl animate-float">🚶‍♂️</div>
        <p className="text-2xl text-left">
          It's like <span className="text-[var(--yellow)] font-bold">walking forward</span> and{" "}
          <span className="text-[var(--pink)] font-bold">chewing gum</span>. Your legs don't know what your mouth is doing.
        </p>
      </div>
    </Card>
  </div>
);

const S8 = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => (x + 1) % 5), 700);
    return () => clearInterval(t);
  }, []);
  const marks = [0, 1, 2, 3, 4];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
      <h2 className="font-display text-4xl text-[var(--yellow)]">Same vertical drop. Every time.</h2>
      <div className="flex gap-12">
        <div className="flex flex-col items-center">
          <div className="text-xl mb-2 text-white/80">Dropped</div>
          <div className="relative w-40 h-96 border-2 border-white/30 rounded-xl">
            {marks.map((m) => {
              const y = 20 + m * m * 16;
              return <div key={m} className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full ${tick >= m ? "bg-[var(--teal)]" : "bg-white/10"} transition`} style={{ top: y }} />;
            })}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl mb-2 text-white/80">Launched →</div>
          <div className="relative w-96 h-96 border-2 border-white/30 rounded-xl">
            {marks.map((m) => {
              const y = 20 + m * m * 16;
              const x = 20 + m * 70;
              return <div key={m} className={`absolute w-10 h-10 rounded-full ${tick >= m ? "bg-[var(--pink)]" : "bg-white/10"} transition`} style={{ top: y, left: x }} />;
            })}
          </div>
        </div>
      </div>
      <p className="text-xl text-white/70">Notice: the vertical position matches at every tick.</p>
    </div>
  );
};

const S9 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)] text-center">
      Gravity doesn't care how fast you're moving sideways.
    </h2>
    <div className="flex gap-24 items-start">
      {[{c:"var(--teal)",label:"Dropped"},{c:"var(--pink)",label:"Launched"}].map((b,i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full" style={{ background: b.c }} />
          <div className="text-6xl text-[var(--yellow)] animate-float">↓</div>
          <div className="text-6xl text-[var(--yellow)] animate-float" style={{ animationDelay: "0.2s" }}>↓</div>
          <div className="text-2xl font-bold">{b.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// NEW Slide C — Cannonballs and Confusion
const SC = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)] text-center">A Brief History: Cannonballs & Confusion</h2>
      <Card className="max-w-5xl">
        <p className="text-xl leading-relaxed">
          For thousands of years, people had <span className="text-[var(--pink)] font-bold">no idea</span> how projectiles
          worked. They thought a cannonball flew straight forward, then just… <em>dropped</em> when it ran out of "forward." 🤷
        </p>
      </Card>
      <div className="flex gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="text-sm text-[var(--pink)] font-bold mb-1">❌ Old wrong belief</div>
          <svg viewBox="0 0 220 140" className="w-56 h-32 bg-[var(--navy-2)] rounded-xl border-2 border-[var(--pink)]/40">
            <line x1="20" y1="40" x2="160" y2="40" stroke="#ff5d8f" strokeWidth="4" />
            <line x1="160" y1="40" x2="160" y2="120" stroke="#ff5d8f" strokeWidth="4" />
            <circle cx="160" cy="120" r="6" fill="#ff5d8f" />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm text-[var(--teal)] font-bold mb-1">✅ Actual path</div>
          <svg viewBox="0 0 220 140" className="w-56 h-32 bg-[var(--navy-2)] rounded-xl border-2 border-[var(--teal)]/40">
            <path d="M 20 110 Q 110 -10 200 110" fill="none" stroke="#4cc9f0" strokeWidth="4" />
            <circle cx="200" cy="110" r="6" fill="#4cc9f0" />
          </svg>
        </div>
      </div>
      {!show ? (
        <button onClick={() => setShow(true)} className="bg-[var(--yellow)] text-[var(--navy)] font-bold px-6 py-3 rounded-xl text-lg hover:scale-105 transition">
          Who figured it out? 🔍
        </button>
      ) : (
        <Card className="max-w-4xl animate-fade-up flex items-center gap-5">
          <img src="/public/images/galileo.jpg" alt="Galileo" className="w-20 rounded-l" />
          <div>
            <div className="font-display text-2xl text-[var(--yellow)]">Galileo, ~400 years ago</div>
          </div>
        </Card>
      )}
    </div>
  );
};

// NEW Slide D — Monkey and Hunter
const SD: React.FC<{ ctx: SlideCtx }> = ({ ctx }) => {
  const slideNum = 1001; // unique key in quiz state
  const chosen = ctx.quiz[slideNum] ?? null;
  const choices = [
    { label: "🎯 YES — it hits", correct: true },
    { label: "❌ NO — it misses", correct: false },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
      <div className="bg-[var(--yellow)] text-[var(--navy)] px-5 py-2 rounded-full font-display text-xl">CLASSIC THOUGHT EXPERIMENT</div>
      <h2 className="font-display text-4xl text-[var(--yellow)] text-center">The Monkey and the Hunter 🐒🎯</h2>
      <Card className="max-w-5xl">
        <p className="text-xl leading-relaxed">
          A hunter aims a dart gun <span className="text-[var(--yellow)] font-bold">directly</span> at a monkey hanging from a branch.
          The instant the hunter fires, the monkey — startled by the noise — <span className="text-[var(--pink)] font-bold">lets go and falls</span>.
          Does the dart hit the monkey?
        </p>
      </Card>
      <svg viewBox="0 0 600 220" className="w-[600px] h-[220px]">
        <text x="20" y="170" fontSize="48" transform="translate(44 150) rotate(-13) scale(-1 1) translate(-44 -150)">🔫</text>
        <line x1="80" y1="155" x2="500" y2="60" stroke="#ffd60a" strokeWidth="2" strokeDasharray="6 4" />
        <text x="500" y="60" fontSize="40">🐒</text>
        <line x1="500" y1="20" x2="500" y2="60" stroke="#fff" strokeWidth="2" />
      </svg>
      <div className="flex gap-4">
        {choices.map((c, i) => {
          const locked = chosen !== null;
          const isC = chosen === i;
          let cls = "bg-[var(--navy-2)] border-white/20 hover:scale-105";
          if (locked && c.correct) cls = "bg-green-600 border-green-300";
          else if (locked && isC && !c.correct) cls = "bg-red-600 border-red-300";
          else if (locked) cls = "bg-[var(--navy-2)] opacity-50";
          return (
            <button key={i} disabled={locked} onClick={() => ctx.answerQuiz(slideNum, i)}
              className={`px-8 py-4 rounded-2xl text-xl font-bold border-4 transition ${cls}`}>
              {c.label}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <Card className="max-w-4xl animate-fade-up">
          <p className="text-lg">
            <span className="text-[var(--yellow)] font-bold">YES — it hits!</span> The dart and the monkey both start
            falling at the exact same moment, pulled by gravity at the exact same rate.
            The dart drops just as much as the monkey does, so they meet in midair. 
            <span className="text-[var(--teal)] font-bold"> Same idea as our two balls.</span>
          </p>
        </Card>
      )}
    </div>
  );
};

const S10 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-8 px-16 text-center">
    <div className="bg-[var(--yellow)] text-[var(--navy)] px-6 py-2 rounded-full font-display text-2xl">THINK • PAIR • SHARE</div>
    <h2 className="font-display text-4xl md:text-5xl leading-tight max-w-5xl">
      If you ran off a cliff <span className="text-[var(--pink)]">really fast</span> vs. <span className="text-[var(--teal)]">walking slowly</span> —
      would your speed change how long until you hit the water?
    </h2>
    <p className="text-xl text-white/70">Discuss with a neighbor for 30 seconds.</p>
    <img src="/public/images/cliffwalking.jpg" alt="cliffwalking" className="w-60 rounded-xl"></img>
  </div>
);

const S11 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">Meet the Equipment</h2>
    <div className="grid grid-cols-2 gap-10 max-w-5xl">
      <Card className="flex flex-col items-center gap-4">
        <img src="/public/images/springlauncher.png" className="w-75"></img>
        <h3 className="font-display text-3xl text-[var(--pink)]">Spring Launcher</h3>
        <p className="text-center text-lg text-white/80">Fires a ball straight sideways at the same height as the drop.</p>
      </Card>
      <Card className="flex flex-col items-center gap-4">
        <div className="text-9xl translate-y-20">✋</div>
        <h3 className="font-display text-3xl text-[var(--teal)] translate-y-27">A Steady Hand</h3>
        <p className="text-center text-lg text-white/80 translate-y-27">Releases an identical ball at the very same moment.</p>
      </Card>
    </div>
  </div>
);

const S12: React.FC<{ ctx: SlideCtx }> = ({ ctx }) => (
  <div className="flex flex-col items-center justify-center h-full gap-8 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)] animate-pulse">Lock In Your Final Prediction!</h2>
    <p className="text-xl text-white/70">Last chance to change your vote…</p>
    <VoteButtons ctx={ctx} />
  </div>
);

const S13 = () => {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    if (count === null || count <= 0) return;
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10">
      <h1 className="font-display text-9xl font-bold text-[var(--yellow)] animate-pulse-glow rounded-3xl px-12 py-6 bg-[var(--navy-2)]">
        🎯 DEMO TIME!
      </h1>
      <p className="text-3xl text-white/80">Watch closely. Listen for the landing.</p>
      {count === null ? (
        <button onClick={() => setCount(3)} className="bg-[var(--pink)] text-white text-3xl font-bold px-10 py-5 rounded-2xl hover:scale-105 transition shadow-xl">
          Start Countdown
        </button>
      ) : (
        <div className="font-display text-[12rem] text-[var(--yellow)] leading-none">
          {count > 0 ? count : "GO!"}
        </div>
      )}
    </div>
  );
};

const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 60 }).map((_, i) => {
      const colors = ["#ffd60a", "#ff5d8f", "#4cc9f0", "#ffffff"];
      return (
        <div key={i} className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 2.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }} />
      );
    })}
  </div>
);

const S14: React.FC<{ ctx: SlideCtx }> = ({ ctx }) => {
  const total = ctx.votes.launched + ctx.votes.dropped + ctx.votes.tie;
  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-8 px-12">
      <Confetti />
      <h1 className="font-display text-7xl font-bold text-[var(--yellow)] text-center animate-pulse">
        They landed at the SAME TIME! 🎉
      </h1>
      <Card className="max-w-3xl">
        <h3 className="text-2xl text-[var(--yellow)] mb-3 font-display">Your votes:</h3>
        <div className="space-y-2 text-xl">
          <div>🚀 Launched: <b>{ctx.votes.launched}</b></div>
          <div>⬇️ Dropped: <b>{ctx.votes.dropped}</b></div>
          <div>🤝 Tie (correct!): <b className="text-[var(--yellow)]">{ctx.votes.tie}</b></div>
        </div>
        {total > 0 && ctx.votes.tie > 0 && (
          <p className="mt-4 text-xl">🏆 Congrats to the {ctx.votes.tie} {ctx.votes.tie === 1 ? "scientist" : "scientists"} who picked TIE!</p>
        )}
      </Card>
    </div>
  );
};

const S15 = () => {
  const [step, setStep] = useState(0);
  const steps = [0, 1, 2, 3, 4];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
      <h2 className="font-display text-4xl text-[var(--yellow)]">Time vs. Height</h2>
      <svg viewBox="0 0 700 400" className="w-[700px] h-[400px] bg-[var(--navy-2)] rounded-2xl border-4 border-white/10">
        <line x1="60" y1="40" x2="60" y2="360" stroke="#fff" strokeWidth="3" />
        <line x1="60" y1="360" x2="660" y2="360" stroke="#fff" strokeWidth="3" />
        <text x="20" y="200" fill="#fff" fontSize="18" transform="rotate(-90 30 200)">Height</text>
        <text x="340" y="390" fill="#fff" fontSize="18">Time →</text>
        {steps.slice(0, step + 1).map((i) => {
          const x = 60 + i * 120;
          const y = 40 + i * i * 14;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill="#4cc9f0" />
              <circle cx={x + 30} cy={y} r="14" fill="#ff5d8f" />
              <line x1="60" y1={y} x2={x + 50} y2={y} stroke="#ffd60a" strokeDasharray="4 4" />
            </g>
          );
        })}
      </svg>
      <button onClick={() => setStep((s) => Math.min(s + 1, 4))} className="bg-[var(--yellow)] text-[var(--navy)] font-bold px-8 py-3 rounded-xl text-xl hover:scale-105 transition">
        {step >= 4 ? "Done!" : "Next time step →"}
      </button>
      <p className="text-lg text-white/70">Both balls drop the same height at every step.</p>
    </div>
  );
};

const S16 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-8 px-16">
    <h2 className="font-display text-4xl text-[var(--yellow)]">Key Insight</h2>
    <Card className="max-w-4xl">
      <p className="text-3xl leading-relaxed text-center">
        The launcher pushes the ball <span className="text-[var(--pink)] font-bold">SIDEWAYS</span>.
        But gravity pulls it <span className="text-[var(--teal)] font-bold">DOWN</span> the same way no matter what.
      </p>
      <div className="mt-8 text-center font-display text-3xl text-[var(--yellow)]">
        Sideways speed ≠ extra gravity.
      </div>
    </Card>
  </div>
);

const S17 = () => {
  const items = [
    "Both balls start at the same height",
    "Gravity pulls both down identically",
    "Only difference is sideways motion — but that doesn't change falling speed",
  ];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown((s) => Math.min(s + 1, 3)), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)]">The Big Picture</h2>
      <div className="flex flex-col gap-5 w-full max-w-4xl">
        {items.map((it, i) =>
          shown > i ? (
            <Card key={i} className="animate-slide-in flex items-center gap-6">
              <div className="font-display text-5xl text-[var(--yellow)]">{i + 1}</div>
              <div className="text-2xl">{it}</div>
            </Card>
          ) : null
        )}
      </div>
    </div>
  );
};

// NEW Slide I — Common Misconceptions (myth busters with flip)
const SI = () => {
  const myths = [
    { myth: "Heavier objects fall faster.", truth: "Gravity accelerates everything equally — a bowling ball and a feather fall at the same rate in a vacuum. Air resistance is the only reason the feather looks slower." },
    { myth: "A bullet fired sideways stays up a long time.", truth: "A bullet fired perfectly horizontally hits the ground in the same time as a dropped bullet from the same height — just like our demo!" },
    { myth: "Throw a ball up on a moving train, it lands behind you.", truth: "It lands right back in your hand — the ball already has the train's forward speed the whole time it's in the air." },
  ];
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-10">
      <h2 className="font-display text-5xl text-[var(--yellow)]">Things People Get Wrong 🤔</h2>
      <p className="text-lg text-white/70">Tap each card to reveal the truth.</p>
      <div className="grid grid-cols-3 gap-5 max-w-6xl w-full">
        {myths.map((m, i) => (
          <button
            key={i}
            onClick={() => setFlipped((f) => f.map((v, j) => (j === i ? !v : v)))}
            className={`text-left rounded-3xl p-6 border-4 shadow-2xl transition min-h-[260px] ${flipped[i] ? "bg-[var(--navy-2)] border-[var(--teal)]/60" : "bg-[var(--navy-2)] border-[var(--pink)]/60"} hover:scale-[1.02]`}
          >
            {!flipped[i] ? (
              <>
                <div className="text-[var(--pink)] font-display text-2xl mb-3">❌ MYTH</div>
                <div className="text-xl font-bold">{m.myth}</div>
                <div className="text-sm text-white/50 mt-4">tap to flip →</div>
              </>
            ) : (
              <>
                <div className="text-[var(--teal)] font-display text-2xl mb-3">✅ TRUTH</div>
                <div className="text-base text-white/90 leading-relaxed">{m.truth}</div>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// NEW Slide J — Air Resistance: The Asterisk
const SJ = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">Air Resistance</h2>
    <Card className="max-w-5xl">
      <p className="text-xl leading-relaxed">
        Everything we said today is true — with <span className="text-[var(--yellow)] font-bold">one small caveat</span>.
        We're ignoring <span className="text-[var(--pink)] font-bold">air resistance</span>.
      </p>
    </Card>
    <svg viewBox="0 0 400 220" className="w-[400px] h-[220px]">
      <circle cx="200" cy="100" r="32" fill="#ffd60a" />
      <line x1="200" y1="135" x2="200" y2="200" stroke="#4cc9f0" strokeWidth="6" />
      <polygon points="190,195 210,195 200,210" fill="#4cc9f0" />
      <text x="215" y="180" fill="#4cc9f0" fontSize="16">gravity</text>
      <line x1="200" y1="65" x2="200" y2="20" stroke="#ff5d8f" strokeWidth="4" />
      <polygon points="194,28 206,28 200,18" fill="#ff5d8f" />
      <text x="215" y="40" fill="#ff5d8f" fontSize="14">air resistance</text>
    </svg>
    <Card className="max-w-5xl">
      <p className="text-lg leading-relaxed">
        Air pushes back on fast-moving things. That's why a <span className="text-[var(--yellow)] font-bold">crumpled</span> piece of paper
        falls faster than a <span className="text-[var(--yellow)] font-bold">flat</span> one — same weight, different air resistance.
        For slow, heavy objects (like our demo balls), it barely matters. For a bullet or a raindrop? It matters a lot.
      </p>
    </Card>
  </div>
);

// EXPANDED S18 — Video Games with bad vs good physics
const S18 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">This is how video games work! 🎮</h2>
    <div className="bg-[var(--navy-2)] p-4 rounded-2xl border-4 border-[var(--yellow)]/30">
      <svg viewBox="0 0 600 200" className="w-[560px] h-[180px]">
        {Array.from({length: 12}).map((_, i) => {
          const x = 30 + i * 45;
          const y = 160 - (i * 24 - i * i * 2);
          return <rect key={i} x={x} y={y} width="18" height="18" fill="#ffd60a" />;
        })}
        <line x1="0" y1="180" x2="600" y2="180" stroke="#4cc9f0" strokeWidth="4" />
      </svg>
    </div>
    <div className="grid grid-cols-2 gap-6 max-w-5xl w-full">
      <Card className="border-4 border-[var(--pink)]/60">
        <div className="text-[var(--pink)] font-display text-xl mb-2">❌ Bad game physics</div>
        <svg viewBox="0 0 220 120" className="w-full h-24">
          <line x1="20" y1="40" x2="140" y2="40" stroke="#ff5d8f" strokeWidth="4" />
          <line x1="140" y1="40" x2="140" y2="110" stroke="#ff5d8f" strokeWidth="4" />
          <circle cx="140" cy="110" r="6" fill="#ff5d8f" />
        </svg>
        <p className="text-sm text-white/70 mt-2">Walk off ledge → drop straight down. Looks fake.</p>
      </Card>
      <Card className="border-4 border-[var(--teal)]/60">
        <div className="text-[var(--teal)] font-display text-xl mb-2">✅ Good game physics</div>
        <svg viewBox="0 0 220 120" className="w-full h-24">
          <path d="M 20 40 Q 100 40 200 110" fill="none" stroke="#4cc9f0" strokeWidth="4" />
          <circle cx="200" cy="110" r="6" fill="#4cc9f0" />
        </svg>
        <p className="text-sm text-white/70 mt-2">True arc — keeps your forward speed as you fall.</p>
      </Card>
    </div>
    <p className="text-lg text-center max-w-4xl text-white/85">
      The better the physics engine, the more realistic the throw, jump, or shot feels.
    </p>
  </div>
);

// NEW Slide E — Angry Birds
const SE = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">Angry Birds = a Physics Simulator 🐦</h2>
    <div className="bg-[var(--navy-2)] p-6 rounded-2xl border-4 border-[var(--yellow)]/30">
      <svg viewBox="0 0 700 280" className="w-[680px] h-[260px]">
        <path d="M 60 230 Q 350 -20 640 230" fill="none" stroke="#ffd60a" strokeWidth="4" strokeDasharray="8 8" />
        <text x="50" y="245" fontSize="38">🪨</text>
        <text x="60" y="225" fontSize="32">🐦</text>
        <text x="350" y="40" fill="#ffd60a" fontSize="22">≈ 45° ⭐</text>
        <text x="600" y="245" fontSize="40">🐷</text>
        <text x="630" y="220" fontSize="32">🟫</text>
        <line x1="0" y1="255" x2="700" y2="255" stroke="#4cc9f0" strokeWidth="4" />
      </svg>
    </div>
    <Card className="max-w-5xl">
      <p className="text-xl leading-relaxed text-center">
        Every shot in Angry Birds is projectile motion. You're picking the <span className="text-[var(--pink)] font-bold">launch angle</span> and
        the <span className="text-[var(--teal)] font-bold">launch speed</span>. That arc you see? It's a{" "}
        <span className="text-[var(--yellow)] font-bold">trajectory</span>. You've been doing physics this whole time.
      </p>
    </Card>
  </div>
);

// NEW Slide F — Outfielders
const SF = () => (
  <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">Why Outfielders Are Geniuses ⚾🧠</h2>
    <div className="bg-[var(--navy-2)] p-6 rounded-2xl border-4 border-[var(--yellow)]/30">
      <svg viewBox="0 0 700 260" className="w-[680px] h-[240px]">
        <ellipse cx="350" cy="240" rx="340" ry="20" fill="#1a3a1a" />
        <path d="M 50 220 Q 350 -30 600 230" fill="none" stroke="#ffd60a" strokeWidth="3" strokeDasharray="6 6" />
        <text x="30" y="235" fontSize="36">🏏</text>
        <text x="0" y="230" fontSize="40" transform="translate(260 215) scale(-1 1) translate(-260 -215)">🏃</text>
        <circle cx="600" cy="230" r="14" fill="#ff5d8f" stroke="#fff" strokeWidth="2" />
        <text x="565" y="255" fill="#ff5d8f" fontSize="14">landing zone</text>
      </svg>
    </div>
    <Card className="max-w-5xl">
      <p className="text-xl leading-relaxed">
        When a baseball is hit deep, the outfielder doesn't watch the ball the whole time — they instantly start{" "}
        <span className="text-[var(--yellow)] font-bold">running to where the ball will land</span>. Their brain solves
        projectile motion in real time, in <span className="text-[var(--pink)] font-bold">under a second</span>.
      </p>
    </Card>
  </div>
);

// NEW Slide G — Nature
const SG = () => {
  const items = [
    { e: "🐸", name: "Frogs", why: "Jump at near -45° instinctively for max distance." },
    { e: "🐟", name: "Archerfish", why: "Spit water jets at insects, accounting for trajectory AND refraction." },
    { e: "🐆", name: "Leopards", why: "Calculate the perfect arc to pounce on prey." },
    { e: "🕷️", name: "Spiders ballooning", why: "Use wind as horizontal force; gravity pulls them down." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)]">Projectile Motion in Nature 🌿</h2>
      <div className="grid grid-cols-2 gap-5 max-w-5xl w-full">
        {items.map((it, i) => (
          <Card key={i} className="flex items-center gap-4 animate-fade-up">
            <div className="text-6xl">{it.e}</div>
            <div>
              <div className="font-display text-xl text-[var(--yellow)]">{it.name}</div>
              <div className="text-base text-white/85">{it.why}</div>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-lg text-center max-w-4xl text-white/80 italic">
        Evolution solved projectile motion millions of years before Galileo did. 🦎
      </p>
    </div>
  );
};

// NEW Slide H — Space: The Ultimate Projectile
const SH = () => {
  const [step, setStep] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)]">Space: The Ultimate Projectile 🛰️</h2>
      <svg viewBox="0 0 500 320" className="w-[460px] h-[300px]">
        <circle cx="250" cy="280" r="120" fill="#122050" stroke="#4cc9f0" strokeWidth="3" />
        <text x="225" y="290" fontSize="36">🌍</text>
        {step >= 1 && <path d="M 250 160 Q 280 165 305 200" fill="none" stroke="#ff5d8f" strokeWidth="3" />}
        {step >= 2 && <path d="M 250 160 Q 330 165 380 240" fill="none" stroke="#ffd60a" strokeWidth="3" />}
        {step >= 3 && <path d="M 250 160 a 120 120 0 1 1 -0.1 0" fill="none" stroke="#4cc9f0" strokeWidth="3" strokeDasharray="6 4" />}
        <circle cx="250" cy="160" r="8" fill="#fff" />
      </svg>
      <div className="flex gap-3 flex-wrap justify-center">
        {["Throw soft", "Throw medium", "Throw VERY hard → ORBIT"].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={`px-5 py-2 rounded-xl font-bold transition ${step >= i + 1 ? "bg-[var(--yellow)] text-[var(--navy)]" : "bg-[var(--navy-2)] text-white/70 border-2 border-white/20"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <Card className="max-w-5xl">
        <p className="text-lg leading-relaxed">
          An <span className="text-[var(--yellow)] font-bold">orbit</span> is just a projectile that keeps{" "}
          <span className="text-[var(--pink)] font-bold">missing the ground</span> because the Earth curves away beneath it.
          The Space Station is falling toward Earth right now — it's just moving sideways so fast it keeps missing. 🤯
        </p>
      </Card>
    </div>
  );
};

const S20 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">Pilots & Supply Drops ✈️📦</h2>
    <div className="text-9xl animate-float">✈️</div>
    <div className="text-7xl">📦</div>
    <p className="text-2xl text-center max-w-4xl text-white/90">
      The package keeps moving forward <em>with</em> the plane while it falls. Pilots have to aim
      <span className="text-[var(--yellow)] font-bold"> AHEAD</span> of their target.
    </p>
  </div>
);

const S21 = () => (
  <div className="flex flex-col items-center justify-center h-full gap-10 px-12">
    <h2 className="font-display text-5xl text-[var(--yellow)]">Sports = Physics in Action</h2>
    <div className="grid grid-cols-3 gap-8">
      {[{e:"🏈",l:"Quarterbacks"},{e:"🏃",l:"Long jumpers"},{e:"⚾",l:"Outfielders"}].map((s,i) => (
        <Card key={i} className="flex flex-col items-center gap-3 animate-fade-up">
          <div className="text-7xl">{s.e}</div>
          <div className="text-xl font-bold">{s.l}</div>
        </Card>
      ))}
    </div>
    <p className="text-2xl text-center max-w-3xl text-white/90">
      Athletes are doing projectile physics in their heads <span className="text-[var(--yellow)] font-bold">every play</span>.
    </p>
  </div>
);

const QuizSlide: React.FC<{ ctx: SlideCtx; slideNum: number; q: string; choices: string[]; correct: number; explain: string }> =
  ({ ctx, slideNum, q, choices, correct, explain }) => {
  const chosen = ctx.quiz[slideNum] ?? null;
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-12">
      <div className="bg-[var(--yellow)] text-[var(--navy)] px-5 py-2 rounded-full font-display text-xl">QUIZ</div>
      <h2 className="font-display text-4xl md:text-5xl text-center max-w-5xl text-[var(--yellow)]">{q}</h2>
      <div className="flex flex-col gap-4 w-full max-w-3xl">
        {choices.map((c, i) => {
          const isChosen = chosen === i;
          const locked = chosen !== null;
          const isCorrect = i === correct;
          let cls = "bg-[var(--navy-2)] hover:bg-[var(--navy-2)]/70 border-white/20";
          if (locked && isCorrect) cls = "bg-green-600 border-green-300";
          else if (locked && isChosen && !isCorrect) cls = "bg-red-600 border-red-300";
          else if (locked) cls = "bg-[var(--navy-2)] opacity-50 border-white/10";
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => ctx.answerQuiz(slideNum, i)}
              className={`text-left px-8 py-5 rounded-2xl text-2xl font-bold border-4 transition ${cls} ${!locked && "hover:scale-[1.02]"}`}
            >
              <span className="text-[var(--yellow)] mr-3">{String.fromCharCode(65 + i)})</span> {c}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <Card className="max-w-3xl animate-fade-up">
          <p className="text-xl">
            {chosen === correct ? "✅ Correct! " : "❌ Not quite. "}
            <span className="text-white/90">{explain}</span>
          </p>
        </Card>
      )}
    </div>
  );
};

// EXPANDED RECAP — 5 big-idea cards
const S23 = () => {
  const items = [
    { e: "🎯", t: "A projectile is anything moving through the air with no engine — only gravity acting on it." },
    { e: "↔️↕️", t: "Horizontal and vertical motion are completely independent of each other." },
    { e: "⏱️", t: "Gravity pulls ALL objects down at the same rate, no matter their horizontal speed." },
    { e: "📐", t: "45 degrees is the launch angle that sends a projectile the farthest." },
    { e: "🌍", t: "Orbiting spacecraft are projectiles in permanent free fall — just missing Earth continuously." },
  ];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown((s) => Math.min(s + 1, items.length)), 600);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-12">
      <h2 className="font-display text-5xl text-[var(--yellow)]">Big Ideas 🧠</h2>
      <div className="flex flex-col gap-3 w-full max-w-5xl">
        {items.map((it, i) => shown > i && (
          <Card key={i} className="animate-slide-in flex items-center gap-5 py-4">
            <div className="text-4xl w-16 text-center">{it.e}</div>
            <div className="text-lg md:text-xl font-bold flex-1">{it.t}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const S24: React.FC<{ ctx: SlideCtx }> = ({ ctx }) => (
  <div className="flex flex-col items-center justify-center h-full gap-8 px-12 text-center">
    <h1 className="font-display text-6xl md:text-7xl font-bold text-[var(--yellow)] leading-tight max-w-5xl">
      You just learned physics that NASA uses. 🚀
    </h1>
    <Card className="max-w-4xl">
      <p className="text-2xl">
        <span className="text-[var(--pink)] font-bold">Brain blower:</span> Astronauts in orbit are in constant{" "}
        <span className="text-[var(--yellow)] font-bold">free fall</span> — they're just moving forward so fast they keep <em>missing</em> Earth!
      </p>
    </Card>
    <div className="text-8xl animate-float">🚀</div>
    <h2 className="font-display text-5xl text-white">Questions?</h2>
    <button
      onClick={() => { ctx.goTo(0); window.location.reload(); }}
      className="bg-[var(--pink)] text-white font-bold px-8 py-4 rounded-2xl text-xl hover:scale-105 transition shadow-xl"
    >
      ↻ Restart Presentation
    </button>
  </div>
);

// ---- Slide registry with notes & titles ----

export interface SlideDef {
  title: string;
  notes: string[];
  render: (ctx: SlideCtx) => React.ReactNode;
}

export const SLIDES: SlideDef[] = [
  { title: "Title", notes: ["Welcome the class warmly.", "Introduce the mystery: which ball hits first?", "Don't reveal the answer yet."], render: () => <S1 /> },
  { title: "Predict", notes: ["Have every student vote.", "Encourage commitment to a guess.", "No judgement on wrong answers."], render: (c) => <S2 ctx={c} /> },
  { title: "Suspense", notes: ["Build anticipation.", "Tell them you'll explain physics first."], render: () => <S3 /> },
  { title: "Definition", notes: ["Define projectile in kid-friendly words.", "Ask for examples from their lives."], render: () => <S4 /> },
  { title: "Trajectory", notes: ["Introduce the word 'trajectory'.", "Have students trace the arc in the air with their fingers."], render: () => <S5 /> },
  { title: "What is a projectile?", notes: ["A projectile is only in the air with no engine, no wings, nothing helping it.", "The only thing acting on it once it's launched is gravity. That's the key.", "Ask kids to call out which everyday objects are or aren't projectiles."], render: () => <SA /> },
  { title: "What affects the path?", notes: ["Speed, angle, and height are the three big factors.", "Scientists figured out centuries ago that 45° is the magic angle for max distance.", "Cannonball operators used this!"], render: () => <SB /> },
  { title: "Examples", notes: ["Quick tour of everyday projectiles.", "Ask for student examples to add."], render: () => <S6 /> },
  
  { title: "Side-by-side", notes: ["Point out matching tick marks at each time step.", "Watch the animation loop together."], render: () => <S8 /> },
  { title: "Gravity", notes: ["Gravity arrow always points down.", "Equal pull, regardless of horizontal speed."], render: () => <S9 /> },
  { title: "History", notes: ["For thousands of years people believed cannonballs went forward then dropped straight down.", "Galileo (~400 years ago) figured out forward motion and falling are completely separate.", "He changed everything."], render: () => <SC /> },
  { title: "Monkey & Hunter", notes: ["This is a real classic physics thought experiment.", "Have students vote BEFORE revealing.", "Tie it back to the demo: same idea as our two balls."], render: (c) => <SD ctx={c} /> },
  { title: "Think-Pair-Share", notes: ["Give 30 seconds to discuss.", "Call on 2-3 pairs to share their reasoning."], render: () => <S10 /> },
  { title: "Equipment", notes: ["Show actual launcher and ball.", "Explain identical balls and same height."], render: () => <S11 /> },
  { title: "Final Vote", notes: ["Last chance to change vote.", "Build dramatic tension."], render: (c) => <S12 ctx={c} /> },
  { title: "DEMO", notes: ["Use the countdown button.", "Perform the live demo on GO!"], render: () => <S13 /> },
  { title: "Reveal", notes: ["Celebrate the result!", "Acknowledge the kids who voted TIE."], render: (c) => <S14 ctx={c} /> },
  { title: "Time vs Height", notes: ["Click through each time step.", "Both balls drop the same vertical distance."], render: () => <S15 /> },
  { title: "Key Insight", notes: ["Read the insight slowly.", "Repeat: sideways speed ≠ extra gravity."], render: () => <S16 /> },
  { title: "Summary", notes: ["Three bullets summarize the science.", "Cards animate in one at a time."], render: () => <S17 /> },
  { title: "Misconceptions", notes: ["Tap each card to reveal the truth.", "Bust the heavier-falls-faster myth carefully — it's the most common one."], render: () => <SI /> },
  { title: "Air Resistance", notes: ["Acknowledge the simplification.", "Science always works by simplifying first, then adding complexity back in.", "Use the crumpled-vs-flat paper example."], render: () => <SJ /> },
  
  { title: "Angry Birds", notes: ["Every shot is projectile motion.", "Players are picking launch angle and speed.", "They've been doing physics the whole time."], render: () => <SE /> },
  { title: "Outfielders", notes: ["Athletes train their brains to predict trajectories automatically.", "Physics class teaches the same skill the brain already does."], render: () => <SF /> },
  { title: "Nature", notes: ["Animals that misjudged jumps didn't survive.", "Nature is a physics teacher.", "Highlight the archerfish — incredibly cool example."], render: () => <SG /> },
  
  { title: "Pilots", notes: ["Explain why pilots aim ahead.", "Forward velocity is preserved."], render: () => <S20 /> },
  { title: "Sports", notes: ["Athletes do mental projectile math.", "Ask kids about their sports."], render: () => <S21 /> },
  { title: "Quiz 1", notes: ["One try only.", "Discuss the answer together."], render: (c) =>
    <QuizSlide ctx={c} slideNum={20} q="If I launch a ball faster horizontally, does it take longer to hit the ground?"
      choices={["Yes", "No", "Depends on the ball"]} correct={1}
      explain="Sideways speed doesn't change vertical fall time — gravity acts the same on every ball." /> },
  { title: "Quiz 2", notes: ["One try only.", "Reinforce gravity as the answer."], render: (c) =>
    <QuizSlide ctx={c} slideNum={21} q="What force pulls both balls to the ground at the same rate?"
      choices={["Magnetism", "Wind", "Gravity"]} correct={2}
      explain="Gravity pulls everything toward Earth at the same rate, regardless of sideways motion." /> },
  { title: "Quiz 3", notes: ["Pilot supply-drop scenario.", "The package keeps the plane's forward speed."], render: (c) =>
    <QuizSlide ctx={c} slideNum={22} q="A pilot at 1,000 ft wants to drop a package on a target. When should they release it?"
      choices={["Directly above the target", "BEFORE reaching the target", "AFTER passing the target"]} correct={1}
      explain="The package keeps moving forward with the plane even after release. The pilot has to account for that horizontal motion — classic projectile physics." /> },
  { title: "Quiz 4", notes: ["This question reinforces the whole demo.", "Horizontal speed has zero effect on falling time."], render: (c) =>
    <QuizSlide ctx={c} slideNum={23} q="Two balls launched sideways from the same height: Ball A at 10 mph, Ball B at 100 mph. Which hits first?"
      choices={["Ball A (slower)", "Ball B (faster)", "Same time"]} correct={2}
      explain="Horizontal speed has ZERO effect on how fast gravity pulls something down. This is the whole point of our demo — sideways speed is irrelevant to falling time." /> },
  { title: "Recap", notes: ["Five big ideas in one slide.", "Have students repeat them aloud."], render: () => <S23 /> },
  { title: "Closing", notes: ["End with the orbit fun fact.", "Open the floor for questions.", "Restart button is on this slide."], render: (c) => <S24 ctx={c} /> },
];
