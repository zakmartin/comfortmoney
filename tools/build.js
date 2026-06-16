/* Comfort Money – generátor statických stránek.
   Spuštění: npm run generate  (node tools/build.js)
   Bere sdílený layout (tools/layout.js) + obsah níže a zapisuje do public/. */
'use strict';

const fs = require('fs');
const path = require('path');
const { SITE, APPLY_URL, applyBtn, icon, page, consolidationCalc, loanCalc, calcTabs, productCalcCard, calcSection, ceoQuote, faqSection, contactSection } = require('./layout');

const PUBLIC = path.join(__dirname, '..', 'public');

function write(slug, html) {
  const dir = slug ? path.join(PUBLIC, slug) : PUBLIC;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('  ✓ /' + (slug ? slug + '/' : ''));
}
function writeRaw(file, content) {
  fs.writeFileSync(path.join(PUBLIC, file), content, 'utf8');
  console.log('  ✓ /' + file);
}

/* ===========================================================
   OPAKOVANÉ STAVEBNÍ PRVKY
   =========================================================== */
const check = `<span class="cm-check">${icon.check}</span>`;

function steps() {
  return `<ol class="cm-steps cm-steps--timeline">
      <li class="cm-step" data-reveal>
        <span class="cm-step__num">1</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Nezávazná poptávka</h3>
          <p class="cm-step__text">Necháte nám kontakt a pár vět o situaci. Zdarma a bez závazku.</p>
        </div>
      </li>
      <li class="cm-step cm-step--highlight" data-reveal>
        <span class="cm-step__num">2</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Vyjednáme nejlepší podmínky</h3>
          <p class="cm-step__text">Projdeme vaše závazky a vyjednáme s vašimi věřiteli nejlepší podmínky pro ukončení půjčky.</p>
        </div>
      </li>
      <li class="cm-step" data-reveal>
        <span class="cm-step__num">3</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Návrh férového řešení</h3>
          <p class="cm-step__text">Srozumitelný návrh: splátka, sazba, RPSN i poplatky otevřeně.</p>
        </div>
      </li>
      <li class="cm-step" data-reveal>
        <span class="cm-step__num">4</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Jedna nižší splátka</h3>
          <p class="cm-step__text">Místo více splátek platíte jednu, nižší. Klid a přehled.</p>
        </div>
      </li>
    </ol>
    <div class="cm-diff" data-reveal>
      <h3 class="cm-diff__title">V čem se lišíme od jiných nebankovních společností?</h3>
      <div class="cm-diff__rows">
        <div class="cm-diff__row cm-diff__row--them">
          <span class="cm-diff__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span>
          <div><strong>Běžná nebankovní společnost</strong><span>Jen vám půjčí peníze na splacení dluhů. Vyřešíte to, ale často dráž a vše musíte vyjednat s věřiteli sami.</span></div>
        </div>
        <div class="cm-diff__row cm-diff__row--us">
          <span class="cm-diff__free">Zdarma</span>
          <span class="cm-diff__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
          <div><strong>Comfort Money</strong><span>Navíc s vašimi věřiteli vyjednáme snížení celkové dlužné částky, a to zdarma. Díky tomu potřebujete nižší úvěr a celkově zaplatíte méně.</span></div>
        </div>
      </div>
    </div>
`;
}

/* kroky pro úvěr (spotřebitelský / podnikatelský) – bez porovnání, jiný postup */
function loanSteps() {
  return `<ol class="cm-steps cm-steps--timeline">
      <li class="cm-step" data-reveal>
        <span class="cm-step__num">1</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Žádost</h3>
          <p class="cm-step__text">Podáte žádost online nebo přes nás. Zdarma a nezávazně.</p>
        </div>
      </li>
      <li class="cm-step" data-reveal>
        <span class="cm-step__num">2</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Vyřízení</h3>
          <p class="cm-step__text">Posoudíme vaši situaci a možnosti zajištění nemovitostí.</p>
        </div>
      </li>
      <li class="cm-step" data-reveal>
        <span class="cm-step__num">3</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Návrh řešení</h3>
          <p class="cm-step__text">Dostanete srozumitelný návrh: výše úvěru, splátka, sazba, RPSN i poplatky.</p>
        </div>
      </li>
      <li class="cm-step" data-reveal>
        <span class="cm-step__num">4</span>
        <div class="cm-step__content">
          <h3 class="cm-step__title">Peníze na účtě</h3>
          <p class="cm-step__text">Po podpisu smlouvy pošleme peníze přímo na váš účet.</p>
        </div>
      </li>
    </ol>`;
}

/* příběhy klientů – ILUSTRATIVNÍ, bez skutečných osobních údajů */
const STORY_DISCLAIMER = `<p class="cm-disclaimer">${icon.info} Uvedené případy jsou <strong>ilustrativní</strong> a slouží k vysvětlení našeho postupu. Neobsahují skutečné osobní údaje klientů.</p>`;

const STORIES = [
  {
    name: 'Václav O.', loc: 'Beroun', product: 'Sloučení dluhů', href: '/konsolidace-zavazku/',
    situation: 'Devět půjček a kreditních karet, dohromady <strong>11 590 Kč měsíčně</strong>. Splátky přerůstaly přes hlavu a začínala dluhová spirála.',
    solution: 'Všechny závazky jsme sloučili do jedné splátky s delší splatností. Místo devíti termínů řeší jediný přehledný úvěr.',
    big: 'Ušetří 4 210 Kč měsíčně', sub: 'nová splátka 7 380 Kč místo 11 590 Kč',
  },
  {
    name: 'Aleš M.', loc: 'Zlín', product: 'Sloučení dluhů', href: '/konsolidace-zavazku/',
    situation: 'Několik závazků za <strong>16 400 Kč měsíčně</strong>, které postupně přestávaly být únosné.',
    solution: 'Sloučili jsme je do úvěru zajištěného nemovitostí a prodloužili splatnost. O střechu nad hlavou nepřišel, slouží jen jako zajištění.',
    big: 'Ušetří 6 550 Kč měsíčně', sub: 'nová splátka 9 850 Kč a klid na rozpočet',
  },
  {
    name: 'Kamila V.', loc: 'Olomouc', product: 'Podnikatelský úvěr', href: '/podnikatelsky-uver/',
    situation: 'Rodinné firmě banka zamítla financování kvůli dočasně zápornému cashflow.',
    solution: 'Posoudili jsme reálnou situaci firmy, ne jen výkazy, a financování schválili.',
    big: 'Peníze do 4 pracovních dnů', sub: 'splátka nastavená i na slabší měsíce',
  },
];

function storyCards(limit) {
  const list = limit ? STORIES.slice(0, limit) : STORIES;
  return `<div class="cm-stories cm-stories--cases">
      ${list.map((s) => `<article class="cm-story cm-story--case">
        <div class="cm-story__head"><span class="cm-story__name">${s.name}</span><span class="cm-story__loc">${s.loc}</span></div>
        <div class="cm-story__block">
          <span class="cm-story__label">Situace klienta</span>
          <p>${s.situation}</p>
        </div>
        <div class="cm-story__block">
          <span class="cm-story__label">Jak jsme to vyřešili</span>
          <p>${s.solution}</p>
        </div>
        <div class="cm-story__outcome">
          <p class="cm-story__big">${s.big}</p>
          <p class="cm-story__sub">${s.sub}</p>
        </div>
        <a class="cm-btn cm-btn--primary cm-btn--sm" href="${s.href}">${s.product} ${icon.arrow}</a>
      </article>`).join('\n      ')}
    </div>`;
}

/* ===========================================================
   HOMEPAGE
   =========================================================== */
const homeFaq = [
  { q: 'Co se stane, když přestanu splácet?', a: 'Ozvěte se nám co nejdřív – řešení existuje téměř vždy. Společně hledáme úpravu, která je pro vás únosná. Úvěr je zajištěný nemovitostí, takže její využití přichází v úvahu až jako krajní možnost po vyčerpání ostatních cest; naším cílem je tomu předejít.' },
  { q: 'Přijdu o nemovitost?', a: 'Naším cílem není prodej vaší nemovitosti, ale dlouhodobě udržitelné splácení. Nemovitost slouží jako zajištění úvěru. Pokud řešíte potíže se splácením, ozvěte se – čím dřív, tím víc možností máme.' },
  { q: 'Kolik mě to celkem stojí?', a: 'Vše vám ukážeme předem a srozumitelně: úrokovou sazbu, RPSN, výši splátky i poplatky (např. za sjednání). Žádné skryté poplatky. Reprezentativní příklad najdete v patičce webu.' },
  { q: 'Jak dlouho to trvá?', a: 'Záměrně neslibujeme „peníze ihned“. Upřednostňujeme pečlivé a férové posouzení vaší situace. Délka závisí na konkrétním případu; provedeme vás každým krokem.' },
  { q: 'Pomůžete i mně, když mě odmítla banka?', a: 'Ano. Jako nebankovní poskytovatel s licencí ČNB se specializujeme i na situace, které banka odmítla kvůli bonitě. Posuzujeme individuálně.' },
  { q: 'Co je to vyjednání nižšího vyčíslení dluhů?', a: 'U vašich věřitelů aktivně vyjednáváme o nižší celkové částce k doplacení. To je něco, co běžná nebankovka nedělá – a může znamenat, že na konsolidaci potřebujete nižší úvěr.' },
];

const homeJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Comfort Money s.r.o.',
  url: SITE + '/',
  telephone: '+420800314314',
  email: 'info@comfortmoney.cz',
  areaServed: 'CZ',
  currenciesAccepted: 'CZK',
  address: { '@type': 'PostalAddress', streetAddress: 'Vinohradská 2828/151', postalCode: '130 00', addressLocality: 'Praha 3', addressCountry: 'CZ' },
  openingHours: 'Mo-Fr 09:00-17:00',
  parentOrganization: { '@type': 'Organization', name: 'Comfort Finance Group', url: 'https://www.cfg.cz' },
  description: 'Nebankovní poskytovatel úvěrů zajištěných nemovitostí s licencí ČNB. Sloučení dluhů a zajištěné spotřebitelské i podnikatelské úvěry.',
});

