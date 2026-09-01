const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Zatvoriť menu' : 'Otvoriť menu');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const gallerySets = {
  ppf: ['gallery-ppf-dodge.jpeg','gallery-ppf-display-bmw.jpeg','gallery-ppf-bmw-exterior.jpeg','gallery-ppf-display-skoda.jpeg'],
  tint: ['gallery-tonovanie-skiel.jpeg','gallery-tint-01-skoda-white.jpeg','gallery-tint-02-skoda-karoq.jpeg','gallery-tint-03-toyota-van.jpeg','gallery-tint-04-panoramic-roof.jpeg','gallery-tint-05-fiat-van.jpeg','gallery-tint-06-mg-suv.jpeg','gallery-tint-07-mercedes.jpeg','gallery-tint-08-opel.jpeg','gallery-tint-09-mitsubishi.jpeg','gallery-tint-10-kia.jpeg'],
  wrap: ['gallery-dechrome-wrap.jpeg','gallery-wrap-01-carbon-detail.jpeg','gallery-wrap-02-mini.jpeg','gallery-wrap-03-skoda-hood.jpeg','gallery-wrap-04-bmw-spoiler.jpeg','gallery-wrap-05-bmw-roof-detail.jpeg','gallery-wrap-06-bmw-roof.jpeg','gallery-wrap-07-bmw-full.jpeg','gallery-wrap-08-skoda-trim.jpeg','gallery-wrap-09-skoda-grille.jpeg','gallery-wrap-10-side-trim.jpeg'],
  building: ['gallery-okenne-folie-budovy.jpeg','gallery-building-01-house-windows.jpeg','gallery-building-02-window.jpeg','gallery-building-03-glass-door.jpeg','gallery-building-04-interior.jpeg','gallery-building-05-interior-window.jpeg','gallery-building-06-terrace-door.jpeg'],
  lights: ['gallery-lights-01-skoda-rear.jpeg','gallery-lights-02-skoda-front.jpeg','gallery-lights-03-land-rover-rear.jpeg','gallery-lights-04-land-rover-front.jpeg','gallery-lights-05-skoda-superb.jpeg','gallery-lights-06-skoda-octavia-grey.jpeg','gallery-lights-07-hyundai.jpeg','gallery-lights-08-skoda-octavia-white.jpeg']
};

const lightbox = document.querySelector('.gallery-lightbox');
let activeSlider = null;

document.querySelectorAll('.gallery-slider').forEach((slider) => {
  const photos = gallerySets[slider.dataset.gallery];
  const title = slider.querySelector('h3').textContent;
  const image = slider.querySelector('img');
  const count = slider.querySelector('.gallery-count');
  const dots = slider.querySelector('.gallery-dots');
  let index = 0;
  let touchStart = 0;

  photos.forEach((_, dotIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Fotografia ${dotIndex + 1}`);
    dot.addEventListener('click', () => show(dotIndex));
    dots.appendChild(dot);
  });

  function show(nextIndex) {
    index = (nextIndex + photos.length) % photos.length;
    image.src = photos[index];
    image.alt = `${title} – realizácia ${index + 1} z ${photos.length}, Autofólie DS`;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    dots.querySelectorAll('button').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
    if (lightbox && !lightbox.hidden && activeSlider === api) updateLightbox();
  }

  const api = { photos, title, get index() { return index; }, show };
  slider.querySelector('.gallery-prev').addEventListener('click', () => show(index - 1));
  slider.querySelector('.gallery-next').addEventListener('click', () => show(index + 1));
  slider.querySelector('.gallery-open').addEventListener('click', () => { activeSlider = api; updateLightbox(); lightbox.hidden = false; document.body.classList.add('lightbox-open'); });
  slider.querySelector('.gallery-stage').addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  slider.querySelector('.gallery-stage').addEventListener('touchend', (event) => { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) show(index + (distance < 0 ? 1 : -1)); }, { passive: true });
  show(0);
});

function updateLightbox() {
  lightbox.querySelector('img').src = activeSlider.photos[activeSlider.index];
  lightbox.querySelector('img').alt = `${activeSlider.title} – zväčšená fotografia`;
  lightbox.querySelector('.lightbox-count').textContent = `${activeSlider.index + 1} / ${activeSlider.photos.length}`;
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove('lightbox-open');
}

if (lightbox) {
  lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => activeSlider?.show(activeSlider.index - 1));
  lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => activeSlider?.show(activeSlider.index + 1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden || !activeSlider) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') activeSlider.show(activeSlider.index - 1);
    if (event.key === 'ArrowRight') activeSlider.show(activeSlider.index + 1);
  });
}

