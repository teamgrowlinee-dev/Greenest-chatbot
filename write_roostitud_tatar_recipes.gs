/**
 * writeRoostitudTatarRecipes()
 * Lisa röstitud tatar retseptid Recipe_Bank lehele.
 *
 * NB! "Röstitud tatar" tooted (ID 45206 = 1 kg, 47918 = 25 kg) on Greenesti poes
 * olemas, kuid puuduvad AI_catalog tabelist. Seetõttu kasutavad need retseptid
 * tatrakruupu (18055) koos röstimise sammuga — tulemus on identne.
 * Kui röstitud tatar hiljem AI_catalogisse lisatakse, saab ID-d asendada.
 *
 * Käivita GAS editoris: Run → writeRoostitudTatarRecipes
 */
function writeRoostitudTatarRecipes() {
  var ss = SpreadsheetApp.openById('17_DHr_1NQWUOa-SWUu2t7y0eK2ntB9V24alfZbMMBgE');
  var sh = ss.getSheetByName('Recipe_Bank');

  var lastCol = sh.getLastColumn();
  var header = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var colMap = {};
  header.forEach(function(h, i) { if (h) colMap[String(h).trim()] = i; });

  var existingIds = {};
  var lastRow = sh.getLastRow();
  if (lastRow > 1) {
    var idCol = colMap['recipe_id'];
    var existingData = sh.getRange(2, idCol + 1, lastRow - 1, 1).getValues();
    existingData.forEach(function(row) { if (row[0]) existingIds[String(row[0]).trim()] = true; });
  }

  function makeRow(r) {
    var row = new Array(lastCol).fill('');
    function set(col, val) { if (colMap[col] !== undefined) row[colMap[col]] = val; }
    set('recipe_id', r.id);
    set('recipe_name', r.name);
    set('aliases', r.aliases || '');
    set('tags', r.tags || '');
    set('default_servings', r.servings || 2);
    set('instructions_steps', r.steps || '');
    set('home_ingredients', r.homeIng || '');
    set('diet_vegan', r.vegan !== false ? 'TRUE' : 'FALSE');
    set('diet_glutenFree', r.gf ? 'TRUE' : 'FALSE');
    set('random_pool', 'TRUE');
    set('active', 'TRUE');
    (r.ings || []).forEach(function(ing, i) {
      var n = i + 1;
      if (n > 12) return;
      set('ing' + n + '_label', ing.label || '');
      set('ing' + n + '_product_id', ing.pid || '');
      set('ing' + n + '_qty_base', ing.qty !== undefined ? ing.qty : '');
      set('ing' + n + '_unit', ing.unit || '');
      set('ing' + n + '_required', ing.req !== false ? 'TRUE' : 'FALSE');
      if (ing.a1) set('ing' + n + '_alt1_product_id', ing.a1);
      if (ing.a2) set('ing' + n + '_alt2_product_id', ing.a2);
      if (ing.a3) set('ing' + n + '_alt3_product_id', ing.a3);
    });
    return row;
  }

  // Röstimise samm: "Pruunista tatrakruup kuival kuumal pannil 3–5 min pidevalt
  // segades kuni kuldpruun ja pähklilõhnaline — see ongi röstitud tatar (kasha)."
  //
  // Toote ID-d (peamised):
  // 18055 = tatrakruup (röstimiseks kuival pannil)
  // 18056 = tatratang (alternatiiv)
  // 691   = toortatar
  // 182/183 = oliivõli
  // 530   = tahhiini
  // 1123/1125/1133 = kookospiim / kookoskreem
  // 585/586 = kõrvitsaseemned
  // 582/583 = kreeka pähklid
  // 579/968 = india pähklid
  // 566/567/593 = mandlid / mandlilaastud
  // 817/816 = kikerherned
  // 825/824 = mungoad
  // 822 = punased oad
  // 292 = mustad oad
  // 15664 = rohelised läätsed
  // 196/197/200 = tomatikaste
  // 189/191 = pelati tomatid / tomatipüree
  // 13796 = arrabiata kaste
  // 190 = kuivatatud tomatid oliivõlis
  // 184 = rohelised oliivid
  // 180/181/494 = palsamiäädikas / õunaäädikas
  // 604 = vahtrasiirup
  // 596 = kookosõiesuhkur
  // 168 = akaatsiamesi
  // 126/125 = kooriviljapuljong
  // 138/806 = kakaopulber / toorkakaopulber
  // 314 = kaneelisuhkur
  // 4421 = sidrunimahl
  // 921 = sidrunikoor
  // 499/501 = kookosõli
  // 15436 = kookoshelbed
  // 18035 = musta küüslaugu pasta
  // 3221 = kivideta datlid
  // 18039/18040 = tatramüsli

  var RECIPES = [

    // 1. Röstitud tatar tahhiini kastme ja kõrvitsaseemnetega
    // Allikas: babaganosh.org + kokkama.ee + oma koostis
    {
      id: 'roostitud_tatar_tahhiini_kaste',
      name: 'Röstitud tatar tahhiini kastme ja kõrvitsaseemnetega',
      aliases: 'röstitud tatar tahhiini; kasha tahhiini kaste; roasted buckwheat tahini sauce; röstitud tatar seemned',
      tags: 'röstitud tatar;tatrakruup;tahhiini;kõrvitsaseemned;gluteenivaba;vegan;pearoog;kauss',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min pidevalt segades kuni kuldpruun ja pähklilõhnaline.\n2. Lisa soolaga maitsestatud vesi (1:2 suhe), keeda kaetult madalal tulel 12–15 min kuni vesi imendunud. Ära sega keetmise ajal.\n3. Kastmeks sega tahhiini, sidrunimahl, oliivõli ja 2–3 spl vett ühtlaseks.\n4. Tõsta tatar kaussidesse, vala tahhiini kaste peale.\n5. Puista kõrvitsaseemned ja oliivid, nirista oliivõli.\n6. Serveeri soojalt.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Tahhiini', pid: '530', qty: 3, unit: 'spl', req: true },
        { label: 'Sidrunimahl', pid: '4421', qty: 2, unit: 'spl', req: true, a1: '180' },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 40, unit: 'g', req: true, a1: '586', a2: '593' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false }
      ]
    },

    // 2. Röstitud tatar kikerherned ja tomatikastmega (kasha)
    {
      id: 'roostitud_tatar_kikerherne_tomat',
      name: 'Röstitud tatar kikerherneste ja tomatikastmega',
      aliases: 'röstitud tatar kikerherned; kasha kikerherned tomatikaste; roasted buckwheat chickpea tomato; röstitud tatar tomatikaste',
      tags: 'röstitud tatar;tatrakruup;kikerherned;tomatikaste;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min pidevalt segades kuni kuldpruun ja pähklilõhnaline.\n2. Lisa soolaga maitsestatud vesi (1:2), keeda kaetult 12–15 min.\n3. Soojenda tomatikaste koos kikerhernestega pannil 5–6 min.\n4. Sega röstitud tatar kastmesse.\n5. Nirista oliivõli, maitsesta ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kikerherned', pid: '817', qty: 240, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Tomatikaste basiilikuga', pid: '197', qty: 500, unit: 'g', req: true, a1: '196', a2: '200' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    // 3. Röstitud tatar kookospiima puder vahtrasiirupiga (hommik)
    // Inspiratsioon: foolproofliving.com buckwheat porridge
    {
      id: 'roostitud_tatar_kookos_puder_vahtrasiirup',
      name: 'Röstitud tatar kookospiima puder vahtrasiirupi ja kreeka pähklitega',
      aliases: 'röstitud tatar kookos puder; kasha kookospiim puder; roasted buckwheat coconut porridge; röstitud tatar hommikupuder',
      tags: 'röstitud tatar;tatrakruup;kookospiim;vahtrasiirup;puder;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min pidevalt segades kuni kuldpruun.\n2. Vala peale kookospiim (ja vajadusel veidi vett), keeda kaetult madalal tulel 12–15 min.\n3. Lisa kaneelisuhkur ja vahtrasiirup, sega.\n4. Tõsta kaussidesse, puista kreeka pähklid peale.\n5. Nirista vahtrasiirupt ja serveeri soojalt.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kookospiim', pid: '1125', qty: 300, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: true, a1: '168', a2: '596' },
        { label: 'Kaneelisuhkur', pid: '314', qty: 1, unit: 'tl', req: false },
        { label: 'Kreeka pähklid', pid: '582', qty: 40, unit: 'g', req: false, a1: '583', a2: '579' }
      ]
    },

    // 4. Röstitud tatar pelati tomatite ja oliividega (vahemere stiil)
    {
      id: 'roostitud_tatar_pelati_oliivid',
      name: 'Röstitud tatar pelati tomatite ja oliividega',
      aliases: 'röstitud tatar pelati tomatid; kasha pelati oliivid; roasted buckwheat olives tomato; röstitud tatar vahemere',
      tags: 'röstitud tatar;tatrakruup;pelati tomatid;oliivid;gluteenivaba;vegan;pearoog;vahemere',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Lisa soolaga maitsestatud vesi (1:2), keeda kaetult 12–15 min.\n3. Kuumuta potis pelati tomatid, purusta veidi, hauta 5 min.\n4. Sega röstitud tatar tomatitesse, lisa oliivid ja kuivatatud tomatid.\n5. Nirista oliivõli, palsamiäädikas, maitsesta ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Pelati tomatid', pid: '189', qty: 400, unit: 'g', req: true, a1: '191', a2: '196' },
        { label: 'Rohelised oliivid', pid: '184', qty: 80, unit: 'g', req: true },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 1, unit: 'spl', req: false, a1: '181', a2: '494' }
      ]
    },

    // 5. Röstitud tatar india pähkli salat (jahtunult)
    // Allikas: tastysimplyvegan.com buckwheat salad kohandatuna
    {
      id: 'roostitud_tatar_india_pahkli_salat',
      name: 'Röstitud tatar–india pähkli salat palsamiäädikaga',
      aliases: 'röstitud tatar salat india pähklid; kasha cashew salad; roasted buckwheat cashew salad; röstitud tatar salat',
      tags: 'röstitud tatar;tatrakruup;india pähklid;salat;gluteenivaba;vegan;vahemere',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Keeda röstitud tatar soolaga maitsestatud vees 12–15 min, kurna ja jahuta.\n3. Sega kausis tatar, india pähklid, oliivid ja kuivatatud tomatid.\n4. Kastmeks sega oliivõli, palsamiäädikas, sool, pipar.\n5. Vala kaste peale, sega ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 180, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'India pähklid', pid: '579', qty: 60, unit: 'g', req: true, a1: '968', a2: '582' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: true, a1: '181', a2: '494' }
      ]
    },

    // 6. Röstitud tatar punaste oadega arrabiata kastmes
    {
      id: 'roostitud_tatar_punased_oad_arrabiata',
      name: 'Röstitud tatar punaste oadega arrabiata kastmes',
      aliases: 'röstitud tatar arrabiata; kasha punased oad arrabiata; roasted buckwheat red bean arrabiata; röstitud tatar vürtsikas oad',
      tags: 'röstitud tatar;tatrakruup;punased oad;arrabiata;vürtsikas;gluteenivaba;vegan;pearoog',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Lisa soolaga maitsestatud vesi (1:2), keeda kaetult 12–15 min.\n3. Soojenda arrabiata kaste koos punaste oadega pannil 5–6 min.\n4. Sega röstitud tatar kastmesse.\n5. Nirista oliivõli, maitsesta ja serveeri.',
      homeIng: 'sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Arrabiata kaste', pid: '13796', qty: 380, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Punased oad', pid: '822', qty: 240, unit: 'g', req: true, a1: '819', a2: '292' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    // 7. Röstitud tatar kookoskreemis karriga (kasha karri)
    {
      id: 'roostitud_tatar_karri_kookoskreem',
      name: 'Röstitud tatar karri–kookoskreem kastmes',
      aliases: 'röstitud tatar karri; kasha karri kookos; roasted buckwheat curry coconut; röstitud tatar kookos karri',
      tags: 'röstitud tatar;tatrakruup;karri;kookoskreem;gluteenivaba;vegan;pearoog;india',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Lisa soolaga maitsestatud vesi (1:2), keeda kaetult 12–15 min.\n3. Kuumuta oliivõli pannil, lisa kookoskreem ja tomatipüree, sega, kuumuta 5 min.\n4. Lisa mungoad, hauta 5 min.\n5. Sega röstitud tatar kastmesse.\n6. Maitsesta, nirista sidrunimahl ja serveeri.',
      homeIng: '1 sibul, 2 küüslauguküünt, 1 tl karripulbrit, kurkum, sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 180, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kookoskreem', pid: '1133', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1123' },
        { label: 'Tomatipüree', pid: '191', qty: 150, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Mungoad', pid: '825', qty: 150, unit: 'g', req: false, a1: '824', a2: '817' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' },
        { label: 'Sidrunimahl', pid: '4421', qty: 1, unit: 'spl', req: false, a1: '181' }
      ]
    },

    // 8. Röstitud tatar kakao-kookose hommikupuder (magus)
    {
      id: 'roostitud_tatar_kakao_kookos_puder',
      name: 'Röstitud tatar kakao–kookospiima hommikupuder',
      aliases: 'röstitud tatar kakao puder; kasha kakao kookos; roasted buckwheat cocoa porridge; röstitud tatar šokolaad puder',
      tags: 'röstitud tatar;tatrakruup;kakao;kookospiim;puder;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Vala peale kookospiim, keeda kaetult madalal tulel 12–15 min.\n3. Sega sisse kakaopulber ja vahtrasiirup.\n4. Tõsta kaussidesse, puista mandlilaastud ja kookoshelbed peale.\n5. Serveeri soojalt.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 180, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kookospiim', pid: '1123', qty: 300, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Kakaopulber', pid: '138', qty: 2, unit: 'spl', req: true, a1: '806' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: true, a1: '168', a2: '596' },
        { label: 'Mandlilaastud', pid: '593', qty: 20, unit: 'g', req: false, a1: '566', a2: '579' },
        { label: 'Kookoshelbed', pid: '15436', qty: 15, unit: 'g', req: false }
      ]
    },

    // 9. Röstitud tatar kõrvitsaseemne pesto kauss
    // Allikas: babaganosh.org buckwheat bowls kohandatuna
    {
      id: 'roostitud_tatar_korvitsaseemne_kauss',
      name: 'Röstitud tatar kõrvitsaseemne–oliivi kauss',
      aliases: 'röstitud tatar kõrvitsaseemned kauss; kasha kõrvitsaseemned oliivid; roasted buckwheat pumpkin seed bowl; röstitud tatar kauss',
      tags: 'röstitud tatar;tatrakruup;kõrvitsaseemned;oliivid;tahhiini;gluteenivaba;vegan;pearoog;kauss',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Keeda röstitud tatar soolaga maitsestatud vees 12–15 min, kurna.\n3. Kastmeks sega tahhiini, sidrunimahl, oliivõli, näpuotsatäis soola.\n4. Tõsta tatar kaussidesse.\n5. Lisa oliivid, kõrvitsaseemned, kuivatatud tomatid.\n6. Vala tahhiini kaste peale ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Tahhiini', pid: '530', qty: 2, unit: 'spl', req: true },
        { label: 'Sidrunimahl', pid: '4421', qty: 2, unit: 'spl', req: true, a1: '181' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 40, unit: 'g', req: true, a1: '586', a2: '593' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 40, unit: 'g', req: false }
      ]
    },

    // 10. Röstitud tatar musta küüslaugu ja seentega
    {
      id: 'roostitud_tatar_must_kuuslauk_seened',
      name: 'Röstitud tatar musta küüslaugu pastaga',
      aliases: 'röstitud tatar must küüslauk; kasha must küüslauk; roasted buckwheat black garlic; röstitud tatar seened küüslauk',
      tags: 'röstitud tatar;tatrakruup;must küüslauk;gluteenivaba;vegan;pearoog',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Lisa kooriviljapuljong (600 ml), keeda kaetult 12–15 min.\n3. Kuumuta oliivõli pannil, lisa musta küüslaugu pasta, sega 30 sek.\n4. Lisa pelati tomatid, hauta 5 min.\n5. Sega röstitud tatar kastmesse, lisa oliivid.\n6. Nirista oliivõli ja serveeri.',
      homeIng: '200 g šampinjone (valikuline), sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Musta küüslaugu pasta', pid: '18035', qty: 1, unit: 'spl', req: true, a1: '18036', a2: '18033' },
        { label: 'Pelati tomatid', pid: '189', qty: 200, unit: 'g', req: true, a1: '191', a2: '196' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 5, unit: 'g', req: true, a1: '125' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    // 11. Röstitud tatar mandlivõie ja marja hommikukauss
    {
      id: 'roostitud_tatar_mandlivoi_marmelaad',
      name: 'Röstitud tatar mandlivõie ja marmelaadiga hommikukauss',
      aliases: 'röstitud tatar mandlivõi; kasha mandlivõi marmelaad; roasted buckwheat almond butter berry; röstitud tatar hommikusöök',
      tags: 'röstitud tatar;tatrakruup;mandlivõi;marmelaad;kookospiim;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Vala peale kookospiim, keeda kaetult madalal tulel 12–15 min.\n3. Lisa vahtrasiirup, sega.\n4. Tõsta kaussidesse, lisa mandlivõie ja vaarika marmelaad.\n5. Puista kõrvitsaseemned peale ja serveeri soojalt.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 180, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kookospiim', pid: '1123', qty: 250, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Mandlivõie (Almondo)', pid: '18029', qty: 2, unit: 'spl', req: true, a1: '18028', a2: '18025' },
        { label: 'Vaarika marmelaad', pid: '18065', qty: 2, unit: 'spl', req: true, a1: '18066', a2: '233' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 20, unit: 'g', req: false, a1: '586', a2: '593' }
      ]
    },

    // 12. Röstitud tatar–mustad oad tomatikastmega (täisväärtuslik pearoog)
    {
      id: 'roostitud_tatar_mustad_oad_tomat',
      name: 'Röstitud tatar mustade oadega tomatikastmes',
      aliases: 'röstitud tatar mustad oad; kasha mustad oad tomatikaste; roasted buckwheat black bean tomato; röstitud tatar oad hautis',
      tags: 'röstitud tatar;tatrakruup;mustad oad;tomatikaste;gluteenivaba;vegan;pearoog;hautis',
      servings: 3,
      steps: '1. RÖSTI tatar: Kuumuta tatrakruup kuival pannil 3–5 min segades kuni kuldpruun.\n2. Lisa soolaga maitsestatud vesi (1:2), keeda kaetult 12–15 min.\n3. Soojenda tomatikaste koos mustade oadega potis 6–8 min.\n4. Sega röstitud tatar kastmesse.\n5. Lisa oliivõli, palsamiäädikas, maitsesta ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrakruup (röstida enne keetmist)', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Mustad oad', pid: '292', qty: 240, unit: 'g', req: true, a1: '819', a2: '822' },
        { label: 'Tomatikaste köögiviljadega', pid: '200', qty: 350, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 1, unit: 'spl', req: false, a1: '181', a2: '494' }
      ]
    }

  ]; // END RECIPES

  var newRecipes = RECIPES.filter(function(r) { return !existingIds[r.id]; });

  if (newRecipes.length === 0) {
    Logger.log('Kõik retseptid on juba olemas – midagi ei lisata.');
    return;
  }

  var rows = newRecipes.map(makeRow);
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, lastCol).setValues(rows);
  Logger.log('Lisatud ' + rows.length + ' röstitud tatar retsepti Recipe_Bank lehele. ✅');
  SpreadsheetApp.flush();
}
