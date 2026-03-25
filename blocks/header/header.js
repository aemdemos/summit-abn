// Standard SVG namespace (must be http:// per W3C spec)
// eslint-disable-next-line browser-security/detect-mixed-content, browser-security/no-http-urls
const SVG_NS = 'http://www.w3.org/2000/svg';

function createIcon(viewBox, w, h, pathD) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('xmlns', SVG_NS);
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(h));
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('d', pathD);
  svg.append(path);
  return svg;
}

/* eslint-disable max-len */
const SEARCH_D = 'M384 208A176 176 0 1 0 32 208a176 176 0 1 0 352 0zM343.3 366C307 397.2 259.7 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 51.7-18.8 99-50 135.3L507.3 484.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L343.3 366z';
const CLOSE_D = 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z';
const GLOBE_D = 'M256 464c7.4 0 27-7.2 47.6-48.4c8.8-17.7 16.4-39.2 22-63.6l-139.2 0c5.6 24.4 13.2 45.9 22 63.6C229 456.8 248.6 464 256 464zM178.5 304l155 0c1.6-15.3 2.5-31.4 2.5-48s-.9-32.7-2.5-48l-155 0c-1.6 15.3-2.5 31.4-2.5 48s.9 32.7 2.5 48zm7.9-144l139.2 0c-5.6-24.4-13.2-45.9-22-63.6C283 55.2 263.4 48 256 48s-27 7.2-47.6 48.4c-8.8 17.7-16.4 39.2-22 63.6zm195.3 48c1.5 15.5 2.2 31.6 2.2 48s-.8 32.5-2.2 48l76.7 0c3.6-15.4 5.6-31.5 5.6-48s-1.9-32.6-5.6-48l-76.7 0zm58.8-48c-21.4-41.1-56.1-74.1-98.4-93.4c14.1 25.6 25.3 57.5 32.6 93.4l65.9 0zm-303.3 0c7.3-35.9 18.5-67.7 32.6-93.4c-42.3 19.3-77 52.3-98.4 93.4l65.9 0zM53.6 208c-3.6 15.4-5.6 31.5-5.6 48s1.9 32.6 5.6 48l76.7 0c-1.5-15.5-2.2-31.6-2.2-48s.8-32.5 2.2-48l-76.7 0zM342.1 445.4c42.3-19.3 77-52.3 98.4-93.4l-65.9 0c-7.3 35.9-18.5 67.7-32.6 93.4zm-172.2 0c-14.1-25.6-25.3-57.5-32.6-93.4l-65.9 0c21.4 41.1 56.1 74.1 98.4 93.4zM256 512A256 256 0 1 1 256 0a256 256 0 1 1 0 512z';
const HAMBURGER_D = 'M0 96c0-8.8 7.2-16 16-16h416c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16zm0 160c0-8.8 7.2-16 16-16h416c8.8 0 16 7.2 16 16s-7.2 16-16 16H16c-8.8 0-16-7.2-16-16zm432 160c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16s7.2-16 16-16h416c8.8 0 16 7.2 16 16z';
const PLUS_D = 'M240 352v-80h-80c-8.8 0-16-7.2-16-16s7.2-16 16-16h80v-80c0-8.8 7.2-16 16-16s16 7.2 16 16v80h80c8.8 0 16 7.2 16 16s-7.2 16-16 16h-80v80c0 8.8-7.2 16-16 16s-16-7.2-16-16zm272-96c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zM256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32z';
const CHEVRON_D = 'M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z';
/* eslint-enable max-len */

function searchIcon() { return createIcon('0 0 512 512', 20, 20, SEARCH_D); }
function closeIcon() { return createIcon('0 0 384 512', 18, 18, CLOSE_D); }
function globeIcon() { return createIcon('0 0 512 512', 16, 16, GLOBE_D); }
function hamburgerIcon() { return createIcon('0 0 448 512', 22, 22, HAMBURGER_D); }
function plusIcon() { return createIcon('0 0 512 512', 30, 30, PLUS_D); }

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (typeof c === 'string') e.append(document.createTextNode(c));
    else if (c) e.append(c);
  });
  return e;
}

