import { prisma } from '@/lib/prisma';

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '');
}

export async function GET() {
  const baseUrl = 'https://vichengnet.com';

  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });

  const items = posts
    .map((post) => {
      const link = `${baseUrl}/posts/${post.slug}`;
      const description = escapeXml(post.summary || stripHtml(post.content || '').slice(0, 160));

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <description>${description}</description>
          <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
        </item>
      `;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>维成小站</title>
      <link>${baseUrl}</link>
      <description>一个简洁、安静、内容优先的个人站点。</description>
      <language>zh-CN</language>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
