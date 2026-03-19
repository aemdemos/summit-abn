/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-image-text.
 * Base: columns. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (columns):
 *   Row with N columns, each containing text/images/links.
 *
 * Source DOM: Instance selector .abde-image-container is generic and matches many
 *   elements. This parser validates context: must be inside col-mdlg-7 with a
 *   sibling col-mdlg-5 containing .abde-text-description with heading + paragraph.
 *   Left (col-mdlg-7): image
 *   Right (col-mdlg-5): heading "Cultivating Diverse Perspectives", paragraph, CTA
 */
export default function parse(element, { document }) {
  // If already processed (element detached), skip
  if (!element.parentNode) return;

  // Context validation: must be inside a col-mdlg-7 column
  const imageCol = element.closest('[class*="abde-col-mdlg-7"]');
  if (!imageCol) return;

  // Navigate up to section to find the sibling text column
  const section = element.closest('section');
  const searchRoot = section || element.parentElement;

  // Context validation: must have a sibling col-mdlg-5 with text description
  const textCol = searchRoot.querySelector('[class*="abde-col-mdlg-5"]');
  if (!textCol || !textCol.querySelector('.abde-text-description h2')) return;

  // Column 1: Image from the image container
  // Found in DOM: picture > img inside .abde-image-container
  const img = element.querySelector('img');
  let col1;
  if (img) {
    col1 = document.createElement('img');
    col1.src = img.getAttribute('src') || img.src;
    col1.alt = img.alt || '';
  } else {
    col1 = '';
  }

  // Column 2: Text content from sibling column
  // Found in DOM: .abde-text-description with h2, p, and a.abde-btn
  const col2Content = [];

  const heading = textCol.querySelector('.abde-text-description h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    col2Content.push(h2);
  }

  textCol.querySelectorAll('.abde-text-description p').forEach((p) => {
    if (p.textContent.trim()) {
      const newP = document.createElement('p');
      newP.textContent = p.textContent.trim();
      col2Content.push(newP);
    }
  });

  const cta = textCol.querySelector('a.abde-btn');
  if (cta) {
    const link = document.createElement('a');
    link.href = cta.getAttribute('href') || cta.href;
    link.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
    col2Content.push(link);
  }

  // Remove text column from DOM to prevent duplication
  textCol.remove();

  const cells = [[col1, col2Content]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-image-text',
    cells,
  });
  element.replaceWith(block);
}
