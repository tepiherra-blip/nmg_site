// Käyttäjä vahvisti 8.10.2026 rakennusten ulko- ja sisäkuvien AI-alkuperän.
// Pohjapiirustuksia, henkilökuvia, logoja ja alkuperältään varmistamattomia terassikuvia ei luokitella.
document.querySelectorAll('main img').forEach((image) => {
  const src = decodeURIComponent(image.getAttribute('src') || '');
  const isBuilding = /assets\/mallisto\/nordmod-(compact|classic|grand|custom|pihasauna)\//i.test(src) || /assets\/(etusivu-grand|uusi talvi|revo pihaa|sauna-interior)/i.test(src);
  const isPlan = image.classList.contains('floor-plan-image') || image.classList.contains('is-plan') || image.closest('.plan-card, .plan-card-wide') || /pohja/i.test(src);
  if (!isBuilding || isPlan || image.hidden) return;
  const label = document.createElement('span');
  label.className = 'image-origin-note';
  label.textContent = 'Havainnekuva';
  const hero = image.closest('.hero-banner-media');
  if (hero) {
    hero.appendChild(label);
  } else {
    // Merkinnän sijainti määräytyy pelkästä kuvasta, ei kortin tekstiosan korkeudesta.
    const frame = document.createElement('div');
    frame.className = 'image-disclosure-frame';
    image.replaceWith(frame);
    frame.append(image, label);
  }
});
