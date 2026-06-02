const formatEuro = (value) =>
  new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

document.documentElement.classList.add("has-js");

const FORM_ENDPOINT = "https://formsubmit.co/ajax/info@nordicmodular.fi";
const QUOTE_EMAIL_CONFIG = {
  to: "info@nordicmodular.fi",
  cc: "teppo.herranen@nordicmodular.fi",
  subject: "Uusi tarjouspyyntö verkkosivuilta",
  senderName: "Nordic Modular -verkkosivut",
  smtp: {
    provider: "Polar55",
    host: "",
    port: "",
    secure: "",
    username: "",
    password: "",
  },
};

const buildQuoteEmailPayload = ({
  productLabel,
  location,
  details,
  name,
  email,
  phone,
}) => ({
  name,
  email,
  phone,
  _subject: QUOTE_EMAIL_CONFIG.subject,
  _cc: QUOTE_EMAIL_CONFIG.cc,
  _replyto: email,
  _template: "table",
  _captcha: "false",
  _honey: "",
  _url: "https://www.nordicmodular.fi/tarjous.html",
  lomake: "Tarjouspyynto",
  malli: productLabel,
  paikkakunta: location,
  lisatiedot: details,
  lahettajan_nimi: QUOTE_EMAIL_CONFIG.senderName,
});

const buildContactEmailPayload = ({ name, email, phone, subject, message }) => ({
  name,
  email,
  phone,
  _subject: "Uusi yhteydenottopyynto verkkosivuilta",
  _cc: QUOTE_EMAIL_CONFIG.cc,
  _replyto: email,
  _template: "table",
  _captcha: "false",
  _honey: "",
  _url: "https://www.nordicmodular.fi/yhteystiedot.html",
  lomake: "Yhteydenottopyynto",
  aihe: subject,
  viesti: message,
  lahettajan_nimi: QUOTE_EMAIL_CONFIG.senderName,
});

const submitFormToEndpoint = async (payload) => {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Lomakkeen lähetys ei onnistunut.");
  }

  return data;
};

const setFormStatus = (statusEl, type, message) => {
  if (!statusEl) return;
  statusEl.hidden = false;
  statusEl.className = `form-status is-${type}`;
  statusEl.textContent = message;
};

const resetFormStatus = (statusEl) => {
  if (!statusEl) return;
  statusEl.hidden = true;
  statusEl.className = "form-status";
  statusEl.textContent = "";
};

const normalizeOfferCopy = () => {
  document.querySelectorAll('a[href^="tarjous.html"], button').forEach((element) => {
    const text = element.textContent?.trim();
    if (!text) return;

    if (
      text === "Pyydä tarjous" ||
      text === "Pyydä tarjous tästä mallista" ||
      text === "Kysy tästä" ||
      text === "Avaa tarjouslomake" ||
      text === "Täytä tarjouslomake"
    ) {
      element.textContent = "Pyydä alustava tarjous";
    }
  });

};


