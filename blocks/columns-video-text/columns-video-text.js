export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-video-text-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col, i) => {
      // First column: embed Brightcove video if empty
      if (i === 0 && col.childElementCount === 0) {
        col.classList.add('columns-video-text-video-col');
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        const iframe = document.createElement('iframe');
        iframe.src = 'https://players.brightcove.net/2197926677001/b46fe8e6-5cda-430a-99b2-ec23fa9db5ef_default/index.html?videoId=6384460439112';
        iframe.allowFullscreen = true;
        iframe.allow = 'encrypted-media';
        iframe.loading = 'lazy';
        iframe.title = 'Corporate Overview Video';
        wrapper.append(iframe);
        col.append(wrapper);
      }

      // Second column: text content
      if (i === 1) {
        col.classList.add('columns-video-text-text-col');

        // Wrap icon img + h2 in a flex container for icon-left-of-text layout
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
    });
  });
}
