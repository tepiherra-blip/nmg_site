const formatEuro = (value) =>
  new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

const SITE_DISPLAY_CONFIG = {
  priceDisplay: "blurred", // vaihtoehdot: "blurred" tai "visible"
  socialLinks: {
    instagram: "https://www.instagram.com/nordicmodularfinland/",
    facebook: "https://www.facebook.com/profile.php?id=61590937243717",
  },
};

document.documentElement.classList.add("has-js");

const SITE_URL = "https://www.nordicmodular.fi";
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
const QUOTE_PRICE_ADJUSTMENT_TERM =
  "Tarjoushinta perustuu tarjouksen päiväyksen mukaiseen raaka-aineiden, rakennusmateriaalien, komponenttien, energian ja kuljetusten kustannustasoon. Mikäli toimitettavan tuotteen valmistukseen liittyvien materiaalien, komponenttien ja kuljetusten yhteenlasketut kustannukset nousevat yli 5 prosenttia tarjouksen päiväyksen ja asiakkaan sitovan tilauksen välisenä aikana, Nordic Modular Finland Oy pidättää oikeuden tarkistaa tarjoushintaa toteutunutta kustannusten nousua vastaavalla määrällä. Mahdollisesta hinnantarkistuksesta ilmoitetaan asiakkaalle kirjallisesti ennen tilauksen vahvistamista. Tilauksen vahvistamisen jälkeen sovittu hinta on kiinteä, elleivät osapuolet kirjallisesti sovi toimitussisällön, aikataulun tai muiden sopimusehtojen muutoksista.";

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
  tarjouksen_hintatarkistusehto: QUOTE_PRICE_ADJUSTMENT_TERM,
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

const isSpamTrapFilled = (form) => {
  const trap = form.querySelector('[name="_honey"]');
  return Boolean(trap?.value.trim());
};

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

const clearFormFields = (form) => {
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    if (field instanceof HTMLInputElement) {
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = field.defaultChecked;
      } else {
        field.value = "";
      }
    } else if (field instanceof HTMLTextAreaElement) {
      field.value = "";
    } else if (field instanceof HTMLSelectElement) {
      field.selectedIndex = 0;
    }
  });

  form.querySelectorAll(".field-error").forEach((item) => {
    item.textContent = "";
  });
};

const normalizeOfferCopy = () => {
  document.querySelectorAll('a[href^="tarjous.html"], button').forEach((element) => {
    const text = element.textContent?.trim();
    if (!text) return;

    if (
      text === "Pyydä tarjous tästä mallista" ||
      text === "Kysy tästä" ||
      text === "Avaa tarjouslomake" ||
      text === "Täytä tarjouslomake"
    ) {
      element.textContent = "Pyydä tarjous";
    }
  });

};


