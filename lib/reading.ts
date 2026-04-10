export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ');
}

export function countWordsAndReadingTime(input: string) {
  const text = stripHtml(input).replace(/\s+/g, ' ').trim();
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const nonChineseText = text.replace(/[\u4e00-\u9fa5]/g, ' ');
  const wordCount = nonChineseText.split(/\s+/).filter(Boolean).length;
  const totalCount = chineseCharCount + wordCount;
  const minutes = Math.max(1, Math.ceil(totalCount / 300));

  return { totalCount, minutes };
}
