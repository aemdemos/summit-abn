/* eslint-disable */
/* global WebImporter */

/**
 * Parser for quote-dark.
 * Base: quote. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (quote):
 *   Row 1: Quote text
 *   Row 2: Attribution (author name, title)
 *
 * Source DOM: .abde-quote-container > .abde-quote-text-over.abde-quote-dark
 *   Contains: .abde-quote-icon (decorative "), p.abde-quote-text (quote text),
 *   p (attribution: "Seth Bernstein—Chief Executive Officer")
 */
export default function parse(element, { document }) {
  // If already processed (element detached), skip
  if (!element.parentNode) return;

  const cells = [];

  // Row 1: Quote text
  // Found in DOM: p.abde-quote-text inside .abde-quote-text-over
  const quoteText = element.querySelector('p.abde-quote-text');
  if (quoteText) {
    const p = document.createElement('p');
    p.textContent = quoteText.textContent.trim();
    cells.push([p]);
  }

  // Row 2: Attribution
  // Found in DOM: second p (not .abde-quote-text) inside .abde-quote-text-over
  const allP = element.querySelectorAll('.abde-quote-text-over p');
  const attribution = Array.from(allP).find(
    (p) => !p.classList.contains('abde-quote-text'),
  );
  if (attribution && attribution.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = attribution.textContent.trim();
    cells.push([p]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'quote-dark',
    cells,
  });
  element.replaceWith(block);
}
