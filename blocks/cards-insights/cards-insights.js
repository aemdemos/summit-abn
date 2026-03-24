import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildImageWrapper(imageCol) {
  if (!imageCol) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'cards-insights-image';
  const img = (imageCol.querySelector('picture') || imageCol).querySelector('img');
  if (img && img.src) {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 600px)', width: '750' },
      { width: '400' },
    ]);
    moveInstrumentation(img, optimized.querySelector('img'));
    wrapper.append(optimized);
  }
  return wrapper;
}

export default function decorate(block) {
  const cards = [...block.children];
  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'cards-insights-grid';

  cards.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'cards-insights-card';
    moveInstrumentation(row, card);

    const cols = [...row.children];
    const imageWrapper = buildImageWrapper(cols[0]);
    const bodyCol = cols[1];

    // Build card body and extract category
    let categoryEl;
    const body = document.createElement('div');
    body.className = 'cards-insights-body';

    if (bodyCol !== undefined && bodyCol !== null) {
      const elements = [...bodyCol.querySelectorAll(':scope > p, :scope > h3')];

      elements.forEach((el) => {
        if (el.tagName === 'H3') {
          const titleDiv = document.createElement('div');
          titleDiv.className = 'cards-insights-title';
          titleDiv.append(el);
          body.append(titleDiv);
        } else if (el.tagName === 'P') {
          const text = el.textContent.trim();
          const links = el.querySelectorAll('a');

          if (!categoryEl && links.length === 0 && text.length < 40 && !text.includes('/')) {
            el.className = 'cards-insights-category';
            categoryEl = el;
          } else if (text.match(/\b\d{4}\b/) && text.includes('/')) {
            el.className = 'cards-insights-date';
            body.append(el);
          } else if (links.length > 0 && text.length < 80 && !text.match(/\b\d{4}\b/)) {
            el.className = 'cards-insights-author';
            body.append(el);
          } else {
            el.className = 'cards-insights-description';
            body.append(el);
          }
        }
      });
    }

    // Assemble card: category → image → body
    if (categoryEl) card.append(categoryEl);
    if (imageWrapper) card.append(imageWrapper);
    card.append(body);

    grid.append(card);
  });

  block.append(grid);
}
