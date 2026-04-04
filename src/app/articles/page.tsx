import Link from "next/link";
import { getArticles } from "@/lib/notion";

export const revalidate = false;

function formatDate(dateStr: string) {
  if (!dateStr) return "----/--/--";
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

const CARD_COLOR = {
  border: "rgba(99,102,241,0.25)",
  glow: "rgba(99,102,241,0.08)",
  stripe: "linear-gradient(90deg, #6366f1, #818cf8)",
  tag: "text-indigo-300/60 border-indigo-400/20",
  date: "text-indigo-300/50",
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  const c = CARD_COLOR;

  return (
    <main className="min-h-screen w-full" style={{ paddingTop: "10rem", paddingBottom: "8rem" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="flex items-baseline justify-between mb-20">
          <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-full">
            Articles
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">
            {articles.length} posts
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-20">
          Writing &{" "}
          <span className="text-indigo-400">Thinking</span>
        </h1>

        <div style={{ height: "3rem" }} />

        {articles.length === 0 ? (
          <p className="text-white/30 text-sm tracking-wide">No articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 2px 24px rgba(0,0,0,0.3)",
                }}
              >
                <div className="h-[3px] w-full shrink-0" style={{ background: c.stripe }} />

                <div className="flex flex-col flex-1" style={{ padding: "1.25rem 1.5rem" }}>
                  <p className={`text-[11px] tracking-[0.2em] font-mono mb-5 ${c.date}`}>
                    {formatDate(article.date)}
                  </p>

                  <h2 className="text-sm md:text-base font-semibold text-white/70 group-hover:text-white transition-colors duration-300 leading-snug flex-1">
                    {article.title}
                  </h2>

                  <div className="flex items-end justify-between gap-3 mt-5">
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[9px] tracking-[0.2em] uppercase border px-2 py-0.5 rounded-full ${c.tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-white/25 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-sm shrink-0">
                      ↗
                    </span>
                  </div>
                </div>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${c.glow} 0%, transparent 60%)` }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
