import { ensureDOMPurify } from '../../scripts/scripts.js';

export default async function decorate(block) {
  await ensureDOMPurify();
  const resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const fragment = document.createElement('div');
  fragment.innerHTML = window.DOMPurify.sanitize(html);

  // DA footer: single top-level <div> containing:
  //   1. First <ul> — nav links
  //   2. <p> elements with <a><picture> — social icons
  //   3. <p>Subscribe</p> — label (text only)
  //   4. Second <ul> — legal links
  //   5. <p>© 2026 AllianceBernstein L.P.</p> — copyright
  const container = fragment.querySelector(':scope > div');
  if (!container) return;

  const footer = document.createElement('div');
  footer.className = 'footer-content';

  // — Upper footer row —
  const upper = document.createElement('div');
  upper.className = 'footer-upper';

  const lists = container.querySelectorAll(':scope > ul');
  const paragraphs = [...container.querySelectorAll(':scope > p')];

  // Nav links (first <ul>)
  if (lists[0]) {
    const navDiv = document.createElement('nav');
    navDiv.className = 'footer-nav';
    navDiv.setAttribute('aria-label', 'Footer navigation');
    navDiv.append(lists[0]);
    upper.append(navDiv);
  }

  // Social + subscribe (right side)
  const rightDiv = document.createElement('div');
  rightDiv.className = 'footer-social-subscribe';

  // Social icons — <p> elements containing <a><picture>
  const socialDiv = document.createElement('div');
  socialDiv.className = 'footer-social';
  paragraphs.forEach((p) => {
    const a = p.querySelector('a');
    const pic = p.querySelector('picture');
    if (a && pic) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const img = pic.querySelector('img');
      if (img) {
        img.loading = 'lazy';
        img.setAttribute('width', '24');
        img.setAttribute('height', '24');
      }
      socialDiv.append(a);
    }
  });
  rightDiv.append(socialDiv);

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
  const arrow = document.createElement('span');
  arrow.className = 'subscribe-arrow';
  arrow.textContent = '\u2192';
  btn.append(arrow);

  form.append(input, btn);
  subscribeDiv.append(form);
  rightDiv.append(subscribeDiv);
  upper.append(rightDiv);
  footer.append(upper);

  // — Lower footer row —
  if (lists[1]) {
    const lower = document.createElement('div');
    lower.className = 'footer-lower';

    const legalNav = document.createElement('nav');
    legalNav.className = 'footer-legal';
    legalNav.setAttribute('aria-label', 'Legal links');
    legalNav.append(lists[1]);
    lower.append(legalNav);

    // Copyright — last <p> containing ©
    const copyrightP = paragraphs.find(
      (p) => !p.querySelector('picture') && p.textContent.includes('\u00A9'),
    );
    if (copyrightP) {
      copyrightP.className = 'footer-copyright';
      lower.append(copyrightP);
    }

    footer.append(lower);
  }

  block.textContent = '';
  block.append(footer);
}
