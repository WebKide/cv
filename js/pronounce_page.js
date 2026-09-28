/**
 * js/pronounce_page.js
 * Static pronunciation reference — Bengali script + IAST romanization.
 * No audio playback (deprecated per spec). The `note` field is where the
 * "as in ___" comparisons go; only the vowels are filled in below as a
 * starting point — fill in consonant notes as you finalize the copy.
 *
 * NOTE: this table was reconstructed from the original (obfuscated)
 * guide's character list to serve as a working starting point — double
 * check the Bengali glyphs/romanization against your source before
 * shipping.
 */

const PRONOUNCE_GUIDE = [
  ['অ — अ', 'a', '“A” como en “<highlight>a</highlight>lma”'],
  ['আ — आ', 'ā', '“AA” como una “a” larga: “ac<highlight>á</highlight>” prolongando la vocal'],
  ['ই — इ', 'i', '“I” como en “<highlight>i</highlight>mán”'],
  ['ঈ — ई', 'ī', '“II” como una “i” larga: “v<highlight>i</highlight>da” prolongando la vocal'],
  ['উ — उ', 'u', '“U” como en “<highlight>u</highlight>va”'],
  ['ঊ — ऊ', 'ū', '“UU” como una “u” larga: “<highlight>ú</highlight>vula” prolongando la vocal'],
  ['ঋ — ऋ', 'ṛ', '“RI” con la “r” ligeramente retrofleja, como en “<highlight>ri</highlight>ma”'],
  ['এ — ए', 'e', '“E” como en “<highlight>e</highlight>strella”'],
  ['ঐ — ऐ', 'ai', '“AI” como en “<highlight>ai</highlight>re”'],
  ['ও — ओ', 'o', '“O” como en “<highlight>o</highlight>ro”'],
  ['ঔ — औ', 'au', '“AU” como en “<highlight>au</highlight>la”'],
  ['ळ', 'ḷ', '“Ḷ”: lengua doblada ligeramente hacia atrás, como en “ang<highlight>l</highlight>o”'],

  ['ক — क', 'ka', '“K” como en “<highlight>k</highlight>ilo”'],
  ['খ — ख', 'kha', '“KH”: “q” seguida de una fuerte aspiración, aproximadamente “<highlight>qu</highlight>eso”'],
  ['গ — ग', 'ga', '“G” fuerte como en “<highlight>g</highlight>ato”'],
  ['ঘ — घ', 'gha', '“GH”: “g” seguida de una fuerte aspiración, aproximadamente “<highlight>g-h</highlight>”'],
  ['ঙ — ङ', 'ṅa', '“NG” nasal como en “ta<highlight>ng</highlight>o”'],
  ['চ — च', 'cha', '“CH” como en “<highlight>ch</highlight>ile”'],
  ['ছ — छ', 'cḣa', '“CḢ” seguida de una fuerte aspiración: “a<highlight>cḣ</highlight>ú”'],
  ['জ — ज', 'ja', '“J” como en “<highlight>j</highlight>eans”'],
  ['ঝ — झ', 'jha', '“JH”: “j” seguida de una fuerte aspiración, aproximadamente “relo<highlight>j</highlight>”'],
  ['ঞ — ञ', 'ña', '“Ñ” como en “ca<highlight>ñ</highlight>ón”'],
  ['ট — ट', 'ṭa', '“Ṭ”: “t” con la lengua doblada ligeramente hacia atrás como en “ac<highlight>t</highlight>ual”'],
  ['ঠ — ठ', 'ṭha', '“ṬH”: “ṭ” seguida de una fuerte aspiración, como en “pac<highlight>t</highlight>o”'],
  ['ড — ड', 'ḍa', '“Ḍ”: “rd” con la lengua doblada ligeramente hacia atrás, como en “lo<highlight>rd</highlight>”'],
  ['ঢ — ढ', 'ḍha', '“ḌH”: “ḍ” seguida de una fuerte aspiración'],
  ['ণ — ण', 'ṇa', '“Ṇ”: “n” con la lengua doblada ligeramente hacia atrás, como en “Ag<highlight>n</highlight>es”'],
  ['ত — त', 'ta', '“T” como en “<highlight>t</highlight>aza”'],
  ['থ — थ', 'tha', '“TH”: “t” seguida de una fuerte aspiración, aproximadamente “Á<highlight>t</highlight>las”'],
  ['দ — द', 'da', '“D” como en “<highlight>d</highlight>edo”'],
  ['ধ — ध', 'dha', '“DH”: “d” seguida de una fuerte aspiración, aproximadamente “<highlight>d</highlight>oce”'],
  ['ন — न', 'na', '“N” como en “<highlight>n</highlight>ube”'],
  ['প — प', 'pa', '“P” como en “<highlight>p</highlight>apa”'],
  ['ফ — फ', 'fa', '“F” como “f” seguida de una fuerte aspiración, como en “al<highlight>f</highlight>ajor”'],
  ['ব — ब', 'ba', '“B” como en “<highlight>b</highlight>oca”'],
  ['ভ — भ', 'bha', '“BH”: “b” seguida de una fuerte aspiración, aproximadamente “<highlight>b</highlight>abas”'],
  ['ম — म', 'ma', '“M” como en “<highlight>m</highlight>ano”'],
  ['য — य', 'ya', '“Y” consonante como en “<highlight>y</highlight>uca”'],
  ['র — र', 'ra', '“R” suave como en “ca<highlight>r</highlight>a”'],
  ['ল — ल', 'la', '“L” como en “<highlight>l</highlight>una”'],
  ['व — व', 'va', '“V” como en “v” de “<highlight>v</highlight>aca”'],
  ['শ — श', 'śha', '“SH” más suave que la “cha”, como en “<highlight>sh</highlight>ampoo”'],
  ['ষ — ष', 'ṣa', '“Ṣ”: “X” con la lengua ligeramente doblada hacia atrás, como en “Xu<highlight>x</highlight>a”'],
  ['স — स', 'sa', '“S” como en “<highlight>s</highlight>apo”'],
  ['হ — ह', 'ha', '“H” aspirada, aproximadamente como una “j” muy suave: “<highlight>j</highlight>aula”'],
  ['ড় — ड़', 'ṛa', '“Ṛ”: sonido de “r” parecido a una “r” muy breve con la lengua doblada hacia atrás'],
  ['ঢ় — ढ़', 'ṛha', '“ṚH”: “Ṛ” seguida de una fuerte aspiración'],
  ['য় — य़', 'ẏa', '“Y” como en “<highlight>y</highlight>ate”'],

  ['क्ष — क्ष', 'kṣa', '“KSH” como en “La<highlight>x</highlight>mī” de “Lakshmi”'],
  ['ত্র — ত্র', 'tra', '“TR” como en “<highlight>tr</highlight>en”'],
  ['ज्ञ — ज्ञ', 'jña', '“JÑ”: combinación de “j” y “ñ”, aproximadamente “Ya<highlight>gy</highlight>a”'],
  ['श्र — श्र', 'śhra', '“SHR” como en “<highlight>śhr</highlight>ī” de “shrink”'],

  ['ঃ — ः', 'ḥ (visarga)', '“H” aspirada después de la vocal, como una pequeña exhalación: “ja<highlight>j</highlight>a”'],
  ['ঃ — ः', 'ḥ (visarga)', '“H” aspirada después de la vocal, como una pequeña exhalación: “ji<highlight>j</highlight>i”'],
  ['ং — ं', 'ṁ (anusvāra)', '“N” nasal: sonido nasal como el final de “pa<highlight>n</highlight>”'],
  ['ঁ — ँ', '̐ (chandrabindu)', 'Nasalización de la vocal, como pronunciar la vocal dejando salir parte del aire por la nariz']
];


