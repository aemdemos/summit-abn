/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video.
 * Base: hero. Source: https://www.alliancebernstein.com/corporate/en/home.html
 * Generated: 2026-03-18
 *
 * Block library structure (hero):
 *   Row 1: Background image (optional)
 *   Row 2: Title + subheading + CTA
 *
 * Source DOM: .abde-home-hero contains video wrapper with poster image,
 *   .abde-home-hero-content with h1/h2, paragraph, and CTA button.
 */
export default function parse(element, { document }) {
  // Extract background/poster image from video wrapper
  // Found in DOM: .abde-video-wrapper .vjs-poster img, or .abde-deskop-hide img
  const posterImg = element.querySelector('.vjs-poster img')
    || element.querySelector('.abde-video-wrapper img');

  // Extract heading from hero content overlay
  // Found in DOM: .abde-home-hero-content h1, h2
  const heading = element.querySelector('.abde-home-hero-content h1')
    || element.querySelector('.abde-home-hero-content h2')
    || element.querySelector('h1')
    || element.querySelector('h2');

  // Extract paragraph text
  // Found in DOM: .abde-hero-box .abde-pt-sm p (sibling of .abde-home-hero-content, NOT nested inside it)
  const description = element.querySelector('.abde-hero-box .abde-pt-sm p')
    || element.querySelector('.abde-home-hero-content p')
    || element.querySelector('.abde-text-description p');

  // Extract CTA button
  // Found in DOM: .abde-home-hero-content a.abde-btn
  const cta = element.querySelector('.abde-home-hero-content a.abde-btn')
    || element.querySelector('a.abde-btn');

  const cells = [];

  // Row 1: Background image (per hero block library)
  if (posterImg) {
    cells.push([posterImg]);
  }

  // Row 2: Content (heading + description + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-video',
    cells,
  });
  element.replaceWith(block);
}
