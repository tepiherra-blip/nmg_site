# Nordic Modular – muutokset ja tarkistukset 8.10.2026

Muutokset on tehty paikalliseen sivustoprojektiin. Tuotekuvia ei generoitu eikä muutettu, mallirakenteita ja hintoja ei muutettu. Henkilökuvat ja logot jäivät ennalleen.

## Kokotiedot

Kokotiedot näkyvät tuotesivun otsikon alla ja mallisarjan tuotekorteissa. Nimitys on **pohja-ala noin**, joka tarkoittaa tässä mittakuvan ulkomitoista laskettua suorakulmaista alaa, ei viranomaisen vahvistamaa kerrosalaa tai sisäpinta-alaa. Ulkomitat näytetään samalla rivillä. Arvot pyöristetään yhden desimaalin tarkkuuteen tai kokonaislukuun Classicin käyttäjän ilmoittaman 20 m²:n mukaisesti.

| Malli | Ulkomitat mittakuvassa | Tarkka tulo | Sivulla |
|---|---|---|---|
| Compact Aitta | 5,50 × 2,85 m | 15,675 m² | noin 15,7 m² |
| Compact Sauna | 5,50 × 2,85 m | 15,675 m² | noin 15,7 m² |
| Classic Aitta | 7,00 × 2,85 m | 19,95 m² | noin 20 m² |
| Classic Saunatupa | 7,00 × 2,85 m | 19,95 m² | noin 20 m² |
| Grand Aitta | 9,00 × 3,30 m | 29,7 m² | noin 29,7 m² |
| Grand Saunatupa | 9,00 × 3,30 m | 29,7 m² | noin 29,7 m² |
| Pihasauna | 3,10 × 3,30 m | 10,23 m² | noin 10,2 m² |

Grandin vanhoissa kuvissa on myös 3,40 m leveys. Nykyisen mallikirjaston käyttämissä päivitettyissä pohjakuvissa leveys on 3,30 m; käyttäjä vahvisti tämän. Aiemmin annettu 29,8 m² ei vastaa näiden ulkomittojen tuloa. Kuvia ei korjattu. Jos 29,8 m² tarkoittaa muuta laskentatapaa, se on vahvistettava erikseen. Mallinimi Grand 30 säilyi.

Kerrosala, rakennustilavuus ja lopullisen toimituksen hyväksytyt mitat eivät selviä projektin aineistosta luotettavasti. Niitä ei esitetä vahvistettuina. Customin koko suunnitellaan erikseen. Patio-varianttien nykyiset koot ja hinnat säilyivät.

## Rakentamislupa

Sivulle lisättiin ehdollinen teksti: muu kuin asuinrakennus voi soveltua rakentamiseen ilman rakentamislupaa, kun pinta-ala on alle 30 m² ja tilavuus alle 120 m³. Käyttötarkoitus, varustelu ja rakennuspaikan edellytykset on varmistettava rakennusvalvonnasta. Koska rakennustilavuuksia ei ole aineistossa, yhdenkään mallin luvasta vapautta ei luvata.

Asuinrakennus tarvitsee luvan koosta riippumatta. Varustelu, kuten ruoanlaittomahdollisuudet, voi vaikuttaa rakennuksen käyttötarkoituksen arviointiin. Yhdistettyjen moduulien lupatarve arvioidaan koko rakennuksesta; yksittäisen moduulin pinta-ala ei vapauta kokonaisuutta. Myös rakennusoikeus, kaava, rakennusjärjestys, ranta-alue ja turvallisuusvaatimukset on huomioitava.

