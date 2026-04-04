import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

export type Article = {
  id: string;
  title: string;
  date: string;
  tags: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArticle(page: any): Article {
  // タイトル型のプロパティを名前に関係なく探す
  const titleProp = Object.values(page.properties).find(
    (p: any) => p.type === "title"
  ) as any;

  return {
    id: page.id,
    title: titleProp?.title?.[0]?.plain_text ?? "Untitled",
    date: page.properties.Date?.date?.start ?? "",
    tags: page.properties.Tags?.multi_select?.map((t: { name: string }) => t.name) ?? [],
  };
}

export async function getArticles(): Promise<Article[]> {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_DB_ID!,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
  });
  return res.results.map(toArticle);
}

export async function getArticle(id: string): Promise<{ article: Article; content: string }> {
  const page = await notion.pages.retrieve({ page_id: id });
  const mdBlocks = await n2m.pageToMarkdown(id);
  const content = n2m.toMarkdownString(mdBlocks).parent;
  return { article: toArticle(page), content };
}
