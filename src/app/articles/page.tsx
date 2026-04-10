import { getArticles } from "@/lib/notion";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import ArticlesHeader from "@/components/ArticlesHeader";

export const revalidate = false;

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen w-full" style={{ paddingTop: "10rem", paddingBottom: "18rem" }}>
      <div className="max-w-5xl mx-auto px-8 md:px-20">

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
