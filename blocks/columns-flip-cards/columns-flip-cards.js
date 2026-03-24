function parseCards(cardsCol) {
  const children = [...cardsCol.children];
  const cards = [];
  let i = 0;
  while (i < children.length) {
    const el = children[i];
    const icon = el.tagName === 'P' ? el.querySelector('img') : null;
    const title = children[i + 1];
    const desc = children[i + 2];
    if (icon && title && desc) {
      const card = {
        iconSrc: icon.src,
        iconAlt: icon.alt,
        title: title.textContent,
        description: desc.textContent,
        backIconSrc: null,
      };
      i += 3;
      // Check if next element is a back icon (P with img not followed by h3)
      const next = children[i];
      if (next && next.tagName === 'P' && next.querySelector('img')) {
        const after = children[i + 1];
        if (!after || after.tagName !== 'H3') {
          card.backIconSrc = next.querySelector('img').src;
          i += 1;
        }
      }
      cards.push(card);
    } else {
      i += 1;
    }
  }
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
