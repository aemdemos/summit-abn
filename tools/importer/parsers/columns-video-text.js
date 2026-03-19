/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-video-text.
 * Base: columns. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (columns):
 *   Row with N columns, each containing text/images/links.
 *
 * Source DOM: Instance selector .abde-brightcove-video-player is inside left column.
 *   Navigate up to section to find sibling card-icon content in right column.
 *   Left (col-mdlg-7): video player → extract poster image only
 *   Right (col-mdlg-5): .abde-card-icon with icon, heading, paragraph, CTA
 */
export default function parse(element, { document }) {
  // If already processed (element detached), skip
  if (!element.parentNode) return;

  // Navigate up to section to access both columns
  const section = element.closest('section');

  // Column 1: Create clean poster image from video player
  // Found in DOM: .vjs-poster img inside .abde-brightcove-video-player
  const posterSrc = element.querySelector('.vjs-poster img')
    || element.querySelector('img');
  let col1;
  if (posterSrc) {
    col1 = document.createElement('img');
    col1.src = posterSrc.getAttribute('src') || posterSrc.src;
    col1.alt = posterSrc.alt || '';
  } else {
    col1 = '';
  }

  // Column 2: Extract card-icon content from sibling column
  // Found in DOM: .abde-card-icon in the right column (sibling of video column)
  const searchRoot = section || element.parentElement;
  const cardIcon = searchRoot.querySelector('.abde-card-icon');
  const col2Content = [];

  if (cardIcon) {
    // Icon image
    const icon = cardIcon.querySelector('.abde-icon img');
    if (icon) {
      const iconImg = document.createElement('img');
      iconImg.src = icon.getAttribute('src') || icon.src;
      iconImg.alt = icon.alt || '';
      col2Content.push(iconImg);
    }

    // Heading
    const heading = cardIcon.querySelector('h2') || cardIcon.querySelector('h3');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      col2Content.push(h2);
    }

    // Paragraphs
    cardIcon.querySelectorAll('.abde-text-container p').forEach((p) => {
      if (p.textContent.trim()) {
        const newP = document.createElement('p');
        newP.textContent = p.textContent.trim();
        col2Content.push(newP);
      }
    });

    // CTA button
    const cta = cardIcon.querySelector('a.abde-btn');
    if (cta) {
      const link = document.createElement('a');
      link.href = cta.getAttribute('href') || cta.href;
      link.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
      col2Content.push(link);
    }

    // Remove the card-icon content from DOM to prevent duplication
    const cardIconCol = cardIcon.closest('[class*="abde-col-mdlg-5"]')
      || cardIcon.closest('.abde-card');
    if (cardIconCol) cardIconCol.remove();
  }

  const cells = [[col1, col2Content]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-video-text',
    cells,
  });
  element.replaceWith(block);
}
