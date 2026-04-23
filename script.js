const formatEuro = (value) =>
  new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

const setYear = () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
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

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
};

const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

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
    let total = Number(product.value);

    const items = [`Valinta: ${selectedProduct.dataset.label}`];

    ["heatpump", "solar", "terrace", "premium"].forEach((id) => {
      const input = form.querySelector(`#${id}`);
      if (input.checked) {
        total += Number(input.value);
        items.push(input.parentElement.textContent.trim());
      }
    });

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

initTheme();
setYear();
setActiveNav();
initMenu();
initReveal();
initQuoteForm();
