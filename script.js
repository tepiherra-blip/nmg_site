const formatEuro = (value) =>
  new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

document.documentElement.classList.add("has-js");

const SHOP_CART_KEY = "nmg-shop-cart";

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

const SHOP_PRODUCTS = {
  "premium-laudesetti": {
    id: "premium-laudesetti",
    name: "Premium laudesetti",
    category: "Sauna",
    description: "Valmis lauderatkaisu laadukkaaseen saunaan kotona tai mökillä.",
    price: 1490,
    priceLabel: "Alkaen 1 490 €",
    longDescription:
      "Premium laudesetti tuo saunaan valmiin ja viimeistellyn lauderatkaisun, jossa yhdistyvät käytännöllisyys, selkeä ilme ja miellyttävä käyttötuntuma.",
    features: ["Valmis kokonaisuus lauteisiin", "Sopii mökille tai kotisaunaan", "Selkeä ja laadukas viimeistely"],
    fit: "Voidaan yhdistää myös osaksi Nordic Modular -saunatoimitusta.",
  },
  "saunan-led-valaistuspaketti": {
    id: "saunan-led-valaistuspaketti",
    name: "Saunan LED-valaistuspaketti",
    category: "Sauna",
    description: "Tyylikäs valaistuspaketti pehmeään tunnelmaan ja käytännölliseen valoon.",
    price: 390,
    priceLabel: "Alkaen 390 €",
    longDescription:
      "LED-valaistuspaketti tuo saunaan pehmeän tunnelman ja toimivan käyttövalon. Ratkaisu sopii sekä uuden saunan viimeistelyyn että olemassa olevan tilan päivitykseen.",
    features: ["Tunnelmavaloon ja käyttövaloon", "Sopii lauteisiin tai seinäpintoihin", "Voidaan tarjota osana saunapakettia"],
    fit: "Toimii hyvin lisämyyntituotteena saunan tai muun toimituksen yhteydessä.",
  },
  "kuituvalosetti-saunaan": {
    id: "kuituvalosetti-saunaan",
    name: "Kuituvalosetti saunaan",
    category: "Sauna",
    description: "Hillitty ja näyttävä kuituvaloratkaisu moderniin saunasisustukseen.",
    price: 620,
    priceLabel: "Alkaen 620 €",
    longDescription:
      "Kuituvalosetti luo saunaan hillityn ja näyttävän valaistuksen, joka korostaa tilan tunnelmaa sekä viimeisteltyä ilmettä.",
    features: ["Hillitty premium-ilme", "Sopii moderniin saunaan", "Voidaan yhdistää valaistus- tai lauderatkaisuun"],
    fit: "Sopii myös osaksi Nordic Modular -saunaratkaisun viimeistelyä.",
  },
  "terassivalaistuspaketti": {
    id: "terassivalaistuspaketti",
    name: "Terassivalaistuspaketti",
    category: "Piha & terassi",
    description: "Selkeä valaistus terassin reunoihin, kulkureiteille ja oleskelutilaan.",
    price: 540,
    priceLabel: "Alkaen 540 €",
    longDescription:
      "Terassivalaistuspaketti kokoaa yhteen toimivan ulkovalaistuksen, joka tukee kulkua, oleskelua ja terassin käytettävyyttä ilta-aikaan.",
    features: ["Terassin valaistus yhteen pakettiin", "Sopii kulkureiteille ja oleskeluun", "Laajennettavissa osaksi terassitoimitusta"],
    fit: "Voidaan toimittaa osana terassi- tai pihaprojektia.",
  },
  "pihavalaisin-musta": {
    id: "pihavalaisin-musta",
    name: "Pihavalaisin musta",
    category: "Piha & terassi",
    description: "Ajattoman tumma valaisin viimeistelemään kulkuväylät ja sisäänkäynnit.",
    price: 129,
    priceLabel: "Alkaen 129 €",
    longDescription:
      "Pihavalaisin musta viimeistelee sisäänkäynnit, pihan kulkureitit ja rakennuksen lähiympäristön ajattomalla ilmeellä.",
    features: ["Ajaton tumma ilme", "Sopii sisäänkäynteihin", "Helppo liittää laajempaan pihavalaistukseen"],
    fit: "Sopii lisätuotteeksi piha- ja terassikokonaisuuksiin.",
  },
  polkuvalaisin: {
    id: "polkuvalaisin",
    name: "Polkuvalaisin",
    category: "Piha & terassi",
    description: "Matala ja huomaamaton valaisin pihan reiteille ja mökin kulkuihin.",
    price: 98,
    priceLabel: "Alkaen 98 €",
    longDescription:
      "Polkuvalaisin tuo kulkureiteille turvallisuutta ja selkeyttä ilman raskasta ilmettä. Se sopii pihan reiteille, terassille ja mökin ympäristöön.",
    features: ["Pihan reiteille ja kulkuihin", "Huomaamaton ja käytännöllinen", "Sopii osaksi ulkovalopakettia"],
    fit: "Voidaan myydä yksittäin tai osana pihavalaistuksen kokonaisuutta.",
  },
  "palju-basic": {
    id: "palju-basic",
    name: "Palju Basic",
    category: "Paljut & porealtaat",
    description: "Selkeä lähtötason palju pihapiiriin ja mökkikäyttöön.",
    price: 2490,
    priceLabel: "Alkaen 2 490 €",
    longDescription:
      "Palju Basic tarjoaa selkeän ja toimivan tavan tuoda rentoutuminen pihapiiriin tai mökille ilman turhaa monimutkaisuutta.",
    features: ["Selkeä perusmalli", "Sopii mökille ja pihaan", "Laajennettavissa lisävarusteilla"],
    fit: "Toimii myös osana suurempaa pihapiirin rentoutumiskokonaisuutta.",
  },
  "palju-premium": {
    id: "palju-premium",
    name: "Palju Premium",
    category: "Paljut & porealtaat",
    description: "Viimeistelty premium-ratkaisu rentoutumiseen ympäri vuoden.",
    price: 4290,
    priceLabel: "Alkaen 4 290 €",
    longDescription:
      "Palju Premium on laadukas vaihtoehto ympärivuotiseen käyttöön, kun ulkotilan viimeistelyltä halutaan sekä mukavuutta että näyttävyyttä.",
    features: ["Premium-ilme ja viimeistely", "Ympärivuotiseen käyttöön", "Täydennettävissä lisäominaisuuksilla"],
    fit: "Sopii hyvin osaksi laadukasta piha- tai mökkikokonaisuutta.",
  },
  "poreallas-nordic": {
    id: "poreallas-nordic",
    name: "Poreallas Nordic",
    category: "Paljut & porealtaat",
    description: "Moderni poreallas laadukkaaseen pihaan tai mökin yhteyteen.",
    price: 6900,
    priceLabel: "Alkaen 6 900 €",
    longDescription:
      "Poreallas Nordic täydentää pihaa tai vapaa-ajan kohdetta modernilla rentoutumisratkaisulla, joka sopii laadukkaaseen kokonaisuuteen.",
    features: ["Moderni premium-ratkaisu", "Pihaan tai mökille", "Voidaan kytkeä osaksi rentoutumiskokonaisuutta"],
    fit: "Erinomainen lisä sauna- ja terassitoimituksen rinnalle.",
  },
  terassipaketti: {
    id: "terassipaketti",
    name: "Terassipaketti",
    category: "Piha & terassi",
    description: "Valmis paketti selkeään terassitoteutukseen mökille tai kotiin.",
    price: 1980,
    priceLabel: "Alkaen 1 980 €",
    longDescription:
      "Terassipaketti tarjoaa selkeän lähtökohdan toimivalle ja viimeistellylle ulkotilalle mökille, kotiin tai vapaa-ajan kohteeseen.",
    features: ["Valmis lähtökohta terassille", "Mökille tai kotiin", "Voidaan täydentää valaistuksella tai kaiteilla"],
    fit: "Sopii osaksi Nordic Modular -kokonaisuuksia tai erillistoimituksena.",
  },
  ulkovalopaketti: {
    id: "ulkovalopaketti",
    name: "Ulkovalopaketti",
    category: "Piha & terassi",
    description: "Kokonaisuus pihan, terassin ja kulkureittien valaistukseen.",
    price: 690,
    priceLabel: "Alkaen 690 €",
    longDescription:
      "Ulkovalopaketti kokoaa yhteen pihan ja terassin valaistuksen, joka tukee turvallisuutta, tunnelmaa ja käyttömukavuutta.",
    features: ["Pihaan ja terassille", "Kulkureittien valaistus", "Laajennettavissa eri kohteisiin"],
    fit: "Voidaan toimittaa osana piha- tai terassipakettia.",
  },
  "saunan-tunnelmavalo": {
    id: "saunan-tunnelmavalo",
    name: "Saunan tunnelmavalo",
    category: "Sauna",
    description: "Pehmeä ja lämmin valo tunnelmalliseen saunakokemukseen.",
    price: 240,
    priceLabel: "Alkaen 240 €",
    longDescription:
      "Saunan tunnelmavalo viimeistelee saunatilan pehmeällä valolla, joka tekee käytöstä miellyttävän ja rauhallisen.",
    features: ["Lämmin tunnelmavalo", "Saunasisustuksen viimeistelyyn", "Yhdistettävissä muihin valaistustuotteisiin"],
    fit: "Sopii hyvin osaksi saunan materiaalien ja lauteiden kokonaisuutta.",
  },
  "laudesuoja-viimeistelypaketti": {
    id: "laudesuoja-viimeistelypaketti",
    name: "Laudesuoja / viimeistelypaketti",
    category: "Sauna",
    description: "Viimeistelyyn ja huollettavuuteen suunniteltu paketti lauteille ja pinnoille.",
    price: 175,
    priceLabel: "Alkaen 175 €",
    longDescription:
      "Laudesuoja ja viimeistelypaketti auttaa pitämään saunan pinnat siisteinä, huollettuina ja käyttöä kestävinä.",
    features: ["Lauteille ja puupinnoille", "Viimeistelyyn ja huoltoon", "Helppo lisätä osaksi saunatoimitusta"],
    fit: "Toimii lisämyyntinä saunatuotteiden ja lauderatkaisujen yhteydessä.",
  },
  takkapaketti: {
    id: "takkapaketti",
    name: "Takkapaketti",
    category: "Piha & mökki",
    description: "Valmis kokonaisuus mökin, pihan tai terassin tulipaikkaratkaisuun.",
    price: 1250,
    priceLabel: "Alkaen 1 250 €",
    longDescription:
      "Takkapaketti tuo pihalle, terassille tai mökille valmiin tulipaikkaratkaisun, joka täydentää oleskelua ja tunnelmaa.",
    features: ["Pihalle, mökille tai terassille", "Valmis lähtöpaketti", "Täydennettävissä lisävarusteilla"],
    fit: "Voidaan yhdistää pihan, terassin tai saunarakennuksen kokonaisuuteen.",
  },
  "mokkeilyn-varustepaketti": {
    id: "mokkeilyn-varustepaketti",
    name: "Mökkeilyn varustepaketti",
    category: "Piha & mökki",
    description: "Helppo lähtöpaketti toimivaan vapaa-ajan käyttöön ja pihapiirin viimeistelyyn.",
    price: 890,
    priceLabel: "Alkaen 890 €",
    longDescription:
      "Mökkeilyn varustepaketti kokoaa yhteen tuotteita, joilla vapaa-ajan kohteen käyttö, viihtyisyys ja viimeistely paranevat helposti.",
    features: ["Helppo lähtöpaketti mökille", "Pihan ja vapaa-ajan käyttöön", "Sopii osaksi laajempaa kokonaisuutta"],
    fit: "Sopii osaksi laajempaa mökkikokonaisuutta tai erillistuotteena.",
  },
};

