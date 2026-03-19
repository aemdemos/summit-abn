/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-insights.
 * Base: cards. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (cards):
 *   Each row: Column 1 = image | Column 2 = text content (title, description, CTA)
 *
 * Source DOM: .abde-related-insights-container contains .abde-card-insight-generic
 *   cards with header (category), image, title, date, author, description.
 */
export default function parse(element, { document }) {
  // Find all insight card items
  // Found in DOM: .abde-card-insight-generic elements within .abde-related-insights-container
  const cards = element.querySelectorAll('.abde-card-insight-generic');

  const cells = [];

  cards.forEach((card) => {
    // Column 1: Card image
    // Found in DOM: .abde-image-container img, or img.img-fluid
    const image = card.querySelector('.abde-image-container img')
      || card.querySelector('img.img-fluid')
      || card.querySelector('img');

    // Column 2: Text content
    const textContent = [];

    // Category header
    // Found in DOM: header element with category text
    const category = card.querySelector('header');
    if (category) {
      const p = document.createElement('p');
      p.textContent = category.textContent.trim();
      textContent.push(p);
    }

    // Title link
    // Found in DOM: .abde-card-insight-title
    const titleEl = card.querySelector('.abde-card-insight-title');
    if (titleEl) {
      const titleLink = titleEl.closest('a');
      if (titleLink) {
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = titleEl.textContent.trim();
        h3.appendChild(a);
        textContent.push(h3);
      } else {
        const h3 = document.createElement('h3');
        h3.textContent = titleEl.textContent.trim();
        textContent.push(h3);
      }
    }

    // Date and read time
    // Found in DOM: .abde-card-insight-date
    const dateEl = card.querySelector('.abde-card-insight-date');
    if (dateEl) {
      const p = document.createElement('p');
      p.textContent = dateEl.textContent.trim();
      textContent.push(p);
    }

    // Author(s)
    // Found in DOM: .abde-card-insight-author
    const authorEl = card.querySelector('.abde-card-insight-author');
    if (authorEl) {
      const p = document.createElement('p');
      const authorLinks = authorEl.querySelectorAll('a');
      if (authorLinks.length > 0) {
        authorLinks.forEach((aLink, idx) => {
          if (idx > 0) p.appendChild(document.createTextNode(', '));
          const a = document.createElement('a');
          a.href = aLink.href;
          a.textContent = aLink.textContent.trim();
          p.appendChild(a);
        });
      } else {
        p.textContent = authorEl.textContent.trim();
      }
      textContent.push(p);
    }

    // Description
    // Found in DOM: [class*="insight-card-description"] p
    const descEl = card.querySelector('[class*="insight-card-description"] p')
      || card.querySelector('.abde-card-insight-body p');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textContent.push(p);
    }

    // Build row: [image, textContent]
    if (image || textContent.length > 0) {
      cells.push([image || '', textContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-insights',
    cells,
  });
  element.replaceWith(block);
}
