const formatEuro = (value) =>
  new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

document.documentElement.classList.add("has-js");

const SHOP_CART_KEY = "nmg-shop-cart";
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
    throw new Error(data?.message || "Lomakkeen lahetys ei onnistunut.");
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
      text === "Pyydï¿½ tarjous" ||
      text === "Pyydï¿½ tarjous tï¿½stï¿½ mallista" ||
      text === "Kysy tï¿½stï¿½" ||
      text === "Avaa tarjouslomake" ||
      text === "Tï¿½ytï¿½ tarjouslomake"
    ) {
      element.textContent = "Pyydï¿½ alustava tarjous";
    }
  });

  document.querySelectorAll(".price").forEach((element) => {
    const text = element.textContent?.trim();
    if (text === "Pyydï¿½ erillinen tarjous") {
      element.textContent = "Alustava hinta mï¿½ï¿½rï¿½ytyy kohteen mukaan";
    }
  });

  document.querySelectorAll("p").forEach((element) => {
    const text = element.textContent?.trim();
    if (text === "Pyydï¿½ erillinen tarjous. Toteutus ja hinta mï¿½ï¿½rï¿½ytyvï¿½t kohteen vaatimusten mukaan.") {
      element.textContent = "Alustava hinta ja toimitussisï¿½ltï¿½ tarkennetaan kohteen vaatimusten mukaan.";
    }
  });
};

const initPrelaunchVisibility = () => {
  document.querySelectorAll('[data-nav="shop"], .footer-nav a[href="shop.html"]').forEach((element) => {
    element.remove();
  });
};

