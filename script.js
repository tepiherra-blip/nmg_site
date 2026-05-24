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
    series: "Nordic Compact 14",
    name: "Nordic Compact Aitta 14",
    description: "Kompakti aittaratkaisu lisämajoitukseen, vieraskäyttöön tai pihapiirin lisätilaksi.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Kompakti pohjamalli", "Sopii lisämajoitukseen", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-compact-14.html",
  },
  "compact-saunatupa-14": {
    series: "Nordic Compact 14",
    name: "Nordic Compact Saunatupa 14",
    description: "Selkeä 14 m² saunatuparatkaisu vapaa-aikaan, pihaan tai mökkikäyttöön.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Sauna ja tupa kompaktissa koossa", "Sopii vapaa-aikaan", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-compact-14.html",
  },
  "compact-terassi": {
    series: "Nordic Compact 14",
    name: "Nordic Compact Terassi",
    description: "Compact-sarjaa täydentävä terassiratkaisu, joka viimeistelee kokonaisuuden.",
    overview: "Tälle mallille lisätään myöhemmin kuvat, vaihtoehdot, mitat ja toteutustiedot.",
    features: ["Täydentävä terassimalli", "Sopii Compact-sarjan yhteyteen", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-compact-14.html",
  },
  "classic-aitta-18": {
    series: "Nordic Classic 18",
    name: "Nordic Classic Aitta 18",
    description: "Monikäyttöinen aittamalli vieraskäyttöön, lisämajoitukseen ja vapaa-aikaan.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["18 m² perusmalli", "Sopii majoitukseen", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-classic-18.html",
  },
  "classic-saunatupa-18": {
    series: "Nordic Classic 18",
    name: "Nordic Classic Saunatupa 18",
    description: "Classic-sarjan saunatuparatkaisu vapaa-aikaan, pihaan tai mökkikäyttöön.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Saunatupa 18 m² kokoluokassa", "Sopii vapaa-aikaan ja pihoille", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-classic-18.html",
  },
  "classic-terassi": {
    series: "Nordic Classic 18",
    name: "Nordic Classic Terassi",
    description: "Terassiratkaisu, joka täydentää Classic-sarjan mallien käyttöä ja viimeistelyä.",
    overview: "Tälle mallille lisätään myöhemmin kuvat, vaihtoehdot, mitat ja toteutustiedot.",
    features: ["Täydentävä terassimalli", "Classic-sarjan rinnalle", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-classic-18.html",
  },
  "grand-aitta-30": {
    series: "Nordic Grand 30",
    name: "Nordic Grand Aitta 30",
    description: "Tilavampi aittaratkaisu majoitukseen, vieraskäyttöön tai vapaa-ajan kokonaisuuteen.",
    overview: "Nordic Grand Aitta 30 on tilavampi aittaratkaisu, joka sopii lisämajoitukseen, vieraskäyttöön ja vapaa-ajan kokonaisuuksiin. Selkeä pohjaratkaisu tekee mallista hyvän lähtökohdan myöhemmälle tarkentamiselle.",
    features: ["30 m² aittaratkaisu", "Sopii majoitus- ja vieraskäyttöön", "Selkeä kaksiosainen pohjaratkaisu", "Muokattavissa myöhemmin kohteen tarpeiden mukaan"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-grand-30.html",
  },
  "grand-saunatupa-30": {
    series: "Nordic Grand 30",
    name: "Nordic Grand Saunatupa 30",
    description: "Suurempi saunatuparatkaisu silloin, kun käyttöön tarvitaan enemmän tilaa ja mukavuutta.",
    overview: "Nordic Grand Saunatupa 30 yhdistää oleskelutilan, saunan ja tukitilat selkeäksi kokonaisuudeksi. Malli sopii vapaa-aikaan, mökkikäyttöön ja majoituskäyttöön silloin, kun halutaan enemmän tilaa ja valmista perusrunkoa jatkokehitykselle.",
    features: ["30 m² saunatupakokonaisuus", "Oleskelutila, sauna ja wc samaan ratkaisuun", "Sopii vapaa-aikaan, mökille ja majoituskäyttöön", "Muokattavissa varustelun ja viimeistelyn osalta"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-grand-30.html",
  },
  "grand-terassi": {
    series: "Nordic Grand 30",
    name: "Nordic Grand Terassi",
    description: "Laajempaa Grand-kokonaisuutta täydentävä terassiratkaisu oleskeluun ja käyttöön.",
    overview: "Tälle mallille lisätään myöhemmin kuvat, vaihtoehdot, mitat ja toteutustiedot.",
    features: ["Terassiratkaisu Grand-sarjaan", "Sopii suurempiin kokonaisuuksiin", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-grand-30.html",
  },
  "nordic-pihasauna": {
    series: "Nordic Pihasauna",
    name: "Nordic Pihasauna",
    description: "Selkeä pihasaunamalli mökille, omakotitalon pihaan tai vapaa-ajan käyttöön.",
    overview: "Nordic Pihasauna on selkeä ja kompakti saunaratkaisu vapaa-aikaan, mökille tai omakotitalon pihaan. Malli toimii hyvänä lähtökohtana silloin, kun halutaan oma saunarakennus ilman turhaa monimutkaisuutta.",
    features: ["Kompakti pihasaunamalli", "Sopii mökille ja pihapiiriin", "Selkeä saunaratkaisu omaan käyttöön", "Muokattavissa myöhemmin tarkempien toteutustietojen mukaan"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-pihasauna.html",
  },
  "nordic-varasto-1": {
    series: "Nordic Varastot",
    name: "Nordic Varasto 1",
    description: "Kompakti varastomalli pihan, mökin tai vapaa-ajan kohteen säilytystarpeisiin.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Kompakti varastoratkaisu", "Sopii pihalle ja mökille", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-varastot.html",
  },
  "nordic-varasto-2": {
    series: "Nordic Varastot",
    name: "Nordic Varasto 2",
    description: "Monikäyttöinen varastomalli silloin, kun säilytystilaa tarvitaan hieman enemmän.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Monikäyttöinen varastoratkaisu", "Sopii piha- ja mökkikäyttöön", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-varastot.html",
  },
  "nordic-varasto-3": {
    series: "Nordic Varastot",
    name: "Nordic Varasto 3",
    description: "Tilavampi varastoratkaisu suurempaan säilytystarpeeseen ja monipuolisempaan käyttöön.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Tilavampi varastokokonaisuus", "Sopii laajempiin säilytystarpeisiin ja teknisiin tiloihin", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-varastot.html",
  },
  "custom-aitta": {
    series: "Nordic Custom",
    name: "Räätälöity aitta",
    description: "Muokattava aittaratkaisu majoitukseen, vierastilaksi tai muuhun lisäkäyttöön.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset vaihtoehdot, kuvat, pohjakuva ja tarkemmat tuotetiedot.",
    features: ["Muokattava aittaratkaisu", "Sopii eri käyttötarkoituksiin", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-custom.html",
  },
  "custom-saunatupa": {
    series: "Nordic Custom",
    name: "Räätälöity saunatupa",
    description: "Saunatuparatkaisu, jonka tilajako ja varustelu voidaan suunnitella kohteen mukaan.",
    overview: "Räätälöity saunatupa on lähtömalli kohteisiin, joissa saunan, oleskelun ja käytännöllisen tilajaon halutaan mukautuvan asiakkaan käyttötarkoitukseen.",
    features: ["Muokattava saunatupa", "Tilajako ja varustelu kohteen mukaan", "Sopii vapaa-aikaan ja mökkikäyttöön", "Tarkentuu myöhemmin kuvien ja pohjakuvien täydentyessä"],
    note: "Tähän malliin on lisätty ensimmäinen ulkokuva. Pohjakuva ja tarkemmat toteutustiedot voidaan täydentää myöhemmin.",
    backLink: "mallisto-custom.html",
    image: {
      src: "assets/custom-saunatupa-main.png",
      alt: "Räätälöity saunatupa ulkonäkymä",
    },
  },
  "custom-kokonaisuus": {
    series: "Nordic Custom",
    name: "Räätälöity kokonaisuus majoitus- tai mökkikäyttöön",
    description: "Laajempi kokonaisuus, jossa voidaan yhdistää eri tiloja ja käyttötarpeita samaan toimitukseen.",
    overview: "Tälle mallille lisätään myöhemmin mallikohtaiset vaihtoehdot, kuvat, pohjakuva ja tarkemmat tuotetiedot.",
    features: ["Laajempi räätälöitävä kokonaisuus", "Sopii majoitus- ja mökkikäyttöön", "Täydennettävissä myöhemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisätään tähän mallikohtaisesti myöhemmin.",
    backLink: "mallisto-custom.html",
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

  if (gallerySectionEl && galleryEl && Array.isArray(model.gallery) && model.gallery.length) {
    galleryEl.innerHTML = model.gallery
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


