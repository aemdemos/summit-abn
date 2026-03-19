export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-image-text-${cols.length}-cols`);

  // setup image columns — detect by picture or img
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture') || col.querySelector('img');
      if (pic && !col.querySelector('h2') && !col.querySelector('h3')) {
        col.classList.add('columns-image-text-img-col');
      }
    });
  });
}
