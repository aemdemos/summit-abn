/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AllianceBernstein sections.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs in afterTransform only.
 * Selectors from captured DOM of https://www.alliancebernstein.com/corporate/en/home.html
 */
const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;

    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid index shifts
    const sectionElements = [];

    for (const section of sections) {
      const selectors = Array.isArray(section.selector)
        ? section.selector
        : [section.selector];

      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (sectionEl) {
        sectionElements.push({ el: sectionEl, section });
      }
    }

    // Sort by DOM order (top to bottom) then process in reverse
    sectionElements.sort((a, b) => {
      const pos = a.el.compareDocumentPosition(b.el);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    // Process in reverse order to preserve positions
    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const { el, section } = sectionElements[i];

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });

        // Insert section-metadata after the section's last content
        el.after(sectionMetadata);
      }

      // Add <hr> before this section (except the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        el.before(hr);
      }
    }
  }
}
