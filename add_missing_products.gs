/**
 * addMissingProducts()
 * Lisa puuduvad tooted AI_catalog lehele.
 * Seejärel uuenda röstitud tatar retseptide ingredient ID-d õigeteks.
 * Käivita: Run → addMissingProducts
 */
function addMissingProducts() {
  var ss = SpreadsheetApp.openById('17_DHr_1NQWUOa-SWUu2t7y0eK2ntB9V24alfZbMMBgE');
  var sh = ss.getSheetByName('AI_catalog');

  // Loe olemasolevad ID-d
  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();
  var header = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var colMap = {};
  header.forEach(function(h, i) { if (h) colMap[String(h).trim()] = i; });

  var existingIds = {};
  if (lastRow > 1) {
    var idColIdx = colMap['id'];
    var ids = sh.getRange(2, idColIdx + 1, lastRow - 1, 1).getValues();
    ids.forEach(function(r) { if (r[0]) existingIds[String(r[0]).trim()] = true; });
  }

  function makeProductRow(p) {
    var row = new Array(lastCol).fill('');
    function set(col, val) { if (colMap[col] !== undefined) row[colMap[col]] = (val !== undefined && val !== null) ? val : ''; }
    set('sourceSheet', 'Toit ja Jook');
    set('id', p.id);
    set('productName', p.name);
    set('price', p.price || '');
    set('categoryPath', p.catPath || '');
    set('category', p.cat || 'Toit ja Jook');
    set('subCategory', p.sub || '');
    set('diet_vegan', p.vegan !== false ? 'TRUE' : 'FALSE');
    set('diet_glutenFree', p.gf ? 'TRUE' : 'FALSE');
    set('inStock', p.inStock !== false ? 'TRUE' : 'FALSE');
    set('chatbotDescription', p.desc || p.name);
    set('usageProfile', p.usage || 'recipe');
    set('pack_size_std', p.size || '');
    set('pack_unit_std', p.unit || 'g');
    set('productUrl', 'https://greenest.ee/et/toode/' + (p.slug || ''));
    return row;
  }

  // ================================================================
  // UUED TOOTED (puuduvad AI_catalog-ist)
  // ================================================================
  var NEW_PRODUCTS = [

    // ── RÖSTITUD TATAR ─────────────────────────────────────────────────
    {
      id: '76912', name: 'MAHE RÖSTITUD TATAR 500 g', price: 3.29,
      catPath: 'Toit ja Jook > Teraviljatooted', cat: 'Toit ja Jook', sub: 'Teraviljatooted',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahe röstitud tatar 500 g — kuldpruun, pähklilõhnaline kasha',
      usage: 'recipe', size: 500, unit: 'g',
      slug: 'mahe-rostitud-tatar-500-g'
    },
    {
      id: '45206', name: 'MAHE RÖSTITUD TATAR 5 kg', price: 17.99,
      catPath: 'Toit ja Jook > Teraviljatooted', cat: 'Toit ja Jook', sub: 'Teraviljatooted',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahe röstitud tatar 5 kg — kuldpruun, pähklilõhnaline kasha',
      usage: 'recipe', size: 5000, unit: 'g',
      slug: 'mahe-rostitud-tatar-5-kg'
    },

    // ── TATRAJAHU (uus, täistera) ────────────────────────────────────────
    {
      id: '88410', name: 'MAHE TÄISTERA TATRAJAHU 600 g', price: 3.59,
      catPath: 'Toit ja Jook > Jahud', cat: 'Toit ja Jook', sub: 'Jahud',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahe täistera tatrajahu 600 g — gluteenivaba küpsetamiseks',
      usage: 'recipe', size: 600, unit: 'g',
      slug: 'mahe-taistera-tatrajahu-600-g'
    },

    // ── SEEMNED ──────────────────────────────────────────────────────────
    {
      id: '76910', name: 'MAHEDAD CHIA SEEMNED 200 g', price: 2.79,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad chia seemned 200 g — puding, smuuti, küpsetised',
      usage: 'recipe', size: 200, unit: 'g',
      slug: 'mahedad-chia-seemned-200-g'
    },
    {
      id: '85738', name: 'MAHEDAD CHIA SEEMNED 2 kg', price: 19.49,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad chia seemned 2 kg — suurpakett',
      usage: 'recipe', size: 2000, unit: 'g',
      slug: 'mahedad-chia-seemned-2-kg'
    },
    {
      id: '87012', name: 'MAHEDAD KULDSED LINASEEMNED 200 g', price: 1.99,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad kuldsed linaseemned 200 g — omega-3, küpsetised, puder',
      usage: 'recipe', size: 200, unit: 'g',
      slug: 'mahedad-kuldsed-linaseemned-200-g'
    },
    {
      id: '75287', name: 'MAHEDAD PRUUNID LINASEEMNED 250 g', price: 2.19,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad pruunid linaseemned 250 g — omega-3, leib, puder',
      usage: 'recipe', size: 250, unit: 'g',
      slug: 'mahedad-pruunid-linaseemned-250-g'
    },
    {
      id: '87320', name: 'MAHEDAD MUSTAD KOORIMATA SEESAMISEEMNED 200 g', price: 2.29,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad mustad koorimata seesamiseemned 200 g — salat, wok, leib',
      usage: 'recipe', size: 200, unit: 'g',
      slug: 'mahedad-mustad-koorimata-seesamiseemned-200-g'
    },
    {
      id: '85778', name: 'MAHEDAD KOORIMATA MUSTAD SEESAMISEEMNED 400 g', price: 3.99,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad mustad koorimata seesamiseemned 400 g',
      usage: 'recipe', size: 400, unit: 'g',
      slug: 'mahedad-koorimata-mustad-seesamiseemned-400-g'
    },
    {
      id: '85776', name: 'MAHEDAD KOORITUD VALGED SEESAMISEEMNED 400 g', price: 3.99,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad kooritud valged seesamiseemned 400 g — tahhiini, salatid, küpsetised',
      usage: 'recipe', size: 400, unit: 'g',
      slug: 'mahedad-kooritud-valged-seesamiseemned-400-g'
    },
    {
      id: '86954', name: 'MAHEDAD KOORITUD PÄEVALILLESEEMNED 800 g', price: 3.99,
      catPath: 'Toit ja Jook > Seemned', cat: 'Toit ja Jook', sub: 'Seemned',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad kooritud päevalilleseemned 800 g — salat, leib, pesto',
      usage: 'recipe', size: 800, unit: 'g',
      slug: 'mahedad-kooritud-paevalilleseemned-800-g'
    },

    // ── KOOKOSTOOTED ─────────────────────────────────────────────────────
    {
      id: '1003', name: 'MAHEDAD KOOKOSLAASTUD 250 g', price: 3.79,
      catPath: 'Toit ja Jook > Kookostooted', cat: 'Toit ja Jook', sub: 'Kookostooted',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahedad kookoslaastud 250 g — granola, küpsised, magustoit',
      usage: 'recipe', size: 250, unit: 'g',
      slug: 'mahedad-kookoslaastud-250-g'
    },
    {
      id: '76402', name: 'MAHE KOOKOSKREEM TOIDUVALMISTAMISEKS 200 ml', price: 1.99,
      catPath: 'Toit ja Jook > Kookostooted', cat: 'Toit ja Jook', sub: 'Kookostooted',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahe kookoskreem toiduvalmistamiseks 200 ml — supid, kastmed, karri',
      usage: 'recipe', size: 200, unit: 'ml',
      slug: 'mahe-kookoskreem-toiduvalmistamiseks-200-ml'
    },

    // ── TOMATIKASTE OLIIVIDEGA ──────────────────────────────────────────
    {
      id: '89832', name: 'MAHE TOMATIKASTE OLIIVIDEGA 340 g', price: 4.99,
      catPath: 'Toit ja Jook > Kastmed', cat: 'Toit ja Jook', sub: 'Kastmed',
      vegan: true, gf: true, inStock: true,
      desc: 'Mahe tomatikaste oliividega 340 g — pasta, tatrakruup, pizza',
      usage: 'recipe', size: 340, unit: 'g',
      slug: 'mahe-tomatikaste-oliividega-340-g'
    },

    // ── PASTA (uued) ──────────────────────────────────────────────────────
    {
      id: '91492', name: 'MAHEDAD AASIAPÄRASED NUUDLID 500 g', price: 4.49,
      catPath: 'Toit ja Jook > Pasta', cat: 'Toit ja Jook', sub: 'Pasta',
      vegan: true, gf: false, inStock: true,
      desc: 'Mahedad aasiapärased nuudlid 500 g — wok, supid, salatid',
      usage: 'recipe', size: 500, unit: 'g',
      slug: 'mahedad-aasiaparased-nuudlid-500-g'
    },

    // ── TATRAKREEKERID ───────────────────────────────────────────────────
    {
      id: '91242', name: 'MAHEDAD TATRAKREEKERID TÜÜMIANI JA NÕGESEGA 90 g', price: 3.79,
      catPath: 'Toit ja Jook > Krõbinad', cat: 'Toit ja Jook', sub: 'Krõbinad',
      vegan: true, gf: false, inStock: true,
      desc: 'Mahedad tatrakreekerid tüümiani ja nõgesega 90 g — snäkk, dipp',
      usage: 'snack', size: 90, unit: 'g',
      slug: 'mahedad-tatrakreekerid-tuumiani-ja-nogesega-90-g'
    },
    {
      id: '91240', name: 'MAHEDAD TATRAKREEKERID MOONISEEMNETEGA 90 g', price: 3.79,
      catPath: 'Toit ja Jook > Krõbinad', cat: 'Toit ja Jook', sub: 'Krõbinad',
      vegan: true, gf: false, inStock: true,
      desc: 'Mahedad tatrakreekerid mooniseemnetega 90 g — snäkk, dipp',
      usage: 'snack', size: 90, unit: 'g',
      slug: 'mahedad-tatrakreekerid-mooniseemnetega-90-g-33199'
    }

  ];

  // Filtreeri olemasolevad välja
  var toAdd = NEW_PRODUCTS.filter(function(p) { return !existingIds[String(p.id)]; });

  if (toAdd.length === 0) {
    Logger.log('Kõik tooted on juba kataloogis olemas.');
  } else {
    var rows = toAdd.map(makeProductRow);
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, lastCol).setValues(rows);
    Logger.log('Lisatud ' + rows.length + ' uut toodet AI_catalog lehele:');
    toAdd.forEach(function(p) { Logger.log('  ' + p.id + ' | ' + p.name); });
  }

  SpreadsheetApp.flush();

  // ================================================================
  // OSA 2: Uuenda röstitud tatar retseptid kasutama ID 76912
  // (ainult need retseptid mis kasutavad 18055 röstimise sammuga)
  // ================================================================
  updateRoostitudTatarRecipes_();
}

