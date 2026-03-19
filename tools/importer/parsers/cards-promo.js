/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo.
 * Base: cards. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (cards):
 *   Each row: Column 1 = image | Column 2 = text content (title, description, CTA)
 *
 * Source DOM: Instance selector .abde-card-generic.hoverenabled matches each card.
 *   Each card has: eyebrow, linked image, linked h4, description paragraph, text-link CTA.
 *   Navigate up to find all sibling cards to create a single cards block.
 */
export default function parse(element, { document }) {
  // If already processed (element detached), skip
  if (!element.parentNode) return;

  // Navigate up to container with all cards
  const section = element.closest('section');
  const searchRoot = section || element.parentElement;

  // Find all promo cards in this section
  const cards = searchRoot.querySelectorAll('.abde-card-generic.hoverenabled');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Card image
    // Found in DOM: a > img inside card
    const img = card.querySelector('a > img') || card.querySelector('img');
    let col1;
    if (img) {
      col1 = document.createElement('img');
      col1.src = img.getAttribute('src') || img.src;
      col1.alt = img.alt || '';
    } else {
      col1 = '';
    }

    // Column 2: Text content
    const textContent = [];

    // Eyebrow
    // Found in DOM: .abde-card-eyebrow
    const eyebrow = card.querySelector('.abde-card-eyebrow');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textContent.push(p);
    }

    // Title (h4 with link)
    // Found in DOM: .abde-text-container a > h4
    const titleLink = card.querySelector('.abde-text-container a');
    const titleEl = card.querySelector('h4');
    if (titleEl) {
      const h4 = document.createElement('h4');
      if (titleLink) {
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href') || titleLink.href;
        a.textContent = titleEl.textContent.trim();
        h4.appendChild(a);
      } else {
        h4.textContent = titleEl.textContent.trim();
      }
      textContent.push(h4);
    }

    // Description
    // Found in DOM: .abde-text-container p
    const descP = card.querySelector('.abde-text-container p');
    if (descP && descP.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descP.textContent.trim();
      textContent.push(p);
    }

    // CTA text-link
    // Found in DOM: a.abde-text-link
    const ctaLink = card.querySelector('a.abde-text-link');
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href') || ctaLink.href;
      a.textContent = ctaLink.textContent.trim().replace(/\s+/g, ' ');
      textContent.push(a);
    }

    if (col1 || textContent.length > 0) {
      cells.push([col1 || '', textContent]);
    }
  });

  // Remove other card elements from DOM to prevent duplication
  cards.forEach((card) => {
    if (card !== element) card.remove();
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-promo',
    cells,
  });
  element.replaceWith(block);
}