const SHOP_PRODUCTS = {
  "nordic-laudesetti": {
    id: "nordic-laudesetti",
    name: "Nordic laudesetti",
    category: "Sauna",
    description: "Valmis lauderatkaisu laadukkaaseen saunaan kotona tai mï¿½killï¿½.",
    price: 1490,
    priceLabel: "Alkaen 1 490 ï¿½",
    longDescription:
      "Nordic laudesetti tuo saunaan valmiin ja viimeistellyn lauderatkaisun, jossa yhdistyvï¿½t kï¿½ytï¿½nnï¿½llisyys, selkeï¿½ ilme ja miellyttï¿½vï¿½ kï¿½yttï¿½tuntuma.",
    features: ["Valmis kokonaisuus lauteisiin", "Sopii mï¿½kille tai kotisaunaan", "Selkeï¿½ ja laadukas viimeistely"],
    fit: "Voidaan yhdistï¿½ï¿½ myï¿½s osaksi Nordic Modular -saunatoimitusta.",
  },
  "saunan-led-valaistuspaketti": {
    id: "saunan-led-valaistuspaketti",
    name: "Saunan LED-valaistuspaketti",
    category: "Sauna",
    description: "Tyylikï¿½s valaistuspaketti pehmeï¿½ï¿½n tunnelmaan ja kï¿½ytï¿½nnï¿½lliseen valoon.",
    price: 390,
    priceLabel: "Alkaen 390 ï¿½",
    longDescription:
      "LED-valaistuspaketti tuo saunaan pehmeï¿½n tunnelman ja toimivan kï¿½yttï¿½valon. Ratkaisu sopii sekï¿½ uuden saunan viimeistelyyn ettï¿½ olemassa olevan tilan pï¿½ivitykseen.",
    features: ["Tunnelmavaloon ja kï¿½yttï¿½valoon", "Sopii lauteisiin tai seinï¿½pintoihin", "Voidaan tarjota osana saunapakettia"],
    fit: "Toimii hyvin lisï¿½myyntituotteena saunan tai muun toimituksen yhteydessï¿½.",
  },
  "terassivalaistuspaketti": {
    id: "terassivalaistuspaketti",
    name: "Terassivalaistuspaketti",
    category: "Piha & terassi",
    description: "Selkeï¿½ valaistus terassin reunoihin, kulkureiteille ja oleskelutilaan.",
    price: 540,
    priceLabel: "Alkaen 540 ï¿½",
    longDescription:
      "Terassivalaistuspaketti kokoaa yhteen toimivan ulkovalaistuksen, joka tukee kulkua, oleskelua ja terassin kï¿½ytettï¿½vyyttï¿½ ilta-aikaan.",
    features: ["Terassin valaistus yhteen pakettiin", "Sopii kulkureiteille ja oleskeluun", "Laajennettavissa osaksi terassitoimitusta"],
    fit: "Voidaan toimittaa osana terassi- tai pihaprojektia.",
  },
  "pihavalaisin-musta": {
    id: "pihavalaisin-musta",
    name: "Pihavalaisin musta",
    category: "Piha & terassi",
    description: "Ajattoman tumma valaisin viimeistelemï¿½ï¿½n kulkuvï¿½ylï¿½t ja sisï¿½ï¿½nkï¿½ynnit.",
    price: 129,
    priceLabel: "Alkaen 129 ï¿½",
    longDescription:
      "Pihavalaisin musta viimeistelee sisï¿½ï¿½nkï¿½ynnit, pihan kulkureitit ja rakennuksen lï¿½hiympï¿½ristï¿½n ajattomalla ilmeellï¿½.",
    features: ["Ajaton tumma ilme", "Sopii sisï¿½ï¿½nkï¿½ynteihin", "Helppo liittï¿½ï¿½ laajempaan pihavalaistukseen"],
    fit: "Sopii lisï¿½tuotteeksi piha- ja terassikokonaisuuksiin.",
  },
  polkuvalaisin: {
    id: "polkuvalaisin",
    name: "Polkuvalaisin",
    category: "Piha & terassi",
    description: "Matala ja huomaamaton valaisin pihan reiteille ja mï¿½kin kulkuihin.",
    price: 98,
    priceLabel: "Alkaen 98 ï¿½",
    longDescription:
      "Polkuvalaisin tuo kulkureiteille turvallisuutta ja selkeyttï¿½ ilman raskasta ilmettï¿½. Se sopii pihan reiteille, terassille ja mï¿½kin ympï¿½ristï¿½ï¿½n.",
    features: ["Pihan reiteille ja kulkuihin", "Huomaamaton ja kï¿½ytï¿½nnï¿½llinen", "Sopii osaksi ulkovalopakettia"],
    fit: "Voidaan myydï¿½ yksittï¿½in tai osana pihavalaistuksen kokonaisuutta.",
  },
  "palju-basic": {
    id: "palju-basic",
    name: "Palju Basic",
    category: "Paljut & porealtaat",
    description: "Selkeï¿½ lï¿½htï¿½tason palju pihapiiriin ja mï¿½kkikï¿½yttï¿½ï¿½n.",
    price: 2490,
    priceLabel: "Alkaen 2 490 ï¿½",
    longDescription:
      "Palju Basic tarjoaa selkeï¿½n ja toimivan tavan tuoda rentoutuminen pihapiiriin tai mï¿½kille ilman turhaa monimutkaisuutta.",
    features: ["Selkeï¿½ perusmalli", "Sopii mï¿½kille ja pihaan", "Laajennettavissa lisï¿½varusteilla"],
    fit: "Toimii myï¿½s osana suurempaa pihapiirin rentoutumiskokonaisuutta.",
  },
  "palju-premium": {
    id: "palju-premium",
    name: "Palju Premium",
    category: "Paljut & porealtaat",
    description: "Viimeistelty premium-ratkaisu rentoutumiseen ympï¿½ri vuoden.",
    price: 4290,
    priceLabel: "Alkaen 4 290 ï¿½",
    longDescription:
      "Palju Premium on laadukas vaihtoehto ympï¿½rivuotiseen kï¿½yttï¿½ï¿½n, kun ulkotilan viimeistelyltï¿½ halutaan sekï¿½ mukavuutta ettï¿½ nï¿½yttï¿½vyyttï¿½.",
    features: ["Premium-ilme ja viimeistely", "Ympï¿½rivuotiseen kï¿½yttï¿½ï¿½n", "Tï¿½ydennettï¿½vissï¿½ lisï¿½ominaisuuksilla"],
    fit: "Sopii hyvin osaksi laadukasta piha- tai mï¿½kkikokonaisuutta.",
  },
  "poreallas-nordic": {
    id: "poreallas-nordic",
    name: "Poreallas Nordic",
    category: "Paljut & porealtaat",
    description: "Moderni poreallas laadukkaaseen pihaan tai mï¿½kin yhteyteen.",
    price: 6900,
    priceLabel: "Alkaen 6 900 ï¿½",
    longDescription:
      "Poreallas Nordic tï¿½ydentï¿½ï¿½ pihaa tai vapaa-ajan kohdetta modernilla rentoutumisratkaisulla, joka sopii laadukkaaseen kokonaisuuteen.",
    features: ["Moderni premium-ratkaisu", "Pihaan tai mï¿½kille", "Voidaan kytkeï¿½ osaksi rentoutumiskokonaisuutta"],
    fit: "Erinomainen lisï¿½ sauna- ja terassitoimituksen rinnalle.",
  },
  "nordic-sahkokiuka": {
    id: "nordic-sahkokiuka",
    name: "Nordic sï¿½hkï¿½kiuas",
    category: "Sauna",
    description: "Selkeï¿½ kiuasvaihtoehto uuteen saunaan tai saunaratkaisun tï¿½ydentï¿½miseen.",
    price: 890,
    priceLabel: "Alkaen 890 ï¿½",
    longDescription:
      "Nordic sï¿½hkï¿½kiuas on kï¿½ytï¿½nnï¿½llinen ja selkeï¿½ vaihtoehto, kun saunaan halutaan toimiva perusratkaisu ilman turhaa monimutkaisuutta.",
    features: ["Selkeï¿½ sï¿½hkï¿½kiuasratkaisu", "Sopii uuteen tai pï¿½ivitettï¿½vï¿½ï¿½n saunaan", "Voidaan yhdistï¿½ï¿½ osaksi saunatoimitusta"],
    fit: "Sopii hyvin laudesetin, valaistuksen ja saunamallien rinnalle.",
  },
  ulkovalopaketti: {
    id: "ulkovalopaketti",
    name: "Ulkovalopaketti",
    category: "Piha & terassi",
    description: "Kokonaisuus pihan, terassin ja kulkureittien valaistukseen.",
    price: 690,
    priceLabel: "Alkaen 690 ï¿½",
    longDescription:
      "Ulkovalopaketti kokoaa yhteen pihan ja terassin valaistuksen, joka tukee turvallisuutta, tunnelmaa ja kï¿½yttï¿½mukavuutta.",
    features: ["Pihaan ja terassille", "Kulkureittien valaistus", "Laajennettavissa eri kohteisiin"],
    fit: "Voidaan toimittaa osana piha- tai terassikokonaisuutta.",
  },
  "nordic-puukiuas": {
    id: "nordic-puukiuas",
    name: "Nordic puukiuas",
    category: "Sauna",
    description: "Perinteinen puukiuasratkaisu mï¿½kille, pihasaunaan ja vapaa-ajan kï¿½yttï¿½ï¿½n.",
    price: 1290,
    priceLabel: "Alkaen 1 290 ï¿½",
    longDescription:
      "Nordic puukiuas tuo saunaan perinteisen lï¿½mmitystavan ja vahvan saunatunnelman, joka sopii erityisesti mï¿½kille ja pihasaunaan.",
    features: ["Perinteinen puukiuas", "Sopii mï¿½kille ja pihasaunaan", "Toimii osana saunakokonaisuutta"],
    fit: "Sopii erityisesti Nordic Pihasauna- ja saunatupamallien rinnalle.",
  },
  "laudesuoja-viimeistelypaketti": {
    id: "laudesuoja-viimeistelypaketti",
    name: "Laudesuoja / viimeistelypaketti",
    category: "Sauna",
    description: "Viimeistelyyn ja huollettavuuteen suunniteltu paketti lauteille ja pinnoille.",
    price: 175,
    priceLabel: "Alkaen 175 ï¿½",
    longDescription:
      "Laudesuoja ja viimeistelypaketti auttaa pitï¿½mï¿½ï¿½n saunan pinnat siisteinï¿½, huollettuina ja kï¿½yttï¿½ï¿½ kestï¿½vinï¿½.",
    features: ["Lauteille ja puupinnoille", "Viimeistelyyn ja huoltoon", "Helppo lisï¿½tï¿½ osaksi saunatoimitusta"],
    fit: "Toimii lisï¿½myyntinï¿½ saunatuotteiden ja lauderatkaisujen yhteydessï¿½.",
  },
  takkapaketti: {
    id: "takkapaketti",
    name: "Takkapaketti",
    category: "Piha & mï¿½kki",
    description: "Valmis kokonaisuus mï¿½kin, pihan tai terassin tulipaikkaratkaisuun.",
    price: 1250,
    priceLabel: "Alkaen 1 250 ï¿½",
    longDescription:
      "Takkapaketti tuo pihalle, terassille tai mï¿½kille valmiin tulipaikkaratkaisun, joka tï¿½ydentï¿½ï¿½ oleskelua ja tunnelmaa.",
    features: ["Pihalle, mï¿½kille tai terassille", "Valmis lï¿½htï¿½paketti", "Tï¿½ydennettï¿½vissï¿½ lisï¿½varusteilla"],
    fit: "Voidaan yhdistï¿½ï¿½ pihan, terassin tai saunarakennuksen kokonaisuuteen.",
  },
  "nordic-ilmalampopumppu": {
    id: "nordic-ilmalampopumppu",
    name: "Nordic ilmalï¿½mpï¿½pumppu",
    category: "Piha & mï¿½kki",
    description: "Tehokas lisï¿½ mukavuuteen, yllï¿½pitolï¿½mpï¿½ï¿½n ja vapaa-ajan kohteen kï¿½yttï¿½ï¿½n ympï¿½ri vuoden.",
    price: 1590,
    priceLabel: "Alkaen 1 590 ï¿½",
    longDescription:
      "Nordic ilmalï¿½mpï¿½pumppu tuo vapaa-ajan kohteeseen tasaisempaa lï¿½mpï¿½ï¿½, yllï¿½pitolï¿½mpï¿½ï¿½ ja kï¿½yttï¿½mukavuutta ympï¿½ri vuoden.",
    features: ["Yllï¿½pitolï¿½mpï¿½ ja kï¿½yttï¿½mukavuus", "Sopii mï¿½kille ja vapaa-ajan kohteisiin", "Voidaan yhdistï¿½ï¿½ osaksi laajempaa toimitusta"],
    fit: "Sopii hyvin lisï¿½varusteeksi aitta-, saunatupa- ja mï¿½kkikï¿½yttï¿½ï¿½n suunniteltuihin kokonaisuuksiin.",
  },
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
    description: "Kompakti varastomalli pihan, mï¿½kin tai vapaa-ajan kohteen sï¿½ilytystarpeisiin.",
    overview: "Tï¿½lle mallille lisï¿½tï¿½ï¿½n myï¿½hemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Kompakti varastoratkaisu", "Sopii pihalle ja mï¿½kille", "Tï¿½ydennettï¿½vissï¿½ myï¿½hemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisï¿½tï¿½ï¿½n tï¿½hï¿½n mallikohtaisesti myï¿½hemmin.",
    backLink: "mallisto-varastot.html",
  },
  "nordic-varasto-2": {
    series: "Nordic Varastot",
    name: "Nordic Varasto 2",
    description: "Monikï¿½yttï¿½inen varastomalli silloin, kun sï¿½ilytystilaa tarvitaan hieman enemmï¿½n.",
    overview: "Tï¿½lle mallille lisï¿½tï¿½ï¿½n myï¿½hemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Monikï¿½yttï¿½inen varastoratkaisu", "Sopii piha- ja mï¿½kkikï¿½yttï¿½ï¿½n", "Tï¿½ydennettï¿½vissï¿½ myï¿½hemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisï¿½tï¿½ï¿½n tï¿½hï¿½n mallikohtaisesti myï¿½hemmin.",
    backLink: "mallisto-varastot.html",
  },
  "nordic-varasto-3": {
    series: "Nordic Varastot",
    name: "Nordic Varasto 3",
    description: "Tilavampi varastoratkaisu suurempaan sï¿½ilytystarpeeseen ja monipuolisempaan kï¿½yttï¿½ï¿½n.",
    overview: "Tï¿½lle mallille lisï¿½tï¿½ï¿½n myï¿½hemmin mallikohtaiset kuvat, pohjakuva, varustelutiedot ja tarkempi tekninen kuvaus.",
    features: ["Tilavampi varastokokonaisuus", "Sopii laajempiin sï¿½ilytystarpeisiin ja teknisiin tiloihin", "Tï¿½ydennettï¿½vissï¿½ myï¿½hemmin tarkemmilla tiedoilla"],
    note: "Kuvat, hinnat, pohjakuvat ja tarkemmat tuotetiedot lisï¿½tï¿½ï¿½n tï¿½hï¿½n mallikohtaisesti myï¿½hemmin.",
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
const LANG_KEY = "nmg-language";

const UI_COPY = {
  fi: {
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
  },
  en: {
    menuOpen: "Open menu",
    menuClose: "Close menu",
    themeNextLight: "Light",
    themeNextDark: "Dark",
    themeAria: "Switch theme to ",
    navAria: "Main navigation",
    footerNavAria: "Footer navigation",
    quoteSending: "Sending...",
    quoteSent: "Your quote request was sent successfully. We will get back to you as soon as possible.",
    contactSent: "Your message was sent successfully. We will get back to you as soon as possible.",
    sendError:
      "Sending did not succeed right now. Please try again or send your message to info@nordicmodular.fi.",
    quoteFallback: "Request a preliminary quote",
    contactFallback: "Send enquiry",
    validationName: "Please add your name.",
    validationEmail: "Please add a valid email address.",
    validationPhone: "Please add a phone number where we can reach you.",
    validationMessage: "Please tell us a little more about how we can help.",
  },
};

const normalizeCopy = (value) => value.replace(/\s+/g, " ").trim();

const getCurrentLanguage = () => (document.documentElement.lang === "en" ? "en" : "fi");

const getLanguageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("lang");
  return value === "en" || value === "fi" ? value : "";
};

