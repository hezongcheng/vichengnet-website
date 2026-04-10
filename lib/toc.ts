export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function extractTocFromHtml(html: string): TocItem[] {
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]) as 2 | 3;
    const rawText = match[2] || '';
    const text = rawText.replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    items.push({ id: slugifyHeading(text), text, level });
  }

  return items;
}

export function injectHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (_, level, attrs, inner) => {
    const text = String(inner).replace(/<[^>]+>/g, '').trim();
    const id = slugifyHeading(text);
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}
