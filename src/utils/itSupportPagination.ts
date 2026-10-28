export interface KeepRange { top: number; bottom: number }

/** Choose a cut in whitespace, never through a row, image or text line. */
export function safePageEnd(start: number, limit: number, ranges: KeepRange[]): number {
  let end = limit;
  for (;;) {
    const crossing = ranges.filter(r => r.top < end - 0.5 && r.bottom > end + 0.5 && r.top > start + 0.5);
    if (!crossing.length) return end;
    end = Math.min(...crossing.map(r => r.top));
  }
}

export function paginateSupportCanvas(node: HTMLElement, canvas: HTMLCanvasElement): HTMLCanvasElement[] {
  const bounds = node.getBoundingClientRect();
  const scale = canvas.width / bounds.width;
  const pageHeight = Math.round(canvas.width * 297 / 210);
  const inset = Math.round(24 * scale);
  const capacity = pageHeight - inset * 2;
  const ranges: KeepRange[] = [];
  const add = (rect: DOMRect) => {
    const top = Math.max(0, Math.floor((rect.top - bounds.top) * scale) - 1);
    const bottom = Math.ceil((rect.bottom - bounds.top) * scale) + 1;
    // Oversized sections are divided at their inner rows or text lines instead.
    if (bottom > top && bottom - top < capacity) ranges.push({ top, bottom });
  };
  node.querySelectorAll<HTMLElement>('[data-keep="1"], #prop-financ-block, #prop-suporte-block, #prop-aceite-block, tr, img, svg').forEach(el => add(el.getBoundingClientRect()));
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let text = walker.nextNode();
  while (text) {
    if (text.textContent?.trim()) {
      const range = document.createRange();
      range.selectNodeContents(text);
      Array.from(range.getClientRects()).forEach(add);
    }
    text = walker.nextNode();
  }

  const pages: HTMLCanvasElement[] = [];
  // The cover has its own fixed A4 layout and no inner margins.
  const cover = node.firstElementChild;
  let start = cover ? Math.round((cover.getBoundingClientRect().bottom - bounds.top) * scale) : 0;
  const append = (from: number, to: number, margin: number) => {
    const page = document.createElement('canvas');
    page.width = canvas.width;
    page.height = pageHeight;
    const ctx = page.getContext('2d');
    if (!ctx) throw new Error('Não foi possível renderizar a página da proposta.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, page.width, page.height);
    ctx.drawImage(canvas, 0, from, canvas.width, to - from, 0, margin, canvas.width, to - from);
    pages.push(page);
  };
  if (start > 0) append(0, start, 0);
  while (start < canvas.height) {
    const limit = Math.min(start + capacity, canvas.height);
    const end = Math.floor(safePageEnd(start, limit, ranges));
    append(start, end, inset);
    start = end;
  }
  return pages;
}