const homeMain = `    <section class="cm-hero cm-hero--home" id="kalkulacka">
      <div class="cm-container">
        <div class="cm-hero__grid">
          <div class="cm-hero__col-text">
            <p class="cm-hero__kicker">Sloučíme vaše dluhy do jedné nižší splátky</p>
            <h1 class="cm-hero__title">Snižte si měsíční splátku až o <em>60&nbsp;%</em></h1>
            <p class="cm-hero__sub">Pomáháme i lidem, které banka odmítla. Férově a s individuálním přístupem a vše ZDARMA.</p>
            <div class="cm-hero__cta">
              ${applyBtn('cm-btn--primary')}
              <a class="cm-btn cm-btn--ghost-dark" href="#kontakt">Nezávazná konzultace zdarma</a>
            </div>
            <p class="cm-hero__reassure">${icon.check} Nezávazné a zdarma · ozveme se obvykle do 1 pracovního dne</p>
            <ul class="cm-hero__facts">
              <li>Licence ČNB</li>
              <li>Na trhu od 2012</li>
              <li>Splatnost až 30 let</li>
              <li>Bez poplatků předem</li>
            </ul>
          </div>
          <div class="cm-hero__col-calc">
            ${calcTabs()}
          </div>
        </div>
      </div>
    </section>

    <section class="cm-section" id="jak-to-funguje">
      <div class="cm-container">
        <span class="cm-eyebrow">Jak funguje sloučení dluhů</span>
        <h2 class="cm-h2">Sloučení dluhů ve čtyřech krocích</h2>
        <p class="cm-lead">Z více splátek uděláme jednu nižší. Provedeme vás celým sloučením vašich dluhů pečlivě a bez spěchu.</p>
        ${steps()}
      </div>
    </section>

    <section class="cm-section" id="reference" style="padding-top:96px;border-top:1px solid var(--cm-line)">
      <div class="cm-container">
        <span class="cm-eyebrow">Příběhy klientů</span>
        <h2 class="cm-h2">Reálné situace, udržitelná řešení</h2>
        ${STORY_DISCLAIMER}
        ${storyCards()}
      </div>
    </section>

    <section class="cm-section" id="produkty">
      <div class="cm-container">
        <div class="cm-products__head">
          <h2 class="cm-h2">Naše produkty</h2>
          <p class="cm-lead">Všechny naše úvěry jsou zajištěné nemovitostí, od 100 000 do 10 000 000 Kč se splatností až 30 let. Vyberte si podle své situace.</p>
        </div>
        <div class="cm-products">
          <article class="cm-product cm-product--card">
            <span class="cm-product__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="m8 6 4-4 4 4"/><path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22"/><path d="m20 22-5-5"/></svg></span>
            <div class="cm-product__body">
              <h3 class="cm-product__title"><a class="cm-product__link" href="/konsolidace-zavazku/">Sloučení dluhů</a></h3>
              <p class="cm-product__desc">Sloučíme víc splátek do jedné nižší. S věřiteli navíc vyjednáme nižší dluh a ZDARMA.</p>
              <span class="cm-product__meta">Cesta z více splátek ven</span>
            </div>
            <div class="cm-product__actions">
              <a class="cm-btn cm-btn--ghost-dark" href="/konsolidace-zavazku/">Spočítat</a>
              ${applyBtn('cm-btn--primary', 'Podat žádost')}
            </div>
          </article>
          <article class="cm-product cm-product--card">
            <span class="cm-product__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></span>
            <div class="cm-product__body">
              <h3 class="cm-product__title"><a class="cm-product__link" href="/zajisteny-uver/">Spotřebitelský úvěr</a></h3>
              <p class="cm-product__desc">Peníze na cokoli potřebujete řešit, zajištěné vaší nemovitostí.</p>
              <span class="cm-product__meta">100 000 – 10 mil. Kč · až 30 let</span>
            </div>
            <div class="cm-product__actions">
              <a class="cm-btn cm-btn--ghost-dark" href="/zajisteny-uver/">Spočítat</a>
              ${applyBtn('cm-btn--primary', 'Podat žádost')}
            </div>
          </article>
          <article class="cm-product cm-product--card">
            <span class="cm-product__icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><rect width="20" height="14" x="2" y="6" rx="2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><path d="M12 12h.01"/></svg></span>
            <div class="cm-product__body">
              <h3 class="cm-product__title"><a class="cm-product__link" href="/podnikatelsky-uver/">Podnikatelský úvěr</a></h3>
              <p class="cm-product__desc">Financování pro podnikání, na které banka nemá čas.</p>
              <span class="cm-product__meta">Zakázka · cashflow · rozvoj</span>
            </div>
            <div class="cm-product__actions">
              <a class="cm-btn cm-btn--ghost-dark" href="/podnikatelsky-uver/">Spočítat</a>
              ${applyBtn('cm-btn--primary', 'Podat žádost')}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="cm-section" id="proc-my">
      <div class="cm-container">
        <span class="cm-eyebrow">Proč Comfort Money</span>
        <h2 class="cm-h2">Férový partner, ne rychlá půjčka</h2>
        <div class="cm-why cm-why--light">
          <div class="cm-why__item">
            <span class="cm-why__icon"><svg class="icon" viewBox="0 0 24 24"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg></span>
            <h3>Vyjednáme s věřiteli</h3><p>Aktivně jednáme s vašimi věřiteli o nižší částce k doplacení. To běžná nebankovka nedělá.</p>
          </div>
          <div class="cm-why__item">
            <span class="cm-why__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></span>
            <h3>Transparentnost</h3><p>Sazbu, RPSN i poplatky ukazujeme předem a srozumitelně. Žádná překvapení.</p>
          </div>
          <div class="cm-why__item">
            <span class="cm-why__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></span>
            <h3>Individuální přístup</h3><p>Posuzujeme každou situaci zvlášť. Cílem není vás předlužit, ale najít únosné řešení.</p>
          </div>
          <div class="cm-why__item">
            <span class="cm-why__icon"><svg class="icon" viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg></span>
            <h3>Licence ČNB</h3><p>Jsme licencovaný nebankovní poskytovatel pod dohledem České národní banky.</p>
          </div>
        </div>
      </div>
    </section>

    ${ceoQuote()}

    ${faqSection(homeFaq)}

    ${contactSection('obecne')}`;

/* ===========================================================
   PRODUKT: KONSOLIDACE
   =========================================================== */
const konsolidaceMain = `    <section class="cm-hero cm-hero--home" id="kalkulacka">
      <div class="cm-container">
        <div class="cm-hero__grid">
          <div class="cm-hero__col-text">
            <p class="cm-hero__kicker">Více úvěrů, kreditek a splátek najednou?</p>
            <h1 class="cm-hero__title">Sloučení dluhů</h1>
            <p class="cm-hero__sub">Sloučíme vaše dluhy do jednoho zajištěného úvěru s nižší splátkou a pomůžeme vám se znovu nadechnout.</p>
            <div class="cm-hero__cta">
              ${applyBtn('cm-btn--primary')}
              <a class="cm-btn cm-btn--ghost-dark" href="#kontakt">Nezávazná konzultace</a>
            </div>
            <p class="cm-hero__reassure">${icon.check} Licence ČNB · jednáme s věřiteli · bez poplatků předem</p>
          </div>
          <div class="cm-hero__col-calc">
            ${productCalcCard('konsolidace')}
          </div>
        </div>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container">
        <span class="cm-eyebrow">Jak to funguje</span>
        <h2 class="cm-h2">Náš postup krok po kroku</h2>
        ${steps()}
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container">
        <span class="cm-eyebrow">Co získáte</span>
        <h2 class="cm-h2">Výhody konsolidace u nás</h2>
        <div class="cm-why cm-why--light">
          <div class="cm-why__item"><h3>Nižší měsíční splátka</h3><p>Jedna splátka místo mnoha – typicky výrazně nižší než součet těch současných.</p></div>
          <div class="cm-why__item"><h3>Vyjednání s věřiteli</h3><p>Aktivně jednáme o nižším vyčíslení vašich dluhů. To jinde nenajdete.</p></div>
          <div class="cm-why__item"><h3>Splatnost až 30 let</h3><p>Délku splatnosti přizpůsobíme tomu, co dlouhodobě unesete.</p></div>
          <div class="cm-why__item"><h3>Transparentní podmínky</h3><p>Sazba, RPSN a poplatky předem a srozumitelně.</p></div>
        </div>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container cm-container--narrow">
        <span class="cm-eyebrow">Transparentnost</span>
        <h2 class="cm-h2">Otevřeně o nákladech</h2>
        <p class="cm-lead">U úvěru zajištěného nemovitostí existují poplatky (např. za sjednání). Žádné z nich nejsou skryté. Reprezentativní příklad a RPSN najdete v patičce a vždy je uvedeme i ve vašem konkrétním návrhu.</p>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container">
        <span class="cm-eyebrow">Příběh klienta</span>
        <h2 class="cm-h2">Jak konsolidace pomohla</h2>
        ${STORY_DISCLAIMER}
        <div class="cm-stories">
          <article class="cm-story cm-story--feature">
            <div class="cm-story__head"><span class="cm-story__name">Václav O.</span><span class="cm-story__loc">Beroun</span></div>
            <p class="cm-story__problem"><strong>Problém:</strong> 9 menších půjček a kreditek, dluhová spirála.</p>
            <p class="cm-story__solution"><strong>Řešení:</strong> Konsolidace do jednoho zajištěného úvěru.</p>
            <table class="cm-story__table"><thead><tr><th scope="col">Původní</th><th scope="col">Nová</th><th scope="col">Úspora měsíčně</th></tr></thead><tbody><tr><td>11 590 Kč</td><td>7 380 Kč</td><td class="cm-story__save">−4 210 Kč</td></tr></tbody></table>
            <p class="cm-story__result">Realizace přibližně za 4 dny.</p>
          </article>
        </div>
      </div>
    </section>

    ${contactSection('konsolidace')}`;

/* ===========================================================
   PRODUKT: ZAJIŠTĚNÝ ÚVĚR
   =========================================================== */
const zajistenyMain = `    <section class="cm-hero cm-hero--home" id="kalkulacka">
      <div class="cm-container">
        <div class="cm-hero__grid">
          <div class="cm-hero__col-text">
            <h1 class="cm-hero__title">Spotřebitelský úvěr</h1>
            <p class="cm-hero__kicker">Peníze na cokoli potřebujete řešit</p>
            <p class="cm-hero__sub">Úvěr zajištěný nemovitostí od 100 000 do 10 000 000 Kč se splatností až 30 let. Férové podmínky i pro situace, které banka odmítla.</p>
            <div class="cm-hero__cta">
              ${applyBtn('cm-btn--primary')}
              <a class="cm-btn cm-btn--ghost-dark" href="#kontakt">Nezávazná konzultace</a>
            </div>
            <p class="cm-hero__reassure">${icon.check} Licence ČNB · pro fyzické osoby · bez poplatků předem</p>
          </div>
          <div class="cm-hero__col-calc">
            ${productCalcCard('spotrebitelsky')}
          </div>
        </div>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container">
        <span class="cm-eyebrow">Parametry</span>
        <h2 class="cm-h2">Základní podmínky</h2>
        <div class="cm-params">
          <div class="cm-param"><span class="cm-param__val">100 000 – 10 mil. Kč</span><span class="cm-param__lbl">Výše úvěru</span></div>
          <div class="cm-param"><span class="cm-param__val">až 30 let</span><span class="cm-param__lbl">Splatnost</span></div>
          <div class="cm-param"><span class="cm-param__val">Nemovitost</span><span class="cm-param__lbl">Zajištění</span></div>
          <div class="cm-param"><span class="cm-param__val">Individuální</span><span class="cm-param__lbl">Posouzení bonity</span></div>
        </div>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container">
        <span class="cm-eyebrow">Pro koho je</span>
        <h2 class="cm-h2">Komu zajištěný úvěr pomáhá</h2>
        <div class="cm-why cm-why--light">
          <div class="cm-why__item"><h3>Odmítnutým bankou</h3><p>Posuzujeme individuálně i situace s nižší bonitou.</p></div>
          <div class="cm-why__item"><h3>Na větší záměr</h3><p>Rekonstrukce, vyplacení závazků, životní situace.</p></div>
          <div class="cm-why__item"><h3>S vlastní nemovitostí</h3><p>Nemovitost slouží jako zajištění, díky čemuž je sazba férovější.</p></div>
        </div>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container"><span class="cm-eyebrow">Jak to funguje</span><h2 class="cm-h2">Od žádosti k penězům na účtě</h2>${loanSteps()}</div>
    </section>

    ${contactSection('zajisteny-uver')}`;