const buildLanguageHref = (language) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language === "en" ? "en" : "fi");
  return url.href;
};

const getPreferredLanguage = () => {
  const languages = Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : [navigator.language];
  return languages.some((value) => String(value).toLowerCase().startsWith("fi")) ? "fi" : "en";
};

const getUiCopy = () => UI_COPY[getCurrentLanguage()] || UI_COPY.fi;

const setStoredText = (element, text) => {
  if (!element) return;
  if (element.dataset.i18nFiText === undefined) {
    element.dataset.i18nFiText = element.textContent;
  }
  element.textContent = text;
};

const setStoredHtml = (element, html) => {
  if (!element) return;
  if (element.dataset.i18nFiHtml === undefined) {
    element.dataset.i18nFiHtml = element.innerHTML;
  }
  element.innerHTML = html;
};

const setStoredAttribute = (element, attribute, value) => {
  if (!element) return;
  const datasetKey = `i18nFi${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`;
  if (element.dataset[datasetKey] === undefined) {
    element.dataset[datasetKey] = element.getAttribute(attribute) || "";
  }
  element.setAttribute(attribute, value);
};

const setStoredTitle = (value) => {
  if (!document.documentElement.dataset.i18nFiTitle) {
    document.documentElement.dataset.i18nFiTitle = document.title;
  }
  document.title = value;
};

const setStoredMetaDescription = (value) => {
  const meta = document.querySelector('meta[name="description"]');
  if (!meta) return;
  if (meta.dataset.i18nFiContent === undefined) {
    meta.dataset.i18nFiContent = meta.getAttribute("content") || "";
  }
  meta.setAttribute("content", value);
};

const restoreOriginalLanguageContent = () => {
  document.querySelectorAll("[data-i18n-fi-text]").forEach((element) => {
    element.textContent = element.dataset.i18nFiText;
  });

  document.querySelectorAll("[data-i18n-fi-html]").forEach((element) => {
    element.innerHTML = element.dataset.i18nFiHtml;
  });

  document.querySelectorAll("[data-i18n-fi-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", element.dataset.i18nFiPlaceholder);
  });

  document.querySelectorAll("[data-i18n-fi-content]").forEach((element) => {
    element.setAttribute("content", element.dataset.i18nFiContent);
  });

  if (document.documentElement.dataset.i18nFiTitle) {
    document.title = document.documentElement.dataset.i18nFiTitle;
  }
};

const setTextList = (selector, values) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (values[index] !== undefined) {
      setStoredText(element, values[index]);
    }
  });
};

const ensureContactLanguageNote = () => {
  if (document.body.dataset.page !== "yhteystiedot") return;
  const list = document.querySelector(".contact-details-grid .info-card .feature-list");
  if (!list) return;

  const noteText = "Palvelemme puhelimitse suomeksi ja sähköpostitse suomeksi sekä englanniksi.";
  const existing = Array.from(list.querySelectorAll("li")).find((item) => normalizeCopy(item.textContent) === noteText);
  if (existing) return;

  const languageNote = document.createElement("li");
  languageNote.textContent = noteText;
  const websiteItem = list.querySelector('a[href="https://www.nordicmodular.fi"]')?.closest("li");
  if (websiteItem?.nextSibling) {
    list.insertBefore(languageNote, websiteItem.nextSibling);
  } else {
    list.appendChild(languageNote);
  }
};

