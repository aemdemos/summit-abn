/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-flip-cards.
 * Base: columns. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (columns):
 *   Row with N columns, each containing text/images/links.
 *
 * Source DOM: Instance selector .abde-flip-card-wrapper is inside a nested
 *   .abde-layout within the right column. Must navigate up to nearest <section>
 *   to access both columns:
 *     Left (col-mdlg-5): text with h2 "Dedicated Focus", paragraph, CTA button
 *     Right (col-mdlg-7): flip cards with icon, heading (front) and description (back)
 */
export default function parse(element, { document }) {
  // If already processed (element detached), skip
  if (!element.parentNode) return;

  // Navigate up to the parent section containing both columns
  const section = element.closest('section');
  const searchRoot = section || element.parentElement;

  // Column 1: Text content (heading + description + CTA)
  // Found in DOM: .abde-text-description h2 "Dedicated Focus" + p + a.abde-btn
  const col1Content = [];

  const heading = searchRoot.querySelector('.abde-text-description h2')
    || searchRoot.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    col1Content.push(h2);
  }

  const desc = searchRoot.querySelector('.abde-text-description p');
  if (desc && desc.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    col1Content.push(p);
  }

  const cta = searchRoot.querySelector('a.abde-btn');
  if (cta) {
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
    col1Content.push(link);
  }

  // Column 2: Flip cards content
  // Found in DOM: .abde-flip-card-wrapper elements, each with front (icon + heading)
  // and back (description). Exclude javascript: trigger links.
  const flipCards = searchRoot.querySelectorAll('.abde-flip-card-wrapper');
  const col2Content = [];

  flipCards.forEach((card) => {
    // Front: icon image
    const frontIcon = card.querySelector('.abde-flip-card-inner-front-container img');
    if (frontIcon) {
      const iconImg = document.createElement('img');
      iconImg.src = frontIcon.src;
      iconImg.alt = frontIcon.alt || '';
      col2Content.push(iconImg);
    }

    // Front: heading text
    const frontHeading = card.querySelector('.abde-flip-icons-heading');
    if (frontHeading) {
      const h3 = document.createElement('h3');
      h3.textContent = frontHeading.textContent.trim();
      col2Content.push(h3);
    }

    // Back: description paragraph
    const backDesc = card.querySelector('.abde-flip-card-inner-back-container .abde-description p')
      || card.querySelector('.abde-flip-card-inner-back-container p');
    if (backDesc) {
      const p = document.createElement('p');
      p.textContent = backDesc.textContent.trim();
      col2Content.push(p);
    }
  });

  // Remove the text column and other flip cards from DOM to prevent duplication
  const textCol = searchRoot.querySelector('[class*="abde-col-mdlg-5"]');
  if (textCol && textCol !== element.closest('[class*="abde-col-mdlg-5"]')) {
    textCol.remove();
  }

  // Remove all flip-card-wrapper elements except the matched one
  flipCards.forEach((card) => {
    if (card !== element) card.remove();
  });

  const cells = [];
  cells.push([col1Content, col2Content]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-flip-cards',
    cells,
  });
  element.replaceWith(block);
}
