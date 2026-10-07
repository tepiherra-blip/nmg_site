// MailerLiten alkuperäinen POST-lomake säilyttää myös toiminnan ilman JavaScriptiä.
document.querySelectorAll('.newsletter-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    if (form.elements._honey?.value.trim()) {
      event.preventDefault();
      return;
    }
    form.querySelector('[role="status"]').textContent = 'Viimeistele tilaus MailerLiten välilehdessä. Jos saat vahvistusviestin, vahvista tilaus sähköpostistasi.';
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