const applyEnglishTranslations = () => {
  const page = document.body.dataset.page;

  setStoredAttribute(document.querySelector(".brand"), "aria-label", "Nordic Modular Finland Oy");
  setStoredAttribute(document.querySelector(".brand img"), "alt", "Nordic Modular Finland Oy logo");
  setStoredAttribute(document.querySelector(".topnav"), "aria-label", UI_COPY.en.navAria);
  setStoredAttribute(document.querySelector(".footer-nav"), "aria-label", UI_COPY.en.footerNavAria);

  document.querySelectorAll(".topnav a").forEach((link) => {
    const key = link.getAttribute("data-nav");
    const labels = {
      home: "Home",
      mallisto: "Collection",
      ratkaisut: "Solutions",
      yritys: "Company",
      shop: "Shop",
      tarjous: "Quote",
      yhteystiedot: "Contact",
    };
    if (labels[key]) {
      setStoredText(link, labels[key]);
    }
  });

  document.querySelectorAll(".footer-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const labels = {
      "index.html": "Home",
      "mallisto.html": "Collection",
      "ratkaisut.html": "Solutions",
      "yritys.html": "Company",
      "shop.html": "Shop",
      "tarjous.html": "Quote",
      "yhteystiedot.html": "Contact",
    };
    if (labels[href]) {
      setStoredText(link, labels[href]);
    }
  });
  setTextList(".footer-copy", ["Ready-made space solutions for northern conditions."]);

  if (page === "home") {
    setStoredTitle("Nordic Modular Finland Oy | Home");
    setStoredMetaDescription(
      "Ready-made space solutions for northern conditions. Factory-built saunas, cabins and modular buildings for leisure use, accommodation and yard environments."
    );
    setTextList(".hero-banner-copy .eyebrow", ["Nordic Modular Finland Oy"]);
    setTextList(".hero-banner-copy h1", ["Space solutions for northern conditions."]);
    setTextList(".hero-banner .hero-lead", [
      "Factory-built saunas, cabins and modular solutions for projects that value clear procurement, high-quality execution and a functional end result.",
    ]);
    setTextList(".hero-banner .hero-actions a", ["Request a preliminary quote", "Explore the collection"]);
    setTextList(".hero-banner .hero-points li", [
      "Standardised structures",
      "Factory quality and controlled finishing",
      "A faster and clearer procurement process",
    ]);
    setTextList(".section-heading .eyebrow", ["Concept", "Procurement path", "Most popular models", "Why this works", "Next step"]);
    setTextList(".section-heading h2", [
      "High-quality building without a heavy project.",
      "How does the procurement process work?",
      "Solutions for leisure use, accommodation and yard environments.",
    ]);
    setTextList(".section-heading p", [
      "The starting point is to make procurement smoother. When the model, equipment level and delivery structure are clear from the beginning, decision-making also becomes easier.",
      "At the first stage, it is enough to know the model or the need. After that, the whole solution is refined step by step according to the project.",
      "The collection includes ready-made alternatives that make it easy to get started.",
    ]);
    setTextList(".process-grid .card-label", ["Clear start", "Controlled quality", "Practical flexibility"]);
    setTextList(".process-grid h3", [
      "Ready-made models and price level",
      "Standardised structures",
      "Options without confusion",
    ]);
    setTextList(".process-grid .story-card p:not(.card-label)", [
      "Solutions are easy to understand even before the quotation stage.",
      "Repeatable solutions support quality, dimensional accuracy and more consistent execution.",
      "Materials, equipment and finishing are selected according to the intended use of the project.",
    ]);
    setTextList(".story-grid .card-label", ["01", "02", "03", "04"]);
    setTextList(".story-grid h3", [
      "Choose a model or tell us your needs",
      "We create a preliminary solution",
      "We define the delivery scope",
      "Manufacturing and delivery",
    ]);
    setTextList(".story-grid .story-card p:not(.card-label)", [
      "Explore the collection or tell us what kind of space solution you are looking for.",
      "We review the intended use, location, equipment level and preliminary budget.",
      "We define materials, equipment, transport, foundations and possible additional work.",
      "The building is manufactured in controlled conditions and delivered according to the agreed plan.",
    ]);
    setTextList(".product-kicker", ["30 m² Grand series", "Grand series cabin", "Customisable solution", "Yard sauna model"]);
    setTextList(".product-grid h3", ["Nordic Grand Saunatupa 30", "Nordic Grand Aitta 30", "Nordic Custom", "Nordic Pihasauna"]);
    setTextList(".product-grid > article > p", [
      "A larger sauna-lounge solution for projects where more comfort, equipment and living space are needed.",
      "A more spacious cabin solution for accommodation, guest use and completing a leisure property.",
      "A customisable solution when a standard floor plan needs more freedom.",
      "A clear and high-quality yard sauna solution for a cottage, detached house yard or leisure use.",
    ]);
    setTextList(".product-grid .feature-list li", [
      "A striking model from the Grand series",
      "Sauna, living space and leisure use in one package",
      "Can be adapted to the project needs",
      "Grand series accommodation solution",
      "Suitable as additional space for a yard or cottage",
      "Can be adapted to the intended use",
      "Cabin, sauna-lounge and complete solution options",
      "Adaptable in layout and equipment level",
      "Suitable for single or broader implementations",
      "A dedicated series for yard sauna use",
      "Suitable for leisure use and yard environments",
      "Adaptable according to the project",
    ]);
    setTextList(".product-grid .price", [
      "Detailed prices will be added later",
      "Detailed prices will be added later",
      "Detailed prices will be added later",
      "Detailed prices will be added later",
    ]);
    setTextList(".product-grid .product-card-footer a", [
      "Request a preliminary quote",
      "Request a preliminary quote",
      "Request a preliminary quote",
      "Request a preliminary quote",
    ]);
    setTextList(".split-copy .eyebrow", ["Why this works"]);
    setTextList(".split-copy h2", ["A clear procurement model that still preserves quality and flexibility."]);
    setTextList(".split-copy > p", [
      "When the collection, structures and options are organised in advance, it is easier for the customer to compare alternatives and request a preliminary quote without a heavy starting phase.",
    ]);
    setTextList(".benefit-list h3", ["Standardised structures", "Built for northern conditions", "Clear quotation path", "Additional work available"]);
    setTextList(".benefit-list p", [
      "Repeatable structural solutions bring confidence to quality and delivery.",
      "Durability, energy efficiency and year-round usability are considered from the start.",
      "The product, intended use and wishes can be discussed through one form.",
      "Terraces, sauna renovations and ready-made benches can be included as part of the whole.",
    ]);
    setTextList(".cta-strip .eyebrow", ["Next step"]);
    setTextList(".cta-strip h2", ["Choose a model and request a preliminary quote for your project."]);
    setTextList(".cta-strip > div > p:last-of-type", [
      "Tell us the location of the project, intended use, the model you are interested in and your preferred schedule. We will come back with a preliminary solution and follow-up questions.",
    ]);
    setTextList(".cta-strip .hero-actions a", ["Request a preliminary quote", "Contact us"]);
  }

  if (page === "mallisto") {
    setStoredTitle("Nordic Modular Finland Oy | Collection");
    setStoredMetaDescription(
      "The Nordic Modular Finland Oy collection is based on clear base models that can be adapted to customer needs."
    );
    setTextList(".page-hero-copy .eyebrow", ["Collection"]);
    setTextList(".page-hero-copy h1", ["A ready-made collection and adaptable solutions for customer needs."]);
    setTextList(".page-hero-copy .lead", [
      "The Nordic Modular Finland Oy collection includes ready-made base models as well as adaptable solutions for different uses. The models suit yard buildings, sauna lounges, guest accommodation, cottage use and broader accommodation, storage and leisure-time projects.",
    ]);
    setTextList(".catalog-note .eyebrow", ["Note"]);
    setTextList(".catalog-note h2", ["The collection will be completed gradually."]);
    setTextList(".catalog-note p", ["Images, prices and detailed product information will be added as the collection develops."]);
    setTextList(".section-heading.narrow .eyebrow", ["Main collections"]);
    setTextList(".section-heading.narrow h2", ["A clear model series structure for different uses."]);
    setTextList(".section-heading.narrow p", ["Each main collection brings together solutions of the same size range or intended use."]);
    setTextList(".catalog-actions a", Array.from(document.querySelectorAll(".catalog-actions a")).map((_, index) => (index % 2 === 0 ? "Explore the collection" : "Request a quote")));
    const customEmphasis = document.querySelector(".model-emphasis");
    setStoredText(customEmphasis, "All our models can be adapted to customer needs.");
  }

  if (page === "ratkaisut") {
    setStoredTitle("Nordic Modular Finland Oy | Solutions");
    setStoredMetaDescription("A clear delivery model and modular solutions for leisure use, accommodation and yard environments.");
    setTextList(".page-hero-copy .eyebrow", ["Solutions"]);
    setTextList(".page-hero-copy h1", ["A clearer way to acquire a ready-made space solution."]);
    setTextList(".page-hero-copy .lead", [
      "The core of the solution is controlled execution: a ready-made starting model, clear freedom of choice and delivery that is easier to plan according to the project.",
    ]);
    setTextList(".benefit-grid h2", ["Ready-made starting models", "Controlled manufacturing", "Built for northern conditions", "Clear decision-making"]);
    setTextList(".benefit-grid p", [
      "Procurement starts from a clear model that can be refined according to the project needs.",
      "Pre-manufacturing supports quality, scheduling and control of the overall delivery.",
      "The solutions emphasise practicality, durability and year-round comfort.",
      "Materials, equipment and delivery scope are reviewed step by step without unnecessary uncertainty.",
    ]);
    setTextList(".split-copy .eyebrow", ["Use cases"]);
    setTextList(".split-copy h2", ["Solutions for leisure use, accommodation and yard environments."]);
    setTextList(".split-copy > p", [
      "The collection suits projects where a ready-made, easy-to-understand and high-quality building is wanted without a heavy design process right from the start.",
    ]);
    setTextList(".split-copy .feature-list li", [
      "Saunas and leisure use",
      "Cabins and additional accommodation",
      "Tourism and accommodation projects",
      "Adaptable solutions according to the project",
    ]);
    setTextList(".info-stack .card-label", ["For the customer", "For delivery", "For the site"]);
    setTextList(".info-stack h3", ["Easier to get started", "A more predictable whole", "Expandable according to need"]);
    setTextList(".info-stack p", [
      "When the starting point is clear, the quotation request and follow-up planning progress more calmly.",
      "Standardised solutions make it easier to agree on scope, equipment and work allocation.",
      "Terraces and other complementary work can be planned alongside the buildings separately.",
    ]);
    setTextList(".cta-strip .eyebrow", ["Next step"]);
    setTextList(".cta-strip h2", ["Tell us the site, your wishes and the schedule."]);
    setTextList(".cta-strip > div > p:last-of-type", [
      "Send us the model you are interested in, the intended use and the location of the project. We will come back with a preliminary solution and the needed clarifications.",
    ]);
    setTextList(".cta-strip .button-primary", ["Request a preliminary quote"]);
  }

  if (page === "yritys") {
    setStoredTitle("Nordic Modular Finland Oy | Company");
    setStoredMetaDescription(
      "Nordic Modular Finland Oy develops ready-made space solutions for northern conditions for leisure use, accommodation and yard environments."
    );
    setTextList(".page-hero-copy .eyebrow", ["Company"]);
    setTextList(".page-hero-copy h1", ["Nordic Modular Finland Oy develops clear space solutions for northern conditions."]);
    setTextList(".page-hero-copy .lead", [
      "The goal is to combine practical construction experience, controlled manufacturing and solutions that suit leisure use, accommodation and additional space in yard environments.",
    ]);
    setTextList(".story-grid .eyebrow", ["Concept", "How we work", "Complementary work"]);
    setTextList(".story-grid h2", ["A more ready-made starting point for the customer.", "Controlled progress.", "The same whole taken further."]);
    setTextList(".story-grid .story-card p:not(.eyebrow)", [
      "A clear collection makes it easier to start procurement and understand the options.",
      "Solutions are refined step by step according to the project, intended use and delivery scope.",
      "Alongside the buildings, terraces and other complementary construction work can also be planned.",
    ]);
    setStoredText(document.querySelector(".company-summary p"), "Nordic Modular Finland Oy develops standardised modular buildings for leisure use, yard environments, accommodation use and tailored space needs. The aim is to combine practical construction experience, the controllability of factory manufacturing and solutions suited to northern conditions.");
    setTextList(".split-copy .eyebrow", ["What we trust"]);
    setTextList(".split-copy h2", ["A clear collection, controlled delivery and practical service."]);
    setTextList(".split-copy > p", [
      "The role of the company site is above all to build trust: what we develop, what our solutions suit and how the customer can move the discussion forward.",
    ]);
    setTextList(".split-copy .feature-list li", [
      "Ready-made saunas, cabins and space solutions",
      "Possibility for adaptable solutions",
      "A starting point suited to northern conditions",
      "Practical construction understanding supporting decisions",
    ]);
    setTextList(".info-stack .card-label", ["Trust", "Suitability", "Further development"]);
    setTextList(".info-stack h3", ["No unnecessary complexity", "A solution according to the project", "From collection to larger wholes"]);
    setTextList(".info-stack p", [
      "The customer quickly understands what is available and how the discussion should begin.",
      "The models suit both private leisure use and accommodation or tourism use.",
      "Clear starting models provide a strong base also for broader deliveries and future development.",
    ]);
  }

  if (page === "tarjous") {
    setStoredTitle("Nordic Modular Finland Oy | Quote");
    setStoredMetaDescription("Fill in a preliminary quote request for Nordic Modular Finland Oy and start the discussion about your project.");
    setTextList(".page-hero-copy .eyebrow", ["Quote"]);
    setTextList(".page-hero-copy h1", ["Request a preliminary quote for your project."]);
    setTextList(".page-hero-copy .lead", [
      "Tell us which model interests you, where the project is located and your preferred schedule. We will review the request and continue from there.",
    ]);
    setTextList(".page-hero-copy > p:last-of-type", [
      "Send us the location of the project, intended use, the model you are interested in and your preferred schedule. We will come back with a preliminary solution and follow-up questions.",
    ]);
    setTextList(".form-section-heading .eyebrow", ["1. Preferred solution", "2. Contact details", "3. Additional information"]);
    setTextList(".form-section-heading h2", [
      "Choose the starting point for your quote request.",
      "Leave your contact details for our reply.",
      "Tell us your wishes in your own words.",
    ]);
    setTextList('label span', Array.from(document.querySelectorAll('form#quote-form label span')).map((_, index) => [
      "Model of interest",
      "Intended use",
      "Schedule",
      "Project location",
      "Name",
      "Email",
      "Phone",
      "Additional details",
    ][index]));
    setTextList("#product option", [
      "Nordic Compact Aitta 14",
      "Nordic Compact Saunatupa 14",
      "Nordic Compact Terassi",
      "Nordic Classic Aitta 18",
      "Nordic Classic Saunatupa 18",
      "Nordic Classic Terassi",
      "Nordic Grand Aitta 30",
      "Nordic Grand Saunatupa 30",
      "Nordic Grand Terassi",
      "Nordic Pihasauna",
      "Nordic Compact Storage 14",
      "Nordic Classic Storage 18",
      "Nordic Grand Storage 30",
      "Custom cabin",
      "Custom sauna lounge",
      "Custom accommodation or cottage project",
      "Other work or a project outside the collection",
    ]);
    setTextList("#use-case option", [
      "Leisure use",
      "Guest accommodation",
      "Tourism or accommodation use",
      "Workspace or other use",
      "Other work or a project outside the collection",
    ]);
    setTextList("#timeline option", ["As soon as possible", "Within 3–6 months", "Within 6–12 months", "Planning in progress"]);
    setStoredText(document.getElementById("product-hint"), "You can also choose work outside the current collection.");
    setStoredAttribute(document.getElementById("location"), "placeholder", "For example Lappeenranta");
    setStoredAttribute(document.getElementById("name"), "placeholder", "Your name");
    setStoredAttribute(document.getElementById("email"), "placeholder", "name@example.com");
    setStoredAttribute(document.getElementById("phone"), "placeholder", "+358...");
    setStoredAttribute(document.getElementById("details"), "placeholder", "Tell us about the site, your wishes, the equipment level, the site situation or possible additional work.");
    setTextList(".form-actions button", ["Request a preliminary quote", "Clear"]);
    setTextList(".quote-summary .eyebrow", ["Indicative estimate", "How we proceed", "Contact"]);
    setTextList(".quote-summary h3", ["A light first contact is enough to get started.", "info@nordicmodular.fi"]);
    setTextList(".quote-summary .summary-note", [
      "The price is an initial estimate. The final quote will be refined based on the delivery scope, project, transport, foundations and selected equipment.",
    ]);
    setStoredText(document.querySelector("#estimate-label"), "Nordic Compact Aitta 14. The final quote will be refined according to the project scope.");
    setTextList(".quote-summary .summary-card:nth-of-type(2) p:last-of-type", [
      "When you submit the form, the request is sent directly to info@nordicmodular.fi.",
    ]);
    setTextList(".quote-summary .summary-card:nth-of-type(3) p:last-of-type", [
      "You can also use the form to ask about projects outside the collection.",
    ]);
  }

  if (page === "yhteystiedot") {
    ensureContactLanguageNote();
    setStoredTitle("Nordic Modular Finland Oy | Contact");
    setStoredMetaDescription(
      "Contact Nordic Modular Finland Oy. Early-stage contact details, company information and contact channels on one page."
    );
    setTextList(".page-hero-copy .eyebrow", ["Contact"]);
    setTextList(".page-hero-copy h1", ["Get in touch"]);
    setTextList(".page-hero-copy .lead", [
      "We design and develop modular buildings, yard buildings and sauna solutions suited to northern conditions. Contact us if you want to discuss an upcoming project, collaboration or the development of the collection.",
      "We serve customers across Finland. You can contact the right person directly or send your quote request to the general email address. We will direct the enquiry to the right person according to the customer's needs, project location and the nature of the project.",
    ]);
    setTextList(".team-card h2", ["Teppo Herranen", "Aleksi Herranen", "Toni Herranen"]);
    setTextList(".contact-role", [
      "Administration, projects and business sales",
      "Sales, marketing and customer relations",
      "Production, technical sales and private customers",
    ]);
    setTextList(".contact-focus li", [
      "Business customers and project sites",
      "South-Eastern Finland and nationwide projects",
      "Business and private customers",
      "Uusimaa and Southern Finland",
      "Private customers and tailored projects",
      "Saunas, woodworking and technical solutions",
    ]);
    setTextList(".form-section-heading .eyebrow", ["Contact"]);
    setTextList(".form-section-heading h2", ["Send us a message directly."]);
    setTextList('form#contact-form label span', ["Name", "Email", "Phone", "Subject", "Message"]);
    setStoredAttribute(document.getElementById("contact-name"), "placeholder", "Your name");
    setStoredAttribute(document.getElementById("contact-email"), "placeholder", "name@example.com");
    setStoredAttribute(document.getElementById("contact-phone"), "placeholder", "+358...");
    setTextList("#contact-subject option", ["Quote request", "General enquiry", "Collaboration", "Collection development"]);
    setStoredAttribute(document.getElementById("contact-message"), "placeholder", "Briefly tell us about the project, your request or the reason for contacting us.");
    setTextList(".form-actions button", ["Send enquiry", "Clear"]);
    setTextList(".quote-summary .eyebrow", ["Contact", "What to tell us"]);
    setTextList(".quote-summary h2", ["info@nordicmodular.fi"]);
    setTextList(".quote-summary h3", ["A short description is enough to get started."]);
    setTextList(".quote-summary .summary-card p:last-of-type", [
      "General quote requests and enquiries are directed to the right person according to the topic, location and project type.",
      "Tell us the project location, intended use, model of interest or other request. We will come back with follow-up questions.",
    ]);
    setTextList(".contact-details-grid .info-card .eyebrow", ["Contact", "Company information"]);
    setTextList(".contact-details-grid .info-card h2", ["Getting in touch is easy", "Nordic Modular Finland Oy"]);
    setTextList(".contact-details-grid .info-card:first-of-type p", ["General quote requests and enquiries"]);
    setTextList(".contact-details-grid .info-card .feature-list li", [
      "Email: info@nordicmodular.fi",
      "Website: www.nordicmodular.fi",
      "We serve by phone in Finnish, and by email in both Finnish and English.",
      "Enquiries sent to the general email address are directed to the right person according to the customer's needs and the project location.",
      "Business ID: in establishment phase",
      "Registered office: Lappeenranta",
      "Official delivery and invoicing details will be confirmed before commercial operations begin",
    ]);
    setTextList(".info-card-emphasis .eyebrow", ["Note", "Additional services"]);
    setTextList(".info-card-emphasis h2", [
      "Pre-marketing and concept presentation use",
      "We also provide other construction-related services.",
    ]);
    setTextList(".info-card-emphasis p", [
      "The site is used for pre-marketing and concept presentation. Final delivery contents, prices and company details will be confirmed before commercial operations begin.",
      "We also carry out terraces, sauna renovations and ready-made benches. Feel free to ask and we will look at the right solution for your project at the same time.",
    ]);
  }

  if (page === "shop") {
    setStoredTitle("Nordic Modular Finland Oy | Shop");
    setStoredMetaDescription("The Nordic Modular Shop brings together quality products for sauna, yard and cottage use in one premium view.");
    setTextList(".shop-hero-copy .eyebrow", ["Nordic Modular Shop"]);
    setTextList(".shop-hero-copy h1", ["Quality products for sauna, yard and cottage life."]);
    setTextList(".shop-hero-copy .lead", [
      "A carefully selected range of benches, lighting, hot tubs and terrace products suitable both for separate purchases and as part of a broader delivery.",
    ]);
    setTextList(".shop-hero-note", ["Designed for northern conditions."]);
    setTextList(".shop-hero-copy .hero-actions a", ["Explore products", "Open order summary"]);
    setTextList(".shop-hero-panel .card-label", ["Carefully selected range"]);
    setTextList(".shop-hero-panel h2", ["Quality for sauna, yard and leisure use."]);
    setTextList(".shop-hero-panel .feature-list li", [
      "Selected products for sauna, yard and terrace",
      "A clear and high-quality range without unnecessary clutter",
      "Also suitable as part of a broader Nordic Modular delivery",
    ]);
    setTextList(".section-heading.narrow .eyebrow", ["Categories", "Featured products", "Additional selection"]);
    setTextList(".section-heading.narrow h2", [
      "Three clear product categories.",
      "Start with these popular options.",
      "Complementary products for the same whole.",
    ]);
    setTextList(".section-heading.narrow p", [
      "The range is divided so that you can quickly find suitable options for sauna, hot tubs and yard or terrace projects.",
      "The first products have been highlighted for those who want a clear starting point quickly.",
      "The rest of the range complements sauna, hot tub and yard purchases when you want to finish the whole at once.",
    ]);
    setTextList(".shop-category-card .card-label", ["Sauna", "Hot tubs & spas", "Yard & terrace"]);
    setTextList(".shop-category-card h3", ["Benches, lighting and finishing", "For outdoor relaxation", "Finished outdoor spaces"]);
    setTextList(".shop-category-card p", [
      "Solutions for atmosphere, usability and high-quality finishing.",
      "A selection of hot tubs and spas as part of a yard or cottage whole.",
      "Terraces, lighting and equipment packages for practical finishing of the yard.",
    ]);
    setTextList(".shop-card .product-kicker", Array.from(document.querySelectorAll(".shop-card .product-kicker")).map((element) => {
      const value = normalizeCopy(element.textContent);
      if (value === "Sauna") return "Sauna";
      if (value === "Paljut & porealtaat") return "Hot tubs & spas";
      if (value === "Piha & terassi") return "Yard & terrace";
      if (value === "Piha & mï¿½kki" || value === "Piha & mökki") return "Yard & cottage";
      return value;
    }));
    setTextList(".shop-card p:not(.product-kicker):not(.price)", Array.from(document.querySelectorAll(".shop-card p:not(.product-kicker):not(.price)")).map((element) => {
      const value = normalizeCopy(element.textContent);
      const map = {
        "Valmis lauderatkaisu laadukkaaseen saunaan kotona tai mï¿½killï¿½.": "A ready-made bench solution for a high-quality sauna at home or at the cottage.",
        "Tyylikï¿½s valaistuspaketti pehmeï¿½ï¿½n tunnelmaan ja kï¿½ytï¿½nnï¿½lliseen valoon.": "A stylish lighting package for soft ambience and practical light.",
        "Viimeistelty premium-ratkaisu rentoutumiseen ympï¿½ri vuoden.": "A finished premium solution for relaxation all year round.",
        "Moderni poreallas laadukkaaseen pihaan tai mï¿½kin yhteyteen.": "A modern spa for a high-quality yard or cottage setting.",
        "Selkeï¿½ kiuasvaihtoehto uuteen saunaan tai saunaratkaisun tï¿½ydentï¿½miseen.": "A clear heater option for a new sauna or to complete a sauna solution.",
        "Kokonaisuus pihan, terassin ja kulkureittien valaistukseen.": "A complete solution for lighting the yard, terrace and walkways.",
        "Perinteinen puukiuasratkaisu mï¿½kille, pihasaunaan ja vapaa-ajan kï¿½yttï¿½ï¿½n.": "A traditional wood-burning heater for a cottage, yard sauna or leisure use.",
        "Selkeï¿½ valaistus terassin reunoihin, kulkureiteille ja oleskelutilaan.": "A clear lighting solution for terrace edges, walkways and the lounge area.",
        "Ajattoman tumma valaisin viimeistelemï¿½ï¿½n kulkuvï¿½ylï¿½t ja sisï¿½ï¿½nkï¿½ynnit.": "A timeless dark luminaire to finish walkways and entrances.",
        "Matala ja huomaamaton valaisin pihan reiteille ja mï¿½kin kulkuihin.": "A low and discreet luminaire for yard paths and cottage walkways.",
        "Selkeï¿½ lï¿½htï¿½tason palju pihapiiriin ja mï¿½kkikï¿½yttï¿½ï¿½n.": "A clear entry-level hot tub for the yard or cottage use.",
        "Tehokas lisï¿½ mukavuuteen, yllï¿½pitolï¿½mpï¿½ï¿½n ja vapaa-ajan kohteen kï¿½yttï¿½ï¿½n ympï¿½ri vuoden.": "An efficient addition for comfort, maintenance heating and year-round use of a leisure property.",
        "Viimeistelyyn ja huollettavuuteen suunniteltu paketti lauteille ja pinnoille.": "A package designed for finishing and maintainability of benches and surfaces.",
        "Valmis kokonaisuus mï¿½kin, pihan tai terassin tulipaikkaratkaisuun.": "A ready-made whole for a fire feature at a cottage, yard or terrace.",
      };
      return map[value] || value;
    }));
    setTextList(".shop-card .catalog-actions a", Array.from(document.querySelectorAll(".shop-card .catalog-actions a")).map(() => "View product"));
    setTextList(".shop-card .shop-order-button", Array.from(document.querySelectorAll(".shop-card .shop-order-button")).map(() => "Order"));
  }
};