const MODEL_LIBRARY = {
  "compact-aitta-16": {
    series: "NordMod Compact",
    name: "NordMod Compact Aitta 16",
    description: "Premium-varusteltu kompakti aittamalli yhdellä makuuhuoneella ja erillisellä WC-tilalla.",
    price: "24 900 €",
    furnitureSupplier: true,
    overview:
      "NordMod Compact Aitta on malliston kompakti aittamalli, joka sisältää yhden makuuhuoneen sekä erillisen WC-tilan. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, LED-valaistuksen, lämmityksen sekä kiintokalusteet tämän toimitussisällön mukaisesti.",
    features: [
      "Pohjoisiin olosuhteisiin suunniteltu eristys",
      "Valmiit sisäpinnat",
      "Sähköistys ja lämmitys",
      "Tehdasvalmisteinen ja viimeistelty kokonaisuus",
      "Erillinen WC-tila",
    ],
    note:
      "Toimitussisältö perustuu NordMod Compact Aitan vakiomalliin. Mallissa on erillinen WC-tila. WC-istuin ja lopullinen vesi- ja viemäröintiratkaisu eivät sisälly ilmoitettuun hintaan, vaan ne valitaan kohteen liittymien, jätevesijärjestelmän ja käyttötarkoituksen mukaan. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-compact-16.html",
    image: {
      src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta1.png",
      alt: "Valmis Compact-aitta lisämajoitukseen mökille tai pihapiiriin",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/compact pohja.png", alt: "Compact-aitan pohjakuva lisämajoitukseen tai vierasmajaksi", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta5.png", alt: "Valmis Compact-aitta terassilla mökin tai pihapiirin yhteyteen" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta2.png", alt: "Valmis aitta lisämajoitukseen kompaktissa piharakennuksessa" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Aitta/musta3.png", alt: "Valmis Compact-aitta piharakennukseksi tai vierasmajaksi" },
    ],
    technicalContent: {
      title: "Premium-vakiovarustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Compact Aitan vakiorakenteet, tekniset ratkaisut ja premium-varustelu muodostavat kompaktiin majoitus- ja lisätilakäyttöön sopivan lähes käyttövalmiin kokonaisuuden.",
      sections: [
        {
          title: "Runko- ja eristerakenteet",
          groups: [
            {
              title: "Alapohja",
              items: ["Kantava alapohjarunko 48 x 198 mm", "Rossipohjarakenne", "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste"],
            },
            {
              title: "Ulkoseinät",
              items: [
                "Seinärunko 48 x 123 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat maalattua levypintaa",
                "Sisälevyseinät maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
              ],
            },
            {
              title: "Yläpohja",
              items: [
                "Yläpohjan runko 48 x 148 mm",
                "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste",
                "Vesikatteena peltinen rivikate",
                "Vesikourut ja syöksytorvet",
              ],
            },
            {
              title: "Julkisivu",
              items: [
                "28 x 170 mm vaakapanelointi",
                "Tuuletettu julkisivurakenne",
                "Julkisivupaneelit maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
                "Ikkuna- ja ovipellitykset",
              ],
            },
          ],
        },
        {
          title: "Sisäpinnat ja tilakohtaiset varusteet",
          groups: [
            {
              title: "Makuuhuone",
              items: [
                "Yksi makuuhuone",
                "Maalatut levyseinäpinnat valikoiduilla vakioväreillä",
                "Tammen sävyinen vinyylilattia",
                "Katossa 90 mm lämpöhaapapaneeli",
                "Sähköistys ja LED-valaistus",
                "Sähköpatteri",
                "Pistorasiat ja kytkimet valmiiksi asennettuina",
                "Korkea kiintokomero tavaroiden säilyttämiseen",
              ],
            },
            {
              title: "WC-valmius",
              items: [
                "Mallissa on erillinen WC-tila",
                "WC-istuin ja lopullinen vesi- ja viemäröintiratkaisu eivät sisälly ilmoitettuun hintaan",
                "Ratkaisu valitaan kohteen liittymien, jätevesijärjestelmän ja käyttötarkoituksen mukaan",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Pääosin kiinteät energiatehokkaat lämpölasilliset ikkunat",
            "Mallikohtaisesti avattava tuuletusikkuna",
            "Musta ulkopuoli",
            "Sisäpuolella mustaksi maalattu 131 mm mäntykarmi",
            "Ikkunatyypit ja avattavuudet määritellään mallin ja toimituksen mukaan",
          ],
        },
        {
          title: "Talotekniikka",
          items: [
            "Rakennus toimitetaan sähköistettynä",
            "Pistorasiat ja kytkimet valmiiksi asennettuina",
            "LED-valaistus sisätiloissa",
            "Ulkovalaistus räystäissä",
            "Painovoimainen ilmanvaihto",
            "Yleisissä tiloissa sähköpatterit",
            "Lisävarusteena ilmalämpöpumppu",
          ],
        },
        {
          title: "Premium-vakiovarustelu",
          items: [
            "Valmiit maalatut sisälevypinnat",
            "90 mm lämpöhaapapaneeli katoissa",
            "Tammen sävyinen vinyylilattia",
            "Korkea kiintokomero makuuhuoneessa",
            "Allaskaappi ja peilikaappi WC-tilassa",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Sähköpatterit",
            "Painovoimainen ilmanvaihto",
            "Julkisivun maalaus valikoiduilla vakioväreillä",
            "Sisälevyseinien maalaus valikoiduilla vakioväreillä",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko-, eriste- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Sähköistys ja valaistus",
            "Allaskaappi ja peilikaappi WC-tilaan",
            "Lämmitys sähköpattereilla",
            "Painovoimainen ilmanvaihto",
            "Rakennuksen siirtovalmius",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset",
            "Maatyöt",
            "Kuljetus",
            "Nostotyöt",
            "Tontin sähköliittymä",
            "Vesiliittymä",
            "Viemäriliittymä",
            "WC-istuin ja siihen liittyvä järjestelmä, esimerkiksi polttava WC, kuivakäymälä tai vesikäymälä",
            "Rakennuslupa- ja viranomaismaksut",
            "Mahdolliset asiakaskohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
  },
  "compact-saunatupa-16": {
    series: "NordMod Compact",
    name: "NordMod Compact Sauna 16",
    description: "Premium-varusteltu kompakti sauna- ja peseytymisrakennus saunalla, suihkutilalla ja pukuhuoneella.",
    price: "38 900 €",
    overview:
      "NordMod Compact Sauna on kompakti ja laadukas sauna- ja peseytymisrakennus, joka sisältää saunan, suihkutilan sekä pukuhuoneen. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, lämmityksen, ilmanvaihdon, märkätilat sekä saunavarustelun tämän toimitussisällön mukaisesti.",
    features: [
      "Lämminvesivaraaja",
      "Suihku ja viemäröity märkätila",
      "Sähkökiuas",
      "Pohjoisiin olosuhteisiin suunniteltu eristys",
    ],
    note:
      "Toimitussisältö perustuu NordMod Compact Saunan vakiomalliin. Rakennus sisältää saunan, suihkutilan sekä lämpimän pukuhuoneen ja soveltuu säännölliseen vapaa-ajan käyttöön. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-compact-16.html",
    image: {
      src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 1.png",
      alt: "Valmis Compact-sauna mökille, pihalle tai vapaa-ajan käyttöön",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/Comapct pohja.png", alt: "Compact-saunan pohjakuva saunalle, suihkutilalle ja pukuhuoneelle", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 2.png", alt: "Valmis Compact-sauna pihasaunaksi mökille tai pihalle" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 3.png", alt: "Valmis sauna terassilla mökin tai piharakennuksen yhteyteen" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 4.png", alt: "Kompakti valmis sauna vapaa-ajan käyttöön ja pihapiiriin" },
    ],
    technicalContent: {
      title: "Premium-vakiovarustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Compact Saunan vakiorakenteet, tekniset ratkaisut ja premium-varustelu muodostavat kompaktin, laadukkaan ja lähes käyttövalmiin sauna- ja peseytymisrakennuksen.",
      sections: [
        {
          title: "Runko- ja eristerakenteet",
          groups: [
            {
              title: "Alapohja",
              items: ["Kantava alapohjarunko 48 x 198 mm", "Rossipohjarakenne", "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste"],
            },
            {
              title: "Ulkoseinät",
              items: ["Seinärunko 48 x 123 mm", "Lämmöneristeenä Finnfoam 100 mm", "Sisäpuolinen lisäeristys FF-PIR 30 mm"],
            },
            {
              title: "Yläpohja",
              items: [
                "Yläpohjan runko 48 x 148 mm",
                "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste",
                "Vesikatteena peltinen rivikate",
                "Vesikourut ja syöksytorvet",
              ],
            },
            {
              title: "Julkisivu",
              items: [
                "28 x 170 mm vaakapanelointi",
                "Tuuletettu julkisivurakenne",
                "Julkisivupaneelit maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
                "Ikkuna- ja ovipellitykset",
              ],
            },
          ],
        },
        {
          title: "Sisäpinnat ja tilakohtaiset varusteet",
          groups: [
            {
              title: "Pukuhuone",
              items: [
                "Seinissä 90 mm lämpöhaapapaneeli",
                "Katossa 90 mm lämpöhaapapaneeli",
                "Tammen sävyinen vinyylilattia",
                "Sähköistys ja LED-valaistus",
                "Sähköpatteri",
                "Pistorasiat ja kytkimet valmiiksi asennettuina",
              ],
            },
            {
              title: "Suihkutila",
              items: [
                "Vesieristetyt ja laatoitetut seinät",
                "Vesieristetty ja laatoitettu lattia",
                "Viemäröinti",
                "Lattialämmitys",
                "Katossa 140 mm lämpöhaapapaneeli",
                "Lämminvesivaraaja suihkulle",
                "LED-valaistus",
              ],
            },
            {
              title: "Sauna",
              items: [
                "Seinissä ja katossa 140 mm lämpöhaapapaneeli",
                "Mittatilaustyönä valmistetut 180 mm radiatamäntylauteet",
                "Sähkökiuas Harvia Cilindro Xenio PC90XE Black",
                "Sähköistys ja valaistus",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Pääosin kiinteät energiatehokkaat lämpölasilliset ikkunat",
            "Mallikohtaisesti avattava tuuletusikkuna",
            "Musta ulkopuoli",
            "Sisäpuolella mustaksi maalattu 131 mm mäntykarmi",
            "Ikkunatyypit ja avattavuudet määritellään mallin ja toimituksen mukaan",
          ],
        },
        {
          title: "Talotekniikka",
          items: [
            "Rakennus toimitetaan sähköistettynä",
            "Pistorasiat ja kytkimet valmiiksi asennettuina",
            "LED-valaistus sisätiloissa",
            "Ulkovalaistus räystäissä",
            "Painovoimainen ilmanvaihto",
            "PAX-kylpyhuonepuhallin märkätilassa",
            "Märkätiloissa lattialämmitys",
            "Pukuhuoneessa sähköpatteri",
            "Lämminvesivaraaja suihkulle",
            "Viemäröinti ja vesipisteet",
          ],
        },
        {
          title: "Premium-vakiovarustelu",
          items: [
            "Lämpöhaapapaneelit saunassa sekä pukuhuoneessa",
            "Mittatilaustyönä valmistetut radiatamäntylauteet",
            "Vesieristetty ja laatoitettu suihkutila",
            "Märkätilan lattialämmitys",
            "Sähkökiuas Harvia Cilindro Xenio PC90XE Black",
            "Lämminvesivaraaja",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Painovoimainen ilmanvaihto",
            "PAX-kylpyhuonepuhallin",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko-, eriste- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Sähköistys ja valaistus",
            "Märkätilojen vedeneristys ja laatoitus",
            "Sauna ja kiuas",
            "Lämminvesivaraaja",
            "Rakennuksen siirtovalmius",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset",
            "Maatyöt",
            "Kuljetus",
            "Nostotyöt",
            "Tontin sähkö-, vesi- ja viemäriliittymät",
            "Rakennuslupa- ja viranomaismaksut",
            "Mahdolliset asiakaskohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
  },
  "classic-aitta-20": {
    series: "NordMod Classic",
    name: "NordMod Classic Aitta 20",
    description: "Premium-varusteltu kahden makuuhuoneen aittamalli majoitus- ja vierasmajakäyttöön.",
    price: "31 900 €",
    furnitureSupplier: true,
    overview:
      "NordMod Classic Aitta toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena. Vakiotoimitukseen kuuluvat valmiit sisäpinnat, sähköistys, LED-valaistus, sähköpatterit, painovoimainen ilmanvaihto sekä kahden makuuhuoneen varustelu korkeilla kiintokomeroilla.",
    features: [
      "Pohjoisiin olosuhteisiin suunniteltu eristys",
      "Valmiit sisäpinnat",
      "Sähköistys ja lämmitys",
      "Tehdasvalmisteinen ja viimeistelty kokonaisuus",
    ],
    note:
      "Toimitussisältö perustuu NordMod Classic Aitan vakiomalliin. Malli ei sisällä vesipisteitä, viemäröintiä eikä märkätiloja. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-classic-20.html",
    image: {
      src: "assets/mallisto/nordmod-classic/Classic aitta/kuva1.png",
      alt: "Valmis Classic-aitta lisämajoitukseen mökille tai pihapiiriin",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-classic/Classic aitta/classic pohja.png", alt: "Classic-aitan pohjakuva kahden makuuhuoneen vierasmajalle", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-classic/Classic aitta/kuva 3.png", alt: "Valmis Classic-aitta vierasmajaksi tai lisämajoitukseen" },
      { src: "assets/mallisto/nordmod-classic/Classic aitta/kuva3.png", alt: "Valmis aitta mökille, pihalle tai majoituskäyttöön" },
    ],
    technicalContent: {
      title: "Premium-vakiovarustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Classic Aitan vakiorakenteet, tekniset ratkaisut ja premium-varustelu on suunniteltu laadukkaaseen, energiatehokkaaseen majoitus- ja vierasmajakäyttöön.",
      sections: [
        {
          title: "Runko- ja eristerakenteet",
          groups: [
            {
              title: "Alapohja",
              items: ["Kantava alapohjarunko 48 x 198 mm", "Rossipohjarakenne", "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste"],
            },
            {
              title: "Ulkoseinät",
              items: [
                "Seinärunko 48 x 123 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat maalattua levypintaa",
                "Sisälevyseinät maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
              ],
            },
            {
              title: "Yläpohja",
              items: [
                "Yläpohjan runko 48 x 148 mm",
                "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste",
                "Vesikatteena peltinen rivikate",
                "Vesikourut ja syöksytorvet",
              ],
            },
            {
              title: "Julkisivu",
              items: [
                "28 x 170 mm vaakapanelointi",
                "Tuuletettu julkisivurakenne",
                "Julkisivupaneelit maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
                "Ikkuna- ja ovipellitykset",
              ],
            },
          ],
        },
        {
          title: "Sisäpinnat ja tilakohtaiset varusteet",
          groups: [
            {
              title: "Makuuhuoneet",
              items: [
                "Kaksi erillistä makuuhuonetta",
                "Maalatut levyseinäpinnat valikoiduilla vakioväreillä",
                "Tammen sävyinen vinyylilattia",
                "Katossa 90 mm lämpöhaapapaneeli",
                "Sähköistys ja LED-valaistus",
                "Sähköpatterit",
                "Pistorasiat ja kytkimet valmiiksi asennettuina",
                "Korkeat kiintokomerot molemmissa makuuhuoneissa",
              ],
            },
            {
              title: "Sisustus ja varustelu",
              items: ["Valmiit sisäpinnat", "Huonekohtainen LED-valaistus", "Huonekohtaiset sähköpatterit"],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Pääosin kiinteät energiatehokkaat lämpölasilliset ikkunat",
            "Mallikohtaisesti avattava tuuletusikkuna",
            "Musta ulkopuoli",
            "Sisäpuolella mustaksi maalattu 131 mm mäntykarmi",
            "Ikkunatyypit ja avattavuudet määritellään mallin ja toimituksen mukaan",
          ],
        },
        {
          title: "Talotekniikka",
          items: [
            "Rakennus toimitetaan sähköistettynä",
            "Pistorasiat ja kytkimet valmiiksi asennettuina",
            "LED-valaistus sisätiloissa",
            "Ulkovalaistus räystäissä",
            "Painovoimainen ilmanvaihto",
            "Yleisissä tiloissa sähköpatterit",
            "Lisävarusteena ilmalämpöpumppu",
          ],
        },
        {
          title: "Premium-vakiovarustelu",
          items: [
            "Valmiit maalatut sisälevypinnat",
            "90 mm lämpöhaapapaneeli katoissa",
            "Tammen sävyinen vinyylilattia",
            "Korkeat kiintokomerot molemmissa makuuhuoneissa",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Sähköpatterit",
            "Painovoimainen ilmanvaihto",
            "Julkisivun maalaus valikoiduilla vakioväreillä",
            "Sisälevyseinien maalaus valikoiduilla vakioväreillä",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko-, eriste- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Sähköistys ja valaistus",
            "Lämmitys sähköpattereilla",
            "Painovoimainen ilmanvaihto",
            "Korkeat kiintokomerot molemmissa makuuhuoneissa",
            "Rakennuksen siirtovalmius",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset",
            "Maatyöt",
            "Kuljetus",
            "Nostotyöt",
            "Tontin sähköliittymä",
            "Vesipisteet, viemäröinti tai märkätilat",
            "Rakennuslupa- ja viranomaismaksut",
            "Mahdolliset asiakaskohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
  },
  "classic-saunatupa-20": {
    series: "NordMod Classic",
    name: "NordMod Classic Saunatupa 20",
    description: "Premium-varusteltu saunatuparatkaisu valmiilla sisäpinnoilla, märkätiloilla ja kiintokalusteilla.",
    price: "52 900 €",
    furnitureSupplier: true,
    overview:
      "NordMod Classic Saunatupa toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena. Vakiotoimitukseen kuuluvat valmiit sisäpinnat, sähköistys, lämmitys, ilmanvaihto, märkätilat, sauna, kiuas, lämminvesivaraaja sekä keittiön kiintokalusteet tämän toimitussisällön mukaisesti.",
    features: [
      "Lämminvesivaraaja",
      "Suihku ja viemäröity märkätila",
      "Sähkökiuas",
      "Pohjoisiin olosuhteisiin suunniteltu eristys",
    ],
    note:
      "Toimitussisältö perustuu NordMod Classic Saunatuvan vakiomalliin. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-classic-20.html",
    image: {
      src: "assets/mallisto/nordmod-classic/Classic sauna/Classic sauna 1.png",
      alt: "Valmis Classic-saunatupa, jossa on sauna ja mökkitupa",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-classic/Classic sauna/classic pohja.png", alt: "Classic-saunatuvan pohjakuva saunalle ja oleskelutilalle", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-classic/Classic sauna/Classic sauna 2.png", alt: "Valmis saunatupa, jossa on sauna ja pieni mökkitupa" },
      { src: "assets/mallisto/nordmod-classic/Classic sauna/classic sauna3.png", alt: "Valmis saunatupa mökille, pihalle tai vapaa-ajan käyttöön" },
      { src: "assets/mallisto/nordmod-classic/Classic sauna/classic sauna 4.png", alt: "Valmis saunatupa mökille ja lisämajoitukseen" },
    ],
    technicalContent: {
      title: "Premium-vakiovarustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Classic Saunatuvan vakiorakenteet, tekniset ratkaisut ja premium-varustelu muodostavat lähes käyttövalmiin kokonaisuuden vapaa-ajan, piha- ja mökkikäyttöön.",
      sections: [
        {
          title: "Runko- ja eristerakenteet",
          groups: [
            {
              title: "Alapohja",
              items: ["Kantava alapohjarunko 48 x 198 mm", "Rossipohjarakenne", "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste"],
            },
            {
              title: "Ulkoseinät",
              items: [
                "Seinärunko 48 x 123 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat yleisissä tiloissa maalattua levypintaa",
                "Sisälevyseinät maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
              ],
            },
            {
              title: "Yläpohja",
              items: [
                "Yläpohjan runko 48 x 148 mm",
                "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste",
                "Vesikatteena peltinen rivikate",
                "Vesikourut ja syöksytorvet",
              ],
            },
            {
              title: "Julkisivu",
              items: [
                "28 x 170 mm vaakapanelointi",
                "Tuuletettu julkisivurakenne",
                "Julkisivupaneelit maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
                "Ikkuna- ja ovipellitykset",
              ],
            },
          ],
        },
        {
          title: "Sisäpinnat ja tilakohtaiset varusteet",
          groups: [
            {
              title: "Yleiset tilat",
              items: [
                "Maalatut levyseinäpinnat valikoiduilla vakioväreillä",
                "Tammen sävyinen vinyylilattia",
                "Katossa 90 mm lämpöhaapapaneeli",
                "Sähköistys ja LED-valaistus",
                "Sähköpatterit",
                "Lisävarusteena ilmalämpöpumppu",
              ],
            },
            {
              title: "Keittiö / tupatila",
              items: ["Kiintokalusteet", "Uuni", "Jääkaappi", "Pesuallas ja vesipiste"],
            },
            {
              title: "Kylpyhuone",
              items: [
                "Vesieristetyt ja laatoitetut seinät",
                "Vesieristetty ja laatoitettu lattia",
                "Viemäröinti",
                "Lattialämmitys",
                "Katossa 140 mm lämpöhaapapaneeli",
                "Lämminvesivaraaja suihkulle",
                "LED-valaistus",
              ],
            },
            {
              title: "Sauna",
              items: [
                "Seinissä ja katossa 140 mm lämpöhaapapaneeli",
                "Mittatilaustyönä valmistetut 180 mm radiatamäntylauteet",
                "Sähkökiuas Harvia Cilindro Xenio PC90XE Black",
                "Sähköistys ja valaistus",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Pääosin kiinteät energiatehokkaat lämpölasilliset ikkunat",
            "Mallikohtaisesti avattava tuuletusikkuna",
            "Musta ulkopuoli",
            "Sisäpuolella mustaksi maalattu 131 mm mäntykarmi",
            "Ikkunatyypit ja avattavuudet määritellään mallin ja toimituksen mukaan",
          ],
        },
        {
          title: "Talotekniikka",
          items: [
            "Rakennus toimitetaan sähköistettynä",
            "Pistorasiat ja kytkimet valmiiksi asennettuina",
            "LED-valaistus sisätiloissa",
            "Ulkovalaistus räystäissä",
            "Painovoimainen ilmanvaihto",
            "PAX-kylpyhuonepuhallin märkätilassa",
            "Märkätiloissa lattialämmitys",
            "Yleisissä tiloissa sähköpatterit",
            "Lämminvesivaraaja suihkulle",
            "Viemäröinti ja vesipisteet",
            "Lisävarusteena ilmalämpöpumppu",
          ],
        },
        {
          title: "Premium-vakiovarustelu",
          items: [
            "Lämpöhaapapaneelit saunassa ja sisäkatoissa",
            "Mittatilaustyönä valmistetut radiatamäntylauteet",
            "Vesieristetyt ja laatoitetut märkätilat",
            "Märkätilojen lattialämmitys",
            "Sähkökiuas Harvia Cilindro Xenio PC90XE Black",
            "Lämminvesivaraaja",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Painovoimainen ilmanvaihto",
            "PAX-kylpyhuonepuhallin",
            "Keittiökalusteet ja kodinkoneet",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko-, eriste- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Sähköistys ja valaistus",
            "Märkätilojen vedeneristys ja laatoitus",
            "Kiintokalusteet",
            "Sauna ja kiuas",
            "Lämminvesivaraaja",
            "Rakennuksen siirtovalmius",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset",
            "Maatyöt",
            "Kuljetus",
            "Nostotyöt",
            "Tontin sähkö-, vesi- ja viemäriliittymät",
            "Rakennuslupa- ja viranomaismaksut",
            "Mahdolliset asiakaskohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
  },
  "grand-aitta-30": {
    series: "NordMod Grand",
    name: "NordMod Grand Aitta 30",
    description: "Premium-varusteltu kahden makuuhuoneen aittamalli väljemmässä Grand-kokoluokassa.",
    price: "43 900 €",
    furnitureSupplier: true,
    overview:
      "NordMod Grand Aitta on Classic Aittaa hieman suurempi kahden makuuhuoneen aittamalli, joka tarjoaa tutun premium-varustelun sekä laadukkaat materiaalit väljemmässä kokoluokassa. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, LED-valaistuksen, lämmityksen sekä kahden makuuhuoneen varustelun tämän toimitussisällön mukaisesti.",
    features: [
      "Pohjoisiin olosuhteisiin suunniteltu eristys",
      "Valmiit sisäpinnat",
      "Sähköistys ja lämmitys",
      "Tehdasvalmisteinen ja viimeistelty kokonaisuus",
    ],
    note:
      "Toimitussisältö perustuu NordMod Grand Aitan vakiomalliin. Grand Aitta on Classic Aittaa hieman suurempi kahden makuuhuoneen aittamalli, joka tarjoaa enemmän tilaa majoittumiseen ja säilytykseen säilyttäen saman laadukkaan premium-varustelun. Malli ei sisällä vesipisteitä, viemäröintiä eikä märkätiloja. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-grand-30.html",
    image: {
      src: "assets/mallisto/nordmod-grand/grand aitta/grand aitta1.png",
      alt: "Valmis Grand-aitta vierasmajaksi tai lisämajoitukseen mökille",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-grand/grand aitta/Grand pohja.png", alt: "Grand-aitan pohjakuva väljään lisämajoitukseen", caption: "Pohjakuva", className: "plan-card-wide" },
    ],
    technicalContent: {
      title: "Premium-vakiovarustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Grand Aitan vakiorakenteet, tekniset ratkaisut ja premium-varustelu tarjoavat laadukkaan kahden makuuhuoneen majoitusratkaisun väljemmässä kokoluokassa.",
      sections: [
        {
          title: "Runko- ja eristerakenteet",
          groups: [
            {
              title: "Alapohja",
              items: ["Kantava alapohjarunko 48 x 198 mm", "Rossipohjarakenne", "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste"],
            },
            {
              title: "Ulkoseinät",
              items: [
                "Seinärunko 48 x 123 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat maalattua levypintaa",
                "Sisälevyseinät maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
              ],
            },
            {
              title: "Yläpohja",
              items: [
                "Yläpohjan runko 48 x 148 mm",
                "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste",
                "Vesikatteena peltinen rivikate",
                "Vesikourut ja syöksytorvet",
              ],
            },
            {
              title: "Julkisivu",
              items: [
                "28 x 170 mm vaakapanelointi",
                "Tuuletettu julkisivurakenne",
                "Julkisivupaneelit maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
                "Ikkuna- ja ovipellitykset",
              ],
            },
          ],
        },
        {
          title: "Sisäpinnat ja tilakohtaiset varusteet",
          groups: [
            {
              title: "Makuuhuoneet",
              items: [
                "Kaksi erillistä makuuhuonetta",
                "Maalatut levyseinäpinnat valikoiduilla vakioväreillä",
                "Tammen sävyinen vinyylilattia",
                "Katossa 90 mm lämpöhaapapaneeli",
                "Sähköistys ja LED-valaistus",
                "Sähköpatterit",
                "Pistorasiat ja kytkimet valmiiksi asennettuina",
                "Molemmissa makuuhuoneissa korkeat kiintokomerot tavaroiden säilyttämiseen",
              ],
            },
            {
              title: "Sisustus ja varustelu",
              items: ["Valmiit sisäpinnat", "Huonekohtainen LED-valaistus", "Huonekohtaiset sähköpatterit"],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Pääosin kiinteät energiatehokkaat lämpölasilliset ikkunat",
            "Mallikohtaisesti avattava tuuletusikkuna",
            "Musta ulkopuoli",
            "Sisäpuolella mustaksi maalattu 131 mm mäntykarmi",
            "Ikkunatyypit ja avattavuudet määritellään mallin ja toimituksen mukaan",
          ],
        },
        {
          title: "Talotekniikka",
          items: [
            "Rakennus toimitetaan sähköistettynä",
            "Pistorasiat ja kytkimet valmiiksi asennettuina",
            "LED-valaistus sisätiloissa",
            "Ulkovalaistus räystäissä",
            "Painovoimainen ilmanvaihto",
            "Yleisissä tiloissa sähköpatterit",
            "Lisävarusteena ilmalämpöpumppu",
          ],
        },
        {
          title: "Premium-vakiovarustelu",
          items: [
            "Valmiit maalatut sisälevypinnat",
            "90 mm lämpöhaapapaneeli katoissa",
            "Tammen sävyinen vinyylilattia",
            "Korkeat kiintokomerot molemmissa makuuhuoneissa",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Sähköpatterit",
            "Painovoimainen ilmanvaihto",
            "Julkisivun maalaus valikoiduilla vakioväreillä",
            "Sisälevyseinien maalaus valikoiduilla vakioväreillä",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko-, eriste- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Sähköistys ja valaistus",
            "Lämmitys sähköpattereilla",
            "Painovoimainen ilmanvaihto",
            "Korkeat kiintokomerot molemmissa makuuhuoneissa",
            "Rakennuksen siirtovalmius",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset",
            "Maatyöt",
            "Kuljetus",
            "Nostotyöt",
            "Tontin sähköliittymä",
            "Vesipisteet, viemäröinti tai märkätilat",
            "Rakennuslupa- ja viranomaismaksut",
            "Mahdolliset asiakaskohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
  },
  "grand-saunatupa-30": {
    series: "NordMod Grand",
    name: "NordMod Grand Saunatupa 30",
    description: "Premium-varusteltu Grand-sarjan saunatupa koneellisella poistoilmanvaihdolla.",
    price: "74 900 €",
    furnitureSupplier: true,
    overview:
      "NordMod Grand Saunatupa tarjoaa saman laadukkaan premium-varustelun kuin Classic Saunatupa, mutta varustettuna koneellisella poistoilmanvaihdolla käyttömukavuuden ja ilmanvaihdon tehostamiseksi. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, lämmityksen, ilmanvaihdon, märkätilat sekä kiintokalusteet tämän toimitussisällön mukaisesti.",
    features: [
      "Lämminvesivaraaja",
      "Suihku ja viemäröity märkätila",
      "Sähkökiuas",
      "Pohjoisiin olosuhteisiin suunniteltu eristys",
    ],
    note:
      "Toimitussisältö perustuu NordMod Grand Saunatuvan vakiomalliin. Grand-mallin vakiona toimitettava koneellinen poistoilmanvaihto parantaa sisäilman laatua ja käyttömukavuutta erityisesti säännöllisessä vapaa-ajan käytössä. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-grand-30.html",
    image: {
      src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok2.png",
      alt: "Tilava valmis Grand-saunatupa mökille ja vapaa-ajan käyttöön",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/Grand s pohja.png", alt: "Grand-saunatuvan pohjakuva saunalle, pesuhuoneelle ja tuvalle", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok 4.png", alt: "Tilava saunatupa terassilla mökin tai pihapiirin yhteyteen" },
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok 5.png", alt: "Valmis Grand-saunatupa lisämukavuuteen ja vapaa-aikaan" },
      { src: "assets/mallisto/nordmod-grand/grand saunatupa/iso terassi ok3.png", alt: "NordMod Grand Saunatupa terassinäkymä" },
    ],
    technicalContent: {
      title: "Premium-vakiovarustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Grand Saunatuvan vakiorakenteet, tekniset ratkaisut ja premium-varustelu muodostavat lähes käyttövalmiin saunatupakokonaisuuden koneellisella poistoilmanvaihdolla.",
      sections: [
        {
          title: "Runko- ja eristerakenteet",
          groups: [
            {
              title: "Alapohja",
              items: ["Kantava alapohjarunko 48 x 198 mm", "Rossipohjarakenne", "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste"],
            },
            {
              title: "Ulkoseinät",
              items: [
                "Seinärunko 48 x 123 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat yleisissä tiloissa maalattua levypintaa",
                "Sisälevyseinät maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
              ],
            },
            {
              title: "Yläpohja",
              items: [
                "Yläpohjan runko 48 x 148 mm",
                "Lämmöneristeenä Finnfoam 210 mm rossipohjaeriste",
                "Vesikatteena peltinen rivikate",
                "Vesikourut ja syöksytorvet",
              ],
            },
            {
              title: "Julkisivu",
              items: [
                "28 x 170 mm vaakapanelointi",
                "Tuuletettu julkisivurakenne",
                "Julkisivupaneelit maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
                "Ikkuna- ja ovipellitykset",
              ],
            },
          ],
        },
        {
          title: "Sisäpinnat ja tilakohtaiset varusteet",
          groups: [
            {
              title: "Yleiset tilat",
              items: [
                "Maalatut levyseinäpinnat valikoiduilla vakioväreillä",
                "Tammen sävyinen vinyylilattia",
                "Katossa 90 mm lämpöhaapapaneeli",
                "Sähköistys ja LED-valaistus",
                "Sähköpatterit",
                "Lisävarusteena ilmalämpöpumppu",
              ],
            },
            {
              title: "Keittiö / tupatila",
              items: ["Kiintokalusteet", "Uuni", "Jääkaappi", "Pesuallas ja vesipiste"],
            },
            {
              title: "Kylpyhuone",
              items: [
                "Vesieristetyt ja laatoitetut seinät",
                "Vesieristetty ja laatoitettu lattia",
                "Viemäröinti",
                "Lattialämmitys",
                "Katossa 140 mm lämpöhaapapaneeli",
                "Lämminvesivaraaja suihkulle",
                "LED-valaistus",
              ],
            },
            {
              title: "Sauna",
              items: [
                "Seinissä ja katossa 140 mm lämpöhaapapaneeli",
                "Mittatilaustyönä valmistetut 180 mm radiatamäntylauteet",
                "Sähkökiuas Harvia Cilindro Xenio PC90XE Black",
                "Sähköistys ja valaistus",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Pääosin kiinteät energiatehokkaat lämpölasilliset ikkunat",
            "Mallikohtaisesti avattava tuuletusikkuna",
            "Musta ulkopuoli",
            "Sisäpuolella mustaksi maalattu 131 mm mäntykarmi",
            "Ikkunatyypit ja avattavuudet määritellään mallin ja toimituksen mukaan",
          ],
        },
        {
          title: "Talotekniikka",
          items: [
            "Rakennus toimitetaan sähköistettynä",
            "Pistorasiat ja kytkimet valmiiksi asennettuina",
            "LED-valaistus sisätiloissa",
            "Ulkovalaistus räystäissä",
            "Koneellinen poistoilmanvaihto",
            "Märkätiloissa lattialämmitys",
            "Yleisissä tiloissa sähköpatterit",
            "Lämminvesivaraaja suihkulle",
            "Viemäröinti ja vesipisteet",
            "Lisävarusteena ilmalämpöpumppu",
          ],
        },
        {
          title: "Premium-vakiovarustelu",
          items: [
            "Lämpöhaapapaneelit saunassa ja sisäkatoissa",
            "Mittatilaustyönä valmistetut radiatamäntylauteet",
            "Vesieristetyt ja laatoitetut märkätilat",
            "Märkätilojen lattialämmitys",
            "Sähkökiuas Harvia Cilindro Xenio PC90XE Black",
            "Lämminvesivaraaja",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Koneellinen poistoilmanvaihto",
            "Keittiökalusteet ja kodinkoneet",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko-, eriste- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Sähköistys ja valaistus",
            "Märkätilojen vedeneristys ja laatoitus",
            "Kiintokalusteet",
            "Sauna ja kiuas",
            "Lämminvesivaraaja",
            "Rakennuksen siirtovalmius",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset",
            "Maatyöt",
            "Kuljetus",
            "Nostotyöt",
            "Tontin sähkö-, vesi- ja viemäriliittymät",
            "Rakennuslupa- ja viranomaismaksut",
            "Mahdolliset asiakaskohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
  },
  "nordmod-terassi": {
    series: "NordMod Terassi",
    name: "NordMod Terassi",
    description: "Viimeistelty moduuliterassi rakennuksen yhteyteen tai erikseen ostettavaksi pihaterassiksi.",
    overview:
      "NordMod Terassi on viimeistelty moduuliterassi, joka toimii yhtä hyvin saunan, aitan tai saunatuvan yhteydessä kuin erikseen ostettavana pihaterassina. Se voidaan sijoittaa omakotitalon pihaan, mökille, saunan eteen tai omaksi oleskelualueeksi ilman, että kohteessa tarvitsee olla NordMod-rakennusta. Pinnoitettu Lunawood-lämpöpuukansi ladotaan näyttävään kalanruotokuvioon ja ruuvataan piilosta, jolloin terassin pinnasta tulee siisti, lämminhenkinen ja paljaalle jalalle miellyttävä. 90 x 90 mm kyllästetty liimapuurunko mahdollistaa matalan, ryhdikkään ja helposti eri pihoihin sovitettavan runkorakenteen.",
    features: [
      "Sopii myös erikseen ostettavaksi pihaterassiksi",
      "Pinnoitettu Lunawood 26 x 117 mm lämpöpuukansi",
      "Näyttävä kalanruotokuvio",
      "Piiloruuvaus viimeisteltyä kansipintaa varten",
      "90 x 90 mm kyllästetty liimapuurunko",
      "Matala runkorakenne rakennuksen yhteyteen tai erilliselle oleskelualueelle",
    ],
    note:
      "Terassin voi ostaa osaksi NordMod-kokonaisuutta tai täysin erillisenä pihaterassina. Mitoitus, sijoitus pihaan, mahdollinen liittyminen rakennukseen ja kohdekohtaiset viimeistelyt tarkennetaan tarjousvaiheessa.",
    backLink: "mallisto.html",
    image: {
      src: "assets/mallisto/Terassi/Terassi.png",
      alt: "Valmis terassi mökin, pihasaunan tai piharakennuksen yhteyteen",
    },
    gallery: [{ src: "assets/mallisto/Terassi/Terassi.png", alt: "Valmis terassi piharakennuksen, mökin tai pihasaunan yhteyteen" }],
    technicalContent: {
      title: "Premium-terassirakenne ja tekninen toimitussisältö",
      intro:
        "NordMod Terassi on suunniteltu matalaksi, viimeistellyksi ja näyttäväksi moduuliterassiksi rakennuksen yhteyteen tai itsenäiseksi pihaterassiksi. Laadukas lämpöpuukansi yhdistyy kestävään kyllästettyyn liimapuurunkoon.",
      sections: [
        {
          title: "Terassikansi",
          items: [
            "Pinnoitettu Lunawood 26 x 117 mm lämpöpuu",
            "Kalanruotokuvioon ladottu kansipinta",
            "Piiloruuvaus siistiä ja viimeisteltyä pintaa varten",
            "Lämpöpuun lämmin sävy ja miellyttävä tuntuma paljaalle jalalle",
          ],
        },
        {
          title: "Runko",
          items: [
            "90 x 90 mm kyllästetty liimapuurunko",
            "Matalan runkorakenteen mahdollistava rakenneratkaisu",
            "Soveltuu rakennuksen yhteyteen silloin, kun halutaan siisti ja matala liittymä terassille",
            "Runko mitoitetaan kohdekohtaisesti terassin koon ja asennuspaikan mukaan",
          ],
        },
        {
          title: "Viimeistely ja käyttö",
          items: [
            "Sopii erikseen ostettavaksi terassiksi omakotitalon pihaan, mökille tai vapaa-ajan kohteeseen",
            "Huoliteltu ulkoasu Nordic Modular -rakennusten yhteyteen tai itsenäiseksi pihaterassiksi",
            "Voidaan suunnitella rakennuksen eteen, sivulle tai erillisenä oleskelualueena",
            "Sopii saunan, aitan, saunatuvan, muun piharakennuksen tai olemassa olevan pihan yhteyteen",
            "Kohdekohtaiset mitat ja reunaratkaisut määritellään tarjousvaiheessa",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Terassirungon valmistus",
            "90 x 90 mm kyllästetty liimapuurunko",
            "Pinnoitettu Lunawood 26 x 117 mm lämpöpuukansi",
            "Kalanruotokuvioinen kansilaudoitus",
            "Piiloruuvattu kansipinta",
            "Terassin siirtovalmius tai kohteen mukaan sovittu toimitustapa",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset ja maatyöt",
            "Kuljetus ja nostotyöt, ellei erikseen sovita",
            "Kaiteet, portaat ja erikoisreunukset, ellei niitä määritellä tarjouksessa",
            "Kohdekohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
  },
  "nordic-pihasauna": {
    series: "NordMod Pihasauna",
    name: "NordMod Pihasauna",
    description: "Perinteiseen mökki- ja pihasaunakäyttöön suunniteltu kevyempi saunaratkaisu puukiukaalla ja kantovedellä.",
    price: "15 900 €",
    overview:
      "NordMod Pihasauna on perinteiseen mökki- ja pihasaunakäyttöön suunniteltu kevyempi saunaratkaisu. Se varustetaan puukiukaalla ja kantovesikäyttöön soveltuvalla vesisäiliöllä. Rakenteet ja eristystaso ovat kevyemmät kuin NordMod Compact-, Classic- ja Grand-mallien ratkaisuissa.",
    features: [
      "Puukiuas ja savuhormi",
      "Kantovesikäyttö",
      "Kiukaan yhteydessä lämmitettävä vesi",
      "Kevyempi eristysratkaisu",
      "Perinteinen mökki- ja pihasaunakäyttö",
    ],
    note:
      "Toimitussisältö perustuu NordMod Pihasaunan vakiomalliin. Rakennus on suunniteltu perinteiseen kantovesikäyttöön eikä sisällä vesijohto- tai viemärijärjestelmiä. FF-PIR 30 mm -levytystä käytetään seinissä ja katossa saunan lämpenemisen ja lämmön pysyvyyden parantamiseksi. Mallia ei ole tarkoitettu asumis- tai majoituskäyttöön. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-pihasauna.html",
    image: {
      src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/pihasauna plan73.png",
      alt: "Valmis pihasauna mökille, pihalle tai vapaa-ajan käyttöön",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/sauna pohja.png", alt: "Pihasaunan pohjakuva puulämmitteiseen kantovesisaunaan", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/pihasauna.png", alt: "NordMod Pihasauna etunäkymä" },
      { src: "assets/mallisto/nordmod-pihasauna/NordMod Pihasauna/pihasauna1.png", alt: "NordMod Pihasauna vaihtoehtoinen ulkokuva" },
    ],
    technicalContent: {
      title: "Pihasaunan varustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Pihasaunan vakiorakenteet ja tekniset ratkaisut on suunniteltu perinteiseen puulämmitteiseen kantovesisaunomiseen laadukkailla materiaaleilla.",
      sections: [
        {
          title: "Runko- ja rakenneratkaisut",
          groups: [
            {
              title: "Alapohja",
              items: [
                "Kantava alapohjarunko 48 x 198 mm",
                "Rossipohjarakenne",
                "Kaatovanerilattia vedenpoistolla",
                "Vedenpoistokouru",
                "Lämpömäntyinen ritilälattia",
              ],
            },
            {
              title: "Ulkoseinät",
              items: [
                "Seinärunko 48 x 98 mm",
                "Seinissä FF-PIR 30 mm -levytys saunan nopeamman lämpenemisen ja lämmön pysyvyyden parantamiseksi",
                "Sisäpinnat paneloitu 140 mm lämpöhaapapaneelilla",
              ],
            },
            {
              title: "Yläpohja",
              items: [
                "Yläpohjan runko 48 x 148 mm",
                "Katossa FF-PIR 30 mm -levytys saunan nopeamman lämpenemisen ja lämmön pysyvyyden parantamiseksi",
                "Sisäkatto paneloitu 140 mm lämpöhaapapaneelilla",
                "Vesikatteena peltinen rivikate",
                "Vesikourut ja syöksytorvet",
              ],
            },
            {
              title: "Julkisivu",
              items: [
                "28 x 170 mm vaakapanelointi",
                "Tuuletettu julkisivurakenne",
                "Julkisivupaneelit maalataan valikoiduilla vakioväreillä; vakiovärien ulkopuoliset sävyt lisähintaan",
                "Ikkuna- ja ovipellitykset",
              ],
            },
          ],
        },
        {
          title: "Sisäpinnat ja varusteet",
          groups: [
            {
              title: "Saunatila",
              items: [
                "Seinissä 140 mm lämpöhaapapaneeli",
                "Katossa 140 mm lämpöhaapapaneeli",
                "Käsityönä valmistetut radiatamäntylauteet",
                "Lämpömäntyinen ritilälattia",
                "Kaatovanerilattia vedenpoistolla",
                "Vedenpoistokouru",
                "Suuri maisemaikkuna",
                "LED-valaistus",
              ],
            },
          ],
        },
        {
          title: "Kiuas ja veden lämmitys",
          items: [
            "Puulämmitteinen kiuas vesisäiliöllä",
            "Piippu ja hormisto kuuluvat toimitukseen",
            "Kiuasvesisäiliö lämpimälle pesuvedelle",
            "Perinteinen kantovesikäyttö",
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Kiinteä maisemaikkuna",
            "Musta ulkopuoli",
            "Sisäpuolella mustaksi maalattu 131 mm mäntykarmi",
            "Ikkuna- ja ovimallit sekä avattavuudet valitaan toimituskohtaisesti",
          ],
        },
        {
          title: "Talotekniikka",
          items: [
            "Rakennus toimitetaan sähköistettynä",
            "LED-valaistus",
            "Ulkovalaistus räystäissä",
            "Painovoimainen ilmanvaihto",
            "Ei vesijohto- tai viemärijärjestelmiä",
          ],
        },
        {
          title: "Pihasaunan vakiovarustelu",
          items: [
            "140 mm lämpöhaapapanelointi seinissä ja katossa",
            "FF-PIR 30 mm -levytys seinissä ja katossa saunakäyttöä varten",
            "Käsityönä valmistetut radiatamäntylauteet",
            "Puulämmitteinen kiuas vesisäiliöllä",
            "Piippu ja hormisto",
            "Kiuasvesisäiliö",
            "Lämpömäntyinen ritilälattia",
            "Kaatovanerilattia vedenpoistolla",
            "Vedenpoistokouru",
            "Suuri maisemaikkuna",
            "LED-valaistus",
            "Julkisivun maalaus valikoiduilla vakioväreillä",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Puukiuas vesisäiliöllä",
            "Piippu ja hormisto",
            "Kiuasvesisäiliö",
            "Lauderakenteet",
            "Sähköistys ja valaistus",
            "Rakennuksen siirtovalmius",
          ],
        },
        {
          title: "Toimitukseen ei sisälly",
          items: [
            "Perustukset",
            "Maatyöt",
            "Kuljetus",
            "Nostotyöt",
            "Vesiliittymät",
            "Viemäröinti",
            "Suihkutilat",
            "Ympärivuotiseen asumis- tai majoituskäyttöön vaadittavat ratkaisut",
            "Rakennuslupa- ja viranomaismaksut",
            "Mahdolliset asiakaskohtaiset lisä- ja muutostyöt",
          ],
        },
        {
          title: "Perustus- ja pohjatyöt lisäpalveluna",
          items: [
            "Perustus- ja pohjatyöt voidaan tarjota erikseen kohteen mukaan. Toteutuksessa hyödynnämme luotettuja aliurakoitsijoita, jolloin kokonaisuus voidaan sovittaa yhteen rakennuksen toimituksen kanssa.",
          ],
        },
      ],
    },
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
  quoteFallback: "Pyydä tarjous",
  contactFallback: "Lähetä yhteydenotto",
  validationProduct: "Valitse kiinnostava malli.",
  validationName: "Lisää nimi.",
  validationEmail: "Lisää toimiva sähköpostiosoite.",
  validationPhone: "Lisää puhelinnumero, josta sinut tavoittaa.",
  validationContact: "Lisää sähköposti tai puhelinnumero.",
  validationMessage: "Kerro viestissäsi hieman tarkemmin, miten voimme auttaa.",
};

const getCurrentLanguage = () => "fi";
const getUiCopy = () => UI_COPY;

const MODEL_ALIASES = {
  "compact-aitta-14": "compact-aitta-16",
  "compact-saunatupa-14": "compact-saunatupa-16",
  "classic-aitta-18": "classic-aitta-20",
  "classic-saunatupa-18": "classic-saunatupa-20",
};

const createTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
};

const MODEL_PRICE_LABEL = "Premium-vakiovarustelu";
const MODEL_PRICE_TAX_TEXT = "Sis. alv 25,5 %";
const MODEL_PRICE_NOTE_TEXT = "Saatavana myös kevennetyllä tai yksilöllisellä varustelulla.";
const MODEL_PRICE_DETAIL_TEXT =
  "Hinta koskee mallin vakioitua premium-varustelutasoa. Lopullinen toimitussisältö ja kohdekohtaiset kustannukset vahvistetaan kirjallisessa tarjouksessa.";
const FURNITURE_SUPPLIER = {
  name: "Carlo Casagrande & Co",
  url: "https://carlocasagrande.fi/fi-fi/",
  logo: "assets/carlo-casagrande-logo.png",
  text:
    "Mallin kiintokalusteet, kaapistot ja keittiöratkaisut toteutetaan laadukkailla Carlo Casagranden kalusteilla osana vakioitua premium-varustelutasoa.",
};

const createItemList = (items = []) => {
  const list = document.createElement("ul");
  list.className = "feature-list technical-list";

  items.filter(Boolean).forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  return list;
};

const TECHNICAL_STANDARD_NOTE = {
  title: "Mallikohtainen vakiotaso ja asiakaskohtainen toteutus",
  text:
    "Tässä esitetty toimitussisältö kuvaa NordMod-malliston vakioitua premium-tasoa. Toteutus voidaan kuitenkin sovittaa asiakkaan tarpeiden ja käyttötarkoituksen mukaan. Materiaalit, varustelu, mitoitus ja lisävarusteet määritellään aina lopullisesti tarjouksessa ja kauppasopimuksessa.",
};

const renderTechnicalContent = (container, content) => {
  if (!container) return;

  const existingCard = container.querySelector(".technical-content-card");
  existingCard?.remove();

  if (!content) return;

  const card = document.createElement("article");
  card.className = "info-card technical-content-card";
  card.appendChild(createTextElement("span", "card-label", "Tekniset tiedot"));
  card.appendChild(createTextElement("h2", "", content.title));

  if (content.intro) {
    card.appendChild(createTextElement("p", "technical-intro", content.intro));
  }

  const standardNote = document.createElement("div");
  standardNote.className = "technical-standard-note";
  standardNote.appendChild(createTextElement("h3", "", TECHNICAL_STANDARD_NOTE.title));
  standardNote.appendChild(createTextElement("p", "", TECHNICAL_STANDARD_NOTE.text));
  card.appendChild(standardNote);

  const sections = document.createElement("div");
  sections.className = "technical-sections";

  const sectionsData = Array.isArray(content.sections) ? content.sections : [];

  sectionsData.forEach((section) => {
    const sectionEl = document.createElement("section");
    sectionEl.className = "technical-section";
    sectionEl.appendChild(createTextElement("h3", "", section.title));

    if (section.items?.length) {
      sectionEl.appendChild(createItemList(section.items));
    }

    if (section.groups?.length) {
      const groupsEl = document.createElement("div");
      groupsEl.className = "technical-groups";

      section.groups.forEach((group) => {
        const groupEl = document.createElement("div");
        groupEl.className = "technical-group";
        groupEl.appendChild(createTextElement("h4", "", group.title));
        groupEl.appendChild(createItemList(Array.isArray(group.items) ? group.items : []));
        groupsEl.appendChild(groupEl);
      });

      sectionEl.appendChild(groupsEl);
    }

    sections.appendChild(sectionEl);
  });

  card.appendChild(sections);
  container.appendChild(card);
};

const renderFurnitureSupplier = (container, enabled) => {
  if (!container) return;

  const existingCard = container.querySelector(".furniture-supplier-card");
  existingCard?.remove();

  if (!enabled) return;

  const card = document.createElement("article");
  card.className = "info-card furniture-supplier-card";

  const logoLink = document.createElement("a");
  logoLink.className = "supplier-logo-link";
  logoLink.href = FURNITURE_SUPPLIER.url;
  logoLink.target = "_blank";
  logoLink.rel = "noopener noreferrer";
  logoLink.setAttribute("aria-label", `${FURNITURE_SUPPLIER.name} verkkosivut`);

  const logo = document.createElement("img");
  logo.className = "supplier-logo";
  logo.src = FURNITURE_SUPPLIER.logo;
  logo.alt = `${FURNITURE_SUPPLIER.name} logo`;
  logoLink.appendChild(logo);

  card.appendChild(createTextElement("span", "card-label", "Kalusteet"));
  card.appendChild(logoLink);
  card.appendChild(createTextElement("h2", "", "Laadukkaat Carlo Casagranden kalusteet"));
  card.appendChild(createTextElement("p", "", FURNITURE_SUPPLIER.text));

  const textLink = document.createElement("a");
  textLink.className = "text-link";
  textLink.href = FURNITURE_SUPPLIER.url;
  textLink.target = "_blank";
  textLink.rel = "noopener noreferrer";
  textLink.textContent = "Tutustu Carlo Casagrandeen";
  card.appendChild(textLink);

  const technicalCard = container.querySelector(".technical-content-card");
  if (technicalCard) {
    container.insertBefore(card, technicalCard);
  } else {
    container.appendChild(card);
  }
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
};

const getCurrentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

const getPreferredTheme = () => {
  return "light";
};

const getStoredTheme = () => {
  try {
    window.localStorage.removeItem("nmg-theme");
    return window.localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Theme still changes for the current page even if browser storage is unavailable.
  }
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
  const savedTheme = getStoredTheme();
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
    setStoredTheme(nextTheme);
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

  items.forEach((item) => item.classList.add("is-visible"));
};

const setModelFromQuery = (form) => {
  const params = new URLSearchParams(window.location.search);
  const model = params.get("model");
  if (!model) return;

  const product = form.querySelector("#product");
  const optionIndex = Array.from(product.options).findIndex((item) => item.dataset.label === model);
  const option = product.options[optionIndex];
  if (option) {
    product.selectedIndex = optionIndex;
  }
};

const initSimpleQuoteForm = () => {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const statusEl = document.getElementById("quote-form-status");

  const validators = {
    product: (value) => (value.trim() ? "" : getUiCopy().validationProduct),
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

  form.addEventListener("change", (event) => {
    resetFormStatus(statusEl);
    if (event.target instanceof HTMLSelectElement) {
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

    if (isSpamTrapFilled(form)) {
      setFormStatus(statusEl, "success", getUiCopy().quoteSent);
      return;
    }

    const fieldsToValidate = ["product", "name", "email", "phone"].map((name) => form.querySelector(`[name="${name}"]`));
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
      clearFormFields(form);
      setFormStatus(statusEl, "success", getUiCopy().quoteSent);
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

    if (isSpamTrapFilled(form)) {
      setFormStatus(statusEl, "success", getUiCopy().contactSent);
      return;
    }

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
      clearFormFields(form);
      setFormStatus(statusEl, "success", getUiCopy().contactSent);
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

const getAbsoluteSiteUrl = (path) => new URL(path, SITE_URL + "/").href;

const getSchemaPrice = (price) => {
  const digits = String(price || "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
};

const setMetaTag = (attribute, key, content) => {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const updateModelSeo = (model, modelId) => {
  const title = `${model.name} | Nordic Modular Finland Oy`;
  const image = model.image?.src ? getAbsoluteSiteUrl(model.image.src) : getAbsoluteSiteUrl("assets/logo.png");
  const url = `${SITE_URL}/malli.html?model=${encodeURIComponent(modelId)}`;

  document.title = title;
  setMetaTag("name", "description", model.description);
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", model.description);
  setMetaTag("property", "og:image", image);
  setMetaTag("property", "og:url", url);
  setMetaTag("property", "og:type", "website");

  const images = [
    model.image?.src,
    ...(Array.isArray(model.gallery) ? model.gallery.map((item) => item.src) : []),
  ]
    .filter(Boolean)
    .map(getAbsoluteSiteUrl);
  const schemaPrice = getSchemaPrice(model.price);

  const schema = schemaPrice
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: model.name,
        description: model.description,
        category: model.series,
        image: images,
        brand: {
          "@type": "Brand",
          name: "Nordic Modular Finland Oy",
        },
        manufacturer: {
          "@type": "Organization",
          name: "Nordic Modular Finland Oy",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          url,
          price: schemaPrice,
          priceCurrency: "EUR",
          availability: "https://schema.org/PreOrder",
          itemCondition: "https://schema.org/NewCondition",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: schemaPrice,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: true,
            description:
              "Hinta koskee mallin vakioitua premium-varustelutasoa. Lopullinen toimitussisältö ja kohdekohtaiset kustannukset vahvistetaan kirjallisessa tarjouksessa.",
          },
          seller: {
            "@type": "Organization",
            name: "Nordic Modular Finland Oy",
            url: SITE_URL,
          },
        },
      }
    : {
    "@context": "https://schema.org",
    "@type": "Service",
    name: model.name,
    description: model.description,
    serviceType: model.series,
    provider: {
      "@type": "Organization",
      name: "Nordic Modular Finland Oy",
      url: SITE_URL,
    },
    brand: {
      "@type": "Brand",
      name: "Nordic Modular Finland Oy",
    },
    areaServed: {
      "@type": "Country",
      name: "Finland",
    },
    image: images,
  };

  const existingSchema = document.getElementById("model-service-schema");
  existingSchema?.remove();

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "model-service-schema";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

const initModelDetail = () => {
  const nameEl = document.getElementById("model-name");
  if (!nameEl) return;

  const params = new URLSearchParams(window.location.search);
  const requestedModelId = params.get("model");
  const modelId = MODEL_ALIASES[requestedModelId] || requestedModelId;
  const model = modelId ? MODEL_LIBRARY[modelId] : null;

  if (!model) {
    window.location.href = "mallisto.html";
    return;
  }

  const seriesEl = document.getElementById("model-series");
  const descriptionEl = document.getElementById("model-description");
  const priceEl = document.getElementById("model-price");
  const priceAmountEl = document.getElementById("model-price-amount");
  const priceLabelEl = document.getElementById("model-price-label");
  const priceTaxEl = document.getElementById("model-price-tax");
  const priceNoteEl = document.getElementById("model-price-note");
  const priceDetailEl = document.getElementById("model-price-detail");
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
  const detailOfferLinkEl = document.getElementById("model-detail-offer-link");
  const detailStackEl = document.querySelector(".detail-stack");

  if (seriesEl) seriesEl.textContent = `Mallisto / ${model.series}`;
  nameEl.textContent = model.name;
  if (descriptionEl) descriptionEl.textContent = model.description;
  if (priceEl && priceAmountEl && priceLabelEl) {
    if (model.price) {
      priceAmountEl.textContent = model.price;
      priceLabelEl.textContent = MODEL_PRICE_LABEL;
      if (priceTaxEl) priceTaxEl.textContent = MODEL_PRICE_TAX_TEXT;
      if (priceNoteEl) priceNoteEl.textContent = MODEL_PRICE_NOTE_TEXT;
      priceEl.hidden = false;
    } else {
      priceAmountEl.textContent = "";
      priceLabelEl.textContent = "";
      if (priceTaxEl) priceTaxEl.textContent = "";
      if (priceNoteEl) priceNoteEl.textContent = "";
      priceEl.hidden = true;
    }
  }
  if (priceDetailEl) {
    if (model.price) {
      priceDetailEl.textContent = MODEL_PRICE_DETAIL_TEXT;
      priceDetailEl.hidden = false;
    } else {
      priceDetailEl.textContent = "";
      priceDetailEl.hidden = true;
    }
  }
  if (overviewEl) overviewEl.textContent = model.overview;
  if (noteEl) noteEl.textContent = model.note;
  if (placeholderEl) placeholderEl.textContent = model.name;
  if (backLinkEl) backLinkEl.href = model.backLink;
  if (offerLinkEl) {
    offerLinkEl.href = `tarjous.html?model=${encodeURIComponent(model.name)}`;
  }
  if (detailOfferLinkEl) {
    detailOfferLinkEl.href = `tarjous.html?model=${encodeURIComponent(model.name)}`;
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
    const features = Array.isArray(model.features) ? model.features : [];
    featuresEl.innerHTML = features.map((feature) => `<li>${feature}</li>`).join("");
  }

  renderFurnitureSupplier(detailStackEl, model.furnitureSupplier);
  renderTechnicalContent(detailStackEl, model.technicalContent);

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

  updateModelSeo(model, modelId);
};

const createPriceReviewStatus = () => {
  const status = document.createElement("div");
  status.className = "price-review-status";
  status.innerHTML = `
    <strong class="price-review-status__title">Hinta tarkistuksessa</strong>
    <span class="price-review-status__text">Julkaisemme tarkistetun vakiohinnan pian.</span>
    <a class="price-review-status__link" href="tarjous.html">Pyydä tarjous</a>
  `;
  return status;
};

const applyPriceDisplayMode = () => {
  const shouldBlur = SITE_DISPLAY_CONFIG.priceDisplay === "blurred";

  document.querySelectorAll(".model-price__amount").forEach((priceAmountEl) => {
    const priceBlock = priceAmountEl.closest(".model-price") || priceAmountEl.parentElement;
    if (!priceBlock) return;

    const existingStatus = priceBlock.querySelector(".price-review-status");

    if (shouldBlur) {
      priceAmountEl.classList.add("is-price-blurred");
      priceAmountEl.setAttribute("aria-hidden", "true");

      if (!existingStatus) {
        priceAmountEl.insertAdjacentElement("afterend", createPriceReviewStatus());
      }
    } else {
      priceAmountEl.classList.remove("is-price-blurred");
      priceAmountEl.removeAttribute("aria-hidden");
      existingStatus?.remove();
    }
  });
};

const isValidInstagramUrl = (url) => {
  if (!url || !url.startsWith("https://www.instagram.com/")) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" && parsedUrl.hostname === "www.instagram.com";
  } catch {
    return false;
  }
};

const isValidFacebookUrl = (url) => {
  if (!url || url.includes("PASTE_") || !url.startsWith("https://www.facebook.com/")) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" && parsedUrl.hostname === "www.facebook.com";
  } catch {
    return false;
  }
};

const getSocialIconSvg = (service) => {
  if (service === "instagram") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <circle cx="17.5" cy="6.5" r="1.1"></circle>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 8.4V6.8c0-.9.4-1.4 1.5-1.4H17V3h-2.3C12.2 3 11 4.5 11 6.5v1.9H8.8V11H11v10h3V11h2.5l.4-2.6H14Z"></path>
    </svg>
  `;
};

const createSocialLink = ({ service, url, label, title }) => {
  const link = document.createElement("a");
  link.className = `social-link social-link--${service}`;
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", label);
  link.title = title;
  link.innerHTML = `
    ${getSocialIconSvg(service)}
    <span class="visually-hidden">${title}</span>
  `;
  return link;
};

const initializeSocialLinks = () => {
  const { instagram, facebook } = SITE_DISPLAY_CONFIG.socialLinks;

  document.querySelectorAll(".footer-meta").forEach((footerMeta) => {
    footerMeta.querySelector(".footer-social")?.remove();

    const social = document.createElement("div");
    social.className = "footer-social";

    if (isValidInstagramUrl(instagram)) {
      social.appendChild(
        createSocialLink({
          service: "instagram",
          url: instagram,
          label: "Nordic Modular Finland Instagramissa",
          title: "Instagram",
        })
      );
    }

    if (isValidFacebookUrl(facebook)) {
      social.appendChild(
        createSocialLink({
          service: "facebook",
          url: facebook,
          label: "Nordic Modular Finland Facebookissa",
          title: "Facebook",
        })
      );
    }

    if (!social.children.length) return;

    const copyright = footerMeta.querySelector("p");
    footerMeta.insertBefore(social, copyright || null);
  });
};

window.SITE_DISPLAY_CONFIG = SITE_DISPLAY_CONFIG;
window.applyPriceDisplayMode = applyPriceDisplayMode;
window.initializeSocialLinks = initializeSocialLinks;

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
applyPriceDisplayMode();
initializeSocialLinks();