const getShopCart = () => {
  try {
    const saved = window.localStorage.getItem(SHOP_CART_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setShopCart = (items) => {
  window.localStorage.setItem(SHOP_CART_KEY, JSON.stringify(items));
};

const addProductToCart = (productId) => {
  const product = SHOP_PRODUCTS[productId];
  if (!product) return;

  const cart = getShopCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  setShopCart(cart);
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

const applyTheme = (theme) => {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
};

const getCurrentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

const updateThemeButton = (button) => {
  const currentTheme = getCurrentTheme();
  const nextThemeLabel = currentTheme === "light" ? "Tumma teema" : "Vaalea teema";
  button.textContent = nextThemeLabel;
  button.setAttribute("aria-label", `Vaihda teemaan: ${nextThemeLabel.toLowerCase()}`);
  button.setAttribute("aria-pressed", String(currentTheme === "light"));
};

const initTheme = () => {
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

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

const initMenu = () => {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".topnav");
  if (!button || !nav) return;

  button.textContent = "";
  button.setAttribute("aria-label", "Avaa valikko");

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Sulje valikko" : "Avaa valikko");
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

const initQuoteForm = () => {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const totalEl = document.getElementById("estimate-total");
  const labelEl = document.getElementById("estimate-label");
  const itemsEl = document.getElementById("estimate-items");

  const validators = {
    name: (value) => (value.trim() ? "" : "Lisää nimi."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Lisää toimiva sähköpostiosoite.",
    phone: (value) =>
      value.trim().length >= 6 ? "" : "Lisää puhelinnumero, josta sinut tavoittaa.",
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

  const estimate = () => {
    const product = form.querySelector("#product");
    const selectedProduct = product.options[product.selectedIndex];
    const useCase = form.querySelector("#use-case")?.value;
    const timeline = form.querySelector("#timeline")?.value;
    const location = form.querySelector("#location")?.value.trim();
    const total = Number(product.value);

    const items = [`Valinta: ${selectedProduct.dataset.label}`];
    if (useCase) items.push(`Käyttö: ${useCase}`);
    if (timeline) items.push(`Aikataulu: ${timeline}`);
    if (location) items.push(`Sijainti: ${location}`);

    totalEl.textContent = formatEuro(total);
    labelEl.textContent =
      total > 0
        ? `${selectedProduct.dataset.label} valituilla lisävarusteilla.`
        : `${selectedProduct.dataset.label}. Lopullinen tarjous tarkentuu työn sisällön mukaan.`;
    itemsEl.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
  };

  setModelFromQuery(form);
  estimate();

  form.addEventListener("input", (event) => {
    estimate();
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      validateField(event.target);
    }
  });

  form.addEventListener("change", estimate);

  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      form.querySelectorAll(".has-error").forEach((field) => field.classList.remove("has-error"));
      form.querySelectorAll(".field-error").forEach((item) => {
        item.textContent = "";
      });
      estimate();
    });
  });

  form.addEventListener("submit", (event) => {
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
    const useCase = form.querySelector("#use-case").value;
    const timeline = form.querySelector("#timeline").value;
    const location = form.querySelector("#location").value.trim() || "Ei ilmoitettu";
    const siteReady = form.querySelector("#site-ready").value;
    const otherWork = form.querySelector("#other-work").value;
    const details = form.querySelector("#details").value.trim() || "Ei lisätietoja";
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const total = totalEl.textContent;

    const selectedExtras =
      ["heatpump", "solar", "terrace", "premium"]
        .map((id) => form.querySelector(`#${id}`))
        .filter((input) => input.checked)
        .map((input) => `- ${input.parentElement.textContent.trim()}`)
        .join("\n") || "- Ei valittuja lisävarusteita";

    const subject = encodeURIComponent(`Tarjouspyyntö: ${selectedProduct.dataset.label}`);
    const body = encodeURIComponent(
      [
        "Hei,",
        "",
        "haluan pyytää tarjouksen seuraavasta ratkaisusta:",
        "",
        `Malli: ${selectedProduct.dataset.label}`,
        `Suuntaa-antava arvio: ${total}`,
        `Käyttökohde: ${useCase}`,
        `Aikataulu: ${timeline}`,
        `Paikkakunta: ${location}`,
        `Tontin valmius: ${siteReady}`,
        `Muut työt: ${otherWork}`,
        "",
        "Lisävarusteet:",
        selectedExtras,
        "",
        "Lisätiedot:",
        details,
        "",
        "Yhteystiedot:",
        `Nimi: ${name}`,
        `Sähköposti: ${email}`,
        `Puhelin: ${phone}`,
      ].join("\n")
    );

    window.location.href = `mailto:info@nordicmodular.fi?subject=${subject}&body=${body}`;
  });
};

const initSimpleQuoteForm = () => {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const totalEl = document.getElementById("estimate-total");
  const labelEl = document.getElementById("estimate-label");
  const itemsEl = document.getElementById("estimate-items");

  const validators = {
    name: (value) => (value.trim() ? "" : "Lisaa nimi."),
    email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Lisaa toimiva sahkopostiosoite."),
    phone: (value) => (value.trim().length >= 6 ? "" : "Lisaa puhelinnumero, josta sinut tavoittaa."),
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

  const estimate = () => {
    const product = form.querySelector("#product");
    const selectedProduct = product.options[product.selectedIndex];
    const useCase = form.querySelector("#use-case")?.value;
    const timeline = form.querySelector("#timeline")?.value;
    const location = form.querySelector("#location")?.value.trim();
    const total = Number(product.value);

    const items = [`Valinta: ${selectedProduct.dataset.label}`];
    if (useCase) items.push(`Kaytto: ${useCase}`);
    if (timeline) items.push(`Aikataulu: ${timeline}`);
    if (location) items.push(`Sijainti: ${location}`);

    if (totalEl) totalEl.textContent = formatEuro(total);
    if (labelEl) {
      labelEl.textContent =
        total > 0
          ? `${selectedProduct.dataset.label} alkaen.`
          : `${selectedProduct.dataset.label}. Lopullinen tarjous tarkentuu tyon sisallon mukaan.`;
    }
    if (itemsEl) {
      itemsEl.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
    }
  };

  setModelFromQuery(form);
  estimate();

  form.addEventListener("input", (event) => {
    estimate();
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      validateField(event.target);
    }
  });

  form.addEventListener("change", estimate);

  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      form.querySelectorAll(".has-error").forEach((field) => field.classList.remove("has-error"));
      form.querySelectorAll(".field-error").forEach((item) => {
        item.textContent = "";
      });
      estimate();
    });
  });

  form.addEventListener("submit", (event) => {
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
    const useCase = form.querySelector("#use-case").value;
    const timeline = form.querySelector("#timeline").value;
    const location = form.querySelector("#location").value.trim() || "Ei ilmoitettu";
    const details = form.querySelector("#details").value.trim() || "Ei lisatietoja";
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const total = totalEl?.textContent || "";

    const subject = encodeURIComponent(`Tarjouspyynto: ${selectedProduct.dataset.label}`);
    const body = encodeURIComponent(
      [
        "Hei,",
        "",
        "haluan pyytää alustavan tarjouksen seuraavasta ratkaisusta:",
        "",
        `Malli: ${selectedProduct.dataset.label}`,
        `Alustava hinta: ${total}`,
        `Kayttokohde: ${useCase}`,
        `Aikataulu: ${timeline}`,
        `Paikkakunta: ${location}`,
        "",
        "Lisatiedot:",
        details,
        "",
        "Yhteystiedot:",
        `Nimi: ${name}`,
        `Sahkoposti: ${email}`,
        `Puhelin: ${phone}`,
      ].join("\n")
    );

    window.location.href = `mailto:info@nordicmodular.fi?subject=${subject}&body=${body}`;
  });
};

