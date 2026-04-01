export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-news-${cols.length}-cols`);

  // Fixed layout: col[0] = image, col[1] = text
  [...block.children].forEach((row) => {
    const rowCols = [...row.children];
    const imgCol = rowCols[0];
    if (imgCol) {
      imgCol.classList.add('columns-news-img-col');
      imgCol.querySelectorAll('img').forEach((img) => {
        img.loading = 'lazy';
        if (!img.hasAttribute('width')) {
          img.setAttribute('width', '800');
          img.setAttribute('height', '450');
        }
      });
    }
  });

  // Text column is always col[1]
  const textCol = [...block.firstElementChild.children][1];

  if (textCol) {
    const firstP = textCol.querySelector('p:first-child');
    const iconImg = firstP ? firstP.querySelector('img') : null;

    if (iconImg && firstP.children.length === 1) {
      iconImg.loading = 'lazy';
      if (!iconImg.hasAttribute('width')) {
        iconImg.setAttribute('width', '48');
        iconImg.setAttribute('height', '48');
      }
      // Create icon wrapper
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'news-icon';
      iconWrapper.append(iconImg);

      // Create text wrapper for remaining content
      const textWrapper = document.createElement('div');
      textWrapper.className = 'news-text';

      // Move all remaining children (skip the icon <p>) into text wrapper
      [...textCol.children].forEach((child) => {
        if (child !== firstP) {
          textWrapper.append(child);
        }
      });

      // Remove the old icon paragraph
      firstP.remove();

      // Clear text column and add icon + text wrappers
      textCol.textContent = '';
      textCol.append(iconWrapper, textWrapper);
    }
  }
}