function pronounce_page_init(page) {
  const container = page.querySelector('#pronounce-list');
  container.innerHTML = '';

  const guideIntro = document.createElement('div');
  guideIntro.className = 'glassy list-item__subtitle';
  /* touch-action: manipulation prevents the browser from zooming on double-tap */
  guideIntro.style.cssText = 'text-align:left; font-size:16px; padding:16px; margin:12px 6px; touch-action: manipulation;';

  const teaser = 'A lo largo de los siglos, el sánscrito se ha escrito con diversos alfabetos. Sin embargo, el sistema de escritura más utilizado en toda la India se llama <i>devanāgarī</i> <highlight>(देवनागरी)</highlight>, que literalmente significa <b>“la escritura de la ciudad de los <i>devas</i>, o dioses”.</b>';

  const rest = 'El alfabeto <i>devanagari</i> consta de cuarenta y ocho sílabas, entre las que se incluyen trece vocales y treinta y cinco consonantes. Los antiguos gramáticos sánscritos organizaron el alfabeto siguiendo principios lingüísticos concisos, y esta organización ha sido aceptada por todos los estudiosos occidentales. <br/>El sistema de transliteración utilizado en este cancionero se ajusta a un sistema que los estudiosos, por más de cien años, han aceptado casi universalmente para indicar la pronunciación de cada sonido sánscrito. <br/>Algunas de las consonantes sánscritas no tienen un equivalente exacto en el idioma Castellano o Español. Siempre que ha sido posible, se ha elegido el sonido más cercano para ilustrar la pronunciación. Sin embargo, en algunos casos, la aproximación más cercana solo se puede obtener combinando el sonido final de una palabra con el sonido inicial de la siguiente. Así, <b>“GH” se pronuncia como en “di<highlight>g-h</highlight>ard”. Estas combinaciones conservan la consonante distintiva y el soplo posterior que caracterizan a los sonidos aspirados del sánscrito. <br/>Dado que ninguna palabra en Castellano contiene exactamente estos sonidos, los ejemplos pretenden ser simplemente aproximaciones prácticas.';

  /* Build DOM — NOTE: no display:none here. We use max-height:0 for the transition. */
  guideIntro.innerHTML = `
    <p style="margin:0 0 0.5em 0; color: var(--text-color);">${teaser}</p>
    <div class="guide-rest" style="max-height:0px; overflow:hidden; transition:max-height 0.4s ease;">
      <p style="margin:0; color: var(--text-color);">${rest}</p>
    </div>
    <p class="guide-prompt" style="margin:0.8em 0 0 0; opacity:.8; font-style:bold; font-size:0.85em; text-align:center; user-select:none; -webkit-user-select:none; color: var(--highlight-color);">[PRESIONA DOS VECES PARA LEER]</p>
  `;

  const restWrapper = guideIntro.querySelector('.guide-rest');
  const promptEl    = guideIntro.querySelector('.guide-prompt');
  let isExpanded   = false;

  const toggleGuide = () => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      restWrapper.style.maxHeight = restWrapper.scrollHeight + 'px';
      promptEl.textContent = '[PRESIONA DOS VECES PARA CERRAR]';
    } else {
      restWrapper.style.maxHeight = '0px';
      promptEl.textContent = '[PRESIONA DOS VECES PARA LEER]';
    }
  };

  /* Mobile double-tap: track timestamps on touchend */
  let lastTap = 0;
  guideIntro.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 350) {
      e.preventDefault();           /* stop zoom and synthetic click */
      toggleGuide();
    }
    lastTap = now;
  });

  /* Desktop double-click */
  guideIntro.addEventListener('dblclick', (e) => {
    e.preventDefault();
    toggleGuide();
  });

  container.appendChild(guideIntro);

  /* Render pronunciation table */
  PRONOUNCE_GUIDE.forEach(([script, roman, note]) => {
    const item = ons.createElement(`
      <ons-list-item modifier="nodivider">
        <div class="left" 
             style="font-size: 1.4rem; min-width: 28px; width: 32px; color: var(--highlight-color);">
          ${script}
        </div>
        <div class="center">
          <span class="list-item__title" 
                style="color: var(--second-highlight-color);">
            ${roman}
          </span>
          ${note ? `<span class="list-item__subtitle; margin-right=0;">${note}</span>` : '“” como en “”'}
        </div>
      </ons-list-item>
    `);
    container.appendChild(item);
  });

  /* scroll-to-top FAB */
  const scrollArea = page.querySelector(".page__content");
  const fab = page.querySelector("#toTop");
  if (scrollArea && fab) {
    scrollArea.addEventListener('scroll', () => {
      if (scrollArea.scrollTop > 300) {
        fab.style.opacity = "1";
        fab.style.pointerEvents = "auto";
        fab.style.visibility = "visible";
      } else {
        fab.style.opacity = "0";
        fab.style.pointerEvents = "none";
      }
    });
  }
}