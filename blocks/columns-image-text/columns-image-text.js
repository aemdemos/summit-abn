export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-image-text-${cols.length}-cols`);

  // Fixed layout: col[0] = image, col[1] = text
  [...block.children].forEach((row) => {
    const imgCol = [...row.children][0];
    if (imgCol) {
      imgCol.classList.add('columns-image-text-img-col');
      imgCol.querySelectorAll('img').forEach((img) => {
        img.loading = 'lazy';
        if (!img.hasAttribute('width')) {
          img.setAttribute('width', '800');
          img.setAttribute('height', '600');
        }
      });
    }
  });
}
