/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-news.
 * Base: columns. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (columns):
 *   Row with N columns, each containing text/images/links.
 *
 * Source DOM: Instance selector .abde-card-icon.abde-theme-bg-transparent.abde-icon-left-of-text
 *   is in the right column (col-mdlg-6). Navigate up to section to find:
 *   Left (col-mdlg-6): portrait image (.abde-image-container picture img)
 *   Right (col-mdlg-6): card-icon with icon, eyebrow, h2, paragraphs, external link
 */
export default function parse(element, { document }) {
  // If already processed (element detached), skip
  if (!element.parentNode) return;

  // Navigate up to section containing both columns
  const section = element.closest('section');
  const searchRoot = section || element.parentElement;

  // Column 1: Portrait image from sibling column
  // Found in DOM: .abde-image-container picture img in left col-mdlg-6
  const imgEl = searchRoot.querySelector('.abde-image-container img');
  let col1;
  if (imgEl) {
    col1 = document.createElement('img');
    col1.src = imgEl.getAttribute('src') || imgEl.src;
    col1.alt = imgEl.alt || '';
  } else {
    col1 = '';
  }

  // Column 2: Card-icon content from matched element
  const col2Content = [];

  // Icon image
  // Found in DOM: .abde-icon img
  const icon = element.querySelector('.abde-icon img');
  if (icon) {
    const iconImg = document.createElement('img');
    iconImg.src = icon.getAttribute('src') || icon.src;
    iconImg.alt = icon.alt || '';
    col2Content.push(iconImg);
  }

  // Eyebrow text
  // Found in DOM: .abde-text-eyebrow
  const eyebrow = element.querySelector('.abde-text-eyebrow');
  if (eyebrow && eyebrow.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    col2Content.push(p);
  }

  // Heading
  // Found in DOM: h2 inside .abde-text-container
  const heading = element.querySelector('.abde-text-container h2')
    || element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    col2Content.push(h2);
  }

  // Paragraphs (exclude eyebrow)
  // Found in DOM: .abde-text-container p (not .abde-text-eyebrow)
  element.querySelectorAll('.abde-text-container p').forEach((p) => {
    if (p.classList.contains('abde-text-eyebrow')) return;
    if (p.textContent.trim()) {
      const newP = document.createElement('p');
      // Preserve inline links
      const link = p.querySelector('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.getAttribute('href') || link.href;
        a.textContent = link.textContent.trim();
        newP.appendChild(a);
        // Add trailing text if any
        const trailing = p.textContent.replace(link.textContent, '').trim();
        if (trailing) {
          newP.appendChild(document.createTextNode(trailing));
        }
      } else {
        newP.textContent = p.textContent.trim();
      }
      col2Content.push(newP);
    }
  });

  // Remove the image column from DOM to prevent duplication
  const imgCol = searchRoot.querySelector('[class*="abde-col-mdlg-6"]');
  if (imgCol && !imgCol.contains(element)) {
    imgCol.remove();
  }

  const cells = [[col1, col2Content]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-news',
    cells,
  });
  element.replaceWith(block);
}