/* ===========================================================
   PRODUKT: PODNIKATELSKÝ ÚVĚR (živý produkt, parametry = placeholdery)
   =========================================================== */
const podnikatelskyFaq = [
  { q: 'Pro koho je podnikatelský úvěr určen?', a: 'Pro OSVČ a menší firmy (orientačně do ~20 mil. Kč obratu), které banka neřeší nebo financování zamítla – typicky kvůli krátké historii či nestandardní bonitě.' },
  { q: 'Na co lze úvěr použít?', a: 'Na překlenutí výpadku cashflow, financování zakázky, rozjezd nebo rozvoj podnikání. Konkrétní účel s vámi probereme při posouzení.' },
  { q: 'Jaké je zajištění?', a: 'Úvěr je zajištěný nemovitostí, stejně jako u dalších produktů Comfort Money. Konkrétní podmínky upřesníme při individuálním posouzení.' },
];

const podnikatelskyMain = `    <section class="cm-hero cm-hero--home" id="kalkulacka">
      <div class="cm-container">
        <div class="cm-hero__grid">
          <div class="cm-hero__col-text">
            <h1 class="cm-hero__title">Podnikatelský úvěr</h1>
            <p class="cm-hero__kicker">Partner pro vaše podnikání</p>
            <p class="cm-hero__sub">Financování pro OSVČ a menší firmy, na které banka nemá čas. Věcně, férově a s individuálním posouzením.</p>
            <div class="cm-hero__cta">
              ${applyBtn('cm-btn--primary')}
              <a class="cm-btn cm-btn--ghost-dark" href="#parametry">Parametry úvěru</a>
            </div>
            <p class="cm-hero__reassure">${icon.check} Licence ČNB · pro OSVČ a firmy · individuální posouzení</p>
          </div>
          <div class="cm-hero__col-calc">
            ${productCalcCard('podnikatelsky')}
          </div>
        </div>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container">
        <span class="cm-eyebrow">Pro koho je</span>
        <h2 class="cm-h2">Komu pomáháme</h2>
        <div class="cm-why cm-why--light">
          <div class="cm-why__item"><h3>OSVČ a menší firmy</h3><p>Orientačně do ~20 mil. Kč obratu.</p></div>
          <div class="cm-why__item"><h3>Odmítnutí bankou</h3><p>Krátká historie nebo nestandardní bonita pro nás nejsou automaticky překážkou.</p></div>
          <div class="cm-why__item"><h3>Potřebujete jednat</h3><p>Zakázka, výpadek cashflow nebo příležitost k růstu.</p></div>
        </div>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container">
        <span class="cm-eyebrow">Typické situace</span>
        <h2 class="cm-h2">Kdy podnikatelský úvěr dává smysl</h2>
        <div class="cm-products">
          <article class="cm-product"><span class="cm-product__icon" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M5 10c0-2 2-3 7-3s7 1 7 3-2 3-7 3-7 1-7 3 2 3 7 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span><h3 class="cm-product__title">Překlenutí cashflow</h3><p class="cm-product__desc">Dočasný výpadek příjmů nebo zpožděné platby od odběratelů.</p></article>
          <article class="cm-product"><span class="cm-product__icon" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 19V5m0 14h16M8 15l3-4 3 2 4-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><h3 class="cm-product__title">Rozjezd a rozvoj</h3><p class="cm-product__desc">Nová zakázka, vybavení, expanze nebo posílení provozu.</p></article>
          <article class="cm-product"><span class="cm-product__icon" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M9 7h6M9 11h6M9 15h4M6 3h12v18l-3-2-3 2-3-2-3 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><h3 class="cm-product__title">Sezónní výkyvy</h3><p class="cm-product__desc">Záporný cashflow v slabší části roku, který je potřeba překlenout.</p></article>
        </div>
      </div>
    </section>

    <section class="cm-section" id="parametry">
      <div class="cm-container">
        <span class="cm-eyebrow">Parametry</span>
        <h2 class="cm-h2">Podmínky úvěru</h2>
        <div class="cm-params">
          <div class="cm-param"><span class="cm-param__val">100 000 – 10 mil. Kč</span><span class="cm-param__lbl">Výše úvěru</span></div>
          <div class="cm-param"><span class="cm-param__val">3 – 30 let</span><span class="cm-param__lbl">Splatnost</span></div>
          <div class="cm-param"><span class="cm-param__val">od 18 % p.a. · RPSN ø 25 %</span><span class="cm-param__lbl">Sazba / RPSN</span></div>
          <div class="cm-param"><span class="cm-param__val">Nemovitostí</span><span class="cm-param__lbl">Zajištění</span></div>
        </div>
        <p class="cm-steps__note">${icon.info} Parametry vycházejí z podmínek zajištěného úvěru Comfort Money. Konkrétní nabídku pro podnikatele potvrdíme dle individuálního posouzení (k revizi compliance).</p>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container"><span class="cm-eyebrow">Jak to funguje</span><h2 class="cm-h2">Od žádosti k penězům na účtě</h2>${loanSteps()}</div>
    </section>

    <section class="cm-section">
      <div class="cm-container cm-container--narrow">
        <span class="cm-eyebrow">Transparentnost</span>
        <h2 class="cm-h2">Neslibujeme rychlost, slibujeme férové posouzení</h2>
        <p class="cm-lead">Sazbu, RPSN i poplatky uvádíme předem a srozumitelně. Řešíte i osobní dluhy? Podívejte se na <a class="cm-link-arrow" href="/konsolidace-zavazku/">konsolidaci závazků ${icon.arrow}</a></p>
      </div>
    </section>

    ${faqSection(podnikatelskyFaq, { title: 'Časté otázky k podnikatelskému úvěru', lead: 'Co se nejčastěji ptají podnikatelé.' })}
    ${contactSection('podnikatelsky-uver')}`;

/* ===========================================================
   JAK TO FUNGUJE (samostatná stránka)
   =========================================================== */
const jakMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <span class="cm-hero__pill"><span class="cm-dot"></span> Proces krok po kroku</span>
        <h1 class="cm-hero__title">Jak to u nás funguje</h1>
        <p class="cm-hero__sub">Provedeme vás procesem u všech našich produktů, klidně a srozumitelně, od první poptávky až po peníze na účtě.</p>
        <div class="cm-hero__cta"><a class="cm-btn cm-btn--primary" href="#kontakt">Začít nezávaznou poptávkou</a></div>
      </div>
    </section>
    <section class="cm-section cm-section--surface"><div class="cm-container"><span class="cm-eyebrow">Sloučení dluhů</span><h2 class="cm-h2">Sloučení dluhů krok po kroku</h2>${steps()}</div></section>
    <section class="cm-section"><div class="cm-container"><span class="cm-eyebrow">Spotřebitelský a podnikatelský úvěr</span><h2 class="cm-h2">Od žádosti k penězům na účtě</h2>${loanSteps()}</div></section>
    <section class="cm-section"><div class="cm-container cm-container--narrow"><span class="cm-eyebrow">Transparentnost</span><h2 class="cm-h2">Co od nás víte předem</h2><p class="cm-lead">Sazbu, RPSN, výši splátky i poplatky (např. za sjednání) ukazujeme otevřeně. Žádné skryté poplatky. Reprezentativní příklad najdete v patičce.</p></div></section>
    ${calcSection()}
    ${contactSection('obecne')}`;

/* ===========================================================
   REFERENCE
   =========================================================== */
const referenceMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <span class="cm-hero__pill"><span class="cm-dot"></span> Příběhy klientů</span>
        <h1 class="cm-hero__title">Příběhy našich klientů</h1>
        <p class="cm-hero__sub">Reálné situace, udržitelná řešení. Ukazujeme, jak v praxi pomáháme lidem i podnikatelům najít cestu ven.</p>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container">
        ${storyCards()}
        <p class="cm-disclaimer" style="margin-top:32px;justify-content:center">${icon.info} <span>Uvedené případy jsou <strong>ilustrativní</strong> a slouží k vysvětlení našeho postupu. Neobsahují skutečné osobní údaje klientů.</span></p>
      </div>
    </section>
    ${contactSection('obecne')}`;
/* pozn.: kalkulačka na stránce Reference odebrána – patří k produktům, ne k příběhům */

/* ===========================================================
   O NÁS
   =========================================================== */
const oNasMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <span class="cm-hero__pill"><span class="cm-dot"></span> Licence ČNB · člen skupiny CFG</span>
        <h1 class="cm-hero__title">O Comfort Money</h1>
        <p class="cm-hero__sub">Jsme nebankovní poskytovatel úvěrů zajištěných nemovitostí. Pomáháme lidem i podnikatelům řešit složité finanční situace – férově a s důrazem na dlouhodobou stabilitu.</p>
      </div>
    </section>

    ${ceoQuote()}

    <section class="cm-section">
      <div class="cm-container cm-container--narrow">
        <span class="cm-eyebrow">Naše mise</span>
        <h2 class="cm-h2">Druhá šance a cesta z finanční tísně</h2>
        <p class="cm-lead">Poskytujeme finanční produkty s důrazem na individuální přístup a férové řešení. Díky konsolidaci pomáháme klientům vymanit se z těžké dluhové situace a dát jim druhou šanci – i těm, které banka odmítla.</p>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container">
        <span class="cm-eyebrow">Hodnoty</span>
        <h2 class="cm-h2">Čím se řídíme</h2>
        <div class="cm-why cm-why--light">
          <div class="cm-why__item"><h3>Transparentnost</h3><p>Žádné skryté poplatky, férové podmínky od začátku do konce.</p></div>
          <div class="cm-why__item"><h3>Férovost</h3><p>Licence ČNB. Cílem není klienta předlužit, ale nabídnout řešení odpovídající jeho situaci.</p></div>
          <div class="cm-why__item"><h3>Flexibilita</h3><p>Délku splatnosti a parametry úvěru přizpůsobíme klientovi.</p></div>
          <div class="cm-why__item"><h3>Dlouhodobá stabilita</h3><p>Udržitelné řešení, ne rychlé „hašení“.</p></div>
          <div class="cm-why__item"><h3>Druhá šance</h3><p>Pomáháme i klientům, které banka odmítla.</p></div>
          <div class="cm-why__item"><h3>Vyjednání s věřiteli</h3><p>Aktivně jednáme o nižším vyčíslení dluhů – to nás odlišuje.</p></div>
        </div>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container cm-container--narrow">
        <span class="cm-eyebrow">Vize</span>
        <h2 class="cm-h2">Kam směřujeme</h2>
        <ul class="cm-checklist">
          <li>Individuální přístup ke každému klientovi</li>
          <li>Rychlé a srozumitelné jednání</li>
          <li>Maximální spokojenost klientů</li>
          <li>Dlouhodobá spolupráce postavená na důvěře</li>
          <li>Pomáhat lidem v těžké finanční situaci</li>
        </ul>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container">
        <span class="cm-eyebrow">Více o nás</span>
        <h2 class="cm-h2">Etika, hodnoty a registry</h2>
        <div class="cm-cards2">
          <a class="cm-linkcard" href="/o-nas/kodex-a-hodnoty/">
            <h3>Etický kodex a hodnoty</h3>
            <p>Principy, kterými se řídíme – od odpovědného schvalování úvěrů po transparentnost a férové jednání.</p>
            <span class="cm-linkcard__more">${icon.arrow} Přečíst kodex</span>
          </a>
          <a class="cm-linkcard" href="/informacni-memorandum-nebankovniho-registru-klientskych-informaci/">
            <h3>Informační memorandum NRKI</h3>
            <p>Jak funguje Nebankovní registr klientských informací, jaké údaje se zpracovávají a jaká máte práva.</p>
            <span class="cm-linkcard__more">${icon.arrow} Přečíst memorandum</span>
          </a>
        </div>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container cm-container--narrow">
        <span class="cm-eyebrow">Pro partnery</span>
        <h2 class="cm-h2">Spolupráce se zprostředkovateli</h2>
        <p class="cm-lead">Spolupracujeme s affiliate sítí a zprostředkovateli. Máte zájem o spolupráci? Ozvěte se na <a href="mailto:pc@comfortmoney.cz">pc@comfortmoney.cz</a> nebo +420 722 659 199.</p>
      </div>
    </section>

    ${contactSection('obecne')}`;

/* ===========================================================
   O NÁS – PODSTRÁNKY (kodex a hodnoty, informační memorandum NRKI)
   =========================================================== */
const KODEX = [
  ['Splácení bez obav', 'Půjčku schvalujeme zodpovědně tak, aby výrazně neomezila váš rodinný rozpočet.'],
  ['Transparentnost', 'Používáme standardizované smlouvy, které vám poskytneme předem k prostudování.'],
  ['Žádné skryté poplatky', 'Veškeré úvěry poskytujeme bez skrytých poplatků a bez poplatků předem.'],
  ['Řešení na míru', 'Najdeme vhodné řešení a pomůžeme vyřešit i vážné finanční situace.'],
  ['Předčasné splacení', 'Úvěr můžete kdykoliv bez obav předčasně splatit.'],
  ['Etické a právní normy', 'Dodržujeme etické a právní normy celého odvětví.'],
  ['Informovanost', 'Srozumitelně vám vysvětlíme všechny potřebné informace.'],
  ['Důvěra', 'Naším cílem je oboustranně spokojená a dlouhodobá spolupráce.'],
];

const kodexMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <span class="cm-hero__pill"><span class="cm-dot"></span> O nás · Etický kodex</span>
        <h1 class="cm-hero__title">Etický kodex a hodnoty</h1>
        <p class="cm-hero__sub">Hlásíme se k dodržování etického kodexu a férových hodnotových principů. Takto přistupujeme ke každému klientovi.</p>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container">
        <div class="cm-why cm-why--light">
          ${KODEX.map(([h, p]) => `<div class="cm-why__item"><h3>${h}</h3><p>${p}</p></div>`).join('\n          ')}
        </div>
        <p class="cm-lead" style="text-align:center;margin-top:40px">Comfort Money je vhodným partnerem pro vaše finance.</p>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container cm-container--narrow" style="text-align:center">
        <a class="cm-btn cm-btn--ghost-dark" href="/o-nas/">${icon.arrow} Zpět na O nás</a>
      </div>
    </section>

    ${contactSection('obecne')}`;

const memorandumMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <span class="cm-hero__pill"><span class="cm-dot"></span> O nás · Registry</span>
        <h1 class="cm-hero__title" style="font-size:clamp(28px,6vw,42px)">Informační memorandum NRKI</h1>
        <p class="cm-hero__sub">Včetně základních informací o vzájemné výměně informací s Bankovním registrem klientských informací.</p>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container cm-container--narrow cm-prose">
        <p>Vážení klienti,</p>

        <h2>I. Nebankovní registr klientských informací</h2>
        <p>Nebankovní registr klientských informací (dále jen „NRKI“) je společná databáze údajů vytvořená na základě informací, které si vzájemně poskytují věřitelské subjekty (zejména leasingové společnosti, společnosti poskytující spotřebitelské úvěry, faktoringové společnosti a některé banky – dále jen „věřitelské subjekty“) o smluvních (úvěrových) vztazích mezi těmito věřitelskými subjekty a jejich klienty (bližší informace o obsahu NRKI jsou uvedeny v části „NRKI – obsah“).</p>
        <p>NRKI je společným projektem věřitelských subjektů a společností zabývajících se vývojem a provozováním informačních systémů sloužících k výměně informací.</p>

        <h2>II. Základní účel NRKI</h2>
        <p>Základním účelem NRKI je vzájemné informování věřitelských subjektů o záležitostech vypovídajících o bonitě, důvěryhodnosti a platební morálce, resp. úvěruschopnosti, jejich klientů.</p>
        <p>Věřitelské subjekty, které se účastní projektu NRKI, mají za účelem snížení rizik, zefektivnění plnění povinností, vyplývajících z právních předpisů směřujících k ochraně spotřebitele a zvýšení kvality nabízených produktů zájem pravidelně získávat údaje vypovídající o bonitě, důvěryhodnosti a platební morálce, resp. úvěruschopnosti, svých klientů.</p>
        <p>Pro účely tohoto dokumentu se klientem rozumí:</p>
        <ul>
          <li>fyzická osoba (podnikatel i nepodnikatel) nebo právnická osoba, se kterou věřitelský subjekt uzavřel smlouvu s klientem;</li>
          <li>fyzická a/nebo právnická osoba, která zastupuje klienta – právnickou osobu, s nímž věřitelský subjekt uzavřel smlouvu, a to na smluvním, zákonném či jiném základě, zejména je to osoba, která je členem statutárního orgánu, zmocněncem zastupujícím právnickou osobu na základě plné moci, prokuristou, vedoucím odštěpného závodu, pověřenou osobou dle § 430 občanského zákoníku, zaměstnancem právnické osoby dle § 166 občanského zákoníku (dále jen „osoby zastupující klienta“); za předpokladu, že tyto osoby, pokud jde o fyzické osoby, poskytly souhlas se zpracováním osobních údajů;</li>
          <li>fyzická a právnická osoba, která je vlastníkem právnických osob, zejména jde o jediné společníky společnosti s ručením omezeným a jediné akcionáře akciové společnosti (dále jen „vlastník klienta“), za předpokladu, že tyto osoby poskytly souhlas, a</li>
          <li>fyzická osoba (podnikatel i nepodnikatel) nebo právnická osoba, ohledně které má být nebo již byla na základě smlouvy postoupena faktorovaná pohledávka z klienta na věřitelský subjekt (tj. postoupený dlužník).</li>
        </ul>
        <p>Ustanovení týkající se klienta dle tohoto memoranda se obdobně vztahují i na fyzické osoby (podnikatele i nepodnikatele) a právnické osoby, které osobním ručením zajišťují závazky klientů ze smluv s klientem, nebo s nimiž věřitelský subjekt o takovém zajištění jedná.</p>
        <p>Cílem tohoto dokumentu je poskytnout Vám – klientům věřitelských subjektů – základní informace o NRKI.</p>

        <h2>III. Provozovatel NRKI</h2>
        <p>Provozovatelem NRKI je CNCB – Czech Non-Banking Credit Bureau, z.s.p.o., IČO: 712 36 384, se sídlem Štětkova 1638/18, Nusle, 140 00 Praha 4, zapsané ve spolkovém rejstříku, vedeném Městským soudem v Praze, spisová značka L 58499 (dále jen „CNCB“). CNCB zpracovává údaje klientů – fyzických osob podle Nařízení Evropského parlamentu a Rady (EU) 2016/679 ze dne 27. dubna 2016 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů a o zrušení směrnice 95/46/ES (dále jen „obecné nařízení o ochraně osobních údajů“).</p>

        <h2>IV. Uživatelé NRKI a příjemci osobních údajů</h2>
        <p>Uživateli NRKI jsou jednotlivé věřitelské subjekty, které mají uzavřenou s CNCB smlouvu o účasti na projektu NRKI. Ke dni zpracování a vydání tohoto dokumentu jsou uživateli NRKI tyto společnosti:</p>
        <ul>
          <li>ACEMA Credit Czech, a.s.</li>
          <li>AGRO LEASING J.Hradec s.r.o.</li>
          <li>ARVAL CZ s.r.o.</li>
          <li>AvaFin Czech s.r.o.</li>
          <li>BMW Financial Services Czech Republic s.r.o.</li>
          <li>CFIG Credit a.s.</li>
          <li>COFIDIS a.s.</li>
          <li>Comfort Money s.r.o.</li>
          <li>COOL CREDIT s.r.o.</li>
          <li>CreditKasa s.r.o.</li>
          <li>CreditPortal, a.s.</li>
          <li>ČSOB Leasing, a.s.</li>
          <li>D.S. Leasing, a.s.</li>
          <li>Drivalia Lease Czech Republic s.r.o.</li>
          <li>Duofin Finance, s.r.o.</li>
          <li>EC Financial Services, a.s.</li>
          <li>ESSOX s.r.o.</li>
          <li>Fair Credit Czech s.r.o.</li>
          <li>FlexiFin s.r.o.</li>
          <li>FlexiFin Business s.r.o.</li>
          <li>FlexiFin One s.r.o.</li>
          <li>FlexiFin prime s.r.o.</li>
          <li>Home Credit a.s.</li>
          <li>IMPULS-Leasing-AUSTRIA s.r.o.</li>
          <li>Leasing České spořitelny, a.s.</li>
          <li>Lemonero s.r.o.</li>
          <li>Loan2go s.r.o.</li>
          <li>Mercedes-Benz Financial Services Česká republika, s.r.o.</li>
          <li>MONETA Auto, s.r.o.</li>
          <li>MONETA Leasing, s.r.o.</li>
          <li>Multitude Bank p.l.c.</li>
          <li>NORABEL s.r.o.</li>
          <li>PROFI CREDIT Czech, a.s.</li>
          <li>Provident Financial s.r.o.</li>
          <li>Raiffeisen – Leasing, s.r.o.</li>
          <li>RCI Financial Services, s.r.o.</li>
          <li>SG Equipment Finance Czech Republic s.r.o.</li>
          <li>Skip Pay s.r.o.</li>
          <li>SWISS FUNDS, a.s.</li>
          <li>ŠkoFIN s.r.o.</li>
          <li>TOMMY STACHI s.r.o.</li>
          <li>Toyota Financial Services Czech s.r.o.</li>
          <li>Twisto payments a.s.</li>
          <li>UniCredit Leasing CZ, a.s.</li>
          <li>UNILEASING a.s.</li>
          <li>VFS Financial Services Czech Republic s.r.o.</li>
          <li>Via SMS s.r.o.</li>
          <li>Zaplo Finance s.r.o.</li>
        </ul>
        <p>Věřitelské subjekty – uživatelé NRKI jsou vedle níže uvedených společností, zajišťujících technické zpracování informací, jedinými možnými příjemci osobních údajů obsažených v NRKI.</p>

        <h2>V. CRIF S.p.A.</h2>
        <p>Další osobou účastnící se zpracování informací v NRKI je italská společnost CRIF S.p.A., založená podle práva Italské republiky, se sídlem Via M. Fantin 1-3, 40131 Bologna, Italská republika (dále jen „CRIF“), která na základě příslušné smluvní dokumentace zajišťuje v případě NRKI pro CNCB finální automatizované technické zpracování informací o klientech, které jsou poskytovány CNCB ze strany jednotlivých věřitelských subjektů.</p>

        <h2>VI. CRIF – Czech Credit Bureau, a.s.</h2>
        <p>Společnost CRIF – Czech Credit Bureau, a.s., IČO: 262 12 242, se sídlem Štětkova 1638/18, Nusle, 140 00 Praha 4, zapsaná v obchodním rejstříku, vedeném Městským soudem v Praze, spisová značka B 6853 (dále jen „CRIF CZ“) na základě příslušných smluv zajišťuje v případě NRKI pro CNCB služby související se vzájemným informováním uživatelů o bonitě, důvěryhodnosti a platební morálce, resp. úvěruschopnosti, jejich klientů a provoz Klientského centra.</p>

        <h2>VII. NRKI – obsah</h2>
        <p>NRKI představuje databázi údajů o smluvních vztazích mezi věřitelskými subjekty a jejich klienty. NRKI je vytvořen na základě informací (údajů), které věřitelské subjekty poskytují CNCB, a které jednotlivě nebo ve svém souhrnu vypovídají o bonitě, důvěryhodnosti a platební morálce, resp. úvěruschopnosti, klientů věřitelských subjektů.</p>
        <p>V rámci NRKI jsou zpracovávány níže uvedené osobní údaje klientů:</p>
        <ul>
          <li>identifikační osobní údaje klienta (tj. jméno, příjmení, rodné příjmení, datum narození, místo a země narození, adresa bydliště klienta a informace o dokladech totožnosti) a kontaktní osobní údaje klienta poskytnuté klientem (tj. kontaktní adresa, telefon a elektronická adresa);</li>
          <li>rodné číslo klienta (viz níže část Rodná čísla);</li>
          <li>osobní údaje vypovídající o tom, zda mezi klientem (nebo žadatelem, pokud jde o ručitele) a věřitelským subjektem došlo k uzavření, případně neuzavření smluvního vztahu;</li>
          <li>osobní údaje vypovídající o finančních závazcích klienta, které vznikly, vzniknou nebo mohou vzniknout vůči věřitelskému subjektu v souvislosti se smluvním vztahem, a o plnění těchto závazků ze strany klienta;</li>
          <li>osobní údaje vypovídající o zajištění závazků klienta souvisejících se smluvním vztahem s věřitelským subjektem;</li>
          <li>osobní údaje vypovídající o tom, zda ohledně klienta došlo k postoupení pohledávky ze smluvního vztahu s věřitelským subjektem a o dalším plnění závazků ze strany klienta ve vztahu k takto postoupené pohledávce; to vše pouze za předpokladu, že věřitelský subjekt nadále vykonává správu příslušné postoupené pohledávky a při splnění dalších smluvně stanovených podmínek;</li>
          <li>případné další osobní údaje, které vypovídají o bonitě, důvěryhodnosti a platební morálce klienta, a které klient sdělil či sdělí věřitelskému subjektu, nebo které věřitelský subjekt získal či získá v souvislosti s plněním, případně neplněním příslušného smluvního vztahu s věřitelským subjektem, včetně údajů o dokladu klienta.</li>
        </ul>
        <p>Právním základem pro zpracování osobních údajů klientů v NRKI je (a) plnění právních povinností věřitelských subjektů v případě, kdy je fyzické osobě poskytován spotřebitelský úvěr, (b) oprávněné zájmy věřitelských subjektů v případě, kdy je fyzické osobě poskytován jiný než spotřebitelský úvěr, zejména zájem na poskytování úvěrových produktů pouze bonitním a důvěryhodným klientům, (c) zákonné zmocnění pro zpracování rodného čísla, pokud je to nezbytné pro vymáhání soukromoprávních nároků nebo pro předcházení vzniku nesplácených pohledávek a (d) souhlas se zpracováním osobních údajů v případě osob zastupujících klienty či vlastníky klientů.</p>
        <p>Nakládání s informacemi (údaji) v rámci NRKI se řídí těmito pravidly:</p>
        <p>Informace (údaje) jsou do NRKI zařazovány a následně zpracovávány v rozsahu, ve kterém mohou sloužit pro posouzení bonity, důvěryhodnosti a platební morálky, resp. úvěruschopnosti, klienta, a ve kterém je klient poskytl věřitelskému subjektu v souvislosti se smluvním vztahem, nebo které mohou vyplynout ze smluvního vztahu za dobu jeho trvání nebo v případě postoupeného dlužníka, které mohou vyplynout z jeho povinností vůči klientovi nebo uživateli NRKI po dobu trvání těchto jeho závazků nebo se správou příslušných postoupených pohledávek (viz výše výčet osobních údajů zpracovávaných v rámci NRKI).</p>
        <p>Obsahem NRKI jsou tedy zejména základní identifikační údaje klientů, údaje o závazcích klientů, o včasnosti jejich plnění, o jejich zajištění apod. (viz výše výčet osobních údajů zpracovávaných v rámci NRKI). V NRKI nejsou zpracovávány zvláštní kategorie osobních údajů klientů – fyzických osob ve smyslu obecného nařízení o ochraně osobních údajů (např. údaje o zdravotním stavu apod.).</p>
        <p>Informace (údaje) obsažené v rámci NRKI jsou pravidelně měsíčně aktualizovány a jsou uchovávány pro potřebu vzájemného informování věřitelských subjektů po dobu trvání veškerých povinností klienta vůči uživateli NRKI nebo postoupeného dlužníka vůči klientovi nebo uživateli NRKI (včetně situace, kdy věřitelský subjekt vykonává správu příslušné postoupené pohledávky – viz výše výčet osobních údajů zpracovávaných v rámci NRKI) a po dobu dalších čtyř (4) let po splnění všech závazků klienta, resp. postoupeného dlužníka.</p>
        <p>Pokud požadovaná smlouva s klientem nebyla uzavřena, jsou informace (údaje), týkající se klienta včetně postoupeného dlužníka, uchovávány v NRKI po dobu šesti (6) měsíců ode dne podání žádosti klienta (nebo uživatele) o uzavření příslušné smlouvy (včetně smlouvy týkající se postoupení faktorovaných pohledávek postoupeného dlužníka).</p>
        <p>Po uplynutí příslušné doby je zpracování takovýchto informací (údajů) omezeno (to znamená, že jsou uvedeny do takového stavu, při kterém jsou nepřístupné pro účely vzájemného informování věřitelských subjektů a jsou archivovány pro určení, výkon nebo obhajobu právních nároků uživatelů NRKI nebo subjektu údajů. Právním základem omezeného zpracování je oprávněný zájem správce nebo subjektu údajů na jejich získání pro uvedený účel. V rámci plnění zákonných povinností CNCB mohou být archivované údaje poskytnuty na vyžádání některých státních orgánů podle zvláštních zákonů). Po uplynutí doby omezení pěti (5) let budou informace (údaje) automaticky vymazány.</p>
        <p>Informace (údaje) o smluvních vztazích s klienty jsou věřitelskými subjekty poskytovány CNCB, které tyto údaje dále zpracovává v NRKI, a to i s využitím systému pro finální automatické technické zpracování údajů italské společnosti CRIF. V Itálii jsou informace také finálně automaticky technicky zpracovávány v souladu s obecným nařízením o ochraně osobních údajů. Při tomto zpracování dochází též k profilování klientů jednotlivých věřitelských subjektů, jehož výsledek je jedním z podkladů pro rozhodnutí věřitelského subjektu o tom, zda s příslušným klientem požadovanou smlouvu uzavře. K automatizovanému rozhodování o tom, zda věřitelský subjekt s příslušným klientem produktovou smlouvu uzavře, však v rámci NRKI nedochází.</p>
        <p>Takto zpracovávané informace (údaje) zpřístupňuje CNCB ve formě úvěrových zpráv na základě jejich žádosti věřitelským subjektům, které využívají služeb NRKI, a to výlučně za účelem vzájemného informování věřitelských subjektů o bonitě, důvěryhodnosti a platební morálce jejich klientů.</p>
        <p>Informace týkající se konkrétního klienta jsou též zpracovávány ze strany CNCB a CRIF CZ pro účely plnění smlouvy s klientem o poskytnutí služeb nabízených na portálu <a href="https://www.kolikmam.cz" rel="noopener" target="_blank">www.kolikmam.cz</a>.</p>
        <p>CNCB dále poskytuje nebo může poskytovat věřitelským subjektům, které využívají NRKI:</p>
        <ul>
          <li>tzv. score, což je syntetická hodnota vypovídající o vyhodnocení informací (údajů) o klientech obsažených vždy v příslušné úvěrové zprávě, které uživatelé rovněž využívají pro účely vyhodnocování bonity, důvěryhodnosti a platební morálky jejich klientů; score je poskytováno v rámci úvěrových zpráv i v rámci souhrnných statistických zpráv (jak je uvedeno dále);</li>
          <li>zprávu o ověření dokladu klienta či údajů uvedených na dokladu klienta, která je součástí ověření důvěryhodnosti klienta i v souvislosti se zákonem č. 253/2008 Sb., o některých opatřeních proti legalizaci výnosů z trestné činnosti a financování terorismu, ve znění pozdějších předpisů, a je vyhotovena mj. za použití veřejných databází a NRKI; zpráva o ověření dokladu klienta či údajů uvedených na dokladu klienta je poskytována buď samostatně, nebo v rámci úvěrových zpráv;</li>
          <li>tzv. rizikový profil klienta, který je zpracováván na základě údajů poskytnutých klientem věřitelskému subjektu, především kontaktních údajů a jejich případných nekonzistencí a na základě dalších zpracovávaných osobních údajů klienta, především údajů o finančních závazcích klienta a jejich plnění; tato služba tvoří další podklad k ověření bonity a důvěryhodnosti klienta;</li>
          <li>informace (údaje) ve formě souhrnných statistických zpráv o bonitě, důvěryhodnosti a platební morálce portfolií klientů v rámci příslušného produktového trhu; takové souhrnné statistické zprávy představují souhrnné a anonymní informace, které nelze žádným způsobem spojit s jakýmkoli identifikovaným nebo identifikovatelným subjektem údajů, a mohou být zpřístupněny také příslušnému orgánu dohledu v rámci jeho dohledové a kontrolní činnosti v souladu s platnými právními předpisy;</li>
          <li>informace ve vztahu ke klientům, ohledně kterých věřitelský subjekt, který o informace žádá, postoupí či postoupil pohledávky ze smlouvy s klientem.</li>
        </ul>
        <p>Informace (údaje) týkající se osob zastupujících klienty – fyzických osob a vlastníků klientů, poskytuje CNCB věřitelským subjektům na základě souhlasu těchto osob se zpracováním jejich osobních údajů v NRKI.</p>

        <h2>VIII. Rodná čísla</h2>
        <p>Struktura databáze NRKI předpokládá, že v rámci NRKI jsou zpracovávány i údaje o rodných číslech fyzických osob, které jsou klienty uživatelů NRKI.</p>
        <p>Vaše rodné číslo tvoří spolu s dalšími údaji o Vás unikátní komplex údajů, který slouží ke spolehlivé identifikaci Vaší osoby v databázi NRKI a efektivně tak zamezuje možné záměně s jinou osobou vedenou v databázi NRKI. Takováto identifikace je nezbytná též pro vymáhání soukromoprávních nároků a pro předcházení vzniku nesplácených pohledávek a jsou tedy splněny podmínky stanovené v zákoně o evidence obyvatel (§ 13c odst. 1 písm. c) zákona č. 133/2000 Sb.) pro zpracování rodného čísla bez souhlasu jeho nositele.</p>
        <p>Pro nakládání s Vaším rodným číslem v rámci NRKI, včetně účelu, doby a způsobu jeho zpracování, otázky jeho zabezpečení apod., platí v plném rozsahu to, co je uvedeno v ostatních částech tohoto memoranda. Požadavek na přijetí konkrétních opatření k ochraně Vašich práv a svobod jako subjektu údajů při zpracování rodného čísla je tudíž splněn.</p>

        <h2>IX. Klientské centrum</h2>
        <p>Klientské centrum, jehož provoz zajišťuje CRIF CZ, slouží jako kontaktní místo, kam se můžete obracet s požadavky souvisejícími se zpracováním Vašich osobních údajů v NRKI. Klientské centrum poskytuje klientům věřitelských subjektů zejména tyto služby:</p>
        <ul>
          <li>informuje klienty o údajích, které jsou o nich zpracovávány v NRKI (a to v souladu s požadavky obecného nařízení o ochraně osobních údajů);</li>
          <li>slouží jako místo pro podávání žádostí klientů o informace o tom, jaké údaje jsou o nich zpracovávány v NRKI;</li>
          <li>slouží jako místo pro podávání případných stížností či připomínek ze strany klientů v souvislosti s nepřesnými údaji zpracovávanými v NRKI;</li>
          <li>slouží jako místo pro uplatnění dalších práv klientů vyplývajících z obecného nařízení o ochraně osobních údajů;</li>
          <li>poskytuje klientům další služby nabízené na portálu <a href="https://www.kolikmam.cz" rel="noopener" target="_blank">www.kolikmam.cz</a>.</li>
        </ul>
        <p>Žádosti o informace, o uplatnění práv podle obecného nařízení o ochraně osobních údajů i o další služby lze podávat s využitím on-line formulářů na webové adrese <a href="https://www.kolikmam.cz" rel="noopener" target="_blank">www.kolikmam.cz</a>, prostřednictvím datové schránky, elektronicky podepsané e-mailové zprávy s pomocí zaručeného elektronického podpisu s certifikátem, nebo poštou, a to na adresách uvedených v závěru tohoto dokumentu.</p>

        <h2>X. Technické a organizační záruky zabezpečení ochrany informací (údajů) v NRKI</h2>
        <p>Pokud jde o provoz NRKI, dovolujeme si Vás informovat, že všechny zúčastněné subjekty přijaly náležitá opatření, aby nemohlo dojít k neoprávněnému nebo nahodilému přístupu k informacím (údajům) v NRKI, k jejich změně, zničení nebo ztrátě, neoprávněným přenosům, k jejich neoprávněnému zpracování, jakož i k jinému zneužití informací obsažených v NRKI. Těmito opatřeními jsou zejména:</p>
        <ul>
          <li>pravidelná obměna individuálních přístupových kódů a přístupových jmen k NRKI;</li>
          <li>přenos informací prostřednictvím privátních linek, který znemožní neoprávněný přístup k informacím;</li>
          <li>šifrování dat při přenosu informací.</li>
        </ul>

        <h2>XI. Předávání osobních údajů do třetích zemí</h2>
        <p>Při zpracování informací v NRKI nedochází k předávání osobních údajů mimo území Evropské Unie, resp. Evropského hospodářského prostoru.</p>

        <h2>XII. Zvláštní ochrana práv klientů – fyzických osob</h2>
        <p>Na základě povinností stanovených obecným nařízením o ochraně osobních údajů bychom Vás tímto rádi poučili o Vašich právech vyplývajících z příslušných ustanovení obecného nařízení o ochraně osobních údajů.</p>
        <p>Tato práva můžete uplatnit v Klientském centru:</p>
        <p><strong>Právo na přístup k osobním údajům:</strong> máte právo požádat CNCB o potvrzení, zda Vaše osobní údaje skutečně zpracovává, a pokud je tomu tak, máte právo získat přístup k těmto osobním údajům a ke stanoveným informacím. CNCB Vám v takovém případě poskytne kopii osobních údajů zpracovávaných o Vás v NRKI bezplatně. V souladu s pravidly obecného nařízení o ochraně osobních údajů je CNCB oprávněno účtovat Vám za poskytnutí kopie zpracovávaných osobních údajů přiměřený poplatek pokrývající administrativní náklady správce, pokud by Vaše žádosti o přístup k údajům byly zjevně nedůvodné nebo nepřiměřené, především pokud by se opakovaly. Při případné opravě Vašich nesprávně uvedených údajů v NRKI obdržíte potvrzení o opravě bezplatně formou kopie zpracovávaných osobních údajů.</p>
        <p><strong>Právo na opravu:</strong> máte právo, aby CNCB bez zbytečného odkladu opravilo nepřesné osobní údaje, které o Vás zpracovává v rámci NRKI. Máte rovněž právo na doplnění neúplných osobních údajů, a to i poskytnutím dodatečného prohlášení.</p>
        <p><strong>Právo na výmaz („právo být zapomenut“):</strong> máte právo, aby CNCB bez zbytečného odkladu vymazalo Vaše osobní údaje, pokud je dán některý z důvodů stanovených obecným nařízením o ochraně osobních údajů (např. z důvodu nepotřebnosti zpracovávaných osobních údajů pro stanovené účely či protiprávnosti jejich zpracování).</p>
        <p><strong>Právo na omezení zpracování:</strong> máte právo na to, aby CNCB omezilo zpracování Vašich osobních údajů, pokud je dán některý z důvodů obecným nařízením o ochraně osobních údajů (např. z důvodu nepřesnosti zpracovávaných osobních údajů či protiprávnosti jejich zpracování).</p>
        <p>Upozorňujeme Vás, že právo na přenositelnost údajů, tj. právo získat osobní údaje (které se Vás týkají, jež jste poskytl/a uživateli NRKI, ve strukturovaném, běžně používaném a strojově čitelném formátu) a právo předat tyto údaje jinému správci, aniž by tomu uživatel NRKI či CNCB bránil, není s ohledem na povahu zpracování Vašich osobních údajů v NRKI relevantní a žádostem, týkajících se přenositelnosti údajů, proto nemůžeme vyhovět.</p>
        <p><strong>Právo podat stížnost:</strong> pokud se domníváte, že zpracováním Vašich osobních údajů v NRKI dochází k porušení příslušných právních předpisů, zejména nařízení o ochraně osobních údajů, můžete se obrátit se svou stížností na: Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, <a href="https://www.uoou.cz" rel="noopener" target="_blank">www.uoou.cz</a>.</p>
        <p>Požadované informace a dokumenty a/nebo informace o přijatých opatřeních Vám poskytneme bez zbytečného odkladu, nejpozději však do jednoho (1) měsíce ode dne doručení Vaší žádosti. V některých případech však může být tato lhůta prodloužena, o čemž Vás vyrozumíme. Pokud není možné Vaší žádosti vyhovět, budeme Vás o této skutečnosti a důvodech informovat, včetně poučení o vašich dalších právech (o právu na podání stížnosti a právu na soudní ochranu).</p>
        <p>V případě potřeby jsme v souvislosti s Vaší žádostí oprávněni Vás požádat o dodatečné informace k potvrzení vaší totožnosti. Nemůžeme-li zjistit Vaši totožnost, nemůže Vaší žádosti zpravidla vyhovět.</p>
        <p>Vaše práva můžete uplatnit bezplatně. Pokud by podané žádosti byly zjevně nedůvodné nebo nepřiměřené, zejména protože se opakují, můžeme žádat od Vás přiměřenou úhradu nebo můžeme odmítnout Vaší žádosti vyhovět.</p>

        <h2>XIII. Právo vznést námitku</h2>
        <p>Z důvodů týkajících se Vaší konkrétní situace máte právo kdykoli vznést námitku proti zpracování osobních údajů, které se Vás týkají. CNCB osobní údaje dále nezpracovává, pokud Vám neprokáže závažné oprávněné důvody pro zpracování, které převažují nad Vašimi zájmy nebo právy a svobodami, nebo pro určení, výkon nebo obhajobu právních nároků.</p>
        <p>Ohledně postupu při uplatnění práva vznést námitku platí shodně výše uvedená pravidla stanovená pro uplatňování jiných práv.</p>

        <h2>XIV. Pověřenec pro ochranu osobních údajů</h2>
        <p>Nepodaří-li se Vám vyřešit Vaši záležitost prostřednictvím Klientského centra, můžete též kontaktovat pověřence pro ochranu osobních údajů NRKI prostřednictvím <a href="mailto:poverenec@cncb.cz">poverenec@cncb.cz</a>.</p>

        <h2>Vzájemná výměna s Bankovním registrem klientských informací</h2>
        <p>Cílem této části informačního memoranda je poskytnout Vám – klientům věřitelských subjektů základní informace o vzájemné výměně informací (údajů) mezi uživateli NRKI a uživateli BRKI, jakož i o BRKI a NRKI.</p>
        <p>Databáze NRKI a databáze BRKI jsou dvě samostatně existující databáze (i když s určitými shodnými prvky, které jsou dále popsány v této části). BRKI je společnou databází údajů vytvořenou na základě informací, které si vzájemně poskytují banky o smluvních vztazích mezi bankami a jejich klienty. Obsahem BRKI jsou obdobné informace, jaké jsou obsahem NRKI.</p>
        <p>V rámci výměny informací (údajů) mezi bankami a věřitelskými subjekty jsou databáze BRKI a NRKI i nadále odděleny; vzájemná výměna údajů se totiž uskutečňuje prostřednictvím provozovatelů obou registrů (bližší informace o provozovatelích jsou uvedeny v části Provozovatel NRKI a Provozovatel BRKI), kteří i nadále poskytují informace (údaje) svým uživatelům (tj. věřitelským subjektům jako uživatelům NRKI a bankám jako uživatelům BRKI); od určitého okamžiku při splnění všech zákonných předpokladů provozovatelé poskytují svým uživatelům informace (údaje) z obou registrů (bližší informace jsou uvedeny v části Vzájemná výměna informací mezi NRKI a BRKI).</p>

        <h3>I. Základní účel BRKI a jeho vztah k účelu NRKI</h3>
        <p>Základní účel BRKI je stanovený zákonem. Konkrétně se jedná o ustanovení § 38a odst. 1 zákona č. 21/1992 Sb., o bankách, ve znění pozdějších předpisů (dále jen „zákon o bankách“), podle kterého se mohou banky a pobočky zahraničních bank působících v České republice (v rámci plnění své zákonem uložené povinnosti chovat se obezřetně) vzájemně informovat o záležitostech vypovídajících o bonitě a důvěryhodnosti jejich klientů, a to i prostřednictvím třetí osoby, na níž mají majetkový podíl pouze banky.</p>
        <p>Jedná se o obdobný základní účel jako v případě NRKI a s ohledem na tuto obdobnost či shodu účelů je ve vztahu k vzájemné výměně údajů o klientech mezi bankami a věřitelskými subjekty splněna podmínka slučitelnosti účelů ve smyslu příslušných ustanovení obecného nařízení o ochraně osobních údajů.</p>

        <h3>II. Provozovatel BRKI</h3>
        <p>Provozovatelem BRKI je CBCB – Czech Banking Credit Bureau, a.s., IČO: 261 99 696, se sídlem Štětkova 1638/18, Nusle, 140 00 Praha 4 (dále jen „CBCB“), na níž mají v souladu se zákonem o bankách majetkový podíl pouze banky. CBCB zpracovává údaje klientů bank – fyzických osob podle obecného nařízení o ochraně osobních údajů a podle dalších právních předpisů.</p>

        <h3>III. Uživatelé BRKI</h3>
        <p>Uživateli BRKI jsou jednotlivé banky, které jsou správci osobních údajů ve smyslu obecného nařízení o ochraně osobních údajů a které mají uzavřenou s CBCB smlouvu o účasti na projektu BRKI. Ke dni zpracování a vydání tohoto dokumentu jsou uživateli BRKI tyto společnosti:</p>
        <ul>
          <li>Air Bank a. s.</li>
          <li>AS Inbank, odštěpný závod</li>
          <li>Česká spořitelna, a.s.</li>
          <li>Československá obchodní banka, a.s.</li>
          <li>ČSOB Stavební spořitelna, a.s.</li>
          <li>Fio banka, a.s.</li>
          <li>Hypoteční banka, a.s.</li>
          <li>Komerční banka, a.s.</li>
          <li>mBank S.A., organizační složka</li>
          <li>Modrá pyramida stavební spořitelna, a.s.</li>
          <li>MONETA Money Bank, a.s.</li>
          <li>MONETA Stavební Spořitelna, a.s.</li>
          <li>Oberbank AG pobočka Česká republika</li>
          <li>Partners Banka, a.s.</li>
          <li>Raiffeisen stavební spořitelna a.s.</li>
          <li>Raiffeisenbank a.s.</li>
          <li>Stavební spořitelna České spořitelny, a.s.</li>
          <li>UniCredit Bank Czech Republic and Slovakia, a.s.</li>
          <li>Všeobecná úverová banka a.s., pobočka Praha</li>
          <li>TRINITY BANK a.s.</li>
        </ul>

        <h3>IV. Právní základ zpracování osobních údajů v BRKI</h3>
        <p>Právním základem pro zpracování osobních údajů klientů v BRKI je (a) plnění právních povinností bank a (b) souhlas se zpracováním osobních údajů v případě osob zastupujících klienty či vlastníka klientů.</p>

        <h3>V. Vzájemná výměna informací mezi uživateli NRKI a BRKI</h3>
        <p>Mezi uživateli NRKI a BRKI může docházet ke vzájemné výměně informací, týkajících se určitého klienta. Vzájemná výměna informací (údajů) mezi věřitelskými subjekty a bankami se uskutečňuje na základě příslušných smluv uzavřených mezi CBCB (jako provozovatelem BRKI) a CNCB (jako provozovatelem NRKI) a dále mezi CBCB a bankami a CNCB a věřitelskými subjekty, na základě žádostí příslušných uživatelů (tj. bank či věřitelských subjektů) jsou poskytovány ve formě uvěrových zpráv (včetně případného score), případně zpráv o ověření dokladu klienta, i informace (údaje) z příslušné druhé databáze (tj. v případě bank i údaje z NRKI a v případě věřitelských subjektů i údaje z BRKI).</p>
        <p>Zpracování Vašich osobních údajů v rámci výměny informací mezi věřitelskými subjekty a bankami je možné na základě (a) plnění právních povinností věřitelských subjektů a bank v případě, kdy je fyzické osobě poskytován spotřebitelský úvěr, (b) oprávněných zájmů věřitelských subjektů v případě, kdy je fyzické osobě poskytován jiný než spotřebitelský úvěr a (c) souhlasu se zpracováním osobních údajů v případě osob zastupujících klienty či vlastníka klientů.</p>
        <p>Nakládání s informacemi (údaji) v rámci BRKI (tj. bez jejich zpřístupňování uživatelům NRKI) se řídí zvláštními pravidly, o nichž banky informují své klienty v souvislosti se smluvním vztahem mezi bankou a klientem. Zmíněná pravidla se netýkají vzájemné výměny informací (údajů) mezi věřitelskými subjekty a bankami.</p>

        <h3>VI. BRKI – zabezpečení ochrany informací (údajů) a ochrana práv klientů</h3>
        <p>Pokud jde o zabezpečení ochrany informací (údajů) klientů při jejich zpracování při vzájemné výměně informací mezi uživateli NRKI a BRKI, jakož i o práva, která může klient – fyzická osoba v této souvislosti uplatňovat, platí obdobně to, co je uvedeno výše pro NRKI.</p>
        <p>Veškeré další informace Vám poskytne Klientské centrum, případně můžete též kontaktovat pověřence pro ochranu osobních údajů NRKI prostřednictvím <a href="mailto:poverenec@cncb.cz">poverenec@cncb.cz</a>.</p>

        <h2>Klientské centrum</h2>
        <p>
          <strong>CRIF – Czech Credit Bureau, a.s.</strong><br>
          Štětkova 1638/18, 140 00 Praha 4 – Nusle<br>
          Tel.: +420 844 111 777<br>
          E-mail: <a href="mailto:klient@crif.com">klient@crif.com</a><br>
          ID datové schránky: R4QDCBE<br>
          <a href="https://www.kolikmam.cz" rel="noopener" target="_blank">www.kolikmam.cz</a> · <a href="https://www.cncb.cz" rel="noopener" target="_blank">www.cncb.cz</a>
        </p>
        <p style="color:var(--cm-muted);font-size:14px">Verze k 01. 04. 2026</p>
      </div>
    </section>

    <section class="cm-section cm-section--surface">
      <div class="cm-container cm-container--narrow" style="text-align:center">
        <a class="cm-btn cm-btn--ghost-dark" href="/o-nas/">${icon.arrow} Zpět na O nás</a>
      </div>
    </section>`;

/* ===========================================================
   KONTAKT
   =========================================================== */
const kontaktMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <span class="cm-hero__pill"><span class="cm-dot"></span> Jsme tu pro vás</span>
        <h1 class="cm-hero__title">Kontakt</h1>
        <p class="cm-hero__sub">Zavolejte, napište, nebo vyplňte nezávaznou poptávku. Ozveme se a navrhneme další krok.</p>
        <div class="cm-hero__cta">
          <a class="cm-btn cm-btn--primary" href="tel:800314314">${icon.phone} 800 314 314</a>
          <a class="cm-btn cm-btn--ghost-dark" href="mailto:info@comfortmoney.cz">info@comfortmoney.cz</a>
        </div>
      </div>
    </section>

    <section class="cm-section">
      <div class="cm-container">
        <div class="cm-params">
          <div class="cm-param"><span class="cm-param__val">800 314 314</span><span class="cm-param__lbl">Klientská linka (zdarma)</span></div>
          <div class="cm-param"><span class="cm-param__val">+420 722 659 199</span><span class="cm-param__lbl">Pro partnery</span></div>
          <div class="cm-param"><span class="cm-param__val">info@comfortmoney.cz</span><span class="cm-param__lbl">E-mail pro klienty</span></div>
          <div class="cm-param"><span class="cm-param__val">Po–Pá 9–17</span><span class="cm-param__lbl">Provozní doba · celá ČR</span></div>
        </div>
        <p class="cm-steps__note" style="margin-top:24px">Sídlo: Vinohradská 2828/151, 130 00 Praha 3, IČO 24209589.</p>
      </div>
    </section>

    ${contactSection('obecne')}`;

