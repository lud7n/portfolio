import { getArticles } from "@/lib/notion";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import ArticlesHeader from "@/components/ArticlesHeader";

export const revalidate = false;

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen w-full" style={{ paddingTop: "10rem", paddingBottom: "18rem" }}>
      <div className="max-w-5xl mx-auto" style={{ paddingLeft: "clamp(2rem, 5vw, 5rem)", paddingRight: "clamp(2rem, 5vw, 5rem)" }}>

        <ArticlesHeader count={articles.length} />

        <div style={{ height: "3rem" }} />

        {articles.length === 0 ? (
          <p className="text-white/30 text-sm tracking-wide">No articles yet.</p>
        ) : (
          <ArticleCardGrid articles={articles} />
        )}
      </div>
    </main>
  );
}
