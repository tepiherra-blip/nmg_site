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
    description: "Premium-varusteltu kompakti aittamalli yhdellä makuuhuoneella ja erillisellä WC-tilalla.",
    overview:
      "NordMod Compact Aitta on malliston kompakti aittamalli, joka sisältää yhden makuuhuoneen sekä erillisen WC-tilan. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, LED-valaistuksen, lämmityksen sekä kiintokalusteet tämän toimitussisällön mukaisesti.",
    features: [
      "Yksi makuuhuone ja erillinen WC-tila",
      "Valmiit maalatut sisälevypinnat asiakkaan toiveiden mukaan",
      "Korkea kiintokomero makuuhuoneessa",
      "Allaskaappi ja peilikaappi WC-tilassa",
      "Sähköistys, LED-valaistus ja sähköpatterit vakiona",
    ],
    note:
      "Toimitussisältö perustuu NordMod Compact Aitan vakiomalliin. Rakennus sisältää yhden makuuhuoneen sekä erillisen WC-tilan. WC-istuin toimitetaan lisävarusteena asiakkaan valitseman käyttötarkoituksen ja järjestelmän mukaan. Rakennuksessa ei ole vakiona varausta juoksevalle vedelle eikä viemäröinnille. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
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
                "Seinärunko 48 x 98 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat maalattua levypintaa",
                "Sisälevyseinät maalataan asiakkaan toiveiden mukaan",
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
                "Julkisivupaneelit maalataan asiakkaan toiveiden mukaan",
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
                "Maalatut levyseinäpinnat asiakkaan toiveiden mukaan",
                "Tammen sävyinen vinyylilattia",
                "Katossa 90 mm lämpöhaapapaneeli",
                "Sähköistys ja LED-valaistus",
                "Sähköpatteri",
                "Pistorasiat ja kytkimet valmiiksi asennettuina",
                "Korkea kiintokomero tavaroiden säilyttämiseen",
              ],
            },
            {
              title: "WC-tila",
              items: [
                "Vinyylilattia",
                "Maalatut levyseinäpinnat",
                "Allaskaappi",
                "Peilikaappi",
                "LED-valaistus",
                "Pistorasia peilikaapin yhteydessä",
                "WC-istuin lisävarusteena asiakkaan valitseman järjestelmän mukaan",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
            "Ikkunatyypit MSE / MEK",
            "Alumiiniulkopuite",
            "Musta ulkopuoli",
            "Sälekaihtimet vakiona",
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
            "Sälekaihtimet ikkunoissa",
            "Julkisivun maalaus asiakkaan toiveiden mukaan",
            "Sisälevyseinien maalaus asiakkaan toiveiden mukaan",
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
      ],
    },
  },
  "compact-saunatupa-14": {
    series: "NordMod Compact",
    name: "NordMod Compact Sauna 14",
    description: "Premium-varusteltu kompakti sauna- ja peseytymisrakennus saunalla, suihkutilalla ja pukuhuoneella.",
    overview:
      "NordMod Compact Sauna on kompakti ja laadukas sauna- ja peseytymisrakennus, joka sisältää saunan, suihkutilan sekä pukuhuoneen. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, lämmityksen, ilmanvaihdon, märkätilat sekä saunavarustelun tämän toimitussisällön mukaisesti.",
    features: [
      "Sauna, suihkutila ja lämmin pukuhuone",
      "Vesieristetty ja laatoitettu suihkutila lattialämmityksellä",
      "Harvia 9 kW sähkökiuas ja mittatilauslauteet",
      "Lämminvesivaraaja suihkulle",
      "Sähköistys, LED-valaistus ja ilmanvaihto vakiona",
    ],
    note:
      "Toimitussisältö perustuu NordMod Compact Saunan vakiomalliin. Rakennus sisältää saunan, suihkutilan sekä lämpimän pukuhuoneen ja soveltuu ympärivuotiseen käyttöön. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-compact-14.html",
    image: {
      src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 1.png",
      alt: "NordMod Compact Sauna ulkokuva",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/Comapct pohja.png", alt: "NordMod Compact Sauna pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 2.png", alt: "NordMod Compact Sauna sivunäkymä" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 3.png", alt: "NordMod Compact Sauna terassilla" },
      { src: "assets/mallisto/nordmod-compact/NordMod Compact Sauna/sauna musta 4.png", alt: "NordMod Compact Sauna vaihtoehtoinen ulkokuva" },
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
              items: ["Seinärunko 48 x 98 mm", "Lämmöneristeenä Finnfoam 100 mm", "Sisäpuolinen lisäeristys FF-PIR 30 mm"],
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
                "Julkisivupaneelit maalataan asiakkaan toiveiden mukaan",
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
                "PAX-kylpyhuonepuhallin",
              ],
            },
            {
              title: "Sauna",
              items: [
                "Seinissä ja katossa 140 mm lämpöhaapapaneeli",
                "Mittatilaustyönä valmistetut 180 mm radiatamäntylauteet",
                "Harvia 9 kW sähkökiuas",
                "Sähköistys ja valaistus",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
            "Ikkunatyypit MSE / MEK",
            "Alumiiniulkopuite",
            "Musta ulkopuoli",
            "Sälekaihtimet vakiona",
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
            "Harvia 9 kW sähkökiuas",
            "Lämminvesivaraaja",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Painovoimainen ilmanvaihto",
            "PAX-kylpyhuonepuhallin",
            "Sälekaihtimet ikkunoissa",
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
      ],
    },
  },
  "classic-aitta-18": {
    series: "NordMod Classic",
    name: "NordMod Classic Aitta 18",
    description: "Premium-varusteltu kahden makuuhuoneen aittamalli majoitus- ja vierasmajakäyttöön.",
    overview:
      "NordMod Classic Aitta toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena. Vakiotoimitukseen kuuluvat valmiit sisäpinnat, sähköistys, LED-valaistus, sähköpatterit, painovoimainen ilmanvaihto sekä kahden makuuhuoneen varustelu korkeilla kiintokomeroilla.",
    features: [
      "Kaksi erillistä makuuhuonetta",
      "Valmiit maalatut sisälevypinnat asiakkaan toiveiden mukaan",
      "Sähköistys, LED-valaistus ja sähköpatterit vakiona",
      "Korkeat kiintokomerot molemmissa makuuhuoneissa",
      "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
    ],
    note:
      "Toimitussisältö perustuu NordMod Classic Aitan vakiomalliin. Malli ei sisällä vesipisteitä, viemäröintiä eikä märkätiloja. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
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
                "Seinärunko 48 x 98 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat maalattua levypintaa",
                "Sisälevyseinät maalataan asiakkaan toiveiden mukaan",
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
                "Julkisivupaneelit maalataan asiakkaan toiveiden mukaan",
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
                "Maalatut levyseinäpinnat asiakkaan toiveiden mukaan",
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
              items: ["Valmiit sisäpinnat", "Huonekohtainen LED-valaistus", "Huonekohtaiset sähköpatterit", "Sälekaihtimet ikkunoissa"],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
            "Ikkunatyypit MSE / MEK",
            "Alumiiniulkopuite",
            "Musta ulkopuoli",
            "Sälekaihtimet vakiona",
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
            "Sälekaihtimet ikkunoissa",
            "Julkisivun maalaus asiakkaan toiveiden mukaan",
            "Sisälevyseinien maalaus asiakkaan toiveiden mukaan",
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
      ],
    },
  },
  "classic-saunatupa-18": {
    series: "NordMod Classic",
    name: "NordMod Classic Saunatupa 18",
    description: "Premium-varusteltu saunatuparatkaisu valmiilla sisäpinnoilla, märkätiloilla ja kiintokalusteilla.",
    overview:
      "NordMod Classic Saunatupa toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena. Vakiotoimitukseen kuuluvat valmiit sisäpinnat, sähköistys, lämmitys, ilmanvaihto, märkätilat, sauna, kiuas, lämminvesivaraaja sekä keittiön kiintokalusteet tämän toimitussisällön mukaisesti.",
    features: [
      "Sauna, kylpyhuone ja tupatila Classic-kokoluokassa",
      "Vesieristetyt ja laatoitetut märkätilat lattialämmityksellä",
      "Harvia 9 kW sähkökiuas ja mittatilauslauteet",
      "Keittiökalusteet, uuni, jääkaappi sekä pesuallas ja vesipiste",
      "Sähköistys, LED-valaistus ja ilmanvaihto vakiona",
    ],
    note:
      "Toimitussisältö perustuu NordMod Classic Saunatuvan vakiomalliin. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
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
                "Seinärunko 48 x 98 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat yleisissä tiloissa maalattua levypintaa",
                "Sisälevyseinät maalataan asiakkaan toiveiden mukaan",
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
                "Julkisivupaneelit maalataan asiakkaan toiveiden mukaan",
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
                "Maalatut levyseinäpinnat asiakkaan toiveiden mukaan",
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
                "PAX-kylpyhuonepuhallin",
              ],
            },
            {
              title: "Sauna",
              items: [
                "Seinissä ja katossa 140 mm lämpöhaapapaneeli",
                "Mittatilaustyönä valmistetut 180 mm radiatamäntylauteet",
                "Harvia 9 kW sähkökiuas",
                "Sähköistys ja valaistus",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
            "Ikkunatyypit MSE / MEK",
            "Alumiiniulkopuite",
            "Musta ulkopuoli",
            "Sälekaihtimet vakiona",
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
            "Harvia 9 kW sähkökiuas",
            "Lämminvesivaraaja",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Painovoimainen ilmanvaihto",
            "PAX-kylpyhuonepuhallin",
            "Keittiökalusteet ja kodinkoneet",
            "Sälekaihtimet ikkunoissa",
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
      ],
    },
  },
  "grand-aitta-30": {
    series: "NordMod Grand",
    name: "NordMod Grand Aitta 30",
    description: "Premium-varusteltu kahden makuuhuoneen aittamalli väljemmässä Grand-kokoluokassa.",
    overview:
      "NordMod Grand Aitta on Classic Aittaa hieman suurempi kahden makuuhuoneen aittamalli, joka tarjoaa tutun premium-varustelun sekä laadukkaat materiaalit väljemmässä kokoluokassa. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, LED-valaistuksen, lämmityksen sekä kahden makuuhuoneen varustelun tämän toimitussisällön mukaisesti.",
    features: [
      "Kaksi erillistä makuuhuonetta väljemmässä Grand-kokoluokassa",
      "Valmiit maalatut sisälevypinnat asiakkaan toiveiden mukaan",
      "Korkeat kiintokomerot molemmissa makuuhuoneissa",
      "Sähköistys, LED-valaistus ja sähköpatterit vakiona",
      "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
    ],
    note:
      "Toimitussisältö perustuu NordMod Grand Aitan vakiomalliin. Grand Aitta on Classic Aittaa hieman suurempi kahden makuuhuoneen aittamalli, joka tarjoaa enemmän tilaa majoittumiseen ja säilytykseen säilyttäen saman laadukkaan premium-varustelun. Malli ei sisällä vesipisteitä, viemäröintiä eikä märkätiloja. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
    backLink: "mallisto-grand-30.html",
    image: {
      src: "assets/mallisto/nordmod-grand/grand aitta/grand aitta1.png",
      alt: "NordMod Grand Aitta ulkokuva",
    },
    gallery: [
      { src: "assets/mallisto/nordmod-grand/grand aitta/Grand pohja.png", alt: "NordMod Grand Aitta pohjakuva", caption: "Pohjakuva", className: "plan-card-wide" },
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
                "Seinärunko 48 x 98 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat maalattua levypintaa",
                "Sisälevyseinät maalataan asiakkaan toiveiden mukaan",
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
                "Julkisivupaneelit maalataan asiakkaan toiveiden mukaan",
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
                "Maalatut levyseinäpinnat asiakkaan toiveiden mukaan",
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
              items: ["Valmiit sisäpinnat", "Huonekohtainen LED-valaistus", "Huonekohtaiset sähköpatterit", "Sälekaihtimet ikkunoissa"],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
            "Ikkunatyypit MSE / MEK",
            "Alumiiniulkopuite",
            "Musta ulkopuoli",
            "Sälekaihtimet vakiona",
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
            "Sälekaihtimet ikkunoissa",
            "Julkisivun maalaus asiakkaan toiveiden mukaan",
            "Sisälevyseinien maalaus asiakkaan toiveiden mukaan",
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
      ],
    },
  },
  "grand-saunatupa-30": {
    series: "NordMod Grand",
    name: "NordMod Grand Saunatupa 30",
    description: "Premium-varusteltu Grand-sarjan saunatupa koneellisella poistoilmanvaihdolla.",
    overview:
      "NordMod Grand Saunatupa tarjoaa saman laadukkaan premium-varustelun kuin Classic Saunatupa, mutta varustettuna koneellisella poistoilmanvaihdolla asumismukavuuden ja ilmanvaihdon tehostamiseksi. Rakennus toimitetaan lähtökohtaisesti lähes käyttövalmiina kokonaisuutena sisältäen valmiit sisäpinnat, sähköistyksen, lämmityksen, ilmanvaihdon, märkätilat sekä kiintokalusteet tämän toimitussisällön mukaisesti.",
    features: [
      "Grand-sarjan saunatupa valmiilla märkätiloilla",
      "Koneellinen poistoilmanvaihto vakiona",
      "Keittiökalusteet, uuni, jääkaappi sekä pesuallas ja vesipiste",
      "Harvia 9 kW sähkökiuas ja mittatilauslauteet",
      "Sähköistys, LED-valaistus ja lämmitys vakiona",
    ],
    note:
      "Toimitussisältö perustuu NordMod Grand Saunatuvan vakiomalliin. Grand-mallin vakiona toimitettava koneellinen poistoilmanvaihto parantaa sisäilman laatua ja asumismukavuutta erityisesti ympärivuotisessa käytössä. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
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
                "Seinärunko 48 x 98 mm",
                "Lämmöneristeenä Finnfoam 100 mm",
                "Sisäpuolinen lisäeristys FF-PIR 30 mm",
                "Sisäpinnat yleisissä tiloissa maalattua levypintaa",
                "Sisälevyseinät maalataan asiakkaan toiveiden mukaan",
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
                "Julkisivupaneelit maalataan asiakkaan toiveiden mukaan",
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
                "Maalatut levyseinäpinnat asiakkaan toiveiden mukaan",
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
                "PAX-kylpyhuonepuhallin",
              ],
            },
            {
              title: "Sauna",
              items: [
                "Seinissä ja katossa 140 mm lämpöhaapapaneeli",
                "Mittatilaustyönä valmistetut 180 mm radiatamäntylauteet",
                "Harvia 9 kW sähkökiuas",
                "Sähköistys ja valaistus",
              ],
            },
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Energiatehokkaat lämpölasilliset ikkunat ja ovet",
            "Ikkunatyypit MSE / MEK",
            "Alumiiniulkopuite",
            "Musta ulkopuoli",
            "Sälekaihtimet vakiona",
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
            "Harvia 9 kW sähkökiuas",
            "Lämminvesivaraaja",
            "Energiatehokkaat ikkunat ja ovet",
            "Sähköistys ja LED-valaistus",
            "Koneellinen poistoilmanvaihto",
            "PAX-kylpyhuonepuhallin",
            "Keittiökalusteet ja kodinkoneet",
            "Sälekaihtimet ikkunoissa",
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
      ],
    },
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
    description: "Perinteinen puulämmitteinen pihasauna kantovesikäyttöön ja aitoon suomalaiseen saunakokemukseen.",
    overview:
      "NordMod Pihasauna on perinteinen puulämmitteinen pihasauna, joka on suunniteltu aidon suomalaisen saunakokemuksen ympärille. Rakennus on tarkoitettu kantovesikäyttöiseen saunomiseen. Se ei ole tarkoitettu ympärivuotiseen asumis- tai majoituskäyttöön, eikä se sisällä vesijohto- tai viemärijärjestelmiä.",
    features: [
      "Puulämmitteinen kiuas ja kiuashormisto",
      "Kantovesikäyttöinen sauna ilman vesijohto- tai viemärijärjestelmiä",
      "140 mm lämpöhaapapanelointi seinissä ja katossa",
      "Käsityönä valmistetut radiatamäntylauteet",
      "Suuri maisemaikkuna ja LED-valaistus",
    ],
    note:
      "Toimitussisältö perustuu NordMod Pihasaunan vakiomalliin. Rakennus on suunniteltu perinteiseen kantovesikäyttöön eikä sisällä vesijohto- tai viemärijärjestelmiä. FF-PIR 30 mm -levytystä käytetään seinissä ja katossa saunan lämpenemisen ja lämmön pysyvyyden parantamiseksi. Mallia ei ole tarkoitettu ympärivuotiseen asumis- tai majoituskäyttöön. Mahdolliset asiakaskohtaiset muutokset, lisävarusteet ja erikoisratkaisut määritellään erikseen tarjouksessa ja kauppasopimuksessa.",
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
    technicalContent: {
      title: "Premium-vakiovarustelu ja tekninen toimitussisältö",
      intro:
        "NordMod Pihasaunan vakiorakenteet, tekniset ratkaisut ja premium-varustelu on suunniteltu perinteiseen puulämmitteiseen kantovesisaunomiseen laadukkailla materiaaleilla.",
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
                "Julkisivupaneelit maalataan asiakkaan toiveiden mukaan",
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
            "Puulämmitteinen kiuas",
            "Kiuashormisto",
            "Kiuasvesisäiliö lämpimälle pesuvedelle",
            "Perinteinen kantovesikäyttö",
          ],
        },
        {
          title: "Ikkunat ja ovet",
          items: [
            "Suuri maisemaikkuna",
            "Malliin soveltuvat ikkunat ja ulko-ovi",
            "Musta ulkopuoli",
            "Ikkuna- ja ovimallit valitaan toimituskohtaisesti",
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
          title: "Premium-vakiovarustelu",
          items: [
            "140 mm lämpöhaapapanelointi seinissä ja katossa",
            "FF-PIR 30 mm -levytys seinissä ja katossa saunakäyttöä varten",
            "Käsityönä valmistetut radiatamäntylauteet",
            "Puulämmitteinen kiuas",
            "Kiuashormisto",
            "Kiuasvesisäiliö",
            "Lämpömäntyinen ritilälattia",
            "Kaatovanerilattia vedenpoistolla",
            "Vedenpoistokouru",
            "Suuri maisemaikkuna",
            "LED-valaistus",
            "Julkisivun maalaus asiakkaan toiveiden mukaan",
          ],
        },
        {
          title: "Toimitukseen sisältyy",
          items: [
            "Rakennuksen valmistus tehdasolosuhteissa",
            "Rakennuksen runko- ja vesikattorakenteet",
            "Valmiit ulko- ja sisäpinnat",
            "Puukiuas",
            "Hormisto",
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

const MODEL_ALIASES = {};

const createTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
};

const createItemList = (items) => {
  const list = document.createElement("ul");
  list.className = "feature-list technical-list";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  return list;
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

  const sections = document.createElement("div");
  sections.className = "technical-sections";

  content.sections.forEach((section) => {
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
        groupEl.appendChild(createItemList(group.items));
        groupsEl.appendChild(groupEl);
      });

      sectionEl.appendChild(groupsEl);
    }

    sections.appendChild(sectionEl);
  });

  card.appendChild(sections);
  container.appendChild(card);
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
  const detailStackEl = document.querySelector(".detail-stack");

  if (seriesEl) seriesEl.textContent = `Mallisto / ${model.series}`;
  nameEl.textContent = model.name;
  if (descriptionEl) descriptionEl.textContent = model.description;
  if (overviewEl) overviewEl.textContent = model.overview;
  if (noteEl) noteEl.textContent = model.note;
  if (placeholderEl) placeholderEl.textContent = model.name;
  if (backLinkEl) backLinkEl.href = model.backLink;
  if (offerLinkEl) {
    offerLinkEl.href = `tarjous.html?model=${encodeURIComponent(model.name)}`;
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