/* ===========================================================
   DĚKUJEME
   =========================================================== */
const dekujemeMain = `    <section class="cm-hero cm-hero--page" style="min-height:60vh;display:flex;align-items:center">
      <div class="cm-container cm-hero__inner">
        <span class="cm-hero__pill"><span class="cm-dot"></span> Poptávka odeslána</span>
        <h1 class="cm-hero__title">Děkujeme!</h1>
        <p class="cm-hero__sub">Vaši poptávku jsme přijali. Ozveme se vám co nejdříve v provozní době (Po–Pá 9–17) a navrhneme další krok – nezávazně.</p>
        <div class="cm-hero__cta">
          <a class="cm-btn cm-btn--primary" href="/">Zpět na úvod</a>
          <a class="cm-btn cm-btn--ghost-dark" href="tel:800314314">${icon.phone} Raději zavolám</a>
        </div>
      </div>
    </section>`;

/* ===========================================================
   PRÁVNÍ STRÁNKY (obsah = placeholder k převzetí ze starého webu / revizi compliance)
   =========================================================== */
function legalPage(heading, intro) {
  return `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <h1 class="cm-hero__title" style="font-size:clamp(30px,7vw,46px)">${heading}</h1>
        <p class="cm-hero__sub">${intro}</p>
      </div>
    </section>
    <section class="cm-section">
      <div class="cm-container cm-container--narrow cm-prose">
        <div class="cm-disclaimer cm-disclaimer--panel">${icon.info} <span>Souhrn zpracování osobních údajů. Úplné a závazné znění poskytujeme před uzavřením smlouvy; finální verzi k revizi compliance.</span></div>

        <h2>Správce osobních údajů</h2>
        <p>Comfort Money s.r.o., Vinohradská 2828/151, 130 00 Praha 3, IČO 24209589. Kontakt: info@comfortmoney.cz, 800 314 314. Pověřenec pro ochranu osobních údajů (DPO): dpo@comfortmoney.cz, +420 226 296 052.</p>

        <h2>Účely zpracování bez souhlasu</h2>
        <p>Plnění povinností vyplývajících z právních předpisů (zákon o některých opatřeních proti legalizaci výnosů z trestné činnosti, zákon č. 257/2016 Sb. o spotřebitelském úvěru), plnění smluvních povinností, odpovědné poskytování úvěrů prostřednictvím registrů a ochrana našich práv a oprávněných zájmů.</p>

        <h2>Účely zpracování se souhlasem</h2>
        <p>Vytvoření nabídky služeb skupiny CFG a obchodních partnerů, pořízení kopií dokladů a používání rodného čísla jako identifikátoru.</p>

        <h2>Nebankovní registr klientských informací (NRKI)</h2>
        <p>Comfort Money je uživatelem Nebankovního registru klientských informací (NRKI), který provozuje CNCB – Czech Non-Banking Credit Bureau. Zpracovávané údaje zahrnují identifikační osobní údaje a údaje vypovídající o bonitě, důvěryhodnosti a platební morálce, včetně informací o finančních závazcích a jejich plnění.</p>

        <h2>Doba uchování</h2>
        <p>Po skončení spolupráce uchováváme údaje po dobu 10 let (zákon proti praní špinavých peněz), resp. 5 let (zákon o spotřebitelském úvěru). Bez uzavření smlouvy 6 měsíců, u zamítnuté žádosti o úvěr do 1 roku.</p>

        <h2>Vaše práva</h2>
        <p>Máte právo na přístup k osobním údajům, na opravu a výmaz, na omezení zpracování, na přenositelnost údajů, právo odvolat souhlas a podat námitku, a právo podat stížnost u Úřadu pro ochranu osobních údajů.</p>

        <h2>Orgán dohledu a mimosoudní řešení sporů</h2>
        <p>Česká národní banka, Na Příkopě 28, 115 03 Praha 1. Mimosoudní řešení sporů: finanční arbitr, Legerova 69, 110 00 Praha 1, finarbitr.cz.</p>
      </div>
    </section>`;
}

const oznamovateleMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <h1 class="cm-hero__title" style="font-size:clamp(30px,7vw,46px)">Ochrana oznamovatelů</h1>
        <p class="cm-hero__sub">Vnitřní oznamovací systém dle zákona č. 171/2023 Sb.</p>
      </div>
    </section>
    <section class="cm-section">
      <div class="cm-container cm-container--narrow cm-prose">
        <div class="cm-disclaimer cm-disclaimer--panel">${icon.info} <span><strong>Placeholder k revizi compliance.</strong> Převzít finální znění ze stávajícího webu.</span></div>
        <h2>Jak podat oznámení</h2>
        <p>[DOPLNIT – způsob podání oznámení a kontakt na příslušnou osobu.]</p>
      </div>
    </section>`;

const cookiesMain = `    <section class="cm-hero cm-hero--page">
      <div class="cm-container cm-hero__inner">
        <h1 class="cm-hero__title" style="font-size:clamp(30px,7vw,46px)">Zásady používání cookies</h1>
        <p class="cm-hero__sub">Jaké soubory cookies používáme a jak je můžete spravovat.</p>
      </div>
    </section>
    <section class="cm-section">
      <div class="cm-container cm-container--narrow cm-prose">
        <h2>Nezbytné cookies</h2>
        <p>Potřebné pro základní fungování webu. Nelze je vypnout.</p>
        <h2>Analytické cookies</h2>
        <p>Ukládáme je jen s vaším souhlasem. Pomáhají nám web vylepšovat. <em>[DOPLNIT konkrétní nástroje – k revizi compliance.]</em></p>
        <p><button type="button" class="cm-btn cm-btn--ghost-dark" data-cookie="reset">Změnit nastavení cookies</button></p>
      </div>
    </section>`;

/* ===========================================================
   404
   =========================================================== */
const notFound = page({
  slug: '404', title: 'Stránka nenalezena – Comfort Money', desc: 'Požadovaná stránka nebyla nalezena.',
  includeCalc: false, includeForm: false,
  main: `    <section class="cm-hero cm-hero--page" style="min-height:60vh;display:flex;align-items:center">
      <div class="cm-container cm-hero__inner">
        <h1 class="cm-hero__title">Stránku jsme nenašli</h1>
        <p class="cm-hero__sub">Omlouváme se, taková stránka neexistuje nebo byla přesunuta.</p>
        <div class="cm-hero__cta"><a class="cm-btn cm-btn--primary" href="/">Zpět na úvod</a><a class="cm-btn cm-btn--ghost-dark" href="/kontakt/">Kontakt</a></div>
      </div>
    </section>`,
});

/* ===========================================================
   ZÁPIS
   =========================================================== */
console.log('Generuji stránky Comfort Money…');

write('', page({ slug: '', title: 'Comfort Money – Snižte měsíční splátku díky konsolidaci závazků', desc: 'Sloučíme vaše dluhy do jedné nižší splátky. Nebankovní úvěry zajištěné nemovitostí s licencí ČNB. Pomáháme i těm, které banka odmítla. Nezávazná konzultace zdarma.', jsonld: homeJsonLd, main: homeMain }));

/* ----- NÁHLEDY VIZUÁLNÍCH SMĚRŮ (CSS-only přepnutí tokenů) ----- */
function nahledBar(active) {
  const link = (href, label, key) => `<a href="${href}"${key === active ? ' style="text-decoration:underline;font-weight:800"' : ''}>${label}</a>`;
  return `<div style="position:fixed;top:76px;left:50%;transform:translateX(-50%);z-index:300;background:rgba(17,24,39,.92);color:#fff;font:600 12px/1.3 Inter,sans-serif;padding:8px 14px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.3);white-space:nowrap;display:flex;gap:12px;align-items:center">
    <span style="opacity:.7">Náhled:</span>
    ${link('/', 'Moderní fintech', 'fintech')}
    ${link('/nahled-klidna-jistota/', 'Klidná jistota', 'klid')}
    ${link('/nahled-lidske-svetlo/', 'Lidské světlo', 'svetlo')}
  </div>`;
}
const fontKlid = '<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/css/theme-klid.css?v=1">';
const fontSvetlo = '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/css/theme-svetlo.css?v=1">';
write('nahled-klidna-jistota', page({ slug: 'nahled-klidna-jistota', title: 'Náhled – Klidná jistota | Comfort Money', desc: 'Náhled vizuálního směru.', main: nahledBar('klid') + homeMain, extraHead: fontKlid }));
write('nahled-lidske-svetlo', page({ slug: 'nahled-lidske-svetlo', title: 'Náhled – Lidské světlo | Comfort Money', desc: 'Náhled vizuálního směru.', main: nahledBar('svetlo') + homeMain, extraHead: fontSvetlo }));
write('konsolidace-zavazku', page({ slug: 'konsolidace-zavazku', title: 'Sloučení dluhů – jedna nižší splátka | Comfort Money', desc: 'Sloučíme více úvěrů a splátek do jednoho zajištěného úvěru s nižší měsíční splátkou. Vyjednáme s věřiteli nižší vyčíslení dluhů. Licence ČNB.', main: konsolidaceMain }));
write('zajisteny-uver', page({ slug: 'zajisteny-uver', title: 'Spotřebitelský úvěr 100 000–10 mil. Kč | Comfort Money', desc: 'Spotřebitelský úvěr zajištěný nemovitostí od 100 000 do 10 000 000 Kč, splatnost až 30 let. Individuální posouzení i po odmítnutí bankou. Licence ČNB.', main: zajistenyMain }));
write('podnikatelsky-uver', page({ slug: 'podnikatelsky-uver', title: 'Podnikatelský úvěr pro OSVČ a firmy | Comfort Money', desc: 'Financování pro OSVČ a menší firmy, na které banka nemá čas – překlenutí cashflow, zakázka, rozvoj. Férové a individuální posouzení. Licence ČNB.', main: podnikatelskyMain }));
write('jak-to-funguje', page({ slug: 'jak-to-funguje', title: 'Jak to funguje – proces krok po kroku | Comfort Money', desc: 'Od nezávazné poptávky přes vyjednání s věřiteli až po jednu nižší splátku. Klidně a srozumitelně.', main: jakMain }));
write('reference', page({ slug: 'reference', title: 'Příběhy klientů | Comfort Money', desc: 'Ilustrativní příběhy klientů – jak konsolidace a zajištěné úvěry pomáhají řešit složité finanční situace. Reálné situace, udržitelná řešení.', main: referenceMain }));
write('o-nas', page({ slug: 'o-nas', title: 'O nás – férový nebankovní partner | Comfort Money', desc: 'Comfort Money s.r.o., člen skupiny CFG. Nebankovní poskytovatel úvěrů zajištěných nemovitostí s licencí ČNB. Naše mise, hodnoty a přístup.', main: oNasMain }));
write('o-nas/kodex-a-hodnoty', page({ slug: 'o-nas/kodex-a-hodnoty', title: 'Etický kodex a hodnoty | Comfort Money', desc: 'Etický kodex a férové hodnotové principy Comfort Money: odpovědné schvalování úvěrů, transparentnost, žádné skryté poplatky, řešení na míru.', includeForm: false, main: kodexMain }));
write('informacni-memorandum-nebankovniho-registru-klientskych-informaci', page({ slug: 'informacni-memorandum-nebankovniho-registru-klientskych-informaci', title: 'Informační memorandum NRKI | Comfort Money', desc: 'Nebankovní registr klientských informací (NRKI): co to je, jaké údaje se zpracovávají a jaká máte práva. Provozovatel CNCB, technické zpracování CRIF.', includeCalc: false, includeForm: false, main: memorandumMain }));
write('kontakt', page({ slug: 'kontakt', title: 'Kontakt – nezávazná konzultace zdarma | Comfort Money', desc: 'Zavolejte 800 314 314 nebo napište info@comfortmoney.cz. Nezávazná konzultace zdarma, Po–Pá 9–17, celá ČR.', main: kontaktMain }));
write('dekujeme', page({ slug: 'dekujeme', title: 'Děkujeme za vaši poptávku | Comfort Money', desc: 'Vaši poptávku jsme přijali. Ozveme se co nejdříve.', includeCalc: false, main: dekujemeMain }));
write('ochrana-osobnich-udaju', page({ slug: 'ochrana-osobnich-udaju', title: 'Ochrana osobních údajů | Comfort Money', desc: 'Informace o zpracování osobních údajů (GDPR) společností Comfort Money s.r.o.', includeCalc: false, includeForm: false, main: legalPage('Ochrana osobních údajů', 'Informace o zpracování osobních údajů dle GDPR.') }));
write('ochrana-oznamovatelu', page({ slug: 'ochrana-oznamovatelu', title: 'Ochrana oznamovatelů | Comfort Money', desc: 'Vnitřní oznamovací systém dle zákona č. 171/2023 Sb.', includeCalc: false, includeForm: false, main: oznamovateleMain }));
write('cookies', page({ slug: 'cookies', title: 'Zásady cookies | Comfort Money', desc: 'Jaké cookies web Comfort Money používá a jak je spravovat.', includeCalc: false, includeForm: false, main: cookiesMain }));

writeRaw('404.html', notFound);

writeRaw('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

const urls = ['', 'konsolidace-zavazku', 'zajisteny-uver', 'podnikatelsky-uver', 'jak-to-funguje', 'reference', 'o-nas', 'o-nas/kodex-a-hodnoty', 'informacni-memorandum-nebankovniho-registru-klientskych-informaci', 'kontakt', 'ochrana-osobnich-udaju', 'ochrana-oznamovatelu', 'cookies'];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${SITE}/${u ? u + '/' : ''}</loc><changefreq>monthly</changefreq><priority>${u ? '0.7' : '1.0'}</priority></url>`).join('\n') +
  `\n</urlset>\n`;
writeRaw('sitemap.xml', sitemap);

console.log('Hotovo.');