const applyLanguage = (language) => {
  const nextLanguage = language === "en" ? "en" : "fi";
  document.documentElement.lang = nextLanguage;
  restoreOriginalLanguageContent();

  const brandLink = document.querySelector(".brand");
  const brandImage = document.querySelector(".brand img");
  const topNav = document.querySelector(".topnav");
  const footerNav = document.querySelector(".footer-nav");
  const toggle = document.querySelector(".lang-toggle");

  if (brandLink) brandLink.setAttribute("aria-label", "Nordic Modular Finland Oy");
  if (brandImage) brandImage.setAttribute("alt", "Nordic Modular Finland Oy logo");
  if (topNav) topNav.setAttribute("aria-label", nextLanguage === "en" ? UI_COPY.en.navAria : UI_COPY.fi.navAria);
  if (footerNav) footerNav.setAttribute("aria-label", nextLanguage === "en" ? UI_COPY.en.footerNavAria : UI_COPY.fi.footerNavAria);
  if (toggle) toggle.setAttribute("aria-label", nextLanguage === "en" ? "Language selector" : "Kielivalinta");

  if (nextLanguage === "en") {
    applyEnglishTranslations();
  }

  const themeButton = document.querySelector(".theme-toggle");
  if (themeButton) {
    updateThemeButton(themeButton);
  }

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".topnav");
  if (menuButton) {
    setMenuButtonLabel(menuButton, Boolean(nav?.classList.contains("is-open")));
  }

  document.querySelectorAll(".lang-toggle [data-lang]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === nextLanguage);
    button.setAttribute("aria-pressed", String(button.dataset.lang === nextLanguage));
  });

  if (document.body.dataset.page === "tarjous") {
    document.getElementById("product")?.dispatchEvent(new Event("change", { bubbles: true }));
  }
};

