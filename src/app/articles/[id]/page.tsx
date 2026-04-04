import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticles, getArticle } from "@/lib/notion";

export const revalidate = false;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ id: a.id }));
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { article, content } = await getArticle(id);

  return (
    <main className="min-h-screen w-full" style={{ paddingTop: "10rem", paddingBottom: "8rem" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-16">

        {/* Back */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-3 text-white/30 hover:text-white/70 transition-colors duration-300 mb-16 text-[11px] tracking-[0.3em] uppercase"
        >
          ← Articles
        </Link>

        {/* Meta */}
        <div className="mb-12">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
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
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-white mb-4">
            {article.title}
          </h1>
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/25">
            {formatDate(article.date)}
          </p>
        </div>

        <div className="h-px bg-white/[0.06] mb-12" />

        {/* Content */}
        <div className="prose prose-invert prose-sm md:prose-base max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white/90
          prose-p:text-white/60 prose-p:leading-relaxed
          prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white/80
          prose-code:text-indigo-300 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
          prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/[0.08]
          prose-blockquote:border-l-indigo-500/50 prose-blockquote:text-white/40
          prose-hr:border-white/[0.06]
          prose-li:text-white/60"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-white/[0.06]">
          <Link
            href="/articles"
            className="inline-flex items-center gap-3 text-white/30 hover:text-white/70 transition-colors duration-300 text-[11px] tracking-[0.3em] uppercase"
          >
            ← 記事一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
