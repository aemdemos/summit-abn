import { ensureDOMPurify } from '../../scripts/scripts.js';

export default async function decorate(block) {
  await ensureDOMPurify();
  let resp = await fetch('/footer.plain.html');
  if (!resp.ok) resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const fragment = document.createElement('div');
  fragment.innerHTML = window.DOMPurify.sanitize(html);

  // The footer.plain.html has 3 top-level divs:
  // 1. Nav links (upper-left)
  // 2. Social icons + subscribe (upper-right)
  // 3. Legal links + copyright (lower)
  const sections = fragment.querySelectorAll(':scope > div > div');

  const footer = document.createElement('div');
  footer.className = 'footer-content';

  // — Upper footer row —
  const upper = document.createElement('div');
  upper.className = 'footer-upper';

  // Nav links
  const navSection = sections[0];
  if (navSection) {
    const navDiv = document.createElement('nav');
    navDiv.className = 'footer-nav';
    navDiv.setAttribute('aria-label', 'Footer navigation');
    const ul = navSection.querySelector('ul');
    if (ul) navDiv.append(ul);
    upper.append(navDiv);
  }

  // Social + subscribe
  const socialSection = sections[1];
  if (socialSection) {
    const rightDiv = document.createElement('div');
    rightDiv.className = 'footer-social-subscribe';

    // Social icons paragraph
    const socialP = socialSection.querySelector('p');
    if (socialP) {
      const socialDiv = document.createElement('div');
      socialDiv.className = 'footer-social';
      const links = socialP.querySelectorAll('a');
      links.forEach((a) => {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const img = a.querySelector('img');
        if (img) {
          img.loading = 'lazy';
          img.setAttribute('width', '24');
          img.setAttribute('height', '24');
        }
        socialDiv.append(a);
      });
      rightDiv.append(socialDiv);
    }

    // Subscribe form
    const subscribeDiv = document.createElement('div');
    subscribeDiv.className = 'footer-subscribe';

    const form = document.createElement('form');
    form.className = 'footer-subscribe-form';
    form.addEventListener('submit', (e) => e.preventDefault());

    const input = document.createElement('input');
    input.type = 'email';
    input.placeholder = 'Email';
    input.setAttribute('aria-label', 'Email for subscription');
    input.required = true;

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.setAttribute('aria-label', 'Subscribe');
    btn.textContent = 'subscribe ';
    const arrowImg = document.createElement('img');
    arrowImg.src = '/content/images/icon-arrow-right.svg';
    arrowImg.alt = '';
    arrowImg.className = 'subscribe-arrow';
    arrowImg.loading = 'lazy';
    arrowImg.width = 16;
    arrowImg.height = 16;
    btn.append(arrowImg);

    form.append(input);
    form.append(btn);
    subscribeDiv.append(form);
    rightDiv.append(subscribeDiv);
    upper.append(rightDiv);
  }

  footer.append(upper);

  // — Lower footer row —
  const legalSection = sections[2];
  if (legalSection) {
    const lower = document.createElement('div');
    lower.className = 'footer-lower';

    const legalNav = document.createElement('nav');
    legalNav.className = 'footer-legal';
    legalNav.setAttribute('aria-label', 'Legal links');
    const ul = legalSection.querySelector('ul');
    if (ul) legalNav.append(ul);
    lower.append(legalNav);

    const copyrightP = legalSection.querySelector('p');
    if (copyrightP) {
      copyrightP.className = 'footer-copyright';
      lower.append(copyrightP);
    }

    footer.append(lower);
  }

  block.textContent = '';
  block.append(footer);
}
