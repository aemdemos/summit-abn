export default function decorate(block) {
  [...block.children].forEach((card) => {
    card.classList.add('promo-card');

    // Fixed layout: col[0] = image, col[1] = body
    const cols = [...card.children];
    const imageCol = cols[0];
    const bodyCol = cols[1];

    if (imageCol) {
      imageCol.classList.add('promo-card-image');
      imageCol.querySelectorAll('img').forEach((img) => {
        img.loading = 'lazy';
        if (!img.hasAttribute('width')) {
          img.setAttribute('width', '600');
          img.setAttribute('height', '400');
        }
      });
    }

    if (bodyCol) {
      bodyCol.classList.add('promo-card-body');

      // Last <p> with a link is the CTA
      const lastP = bodyCol.querySelector('p:last-child');
      if (lastP && lastP.querySelector('a')) {
        lastP.classList.add('promo-cta');
      }

      // First <p> is the eyebrow — move it before the image column
      const firstP = bodyCol.querySelector('p:first-child');
      if (firstP && imageCol) {
        firstP.classList.add('promo-eyebrow');
        card.insertBefore(firstP, imageCol);
      }
    }
  });
}
