// Kokotiedot perustuvat projektin mittakuviin, eivät mallien nimien numeroihin.
const MODEL_DIMENSIONS = {
  'compact-aitta-16': { area: '15,7', dimensions: '5,50 × 2,85 m' },
  'compact-saunatupa-16': { area: '15,7', dimensions: '5,50 × 2,85 m' },
  'classic-aitta-20': { area: '20', dimensions: '7,00 × 2,85 m' },
  'classic-saunatupa-20': { area: '20', dimensions: '7,00 × 2,85 m' },
  'grand-aitta-30': { area: '29,7', dimensions: '9,00 × 3,30 m' },
  'grand-saunatupa-30': { area: '29,7', dimensions: '9,00 × 3,30 m' },
  'nordic-pihasauna': { area: '10,2', dimensions: '3,10 × 3,30 m' },
};
const MODEL_PERMIT_COPY = 'Muu kuin asuinrakennus voi soveltua toteutettavaksi ilman rakentamislupaa, kun pinta-ala on alle 30 m² ja tilavuus alle 120 m³. Käyttötarkoitus, varustelu ja rakennuspaikka ratkaisevat. Varmista edellytykset kunnan rakennusvalvonnasta.';

const modelSizeText = (id) => {
  const size = MODEL_DIMENSIONS[id];
  return size ? `Pohja-ala noin ${size.area} m² · ulkomitat ${size.dimensions}` : 'Vakiokoot 6, 9 ja 16 m² · myös omilla mitoilla';
};
const createCatalogReturn = (href = 'mallisto.html') => {
  const link = document.createElement('a');
  link.className = 'button button-secondary catalog-return';
  link.href = href;
  link.textContent = '← Takaisin mallistoon';
  return link;
};
const addModelSuggestions = (currentId, main) => {
  const candidates = Object.entries(MODEL_LIBRARY)
    .filter(([id, model]) => id !== currentId && id !== 'nordmod-terassi' && model.image?.src && MODEL_DIMENSIONS[id]);
  const sauna = currentId?.includes('sauna');
  candidates.sort(([a], [b]) => Number(b.includes('sauna') === sauna) - Number(a.includes('sauna') === sauna));
  const section = document.createElement('section');
  section.className = 'section related-models';
  const heading = document.createElement('h2');
  heading.textContent = 'Tutustu myös muihin malleihin';
  const grid = document.createElement('div'); grid.className = 'related-model-grid';
  for (const [id, model] of candidates.slice(0, 3)) {
    const card = document.createElement('article'); card.className = 'related-model-card';
    const image = document.createElement('img'); image.src = model.image.src; image.alt = model.image.alt || model.name; image.loading = 'lazy';
    const content = document.createElement('div'); content.className = 'related-model-copy';
    const name = document.createElement('h3'); name.textContent = model.name;
    const size = document.createElement('p'); size.className = 'model-size'; size.textContent = modelSizeText(id);
    const link = document.createElement('a'); link.className = 'button button-secondary'; link.href = `malli.html?model=${encodeURIComponent(id)}`; link.textContent = 'Tutustu malliin';
    content.append(name, size, link); card.append(image, content); grid.append(card);
  }
  section.append(heading, grid); main.appendChild(section);
};

// Mallisarjojen kortit saavat mitat otsikon alle ja ankkurin paluulinkkiä varten.
document.querySelectorAll('.catalog-card').forEach((card) => {
  const link = card.querySelector('a[href*="malli.html?model="]');
  const heading = card.querySelector('h3');
  if (!link || !heading) return;
  const requested = new URL(link.href).searchParams.get('model');
  const id = MODEL_ALIASES[requested] || requested;
  if (!MODEL_DIMENSIONS[id]) return;
  card.id = `malli-${id}`;
  const size = document.createElement('p'); size.className = 'model-size'; size.textContent = modelSizeText(id);
  heading.insertAdjacentElement('afterend', size);
});

const currentPage = location.pathname.split('/').pop();
const modelMain = document.querySelector('main');
if (modelMain && currentPage === 'malli.html') {
  const requested = new URLSearchParams(location.search).get('model');
  const id = MODEL_ALIASES[requested] || requested;
  const model = MODEL_LIBRARY[id];
  if (model) {
    const heading = document.getElementById('model-name');
    const size = document.createElement('p'); size.className = 'model-size'; size.textContent = modelSizeText(id);
    heading.insertAdjacentElement('afterend', size);
    if (MODEL_DIMENSIONS[id]) {
      const permit = document.createElement('p'); permit.className = 'model-permit-note'; permit.textContent = MODEL_PERMIT_COPY;
      document.getElementById('model-overview').insertAdjacentElement('afterend', permit);
    }
    const productInfo = document.querySelector('.product-info-card');
    const introActions = document.querySelector('.detail-intro .hero-actions');
    if (productInfo && introActions) {
      productInfo.querySelector('.product-price-actions')?.remove();
      productInfo.appendChild(introActions);
    }
    const priceNote = document.getElementById('model-price-note');
    if (priceNote && productInfo) productInfo.appendChild(priceNote);
    const technicalCard = document.querySelector('.technical-content-card');
    if (technicalCard) {
      const accordion = document.createElement('details');
      accordion.className = 'technical-accordion';
      const summary = document.createElement('summary');
      const title = document.createElement('span');
      title.className = 'technical-accordion-title';
      title.textContent = 'Tekninen toimitussisältö';
      const hint = document.createElement('span');
      hint.className = 'technical-accordion-hint';
      hint.textContent = 'Avaa ja katso materiaalit, varustelu ja toimitussisältö';
      summary.append(title, hint);
      const content = document.createElement('div');
      content.className = 'technical-accordion-content';
      while (technicalCard.firstChild) content.appendChild(technicalCard.firstChild);
      accordion.append(summary, content);
      technicalCard.replaceWith(accordion);
      if (productInfo) productInfo.insertAdjacentElement('afterend', accordion);
    }
    const href = model.backLink === 'mallisto.html' ? 'mallisto.html' : `${model.backLink}#malli-${id}`;
    modelMain.prepend(createCatalogReturn(href));
    const existing = document.getElementById('model-back-link');
    existing.href = href; existing.textContent = '← Takaisin mallistoon';
    addModelSuggestions(id, modelMain);
    modelMain.appendChild(createCatalogReturn(href));
  }
} else if (modelMain && /^mallisto-.+\.html$/.test(currentPage)) {
  modelMain.prepend(createCatalogReturn());
  if (currentPage === 'mallisto-custom.html') {
    const size = document.createElement('p'); size.className = 'model-size'; size.textContent = 'Koko suunnitellaan tarpeidesi mukaan';
    modelMain.querySelector('h1')?.insertAdjacentElement('afterend', size);
    addModelSuggestions(null, modelMain);
  }
  modelMain.appendChild(createCatalogReturn());
}
// Suora linkki toimii myös erikseen avatulla tuotesivulla. Ankkuri palauttaa kortille.
if (location.hash.startsWith('#malli-')) {
  requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
}