const MODEL_LIBRARY = {
  "compact-aitta-14": {
    series: "NordMod Compact",
    name: "NordMod Compact Aitta 14",
    description: "Kompakti aittaratkaisu lisämajoitukseen, vieraskäyttöön tai pihapiirin lisätilaksi.",
    overview: "NordMod Compact on kompakti ja tehokas piharakennusmalli, joka sopii pienemmille tonteille, mökille tai kodin lisätilaksi. Aittaversio toimii vieras-, harraste- tai lisätilakäytössä silloin, kun halutaan laadukas ja selkeä tilaratkaisu rajalliseen tilaan.",
    features: ["Aittaversio Compact-kokoluokassa", "Sopii vieras-, harraste- ja lisätilaksi", "Selkeä ratkaisu pienemmille tonteille"],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto-compact-14.html",
    image: {
      src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta1.png",
      alt: "NordMod Compact Aitta ulkokuva metsämaisemassa",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/compact pohja.png", alt: "NordMod Compact Aitta pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta5.png", alt: "NordMod Compact Aitta etunäkymä terassilla" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta2.png", alt: "NordMod Compact Aitta ulkonäkymä" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta3.png", alt: "NordMod Compact Aitta vaihtoehtoinen ulkokuva" },
    ],
  },
  "compact-saunatupa-14": {
    series: "NordMod Compact",
    name: "NordMod Compact Saunatupa 14",
    description: "Selkeä 14 m² saunatuparatkaisu vapaa-aikaan, pihaan tai mökkikäyttöön.",
    overview: "NordMod Compact Saunatupa yhdistää saunan ja oleskelutilan tiiviissä kokonaisuudessa. Malli sopii mökille, pihapiiriin tai vapaa-ajan käyttöön, kun halutaan selkeä saunatupatoteutus kompaktissa koossa.",
    features: ["Sauna ja tupa kompaktissa koossa", "Sopii mökille ja pihapiiriin", "Hyvä valinta rajalliseen tilaan"],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto-compact-14.html",
    image: {
      src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 1.png",
      alt: "NordMod Compact Saunatupa ulkokuva",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/Comapct pohja.png", alt: "NordMod Compact Saunatupa pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 2.png", alt: "NordMod Compact Saunatupa sivunäkymä" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 3.png", alt: "NordMod Compact Saunatupa terassilla" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 4.png", alt: "NordMod Compact Saunatupa vaihtoehtoinen ulkokuva" },
    ],
  },
  "compact-terassi": {
    series: "NordMod Compact",
    name: "NordMod Compact Terassi",
    description: "Compact-sarjaa täydentävä terassiratkaisu, joka viimeistelee kokonaisuuden.",
    overview: "NordMod Terassi täydentää Compact-sarjan kokonaisuutta ja tuo rakennuksen eteen selkeän oleskelu- ja kulkutilan.",
    features: ["Täydentävä terassimalli", "Sopii Compact-sarjan yhteyteen", "Sama tuote kuin NordMod Terassi, koko valitaan mallin mukaan"],
    note: "Terassi avautuu NordMod Terassi -tuotteena ja koko valitaan mallin mukaan.",
    backLink: "mallisto-compact-14.html",
    image: {
      src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta5.png",
      alt: "NordMod Compact Terassi etunäkymä",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta5.png", alt: "NordMod Compact Terassi etunäkymä" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 1.png", alt: "NordMod Compact Terassi saunamallin yhteydessä" },
    ],
  },
  "classic-aitta-18": {
    series: "NordMod Classic",
    name: "NordMod Classic Aitta 18",
    description: "Monikäyttöinen aittamalli vieraskäyttöön, lisämajoitukseen ja vapaa-aikaan.",
    overview: "NordMod Classic on malliston monikäyttöinen perusmalli, jossa yhdistyvät käytännöllinen pohjaratkaisu, viimeistelty ulkoasu ja pohjoisiin olosuhteisiin suunniteltu rakenne. Aittaversio sopii hyvin vierasmajaksi, lisämajoitukseen tai piharakennukseksi.",
    features: ["Aittaversio Classic-kokoluokassa", "Sopii majoitukseen ja lisätilaksi", "Viimeistelty perusmalli pohjoisiin oloihin"],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto-classic-18.html",
    image: {
      src: "assets/mallisto/nordmod-classic/Classic aitta/kuva1.png",
      alt: "NordMod Classic Aitta ulkokuva ilta-auringossa",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-classic/Classic aitta/classic pohja.png", alt: "NordMod Classic Aitta pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-classic/Classic aitta/kuva 3.png", alt: "NordMod Classic Aitta ulkokuva" },
      { src: "assets/mallisto/nordmod-classic/Classic aitta/kuva3.png", alt: "NordMod Classic Aitta vaihtoehtoinen ulkokuva" },
    ],
  },
  "classic-saunatupa-18": {
    series: "NordMod Classic",
    name: "NordMod Classic Saunatupa 18",
    description: "Classic-sarjan saunatuparatkaisu vapaa-aikaan, pihaan tai mökkikäyttöön.",
    overview: "NordMod Classic Saunatupa on monikäyttöinen perusmalli vapaa-aikaan, mökille ja pihapiiriin. Mallissa yhdistyvät sauna, oleskelu ja käytännöllinen pohjaratkaisu viimeisteltyyn Nordic Modular -ulkoasuun.",
    features: ["Saunatupa 18 m² kokoluokassa", "Sopii vapaa-aikaan ja pihoille", "Käytännöllinen sauna- ja oleskeluratkaisu"],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto-classic-18.html",
    image: {
      src: "assets/mallisto/nordmod-classic/Classic sauna/Classic sauna 1.png",
      alt: "NordMod Classic Saunatupa ulkokuva terassilla",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-classic/Classic sauna/classic pohja.png", alt: "NordMod Classic Saunatupa pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-classic/Classic sauna/Classic sauna 2.png", alt: "NordMod Classic Saunatupa ulkokuva" },
      { src: "assets/mallisto/nordmod-classic/Classic sauna/classic sauna3.png", alt: "NordMod Classic Saunatupa sivunäkymä" },
      { src: "assets/mallisto/nordmod-classic/Classic sauna/classic sauna 4.png", alt: "NordMod Classic Saunatupa vaihtoehtoinen ulkokuva" },
    ],
  },
  "classic-terassi": {
    series: "NordMod Classic",
    name: "NordMod Classic Terassi",
    description: "Terassiratkaisu, joka täydentää Classic-sarjan mallien käyttöä ja viimeistelyä.",
    overview: "NordMod Terassi täydentää Classic-sarjan käyttöä ja viimeistelee rakennuksen edustan selkeäksi oleskelualueeksi.",
    features: ["Täydentävä terassimalli", "Classic-sarjan rinnalle", "Sama tuote kuin NordMod Terassi, koko valitaan mallin mukaan"],
    note: "Terassi avautuu NordMod Terassi -tuotteena ja koko valitaan mallin mukaan.",
    backLink: "mallisto-classic-18.html",
    image: {
      src: "assets/mallisto/nordmod-classic/Classic aitta/kuva1.png",
      alt: "NordMod Classic Terassi mallin yhteydessä",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-classic/Classic aitta/kuva1.png", alt: "NordMod Classic Terassi aittamallin yhteydessä" },
      { src: "assets/mallisto/nordmod-classic/Classic sauna/Classic sauna 1.png", alt: "NordMod Classic Terassi saunamallin yhteydessä" },
    ],
  },
  "grand-aitta-30": {
    series: "NordMod Grand",
    name: "NordMod Grand Aitta 30",
    description: "Tilavampi aittaratkaisu majoitukseen, vieraskäyttöön tai vapaa-ajan kokonaisuuteen.",
    overview: "NordMod Grand on tilavampi ja näyttävämpi moduuliratkaisu vapaa-ajan käyttöön, majoitukseen tai premium-tason piharakennukseksi. Grand Aitta tarjoaa enemmän oleskelutilaa, muunneltavuutta ja mahdollisuuksia varusteluun.",
    features: ["30 m² aittaratkaisu", "Sopii majoitus- ja vieraskäyttöön", "Tilavampi lähtökohta vapaa-ajan kokonaisuuksiin"],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto-grand-30.html",
    image: {
      src: "assets/mallisto/nordmod-grand/grand aitta/grand aitta1.png",
      alt: "NordMod Grand Aitta ulkokuva",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-grand/grand aitta/Grand pohja.png", alt: "NordMod Grand Aitta pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
    ],
  },
  "grand-saunatupa-30": {
    series: "NordMod Grand",
    name: "NordMod Grand Saunatupa 30",
    description: "Suurempi saunatuparatkaisu silloin, kun käyttöön tarvitaan enemmän tilaa ja mukavuutta.",
    overview: "NordMod Grand Saunatupa 30 yhdistää oleskelutilan, saunan ja tukitilat selkeäksi kokonaisuudeksi. Malli sopii vapaa-aikaan, mökkikäyttöön ja majoituskäyttöön silloin, kun halutaan enemmän tilaa, käyttömukavuutta ja näyttävämpi kokonaisuus.",
    features: ["30 m² saunatupakokonaisuus", "Oleskelutila, sauna ja tukitilat", "Sopii vapaa-aikaan, mökille ja majoituskäyttöön"],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto-grand-30.html",
    image: {
      src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok2.png",
      alt: "NordMod Grand Saunatupa ulkokuva terassilla",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/Grand s pohja.png", alt: "NordMod Grand Saunatupa pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok 4.png", alt: "NordMod Grand Saunatupa sivunäkymä" },
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok 5.png", alt: "NordMod Grand Saunatupa vaihtoehtoinen ulkokuva" },
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok3.png", alt: "NordMod Grand Saunatupa terassinäkymä" },
    ],
  },
  "grand-terassi": {
    series: "NordMod Grand",
    name: "NordMod Grand Terassi",
    description: "Laajempaa Grand-kokonaisuutta täydentävä terassiratkaisu oleskeluun ja käyttöön.",
    overview: "NordMod Terassi voidaan sovittaa Grand-sarjan suurempiin kokonaisuuksiin ja laajentaa rakennuksen käyttöä ulkotilaan.",
    features: ["Terassiratkaisu Grand-sarjaan", "Sopii suurempiin kokonaisuuksiin", "Sama tuote kuin NordMod Terassi, koko valitaan mallin mukaan"],
    note: "Terassi avautuu NordMod Terassi -tuotteena ja koko valitaan mallin mukaan.",
    backLink: "mallisto-grand-30.html",
    image: {
      src: "assets/mallisto/nordmod-grand/grand aitta/grand aitta1.png",
      alt: "NordMod Grand Terassi aittamallin yhteydessä",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-grand/grand aitta/grand aitta1.png", alt: "NordMod Grand Terassi aittamallin yhteydessä" },
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok2.png", alt: "NordMod Grand Terassi saunatuvan yhteydessä" },
    ],
  },
  "nordmod-terassi": {
    series: "NordMod Terassi",
    name: "NordMod Terassi",
    description: "Elementtirakenteinen terassiratkaisu mökkimallin yhteyteen tai erikseen ostettavaksi ratkaisuksi.",
    overview:
      "NordMod Terassi on elementtirakenteinen terassiratkaisu saunan, aitan, saunatuvan tai muun piharakennuksen yhteyteen. Terassi voidaan suunnitella osaksi Nordic Modular -mallistoa tai toteuttaa erillisenä ratkaisuna asiakkaan kohteeseen. Selkeä rakenne ja viimeistelty ulkonäkö tekevät siitä käytännöllisen lisän vapaa-ajan rakennuksiin ja pihapiireihin.",
    features: [
      "Sama tuote eri kokovaihtoehtoina",
      "Sopii Compact-, Classic- ja Grand-mallien yhteyteen",
      "Voidaan ostaa myös erillisenä moduuliterassina",
      "Mitat ja viimeistely tarkennetaan tarjousvaiheessa",
    ],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto.html",
    image: {
      src: "assets/mallisto/Terassi/Terassi.png",
      alt: "NordMod Terassi järvimaisemassa",
    },
    gallery: [{ src: "assets/mallisto/Terassi/Terassi.png", alt: "NordMod Terassi ulkokuva" }],
  },
  "nordic-pihasauna": {
    series: "NordMod Pihasauna",
    name: "NordMod Pihasauna",
    description: "Selkeä pihasaunamalli mökille, omakotitalon pihapiiriin tai vapaa-ajan käyttöön.",
    overview: "NordMod Pihasauna on selkeä pihasaunamalli, jossa yhdistyvät toimiva pohjaratkaisu, viihtyisä saunatila ja huoliteltu Nordic Modular -tyylinen ulkoasu. Ratkaisu tekee suunnittelusta ja toimituksesta selkeämpää.",
    features: ["Selkeä pihasaunamalli", "Helposti hahmotettava saunaratkaisu", "Varustelu ja toimitussisältö tarkentuvat kohteen mukaan"],
    note: "Mitat, kuvat ja toimitussisältö tarkennetaan kohteen mukaan.",
    backLink: "mallisto-pihasauna.html",
    image: {
      src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/pihasauna plan73.png",
      alt: "NordMod Pihasauna ulkokuva järvimaisemassa",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/sauna pohja.png", alt: "NordMod Pihasauna pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/pihasauna.png", alt: "NordMod Pihasauna etunäkymä" },
      { src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/pihasauna1.png", alt: "NordMod Pihasauna vaihtoehtoinen ulkokuva" },
    ],
  },
};

