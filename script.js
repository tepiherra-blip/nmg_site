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
  // TODO: Korvaa nämä placeholder-arvot lopullisella Polar55 SMTP -kytkennällä.
  // TODO: Lähetä lomakkeet myöhemmin palvelimen kautta, ei pelkällä varalogiikalla.
  smtp: {
    provider: "Polar55",
    host: "TODO_POLAR55_SMTP_HOST",
    port: "TODO_POLAR55_SMTP_PORT",
    secure: "TODO_POLAR55_SMTP_SECURE",
    username: "TODO_POLAR55_SMTP_USERNAME",
    password: "TODO_POLAR55_SMTP_PASSWORD",
  },
};

const buildQuoteEmailPayload = ({
  productLabel,
  useCase,
  timeline,
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
  kayttokohde: useCase,
  aikataulu: timeline,
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

  document.querySelectorAll(".price").forEach((element) => {
    const text = element.textContent?.trim();
    if (text === "Pyydä erillinen tarjous") {
      element.textContent = "Alustava hinta määräytyy kohteen mukaan";
    }
  });

  document.querySelectorAll("p").forEach((element) => {
    const text = element.textContent?.trim();
    if (text === "Pyydä erillinen tarjous. Toteutus ja hinta määräytyvät kohteen vaatimusten mukaan.") {
      element.textContent = "Alustava hinta ja toimitussisältö tarkennetaan kohteen vaatimusten mukaan.";
    }
  });
};


const MODEL_LIBRARY = {
  "compact-aitta-14": {
    series: "NordMod Compact",
    name: "NordMod Compact Aitta 14",
    description: "Kompakti aittaratkaisu lisämajoitukseen, vieraskäyttöön tai pihapiirin lisätilaksi.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Kompakti pohjamalli", "Sopii lisämajoitukseen", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Sauna ja tupa kompaktissa koossa", "Sopii vapaa-aikaan", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "Tälle mallille lisätään myöhemmin kuvat, vaihtoehdot, mitat ja toteutustiedot.",
    features: ["Täydentävä terassimalli", "Sopii Compact-sarjan yhteyteen", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["18 m² perusmalli", "Sopii majoitukseen", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Saunatupa 18 m² kokoluokassa", "Sopii vapaa-aikaan ja pihoille", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "Tälle mallille lisätään myöhemmin kuvat, vaihtoehdot, mitat ja toteutustiedot.",
    features: ["Täydentävä terassimalli", "Classic-sarjan rinnalle", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "NordMod Grand Aitta 30 on tilavampi aittaratkaisu, joka sopii lisämajoitukseen, vieraskäyttöön ja vapaa-ajan kokonaisuuksiin. Selkeä pohjaratkaisu tekee mallista hyvän lähtökohdan myöhemmälle tarkentamiselle.",
    features: ["30 m² aittaratkaisu", "Sopii majoitus- ja vieraskäyttöön", "Selkeä kaksiosainen pohjaratkaisu", "Muokattavissa myöhemmin kohteen tarpeiden mukaan"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "NordMod Grand Saunatupa 30 yhdistää oleskelutilan, saunan ja tukitilat selkeäksi kokonaisuudeksi. Malli sopii vapaa-aikaan, mökkikäyttöön ja majoituskäyttöön silloin, kun halutaan enemmän tilaa ja valmista perusrunkoa jatkokehitykselle.",
    features: ["30 m² saunatupakokonaisuus", "Oleskelutila, sauna ja wc samaan ratkaisuun", "Sopii vapaa-aikaan, mökille ja majoituskäyttöön", "Muokattavissa varustelun ja viimeistelyn osalta"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
    overview: "Tälle mallille lisätään myöhemmin kuvat, vaihtoehdot, mitat ja toteutustiedot.",
    features: ["Terassiratkaisu Grand-sarjaan", "Sopii suurempiin kokonaisuuksiin", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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
  "nordic-pihasauna": {
    series: "NordMod Pihasauna",
    name: "NordMod Pihasauna",
    description: "Selkeä pihasaunamalli mökille, omakotitalon pihaan tai vapaa-ajan käyttöön.",
    overview: "NordMod Pihasauna on selkeä ja kompakti saunaratkaisu vapaa-aikaan, mökille tai omakotitalon pihaan. Malli toimii hyvänä lähtökohtana silloin, kun halutaan oma saunarakennus ilman turhaa monimutkaisuutta.",
    features: ["Kompakti pihasaunamalli", "Sopii mökille ja pihapiiriin", "Selkeä saunaratkaisu omaan käyttöön", "Muokattavissa myöhemmin tarkempien toteutustietojen mukaan"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
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

const THEME_KEY = "nmg-theme";
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
  validationMessage: "Kerro viestissäsi hieman tarkemmin, miten voimme auttaa.",
};

const getCurrentLanguage = () => "fi";
const getUiCopy = () => UI_COPY;

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
};

const getCurrentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

const getPreferredTheme = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
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

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    mediaQuery.addEventListener("change", () => {
      const currentSavedTheme = window.localStorage.getItem(THEME_KEY);
      if (currentSavedTheme === "light" || currentSavedTheme === "dark") return;
      applyTheme(mediaQuery.matches ? "light" : "dark");
      updateThemeButton(themeButton);
    });
  }

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

  const totalEl = document.getElementById("estimate-total");
  const labelEl = document.getElementById("estimate-label");
  const itemsEl = document.getElementById("estimate-items");
  const statusEl = document.getElementById("quote-form-status");

  const validators = {
    name: (value) => (value.trim() ? "" : getUiCopy().validationName),
    email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : getUiCopy().validationEmail),
    phone: (value) => (value.trim().length >= 6 ? "" : getUiCopy().validationPhone),
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

    const requiredFields = ["name", "email", "phone"].map((name) => form.querySelector(`[name="${name}"]`));
    const isValid = requiredFields.every((field) => validateField(field));

    if (!isValid) {
      const firstInvalid = requiredFields.find((field) => !validateField(field));
      firstInvalid?.focus();
      return;
    }

    const product = form.querySelector("#product");
    const selectedProduct = product.options[product.selectedIndex];
    const productLabel = selectedProduct.textContent.trim() || selectedProduct.dataset.label;
    const useCase = form.querySelector("#use-case").selectedOptions?.[0]?.textContent || form.querySelector("#use-case").value;
    const timeline = form.querySelector("#timeline").selectedOptions?.[0]?.textContent || form.querySelector("#timeline").value;
    const location = form.querySelector("#location").value.trim() || (getCurrentLanguage() === "en" ? "Not provided" : "Ei ilmoitettu");
    const details = form.querySelector("#details").value.trim() || (getCurrentLanguage() === "en" ? "No additional information" : "Ei lisätietoja");
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonLabel = submitButton?.textContent || getUiCopy().quoteFallback;

    const payload = buildQuoteEmailPayload({
      productLabel,
      useCase,
      timeline,
      location,
      details,
      name,
      email,
      phone,
    });

    // TODO: Korvaa tämä varalogiikka julkaisuversiossa palvelinlähetyksellä.
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
  const modelId = params.get("model");
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
  if (offerLinkEl) offerLinkEl.href = `tarjous.html?model=${encodeURIComponent(model.name)}`;

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
initMenu();
initReveal();
initSimpleQuoteForm();
initContactForm();
initModelDetail();


