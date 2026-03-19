export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-flip-cards-${cols.length}-cols`);

  // Column 1: text content
  const textCol = cols[0];
  textCol.classList.add('flip-cards-text-col');

  // Style the CTA link as a pill button
  const ctaP = textCol.querySelector('p:last-child');
  if (ctaP && ctaP.querySelector('a')) {
    ctaP.classList.add('flip-cards-cta');
  }

  // Column 2: flip cards content
  const cardsCol = cols[1];
  cardsCol.classList.add('flip-cards-cards-col');

  // Parse repeating pattern: <p><img></p> <h3> <p>description</p>
  const children = [...cardsCol.children];
  const cards = [];
  let i = 0;
  while (i < children.length) {
    const el = children[i];
    // Look for a paragraph with an img (icon)
    if (el.tagName === 'P' && el.querySelector('img')) {
      const icon = el.querySelector('img');
      const title = children[i + 1]; // h3
      const desc = children[i + 2]; // p with description
      if (title && desc) {
        cards.push({
          iconSrc: icon.src,
          iconAlt: icon.alt,
          title: title.textContent,
          description: desc.textContent,
        });
        i += 3;
      } else {
        i += 1;
      }
    } else {
      i += 1;
    }
  }

  // Clear cards column and build flip card markup
  cardsCol.textContent = '';
  const cardsRow = document.createElement('div');
  cardsRow.className = 'flip-cards-row';

  cards.forEach((card) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'flip-card-wrapper';

    // Front face
    const front = document.createElement('div');
    front.className = 'flip-card-face flip-card-front';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'flip-card-icon';
    const iconImg = document.createElement('img');
    iconImg.src = card.iconSrc;
    iconImg.alt = card.iconAlt;
    iconImg.loading = 'lazy';
    iconDiv.append(iconImg);

    const h3 = document.createElement('h3');
    h3.className = 'flip-card-title';
    h3.textContent = card.title;

    const openBtn = document.createElement('button');
    openBtn.className = 'flip-card-trigger';
    openBtn.setAttribute('aria-label', 'Show details');
    const openIcon = document.createElement('span');
    openIcon.className = 'flip-open-icon';
    openBtn.append(openIcon);

    front.append(iconDiv, h3, openBtn);

    // Back face
    const back = document.createElement('div');
    back.className = 'flip-card-face flip-card-back';

    const desc = document.createElement('p');
    desc.className = 'flip-card-desc';
    desc.textContent = card.description;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'flip-card-trigger';
    closeBtn.setAttribute('aria-label', 'Close details');
    const closeIcon = document.createElement('span');
    closeIcon.className = 'flip-close-icon';
    closeBtn.append(closeIcon);

    back.append(desc, closeBtn);

    wrapper.append(front, back);
    cardsRow.append(wrapper);

    // Click to flip
    wrapper.addEventListener('click', () => {
      wrapper.classList.toggle('is-flipped');
    });
  });

  cardsCol.append(cardsRow);
}