const initLanguage = () => {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  ensureContactLanguageNote();

  const urlLanguage = getLanguageFromUrl();
  const savedLanguage = window.localStorage.getItem(LANG_KEY);
  const initialLanguage =
    urlLanguage || (savedLanguage === "fi" || savedLanguage === "en" ? savedLanguage : getPreferredLanguage());

  let actions = topbar.querySelector(".topbar-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.className = "topbar-actions";
    topbar.appendChild(actions);
  }

  let toggle = actions.querySelector(".lang-toggle");
  if (!toggle) {
    toggle = document.createElement("div");
    toggle.className = "lang-toggle";
    toggle.setAttribute("aria-label", "Language selector");
    toggle.innerHTML = `
      <a href="${buildLanguageHref("fi")}" data-lang="fi">FI</a>
      <a href="${buildLanguageHref("en")}" data-lang="en">EN</a>
    `;
    actions.prepend(toggle);
  }

  toggle.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("href", buildLanguageHref(button.dataset.lang));
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const nextLanguage = button.dataset.lang === "en" ? "en" : "fi";
      window.localStorage.setItem(LANG_KEY, nextLanguage);
      const nextHref = buildLanguageHref(nextLanguage);
      applyLanguage(nextLanguage);
      window.history.replaceState({}, "", nextHref);
      toggle.querySelectorAll("[data-lang]").forEach((link) => {
        link.setAttribute("href", buildLanguageHref(link.dataset.lang));
      });
    });
  });

  applyLanguage(initialLanguage);
};

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

