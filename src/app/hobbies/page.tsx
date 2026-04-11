"use client";

import { useEffect, useRef, useState } from "react";
import { lenisInstance } from "@/components/SmoothScrollProvider";

// ────────────────────────────────────────────
// CodeRain background
// ────────────────────────────────────────────

const CODE_LINES = [
  "const bfs = (graph, start) => {",
  "  const queue = [start];",
  "  while (queue.length) {",
  "    const node = queue.shift();",
  "  }",
  "};",
  "function useDrag(ref) {",
  "  const [pos, setPos] = useState({x:0,y:0});",
  "  return pos;",
  "}",
  "gsap.fromTo('.el',",
  "  { opacity: 0, y: 40 },",
  "  { opacity: 1, y: 0 }",
  ");",
  "type Hobby = {",
  "  id: string;",
  "  label: string;",
  "  tags: string[];",
  "};",
  "SELECT * FROM hobbies",
  "  WHERE passion > 0.8;",
  "int dist[N][N] = {};",
  "priority_queue<int> pq;",
  "pq.push({0, start});",
  "while (!pq.empty()) {",
  "  auto [d, v] = pq.top();",
  "  pq.pop();",
  "}",
  "git commit -m 'feat: hobbies'",
  "npm run dev",
  "export default function Page() {",
  "  return <Canvas />;",
  "}",
];