Tarkistus perustuu [Ympäristöministeriön ajantasaiseen rakentamislakiohjeeseen](https://ym.fi/rakentamislaki), [rakentamislakiin 751/2023](https://www.finlex.fi/fi/lainsaadanto/2023/751), [muutoslakiin 897/2024](https://finlex.fi/fi/lainsaadanto/saadoskokoelma/2024/897) ja [Helsingin rakennusvalvonnan ohjeeseen](https://www.hel.fi/static/rakvv/ohjeet/Piharakennukset_ja_rakennelmat.pdf). Finlexin ajantasainen 42 § tarkistettiin myös selaimella, koska verkkolukija ei ladannut säädöstekstiä. Pinta-ala- ja tilavuusrajat sekä asuinrakennuksen luvanvaraisuus vastaavat ministeriön ohjetta. Kunnan paikallista ohjetta ei yleistetty koko Suomen sijoittamismääräyksiksi.

## Paluu ja muut mallit

Tuotesivun alkuun ja loppuun lisättiin suorat paluulinkit. Sarjasivujen tuotekorteilla on ankkurit, jotta paluu osuu kyseiseen korttiin. Linkit toimivat myös ilman aiempaa selaushistoriaa. Lopussa on kolme olemassa olevaa mallia kuvallisina kortteina. Avoin malli ei suosittele itseään. Customille lisättiin oma paluu ja muiden mallien kortit.

## Uutiskirje

Mustan välilehden syy oli lomakkeen suora POST MailerLiten tekniseen JSONP-osoitteeseen, kun vastauksen käsittelevä upotuskoodi puuttui. Lähetys muutettiin MailerLiten julkisen webforms-kirjaston käyttämäksi JSONP-menettelyksi: sama tilausosoite, fields[email], ml-submit, anticsrf sekä ajax=1, guid ja mlWebformSubmitted-vastauskäsittelijä. Uutta ikkunaa ei avata.

Kiitosnäkymä tulee vain palvelun myönteisen onnistumisvastauksen jälkeen. Käyttäjä vahvisti sähköpostivahvistuksen olevan käytössä; näkymä pyytää vahvistamaan tilauksen sähköpostista. Tunnettu hylkäys näyttää virheen ja sallii korjauksen. Aikakatkaisussa vastaanotto jää epävarmaksi: sivu ei näytä onnistumista eikä lähetä automaattisesti uudestaan. Lähetyslukitus estää kaksoisklikkauksen aiheuttamat duplikaatit.

MailerLiten hallintatilille ei ollut pääsyä. Sähköpostivahvistuksen asetusta ei muutettu eikä vahvistussähköpostin toimitusta testattu oikealla tilaajalla. Selaintestit käyttivät simuloitua palveluvastausta; tilaajien tallennusosoite ja lomaketunnus säilyivät. [MailerLiten lomakeohje](https://www.mailerlite.com/help/how-to-create-an-embedded-form) ja käyttäjän alkuperäinen upotuskoodi ovat toteutuksen lähteet.

## Kuvamerkinnät

Käyttäjä vahvisti 8.10.2026 kaikkien rakennusten ulko- ja sisäkuvien AI-alkuperän. Näihin lisättiin näkyvä ”AI-avusteinen havainnekuva” -teksti. Kuvaan liittyvä lisävarusteväite jätettiin pois, koska jokaisen kuvan lisävarustesisältöä ei ole vahvistettu.

Tavallinen ilman tekoälyä tehty 3D-renderöinti ei ole tällä perusteella AI-sisältöä. AI:lla luodun havainnekuvan sekä AI:lla muokatun valokuvan osalta näkyvä ilmoitus on velvoittava, jos sisältö täyttää syväväärennöksen määritelmän: todellisuutta muistuttava ja aidolta vaikuttava sisältö. Pelkkä tavallinen värisäätö ei itsessään ole tällainen tekoälymuokkaus. Tässä fotorealistisiksi esitettyjen rakennuskuvien merkintä on perusteltu tulkinta; myös kuluttajamarkkinoinnin kokonaisvaikutelman täytyy olla totuudenmukainen.

Avoimuusvelvoitteita sovelletaan 2.8.2026 alkaen. Suomen viranomaisohjeen mukaan aiempaa sisältöä ei tarvitse merkitä takautuvasti. Kuvakohtaisia tuotanto- ja julkaisupäiviä ei ole varmennettu. Merkinnät lisättiin kaikkiin käyttäjän vahvistamiin rakennuskuviin yhtenäisenä läpinäkyvyyttä tukevana käytäntönä, ei väitteenä siitä, että jokaisella vanhalla renderöinnillä olisi automaattinen takautuva merkintävelvollisuus.

Lähteet: [Traficomin ohje](https://traficom.fi/fi/tekoalyn-saantely/milloin-tekoalyn-kaytosta-pitaa-kertoa), [komission artikla 50 -ohje](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations), [artikla 50](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50), [KKV:n ohje markkinoinnin harhaanjohtavuudesta](https://www.kkv.fi/kuluttaja-asiat/markkinointi-alennukset-ja-hinnan-ilmoittaminen/markkinointi-ja-menettely-asiakassuhteessa/harhaanjohtavuus-markkinoinnissa-ja-asiakassuhteessa/).

Alkuperältään tarkistettavat: assets/mallisto/Terassi/-kansion kuvat, mukaan lukien patio-6m2-20261004.png, patio-9m2-20261004.png, patio-16m2-20261004.png, patio-custom-20261004.png, patio-kansikuva-20261004.png ja patio-runko-20261004.png; kalustetoimittajan kuva assets/carlo-casagrande-keittiokalusteet.png. Näitä ei oletettu AI-kuviksi rakennuskuvia koskevan vahvistuksen perusteella. Mittakuvat, logot ja henkilökuvat jätettiin ilman AI-merkintää.

## Tekstit ja testaus

Ratkaisut-sivulle lisättiin annettu teksti moduuleja yhdistämällä syntyvistä omakotitaloista ja suuremmista mökkikokonaisuuksista. Custom-sivulle lisättiin käyttäjän täydentämän tekstin mukainen osio.

Kaikki kahdeksan mallinäkymää ja muut varsinaiset HTML-sivut testattiin Edge-selaimella 390 ja 1440 pikselin leveydellä. Näkyvissä kuvissa, syöttökentissä ja painikkeissa ei ollut sivurajan ylityksiä. Mallisivujen kokotiedot, paluulinkit, suositusten omaviittauksen puuttuminen ja JavaScript-virheettömyys tarkistettiin. Uutiskirjeestä testattiin onnistuminen, virhe, vaadittu suostumus, kaksoisklikkaus ja uuden ikkunan puuttuminen simuloidulla palveluvastauksella. Tuotekuvien AI-merkinnät tarkistettiin ja henkilökuvien merkintöjen puuttuminen varmistettiin.