function parseCards(cardsCol) {
  // Split children at each <h3> to form card groups:
  //   before h3: front-icon <p><img>
  //   h3: title
  //   after h3: description <p>, then optional back-icon <p><img>
  const children = [...cardsCol.children];
  const cards = [];
  const h3Indices = children.reduce((acc, el, idx) => {
    if (el.tagName === 'H3') acc.push(idx);
    return acc;
  }, []);

  h3Indices.forEach((h3Idx, pos) => {
    const nextH3 = pos + 1 < h3Indices.length ? h3Indices[pos + 1] : children.length;
    const frontIcon = h3Idx > 0 ? children[h3Idx - 1].querySelector('img') : null;
    const desc = children[h3Idx + 1];
    // Any remaining <p> with img between description and next card boundary is a back-icon.
    // For intermediate cards, nextH3 - 1 is the next card's front-icon (exclude it).
    // For the last card, nextH3 = children.length (no front-icon to exclude).
    const backEnd = pos + 1 < h3Indices.length ? nextH3 - 1 : nextH3;
    const backEl = h3Idx + 2 < backEnd ? children[h3Idx + 2] : null;
    const backIcon = backEl?.querySelector('img');
    cards.push({
      iconSrc: frontIcon?.src || '',
      iconAlt: frontIcon?.alt || '',
      title: children[h3Idx].textContent,
      description: desc?.textContent || '',
      backIconSrc: backIcon?.src || null,
    });
  });
  return cards;
}

function buildCard(card) {
  const wrapper = document.createElement('div');
  wrapper.className = 'flip-card-wrapper';

  // Front face
  const front = document.createElement('div');
  front.className = 'flip-card-face flip-card-front';

  const frontInner = document.createElement('div');
  frontInner.className = 'flip-card-inner-front';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'flip-card-icon';
  const iconImg = document.createElement('img');
  iconImg.src = card.iconSrc;
  iconImg.alt = card.iconAlt;
  iconImg.loading = 'lazy';
  iconImg.width = 60;
  iconImg.height = 60;
  iconDiv.append(iconImg);

  const h3 = document.createElement('h3');
  h3.className = 'flip-card-title';
  h3.textContent = card.title;

  frontInner.append(iconDiv, h3);

  const openBtn = document.createElement('button');
  openBtn.className = 'flip-card-trigger';
  openBtn.setAttribute('aria-label', 'Show details');
  const openIcon = document.createElement('span');
  openIcon.className = 'flip-open-icon';
  openBtn.append(openIcon);

  front.append(frontInner, openBtn);

  // Back face
  const back = document.createElement('div');
  back.className = 'flip-card-face flip-card-back';

  const backContent = document.createElement('div');
  backContent.className = 'flip-card-back-content';
  if (card.backIconSrc) {
    backContent.style.setProperty('--back-icon', `url(${card.backIconSrc})`);
  }

  const desc = document.createElement('p');
  desc.className = 'flip-card-desc';
  desc.textContent = card.description;

  backContent.append(desc);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'flip-card-trigger';
  closeBtn.setAttribute('aria-label', 'Close details');
  const closeIcon = document.createElement('span');
  closeIcon.className = 'flip-close-icon';
  closeBtn.append(closeIcon);

  back.append(backContent, closeBtn);

  wrapper.append(front, back);
  wrapper.addEventListener('click', () => {
    wrapper.classList.toggle('is-flipped');
  });

  return wrapper;
}

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

  const cards = parseCards(cardsCol);

  // Clear cards column and build flip card markup
  cardsCol.textContent = '';
  const cardsRow = document.createElement('div');
  cardsRow.className = 'flip-cards-row';

  cards.forEach((card) => {
    cardsRow.append(buildCard(card));
  });

  cardsCol.append(cardsRow);
}
