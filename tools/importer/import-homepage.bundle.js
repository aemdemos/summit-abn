var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const posterImg = element.querySelector(".vjs-poster img") || element.querySelector(".abde-video-wrapper img");
    const heading = element.querySelector(".abde-home-hero-content h1") || element.querySelector(".abde-home-hero-content h2") || element.querySelector("h1") || element.querySelector("h2");
    const description = element.querySelector(".abde-hero-box .abde-pt-sm p") || element.querySelector(".abde-home-hero-content p") || element.querySelector(".abde-text-description p");
    const cta = element.querySelector(".abde-home-hero-content a.abde-btn") || element.querySelector("a.abde-btn");
    const cells = [];
    if (posterImg) {
      cells.push([posterImg]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-video",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-insights.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(".abde-card-insight-generic");
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".abde-image-container img") || card.querySelector("img.img-fluid") || card.querySelector("img");
      const textContent = [];
      const category = card.querySelector("header");
      if (category) {
        const p = document.createElement("p");
        p.textContent = category.textContent.trim();
        textContent.push(p);
      }
      const titleEl = card.querySelector(".abde-card-insight-title");
      if (titleEl) {
        const titleLink = titleEl.closest("a");
        if (titleLink) {
          const h3 = document.createElement("h3");
          const a = document.createElement("a");
          a.href = titleLink.href;
          a.textContent = titleEl.textContent.trim();
          h3.appendChild(a);
          textContent.push(h3);
        } else {
          const h3 = document.createElement("h3");
          h3.textContent = titleEl.textContent.trim();
          textContent.push(h3);
        }
      }
      const dateEl = card.querySelector(".abde-card-insight-date");
      if (dateEl) {
        const p = document.createElement("p");
        p.textContent = dateEl.textContent.trim();
        textContent.push(p);
      }
      const authorEl = card.querySelector(".abde-card-insight-author");
      if (authorEl) {
        const p = document.createElement("p");
        const authorLinks = authorEl.querySelectorAll("a");
        if (authorLinks.length > 0) {
          authorLinks.forEach((aLink, idx) => {
            if (idx > 0) p.appendChild(document.createTextNode(", "));
            const a = document.createElement("a");
            a.href = aLink.href;
            a.textContent = aLink.textContent.trim();
            p.appendChild(a);
          });
        } else {
          p.textContent = authorEl.textContent.trim();
        }
        textContent.push(p);
      }
      const descEl = card.querySelector('[class*="insight-card-description"] p') || card.querySelector(".abde-card-insight-body p");
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        textContent.push(p);
      }
      if (image || textContent.length > 0) {
        cells.push([image || "", textContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-insights",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-video-text.js
  function parse3(element, { document }) {
    if (!element.parentNode) return;
    const section = element.closest("section");
    const posterSrc = element.querySelector(".vjs-poster img") || element.querySelector("img");
    let col1;
    if (posterSrc) {
      col1 = document.createElement("img");
      col1.src = posterSrc.getAttribute("src") || posterSrc.src;
      col1.alt = posterSrc.alt || "";
    } else {
      col1 = "";
    }
    const searchRoot = section || element.parentElement;
    const cardIcon = searchRoot.querySelector(".abde-card-icon");
    const col2Content = [];
    if (cardIcon) {
      const icon = cardIcon.querySelector(".abde-icon img");
      if (icon) {
        const iconImg = document.createElement("img");
        iconImg.src = icon.getAttribute("src") || icon.src;
        iconImg.alt = icon.alt || "";
        col2Content.push(iconImg);
      }
      const heading = cardIcon.querySelector("h2") || cardIcon.querySelector("h3");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        col2Content.push(h2);
      }
      cardIcon.querySelectorAll(".abde-text-container p").forEach((p) => {
        if (p.textContent.trim()) {
          const newP = document.createElement("p");
          newP.textContent = p.textContent.trim();
          col2Content.push(newP);
        }
      });
      const cta = cardIcon.querySelector("a.abde-btn");
      if (cta) {
        const link = document.createElement("a");
        link.href = cta.getAttribute("href") || cta.href;
        link.textContent = cta.textContent.trim().replace(/\s+/g, " ");
        col2Content.push(link);
      }
      const cardIconCol = cardIcon.closest('[class*="abde-col-mdlg-5"]') || cardIcon.closest(".abde-card");
      if (cardIconCol) cardIconCol.remove();
    }
    const cells = [[col1, col2Content]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-video-text",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-flip-cards.js
  function parse4(element, { document }) {
    if (!element.parentNode) return;
    const section = element.closest("section");
    const searchRoot = section || element.parentElement;
    const col1Content = [];
    const heading = searchRoot.querySelector(".abde-text-description h2") || searchRoot.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col1Content.push(h2);
    }
    const desc = searchRoot.querySelector(".abde-text-description p");
    if (desc && desc.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      col1Content.push(p);
    }
    const cta = searchRoot.querySelector("a.abde-btn");
    if (cta) {
      const link = document.createElement("a");
      link.href = cta.href;
      link.textContent = cta.textContent.trim().replace(/\s+/g, " ");
      col1Content.push(link);
    }
    const flipCards = searchRoot.querySelectorAll(".abde-flip-card-wrapper");
    const col2Content = [];
    flipCards.forEach((card) => {
      const frontIcon = card.querySelector(".abde-flip-card-inner-front-container img");
      if (frontIcon) {
        const iconImg = document.createElement("img");
        iconImg.src = frontIcon.src;
        iconImg.alt = frontIcon.alt || "";
        col2Content.push(iconImg);
      }
      const frontHeading = card.querySelector(".abde-flip-icons-heading");
      if (frontHeading) {
        const h3 = document.createElement("h3");
        h3.textContent = frontHeading.textContent.trim();
        col2Content.push(h3);
      }
      const backDesc = card.querySelector(".abde-flip-card-inner-back-container .abde-description p") || card.querySelector(".abde-flip-card-inner-back-container p");
      if (backDesc) {
        const p = document.createElement("p");
        p.textContent = backDesc.textContent.trim();
        col2Content.push(p);
      }
    });
    const textCol = searchRoot.querySelector('[class*="abde-col-mdlg-5"]');
    if (textCol && textCol !== element.closest('[class*="abde-col-mdlg-5"]')) {
      textCol.remove();
    }
    flipCards.forEach((card) => {
      if (card !== element) card.remove();
    });
    const cells = [];
    cells.push([col1Content, col2Content]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-flip-cards",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-image-text.js
  function parse5(element, { document }) {
    if (!element.parentNode) return;
    const imageCol = element.closest('[class*="abde-col-mdlg-7"]');
    if (!imageCol) return;
    const section = element.closest("section");
    const searchRoot = section || element.parentElement;
    const textCol = searchRoot.querySelector('[class*="abde-col-mdlg-5"]');
    if (!textCol || !textCol.querySelector(".abde-text-description h2")) return;
    const img = element.querySelector("img");
    let col1;
    if (img) {
      col1 = document.createElement("img");
      col1.src = img.getAttribute("src") || img.src;
      col1.alt = img.alt || "";
    } else {
      col1 = "";
    }
    const col2Content = [];
    const heading = textCol.querySelector(".abde-text-description h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col2Content.push(h2);
    }
    textCol.querySelectorAll(".abde-text-description p").forEach((p) => {
      if (p.textContent.trim()) {
        const newP = document.createElement("p");
        newP.textContent = p.textContent.trim();
        col2Content.push(newP);
      }
    });
    const cta = textCol.querySelector("a.abde-btn");
    if (cta) {
      const link = document.createElement("a");
      link.href = cta.getAttribute("href") || cta.href;
      link.textContent = cta.textContent.trim().replace(/\s+/g, " ");
      col2Content.push(link);
    }
    textCol.remove();
    const cells = [[col1, col2Content]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-image-text",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-news.js
  function parse6(element, { document }) {
    if (!element.parentNode) return;
    const section = element.closest("section");
    const searchRoot = section || element.parentElement;
    const imgEl = searchRoot.querySelector(".abde-image-container img");
    let col1;
    if (imgEl) {
      col1 = document.createElement("img");
      col1.src = imgEl.getAttribute("src") || imgEl.src;
      col1.alt = imgEl.alt || "";
    } else {
      col1 = "";
    }
    const col2Content = [];
    const icon = element.querySelector(".abde-icon img");
    if (icon) {
      const iconImg = document.createElement("img");
      iconImg.src = icon.getAttribute("src") || icon.src;
      iconImg.alt = icon.alt || "";
      col2Content.push(iconImg);
    }
    const eyebrow = element.querySelector(".abde-text-eyebrow");
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      col2Content.push(p);
    }
    const heading = element.querySelector(".abde-text-container h2") || element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col2Content.push(h2);
    }
    element.querySelectorAll(".abde-text-container p").forEach((p) => {
      if (p.classList.contains("abde-text-eyebrow")) return;
      if (p.textContent.trim()) {
        const newP = document.createElement("p");
        const link = p.querySelector("a");
        if (link) {
          const a = document.createElement("a");
          a.href = link.getAttribute("href") || link.href;
          a.textContent = link.textContent.trim();
          newP.appendChild(a);
          const trailing = p.textContent.replace(link.textContent, "").trim();
          if (trailing) {
            newP.appendChild(document.createTextNode(trailing));
          }
        } else {
          newP.textContent = p.textContent.trim();
        }
        col2Content.push(newP);
      }
    });
    const imgCol = searchRoot.querySelector('[class*="abde-col-mdlg-6"]');
    if (imgCol && !imgCol.contains(element)) {
      imgCol.remove();
    }
    const cells = [[col1, col2Content]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-news",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse7(element, { document }) {
    if (!element.parentNode) return;
    const section = element.closest("section");
    const searchRoot = section || element.parentElement;
    const cards = searchRoot.querySelectorAll(".abde-card-generic.hoverenabled");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("a > img") || card.querySelector("img");
      let col1;
      if (img) {
        col1 = document.createElement("img");
        col1.src = img.getAttribute("src") || img.src;
        col1.alt = img.alt || "";
      } else {
        col1 = "";
      }
      const textContent = [];
      const eyebrow = card.querySelector(".abde-card-eyebrow");
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textContent.push(p);
      }
      const titleLink = card.querySelector(".abde-text-container a");
      const titleEl = card.querySelector("h4");
      if (titleEl) {
        const h4 = document.createElement("h4");
        if (titleLink) {
          const a = document.createElement("a");
          a.href = titleLink.getAttribute("href") || titleLink.href;
          a.textContent = titleEl.textContent.trim();
          h4.appendChild(a);
        } else {
          h4.textContent = titleEl.textContent.trim();
        }
        textContent.push(h4);
      }
      const descP = card.querySelector(".abde-text-container p");
      if (descP && descP.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = descP.textContent.trim();
        textContent.push(p);
      }
      const ctaLink = card.querySelector("a.abde-text-link");
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href") || ctaLink.href;
        a.textContent = ctaLink.textContent.trim().replace(/\s+/g, " ");
        textContent.push(a);
      }
      if (col1 || textContent.length > 0) {
        cells.push([col1 || "", textContent]);
      }
    });
    cards.forEach((card) => {
      if (card !== element) card.remove();
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-promo",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote-dark.js
  function parse8(element, { document }) {
    if (!element.parentNode) return;
    const cells = [];
    const quoteText = element.querySelector("p.abde-quote-text");
    if (quoteText) {
      const p = document.createElement("p");
      p.textContent = quoteText.textContent.trim();
      cells.push([p]);
    }
    const allP = element.querySelectorAll(".abde-quote-text-over p");
    const attribution = Array.from(allP).find(
      (p) => !p.classList.contains("abde-quote-text")
    );
    if (attribution && attribution.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = attribution.textContent.trim();
      cells.push([p]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "quote-dark",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ab-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#global-enterprise-search-overlay",
        "#global-enterprise-search-header",
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        "#CybotCookiebotDialog"
      ]);
      const spacers = element.querySelectorAll(".abde-spacer");
      spacers.forEach((spacer) => spacer.remove());
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".abde-header",
        "header",
        "nav.abde-global-nav",
        ".abde-footer",
        "footer",
        ".abde-footer-container",
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
      const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml"]');
      svgIcons.forEach((icon) => icon.remove());
      const xfPages = element.querySelectorAll(".cmp-experiencefragment");
      xfPages.forEach((xf) => {
        if (xf.textContent.trim() === "") {
          xf.remove();
        }
      });
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-fa-i2svg");
      });
    }
  }

  // tools/importer/transformers/ab-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const sectionElements = [];
      for (const section of sections) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (sectionEl) {
          sectionElements.push({ el: sectionEl, section });
        }
      }
      sectionElements.sort((a, b) => {
        const pos = a.el.compareDocumentPosition(b.el);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { el, section } = sectionElements[i];
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          el.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          el.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "cards-insights": parse2,
    "columns-video-text": parse3,
    "columns-flip-cards": parse4,
    "columns-image-text": parse5,
    "columns-news": parse6,
    "cards-promo": parse7,
    "quote-dark": parse8
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AllianceBernstein corporate homepage with hero, featured content sections, and promotional cards",
    urls: [
      "https://www.alliancebernstein.com/corporate/en/home.html"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: [".abde-home-hero"]
      },
      {
        name: "cards-insights",
        instances: [".abde-related-insights-container"]
      },
      {
        name: "columns-video-text",
        instances: [".abde-brightcove-video-player"]
      },
      {
        name: "columns-flip-cards",
        instances: [".abde-flip-card-wrapper"]
      },
      {
        name: "columns-image-text",
        instances: [".abde-image-container"]
      },
      {
        name: "columns-news",
        instances: [".abde-card-icon.abde-theme-bg-transparent.abde-icon-left-of-text"]
      },
      {
        name: "cards-promo",
        instances: [".abde-card-generic.hoverenabled"]
      },
      {
        name: "quote-dark",
        instances: [".abde-quote-container"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero",
        selector: ".abde-home-hero",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-insights",
        name: "Sharing Differentiated Insights",
        selector: ".abde-related-insights",
        style: null,
        blocks: ["cards-insights"],
        defaultContent: ["h2"]
      },
      {
        id: "section-making-difference",
        name: "Making a Difference",
        selector: [".abde-section-focus-title"],
        style: null,
        blocks: ["columns-video-text"],
        defaultContent: [".abde-section-focus-title"]
      },
      {
        id: "section-what-we-do",
        name: "What We Do",
        selector: [".abde-section-focus-title"],
        style: null,
        blocks: ["columns-flip-cards"],
        defaultContent: [".abde-section-focus-title"]
      },
      {
        id: "section-culture",
        name: "Our Culture",
        selector: [".abde-section-focus-title"],
        style: null,
        blocks: ["columns-image-text"],
        defaultContent: [".abde-section-focus-title"]
      },
      {
        id: "section-innovation",
        name: "Innovation",
        selector: "section.abde-theme-bg-darkest",
        style: "dark",
        blocks: ["columns-news"],
        defaultContent: [".abde-section-focus-title"]
      },
      {
        id: "section-promo-cards",
        name: "Bottom Promotional Cards",
        selector: ".abde-sidebar",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: []
      },
      {
        id: "section-quote",
        name: "CEO Quote",
        selector: ".abde-quote",
        style: "dark",
        blocks: ["quote-dark"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    /**
     * Main transformation function using one input / multiple outputs pattern
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