function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const FONT_SIZE = 11;
    const LINE_H    = 22;
    const COL_W     = 220;
    const COLS      = Math.ceil(window.innerWidth / COL_W) + 1;

    type Col = { x: number; y: number; lineIdx: number; speed: number; opacity: number };

    const cols: Col[] = Array.from({ length: COLS }, (_, i) => ({
      x:       i * COL_W + Math.random() * 60 - 30,
      y:       Math.random() * -window.innerHeight,
      lineIdx: Math.floor(Math.random() * CODE_LINES.length),
      speed:   0.3 + Math.random() * 0.4,
      opacity: 0.03 + Math.random() * 0.055,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;

      for (const col of cols) {
        // 数行ずつ縦に描画
        for (let j = 0; j < 12; j++) {
          const idx = (col.lineIdx + j) % CODE_LINES.length;
          const alpha = col.opacity * (1 - j / 12);
          ctx.fillStyle = `rgba(99,102,241,${alpha})`;
          ctx.fillText(CODE_LINES[idx], col.x, col.y + j * LINE_H);
        }
        col.y += col.speed;
        if (col.y > canvas.height + 200) {
          col.y = -LINE_H * 14;
          col.lineIdx = Math.floor(Math.random() * CODE_LINES.length);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        filter: "blur(1.5px)",
      }}
    />
  );
}

// ────────────────────────────────────────────
// Data
// ────────────────────────────────────────────

const hobbies = [
  {
    id: "atcoder",
    filename: "atcoder.txt",
    label: "競技プログラミング",
    content: [
      "■ 競技プログラミング / AtCoder",
      "",
      "  大学2年から継続中。Highestレートは緑上位。",
      "  BFS・DFS などグラフ系アルゴリズムが特に好き。",
      "  数学的思考を鍛える場として、今も定期的に取り組んでいる。",
      "",
      "  Tags: C++, AtCoder, Algorithm, Graph",
    ],
  },
  {
    id: "design",
    filename: "design.txt",
    label: "デザイン",
    content: [
      "■ UI / グラフィックデザイン",
      "",
      "  Figma・Illustratorを使ったUI設計やグラフィック制作。",
      "  「なぜそのデザインか」を言語化できることを大切にしている。",
      "  デザインコースで学んだスライド・サービス・3Dデザインも経験あり。",
      "",
      "  Tags: Figma, Illustrator, UI/UX, Typography",
    ],
  },
  {
    id: "blender",
    filename: "blender.txt",
    label: "3Dモデリング",
    content: [
      "■ 3Dモデリング / Blender",
      "",
      "  プロダクトデザインの授業をきっかけにBlenderを始めた。",
      "  ハードサーフェス系のモデリングが好み。",
      "  実際にレーザーカッターで出力した経験もある。",
      "",
      "  Tags: Blender, 3D, Product Design",
    ],
  },
  {
    id: "music",
    filename: "music.txt",
    label: "音楽",
    content: [
      "■ 音楽 / Listening",
      "",
      "  作業中はずっと音楽を聴いている。ジャンルは問わない。",
      "  集中できる音楽をひたすら発掘するのが習慣になっている。",
      "",
      "  Tags: Music, Ambient, Focus",
    ],
  },
  {
    id: "math",
    filename: "math.txt",
    label: "数学",
    content: [
      "■ 数学 / Pure Math",
      "",
      "  計算量の見積もりや証明を考えるのが楽しい。",
      "  競プロを通じて数学的思考がさらに鍛えられた。",
      "  線形代数・組み合わせ論あたりが特に好き。",
      "",
      "  Tags: Math, Linear Algebra, Combinatorics",
    ],
  },
  {
    id: "portfolio",
    filename: "portfolio.txt",
    label: "サイト制作",
    content: [
      "■ ポートフォリオ / Personal Dev",
      "",
      "  個人ポートフォリオを継続的に改善し続けている。",
      "  現在 Ver.4.0 を制作中。GSAP や Lenis を使った",
      "  インタラクションの実装が楽しい。",
      "",
      "  Tags: Next.js, GSAP, TypeScript, Tailwind CSS",
    ],
  },
];

// ────────────────────────────────────────────
// Typewriter hook
// ────────────────────────────────────────────

function useTypewriter(text: string, speed = 18, onDone?: () => void) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    const type = () => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
        timer.current = setTimeout(type, speed);
      } else {
        onDone?.();
      }
    };
    timer.current = setTimeout(type, speed);
    return () => { if (timer.current) clearTimeout(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return displayed;
}

// ────────────────────────────────────────────
// Terminal line types
// ────────────────────────────────────────────

type Line =
  | { type: "prompt"; text: string }
  | { type: "output"; text: string }
  | { type: "list" }
  | { type: "file-output"; lines: string[] };

// ────────────────────────────────────────────
// Page
// ────────────────────────────────────────────

const PROMPT = "lud7n@portfolio:~/hobbies$ ";

function LsPrompt({ onDone }: { onDone: () => void }) {
  const d = useTypewriter(`${PROMPT}ls`, 28, onDone);
  return (
    <div>
      <span style={{ color: "rgba(52,211,153,0.7)" }}>{d.slice(0, PROMPT.length)}</span>
      <span style={{ color: "rgba(255,255,255,0.7)" }}>{d.slice(PROMPT.length)}</span>
    </div>
  );
}

function CatPrompt({ hobby, onDone }: { hobby: typeof hobbies[0]; onDone: () => void }) {
  const cmd = `${PROMPT}cat ${hobby.filename}`;
  const d = useTypewriter(cmd, 22, onDone);
  return (
    <div>
      <span style={{ color: "rgba(52,211,153,0.7)" }}>{d.slice(0, PROMPT.length)}</span>
      <span style={{ color: "rgba(255,255,255,0.7)" }}>{d.slice(PROMPT.length)}</span>
    </div>
  );
}

export default function Hobbies() {
  const [lines, setLines] = useState<Line[]>([]);
  const [phase, setPhase] = useState<"init" | "ls" | "ready" | "cat" | "done">("init");
  const [selectedHobby, setSelectedHobby] = useState<typeof hobbies[0] | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // ページトップにリセット
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
  }, []);

  // ターミナル内の自動スクロール（ページ全体ではなくコンテナ内のみ）
  useEffect(() => {
    const el = terminalRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, phase]);

  // 起動シーケンス
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ls"), 400);
    return () => clearTimeout(t1);
  }, []);

  const handleLsDone = () => {
    setLines(prev => [...prev, { type: "list" }]);
    setTimeout(() => setPhase("ready"), 300);
  };

  const handleCatDone = () => {
    if (!selectedHobby) return;
    setLines(prev => [...prev, { type: "file-output", lines: selectedHobby.content }]);
    setTimeout(() => setPhase("ready"), 400);
  };

  const handleSelect = (h: typeof hobbies[0]) => {
    if (phase !== "ready") return;
    setSelectedHobby(h);
    setLines(prev => [...prev, { type: "output", text: "" }]);
    setPhase("cat");
  };

  return (
    <div style={{ width: "100vw", height: "calc(100vh - 64px)", background: "#06080f", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* ノイズ */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }} />

      {/* D: 流れるコード背景 */}
      <CodeRain />

      {/* ターミナルウィンドウ */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "min(760px, 92vw)",
        height: "min(480px, 72vh)",
        background: "rgba(8,10,18,0.96)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}>
        {/* タイトルバー */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
            hobbies — bash
          </span>
        </div>

        {/* コンテンツ */}
        <div ref={terminalRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.65)" }}>

          {/* 既存ライン */}
          {lines.map((line, i) => {
            if (line.type === "prompt") {
              return <div key={i}><span style={{ color: "rgba(52,211,153,0.7)" }}>{line.text.slice(0, PROMPT.length)}</span><span>{line.text.slice(PROMPT.length)}</span></div>;
            }
            if (line.type === "output") {
              return <div key={i} style={{ color: "rgba(255,255,255,0.4)" }}>{line.text}</div>;
            }
            if (line.type === "list") {
              return (
                <div key={i} style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
                    # ファイルを選択してください
                  </div>
                </div>
              );
            }
            if (line.type === "file-output") {
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  {line.lines.map((l, j) => (
                    <div key={j} style={{ color: l.startsWith("■") ? "rgba(255,255,255,0.8)" : l.startsWith("  Tags") ? "rgba(99,102,241,0.8)" : l === "" ? undefined : "rgba(255,255,255,0.45)" }}>
                      {l || "\u00A0"}
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}

          {/* アクティブフェーズ */}
          {phase === "ls" && (
            <LsPrompt onDone={handleLsDone} />
          )}
          {phase === "cat" && selectedHobby && (
            <CatPrompt hobby={selectedHobby} onDone={handleCatDone} />
          )}
          {phase === "ready" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "rgba(52,211,153,0.7)" }}>{PROMPT}</span>
              <span style={{
                display: "inline-block", width: 8, height: 15,
                background: "rgba(255,255,255,0.6)", marginLeft: 1,
                animation: "blink 1.1s step-end infinite",
              }} />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ファイル選択ボタン（スクロール非依存の固定エリア） */}
        {(phase === "ready" || phase === "cat" || phase === "done") && (
          <div style={{ padding: "10px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {hobbies.map(h => (
              <button
                key={h.id}
                onClick={() => handleSelect(h)}
                disabled={phase !== "ready"}
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: phase === "ready" ? "#818cf8" : "#4f46e5",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderBottom: "2px solid rgba(99,102,241,0.5)",
                  borderRadius: 4,
                  padding: "3px 10px",
                  cursor: phase === "ready" ? "pointer" : "default",
                  transition: "all 0.15s ease",
                  outline: "none",
                }}
                onMouseEnter={e => {
                  if (phase !== "ready") return;
                  const el = e.currentTarget;
                  el.style.background = "rgba(99,102,241,0.18)";
                  el.style.borderColor = "rgba(99,102,241,0.7)";
                  el.style.color = "#a5b4fc";
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(99,102,241,0.08)";
                  el.style.borderColor = "rgba(99,102,241,0.3)";
                  el.style.borderBottomColor = "rgba(99,102,241,0.5)";
                  el.style.color = "#818cf8";
                  el.style.transform = "translateY(0)";
                }}
                onMouseDown={e => { e.currentTarget.style.transform = "translateY(1px)"; e.currentTarget.style.borderBottomWidth = "1px"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderBottomWidth = "2px"; }}
              >
                {h.filename}
              </button>
            ))}
          </div>
        )}

        {/* ヒント */}
        <div style={{ padding: "8px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", flexShrink: 0 }}>
          click a filename to read
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
