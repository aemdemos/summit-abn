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
    const optimizedImg = optimized.querySelector('img');
    if (optimizedImg) {
      optimizedImg.setAttribute('width', '750');
      optimizedImg.setAttribute('height', '422');
    }
    moveInstrumentation(img, optimizedImg);
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

    // Body column has a fixed sequence: category <p>, title <h3>, date <p>, author <p>, description <p>
    const body = document.createElement('div');
    body.className = 'cards-insights-body';

    if (bodyCol) {
      const children = [...bodyCol.querySelectorAll(':scope > p, :scope > h3')];
      const classMap = ['cards-insights-category', 'cards-insights-title', 'cards-insights-date', 'cards-insights-author', 'cards-insights-description'];
      let idx = 0;

      children.forEach((el) => {
        if (el.tagName === 'H3') idx = 1;
        const cls = classMap[idx] || 'cards-insights-description';
        if (cls === 'cards-insights-title') {
          const titleDiv = document.createElement('div');
          titleDiv.className = cls;
          titleDiv.append(el);
          body.append(titleDiv);
        } else if (cls === 'cards-insights-category') {
          el.className = cls;
        } else {
          el.className = cls;
          body.append(el);
        }
        idx += 1;
      });
    }

    // Assemble card: category → image → body
    const categoryEl = bodyCol?.querySelector('.cards-insights-category');
    if (categoryEl) card.append(categoryEl);
    if (imageWrapper) card.append(imageWrapper);
    card.append(body);

    grid.append(card);
  });

  block.append(grid);
}