const initQuoteForm = () => {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const statusEl = document.getElementById("quote-form-status");

  const validators = {
    name: (value) => (value.trim() ? "" : "Lisï¿½ï¿½ nimi."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Lisï¿½ï¿½ toimiva sï¿½hkï¿½postiosoite.",
    phone: (value) =>
      value.trim().length >= 6 ? "" : "Lisï¿½ï¿½ puhelinnumero, josta sinut tavoittaa.",
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
    if (useCase) items.push(`Kï¿½yttï¿½: ${useCase}`);
    if (timeline) items.push(`Aikataulu: ${timeline}`);
    if (location) items.push(`Sijainti: ${location}`);

    totalEl.textContent = formatEuro(total);
    labelEl.textContent =
      total > 0
        ? `${selectedProduct.dataset.label} valituilla lisï¿½varusteilla.`
        : `${selectedProduct.dataset.label}. Lopullinen tarjous tarkentuu tyï¿½n sisï¿½llï¿½n mukaan.`;
    itemsEl.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
  };

  setModelFromQuery(form);
  estimate();

  form.addEventListener("input", (event) => {
    estimate();
    resetFormStatus(statusEl);
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      validateField(event.target);
    }
  });

  form.addEventListener("change", () => {
    estimate();
    resetFormStatus(statusEl);
  });

  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      form.querySelectorAll(".has-error").forEach((field) => field.classList.remove("has-error"));
      form.querySelectorAll(".field-error").forEach((item) => {
        item.textContent = "";
      });
      resetFormStatus(statusEl);
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
    const details = form.querySelector("#details").value.trim() || "Ei lisï¿½tietoja";
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const total = totalEl.textContent;

    const selectedExtras =
      ["heatpump", "solar", "terrace", "premium"]
        .map((id) => form.querySelector(`#${id}`))
        .filter((input) => input.checked)
        .map((input) => `- ${input.parentElement.textContent.trim()}`)
        .join("\n") || "- Ei valittuja lisï¿½varusteita";

    const subject = encodeURIComponent(`Tarjouspyyntï¿½: ${selectedProduct.dataset.label}`);
    const body = encodeURIComponent(
      [
        "Hei,",
        "",
        "haluan pyytï¿½ï¿½ tarjouksen seuraavasta ratkaisusta:",
        "",
        `Malli: ${selectedProduct.dataset.label}`,
        `Suuntaa-antava arvio: ${total}`,
        `Kï¿½yttï¿½kohde: ${useCase}`,
        `Aikataulu: ${timeline}`,
        `Paikkakunta: ${location}`,
        `Tontin valmius: ${siteReady}`,
        `Muut tyï¿½t: ${otherWork}`,
        "",
        "Lisï¿½varusteet:",
        selectedExtras,
        "",
        "Lisï¿½tiedot:",
        details,
        "",
        "Yhteystiedot:",
        `Nimi: ${name}`,
        `Sï¿½hkï¿½posti: ${email}`,
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
    const details = form.querySelector("#details").value.trim() || (getCurrentLanguage() === "en" ? "No additional information" : "Ei lisatietoja");
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

    // TODO: Korvaa tï¿½mï¿½ mailto-varalogiikka julkaisuversiossa palvelinlahetyksella.
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
      console.error("Tarjouslomakkeen lahetys epaonnistui", error);
      setFormStatus(statusEl, "error", getUiCopy().sendError);
      return;
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonLabel;
      }
    }

    const subject = encodeURIComponent(`Tarjouspyynto: ${selectedProduct.dataset.label}`);
    const body = encodeURIComponent(
      [
        "Hei,",
        "",
        "haluan pyytï¿½ï¿½ alustavan tarjouksen seuraavasta ratkaisusta:",
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
      console.error("Yhteydenottolomakkeen lahetys epaonnistui", error);
      setFormStatus(statusEl, "error", getUiCopy().sendError);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonLabel;
      }
    }
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
    name: (value) => (value.trim() ? "" : "Lisï¿½ï¿½ nimi."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Lisï¿½ï¿½ toimiva sï¿½hkï¿½postiosoite.",
    phone: (value) =>
      value.trim().length >= 6 ? "" : "Lisï¿½ï¿½ puhelinnumero, josta sinut tavoittaa.",
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
      labelEl.textContent = "Valitse tuotteita shopista, niin yhteenveto pï¿½ivittyy tï¿½hï¿½n.";
      summaryItemsEl.innerHTML = "<li>Tilaukseen ei ole lisï¿½tty tuotteita</li>";
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
          <span>Mï¿½ï¿½rï¿½</span>
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
      .map((item) => `<li>${item.name} x ${item.quantity} ï¿½ ${formatEuro(item.price * item.quantity)}</li>`)
      .concat(`<li>Toimitus ï¿½ ${deliveryMethod} ï¿½ ${formatEuro(deliveryPrice)}</li>`)
      .join("");
    if (deliverySummaryEl) {
      deliverySummaryEl.textContent = `Vï¿½lisumma ${formatEuro(subtotal)} + toimitus ${formatEuro(deliveryPrice)}.`;
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
    window.alert(`Valittu maksutapa: ${selectedPaymentMethod}. Maksuvaihe vahvistetaan tilauskï¿½sittelyn yhteydessï¿½.`);
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
    const details = form.querySelector("#order-details").value.trim() || "Ei lisï¿½tietoja";

    const orderLines = cartItems.map(
      (item) =>
        `- ${item.name} | mï¿½ï¿½rï¿½ ${item.quantity} | ï¿½ ${formatEuro(item.price)} | yhteensï¿½ ${formatEuro(
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
        "haluan tehdï¿½ tilauksen Nordic Modular Shopista.",
        "",
        "Valitut tuotteet:",
        ...orderLines,
        "",
        `Vï¿½lisumma: ${formatEuro(subtotal)}`,
        `Toimitus: ${deliveryMethod} / ${formatEuro(deliveryPrice)}`,
        `Yhteensï¿½: ${formatEuro(total)}`,
        "",
        `Maksutapa: ${paymentMethod}`,
        "Maksutapa vahvistetaan tilauskï¿½sittelyn yhteydessï¿½.",
        "",
        "Toimitus ja lisï¿½tiedot:",
        `Toimitustapa: ${deliveryMethod}`,
        `Paikkakunta: ${deliveryCity}`,
        `Aikataulu: ${deliveryTimeline}`,
        `Lisï¿½palvelut: ${orderService}`,
        "",
        "Lisï¿½tiedot:",
        details,
        "",
        "Yhteystiedot:",
        `Nimi: ${name}`,
        `Sï¿½hkï¿½posti: ${email}`,
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
  if (fitEl) fitEl.textContent = product.fit || "Tuote voidaan toimittaa myï¿½s osana laajempaa kokonaisuutta.";
  if (placeholderEl) placeholderEl.textContent = `${product.category} / Nordic Modular Shop`;

  if (featuresEl) {
    const features = Array.isArray(product.features) && product.features.length ? product.features : ["Lisï¿½ï¿½ tï¿½hï¿½n tuotteen tï¿½rkeimmï¿½t ominaisuudet."];
    featuresEl.innerHTML = features.map((feature) => `<li>${feature}</li>`).join("");
  }

  document.title = `Nordic Modular Finland Oy | ${product.name}`;

  orderButton.addEventListener("click", () => {
    addProductToCart(product.id);
    window.location.href = "tilaus.html";
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
initLanguage();
normalizeOfferCopy();
initPrelaunchVisibility();
setActiveNav();
initMenu();
initReveal();
initSimpleQuoteForm();
initContactForm();
initShopButtons();
initOrderForm();
initProductDetail();
initModelDetail();