/**
 * Uuendab röstitud tatar retseptides ing1_product_id → 76912
 * (500g röstitud tatar) ning paneb tatrakruubu (18055) alternatiiviks
 */
function updateRoostitudTatarRecipes_() {
  var ss = SpreadsheetApp.openById('17_DHr_1NQWUOa-SWUu2t7y0eK2ntB9V24alfZbMMBgE');
  var sh = ss.getSheetByName('Recipe_Bank');

  var lastRow = sh.getLastRow();
  var lastCol = sh.getLastColumn();
  var header = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var colMap = {};
  header.forEach(function(h, i) { if (h) colMap[String(h).trim()] = i; });

  var allData = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();

  // Retseptid mis sisaldavad "rösti" retsepti ID-des
  var roostitudIds = [
    'roostitud_tatar_tahhiini_kaste',
    'roostitud_tatar_kikerherne_tomat',
    'roostitud_tatar_kookos_puder_vahtrasiirup',
    'roostitud_tatar_pelati_oliivid',
    'roostitud_tatar_india_pahkli_salat',
    'roostitud_tatar_punased_oad_arrabiata',
    'roostitud_tatar_karri_kookoskreem',
    'roostitud_tatar_kakao_kookos_puder',
    'roostitud_tatar_korvitsaseemne_kauss',
    'roostitud_tatar_must_kuuslauk_seened',
    'roostitud_tatar_mandlivoi_marmelaad',
    'roostitud_tatar_mustad_oad_tomat'
  ];

  var recipeIdCol = colMap['recipe_id'];
  var ing1PidCol = colMap['ing1_product_id'];
  var ing1LabelCol = colMap['ing1_label'];
  var ing1Alt1Col = colMap['ing1_alt1_product_id'];
  var ing1Alt2Col = colMap['ing1_alt2_product_id'];

  var updatedCount = 0;

  allData.forEach(function(row, idx) {
    var recipeId = String(row[recipeIdCol] || '').trim();
    if (roostitudIds.indexOf(recipeId) === -1) return;

    var rowNum = idx + 2; // +2 kuna algab reast 2

    // Uuenda ing1_product_id → 76912 (röstitud tatar 500g)
    // ing1_alt1 → 45206 (röstitud tatar 5kg)
    // ing1_alt2 → 18055 (tatrakruup, kui röstitud pole saadaval)
    // ing1_label → "Röstitud tatar"
    sh.getRange(rowNum, ing1PidCol + 1).setValue('76912');
    sh.getRange(rowNum, ing1LabelCol + 1).setValue('Röstitud tatar');
    sh.getRange(rowNum, ing1Alt1Col + 1).setValue('45206');
    sh.getRange(rowNum, ing1Alt2Col + 1).setValue('18055');

    updatedCount++;
    Logger.log('Uuendatud: ' + recipeId);
  });

  Logger.log('Uuendatud ' + updatedCount + ' röstitud tatar retsepti. ✅');
  SpreadsheetApp.flush();
}
