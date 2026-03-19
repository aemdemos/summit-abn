#!/usr/bin/env node

/**
 * Parser Content Validation Script
 *
 * Mechanically validates that a parser extracts ALL content elements
 * from the source block element in cleaned.html.
 *
 * Compares content element counts (headings, paragraphs, links, images)
 * in the source DOM vs what the parser's selectors actually capture.
 *
 * Usage:
 *   node tools/importer/validate-parser-content.js <parser-name>
 *   node tools/importer/validate-parser-content.js --all
 *
 * Examples:
 *   node tools/importer/validate-parser-content.js hero-video
 *   node tools/importer/validate-parser-content.js --all
 */

import { parseHTML } from 'linkedom';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const WORKSPACE = resolve(import.meta.dirname, '..', '..');
const CLEANED_HTML = resolve(WORKSPACE, 'migration-work', 'cleaned.html');
const PAGE_TEMPLATES = resolve(WORKSPACE, 'tools', 'importer', 'page-templates.json');
const PARSERS_DIR = resolve(WORKSPACE, 'tools', 'importer', 'parsers');

// Content element types to count and compare
const CONTENT_SELECTORS = {
  headings: 'h1, h2, h3, h4, h5, h6',
  paragraphs: 'p',
  links: 'a[href]',
  images: 'img[src]',
};

// Noise patterns — elements matching these are excluded from validation.
// These are boilerplate strings from video players, accessibility wrappers,
// cookie notices, etc. that are not real page content.
const NOISE_PATTERNS = [
  /^this is a modal window/i,
  /^beginning of dialog window/i,
  /^end of dialog window/i,
  /^close modal dialog/i,
  /^no compatible source/i,
  /^the media could not be loaded/i,
  /^\s*$/,
];

function isNoise(element) {
  const text = element.textContent?.trim() || '';
  if (text.length === 0) return true;
  return NOISE_PATTERNS.some((pattern) => pattern.test(text));
}

function loadCleanedHtml() {
  if (!existsSync(CLEANED_HTML)) {
    console.error(`ERROR: ${CLEANED_HTML} not found`);
    process.exit(1);
  }
  const html = readFileSync(CLEANED_HTML, 'utf-8');
  const { document } = parseHTML(html);
  return document;
}

