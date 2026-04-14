import { getArticles } from "@/lib/notion";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import ArticlesHeader from "@/components/ArticlesHeader";
import ArticlesBackground from "@/components/ArticlesBackground";

export const revalidate = false;

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen w-full relative" style={{ paddingTop: "10rem", paddingBottom: "18rem" }}>
      <ArticlesBackground />
      <div style={{ maxWidth: "72rem", marginLeft: "auto", marginRight: "auto", paddingLeft: "clamp(2rem, 5vw, 5rem)", paddingRight: "clamp(2rem, 5vw, 5rem)", position: "relative", zIndex: 10 }}>

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