function closeAllPanels(header) {
  header.classList.remove('is-open');
  header.querySelectorAll('.header-megamenu-panel.is-open').forEach((p) => p.classList.remove('is-open'));
  header.querySelectorAll('.header-nav-item.is-active').forEach((i) => i.classList.remove('is-active'));
  header.querySelectorAll('.header-nav-trigger').forEach((t) => t.setAttribute('aria-expanded', 'false'));
  header.querySelector('.header-search-bar')?.classList.remove('is-open');
  header.querySelector('.header-site-selector')?.classList.remove('is-open');
}

function buildUtilityBar(toolsSection) {
  const bar = el('div', { class: 'header-utility-bar' });
  // DA format: first <p><a> in tools section is the Contact Us link
  const contactA = toolsSection.querySelector(':scope > p > a');
  if (contactA) {
    const a = el('a', {
      href: contactA.getAttribute('href'),
      class: 'header-contact-link',
    }, contactA.textContent);
    bar.append(a);
  }

  const searchToggle = el('button', {
    class: 'header-search-toggle',
    'aria-label': 'Open Search',
  }, searchIcon());
  bar.append(searchToggle);
  return bar;
}

function buildLogo(logoSection) {
  const logoDiv = el('div', { class: 'header-logo' });
  const link = logoSection.querySelector('a');
  const pictures = logoSection.querySelectorAll('picture');
  if (link && pictures.length > 0) {
    const a = el('a', {
      href: link.getAttribute('href'),
      'aria-label': 'AllianceBernstein Home',
    });
    // DA nav logo section: first picture = white logo, second picture = dark logo
    pictures.forEach((pic, i) => {
      const img = pic.querySelector('img');
      if (img) {
        img.loading = 'eager';
        img.removeAttribute('width');
        img.removeAttribute('height');
      }
      pic.classList.add(i === 0 ? 'header-logo-white' : 'header-logo-dark');
      a.append(pic);
    });
    logoDiv.append(a);
  }
  return logoDiv;
}

function buildMegamenuNavLinks(li) {
  const left = el('div', { class: 'header-megamenu-left' });
  const subUl = li.querySelector(':scope > ul');
  if (subUl) {
    const navList = el('ul', { class: 'header-megamenu-nav' });
    subUl.querySelectorAll(':scope > li').forEach((subLi) => {
      const navItem = el('li');
      const link = subLi.querySelector('a');
      if (link) {
        navItem.append(el('a', { href: link.getAttribute('href') }, link.textContent));
      } else {
        // DA: text-only <li> items are section headings (e.g., "Current Insights", "Top Categories")
        navItem.classList.add('section-heading');
        navItem.textContent = subLi.textContent;
      }
      navList.append(navItem);
    });
    left.append(navList);
  }
  return left;
}

// Extract promo content from a nav <li> (content after the sub-<ul>)
// DA format: optional <p> subtitle, <h4> heading, <p> description, <p><a> CTA, <p><picture> image
function getPromoContent(li) {
  const children = [...li.children];
  const ulIndex = children.findIndex((c) => c.tagName === 'UL');
  if (ulIndex < 0) return null;

  const afterUl = children.slice(ulIndex + 1);
  const h4 = afterUl.find((c) => c.tagName === 'H4');
  if (!h4) return null;

  const h4Index = afterUl.indexOf(h4);

  // Content before h4 that's plain text (no link/picture) = subtitle
  const subtitle = afterUl.slice(0, h4Index).find(
    (c) => c.tagName === 'P' && !c.querySelector('picture') && !c.querySelector('a'),
  );

  const afterH4 = afterUl.slice(h4Index + 1);
  const description = afterH4.find(
    (c) => c.tagName === 'P' && !c.querySelector('picture') && !c.querySelector('a'),
  );
  const cta = afterH4.find(
    (c) => c.tagName === 'P' && c.querySelector('a') && !c.querySelector('picture'),
  );
  const imageP = afterH4.find(
    (c) => c.tagName === 'P' && c.querySelector('picture'),
  );

  return { subtitle, h4, description, cta, imageP };
}

