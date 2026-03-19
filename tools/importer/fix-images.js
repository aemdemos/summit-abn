#!/usr/bin/env node
/**
 * Downloads external images from migrated content HTML,
 * saves them as ./media_<hash>.<ext> (EDS convention),
 * and updates the HTML to use relative paths.
 *
 * Usage: node tools/importer/fix-images.js
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, join } from 'path';

const CONTENT_FILE = 'content/corporate/en/home.plain.html';

// Read the HTML
let html = readFileSync(CONTENT_FILE, 'utf8');

// Find all external image src values
const srcRegex = /src="(https?:\/\/[^"]+)"/g;
const matches = [...html.matchAll(srcRegex)];

// Deduplicate URLs
const urls = [...new Set(matches.map((m) => m[1]))];

// Filter out tracking pixels and non-image resources
const imageUrls = urls.filter((u) => {
  if (u.includes('rlcdn.com')) return false; // tracking pixel
  if (u.includes('aem_social_image.png')) return false; // OG meta image, not displayed
  return true;
});

console.log(`Found ${imageUrls.length} external images to download`);

const contentDir = dirname(CONTENT_FILE);

async function downloadAndReplace() {
  for (const url of imageUrls) {
    try {
      console.log(`  Downloading: ${url.split('/').pop()}`);
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (!resp.ok) {
        console.error(`    FAILED (${resp.status}): ${url}`);
        continue;
      }

      const buffer = Buffer.from(await resp.arrayBuffer());

      // Generate media_ filename from content hash (EDS convention)
      const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
      const ext = url.split('.').pop().split('?')[0].toLowerCase();
      const mediaName = `media_${hash}.${ext}`;

      // Save the file next to the content
      const outPath = join(contentDir, mediaName);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, buffer);
      console.log(`    Saved: ${outPath} (${(buffer.length / 1024).toFixed(1)} KiB)`);

      // Replace all occurrences of this URL in the HTML with relative path
      html = html.replaceAll(url, `./${mediaName}`);
    } catch (err) {
      console.error(`    ERROR: ${url} — ${err.message}`);
    }
  }

  // Remove empty <img src="" alt=""> tags (decorative artifacts from source)
  html = html.replace(/<img\s+src=""\s+alt=""[^>]*\/?>/g, '');
  // Remove <p> wrappers that now only contain whitespace after img removal
  html = html.replace(/<p>\s*<\/p>/g, '');

  // Remove tracking pixel images
  html = html.replace(/<img\s+[^>]*rlcdn\.com[^>]*\/?>/g, '');

  writeFileSync(CONTENT_FILE, html);
  console.log(`\nUpdated ${CONTENT_FILE} with local image references`);
}

downloadAndReplace();
