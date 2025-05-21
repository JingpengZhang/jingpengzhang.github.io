/**
 * 去除 HTML 标签
 * @param html
 * @returns
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