const setYear = () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    const year = new Date().getFullYear();
    const footerParagraph = yearElement.parentElement;

    if (footerParagraph) {
      footerParagraph.textContent = `© ${year} Nordic Modular Finland Oy. Kaikki oikeudet pidätetään.`;
    } else {
      yearElement.textContent = year;
    }
  }
};

const THEME_KEY = "nmg-theme-manual";
const UI_COPY = {
  menuOpen: "Avaa valikko",
  menuClose: "Sulje valikko",
  themeNextLight: "Vaalea",
  themeNextDark: "Tumma",
  themeAria: "Vaihda teemaan: ",
  navAria: "Päänavigaatio",
  footerNavAria: "Alatunnisteen navigaatio",
  quoteSending: "Lähetetään...",
  quoteSent: "Tarjouspyyntö lähetettiin onnistuneesti. Palaamme sinulle mahdollisimman pian.",
  contactSent: "Yhteydenotto lähetettiin onnistuneesti. Palaamme sinulle mahdollisimman pian.",
  sendError:
    "Lähetys ei onnistunut juuri nyt. Voit yrittää uudelleen tai lähettää viestin osoitteeseen info@nordicmodular.fi.",
  quoteFallback: "Pyydä alustava tarjous",
  contactFallback: "Lähetä yhteydenotto",
  validationName: "Lisää nimi.",
  validationEmail: "Lisää toimiva sähköpostiosoite.",
  validationPhone: "Lisää puhelinnumero, josta sinut tavoittaa.",
  validationContact: "Lisää sähköposti tai puhelinnumero.",
  validationMessage: "Kerro viestissäsi hieman tarkemmin, miten voimme auttaa.",
};