const initShopButtons = () => {
  document.querySelectorAll(".shop-card-media span").forEach((span) => {
    if (span.textContent?.trim() === "Kuvan paikka") {
      span.textContent = "Nordic Modular Shop";
    }
  });

  const buttons = document.querySelectorAll(".shop-order-button");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.shopProduct;
      if (!productId) return;

      addProductToCart(productId);
      window.location.href = "tilaus.html";
    });
  });
};

const initOrderForm = () => {
  const form = document.getElementById("order-form");
  if (!form) return;

  const orderItemsEl = document.getElementById("order-items");
  const emptyEl = document.getElementById("order-empty");
  const totalEl = document.getElementById("order-total");
  const labelEl = document.getElementById("order-label");
  const summaryItemsEl = document.getElementById("order-summary-items");
  const clearButton = document.getElementById("clear-order");
  const paymentMethodLabelEl = document.getElementById("payment-method-label");
  const demoPaymentButton = document.getElementById("demo-payment-button");
  const deliveryMethodEl = document.getElementById("delivery-method");
  const deliveryPriceEl = document.getElementById("delivery-price");
  const deliverySummaryEl = document.getElementById("delivery-summary");

  const validators = {
    name: (value) => (value.trim() ? "" : "Lisää nimi."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Lisää toimiva sähköpostiosoite.",
    phone: (value) =>
      value.trim().length >= 6 ? "" : "Lisää puhelinnumero, josta sinut tavoittaa.",
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

  const getDetailedCart = () =>
    getShopCart()
      .map((item) => {
        const product = SHOP_PRODUCTS[item.id];
        if (!product) return null;
        return { ...product, quantity: Math.max(1, Number(item.quantity) || 1) };
      })
      .filter(Boolean);

  const saveDetailedCart = (items) => {
    setShopCart(items.map((item) => ({ id: item.id, quantity: item.quantity })));
  };

  const getSelectedDelivery = () => {
    const selectedOption = deliveryMethodEl?.options[deliveryMethodEl.selectedIndex];
    const deliveryPrice = Number(selectedOption?.dataset.deliveryPrice || 0);
    const deliveryMethod = selectedOption?.value || "Posti pakettiautomaatti";
    return { deliveryMethod, deliveryPrice };
  };

  const renderOrder = () => {
    const items = getDetailedCart();
    orderItemsEl.innerHTML = "";
    const selectedPaymentMethod =
      form.querySelector('input[name="paymentMethod"]:checked')?.value || "Korttimaksu";
    const { deliveryMethod, deliveryPrice } = getSelectedDelivery();

    if (paymentMethodLabelEl) {
      paymentMethodLabelEl.textContent = selectedPaymentMethod;
    }

    if (deliveryPriceEl) {
      deliveryPriceEl.value = formatEuro(deliveryPrice);
    }

    if (!items.length) {
      emptyEl.hidden = false;
      totalEl.textContent = formatEuro(0);
      labelEl.textContent = "Valitse tuotteita shopista, niin yhteenveto päivittyy tähän.";
      summaryItemsEl.innerHTML = "<li>Tilaukseen ei ole lisätty tuotteita</li>";
      if (deliverySummaryEl) {
        deliverySummaryEl.textContent = `Toimitustapa: ${deliveryMethod} (${formatEuro(deliveryPrice)}).`;
      }
      return;
    }

    emptyEl.hidden = true;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + deliveryPrice;
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    items.forEach((item) => {
      const row = document.createElement("article");
      row.className = "order-item";
      row.innerHTML = `
        <div class="order-item-copy">
          <p class="product-kicker">${item.category}</p>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <label class="order-item-qty">
          <span>Määrä</span>
          <input type="number" min="1" step="1" value="${item.quantity}" data-order-qty="${item.id}" />
        </label>
        <div class="order-item-price">${formatEuro(item.price * item.quantity)}</div>
        <button class="order-remove" type="button" data-order-remove="${item.id}">Poista</button>
      `;
      orderItemsEl.appendChild(row);
    });

    totalEl.textContent = formatEuro(total);
    labelEl.textContent = `${totalCount} tuotetta tilauksessa.`;
    summaryItemsEl.innerHTML = items
      .map((item) => `<li>${item.name} x ${item.quantity} — ${formatEuro(item.price * item.quantity)}</li>`)
      .concat(`<li>Toimitus — ${deliveryMethod} — ${formatEuro(deliveryPrice)}</li>`)
      .join("");
    if (deliverySummaryEl) {
      deliverySummaryEl.textContent = `Välisumma ${formatEuro(subtotal)} + toimitus ${formatEuro(deliveryPrice)}.`;
    }
  };

  orderItemsEl.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.dataset.orderQty) return;

    const items = getDetailedCart();
    const target = items.find((item) => item.id === input.dataset.orderQty);
    if (!target) return;

    target.quantity = Math.max(1, Number(input.value) || 1);
    saveDetailedCart(items);
    renderOrder();
  });

  orderItemsEl.addEventListener("click", (event) => {
    const button = event.target;
    if (!(button instanceof HTMLButtonElement)) return;
    const targetId = button.dataset.orderRemove;
    if (!targetId) return;

    const items = getDetailedCart().filter((item) => item.id !== targetId);
    saveDetailedCart(items);
    renderOrder();
  });

  clearButton?.addEventListener("click", () => {
    setShopCart([]);
    renderOrder();
  });

  form.addEventListener("change", (event) => {
    if (
      (event.target instanceof HTMLInputElement && event.target.name === "paymentMethod") ||
      (event.target instanceof HTMLSelectElement && event.target.id === "delivery-method")
    ) {
      renderOrder();
    }
  });

  demoPaymentButton?.addEventListener("click", () => {
    const selectedPaymentMethod =
      form.querySelector('input[name="paymentMethod"]:checked')?.value || "Korttimaksu";
    window.alert(`Valittu maksutapa: ${selectedPaymentMethod}. Maksuvaihe vahvistetaan tilauskäsittelyn yhteydessä.`);
  });

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      validateField(event.target);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const cartItems = getDetailedCart();
    if (!cartItems.length) {
      window.location.href = "shop.html";
      return;
    }

    const requiredFields = ["name", "email", "phone"].map((name) => form.querySelector(`[name="${name}"]`));
    const isValid = requiredFields.every((field) => validateField(field));

    if (!isValid) {
      const firstInvalid = requiredFields.find((field) => !validateField(field));
      firstInvalid?.focus();
      return;
    }

    const name = form.querySelector("#order-name").value.trim();
    const email = form.querySelector("#order-email").value.trim();
    const phone = form.querySelector("#order-phone").value.trim();
    const { deliveryMethod, deliveryPrice } = getSelectedDelivery();
    const deliveryCity = form.querySelector("#delivery-city").value.trim() || "Ei ilmoitettu";
    const deliveryTimeline = form.querySelector("#delivery-timeline").value;
    const orderService = form.querySelector("#order-service").value;
    const paymentMethod =
      form.querySelector('input[name="paymentMethod"]:checked')?.value || "Korttimaksu";
    const details = form.querySelector("#order-details").value.trim() || "Ei lisätietoja";

    const orderLines = cartItems.map(
      (item) =>
        `- ${item.name} | määrä ${item.quantity} | á ${formatEuro(item.price)} | yhteensä ${formatEuro(
          item.price * item.quantity
        )}`
    );

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + deliveryPrice;
    const subject = encodeURIComponent(`Tilaus: Nordic Modular Shop`);
    const body = encodeURIComponent(
      [
        "Hei,",
        "",
        "haluan tehdä tilauksen Nordic Modular Shopista.",
        "",
        "Valitut tuotteet:",
        ...orderLines,
        "",
        `Välisumma: ${formatEuro(subtotal)}`,
        `Toimitus: ${deliveryMethod} / ${formatEuro(deliveryPrice)}`,
        `Yhteensä: ${formatEuro(total)}`,
        "",
        `Maksutapa: ${paymentMethod}`,
        "Maksutapa vahvistetaan tilauskäsittelyn yhteydessä.",
        "",
        "Toimitus ja lisätiedot:",
        `Toimitustapa: ${deliveryMethod}`,
        `Paikkakunta: ${deliveryCity}`,
        `Aikataulu: ${deliveryTimeline}`,
        `Lisäpalvelut: ${orderService}`,
        "",
        "Lisätiedot:",
        details,
        "",
        "Yhteystiedot:",
        `Nimi: ${name}`,
        `Sähköposti: ${email}`,
        `Puhelin: ${phone}`,
      ].join("\n")
    );

    window.location.href = `mailto:info@nordicmodular.fi?subject=${subject}&body=${body}`;
  });

  renderOrder();
};

