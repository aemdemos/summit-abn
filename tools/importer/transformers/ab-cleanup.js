/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AllianceBernstein cleanup.
 * Removes non-authorable content from the page DOM.
 * Selectors from captured DOM of https://www.alliancebernstein.com/corporate/en/home.html
 */
const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent overlays, search overlay, video player chrome
    // Found in captured DOM: <div id="global-enterprise-search-overlay">
    WebImporter.DOMUtils.remove(element, [
      '#global-enterprise-search-overlay',
      '#global-enterprise-search-header',
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '#CybotCookiebotDialog',
    ]);

    // Remove spacer elements that add empty whitespace
    // Found in captured DOM: <div class="abde-spacer"><div class="abde-mb-xl">&nbsp;</div></div>
    const spacers = element.querySelectorAll('.abde-spacer');
    spacers.forEach((spacer) => spacer.remove());
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // Found in captured DOM: <div class="abde-header ..."><header ...><nav class="abde-global-nav ...">
    // Found in captured DOM: <footer class="abde-footer-container abde-theme-bg-darkest">
    WebImporter.DOMUtils.remove(element, [
      '.abde-header',
      'header',
      'nav.abde-global-nav',
      '.abde-footer',
      'footer',
      '.abde-footer-container',
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Remove inline SVG icon images (base64 data URIs used for decorative icons)
    const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgIcons.forEach((icon) => icon.remove());

    // Remove empty experience fragment wrappers
    // Found in captured DOM: <div class="experiencefragment ..."><div class="cmp-experiencefragment">
    const xfPages = element.querySelectorAll('.cmp-experiencefragment');
    xfPages.forEach((xf) => {
      if (xf.textContent.trim() === '') {
        xf.remove();
      }
    });

    // Clean up tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-fa-i2svg');
    });
  }
}