const getCurrentLanguage = () => "fi";
const getUiCopy = () => UI_COPY;

const MODEL_ALIASES = {
  "compact-terassi": "nordmod-terassi",
  "classic-terassi": "nordmod-terassi",
  "grand-terassi": "nordmod-terassi",
};

const TERRACE_SIZE_LABELS = {
  compact: "NordMod Terassi Compact-koko",
  classic: "NordMod Terassi Classic-koko",
  grand: "NordMod Terassi Grand-koko",
  "compact-terassi": "NordMod Terassi Compact-koko",
  "classic-terassi": "NordMod Terassi Classic-koko",
  "grand-terassi": "NordMod Terassi Grand-koko",
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
};

const getCurrentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

const getPreferredTheme = () => {
  return "light";
};

const updateThemeButton = (button) => {
  const ui = getUiCopy();
  const currentTheme = getCurrentTheme();
  const nextThemeLabel = currentTheme === "light" ? ui.themeNextDark : ui.themeNextLight;
  button.textContent = nextThemeLabel;
  button.setAttribute("aria-label", `${ui.themeAria}${nextThemeLabel.toLowerCase()}`);
  button.setAttribute("aria-pressed", String(currentTheme === "light"));
};

const initTheme = () => {
  window.localStorage.removeItem("nmg-theme");
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : getPreferredTheme();
  applyTheme(initialTheme);

  if (document.querySelector(".theme-toggle")) return;

  const themeButton = document.createElement("button");
  themeButton.type = "button";
  themeButton.className = "theme-toggle";
  updateThemeButton(themeButton);

  themeButton.addEventListener("click", () => {
    const nextTheme = getCurrentTheme() === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
    updateThemeButton(themeButton);
  });

  document.body.appendChild(themeButton);
};

