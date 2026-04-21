const formatEuro = (value) =>
  new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

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

const initQuoteForm = () => {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const totalEl = document.getElementById("estimate-total");
  const labelEl = document.getElementById("estimate-label");
  const itemsEl = document.getElementById("estimate-items");

  const estimate = () => {
    const product = form.querySelector("#product");
    const selectedProduct = product.options[product.selectedIndex];
    let total = Number(product.value);

    const items = [`Perusmalli: ${selectedProduct.dataset.label}`];

    ["heatpump", "solar", "terrace", "premium"].forEach((id) => {
      const input = form.querySelector(`#${id}`);
      if (input.checked) {
        total += Number(input.value);
        items.push(input.parentElement.textContent.trim());
      }
    });

    totalEl.textContent = formatEuro(total);
    labelEl.textContent = `${selectedProduct.dataset.label} valituilla lisävarusteilla.`;
    itemsEl.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
  };

  form.addEventListener("input", estimate);
  form.addEventListener("reset", () => {
    requestAnimationFrame(estimate);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const product = form.querySelector("#product");
    const selectedProduct = product.options[product.selectedIndex];
    const useCase = form.querySelector("#use-case").value;
    const timeline = form.querySelector("#timeline").value;
    const location = form.querySelector("#location").value || "Ei ilmoitettu";
    const siteReady = form.querySelector("#site-ready").value;
    const details = form.querySelector("#details").value || "Ei lisätietoja";
    const name = form.querySelector("#name").value || "Ei ilmoitettu";
    const email = form.querySelector("#email").value || "Ei ilmoitettu";
    const phone = form.querySelector("#phone").value || "Ei ilmoitettu";
    const total = totalEl.textContent;

    const selectedExtras = ["heatpump", "solar", "terrace", "premium"]
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

  estimate();
};

document.getElementById("year").textContent = new Date().getFullYear();
setActiveNav();
initMenu();
initQuoteForm();
