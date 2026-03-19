export default function decorate(block) {
  [...block.children].forEach((card) => {
    card.classList.add('promo-card');

    let imageCol = null;
    let bodyCol = null;

    [...card.children].forEach((col) => {
      const img = col.querySelector('picture') || col.querySelector('img');
      if (img && !col.querySelector('h4') && !col.querySelector('h3')) {
        col.classList.add('promo-card-image');
        imageCol = col;
      } else {
        col.classList.add('promo-card-body');
        bodyCol = col;

        // Last <p> with a link is the CTA
        const lastP = col.querySelector('p:last-child');
        if (lastP && lastP.querySelector('a')) {
          lastP.classList.add('promo-cta');
        }
      }
    });

    // Move the eyebrow (first <p> in body) before the image column
    // so the order matches the original: eyebrow → image → heading → body → CTA
    if (bodyCol && imageCol) {
      const firstP = bodyCol.querySelector('p:first-child');
      if (firstP && !firstP.querySelector('a') && !firstP.querySelector('img')) {
        firstP.classList.add('promo-eyebrow');
        card.insertBefore(firstP, imageCol);
      }
    }
  });
}
