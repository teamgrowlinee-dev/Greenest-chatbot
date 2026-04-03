/**
 * writeGreenestBlogRecipes()
 * Lisa Greenesti blogi retseptid (kohandatud kataloogitoodetele) Recipe_Bank lehele.
 * Käivita seda funktsiooni GAS editoris (Run → writeGreenestBlogRecipes).
 */
function writeGreenestBlogRecipes() {
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

  // ================================================================
  // GREENESTI BLOGI RETSEPTID (kohandatud kataloogitoodetele)
  //
  // Toote ID-d: 18035=musta küüslaugu pasta, 18033=must küüslauk koorimata,
  // 18036=musta küüslaugu pulber, 691=toortatar, 182=oliivõli,
  // 494/181=õunaäädikas, 499=kookosõli, 501=neitsi kookosõli,
  // 126/125=puljong, 1133=kookoskreem, 1123=kookospiim 330ml,
  // 1125=kookospiim 400ml, 189=pelati tomatid, 191=tomatipüree,
  // 18029=mandlivõi (almondo), 806=toorkakaopulber, 138=kakaopulber,
  // 582=kreeka pähklid 100g, 583=kreeka pähklid 300g,
  // 3221=kivideta datlid, 18032=choco hansZolo sarapuupähklivõie šokolaadiga,
  // 18031=choco manolo maapähklivõie šokolaadiga,
  // 604=vahtrasiirup, 168=akaatsiamesi, 596=kookosõiesuhkur,
  // 817=kikerherned 400g, 825=mungoad 400g, 819=valged oad,
  // 585=kõrvitsaseemned 150g, 586=kõrvitsaseemned 350g,
  // 566=blanšeeritud mandlid 100g, 567=mandlid 350g,
  // 593=mandlilaastud, 15436=kookoshelbed 2kg,
  // 4421=sidrunimahl, 921=sidrunikoor,
  // 139=jahvatatud kohv espresso 250g, 140=jahvatatud kohv moka,
  // 391=vaarikamahl 330ml, 392=vaarikamahl 750ml, 7517=kuivatatud vaarikad,
  // 345=kookosvesi, 325=küpsetuspulber, 537=sorgojahu, 18054=tatrajahu,
  // 530=tahhiini, 18039=tatramüsli rosinatega, 18045=tatrapasta fusilli,
  // 18046=tatrapasta spaccatella, 180=palsamiäädikas, 314=kaneelisuhkur,
  // 18025=maapähklivõi (smuuud), 18028=kašu või
  // ================================================================

  var RECIPES = [

    // ── BLOGI RETSEPT: Musta küüslaugu metsaseene püreesupp ─────────────
    // Allikas: https://greenest.ee/et/blogi/retsept-musta-kuuslaugu-metsaseene-pureesupp
    {
      id: 'blog_must_kuuslaugu_seenesupp',
      name: 'Musta küüslaugu metsaseene püreesupp',
      aliases: 'must küüslauk seenesupp; musta küüslaugu supp; black garlic mushroom soup; must küüslauk püreesupp; seenesupp',
      tags: 'must küüslauk;seened;püreesupp;gluteenivaba;vegan;supp;pearoog',
      servings: 3,
      steps: '1. Haki sibul ja küüslauk peeneks. Kuumuta potis kookosõli, lisa sibul ja küüslauk, pruunista kergelt ca 1 minuti.\n2. Lisa sool, pipar ja seened (sh külmutatud metsaseened), pruunista kuldkollaseks.\n3. Vala peale kooriviljapuljong, hauta 10 min.\n4. Lisa kookoskreem, kuumuta keemiseni.\n5. Sega sisse musta küüslaugu pasta ja kurkum (valikuline).\n6. Saumikserda ühtlaseks krõmpsevaks püreeks.\n7. Serveeri peeneks hakitud ürtidega.',
      homeIng: '1 suur sibul, 3 küüslauguküünt, 400 g külmutatud metsaseeni, 250 g šampinjone, sool, pipar, kurkum (valikuline), värsked ürdid',
      vegan: true, gf: true,
      ings: [
        { label: 'Musta küüslaugu pasta', pid: '18035', qty: 1, unit: 'tl', req: true, a1: '18036', a2: '18033' },
        { label: 'Kookoskreem', pid: '1133', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1123' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 10, unit: 'g', req: true, a1: '125' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: true, a1: '499', a2: '182' }
      ]
    },

    // ── BLOGI RETSEPT: Toortatar ja roheline (kohandatud vegan versioon) ─
    // Allikas: https://greenest.ee/et/blogi/retsept-toortatar-ja-roheline-100-g-135-kcal
    {
      id: 'blog_toortatar_roheline_kauss',
      name: 'Toortatar ja roheline kauss oliividega',
      aliases: 'toortatar roheline; toor-tatarkauss; buckwheat green bowl; toortatar köögivili; tatar roheline kauss',
      tags: 'toortatar;köögivili;oliivõli;gluteenivaba;vegan;pearoog;kauss',
      servings: 2,
      steps: '1. Kuumuta potis kookosõli, lisa toortatar ja sega 30 sekundit.\n2. Lisa soolaga maitsestatud vesi (1:2 suhe), keeda madalal tulel ca 20 min kaanetult kuni vesi on imendunud. Ära sega keetmise ajal.\n3. Kuumuta pannil oliivõli, lisa herned ja brokkoli (mõlemad sobivad ka külmutatult), prae 5 min.\n4. Lisa oliivid ja kuivatatud tomatid, sega läbi.\n5. Tõsta tatar kaussidesse, lisa köögiviljad peale.\n6. Nirista oliivõli, lisa õunaäädika tilgake ja serveeri.',
      homeIng: '150 g herneid (värske või külmutatud), 150 g brokkolit, 1 küüslauguküünt, sool, pipar, tšillihelbed',
      vegan: true, gf: true,
      ings: [
        { label: 'Toortatar', pid: '691', qty: 200, unit: 'g', req: true, a1: '18055', a2: '18056' },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 40, unit: 'g', req: false },
        { label: 'Õunaäädikas', pid: '494', qty: 1, unit: 'tl', req: false, a1: '181', a2: '180' }
      ]
    },

    // ── BLOGI RETSEPT: Natty bataadi brownie mandlivõiega ───────────────
    // Allikas: https://greenest.ee/et/blogi/retsept-natty-bataadi-brownie-metspahklitega
    {
      id: 'blog_bataadi_brownie_mandlivoi',
      name: 'Mandlivõie bataadi brownie toorkakaoga',
      aliases: 'bataadi brownie mandlivõi; natty brownie bataadiga; bataat šokolaadi brownie; mandlivõi brownie',
      tags: 'mandlivõi;toorkakaopulber;kookosõli;kreeka pähklid;brownie;magustoit;küpsetised;gluteenivaba;vegan',
      servings: 6,
      steps: '1. Koori ja tükelda bataat (ca 800 g), küpseta 200°C ahjus 20 min kuni pehme.\n2. Sega keedetud bataat, mandlivõi, kookosõli ja datlid blenderis ühtlaseks.\n3. Tõsta kaussi, sega sisse toorkakaopulber ja kreeka pähklid.\n4. Vala 24×18 cm vormi, küpseta 180°C ahjus ca 40–45 min.\n5. Jahuta täielikult enne lõikamist — maitseb järgmisel päeval paremini.',
      homeIng: '800 g bataati, näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Mandlivõie (Almondo)', pid: '18029', qty: 70, unit: 'g', req: true, a1: '18028', a2: '18025' },
        { label: 'Toorkakaopulber', pid: '806', qty: 50, unit: 'g', req: true, a1: '138' },
        { label: 'Kookosõli', pid: '501', qty: 50, unit: 'g', req: true, a1: '499' },
        { label: 'Kreeka pähklid', pid: '582', qty: 70, unit: 'g', req: true, a1: '583', a2: '566' },
        { label: 'Kivideta datlid', pid: '3221', qty: 100, unit: 'g', req: true }
      ]
    },

    // ── BLOGI RETSEPT: Choco HansZolo hommikupuder ──────────────────────
    // Allikas: https://greenest.ee/et/blogi/retsept-luksuslik-natty-bananaai-sokolaadi-hommikupuder
    {
      id: 'blog_choco_hansZolo_hommikupuder',
      name: 'Choco HansZolo šokolaadi-pähklivõi hommikukauss',
      aliases: 'choco hansZolo puder; šokolaadi maapähklivõi hommikusöök; choco manolo hommikupuder; šokolaad pähklivõi kauss',
      tags: 'šokolaad;pähklivõi;kookospiim;hommikusöök;vegan;gluteenivaba',
      servings: 2,
      steps: '1. Keeda tatratang kookospiimas 15 min segades kuni pehme.\n2. Lisa Choco HansZolo šokolaadivõie ja vahtrasiirup, sega kuni ühtlane.\n3. Lisa kreeka pähklid ja kaneelisuhkur.\n4. Tõsta kaussidesse ja serveeri soojalt.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatratang', pid: '18056', qty: 80, unit: 'g', req: true, a1: '18055', a2: '18039' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Choco HansZolo šokolaadivõie', pid: '18032', qty: 2, unit: 'spl', req: true, a1: '18031', a2: '18029' },
        { label: 'Kreeka pähklid', pid: '582', qty: 20, unit: 'g', req: false, a1: '583', a2: '579' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kaneelisuhkur', pid: '314', qty: 0.5, unit: 'tl', req: false }
      ]
    },

    // ── BLOGI RETSEPT: 15-minuti karri kookoskreemiga ───────────────────
    // Allikas: https://greenest.ee/et/blogi/retsept-15-minuti-karri
    {
      id: 'blog_15min_karri_kookoskreem',
      name: '15-minuti karri kookoskreemi ja kikerhernestega',
      aliases: '15 minuti karri; kiire karri kookos; quick curry; kiire kikerherne karri kookos; 15 min karri',
      tags: 'karri;kookoskreem;kikerherned;gluteenivaba;vegan;pearoog;kiire',
      servings: 3,
      steps: '1. Haki sibul ja küüslauk peeneks. Kuumuta oliivõli pannil, prae sibulat madalal kuumusel 6–8 min.\n2. Lisa ingver, vürtsid (tšilli, kurkum, koriandri seemned, garam masala). Tõsta kuumust ja prae 1 min.\n3. Lisa pelati tomatid (purustatud), sega läbi.\n4. Lisa kookoskreem, kuumuta keemiseni ja hauta 6–7 min.\n5. Lisa kikerherned, hauta 5 min.\n6. Maitsesta sidrunimahlaga, sool, pipar.\n7. Serveeri tatratangu, tatrakruupu või tatrapastaga.',
      homeIng: '1 suur punane sibul, 3 suurt küüslauguküünt, peotäis riivitud ingverit, tšillihelbed, kurkum, garam masala, koriandri seemned, sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookoskreem', pid: '1133', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1123' },
        { label: 'Pelati tomatid', pid: '189', qty: 400, unit: 'g', req: true, a1: '191', a2: '196' },
        { label: 'Kikerherned', pid: '817', qty: 240, unit: 'g', req: true, a1: '816', a2: '825' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' },
        { label: 'Sidrunimahl', pid: '4421', qty: 1, unit: 'spl', req: false, a1: '181' }
      ]
    },

    // ── BLOGI RETSEPT: Kodukootud granola kookoshelbedega ───────────────
    // Allikas: https://greenest.ee/et/blogi/retsept-kodukootud-musli-100-g-500-kcal
    {
      id: 'blog_kodukootud_granola_kookos',
      name: 'Kodukootud granola kookoshelbede ja pähklitega',
      aliases: 'kodugranola; kodumüsli; homemade granola; kodukootud müsli; granola kookoshelbed pähklid',
      tags: 'granola;kookoshelbed;pähklid;kõrvitsaseemned;mandlid;hommikusöök;vegan;gluteenivaba;küpsetised',
      servings: 6,
      steps: '1. Haki pähklid (kreeka pähklid, mandlid) sobivaks suuruseks.\n2. Sega kausis kõik kuivained: kõrvitsaseemned, mandlid, kreeka pähklid, kookoshelbed, kuivatatud vaarikad.\n3. Sulata kookosõli ja vahtrasiirup koos madalal tulel.\n4. Vala kuivainete peale ja sega hästi läbi.\n5. Laota ahjuplaadile ühtlase kihina.\n6. Küpseta 180°C ahjus 15–18 min, segades korra vahepeal, kuni kuldpruun.\n7. Jahuta täielikult, säilita suletud purgis.',
      homeIng: 'soovi korral linaseemned, päevalilleseemned',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookoshelbed', pid: '15436', qty: 80, unit: 'g', req: true },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 70, unit: 'g', req: true, a1: '586', a2: '588' },
        { label: 'Mandlid', pid: '566', qty: 80, unit: 'g', req: true, a1: '567', a2: '593' },
        { label: 'Kreeka pähklid', pid: '582', qty: 80, unit: 'g', req: false, a1: '583', a2: '579' },
        { label: 'Kookosõli', pid: '501', qty: 40, unit: 'g', req: true, a1: '499' },
        { label: 'Vahtrasiirup', pid: '604', qty: 50, unit: 'ml', req: true, a1: '168', a2: '596' },
        { label: 'Kuivatatud vaarikad', pid: '7517', qty: 30, unit: 'g', req: false }
      ]
    },

    // ── BLOGI RETSEPT: Gluteenivaba lameleib (kohandatud tatrajahuga) ────
    // Allikas: https://greenest.ee/et/blogi/retsept-gluteenivaba-lameleib-100-g-250-kcal
    {
      id: 'blog_gluteenivaba_lameleib_tatrajahu',
      name: 'Gluteenivaba lameleib tatrajahu ja kookospiimaga',
      aliases: 'gluteenivaba lameleib; tatrajahu lameleib; flatbread gluten free; gluteenivaba leib tatrajahu; tatar lameleib',
      tags: 'tatrajahu;kookospiim;lameleib;leib;küpsetised;gluteenivaba;vegan',
      servings: 4,
      steps: '1. Sega tatrajahu, sorgojahu, küpsetuspulber ja sool kausis.\n2. Lisa kookospiim ja õunaäädikas, sega kuni tainas on niiske ja elastne.\n3. Lase tainal 5 min puhata.\n4. Jaota 6–8 tükiks, vormi lamedateks ketasteks (ca 5 mm).\n5. Prae oliivõlis pannil mõlemalt poolt ca 2 min kuni kuldpruunid laigud ilmuvad.\n6. Serveeri soojalt.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatrajahu', pid: '18054', qty: 100, unit: 'g', req: true, a1: '537' },
        { label: 'Sorgojahu', pid: '537', qty: 80, unit: 'g', req: true, a1: '18054' },
        { label: 'Kookospiim', pid: '1125', qty: 200, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Küpsetuspulber', pid: '325', qty: 1, unit: 'tl', req: true },
        { label: 'Õunaäädikas', pid: '494', qty: 1, unit: 'tl', req: false, a1: '181' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    // ── BLOGI INSPIREERITUD: Kohvismuuti vaarika-mandlitega ─────────────
    // Allikas: https://greenest.ee/et/blogi/retsept-kohvismuuti-macaga-100-g-50-kcal
    {
      id: 'blog_kohvismuuti_vaarika',
      name: 'Kohvismuuti vaarika ja mandlivõiega',
      aliases: 'kohvismuuti; coffee smoothie; kohv smuuti vaarika; kohvismuuti mandlivõi; espresso smuuti',
      tags: 'kohv;vaarikamahl;mandlivõi;smuuti;gluteenivaba;vegan;hommikusöök;jook',
      servings: 1,
      steps: '1. Tee espresso või tugev filter kohv, jahuta.\n2. Lisa blenderisse külmutatud vaarikad (või vaarikamahl), mandlivõie, kookosvesi.\n3. Lisa jahutatud kohv.\n4. Blenderda ühtlaseks.\n5. Serveeri kohe.',
      homeIng: '1 ports espresso või tugev kohv, peotäis külmutatud vaarikaid',
      vegan: true, gf: true,
      ings: [
        { label: 'Jahvatatud kohv espresso', pid: '139', qty: 10, unit: 'g', req: true, a1: '140', a2: '141' },
        { label: 'Vaarikamahl', pid: '391', qty: 100, unit: 'ml', req: true, a1: '392', a2: '7517' },
        { label: 'Mandlivõie (Almondo)', pid: '18029', qty: 1, unit: 'spl', req: false, a1: '18028', a2: '18025' },
        { label: 'Kookosvesi', pid: '345', qty: 100, unit: 'ml', req: false, a1: '1123' }
      ]
    },

    // ── BLOGI INSPIREERITUD: Roheline smuuti kookosveega ────────────────
    // Allikas: https://greenest.ee/et/blogi/retsept-roheline-smuuti-tervislik-ja-oi-kui-maitsev
    {
      id: 'blog_roheline_smuuti_kookosvesi',
      name: 'Roheline smuuti kookosveega ja kõrvitsaseemnetega',
      aliases: 'roheline smuuti; green smoothie kookos; kookosvesi smuuti; roheline smuuti seemned; green smoothie',
      tags: 'kookosvesi;kõrvitsaseemned;smuuti;gluteenivaba;vegan;hommikusöök;jook',
      servings: 2,
      steps: '1. Lisa blenderisse kookosvesi, spinat (2 peotäit), banaan ja ananassi tükid.\n2. Lisa kõrvitsaseemned.\n3. Blenderda ühtlaseks siidiseks segaks.\n4. Vajaduse korral lisa jääd, serveeri kohe.',
      homeIng: '2 peotäit spinatit, 1 banaan, 1 tass ananassi tükke, valikuline: jääkuubikud',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookosvesi', pid: '345', qty: 250, unit: 'ml', req: true },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 20, unit: 'g', req: false, a1: '586', a2: '593' }
      ]
    },

    // ── BLOGI INSPIREERITUD: Porgandipüreesupp musta küüslauguga ─────────
    // Allikas: https://greenest.ee/et/blogi/retsept-porgandipureesupp-valge-misoga-100-g-635-kcal
    {
      id: 'blog_porkandisupp_must_kuuslauk',
      name: 'Porgandipüreesupp musta küüslaugu pastaga',
      aliases: 'porgandipüreesupp must küüslauk; carrot soup black garlic; porkandisupp must küüslauk; porgandi must küüslaugu supp',
      tags: 'must küüslauk;porgand;püreesupp;gluteenivaba;vegan;supp;pearoog',
      servings: 3,
      steps: '1. Koori ja tükelda porgandid (ca 350 g), haki sibul.\n2. Kuumuta potis kookosõli, lisa sibul, prae 3–4 min.\n3. Lisa porgandid, riivitud ingver ja kurkum, sega.\n4. Vala peale kooriviljapuljong (ca 500 ml), keeda 20–25 min kuni porgandid pehmed.\n5. Sega sisse musta küüslaugu pasta.\n6. Saumikserda ühtlaseks.\n7. Maitsesta, lisa kõrvitsaseemned peale ja nirista oliivõli.',
      homeIng: '350 g porgandit, 1 sibul, tükike ingverit, 0.5 tl kurkumit, sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Musta küüslaugu pasta', pid: '18035', qty: 1, unit: 'spl', req: true, a1: '18036', a2: '18033' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: true, a1: '499', a2: '182' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 10, unit: 'g', req: true, a1: '125' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 20, unit: 'g', req: false, a1: '586', a2: '593' },
        { label: 'Oliivõli', pid: '182', qty: 1, unit: 'spl', req: false, a1: '183' }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: Musta küüslaugu tatrapasta ─────────────
    {
      id: 'must_kuuslaugu_tatrapasta',
      name: 'Musta küüslaugu tatrapasta oliividega',
      aliases: 'must küüslauk tatrapasta; musta küüslaugu pasta; black garlic buckwheat pasta; tatrapasta must küüslauk',
      tags: 'tatrapasta;must küüslauk;oliivid;gluteenivaba;vegan;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda tatrapasta soolaga maitsestatud vees 8–10 min, kurna.\n2. Kuumuta oliivõli pannil, lisa musta küüslaugu pasta, sega 30 sekundit.\n3. Lisa pelati tomatid, hauta 5 min.\n4. Sega pasta kastmesse, lisa oliivid.\n5. Nirista oliivõli, maitsesta ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta fusilli', pid: '18045', qty: 200, unit: 'g', req: true, a1: '18046', a2: '18047' },
        { label: 'Musta küüslaugu pasta', pid: '18035', qty: 1, unit: 'spl', req: true, a1: '18036', a2: '18033' },
        { label: 'Pelati tomatid', pid: '189', qty: 200, unit: 'g', req: true, a1: '191', a2: '196' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: Musta küüslaugu kikerherne hautis ──────
    {
      id: 'must_kuuslaugu_kikerherne_hautis',
      name: 'Musta küüslaugu kikerherne–tomati hautis',
      aliases: 'must küüslauk kikerherned; musta küüslaugu kikerherne; black garlic chickpea stew; must küüslauk hautis',
      tags: 'must küüslauk;kikerherned;tomatikaste;hautis;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Kuumuta oliivõli potis. Lisa musta küüslaugu pasta, sega 30 sekundit.\n2. Lisa tomatikaste ja kookospiim, kuumuta keemiseni.\n3. Lisa kikerherned, hauta 10 min.\n4. Maitsesta, nirista oliivõli.\n5. Serveeri tatrakruubu, tatratangu või tatrapastaga.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Musta küüslaugu pasta', pid: '18035', qty: 1, unit: 'spl', req: true, a1: '18036', a2: '18033' },
        { label: 'Kikerherned', pid: '817', qty: 240, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Tomatikaste', pid: '196', qty: 300, unit: 'g', req: true, a1: '197', a2: '200' },
        { label: 'Kookospiim', pid: '1123', qty: 150, unit: 'ml', req: false, a1: '1125', a2: '1133' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: Choco Manolo energiapallid ─────────────
    {
      id: 'choco_manolo_datli_energiapallid',
      name: 'Choco Manolo–datli energiapallid kookoshelbedega',
      aliases: 'choco manolo energiapallid; šokolaad maapähklivõi pallid; choco manolo datlid; šokolaadi energiapallid kookos',
      tags: 'maapähklivõi;šokolaad;datlid;kookoshelbed;energiapallid;gluteenivaba;vegan;magustoit',
      servings: 4,
      steps: '1. Purusta datlid blenderis peeneks.\n2. Sega Choco Manolo maapähklivõie, datlid ja kakaopulber ühtlaseks tainaks.\n3. Vormi märgade kätega pallid (ca 3 cm).\n4. Rulli kookoshelbedes.\n5. Hoia külmkapis vähemalt 30 min enne serveerimist.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Choco Manolo maapähklivõie', pid: '18031', qty: 100, unit: 'g', req: true, a1: '18032', a2: '18025' },
        { label: 'Kivideta datlid', pid: '3221', qty: 80, unit: 'g', req: true },
        { label: 'Kakaopulber', pid: '138', qty: 2, unit: 'spl', req: false, a1: '806' },
        { label: 'Kookoshelbed', pid: '15436', qty: 50, unit: 'g', req: true }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: India pähklivõi-kookosjäätise kauss ────
    {
      id: 'india_pahkli_kookosjäätis_kauss',
      name: 'Kašu võie–kookosjäätise dessert',
      aliases: 'kašu või jäätis; kašu kookosjäätis; cashew coconut ice cream bowl; india pähklivõi jäätis kauss',
      tags: 'kašu;india pähklivõi;kookosjäätis;magustoit;gluteenivaba;vegan;dessert',
      servings: 2,
      steps: '1. Võta kookosjäätis 5 min enne serveerimist sügavkülmast välja.\n2. Tõsta pallid kaussidesse.\n3. Lisa kašu võie (sulata kergelt mikrolaineahjus 20 sekundit, et jooksev oleks).\n4. Puista kreeka pähklid ja kookoshelbed peale.\n5. Nirista vahtrasiirup ja serveeri kohe.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookosjäätis mangoga', pid: '18074', qty: 250, unit: 'ml', req: true },
        { label: 'Kašu võie', pid: '18028', qty: 2, unit: 'spl', req: true, a1: '18025', a2: '18029' },
        { label: 'Kreeka pähklid', pid: '582', qty: 20, unit: 'g', req: false, a1: '583', a2: '566' },
        { label: 'Kookoshelbed', pid: '15436', qty: 10, unit: 'g', req: false },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168', a2: '596' }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: Musta küüslaugu mungoa karri ──────────
    {
      id: 'must_kuuslaugu_mungoa_karri',
      name: 'Musta küüslaugu mungoa karri kookospiimaga',
      aliases: 'must küüslauk mungoad; musta küüslaugu karri; black garlic mung bean curry; must küüslauk kookos karri',
      tags: 'must küüslauk;mungoad;kookospiim;karri;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Keeda mungoad pehmes soolaga maitsestatud vees 25–30 min, kurna.\n2. Kuumuta kookosõli potis, lisa musta küüslaugu pasta, sega 30 sekundit.\n3. Lisa kookospiim ja tomatipüree, hauta 5 min.\n4. Lisa mungoad, hauta 8 min.\n5. Maitsesta sidrunimahlaga.\n6. Serveeri tatrakruubu, tatratangu või tatrapastaga.',
      homeIng: 'sool, pipar, näpuotsatäis kurkumit',
      vegan: true, gf: true,
      ings: [
        { label: 'Musta küüslaugu pasta', pid: '18035', qty: 1, unit: 'spl', req: true, a1: '18036', a2: '18033' },
        { label: 'Mungoad', pid: '825', qty: 200, unit: 'g', req: true, a1: '824', a2: '817' },
        { label: 'Kookospiim', pid: '1125', qty: 200, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Tomatipüree', pid: '191', qty: 200, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: true, a1: '499', a2: '182' },
        { label: 'Sidrunimahl', pid: '4421', qty: 1, unit: 'spl', req: false, a1: '181' }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: Granola vaarikamarmelaadiga ─────────────
    {
      id: 'granola_marmelaad_india_pahkli_kauss',
      name: 'Granola marmelaadi ja india pähklitega kauss',
      aliases: 'granola marmelaad; tatramüsli marmelaad india pähklid; granola kauss; tatramüsli india pähkel marmelaad',
      tags: 'tatramüsli;marmelaad;india pähklid;kookospiim;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Tõsta tatramüsli kaussidesse.\n2. Vala peale kookospiim, lase 3 min paisuda.\n3. Lisa india pähklid.\n4. Pane peale vaarika marmelaad.\n5. Sega kergelt ja serveeri.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatramüsli rosinatega', pid: '18039', qty: 80, unit: 'g', req: true, a1: '18040', a2: '242' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'India pähklid', pid: '579', qty: 30, unit: 'g', req: false, a1: '968', a2: '582' },
        { label: 'Vaarika marmelaad', pid: '18065', qty: 2, unit: 'spl', req: true, a1: '18066', a2: '233' }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: Toortatar-oliivi hommikukauss ──────────
    {
      id: 'toortatar_oliiv_tomati_kauss',
      name: 'Toortatar–oliivi ja tomatiga hommikukauss',
      aliases: 'toortatar oliivid; toor-tatar oliiv tomat; buckwheat olive tomato bowl; toortatar vahemere kauss',
      tags: 'toortatar;oliivid;kuivatatud tomatid;gluteenivaba;vegan;pearoog;kauss;vahemere',
      servings: 2,
      steps: '1. Loputa toortatar ja leota 1 tund (või üle öö) külmas vees, kurna.\n2. Sega toortatar, oliivid, kuivatatud tomatid.\n3. Kastmeks sega oliivõli, palsamiäädikas, sool.\n4. Vala kaste peale, sega ja serveeri.\n(Ei vaja keetmist — leotamine on piisav!)',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Toortatar', pid: '691', qty: 150, unit: 'g', req: true, a1: '18055', a2: '18056' },
        { label: 'Rohelised oliivid', pid: '184', qty: 80, unit: 'g', req: true },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: true },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: true, a1: '181', a2: '494' }
      ]
    },

    // ── KATALOOGIST INSPIREERITUD: Sidrunisuhkru-mandlivõie kauss ──────────
    {
      id: 'sidrunisuhkur_mandlivoi_tatramysli',
      name: 'Sidrunisuhkru mandlivõie tatramüsli kauss',
      aliases: 'sidrunisuhkur tatramüsli; mandlivõi sidrunisuhkur kauss; lemon sugar muesli bowl; tatramüsli mandlivõi sidrun',
      tags: 'sidrunisuhkur;mandlivõi;tatramüsli;kookospiim;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Tõsta tatramüsli kaussidesse.\n2. Lisa mandlivõie ja sidrunisuhkur, sega.\n3. Vala peale kookospiim, lase 3 min paisuda.\n4. Puista mandlilaastud peale ja serveeri.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatramüsli rosinatega', pid: '18039', qty: 80, unit: 'g', req: true, a1: '18040', a2: '242' },
        { label: 'Mandlivõie (Almondo)', pid: '18029', qty: 2, unit: 'spl', req: true, a1: '18028', a2: '18025' },
        { label: 'Sidrunisuhkur', pid: '315', qty: 1, unit: 'tl', req: true, a1: '314', a2: '596' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125' },
        { label: 'Mandlilaastud', pid: '593', qty: 15, unit: 'g', req: false, a1: '566', a2: '579' }
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
  Logger.log('Lisatud ' + rows.length + ' uut retsepti Recipe_Bank lehele. ✅');
  SpreadsheetApp.flush();
}
