function buildVideoCol(col) {
  col.classList.add('columns-video-text-video-col');
  const poster = col.querySelector('img');
  const link = col.querySelector('a');
  if (!link) return;

  const videoUrl = link.href;
  const videoTitle = link.textContent || 'Video';
  const posterSrc = poster ? poster.src : '';
  const posterAlt = poster ? poster.alt : videoTitle;
  col.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';

  if (posterSrc) {
    const posterImg = document.createElement('img');
    posterImg.src = posterSrc;
    posterImg.alt = posterAlt;
    posterImg.className = 'video-poster';
    posterImg.loading = 'lazy';
    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-btn';
    playBtn.setAttribute('aria-label', 'Play video');
    wrapper.append(posterImg, playBtn);
    wrapper.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `${videoUrl}&autoplay&muted`;
      iframe.allowFullscreen = true;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.title = videoTitle;
      wrapper.textContent = '';
      wrapper.classList.add('video-playing');
      wrapper.append(iframe);
    }, { once: true });
  } else {
    const iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.allowFullscreen = true;
    iframe.allow = 'encrypted-media';
    iframe.loading = 'lazy';
    iframe.title = videoTitle;
    wrapper.append(iframe);
  }
  col.append(wrapper);
}

function buildTextCol(col) {
  col.classList.add('columns-video-text-text-col');
  const iconP = col.querySelector('p:first-child');
  const h2 = col.querySelector('h2');
  if (iconP && h2 && iconP.querySelector('img')) {
    const iconRow = document.createElement('div');
    iconRow.className = 'icon-heading-row';
    iconP.classList.add('icon-wrap');
    col.insertBefore(iconRow, iconP);
    iconRow.append(iconP, h2);
  }
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-video-text-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col, i) => {
      if (i === 0) buildVideoCol(col);
      if (i === 1) buildTextCol(col);
    });
  });
}
