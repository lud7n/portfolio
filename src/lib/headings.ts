export type Heading = { id: string; text: string; level: number };

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractHeadings(markdown: string): Heading[] {
  const regex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    const id = count === 0 ? base : `${base}-${count}`;
    seen.set(base, count + 1);
    headings.push({ id, text, level });
  }
  return headings;
}