function buildMegamenuPromo(promoData) {
  const promoEl = el('div', { class: 'header-megamenu-promo' });
  const promoContent = el('div', { class: 'header-megamenu-promo-content' });

  if (promoData.subtitle) {
    promoContent.append(el('span', { class: 'promo-subtitle' }, promoData.subtitle.textContent));
  }

  if (promoData.h4) {
    const headingLink = promoData.h4.querySelector('a');
    if (headingLink) {
      const h4 = el('h4');
      h4.append(el('a', { href: headingLink.getAttribute('href') }, headingLink.textContent));
      promoContent.append(h4);
    } else {
      promoContent.append(el('h4', {}, promoData.h4.textContent));
    }
  }

  if (promoData.description) {
    promoContent.append(el('p', {}, promoData.description.textContent));
  }

  if (promoData.cta) {
    const ctaLink = promoData.cta.querySelector('a');
    if (ctaLink) {
      promoContent.append(el('a', {
        href: ctaLink.getAttribute('href'),
        class: 'promo-cta',
      }, ctaLink.textContent));
    }
  }

  promoEl.append(promoContent);

  if (promoData.imageP) {
    const imgDiv = el('div', { class: 'header-megamenu-promo-image' });
    const picture = promoData.imageP.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) img.loading = 'lazy';
      imgDiv.append(picture);
    }
    promoEl.append(imgDiv);
  }

  return promoEl;
}

// Extract article cards from the Insights nav <li>
// DA format: pairs of <p><a><picture> (linked image) + <p> metadata text
function getArticleCards(li) {
  const children = [...li.children];
  const ulIndex = children.findIndex((c) => c.tagName === 'UL');
  if (ulIndex < 0) return [];

  const afterUl = children.slice(ulIndex + 1);
  const cards = [];

  for (let i = 0; i < afterUl.length - 1; i += 1) {
    const imageP = afterUl[i];
    const metaP = afterUl[i + 1];

    if (imageP.tagName === 'P' && imageP.querySelector('a > picture') && metaP.tagName === 'P') {
      const a = imageP.querySelector('a');
      const picture = a.querySelector('picture');
      const metaText = metaP.textContent;
      const titleLink = metaP.querySelector('a');

      let category = '';
      let date = '';
      let author = '';

      if (titleLink) {
        const titleStart = metaText.indexOf(titleLink.textContent);
        category = metaText.substring(0, titleStart).trim();
        const afterTitle = metaText.substring(titleStart + titleLink.textContent.length).trim();
        // Parse "March 18, 2026 / 3 min read Matthew Bass"
        const dateMatch = afterTitle.match(/^(.{0,80}\d+\s{0,3}min\s(?:read|watch))\s(.*)/);
        if (dateMatch) {
          date = dateMatch[1].trim();
          author = dateMatch[2].trim();
        } else {
          date = afterTitle;
        }
      }

      cards.push({
        imageLink: a, picture, titleLink, category, date, author,
      });
      i += 1; // skip the meta <p>
    }
  }

  return cards;
}

function buildMegamenuArticles(cards) {
  const articlesEl = el('div', { class: 'header-megamenu-articles' });

  cards.forEach((card) => {
    const cardEl = el('div', { class: 'header-megamenu-article-card' });

    const imgWrap = el('a', {
      href: card.imageLink.getAttribute('href'),
      class: 'article-card-image',
    });
    if (card.picture) {
      const img = card.picture.querySelector('img');
      if (img) img.loading = 'lazy';
      imgWrap.append(card.picture);
    }
    cardEl.append(imgWrap);

    const metaEl = el('div', { class: 'article-card-meta' });
    if (card.category) metaEl.append(el('span', { class: 'article-card-category' }, card.category));
    if (card.titleLink) {
      metaEl.append(el('a', {
        href: card.titleLink.getAttribute('href'),
        class: 'article-card-title',
      }, card.titleLink.textContent));
    }
    if (card.date) metaEl.append(el('span', { class: 'article-card-date' }, card.date));
    if (card.author) metaEl.append(el('span', { class: 'article-card-author' }, card.author));
    cardEl.append(metaEl);

    articlesEl.append(cardEl);
  });

  return articlesEl;
}

