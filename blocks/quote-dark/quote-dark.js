export default function decorate(block) {
  const [quotationRow, attributionRow] = [...block.children];
  const quotation = quotationRow?.firstElementChild;
  const attribution = attributionRow?.firstElementChild;

  const blockquote = document.createElement('blockquote');

  // Decorative open-quote mark
  const icon = document.createElement('div');
  icon.className = 'quote-dark-icon';
  icon.textContent = '\u201C';
  blockquote.append(icon);

  // Quotation text
  if (quotation) {
    quotation.className = 'quote-dark-quotation';
    blockquote.append(quotation);
  }

  // Attribution line
  if (attribution) {
    attribution.className = 'quote-dark-attribution';
    blockquote.append(attribution);
  }

  block.textContent = '';
  block.append(blockquote);
}
