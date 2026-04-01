import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Parse Brightcove embed URL to extract account, player, and video IDs.
 * Expected format: https://players.brightcove.net/{account}/{player}_default/index.html?videoId={video}
 */
function parseBrightcoveUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    // parts: [account, player_default, index.html]
    const account = parts[0];
    const player = parts[1]?.replace('_default', '');
    const video = u.searchParams.get('videoId');
    if (account && player && video) return { account, player, video };
  } catch { /* not a valid URL */ }
  return null;
}

async function fetchPolicyKey(account, player) {
  const configUrl = `https://players.brightcove.net/${account}/${player}_default/config.json`;
  const resp = await fetch(configUrl);
  if (!resp.ok) return null;
  const config = await resp.json();
  return config.video_cloud?.policy_key || null;
}

async function loadBackgroundVideo(container, { account, player, video }) {
  try {
    const policyKey = await fetchPolicyKey(account, player);
    if (!policyKey) return;

    const resp = await fetch(
      `https://edge.api.brightcove.com/playback/v1/accounts/${account}/videos/${video}`,
      { headers: { Accept: `application/json;pk=${policyKey}` } },
    );
    if (!resp.ok) return;

    const data = await resp.json();
    const mp4 = data.sources?.find(
      (s) => s.container === 'MP4' && s.src?.startsWith('https'),
    );
    if (!mp4) return;

    const vid = document.createElement('video');
    vid.className = 'hero-video-bg';
    vid.muted = true;
    vid.autoplay = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.poster = data.poster || '';
    vid.src = mp4.src;

    container.appendChild(vid);
    vid.play().catch(() => { /* autoplay blocked — poster image stays visible */ });
  } catch {
    // hero video failed to load — poster image stays visible
  }
}

export default function decorate(block) {
  // Single row, single cell — image + text content all in one cell
  const row = block.children[0];
  const cell = row?.children[0];
  if (!cell) return;

  // Extract Brightcove video link from content (if authored)
  // Convention: a link whose text matches its href is a data URL, not a visible link
  let bcConfig = null;
  const videoLink = [...cell.querySelectorAll('a')].find(
    (a) => a.textContent.trim() === a.getAttribute('href'),
  );
  if (videoLink) {
    bcConfig = parseBrightcoveUrl(videoLink.href);
    // Remove the data-link paragraph from visible content
    const linkP = videoLink.closest('p') || videoLink;
    linkP.remove();
  }

  // Extract the image (first picture/img) for the background layer
  const img = cell.querySelector('img');
  if (!img) {
    block.classList.add('no-image');
    return;
  }

  const picture = img.closest('picture') || img.parentElement;
  const imgWrapper = picture.closest('p') || picture;

  // Build background layer
  const bgDiv = document.createElement('div');
  bgDiv.className = 'hero-video-background';
  const bgInner = document.createElement('div');
  const optimized = createOptimizedPicture(
    img.src,
    img.alt || '',
    true,
    [{ media: '(min-width: 768px)', width: '1440' }, { width: '768' }],
  );
  const newImg = optimized.querySelector('img');
  newImg.setAttribute('fetchpriority', 'high');
  newImg.setAttribute('width', '2310');
  newImg.setAttribute('height', '1300');
  bgInner.append(optimized);
  bgDiv.append(bgInner);

  // Remove image from the content flow
  imgWrapper.remove();

  // The remaining content (h1, p, a) becomes the overlay
  row.className = 'hero-video-overlay';

  // Insert background before overlay
  block.prepend(bgDiv);

  // Load background video on desktop if a Brightcove link was authored
  if (bcConfig) {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      loadBackgroundVideo(bgInner, bcConfig);
    }
  }
}