const setActiveNav = () => {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
};

const setMenuButtonLabel = (button, isOpen) => {
  if (!button) return;
  const ui = getUiCopy();
  button.textContent = "";
  button.setAttribute("aria-label", isOpen ? ui.menuClose : ui.menuOpen);
};

const initMenu = () => {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".topnav");
  if (!button || !nav) return;

  setMenuButtonLabel(button, false);

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    setMenuButtonLabel(button, isOpen);
  });
};

const initStickyHeader = () => {
  const header = document.querySelector(".topbar");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
};

const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(max-width: 760px)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("reveal-enabled");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
};

const setModelFromQuery = (form) => {
  const params = new URLSearchParams(window.location.search);
  const model = params.get("model");
  if (!model) return;

  const product = form.querySelector("#product");
  const option = Array.from(product.options).find((item) => item.dataset.label === model);
  if (option) {
    product.value = option.value;
  }
};

const initSimpleQuoteForm = () => {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const statusEl = document.getElementById("quote-form-status");

  const validators = {
    name: (value) => (value.trim() ? "" : getUiCopy().validationName),
    email: (value) => (!value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : getUiCopy().validationEmail),
    phone: (value) => (!value.trim() || value.trim().length >= 6 ? "" : getUiCopy().validationPhone),
  };

  const setFieldError = (input, message) => {
    const field = input.closest("label");
    const errorEl = field?.querySelector(".field-error");
    if (!field || !errorEl) return;

    field.classList.toggle("has-error", Boolean(message));
    errorEl.textContent = message;
  };

  const validateField = (input) => {
    const validator = validators[input.name];
    if (!validator) return true;
    const message = validator(input.value);
    setFieldError(input, message);
    return !message;
  };

  setModelFromQuery(form);

  form.addEventListener("input", (event) => {
    resetFormStatus(statusEl);
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      validateField(event.target);
    }
  });

  form.addEventListener("change", () => {
    resetFormStatus(statusEl);
  });

  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      form.querySelectorAll(".has-error").forEach((field) => field.classList.remove("has-error"));
      form.querySelectorAll(".field-error").forEach((item) => {
        item.textContent = "";
      });
      resetFormStatus(statusEl);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fieldsToValidate = ["name", "email", "phone"].map((name) => form.querySelector(`[name="${name}"]`));
    const isValid = fieldsToValidate.every((field) => validateField(field));
    const emailField = form.querySelector("#email");
    const phoneField = form.querySelector("#phone");
    const hasContact = Boolean(emailField.value.trim() || phoneField.value.trim());

    if (!hasContact) {
      setFieldError(emailField, getUiCopy().validationContact);
      setFieldError(phoneField, getUiCopy().validationContact);
    }

    if (!isValid || !hasContact) {
      const firstInvalid = fieldsToValidate.find((field) => field.closest("label")?.classList.contains("has-error"));
      firstInvalid?.focus();
      return;
    }

    const product = form.querySelector("#product");
    const selectedProduct = product.options[product.selectedIndex];
    const productLabel = selectedProduct.textContent.trim() || selectedProduct.dataset.label;
    const location = form.querySelector("#location").value.trim() || (getCurrentLanguage() === "en" ? "Not provided" : "Ei ilmoitettu");
    const details = form.querySelector("#details").value.trim() || (getCurrentLanguage() === "en" ? "No additional information" : "Ei lisätietoja");
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonLabel = submitButton?.textContent || getUiCopy().quoteFallback;

    const payload = buildQuoteEmailPayload({
      productLabel,
      location,
      details,
      name,
      email,
      phone,
    });

    // Polar55 SMTP -kytkennassa tarjouspyynto lahetetaan osoitteeseen info@nordicmodular.fi,
    // kopio teppo.herranen@nordicmodular.fi, Reply-To asiakkaan sahkopostiin
    // ja lahettajan nimena Nordic Modular -verkkosivut.
    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = getUiCopy().quoteSending;
      }

      await submitFormToEndpoint(payload);
      setFormStatus(statusEl, "success", getUiCopy().quoteSent);
      form.reset();
      return;
    } catch (error) {
      console.error("Tarjouslomakkeen lähetys epäonnistui", error);
      setFormStatus(statusEl, "error", getUiCopy().sendError);
      return;
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonLabel;
      }
    }
  });
};

