/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for homepage template
import heroVideoParser from './parsers/hero-video.js';
import cardsInsightsParser from './parsers/cards-insights.js';
import columnsVideoTextParser from './parsers/columns-video-text.js';
import columnsFlipCardsParser from './parsers/columns-flip-cards.js';
import columnsImageTextParser from './parsers/columns-image-text.js';
import columnsNewsParser from './parsers/columns-news.js';
import cardsPromoParser from './parsers/cards-promo.js';
import quoteDarkParser from './parsers/quote-dark.js';

// TRANSFORMER IMPORTS - Import all transformers
import abCleanupTransformer from './transformers/ab-cleanup.js';
import abSectionsTransformer from './transformers/ab-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-video': heroVideoParser,
  'cards-insights': cardsInsightsParser,
  'columns-video-text': columnsVideoTextParser,
  'columns-flip-cards': columnsFlipCardsParser,
  'columns-image-text': columnsImageTextParser,
  'columns-news': columnsNewsParser,
  'cards-promo': cardsPromoParser,
  'quote-dark': quoteDarkParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AllianceBernstein corporate homepage with hero, featured content sections, and promotional cards',
  urls: [
    'https://www.alliancebernstein.com/corporate/en/home.html'
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['.abde-home-hero']
    },
    {
      name: 'cards-insights',
      instances: ['.abde-related-insights-container']
    },
    {
      name: 'columns-video-text',
      instances: ['.abde-brightcove-video-player']
    },
    {
      name: 'columns-flip-cards',
      instances: ['.abde-flip-card-wrapper']
    },
    {
      name: 'columns-image-text',
      instances: ['.abde-image-container']
    },
    {
      name: 'columns-news',
      instances: ['.abde-card-icon.abde-theme-bg-transparent.abde-icon-left-of-text']
    },
    {
      name: 'cards-promo',
      instances: ['.abde-card-generic.hoverenabled']
    },
    {
      name: 'quote-dark',
      instances: ['.abde-quote-container']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero',
      selector: '.abde-home-hero',
      style: null,
      blocks: ['hero-video'],
      defaultContent: []
    },
    {
      id: 'section-insights',
      name: 'Sharing Differentiated Insights',
      selector: '.abde-related-insights',
      style: null,
      blocks: ['cards-insights'],
      defaultContent: ['h2']
    },
    {
      id: 'section-making-difference',
      name: 'Making a Difference',
      selector: ['.abde-section-focus-title'],
      style: null,
      blocks: ['columns-video-text'],
      defaultContent: ['.abde-section-focus-title']
    },
    {
      id: 'section-what-we-do',
      name: 'What We Do',
      selector: ['.abde-section-focus-title'],
      style: null,
      blocks: ['columns-flip-cards'],
      defaultContent: ['.abde-section-focus-title']
    },
    {
      id: 'section-culture',
      name: 'Our Culture',
      selector: ['.abde-section-focus-title'],
      style: null,
      blocks: ['columns-image-text'],
      defaultContent: ['.abde-section-focus-title']
    },
    {
      id: 'section-innovation',
      name: 'Innovation',
      selector: 'section.abde-theme-bg-darkest',
      style: 'dark',
      blocks: ['columns-news'],
      defaultContent: ['.abde-section-focus-title']
    },
    {
      id: 'section-promo-cards',
      name: 'Bottom Promotional Cards',
      selector: '.abde-sidebar',
      style: null,
      blocks: ['cards-promo'],
      defaultContent: []
    },
    {
      id: 'section-quote',
      name: 'CEO Quote',
      selector: '.abde-quote',
      style: 'dark',
      blocks: ['quote-dark'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Section transformer runs after cleanup in afterTransform hook
const transformers = [
  abCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [abSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function using one input / multiple outputs pattern
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
