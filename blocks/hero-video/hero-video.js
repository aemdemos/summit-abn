import { createOptimizedPicture } from '../../scripts/aem.js';

/* Brightcove embed configuration (public identifiers, not secrets) */
const brightcove = {
  account: '2197926689001',
  video: '6317554368112',
  // eslint-disable-next-line secure-coding/no-hardcoded-credentials
  player: '535c6d42-d2fa-4569-9c50-e047c4209515',
};

async function fetchPolicyKey() {
  const configUrl = `https://players.brightcove.net/${brightcove.account}/${brightcove.player}_default/config.json`;
  const resp = await fetch(configUrl);
  if (!resp.ok) return null;
  const config = await resp.json();
  return config.video_cloud?.policy_key || null;
}

async function loadBackgroundVideo(container) {
  try {
    const policyKey = await fetchPolicyKey();
    if (!policyKey) return;

    const resp = await fetch(
      `https://edge.api.brightcove.com/playback/v1/accounts/${brightcove.account}/videos/${brightcove.video}`,
      { headers: { Accept: `application/json;pk=${policyKey}` } },
    );
    if (!resp.ok) return;

    const data = await resp.json();
    const mp4 = data.sources?.find(
      (s) => s.container === 'MP4' && s.src?.startsWith('https'),
    );
    if (!mp4) return;

    const video = document.createElement('video');
    video.className = 'hero-video-bg';
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.poster = data.poster || '';
    video.src = mp4.src;

    container.appendChild(video);
    video.play().catch(() => { /* autoplay blocked — poster image stays visible */ });
  } catch {
    // hero video failed to load — poster image stays visible
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  const [imageRow, contentRow] = rows;

  // Row 1: Background image (poster fallback)
  if (imageRow) {
    imageRow.classList.add('hero-video-background');
  }

  // Row 2: Content overlay
  if (contentRow) {
    contentRow.classList.add('hero-video-overlay');
  }

  // No-image fallback
  const img = imageRow?.querySelector('img');
  if (!img) {
    block.classList.add('no-image');
    return;
  }

  // Replace with responsive picture: webp + sized sources for LCP optimization
  const picture = img.closest('picture') || img.parentElement;
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
  picture.replaceWith(optimized);

  // Skip video on mobile — autoplay is usually blocked and it adds ~2s to critical path
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (isDesktop) {
    loadBackgroundVideo(imageRow.querySelector('div') || imageRow);
  }
}
