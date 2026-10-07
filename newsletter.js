// Uutiskirjepalvelu liitetään ennen tilausten avaamista.
// Keskeneräinen lomake ei lähetä tai tallenna sähköpostiosoitteita.
document.querySelectorAll('.newsletter-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.querySelector('[role="status"]').textContent = 'Uutiskirjeen tilaus avautuu pian.';
  });
});
const notice = document.createElement('aside');
notice.className = 'cookie-notice';
notice.setAttribute('aria-label', 'Evästetiedot');
notice.innerHTML = '<p>Tallennamme selaimeesi sivuston asetukset ja tämän ilmoituksen kuittauksen. <a href="tietosuojaseloste.html#evasteet">Lisätiedot</a></p><button type="button">OK</button>';
let acknowledged = false;
try { acknowledged = localStorage.getItem('nmg-cookie-notice-v1') === 'ok'; } catch {}
if (!acknowledged) document.body.appendChild(notice);
notice.querySelector('button').addEventListener('click', () => {
  try { localStorage.setItem('nmg-cookie-notice-v1', 'ok'); } catch {}
  notice.remove();
});