const initProductDetail = () => {
  const orderButton = document.getElementById("product-order-button");
  if (!orderButton) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const product = productId ? SHOP_PRODUCTS[productId] : null;

  if (!product) {
    window.location.href = "shop.html";
    return;
  }

  const categoryEl = document.getElementById("product-category");
  const nameEl = document.getElementById("product-name");
  const descriptionEl = document.getElementById("product-description");
  const longDescriptionEl = document.getElementById("product-long-description");
  const featuresEl = document.getElementById("product-features");
  const priceEl = document.getElementById("product-price");
  const priceNoteEl = document.getElementById("product-price-note");
  const fitEl = document.getElementById("product-fit");
  const placeholderEl = document.getElementById("product-image-placeholder");

  if (categoryEl) categoryEl.textContent = product.category;
  if (nameEl) nameEl.textContent = product.name;
  if (descriptionEl) descriptionEl.textContent = product.description;
  if (longDescriptionEl) longDescriptionEl.textContent = product.longDescription || product.description;
  if (priceEl) priceEl.textContent = product.priceLabel || formatEuro(product.price);
  if (priceNoteEl) priceNoteEl.textContent = "Hinta alkaen valitulla perusratkaisulla.";
  if (fitEl) fitEl.textContent = product.fit || "Tuote voidaan toimittaa myös osana laajempaa kokonaisuutta.";
  if (placeholderEl) placeholderEl.textContent = `${product.category} / Nordic Modular Shop`;

  if (featuresEl) {
    const features = Array.isArray(product.features) && product.features.length ? product.features : ["Lisää tähän tuotteen tärkeimmät ominaisuudet."];
    featuresEl.innerHTML = features.map((feature) => `<li>${feature}</li>`).join("");
  }

  document.title = `Nordic Modular Finland Oy | ${product.name}`;

  orderButton.addEventListener("click", () => {
    addProductToCart(product.id);
    window.location.href = "tilaus.html";
  });
};

initTheme();
setYear();
normalizeOfferCopy();
setActiveNav();
initMenu();
initReveal();
initSimpleQuoteForm();
initShopButtons();
initOrderForm();
initProductDetail();