function buildMegamenuPanel(li) {
  const panel = el('div', { class: 'header-megamenu-panel' });
  const inner = el('div', { class: 'header-megamenu-inner' });

  const left = buildMegamenuNavLinks(li);
  const right = el('div', { class: 'header-megamenu-right' });

  // Determine megamenu type by content after the sub-<ul>
  const articleCards = getArticleCards(li);
  if (articleCards.length > 0) {
    right.append(buildMegamenuArticles(articleCards));
  } else {
    const promoData = getPromoContent(li);
    if (promoData) right.append(buildMegamenuPromo(promoData));
  }

  const closeBtn = el('button', {
    class: 'header-megamenu-close',
    'aria-label': 'Close menu',
  }, closeIcon());
  inner.append(left, right, closeBtn);

  const separator = el('div', { class: 'header-megamenu-separator' });
  panel.append(inner, separator);
  return panel;
}

function buildNav(navSection, header) {
  const nav = el('nav', {
    class: 'header-nav',
    role: 'navigation',
    'aria-label': 'Main Navigation',
  });
  const navList = el('ul', { class: 'header-nav-list' });
  const indicator = el('div', { class: 'header-nav-indicator' });
  const panels = [];

  const sourceUl = navSection.querySelector(':scope > ul');
  if (!sourceUl) return { nav, panels };

  sourceUl.querySelectorAll(':scope > li').forEach((li) => {
    // DA: top-level link is inside <p><a> (not bare <a>)
    const triggerA = li.querySelector(':scope > p > a') || li.querySelector(':scope > a');
    if (!triggerA) return;

    const item = el('li', { class: 'header-nav-item' });
    const triggerBtn = el('button', {
      class: 'header-nav-trigger',
      'aria-expanded': 'false',
    }, triggerA.textContent);

    const panel = buildMegamenuPanel(li);
    panels.push(panel);

    item.dataset.panelIndex = String(panels.length - 1);

    triggerBtn.addEventListener('click', () => {
      const isMobile = window.matchMedia('(max-width: 1023px)').matches;
      if (isMobile) return;

      const wasActive = item.classList.contains('is-active');
      closeAllPanels(header);
      if (!wasActive) {
        header.classList.add('is-open');
        item.classList.add('is-active');
        panel.classList.add('is-open');
        triggerBtn.setAttribute('aria-expanded', 'true');
      }
    });

    triggerBtn.addEventListener('mouseenter', () => {
      const rect = triggerBtn.getBoundingClientRect();
      const navRect = navList.getBoundingClientRect();
      indicator.style.left = `${rect.left - navRect.left}px`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.opacity = '1';
    });

    item.append(triggerBtn);
    navList.append(item);
  });

  navList.addEventListener('mouseleave', () => {
    const active = navList.querySelector('.header-nav-item.is-active .header-nav-trigger');
    if (active) {
      const rect = active.getBoundingClientRect();
      const navRect = navList.getBoundingClientRect();
      indicator.style.left = `${rect.left - navRect.left}px`;
      indicator.style.width = `${rect.width}px`;
    } else {
      indicator.style.opacity = '0';
    }
  });

  indicator.style.backgroundColor = 'var(--brand-primary, #1e9bd7)';
  nav.append(navList, indicator);

  requestAnimationFrame(() => {
    const firstTrigger = navList.querySelector('.header-nav-trigger');
    if (firstTrigger) {
      const rect = firstTrigger.getBoundingClientRect();
      const navRect = navList.getBoundingClientRect();
      indicator.style.left = `${rect.left - navRect.left}px`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.opacity = '1';
    }
  });

  return { nav, panels };
}