function loadPageTemplates() {
  if (!existsSync(PAGE_TEMPLATES)) {
    console.error(`ERROR: ${PAGE_TEMPLATES} not found`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(PAGE_TEMPLATES, 'utf-8'));
}

function getBlockSelector(templates, parserName) {
  for (const template of templates.templates) {
    for (const block of template.blocks) {
      if (block.name === parserName && block.instances?.length > 0) {
        return block.instances[0];
      }
    }
  }
  return null;
}

function extractQuerySelectors(parserSource) {
  // Extract all querySelector and querySelectorAll calls from parser source
  const selectorPattern = /\.querySelector(?:All)?\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  const selectors = [];
  let match;
  while ((match = selectorPattern.exec(parserSource)) !== null) {
    // Split comma-separated selectors and OR-chain fallbacks
    const raw = match[1];
    raw.split(',').forEach((s) => selectors.push(s.trim()));
  }
  return [...new Set(selectors)];
}

function countContentElements(element) {
  const counts = {};
  for (const [type, selector] of Object.entries(CONTENT_SELECTORS)) {
    const elements = Array.from(element.querySelectorAll(selector)).filter((el) => !isNoise(el));
    counts[type] = {
      count: elements.length,
      items: elements.map((el) => {
        const text = el.textContent?.trim().substring(0, 80) || '';
        if (el.tagName === 'IMG') return `<img src="${el.getAttribute('src')?.substring(0, 60)}..." alt="${el.getAttribute('alt')?.substring(0, 40) || ''}">`;
        if (el.tagName === 'A') return `<a href="${el.getAttribute('href')?.substring(0, 50)}...">${text}</a>`;
        return `<${el.tagName.toLowerCase()}>${text}</${el.tagName.toLowerCase()}>`;
      }),
    };
  }
  return counts;
}

function countParserCoverage(element, parserSelectors) {
  // For each parser selector, find what it matches and collect covered elements
  const coveredElements = new Set();

  for (const selector of parserSelectors) {
    try {
      // Try as-is first
      const match = element.querySelector(selector);
      if (match) {
        // Collect all content elements within this match
        for (const [, contentSel] of Object.entries(CONTENT_SELECTORS)) {
          const nested = match.querySelectorAll(contentSel);
          nested.forEach((el) => coveredElements.add(el));
        }
        // Also check if the match itself is a content element
        for (const [, contentSel] of Object.entries(CONTENT_SELECTORS)) {
          if (match.matches?.(contentSel)) coveredElements.add(match);
        }
      }
    } catch {
      // Invalid selector (e.g. contains :scope) — skip
    }
  }

  return coveredElements;
}

function validateParser(parserName, document, templates) {
  const selector = getBlockSelector(templates, parserName);
  if (!selector) {
    console.log(`  SKIP: No selector found in page-templates.json for "${parserName}"`);
    return null;
  }

  const sourceElement = document.querySelector(selector);
  if (!sourceElement) {
    console.log(`  SKIP: Selector "${selector}" did not match any element in cleaned.html`);
    return null;
  }

  // Load parser source
  const parserPath = resolve(PARSERS_DIR, `${parserName}.js`);
  if (!existsSync(parserPath)) {
    console.log(`  SKIP: Parser file not found at ${parserPath}`);
    return null;
  }
  const parserSource = readFileSync(parserPath, 'utf-8');

  // Count all content elements in source
  const sourceCounts = countContentElements(sourceElement);

  // Extract selectors from parser and determine coverage
  const parserSelectors = extractQuerySelectors(parserSource);
  const coveredElements = countParserCoverage(sourceElement, parserSelectors);

  // Build report
  const issues = [];
  let totalSource = 0;
  let totalCovered = 0;

  for (const [type, data] of Object.entries(sourceCounts)) {
    totalSource += data.count;

    // Count how many of this type are covered by parser selectors
    let coveredCount = 0;
    const uncovered = [];

    for (const item of Array.from(sourceElement.querySelectorAll(CONTENT_SELECTORS[type]))) {
      if (isNoise(item)) continue; // Skip boilerplate / empty elements
      if (coveredElements.has(item)) {
        coveredCount += 1;
      } else {
        const text = item.textContent?.trim().substring(0, 80) || '';
        uncovered.push(item.tagName === 'IMG'
          ? `<img alt="${item.getAttribute('alt')?.substring(0, 50) || ''}">`
          : `<${item.tagName.toLowerCase()}>${text}</${item.tagName.toLowerCase()}>`);
      }
    }
    totalCovered += coveredCount;

    if (uncovered.length > 0) {
      issues.push({ type, sourceCount: data.count, coveredCount, uncovered });
    }
  }

  return { parserName, selector, parserSelectors, sourceCounts, totalSource, totalCovered, issues };
}

function printReport(result) {
  if (!result) return;

  const { parserName, selector, parserSelectors, totalSource, totalCovered, issues } = result;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`PARSER: ${parserName}`);
  console.log(`SOURCE SELECTOR: ${selector}`);
  console.log(`PARSER SELECTORS FOUND: ${parserSelectors.length}`);
  console.log(`${'='.repeat(70)}`);

  console.log(`\n  Content elements in source: ${totalSource}`);
  console.log(`  Covered by parser selectors: ${totalCovered}`);
  console.log(`  Potentially uncovered:       ${totalSource - totalCovered}`);

  if (issues.length === 0) {
    console.log(`\n  RESULT: PASS — All content elements appear to be covered by parser selectors.`);
    return true;
  }

  console.log(`\n  RESULT: FAIL — ${issues.length} content type(s) have uncovered elements:\n`);

  for (const issue of issues) {
    console.log(`  ${issue.type.toUpperCase()}: ${issue.coveredCount}/${issue.sourceCount} covered`);
    console.log(`  Uncovered elements:`);
    for (const item of issue.uncovered) {
      console.log(`    - ${item}`);
    }
    console.log();
  }

  return false;
}

// --- Main ---
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node tools/importer/validate-parser-content.js <parser-name>');
  console.log('       node tools/importer/validate-parser-content.js --all');
  process.exit(1);
}

const document = loadCleanedHtml();
const templates = loadPageTemplates();

let parsersToValidate;
if (args[0] === '--all') {
  parsersToValidate = templates.templates
    .flatMap((t) => t.blocks.map((b) => b.name));
} else {
  parsersToValidate = [args[0]];
}

console.log(`\nParser Content Validation`);
console.log(`Cleaned HTML: ${CLEANED_HTML}`);
console.log(`Validating ${parsersToValidate.length} parser(s)...`);

let allPassed = true;
for (const parserName of parsersToValidate) {
  const result = validateParser(parserName, document, templates);
  if (result) {
    const passed = printReport(result);
    if (!passed) allPassed = false;
  }
}

console.log(`\n${'='.repeat(70)}`);
if (allPassed) {
  console.log('ALL PARSERS PASSED');
} else {
  console.log('SOME PARSERS HAVE UNCOVERED CONTENT — review and fix selectors');
  process.exit(1);
}
