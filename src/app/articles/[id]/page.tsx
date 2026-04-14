import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticles, getArticle } from "@/lib/notion";
import { extractHeadings, slugify } from "@/lib/headings";
import ArticleToc from "@/components/ArticleToc";
import ArticleBackground from "@/components/ArticleBackground";

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

// ReactMarkdown用の見出しコンポーネントファクトリ（extractHeadingsと同じ重複解決ロジック）
const HEADING_MARGIN: Record<number, string> = {
  1: "2rem",
  2: "2.5rem",
  3: "1.75rem",
  4: "1.5rem",
};

function makeHeadingComponents() {
  const seen = new Map<string, number>();
  const make = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function HeadingComponent({ children }: any) {
      const text = typeof children === "string" ? children
        : Array.isArray(children) ? children.join("") : "";
      const base = slugify(text);
      const count = seen.get(base) ?? 0;
      const id = count === 0 ? base : `${base}-${count}`;
      seen.set(base, count + 1);
      return <Tag id={id} style={{ marginTop: HEADING_MARGIN[level] ?? "2rem", marginBottom: "0.75rem" }}>{children}</Tag>;
    };
  };
  return { h1: make(1), h2: make(2), h3: make(3), h4: make(4) };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { article, content } = await getArticle(id);
  const headings = extractHeadings(content);
  const headingComponents = makeHeadingComponents();

  return (
    <main className="min-h-screen w-full relative" style={{ paddingTop: "10rem", paddingBottom: "8rem" }}>
      <ArticleBackground />
      <div
        style={{
          maxWidth: "48rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "clamp(2rem, 5vw, 5rem)",
          paddingRight: "clamp(2rem, 5vw, 5rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* メインコンテンツ */}
        <div>
            {/* Meta */}
            <div style={{ marginBottom: "2.5rem" }}>
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
              <p className="text-sm font-mono text-white/50">
                {formatDate(article.date)}
              </p>
            </div>

            <div className="h-px bg-white/[0.06]" style={{ marginBottom: "2.5rem" }} />

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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ...headingComponents,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  img: ({ src, alt }: any) => (
                    <img src={src} alt={alt ?? ""} style={{ marginTop: "2rem", marginBottom: "2rem", borderRadius: "0.5rem" }} />
                  ),
                  table: ({ children }: any) => (
                    <div style={{ overflowX: "auto", margin: "2rem 0" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }: any) => (
                    <thead style={{ borderBottom: "1px solid rgba(99,102,241,0.3)" }}>{children}</thead>
                  ),
                  th: ({ children }: any) => (
                    <th style={{ padding: "0.6rem 1rem", textAlign: "left", color: "rgba(129,140,248,0.8)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                      {children}
                    </th>
                  ),
                  tr: ({ children }: any) => (
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{children}</tr>
                  ),
                  td: ({ children }: any) => (
                    <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.6)", verticalAlign: "top" }}>
                      {children}
                    </td>
                  ),
                  ul: ({ children }: any) => (
                    <ul style={{ margin: "1.25rem 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }: any) => (
                    <ol style={{ margin: "1.25rem 0", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem", color: "rgba(255,255,255,0.65)", fontSize: "0.925rem", lineHeight: "1.7" }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ordered }: any) => ordered ? (
                    <li style={{ color: "rgba(255,255,255,0.65)", lineHeight: "1.7", paddingLeft: "0.25rem" }}>
                      {children}
                    </li>
                  ) : (
                    <li style={{ display: "flex", gap: "0.75rem", alignItems: "baseline", color: "rgba(255,255,255,0.65)", fontSize: "0.925rem", lineHeight: "1.7" }}>
                      <span style={{ flexShrink: 0, color: "rgba(99,102,241,0.7)", fontSize: "0.7rem", paddingTop: "0.25rem" }}>▸</span>
                      <span>{children}</span>
                    </li>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

        </div>
      </div>

      {/* ToC: fixed で右端に浮かせる */}
      {headings.length > 0 && <ArticleToc headings={headings} />}
    </main>
  );
}