const initContactForm = () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusEl = document.getElementById("contact-form-status");

  const validators = {
    name: (value) => (value.trim() ? "" : getUiCopy().validationName),
    email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : getUiCopy().validationEmail),
    message: (value) => (value.trim().length >= 10 ? "" : getUiCopy().validationMessage),
  };

  const setFieldError = (input, message) => {
    const field = input.closest("label");
    const errorEl = field?.querySelector(".field-error");
    if (!field || !errorEl) return;

    field.classList.toggle("has-error", Boolean(message));
    errorEl.textContent = message;
  };

  const validateField = (input) => {
    const validator = validators[input.name];
    if (!validator) return true;
    const message = validator(input.value);
    setFieldError(input, message);
    return !message;
  };

  form.addEventListener("input", (event) => {
    resetFormStatus(statusEl);
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      validateField(event.target);
    }
  });

  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      form.querySelectorAll(".has-error").forEach((field) => field.classList.remove("has-error"));
      form.querySelectorAll(".field-error").forEach((item) => {
        item.textContent = "";
      });
      resetFormStatus(statusEl);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const requiredFields = ["name", "email", "message"].map((name) => form.querySelector(`[name="${name}"]`));
    const isValid = requiredFields.every((field) => validateField(field));

    if (!isValid) {
      const firstInvalid = requiredFields.find((field) => !validateField(field));
      firstInvalid?.focus();
      return;
    }

    const name = form.querySelector("#contact-name").value.trim();
    const email = form.querySelector("#contact-email").value.trim();
    const phone = form.querySelector("#contact-phone").value.trim() || (getCurrentLanguage() === "en" ? "Not provided" : "Ei ilmoitettu");
    const subject = form.querySelector("#contact-subject").selectedOptions?.[0]?.textContent || form.querySelector("#contact-subject").value;
    const message = form.querySelector("#contact-message").value.trim();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonLabel = submitButton?.textContent || getUiCopy().contactFallback;

    const payload = buildContactEmailPayload({
      name,
      email,
      phone,
      subject,
      message,
    });

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = getUiCopy().quoteSending;
      }

      await submitFormToEndpoint(payload);
      setFormStatus(statusEl, "success", getUiCopy().contactSent);
      form.reset();
    } catch (error) {
      console.error("Yhteydenottolomakkeen lähetys epäonnistui", error);
      setFormStatus(statusEl, "error", getUiCopy().sendError);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonLabel;
      }
    }
  });
};

