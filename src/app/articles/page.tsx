import Link from "next/link";
import { getArticles } from "@/lib/notion";

export const revalidate = false; // static export

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen w-full" style={{ paddingTop: "10rem", paddingBottom: "8rem" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-16">

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

        {/* Article list */}
        {articles.length === 0 ? (
          <p className="text-white/30 text-sm tracking-wide">No articles yet.</p>
        ) : (
          <div className="space-y-0">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group block border-b border-white/[0.06] py-8 hover:border-white/20 transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-white/80 group-hover:text-white transition-colors duration-300 leading-snug mb-3">
                      {article.title}
                    </h2>
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] tracking-[0.2em] uppercase text-indigo-400/60 border border-indigo-400/20 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[11px] tracking-[0.2em] text-white/25 group-hover:text-white/40 transition-colors duration-300">
                      {formatDate(article.date)}
                    </span>
                    <div className="mt-2 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 text-sm">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