function buildSiteSelector(toolsSection, header) {
  // DA format: <div class="site-selector"> with nested divs containing h4+ul region pairs
  const ssSrc = toolsSection.querySelector('.site-selector');
  if (!ssSrc) return null;

  const wrapper = el('div', { class: 'header-site-selector' });
  const trigger = el('button', {
    class: 'header-site-selector-trigger',
    'aria-expanded': 'false',
  });
  const box = el('div', { class: 'ss-box' });
  const leftContent = el('div', { class: 'ss-left' });
  const triggerInner = el('div', { class: 'site-selector-trigger-inner' });

  triggerInner.append(
    el('span', { class: 'site-selector-name' }, 'AllianceBernstein'),
    el('span', { class: 'site-selector-globe' }, globeIcon()),
  );

  const labelEl = el('span', { class: 'site-selector-label' }, 'Choose Your Site');
  leftContent.append(triggerInner, labelEl);
  const iconEl = el('span', { class: 'site-selector-plus' }, plusIcon());
  box.append(leftContent, iconEl);
  trigger.append(box);

  const panel = el('div', { class: 'header-site-selector-panel' });

  // DA site-selector: two child divs — first is trigger area, second contains panel content
  // In DA-published format, the second child has multiple sub-divs:
  //   first sub-div = h3 title, second sub-div = h4+ul region pairs
  const panelContainer = ssSrc.querySelector(':scope > div:nth-child(2)');
  // Find the sub-div that actually contains h4 region headings
  const panelSource = panelContainer
    ? [...panelContainer.querySelectorAll(':scope > div')].find((d) => d.querySelector('h4'))
    : null;
  if (panelSource) {
    const titleBar = el('div', { class: 'site-selector-title-bar' });
    const titleBarInner = el('div', { class: 'site-selector-title-bar-inner' });
    titleBarInner.append(el('h3', {}, 'Choose your site'));
    titleBar.append(titleBarInner);
    panel.append(titleBar);

    const panelInner = el('div', { class: 'site-selector-panel-inner' });
    const regionsDiv = el('div', { class: 'site-selector-regions' });

    // Parse h4 + ul pairs as regions
    const regionHeadings = panelSource.querySelectorAll('h4');
    regionHeadings.forEach((h4, idx) => {
      const regionEl = el('div', { class: 'site-selector-region' });
      if (idx === 1) regionEl.classList.add('site-selector-region-apac');
      if (idx === 2) regionEl.classList.add('site-selector-region-europe');
      regionEl.append(el('h4', {}, h4.textContent));

      const ul = h4.nextElementSibling;
      if (ul && ul.tagName === 'UL') {
        const list = el('ul');
        ul.querySelectorAll('li').forEach((item) => {
          // DA escapes <button> to &lt;button>, so strip the prefix from text
          const text = item.textContent.trim().replace(/^<button>/, '');
          const li = el('li');
          li.append(el('button', {}, text));
          list.append(li);
        });
        regionEl.append(list);
      }
      regionsDiv.append(regionEl);
    });

    panelInner.append(regionsDiv);
    panel.append(panelInner);
  }

  trigger.addEventListener('click', () => {
    const wasOpen = wrapper.classList.contains('is-open');
    closeAllPanels(header);
    if (!wasOpen) {
      header.classList.add('is-open');
      wrapper.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  wrapper.append(trigger, panel);
  return wrapper;
}

function buildSearchBar(header) {
  const bar = el('div', { class: 'header-search-bar' });
  const inner = el('div', { class: 'header-search-inner' });
  const input = el('input', {
    type: 'text',
    class: 'header-search-input',
    placeholder: 'Enter a Keyword, Topic, or Question',
    'aria-label': 'Search',
  });
  const submitBtn = el('button', {
    class: 'header-search-submit',
    'aria-label': 'Submit search',
  }, searchIcon());
  const closeBtn = el('button', {
    class: 'header-search-close',
    'aria-label': 'Close search',
  }, closeIcon());

  closeBtn.addEventListener('click', () => {
    closeAllPanels(header);
  });

  inner.append(submitBtn, input, closeBtn);
  bar.append(inner);
  return bar;
}

function chevronIcon() { return createIcon('0 0 512 512', 20, 20, CHEVRON_D); }

function collapseAllAccordions(header) {
  header.querySelectorAll('.header-nav-item.is-expanded').forEach((item) => {
    item.classList.remove('is-expanded');
  });
  header.querySelectorAll('.header-megamenu-panel.mobile-visible').forEach((p) => {
    p.classList.remove('mobile-visible');
  });
}

function buildHamburger(header) {
  const btn = el('button', {
    class: 'header-hamburger',
    'aria-label': 'Open navigation menu',
  }, hamburgerIcon());
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = header.classList.contains('header-mobile-open');
    if (isOpen) {
      header.classList.remove('header-mobile-open');
      header.classList.remove('is-open');
      collapseAllAccordions(header);
      btn.setAttribute('aria-label', 'Open navigation menu');
      btn.textContent = '';
      btn.append(hamburgerIcon());
    } else {
      closeAllPanels(header);
      header.classList.add('header-mobile-open');
      header.classList.add('is-open');
      btn.setAttribute('aria-label', 'Close navigation menu');
      btn.textContent = '';
      btn.append(closeIcon());
    }
  });
  return btn;
}

function handleAccordionClick(header, item, mql) {
  if (!mql.matches) return;
  const wasExpanded = item.classList.contains('is-expanded');
  collapseAllAccordions(header);
  if (!wasExpanded) {
    item.classList.add('is-expanded');
    const panelEl = item.querySelector('.header-megamenu-panel');
    if (panelEl) panelEl.classList.add('mobile-visible');
  }
}

function movePanelsIntoNavItems(header) {
  const panelEls = header.querySelectorAll('.header-inner > .header-megamenu-panel');
  header.querySelectorAll('.header-nav-item').forEach((item) => {
    const idx = item.dataset.panelIndex;
    if (idx !== undefined && panelEls[idx] && !item.contains(panelEls[idx])) {
      item.append(panelEls[idx]);
    }
  });
}

function movePanelsBackToInner(header) {
  const inner = header.querySelector('.header-inner');
  header.querySelectorAll('.header-nav-item > .header-megamenu-panel').forEach((panelEl) => {
    inner.append(panelEl);
  });
}

function setupMobileAccordion(header) {
  const mql = window.matchMedia('(max-width: 1023px)');

  header.querySelectorAll('.header-nav-item').forEach((item) => {
    const triggerEl = item.querySelector('.header-nav-trigger');
    if (!triggerEl || triggerEl.dataset.mobileReady) return;
    triggerEl.dataset.mobileReady = 'true';
    triggerEl.append(el('span', { class: 'header-nav-chevron' }, chevronIcon()));
    triggerEl.addEventListener('click', () => handleAccordionClick(header, item, mql));
  });

  if (mql.matches) movePanelsIntoNavItems(header);

  mql.addEventListener('change', (e) => {
    if (e.matches) {
      movePanelsIntoNavItems(header);
    } else {
      header.classList.remove('header-mobile-open');
      header.classList.remove('is-open');
      collapseAllAccordions(header);
      movePanelsBackToInner(header);
      const hamburger = header.querySelector('.header-hamburger');
      if (hamburger) {
        hamburger.textContent = '';
        hamburger.append(hamburgerIcon());
        hamburger.setAttribute('aria-label', 'Open navigation menu');
      }
    }
  });
}

export default async function decorate(block) {
  const resp = await fetch('/nav.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();
  const parser = new DOMParser(); // eslint-disable-line secure-coding/no-xxe-injection
  const doc = parser.parseFromString(html, 'text/html');
  const sections = doc.querySelectorAll(':scope > body > div');
  if (sections.length < 3) return;

  const [logoSection, navSection, toolsSection] = sections;

  block.textContent = '';
  block.classList.add('header-transparent');

  const headerWrapper = el('div', { class: 'header-inner' });

  const utilityBar = buildUtilityBar(toolsSection);
  const searchBar = buildSearchBar(block);

  const mainRow = el('div', { class: 'header-main-row' });
  const logo = buildLogo(logoSection);
  const { nav, panels } = buildNav(navSection, block);
  const siteSelector = buildSiteSelector(toolsSection, block);
  const hamburger = buildHamburger(block);

  mainRow.append(logo, nav);
  if (siteSelector) mainRow.append(siteSelector);
  mainRow.append(hamburger);

  headerWrapper.append(utilityBar, searchBar, mainRow);
  panels.forEach((p) => headerWrapper.append(p));
  block.append(headerWrapper);

  const searchToggle = utilityBar.querySelector('.header-search-toggle');
  searchToggle?.addEventListener('click', () => {
    const wasOpen = searchBar.classList.contains('is-open');
    closeAllPanels(block);
    if (!wasOpen) {
      block.classList.add('is-open');
      searchBar.classList.add('is-open');
      searchBar.querySelector('input')?.focus();
    }
  });

  block.querySelectorAll('.header-megamenu-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAllPanels(block);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPanels(block);
  });

  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) closeAllPanels(block);
  });

  setupMobileAccordion(block);
}