const initModelDetail = () => {
  const nameEl = document.getElementById("model-name");
  if (!nameEl) return;

  const params = new URLSearchParams(window.location.search);
  const requestedModelId = params.get("model");
  const modelId = MODEL_ALIASES[requestedModelId] || requestedModelId;
  const sizeLabel = TERRACE_SIZE_LABELS[params.get("size")] || TERRACE_SIZE_LABELS[requestedModelId];
  const model = modelId ? MODEL_LIBRARY[modelId] : null;

  if (!model) {
    window.location.href = "mallisto.html";
    return;
  }

  const seriesEl = document.getElementById("model-series");
  const descriptionEl = document.getElementById("model-description");
  const overviewEl = document.getElementById("model-overview");
  const featuresEl = document.getElementById("model-features");
  const noteEl = document.getElementById("model-note");
  const placeholderEl = document.getElementById("model-placeholder");
  const placeholderCardEl = document.getElementById("model-placeholder-card");
  const mainImageEl = document.getElementById("model-main-image");
  const floorPlanCardEl = document.getElementById("model-floor-plan-card");
  const floorPlanImageEl = document.getElementById("model-floor-plan-image");
  const gallerySectionEl = document.getElementById("model-gallery-section");
  const galleryEl = document.getElementById("model-gallery");
  const backLinkEl = document.getElementById("model-back-link");
  const offerLinkEl = document.getElementById("model-offer-link");

  if (seriesEl) seriesEl.textContent = `Mallisto / ${model.series}`;
  nameEl.textContent = model.name;
  if (descriptionEl) descriptionEl.textContent = model.description;
  if (overviewEl) overviewEl.textContent = model.overview;
  if (noteEl) noteEl.textContent = model.note;
  if (placeholderEl) placeholderEl.textContent = model.name;
  if (backLinkEl) backLinkEl.href = model.backLink;
  if (offerLinkEl) {
    const offerProductName = modelId === "nordmod-terassi" && sizeLabel ? sizeLabel : model.name;
    offerLinkEl.href = `tarjous.html?model=${encodeURIComponent(offerProductName)}`;
  }

  if (mainImageEl && model.image?.src) {
    mainImageEl.src = model.image.src;
    mainImageEl.alt = model.image.alt || model.name;
    mainImageEl.hidden = false;
    placeholderCardEl?.setAttribute("hidden", "");
  } else {
    mainImageEl?.setAttribute("hidden", "");
    placeholderCardEl?.removeAttribute("hidden");
  }

  if (featuresEl) {
    featuresEl.innerHTML = model.features.map((feature) => `<li>${feature}</li>`).join("");
  }

  const galleryItems = Array.isArray(model.gallery) ? model.gallery : [];
  const floorPlan = galleryItems.find((item) => item.className?.includes("plan-card") || item.caption === "Pohjakuva");
  const visibleGalleryItems = galleryItems.filter((item) => item !== floorPlan);

  if (floorPlanCardEl && floorPlanImageEl && floorPlan?.src) {
    floorPlanImageEl.src = floorPlan.src;
    floorPlanImageEl.alt = floorPlan.alt || `${model.name} pohjakuva`;
    floorPlanCardEl.hidden = false;
  } else if (floorPlanCardEl && floorPlanImageEl) {
    floorPlanImageEl.removeAttribute("src");
    floorPlanImageEl.alt = "";
    floorPlanCardEl.hidden = true;
  }

  if (gallerySectionEl && galleryEl && visibleGalleryItems.length) {
    galleryEl.innerHTML = visibleGalleryItems
      .map(
        (item) => `
          <figure class="media-card ${item.className || ""}">
            <img src="${item.src}" alt="${item.alt || model.name}" />
            ${item.caption ? `<figcaption class="media-caption">${item.caption}</figcaption>` : ""}
          </figure>
        `
      )
      .join("");
    gallerySectionEl.hidden = false;
  } else if (gallerySectionEl && galleryEl) {
    galleryEl.innerHTML = "";
    gallerySectionEl.hidden = true;
  }

  document.title = `Nordic Modular Finland Oy | ${model.name}`;
};

initTheme();
setYear();
normalizeOfferCopy();
setActiveNav();
initStickyHeader();
initMenu();
initReveal();
initSimpleQuoteForm();
initContactForm();
initModelDetail();


