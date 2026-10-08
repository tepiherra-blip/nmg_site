// MailerLiten HTML-lomake käyttää JSONP-vastausta (ajax=1), ei uutta välilehteä.
let newsletterRequestPending = false;
const submitNewsletter = (form) => new Promise((resolve, reject) => {
  const payload = new URLSearchParams();
  for (const [key, value] of new FormData(form)) {
    if (key !== '_honey' && key !== 'consent') payload.append(key, value);
  }
  payload.set('ajax', '1');
  payload.set('guid', crypto.randomUUID());
  payload.set('callback', 'mlWebformSubmitted');
  const request = document.createElement('script');
  request.src = `${form.action}?${payload}`;
  request.referrerPolicy = 'strict-origin-when-cross-origin';
  let completed = false;
  const finish = (result, error) => {
    if (completed) return;
    completed = true;
    clearTimeout(timeout);
    request.remove();
    // Myöhäinen vastaus ei käynnistä uutta tilausta tai muuta epävarmaa tilaa.
    window.mlWebformSubmitted = () => {};
    error ? reject(error) : resolve(result);
  };
  window.mlWebformSubmitted = (result) => finish(result);
  request.onerror = () => finish(null, new Error('unconfirmed'));
  const timeout = setTimeout(() => finish(null, new Error('unconfirmed')), 20000);
  document.head.appendChild(request);
});

document.querySelectorAll('.newsletter-form').forEach((form) => {
  let submitted = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitted || newsletterRequestPending || !form.reportValidity()) return;
    if (form.elements._honey?.value.trim()) return;
    newsletterRequestPending = true;
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[role="status"]');
    button.disabled = true;
    status.textContent = 'Lähetetään tilausta…';
    try {
      const result = await submitNewsletter(form);
      if (result?.success !== true && result?.success !== 1 && result?.success !== 'true') {
        status.textContent = 'Tilaus ei onnistunut. Tarkista sähköpostiosoite ja yritä uudelleen. Tarvittaessa ota yhteyttä: info@nordicmodular.fi.';
        button.disabled = false;
        return;
      }
      submitted = true;
      const mode = form.dataset.confirmation;
      const heading = mode === 'required' ? 'Kiitos! Vahvista uutiskirjeen tilauksesi.' : mode === 'none' ? 'Kiitos uutiskirjeen tilauksesta!' : 'Kiitos! Tilauspyyntösi on vastaanotettu.';
      const message = mode === 'required' ? 'Lähetimme sinulle vahvistusviestin. Viimeistele tilaus sähköpostissa olevasta linkistä. Jos viestiä ei näy, tarkista myös roskapostikansio.' : mode === 'none' ? 'Saat jatkossa tietoa uutuuksista, tarjouksista ja Nordic Modularin kuulumisista.' : 'Jos saat sähköpostiisi vahvistusviestin, viimeistele tilaus viestin linkistä. Tarkista tarvittaessa myös roskapostikansio.';
      form.replaceChildren();
      const thanks = document.createElement('div');
      thanks.className = 'newsletter-thanks';
      thanks.setAttribute('role', 'status');
      const title = document.createElement('h3'); title.textContent = heading;
      const text = document.createElement('p'); text.textContent = message;
      const home = document.createElement('a'); home.className = 'button button-secondary'; home.href = 'index.html'; home.textContent = 'Takaisin etusivulle';
      thanks.append(title, text, home); form.appendChild(thanks);
      title.tabIndex = -1; title.focus({preventScroll:true});
    } catch {
      submitted = true;
      status.textContent = 'Tilauksen vastaanottoa ei voitu varmistaa. Tarkista sähköpostisi ennen uutta yritystä, jotta et lähetä tilausta kahdesti. Tarvittaessa ota yhteyttä: info@nordicmodular.fi.';
    } finally {
      newsletterRequestPending = false;
    }
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
