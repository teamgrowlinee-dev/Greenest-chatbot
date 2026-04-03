/**
 * writeNewRecipes()
 * Lisa ~50 uut retsepti Recipe_Bank lehele.
 * Käivita seda funktsiooni GAS editoris (Run → writeNewRecipes).
 */
function writeNewRecipes() {
  var ss = SpreadsheetApp.openById('17_DHr_1NQWUOa-SWUu2t7y0eK2ntB9V24alfZbMMBgE');
  var sh = ss.getSheetByName('Recipe_Bank');

  // Loe päis ja ehita veerukaart
  var lastCol = sh.getLastColumn();
  var header = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var colMap = {};
  header.forEach(function(h, i) { if (h) colMap[String(h).trim()] = i; });

  // Olemasolevad recipe_id-d (duplikaatide vältimiseks)
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

  // ============================================================
  // 50 UUED RETSEPTID
  // Tootekoodid: 18055=tatrakruup, 18056=tatratang, 18053=tatramanna,
  // 18054=tatrajahu, 691=toortatar, 18045=tatrapasta fusilli (vegan),
  // 18046=tatrapasta spaccatella, 18047=tatrapasta penne lisce,
  // 18048=tatrapasta conchigliette, 114=spelta mie nuudlid,
  // 685=bulgur 1kg, 686=bulgur 500g, 683=amarant 1kg, 684=amarant 500g,
  // 817=kikerherned 400g, 816=kikerherned 1kg, 292=mustad oad 400g,
  // 819=valged oad 400g, 822=punased oad 1kg, 824=mungoad 1kg, 825=mungoad 400g,
  // 15664=rohelised läätsed 5kg, 3340=rohelised läätsed 25kg,
  // 196=tomatikaste 500g, 195=tomatikaste 3x200g, 197=tomatikaste basiilikuga,
  // 198=tomatikaste puravikkudega, 200=tomatikaste köögiviljadega,
  // 13796=arrabiata kaste, 15255=bolognese kaste,
  // 189=pelati tomatid 400g, 191=tomatipüree 500g, 503=tomatipüree 500ml,
  // 190=kuivatatud tomatid oliivõlis,
  // 182=oliivõli 750ml, 183=oliivõli lastele 250ml,
  // 184=rohelised oliivid 350g,
  // 1123=kookospiim 330ml, 1125=kookospiim 400ml, 1133=kookoskreem 400ml,
  // 499=kookosõli, 501=neitsi kookosõli, 15436=kookoshelbed 2kg,
  // 579=india pähklid 350g, 968=india pähklid 75g,
  // 582=kreeka pähklid 100g, 583=kreeka pähklid 300g,
  // 566=blanšeeritud mandlid 100g, 567=mandlid 350g, 593=mandlilaastud 100g,
  // 585=kõrvitsaseemned 150g, 586=kõrvitsaseemned 350g,
  // 530=tahhiini 180g, 831=maapähklid 350g, 3941=makadaamia 200g,
  // 18025=maapähklivõi (smuuud), 18028=kašu või, 18029=mandlivõi (almondo),
  // 138=kakaopulber 75g, 806=toorkakaopulber 150g,
  // 604=vahtrasiirup 250ml, 596=kookosõiesuhkur 300g,
  // 168=akaatsiamesi, 169=kastanimesi, 172=koriandrimesi,
  // 180=palsamiäädikas, 181=õunaäädikas, 494=õunaäädikas 250ml,
  // 125=köögiviljapuljongi kuubikud, 126=kooriviljapuljong,
  // 18039=tatramüsli rosinatega, 18040=tatramüsli kuivatatud õuntega,
  // 242=speltamüsli 500g, 3221=kivideta datlid 5kg, 14431=kuivatatud mango,
  // 7517=kuivatatud vaarikad 1kg, 921=sidrunikoor, 4421=sidrunimahl,
  // 537=sorgojahu 450g, 167=nisujahu 1kg, 325=küpsetuspulber 12g,
  // 386=söögisooda 1kg, 18049=tatraleivasegu köömnetega+juuretis,
  // 18050=tatraleivasegu kõrvitsaseemnetega+juuretis,
  // 18051=tatraleivasegu kanepi+kõrvitsaseemnetega+juuretis,
  // 18052=tatrakuiv juuretis, 314=kaneelisuhkur, 315=sidrunisuhkur,
  // 16726=tooršokolaad india pähkliga 77g, 16731=tooršokolaad mustikaga,
  // 18065=marmelaad vaarika 150g, 18066=marmelaad maasika 150g,
  // 232=mustikamoos 250g, 233=vaarikamoos 250g, 235=maasikamoos 250g
  // ============================================================

  var RECIPES = [

    // ── RÖSTITUD TATRAKRUUP / TATRATANG (7 retsepti) ─────────────────────

    {
      id: 'roostitud_tatrakruup_puder_kookos',
      name: 'Röstitud tatrakruupu puder kookospiimaga',
      aliases: 'tatrakruup puder; tatar puder; roostitud tatar puder; buckwheat porridge; tatrakruup kookos',
      tags: 'tatar;tatrakruup;puder;hommikusöök;gluteenivaba;vegan;kookospiim',
      servings: 2,
      steps: '1. Loputa tatrakruup külma veega.\n2. Pane kruup ja kookospiim potti, lisa natuke vett nii et kruup oleks kaetud.\n3. Kuumuta keemiseni, alanda kuumust ja hauta 15–20 min kaetult, kuni kruup on pehme.\n4. Maitsesta vahtrasiirupiga ja puista peale kaneelisuhkrut.\n5. Serveeri kohe.',
      homeIng: 'vesi, näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kaneelisuhkur', pid: '314', qty: 1, unit: 'tl', req: false }
      ]
    },

    {
      id: 'roostitud_tatratang_puder_mandlid_mesi',
      name: 'Röstitud tatratang puder mandlite ja vahtrasiirupiga',
      aliases: 'tatratang puder; tatratang hommikusöök; tatar puder mandlitega; tatratang porridge',
      tags: 'tatar;tatratang;puder;hommikusöök;gluteenivaba;vegan;mandlid',
      servings: 2,
      steps: '1. Loputa tatratang külma veega.\n2. Keeda tatratang kookospiimas 15–18 min, kuni pehme.\n3. Lisa mandlilaastud ja vahtrasiirup.\n4. Sega läbi ja serveeri.',
      homeIng: 'vesi, näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatratang', pid: '18056', qty: 200, unit: 'g', req: true, a1: '18055', a2: '691' },
        { label: 'Kookospiim', pid: '1125', qty: 250, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Mandlilaastud', pid: '593', qty: 30, unit: 'g', req: false, a1: '566', a2: '582' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' }
      ]
    },

    {
      id: 'tatrakruup_kikerherne_salat',
      name: 'Röstitud tatrakruup–kikerherne salat',
      aliases: 'tatrakruup salat; tatar kikerherne salat; buckwheat chickpea salad; tatrakruup kikerherned',
      tags: 'tatar;tatrakruup;salat;kikerherned;gluteenivaba;vegan;vahemere',
      servings: 2,
      steps: '1. Keeda tatrakruup soolaga maitsestatud vees 15 min, kurna ja jahuta.\n2. Sega kruup, kikerherned, oliivid, kuivatatud tomatid.\n3. Kastmeks sega oliivõli, palsamiäädikas, sool ja pipar.\n4. Vala kaste peale, sega ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 150, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kikerherned', pid: '817', qty: 240, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: true, a1: '181', a2: '494' }
      ]
    },

    {
      id: 'tatrakruup_tomatikaste_oliivid',
      name: 'Tatrakruup basiilikutomatikastes oliividega',
      aliases: 'tatrakruup tomatikastmega; tatar oliividega; tatrakruup basiilik; buckwheat tomato sauce',
      tags: 'tatar;tatrakruup;tomatikaste;oliivid;gluteenivaba;vegan;pearoog',
      servings: 2,
      steps: '1. Keeda tatrakruup soolaga maitsestatud vees 15 min, kurna.\n2. Soojenda tomatikaste basiilikuga pannil 3–4 min.\n3. Sega kruup kastmesse, lisa oliivid.\n4. Nirista peale oliivõli ja serveeri.',
      homeIng: 'sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Tomatikaste basiilikuga', pid: '197', qty: 500, unit: 'g', req: true, a1: '196', a2: '200' },
        { label: 'Rohelised oliivid', pid: '184', qty: 80, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'tatrakruup_punased_oad_hautis',
      name: 'Tatrakruup punaste oadega hautis',
      aliases: 'tatrakruup punased oad; tatar oad hautis; buckwheat red bean stew',
      tags: 'tatar;tatrakruup;punased oad;hautis;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Keeda tatrakruup soolaga maitsestatud vees 15 min, kurna.\n2. Prae kergelt kuumas pannis 1 min, lisa tomatipüree ja punased oad.\n3. Hauta 8–10 min, kuni kaste pakseneb.\n4. Sega kruup sisse, lisa oliivõli, maitsesta.\n5. Serveeri soojalt.',
      homeIng: 'sool, pipar, 1 sibul, 2 küüslauguküünt',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 150, unit: 'g', req: true, a1: '18056', a2: '685' },
        { label: 'Punased oad', pid: '822', qty: 240, unit: 'g', req: true, a1: '819', a2: '292' },
        { label: 'Tomatipüree', pid: '191', qty: 200, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    {
      id: 'roostitud_tatratang_hommikukauss_marmelaadiga',
      name: 'Röstitud tatratang hommikukauss marmelaadiga',
      aliases: 'tatratang hommikusöök; tatratang marmelaad; tatratang puder marmelaadiga; buckwheat breakfast bowl',
      tags: 'tatar;tatratang;hommikusöök;marmelaad;gluteenivaba;vegan;puder',
      servings: 2,
      steps: '1. Keeda tatratang kookospiimas 15 min, kuni pehme.\n2. Tõsta kaussidesse, pane peale 1–2 spl marmelaadi.\n3. Puista peale mandlilaastud ja nirista vahtrasiirupit.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatratang', pid: '18056', qty: 200, unit: 'g', req: true, a1: '18055', a2: '18053' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Vaarika marmelaad', pid: '18065', qty: 2, unit: 'spl', req: false, a1: '18066', a2: '233' },
        { label: 'Mandlilaastud', pid: '593', qty: 20, unit: 'g', req: false, a1: '566', a2: '579' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168' }
      ]
    },

    {
      id: 'tatratang_india_pahkli_kookoskauss',
      name: 'Tatratang india pähklite ja kookoshelbedega',
      aliases: 'tatratang india pähklid; tatratang kookoshelbed; buckwheat cashew bowl; tatratang hommik',
      tags: 'tatar;tatratang;india pähklid;kookoshelbed;gluteenivaba;vegan;hommikusöök',
      servings: 2,
      steps: '1. Keeda tatratang väheses vees 15 min, kurna.\n2. Sega vahtrasiirupi ja kookoshelbedega.\n3. Lisa india pähklid.\n4. Serveeri sooja või toatemperatuuril.',
      homeIng: 'vesi',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatratang', pid: '18056', qty: 180, unit: 'g', req: true, a1: '18055', a2: '691' },
        { label: 'India pähklid', pid: '579', qty: 40, unit: 'g', req: true, a1: '968', a2: '582' },
        { label: 'Kookoshelbed', pid: '15436', qty: 20, unit: 'g', req: false },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' }
      ]
    },

    // ── PASTA (8 retsepti) ────────────────────────────────────────────────

    {
      id: 'tatrapasta_penne_arrabiata',
      name: 'Tatrapasta penne arrabiata kastmega',
      aliases: 'tatrapasta arrabiata; penne arrabiata; arrabiata tatariga; buckwheat penne arrabiata',
      tags: 'tatrapasta;arrabiata;vürtsikas;vegan;gluteenivaba;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda tatrapasta penne soolaga maitsestatud vees vastavalt pakendi juhistele (ca 8–10 min), kurna.\n2. Soojenda arrabiata kaste pannil 3–4 min.\n3. Sega pasta kastmesse, lisa oliivid.\n4. Nirista peale oliivõli ja serveeri.',
      homeIng: 'sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta penne', pid: '18047', qty: 200, unit: 'g', req: true, a1: '18045', a2: '18046' },
        { label: 'Arrabiata kaste', pid: '13796', qty: 380, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'tatrapasta_conchigliette_mustad_oad',
      name: 'Tatrapasta conchigliette mustade oadega tomatikastmes',
      aliases: 'tatrapasta mustad oad; conchigliette mustad oad; buckwheat black bean pasta; tatar pasta oad',
      tags: 'tatrapasta;mustad oad;tomatikaste;vegan;gluteenivaba;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda tatrapasta conchigliette soolaga maitsestatud vees 8–10 min, kurna.\n2. Soojenda tomatikaste pannil, lisa mustad oad, hauta 5 min.\n3. Sega pasta sisse, maitsesta.\n4. Nirista peale oliivõli ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta conchigliette', pid: '18048', qty: 200, unit: 'g', req: true, a1: '18045', a2: '18047' },
        { label: 'Mustad oad', pid: '292', qty: 240, unit: 'g', req: true, a1: '819', a2: '822' },
        { label: 'Tomatikaste', pid: '196', qty: 300, unit: 'g', req: true, a1: '197', a2: '200' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'tatrapasta_spaccatella_kookospiim',
      name: 'Tatrapasta spaccatella kreemses kookoskastmes',
      aliases: 'tatrapasta spaccatella kookos; kreemine tatrapasta; buckwheat pasta coconut cream; tatar pasta kookos',
      tags: 'tatrapasta;kookospiim;kreemine;vegan;gluteenivaba;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda tatrapasta spaccatella soolaga maitsestatud vees 8–10 min, kurna.\n2. Kuumuta pannil kookospiim, lisa kuivatatud tomatid, hauta 5 min.\n3. Sega pasta sisse ja lase kastmel pakseneda 2–3 min.\n4. Maitsesta ja nirista oliivõli, serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta spaccatella', pid: '18046', qty: 200, unit: 'g', req: true, a1: '18045', a2: '18047' },
        { label: 'Kookospiim', pid: '1125', qty: 200, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'tatrapasta_puravikukastmega',
      name: 'Tatrapasta puravikutomatikastmega',
      aliases: 'tatrapasta puravik; tatar pasta seentega; buckwheat pasta mushroom sauce; tatrapasta seenekaste',
      tags: 'tatrapasta;puravik;tomatikaste;vegan;gluteenivaba;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda tatrapasta soolaga maitsestatud vees 8–10 min, kurna.\n2. Soojenda puravikutomatikaste pannil 4–5 min.\n3. Sega pasta kastmesse ja lase 2 min tõmmata.\n4. Nirista oliivõli, puista mandlilaastud ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta penne', pid: '18047', qty: 200, unit: 'g', req: true, a1: '18045', a2: '18046' },
        { label: 'Tomatikaste puravikkudega', pid: '198', qty: 400, unit: 'g', req: true, a1: '197', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' },
        { label: 'Mandlilaastud', pid: '593', qty: 20, unit: 'g', req: false, a1: '566', a2: '579' }
      ]
    },

    {
      id: 'tatrapasta_fusilli_valge_oa_tomat',
      name: 'Tatrapasta fusilli valge oa–tomatikastmega',
      aliases: 'tatrapasta valged oad; tatar pasta oad tomatiga; buckwheat pasta white bean; tatrapasta valge oa',
      tags: 'tatrapasta;valged oad;tomatikaste;vegan;gluteenivaba;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda tatrapasta fusilli soolaga maitsestatud vees 8–10 min, kurna.\n2. Soojenda tomatikaste koos valgete oadega pannil 5–6 min.\n3. Sega pasta kastmesse, lisa palsamiäädikas.\n4. Nirista oliivõli ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta fusilli', pid: '18045', qty: 200, unit: 'g', req: true, a1: '18046', a2: '18047' },
        { label: 'Valged oad', pid: '819', qty: 240, unit: 'g', req: true, a1: '817', a2: '292' },
        { label: 'Tomatikaste', pid: '196', qty: 300, unit: 'g', req: true, a1: '197', a2: '200' },
        { label: 'Palsamiäädikas', pid: '180', qty: 1, unit: 'spl', req: false, a1: '181', a2: '494' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'spelta_nuudlid_arrabiata',
      name: 'Spelta mie nuudlid arrabiata kastmega',
      aliases: 'spelta nuudlid arrabiata; spelta pasta arrabiata; mie noodles arrabiata; speltanuudlid vürtsikas',
      tags: 'spelta;nuudlid;arrabiata;vürtsikas;vegan;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda spelta mie nuudlid soolaga maitsestatud vees 5–7 min, kurna.\n2. Soojenda arrabiata kaste pannil 3–4 min.\n3. Sega nuudlid kastmesse, lisa kuivatatud tomatid ja oliivid.\n4. Nirista oliivõli ja serveeri.',
      homeIng: 'sool',
      vegan: true, gf: false,
      ings: [
        { label: 'Spelta mie nuudlid', pid: '114', qty: 200, unit: 'g', req: true },
        { label: 'Arrabiata kaste', pid: '13796', qty: 380, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'spelta_nuudlid_kookos_koorvili',
      name: 'Spelta nuudlid kookos-köögiviljasautéega',
      aliases: 'spelta nuudlid kookos; spelta mie kookospiim; spelt noodles coconut; speltanuudlid köögivilja',
      tags: 'spelta;nuudlid;kookospiim;vegan;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda spelta nuudlid soolaga maitsestatud vees 5–7 min, kurna.\n2. Kuumuta pannil oliivõli, lisa kookospiim ja kooriviljapuljong, hauta 4–5 min.\n3. Sega nuudlid sisse, lisa kuivatatud tomatid.\n4. Maitsesta ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: false,
      ings: [
        { label: 'Spelta mie nuudlid', pid: '114', qty: 200, unit: 'g', req: true },
        { label: 'Kookospiim', pid: '1125', qty: 200, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 10, unit: 'g', req: false, a1: '125' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 40, unit: 'g', req: false }
      ]
    },

    // ── SUPID (7 retsepti) ────────────────────────────────────────────────

    {
      id: 'tatrakruup_koorvili_supp',
      name: 'Tatrakruup–köögiviljapuljong supp',
      aliases: 'tatrakruup supp; tatar supp puljongiga; buckwheat vegetable soup; tatar kooriviljapuljong',
      tags: 'tatar;tatrakruup;supp;puljong;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Lahusta kooriviljapuljong 800 ml keevas vees.\n2. Lisa tatrakruup, keeda 15 min.\n3. Lisa tomatipüree, hauta 5 min.\n4. Nirista oliivõli, maitsesta ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 150, unit: 'g', req: true, a1: '18056', a2: '685' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 10, unit: 'g', req: true, a1: '125' },
        { label: 'Tomatipüree', pid: '191', qty: 200, unit: 'ml', req: false, a1: '503', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'mungoa_kookospiim_supp',
      name: 'Mungoa–kookospiima supp',
      aliases: 'mungoa supp kookos; mungoad supp; buckwheat mung bean soup; mungoa kookos tomat',
      tags: 'mungoad;kookospiim;supp;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Keeda mungoad pehme soolaga maitsestatud vees 25–30 min, kurna (või kasuta konservitud).\n2. Sega tomatipüree kookospiimaga, kuumuta keemiseni.\n3. Lisa mungoad, hauta 10 min.\n4. Maitsesta, nirista oliivõli ja serveeri.',
      homeIng: 'sool, pipar, vesi',
      vegan: true, gf: true,
      ings: [
        { label: 'Mungoad', pid: '825', qty: 200, unit: 'g', req: true, a1: '824', a2: '817' },
        { label: 'Kookospiim', pid: '1123', qty: 300, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Tomatipüree', pid: '191', qty: 200, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'roheline_laats_kikerherne_supp',
      name: 'Rohelise läätse–kikerherne supp',
      aliases: 'roheline läätsesupp; kikerhernesupp läätse; lentil chickpea soup; rohelised läätsed kikerherned',
      tags: 'rohelised läätsed;kikerherned;supp;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Keeda rohelised läätsed 20–25 min pehme (võid jätta pooleks keetuks).\n2. Lisa kikerherned, tomatipüree ja kookospiim.\n3. Hauta 10 min, maitsesta.\n4. Nirista oliivõli ja serveeri.',
      homeIng: 'sool, pipar, vesi',
      vegan: true, gf: true,
      ings: [
        { label: 'Rohelised läätsed', pid: '15664', qty: 150, unit: 'g', req: true, a1: '3340', a2: '3339' },
        { label: 'Kikerherned', pid: '817', qty: 200, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: false, a1: '1125' },
        { label: 'Tomatipüree', pid: '191', qty: 200, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'bulgur_punase_oa_supp',
      name: 'Bulgur–punase oa supp tomatikastmega',
      aliases: 'bulgur punased oad supp; bulgur supp; bulgur red bean soup; punased oad bulgur',
      tags: 'bulgur;punased oad;supp;tomatikaste;vegan;pearoog',
      servings: 3,
      steps: '1. Keeda bulgur soolaga maitsestatud vees 12–15 min, kurna.\n2. Soojenda tomatikaste koos punaste oadega pannil 5–7 min.\n3. Sega bulgur kastmesse, lisa natuke vett kui liiga paks.\n4. Maitsesta, nirista oliivõli ja serveeri.',
      homeIng: 'sool, pipar, vesi',
      vegan: true, gf: false,
      ings: [
        { label: 'Bulgur', pid: '686', qty: 150, unit: 'g', req: true, a1: '685', a2: '18055' },
        { label: 'Punased oad', pid: '822', qty: 240, unit: 'g', req: true, a1: '819', a2: '292' },
        { label: 'Tomatikaste köögiviljadega', pid: '200', qty: 350, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'must_oa_arrabiata_supp',
      name: 'Must oa–arrabiata kookospiima supp',
      aliases: 'must oa supp arrabiata; mustad oad supp kookos; black bean arrabiata soup; must oad kookospiim supp',
      tags: 'mustad oad;arrabiata;kookospiim;supp;gluteenivaba;vegan;vürtsikas',
      servings: 3,
      steps: '1. Soojenda arrabiata kaste potis koos kookospiimaga, sega läbi.\n2. Lisa mustad oad, sega, hauta 8–10 min.\n3. Vajaduse korral lahjenda veega, maitsesta.\n4. Nirista oliivõli ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Mustad oad', pid: '292', qty: 240, unit: 'g', req: true, a1: '819', a2: '822' },
        { label: 'Arrabiata kaste', pid: '13796', qty: 380, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'valge_oa_tomatipyree_supp',
      name: 'Valge oa–tomatipüree kookossupp',
      aliases: 'valge oa supp kookos; valged oad tomatipüree supp; white bean tomato soup; valge oa kookospiim',
      tags: 'valged oad;tomatipüree;kookospiim;supp;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Kuumuta potis oliivõli, lisa tomatipüree, sega 2 min.\n2. Lisa kookospiim ja valged oad, hauta 10 min.\n3. Sega saumikseriga pooltükiliköks (soovi korral).\n4. Maitsesta, lisa puljong vajadusel ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Valged oad', pid: '819', qty: 240, unit: 'g', req: true, a1: '817', a2: '292' },
        { label: 'Tomatipüree', pid: '191', qty: 400, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    {
      id: 'amarant_koorvili_supp',
      name: 'Amarant–köögiviljapuljong supp',
      aliases: 'amarant supp; amarant kooriviljapuljong; amaranth soup; amarant tomat puljong',
      tags: 'amarant;puljong;supp;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Lahusta kooriviljapuljong 800 ml keevas vees.\n2. Lisa amarant, keeda 20–25 min, kuni pehme.\n3. Lisa tomatipüree, hauta 5 min.\n4. Nirista oliivõli, maitsesta ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Amarant', pid: '684', qty: 100, unit: 'g', req: true, a1: '683', a2: '18055' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 10, unit: 'g', req: true, a1: '125' },
        { label: 'Tomatipüree', pid: '191', qty: 200, unit: 'ml', req: false, a1: '503' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    // ── SALATID (6 retsepti) ──────────────────────────────────────────────

    {
      id: 'tatratang_kikerherne_salat',
      name: 'Tatratang–kikerherne salat palsamiäädikaga',
      aliases: 'tatratang salat; tatratang kikerherned; buckwheat chickpea salad tatratang; tatar salat',
      tags: 'tatratang;kikerherned;salat;gluteenivaba;vegan;vahemere',
      servings: 2,
      steps: '1. Keeda tatratang vees 15 min, kurna ja jahuta.\n2. Sega tatratang ja kikerherned kausis.\n3. Lisa oliivõli, palsamiäädikas, sool ja pipar.\n4. Sega ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatratang', pid: '18056', qty: 150, unit: 'g', req: true, a1: '18055', a2: '691' },
        { label: 'Kikerherned', pid: '817', qty: 240, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: true, a1: '181', a2: '494' }
      ]
    },

    {
      id: 'bulgur_kreeka_pahkli_salat',
      name: 'Bulgur–kreeka pähkli salat kuivatatud tomatitega',
      aliases: 'bulgur salat kreeka pähklid; bulgur kreeka pähkli; bulgur walnut salad; bulgur kuivatatud tomatid',
      tags: 'bulgur;kreeka pähklid;salat;kuivatatud tomatid;vegan;vahemere',
      servings: 2,
      steps: '1. Keeda bulgur soolaga maitsestatud vees 12–15 min, kurna ja jahuta.\n2. Sega bulgur, kreeka pähklid ja kuivatatud tomatid.\n3. Kastmeks sega oliivõli, palsamiäädikas, sool.\n4. Vala kaste peale ja sega.',
      homeIng: 'sool, pipar',
      vegan: true, gf: false,
      ings: [
        { label: 'Bulgur', pid: '686', qty: 200, unit: 'g', req: true, a1: '685', a2: '18055' },
        { label: 'Kreeka pähklid', pid: '582', qty: 50, unit: 'g', req: true, a1: '583', a2: '579' },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: false, a1: '181' }
      ]
    },

    {
      id: 'tatrakruup_india_pahkli_salat',
      name: 'Tatrakruup–india pähkli salat',
      aliases: 'tatrakruup india pähklid salat; tatar india pähkel; buckwheat cashew salad; tatrakruup cashew',
      tags: 'tatrakruup;india pähklid;salat;gluteenivaba;vegan;vahemere',
      servings: 2,
      steps: '1. Keeda tatrakruup soolaga maitsestatud vees 15 min, kurna ja jahuta.\n2. Sega kruup, india pähklid ja oliivid.\n3. Kastmeks sega oliivõli, palsamiäädikas, sool.\n4. Vala kaste peale ja sega.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 150, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'India pähklid', pid: '579', qty: 60, unit: 'g', req: true, a1: '968', a2: '582' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: true, a1: '181', a2: '494' }
      ]
    },

    {
      id: 'punane_oa_oliivi_salat',
      name: 'Punase oa–oliivi salat palsamiäädikaga',
      aliases: 'punased oad oliivid salat; red bean olive salad; punane oad oliiv; punased oad salat',
      tags: 'punased oad;oliivid;salat;gluteenivaba;vegan;vahemere',
      servings: 2,
      steps: '1. Kurna ja loputa punased oad.\n2. Sega oad, oliivid ja kuivatatud tomatid kausis.\n3. Lisa oliivõli, palsamiäädikas, sool ja pipar.\n4. Sega ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Punased oad', pid: '822', qty: 240, unit: 'g', req: true, a1: '819', a2: '292' },
        { label: 'Rohelised oliivid', pid: '184', qty: 100, unit: 'g', req: true },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: true, a1: '181', a2: '494' }
      ]
    },

    {
      id: 'tatrapasta_oliivi_tomati_salat',
      name: 'Tatrapasta–oliivi ja tomatisalat',
      aliases: 'tatrapasta salat; tatar pasta salat oliividega; buckwheat pasta salad; tatrapasta salat tomatid',
      tags: 'tatrapasta;oliivid;salat;tomatid;gluteenivaba;vegan;vahemere',
      servings: 2,
      steps: '1. Keeda tatrapasta fusilli soolaga maitsestatud vees 8–10 min, kurna ja jahuta.\n2. Sega pasta, oliivid ja kuivatatud tomatid.\n3. Lisa oliivõli ja palsamiäädikas, maitsesta.\n4. Sega ja serveeri.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta fusilli', pid: '18045', qty: 200, unit: 'g', req: true, a1: '18046', a2: '18047' },
        { label: 'Rohelised oliivid', pid: '184', qty: 80, unit: 'g', req: true },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: true },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: true, a1: '181' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'mungoa_korvitsaseemnete_salat',
      name: 'Mungoa–kõrvitsaseemnete salat',
      aliases: 'mungoa salat; mungoad kõrvitsaseemned; mung bean pumpkin seed salad; mungoad salat seemnetega',
      tags: 'mungoad;kõrvitsaseemned;salat;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Keeda mungoad pehme soolaga maitsestatud vees 20–25 min, kurna ja jahuta.\n2. Sega mungoad, kõrvitsaseemned, oliivid.\n3. Kastmeks sega oliivõli, palsamiäädikas, sool.\n4. Vala kaste peale ja sega.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Mungoad', pid: '825', qty: 200, unit: 'g', req: true, a1: '824', a2: '817' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 40, unit: 'g', req: true, a1: '586', a2: '593' },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: false, a1: '181' }
      ]
    },

    // ── HOMMIKUSÖÖK (7 retsepti) ──────────────────────────────────────────

    {
      id: 'tatramanna_hommikukauss',
      name: 'Tatramanna hommikukauss kookospiimaga',
      aliases: 'tatramanna puder; tatramanna kookos; buckwheat semolina porridge; toor-tatramanna hommik',
      tags: 'tatramanna;kookospiim;hommikusöök;gluteenivaba;vegan;puder',
      servings: 2,
      steps: '1. Kuumuta kookospiim potis.\n2. Lisa tatramanna, sega pidevalt ja hauta 5–8 min madalal tulel.\n3. Maitsesta vahtrasiirupiga.\n4. Tõsta kaussidesse, puista peale mandlilaastud ja serveeri.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatramanna', pid: '18053', qty: 60, unit: 'g', req: true, a1: '18056', a2: '18055' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Mandlilaastud', pid: '593', qty: 20, unit: 'g', req: false, a1: '566', a2: '579' }
      ]
    },

    {
      id: 'tatramysli_rosinatega_hommikukauss',
      name: 'Tatramüsli rosinatega hommikukauss',
      aliases: 'tatramüsli hommik; tatramüsli rosinad; buckwheat muesli raisins; tatramüsli puder',
      tags: 'tatramüsli;rosinad;kookospiim;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Tõsta tatramüsli rosinatega kausi.\n2. Vala peale kookospiim ja lase 3–5 min paisuda.\n3. Lisa kreeka pähklid ja vahtrasiirup.\n4. Sega ja serveeri.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatramüsli rosinatega', pid: '18039', qty: 80, unit: 'g', req: true, a1: '18040', a2: '242' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Kreeka pähklid', pid: '582', qty: 20, unit: 'g', req: false, a1: '583', a2: '579' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168', a2: '596' }
      ]
    },

    {
      id: 'tatramysli_ounadega_hommikukauss',
      name: 'Tatramüsli kuivatatud õuntega hommikukauss',
      aliases: 'tatramüsli kuivatatud õunad; tatramüsli õun; buckwheat apple muesli; tatramüsli hommik õunad',
      tags: 'tatramüsli;kuivatatud õunad;kookospiim;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Tõsta tatramüsli kuivatatud õuntega kausi.\n2. Vala peale kookospiim ja lase 5 min paisuda.\n3. Lisa kõrvitsaseemned.\n4. Sega ja serveeri.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatramüsli kuivatatud õuntega', pid: '18040', qty: 80, unit: 'g', req: true, a1: '18039', a2: '242' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 20, unit: 'g', req: false, a1: '586', a2: '593' }
      ]
    },

    {
      id: 'speltamysli_hommikukauss',
      name: 'Speltamüsli kookospiimaga hommikukauss',
      aliases: 'speltamüsli hommik; speltamüsli kookos; spelt muesli breakfast; speltamüsli puder',
      tags: 'speltamüsli;kookospiim;hommikusöök;vegan;mandlid',
      servings: 2,
      steps: '1. Tõsta speltamüsli kausi.\n2. Vala peale kookospiim ja lase 5 min paisuda.\n3. Lisa mandlilaastud ja vahtrasiirup.\n4. Sega ja serveeri.',
      homeIng: '',
      vegan: true, gf: false,
      ings: [
        { label: 'Speltamüsli', pid: '242', qty: 80, unit: 'g', req: true, a1: '18039', a2: '18040' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Mandlilaastud', pid: '593', qty: 20, unit: 'g', req: false, a1: '566', a2: '579' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168', a2: '596' }
      ]
    },

    {
      id: 'tahhiini_kakao_hommikukauss_tatramysli',
      name: 'Tahhiini–kakao tatramüsli hommikukauss',
      aliases: 'tahhiini kakao müsli; tatramüsli tahhiini; buckwheat tahini cocoa bowl; tatramüsli kakao',
      tags: 'tatramüsli;tahhiini;kakao;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Sega kausis tatramüsli, tahhiini ja kakaopulber.\n2. Vala peale veidi kookospiima, sega.\n3. Lisa vahtrasiirup, maitsesta.\n4. Serveeri kohe.',
      homeIng: 'veidi soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatramüsli rosinatega', pid: '18039', qty: 80, unit: 'g', req: true, a1: '18040', a2: '242' },
        { label: 'Tahhiini', pid: '530', qty: 1, unit: 'spl', req: true },
        { label: 'Kakaopulber', pid: '138', qty: 1, unit: 'tl', req: true, a1: '806' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kookospiim', pid: '1123', qty: 80, unit: 'ml', req: true, a1: '1125' }
      ]
    },

    {
      id: 'tatrakruup_vahtrasiirup_hommikukauss',
      name: 'Tatrakruup–vahtrasiirup hommikukauss mandlitega',
      aliases: 'tatrakruup vahtrasiirup; tatrakruup hommik mandlid; buckwheat maple morning bowl; tatrakruup hommikusöök',
      tags: 'tatrakruup;vahtrasiirup;mandlid;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Keeda tatrakruup 15 min vees, kurna.\n2. Lisa vahtrasiirup, kaneelisuhkur ja mandlid.\n3. Sega läbi, serveeri soojalt.',
      homeIng: 'veidi soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 80, unit: 'g', req: true, a1: '18056', a2: '18053' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: true, a1: '168', a2: '596' },
        { label: 'Mandlid', pid: '566', qty: 30, unit: 'g', req: false, a1: '567', a2: '593' },
        { label: 'Kaneelisuhkur', pid: '314', qty: 1, unit: 'tl', req: false }
      ]
    },

    {
      id: 'kasuvoi_tatramysli_hommikukauss',
      name: 'Kašu võie–tatramüsli hommikukauss kookoshelbedega',
      aliases: 'kašu või müsli; india pähklivõi tatramüsli; cashew butter muesli; kašu tatramüsli hommik',
      tags: 'kašu;india pähklivõi;tatramüsli;kookoshelbed;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Tõsta tatramüsli rosinatega kausi.\n2. Lisa kašu võie ja sega.\n3. Vala peale kookospiim, lase 3 min paisuda.\n4. Puista kookoshelbed peale ja serveeri.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatramüsli rosinatega', pid: '18039', qty: 80, unit: 'g', req: true, a1: '18040', a2: '242' },
        { label: 'Kašu võie', pid: '18028', qty: 2, unit: 'spl', req: true, a1: '18025', a2: '18029' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125' },
        { label: 'Kookoshelbed', pid: '15436', qty: 15, unit: 'g', req: false }
      ]
    },

    // ── MAGUSTOIDUD (7 retsepti) ──────────────────────────────────────────

    {
      id: 'kakao_kookoshelbed_tryhvlid',
      name: 'Kakao–kookoshelbed trühvlid india pähklitega',
      aliases: 'kookoshelbed trühvlid; kakao india pähkli trühvlid; cocoa coconut truffles; kookos kakao pallid',
      tags: 'kakao;kookoshelbed;india pähklid;magustoit;gluteenivaba;vegan;energiapallid',
      servings: 4,
      steps: '1. Purusta india pähklid peeneks blenderis.\n2. Sega toorkakaopulber, kookoshelbed, india pähklid ja vahtrasiirup tainaks.\n3. Vormi märgade kätega pallid.\n4. Rulli kookoshelbetes ja hoia külmkapis vähemalt 30 min enne serveerimist.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'India pähklid', pid: '579', qty: 80, unit: 'g', req: true, a1: '968', a2: '566' },
        { label: 'Toorkakaopulber', pid: '806', qty: 50, unit: 'g', req: true, a1: '138' },
        { label: 'Kookoshelbed', pid: '15436', qty: 100, unit: 'g', req: true },
        { label: 'Vahtrasiirup', pid: '604', qty: 3, unit: 'spl', req: true, a1: '168', a2: '596' }
      ]
    },

    {
      id: 'tatramanna_kookospiim_puding',
      name: 'Tatramanna kookospiima puding',
      aliases: 'tatramanna puding; tatar semolina pudding; buckwheat pudding coconut; tatramanna magustoit',
      tags: 'tatramanna;kookospiim;magustoit;puding;gluteenivaba;vegan',
      servings: 3,
      steps: '1. Kuumuta kookospiim potis madalal tulel.\n2. Lisa tatramanna segades, hauta 8–10 min kuni pakseneb.\n3. Lisa vahtrasiirup, maitsesta.\n4. Vala klaaspurkidesse, jahuta külmkapis 1 tund.\n5. Serveeri kreeka pähklitega.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatramanna', pid: '18053', qty: 60, unit: 'g', req: true, a1: '18056', a2: '18055' },
        { label: 'Kookospiim', pid: '1125', qty: 300, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kreeka pähklid', pid: '582', qty: 30, unit: 'g', req: false, a1: '583', a2: '579' }
      ]
    },

    {
      id: 'tatrajahu_datlid_kookos_kypsised',
      name: 'Tatrajahu–datlid küpsised kookosõliga',
      aliases: 'tatrajahu küpsised; tatar datlid küpsised; buckwheat date cookies; tatrajahu magus küpsis',
      tags: 'tatrajahu;datlid;kookosõli;küpsised;küpsetised;gluteenivaba;vegan;magustoit',
      servings: 4,
      steps: '1. Tükinda datlid ja sega koos tatrajahu, kakaopulbri ja kookosõliga.\n2. Vajaduse korral lisa väike kogus vett, et tainas kätte kleepuks.\n3. Vormi väikesed lameküpsised.\n4. Küpseta 180°C ahjus 12–15 min.',
      homeIng: 'veidi soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatrajahu', pid: '18054', qty: 150, unit: 'g', req: true, a1: '537' },
        { label: 'Kivideta datlid', pid: '3221', qty: 100, unit: 'g', req: true },
        { label: 'Kookosõli', pid: '501', qty: 50, unit: 'g', req: true, a1: '499' },
        { label: 'Kakaopulber', pid: '138', qty: 2, unit: 'spl', req: false, a1: '806' }
      ]
    },

    {
      id: 'sokolaad_india_pahkli_sulakauss',
      name: 'Tooršokolaad–india pähkli kookosfondüü',
      aliases: 'šokolaad india pähkel kaste; tooršokolaad fondüü; chocolate cashew dip; šokolaad india pähkli kookos',
      tags: 'tooršokolaad;india pähklid;kookospiim;magustoit;gluteenivaba;vegan;kaste',
      servings: 3,
      steps: '1. Murra tooršokolaad india pähkliga tükkideks.\n2. Sulata kookospiimas vesivannil segades.\n3. Lisa vahtrasiirup.\n4. Serveeri soojalt dipikastmena puuviljade või küpsistega.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Tooršokolaad india pähkliga', pid: '16726', qty: 77, unit: 'g', req: true, a1: '16731' },
        { label: 'Kookospiim', pid: '1125', qty: 100, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168', a2: '596' }
      ]
    },

    {
      id: 'kookoshelbed_marmelaad_energiapallid',
      name: 'Kookoshelbed–marmelaad energiapallid mandlitega',
      aliases: 'kookoshelbed energiapallid; marmelaad energiapall; coconut jam energy balls; mandlid kookos marmelaad pallid',
      tags: 'kookoshelbed;marmelaad;mandlid;datlid;energiapallid;gluteenivaba;vegan;magustoit',
      servings: 4,
      steps: '1. Purusta mandlid blenderis.\n2. Sega kookoshelbed, datlid, mandlid ja marmelaad ühtlaseks tainaks.\n3. Vormi pallid märgade kätega.\n4. Rulli kookoshelbetes, pane külmkappi 30 min.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookoshelbed', pid: '15436', qty: 80, unit: 'g', req: true },
        { label: 'Vaarika marmelaad', pid: '18065', qty: 2, unit: 'spl', req: true, a1: '18066', a2: '233' },
        { label: 'Mandlid', pid: '566', qty: 60, unit: 'g', req: true, a1: '567', a2: '579' },
        { label: 'Kivideta datlid', pid: '3221', qty: 80, unit: 'g', req: true }
      ]
    },

    {
      id: 'vahtrasiirup_kreeka_pahkli_brownie_sorgojahu',
      name: 'Vahtrasiirupi–kreeka pähkli brownie sorgojahust',
      aliases: 'sorgojahu brownie; kreeka pähkel brownie; buckwheat sorghum brownie; kreeka pähkli šokolaadikook',
      tags: 'sorgojahu;kreeka pähklid;vahtrasiirup;brownie;küpsetised;gluteenivaba;vegan;magustoit',
      servings: 6,
      steps: '1. Sulata kookosõli, sega vahtrasiirupiga.\n2. Lisa sorgojahu ja kakaopulber, sega ühtlaseks.\n3. Lisa kreeka pähklid.\n4. Küpseta 180°C ahjus 20–25 min.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Sorgojahu', pid: '537', qty: 150, unit: 'g', req: true, a1: '18054' },
        { label: 'Vahtrasiirup', pid: '604', qty: 100, unit: 'ml', req: true, a1: '168', a2: '596' },
        { label: 'Kreeka pähklid', pid: '582', qty: 80, unit: 'g', req: true, a1: '583', a2: '566' },
        { label: 'Kookosõli', pid: '501', qty: 60, unit: 'g', req: true, a1: '499' },
        { label: 'Kakaopulber', pid: '138', qty: 50, unit: 'g', req: true, a1: '806' }
      ]
    },

    {
      id: 'kakao_vahtrasiirup_sokolaadikaste',
      name: 'Kakao–vahtrasiirup šokolaadikaste',
      aliases: 'šokolaadikaste kookos; kakao vahtrasiirup kaste; chocolate sauce vegan; kakao kookosõli kaste',
      tags: 'kakao;vahtrasiirup;kookosõli;kookospiim;šokolaadikaste;gluteenivaba;vegan;magustoit',
      servings: 4,
      steps: '1. Sega kakaopulber ja vahtrasiirup potis.\n2. Lisa kookospiim ja kookosõli.\n3. Kuumuta madalal tulel segades kuni sile ja läikiv.\n4. Serveeri soojalt jäätise, küpsiste või puuviljadega.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Kakaopulber', pid: '138', qty: 50, unit: 'g', req: true, a1: '806' },
        { label: 'Vahtrasiirup', pid: '604', qty: 100, unit: 'ml', req: true, a1: '168', a2: '596' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: true, a1: '499' },
        { label: 'Kookospiim', pid: '1123', qty: 100, unit: 'ml', req: true, a1: '1125', a2: '1133' }
      ]
    },

    // ── KÜPSETISED (7 retsepti) ───────────────────────────────────────────

    {
      id: 'sorgojahu_pannkoogid',
      name: 'Sorgojahu pannkoogid kookospiimaga',
      aliases: 'sorgojahu pannkook; gluteenivaba pannkook; sorghum pancakes; sorgojahu pannkoogid vegan',
      tags: 'sorgojahu;pannkoogid;kookospiim;küpsetised;gluteenivaba;vegan;hommikusöök',
      servings: 2,
      steps: '1. Sega sorgojahu, kookospiim ja vahtrasiirup ühtlaseks tainaks.\n2. Lase tainal 5 min seista.\n3. Kuumuta pannil kookosõli, vala tainas, küpseta mõlemalt poolt 2–3 min.\n4. Serveeri marmelaadi või vahtrasiirupiga.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Sorgojahu', pid: '537', qty: 150, unit: 'g', req: true, a1: '18054' },
        { label: 'Kookospiim', pid: '1125', qty: 200, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: true, a1: '499' }
      ]
    },

    {
      id: 'tatrajahu_pannkoogid',
      name: 'Tatrajahu pannkoogid',
      aliases: 'tatrajahu pannkook; tatar pannkook; buckwheat pancakes; tatrajahu pannkoogid gluteenivaba',
      tags: 'tatrajahu;pannkoogid;kookospiim;küpsetised;gluteenivaba;vegan;hommikusöök',
      servings: 2,
      steps: '1. Sega tatrajahu, kookospiim, küpsetuspulber ja vahtrasiirup ühtlaseks tainaks.\n2. Lase tainal 5 min seista.\n3. Kuumuta pannil kookosõli, vala tainas, küpseta mõlemalt poolt 2–3 min.\n4. Serveeri marmelaadi, mooside või vahtrasiirupiga.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatrajahu', pid: '18054', qty: 150, unit: 'g', req: true, a1: '537' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Küpsetuspulber', pid: '325', qty: 1, unit: 'tl', req: true },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: true, a1: '499' }
      ]
    },

    {
      id: 'tatraleivasegu_kooomnetega_leib',
      name: 'Tatraleivasegu köömnetega koduleib',
      aliases: 'tatar leib köömned; tatraleivasegu leib; buckwheat bread caraway; tatar küpsetis leib',
      tags: 'tatraleivasegu;leib;köömned;küpsetised;gluteenivaba;vegan',
      servings: 6,
      steps: '1. Sega tatraleivasegu pakendi juhiste järgi: lisa vesi ja kookosõli, sõtku tainaks.\n2. Lase tainal 30–60 min soojas kohas kerkida.\n3. Kujunda päts, pane vormi.\n4. Küpseta 200°C ahjus 40–45 min.',
      homeIng: 'vesi',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatraleivasegu köömnetega', pid: '18049', qty: 500, unit: 'g', req: true, a1: '18050', a2: '18051' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: false, a1: '499' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: false, a1: '168' }
      ]
    },

    {
      id: 'tatraleivasegu_korvitsaseemnetega_leib',
      name: 'Tatraleivasegu kõrvitsaseemnetega leib',
      aliases: 'tatraleivasegu kõrvitsaseemned; tatar leib kõrvitsaseemned; buckwheat pumpkin seed bread; tatar kõrvits leib',
      tags: 'tatraleivasegu;leib;kõrvitsaseemned;küpsetised;gluteenivaba;vegan',
      servings: 6,
      steps: '1. Sega tatraleivasegu kõrvitsaseemnetega vastavalt pakendi juhistele, lisa vesi ja kookosõli.\n2. Sõtku tainas siledaks, lase 30–60 min kerkida.\n3. Kujunda päts, pane vormi.\n4. Küpseta 200°C ahjus 40–45 min kuni pruun.',
      homeIng: 'vesi',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatraleivasegu kõrvitsaseemnetega', pid: '18050', qty: 500, unit: 'g', req: true, a1: '18049', a2: '18051' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: false, a1: '499' }
      ]
    },

    {
      id: 'sorgojahu_kookos_muffin',
      name: 'Sorgojahu–kookospiima muffinid',
      aliases: 'sorgojahu muffin; gluteenivaba muffin; sorghum coconut muffin; sorgojahu koogike',
      tags: 'sorgojahu;kookospiim;muffin;küpsetised;gluteenivaba;vegan',
      servings: 6,
      steps: '1. Sega sorgojahu, küpsetuspulber ja kaneelisuhkur.\n2. Vala sisse kookospiim ja kookosõli, sega ühtlaseks.\n3. Lisa vahtrasiirup.\n4. Täida muffinivorm ¾ täis, küpseta 180°C 20–25 min.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Sorgojahu', pid: '537', qty: 200, unit: 'g', req: true, a1: '18054' },
        { label: 'Küpsetuspulber', pid: '325', qty: 2, unit: 'tl', req: true },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Kookosõli', pid: '501', qty: 60, unit: 'g', req: true, a1: '499' },
        { label: 'Vahtrasiirup', pid: '604', qty: 60, unit: 'ml', req: true, a1: '168', a2: '596' }
      ]
    },

    {
      id: 'tatrajahu_kookos_kypsised',
      name: 'Tatrajahu–kookosõli küpsised kookoshelbedega',
      aliases: 'tatrajahu küpsised kookos; tatar kookos küpsis; buckwheat coconut cookies; tatrajahu kookoshelbed küpsis',
      tags: 'tatrajahu;kookosõli;kookoshelbed;küpsised;gluteenivaba;vegan;magustoit',
      servings: 4,
      steps: '1. Sega tatrajahu, kookosõli, vahtrasiirup ühtlaseks tainaks.\n2. Lisa kookoshelbed, sega.\n3. Vormi lamedad küpsised, aseta ahjuplaadile.\n4. Küpseta 175°C 12–15 min kuni kuldsed.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatrajahu', pid: '18054', qty: 200, unit: 'g', req: true, a1: '537' },
        { label: 'Kookosõli', pid: '501', qty: 80, unit: 'g', req: true, a1: '499' },
        { label: 'Vahtrasiirup', pid: '604', qty: 60, unit: 'ml', req: true, a1: '168', a2: '596' },
        { label: 'Kookoshelbed', pid: '15436', qty: 50, unit: 'g', req: false }
      ]
    },

    {
      id: 'sorgojahu_kakao_kook',
      name: 'Sorgojahu–kakao šokolaadikook',
      aliases: 'sorgojahu šokolaadikook; gluteenivaba šokolaadikook; sorghum chocolate cake; sorgojahu kakao kook',
      tags: 'sorgojahu;kakao;kookosõli;kook;küpsetised;gluteenivaba;vegan;magustoit',
      servings: 8,
      steps: '1. Sega sorgojahu, kakaopulber ja küpsetuspulber.\n2. Sulata kookosõli, sega vahtrasiirupiga ja kookospiimaga.\n3. Sega kuivained märgainetesse, sega ühtlaseks.\n4. Vala vormi, küpseta 175°C ahjus 30–35 min.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Sorgojahu', pid: '537', qty: 200, unit: 'g', req: true, a1: '18054' },
        { label: 'Kakaopulber', pid: '138', qty: 50, unit: 'g', req: true, a1: '806' },
        { label: 'Kookosõli', pid: '501', qty: 80, unit: 'g', req: true, a1: '499' },
        { label: 'Vahtrasiirup', pid: '604', qty: 100, unit: 'ml', req: true, a1: '168', a2: '596' },
        { label: 'Kookospiim', pid: '1123', qty: 150, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Küpsetuspulber', pid: '325', qty: 2, unit: 'tl', req: true }
      ]
    },

    // ── LISARETSEPTID (9 retsepti) ────────────────────────────────────────

    {
      id: 'tatramanna_kreeka_pahkli_kauss',
      name: 'Tatramanna–kreeka pähkli hommikukauss',
      aliases: 'tatramanna kreeka pähkli kauss; toor-tatramanna hommik kreeka pähkli; buckwheat semolina walnut bowl',
      tags: 'tatramanna;kreeka pähklid;kookospiim;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Keeda tatramanna kookospiimas 5–7 min segades.\n2. Lisa vahtrasiirup.\n3. Tõsta kaussidesse, puista peale kreeka pähklid.\n4. Serveeri soojalt.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatramanna', pid: '18053', qty: 80, unit: 'g', req: true, a1: '18056', a2: '18055' },
        { label: 'Kreeka pähklid', pid: '582', qty: 40, unit: 'g', req: true, a1: '583', a2: '579' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' }
      ]
    },

    {
      id: 'amarant_kookospiim_puder',
      name: 'Amarant–kookospiima puder',
      aliases: 'amarant puder; amarant kookos; amaranth coconut porridge; amarant hommikusöök kookos',
      tags: 'amarant;kookospiim;puder;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Keeda amarant kookospiimas 20–25 min segades kuni pehme ja pakseneb.\n2. Lisa vahtrasiirup ja kaneelisuhkur.\n3. Puista peale mandlilaastud ja serveeri.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Amarant', pid: '684', qty: 80, unit: 'g', req: true, a1: '683', a2: '18055' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Mandlilaastud', pid: '593', qty: 20, unit: 'g', req: false, a1: '566', a2: '582' },
        { label: 'Kaneelisuhkur', pid: '314', qty: 1, unit: 'tl', req: false }
      ]
    },

    {
      id: 'bulgur_india_pahkli_kuivtomati_salat',
      name: 'Bulgur–india pähkli ja kuivatatud tomati salat',
      aliases: 'bulgur india pähkel salat; bulgur cashew salad; bulgur salat; bulgur kuivatatud tomat india pähkel',
      tags: 'bulgur;india pähklid;kuivatatud tomatid;salat;vegan;vahemere',
      servings: 2,
      steps: '1. Keeda bulgur soolaga maitsestatud vees 12–15 min, kurna ja jahuta.\n2. Sega bulgur, india pähklid ja kuivatatud tomatid.\n3. Kastmeks sega oliivõli, palsamiäädikas, sool.\n4. Vala kaste peale ja sega.',
      homeIng: 'sool, pipar',
      vegan: true, gf: false,
      ings: [
        { label: 'Bulgur', pid: '686', qty: 200, unit: 'g', req: true, a1: '685', a2: '18055' },
        { label: 'India pähklid', pid: '579', qty: 60, unit: 'g', req: true, a1: '968', a2: '582' },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' },
        { label: 'Palsamiäädikas', pid: '180', qty: 2, unit: 'spl', req: false, a1: '181' }
      ]
    },

    {
      id: 'maapahklivoi_tatramysli_hommikukauss',
      name: 'Maapähklivõie–tatramüsli hommikukauss',
      aliases: 'maapähklivõi tatramüsli; tatramüsli maapähklivõi; peanut butter muesli bowl; maapähklivõi tatramüsli hommik',
      tags: 'maapähklivõi;tatramüsli;kookospiim;hommikusöök;gluteenivaba;vegan',
      servings: 2,
      steps: '1. Tõsta tatramüsli kaussi.\n2. Lisa maapähklivõie ja sega.\n3. Vala peale kookospiim, lase 3 min paisuda.\n4. Puista kõrvitsaseemned ja serveeri.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatramüsli rosinatega', pid: '18039', qty: 80, unit: 'g', req: true, a1: '18040', a2: '242' },
        { label: 'Maapähklivõie', pid: '18025', qty: 2, unit: 'spl', req: true, a1: '18028', a2: '18029' },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 20, unit: 'g', req: false, a1: '586', a2: '593' }
      ]
    },

    {
      id: 'kasu_voi_kakao_energiapaste',
      name: 'Kašu võie–kakao energiapasta (määre)',
      aliases: 'kašu või kakao; india pähklivõi kakao; cashew cocoa spread; kašu kakao datlid',
      tags: 'kašu;kakao;datlid;vahtrasiirup;gluteenivaba;vegan;magustoit;määre',
      servings: 4,
      steps: '1. Purusta datlid ja sega kašu võiega.\n2. Lisa toorkakaopulber ja vahtrasiirup.\n3. Sega ühtlaseks.\n4. Serveeri leiva, küpsiste või puuviljadega.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Kašu võie', pid: '18028', qty: 4, unit: 'spl', req: true, a1: '18025', a2: '18029' },
        { label: 'Toorkakaopulber', pid: '806', qty: 2, unit: 'spl', req: true, a1: '138' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Kivideta datlid', pid: '3221', qty: 80, unit: 'g', req: false }
      ]
    },

    {
      id: 'tatrakruup_tomatikaste_korvitsaseemned',
      name: 'Tatrakruup kõrvitsaseemnete tomatikastmega',
      aliases: 'tatrakruup kõrvitsaseemned tomat; tatar kõrvitsaseemned; buckwheat pumpkin seed tomato; tatrakruup seemned',
      tags: 'tatrakruup;kõrvitsaseemned;tomatikaste;gluteenivaba;vegan;pearoog',
      servings: 2,
      steps: '1. Keeda tatrakruup soolaga maitsestatud vees 15 min, kurna.\n2. Soojenda tomatikaste koos kõrvitsaseemnetega pannil 3–4 min.\n3. Sega kruup kastmesse.\n4. Nirista oliivõli ja serveeri.',
      homeIng: 'sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 40, unit: 'g', req: true, a1: '586', a2: '593' },
        { label: 'Tomatikaste', pid: '196', qty: 300, unit: 'g', req: true, a1: '197', a2: '200' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'pelati_kikerherne_tomatikaste_tatrakruup',
      name: 'Pelati–kikerherne hautis tatrakruupuga',
      aliases: 'pelati kikerherned tatrakruup; tatar kikerherne hautis pelati; buckwheat chickpea tomato stew; tatrakruup hautis',
      tags: 'tatrakruup;kikerherned;pelati tomatid;hautis;gluteenivaba;vegan;pearoog',
      servings: 3,
      steps: '1. Keeda tatrakruup soolaga maitsestatud vees 15 min, kurna.\n2. Kuumuta potis pelati tomatid, sega, lisa kikerherned.\n3. Hauta 8–10 min, maitsesta.\n4. Sega tatrakruup sisse, nirista oliivõli ja serveeri.',
      homeIng: 'sool, pipar, 1 sibul, 2 küüslauguküünt',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Kikerherned', pid: '817', qty: 240, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Kooritud pelati tomatid', pid: '189', qty: 400, unit: 'g', req: true, a1: '191', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    {
      id: 'spelta_nuudlid_bolognese',
      name: 'Spelta nuudlid bolognese kastmega',
      aliases: 'spelta bolognese; spelta pasta bolognese; spelt noodles bolognese; speltanuudlid bolognese',
      tags: 'spelta;nuudlid;bolognese;pearoog;pasta',
      servings: 2,
      steps: '1. Keeda spelta mie nuudlid soolaga maitsestatud vees 5–7 min, kurna.\n2. Soojenda bolognese kaste pannil 4–5 min.\n3. Sega nuudlid kastmesse.\n4. Nirista oliivõli ja serveeri.',
      homeIng: 'sool',
      vegan: false, gf: false,
      ings: [
        { label: 'Spelta mie nuudlid', pid: '114', qty: 200, unit: 'g', req: true },
        { label: 'Bolognese kaste', pid: '15255', qty: 380, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    {
      id: 'tatrapasta_bolognese',
      name: 'Tatrapasta bolognese kastmega',
      aliases: 'tatrapasta bolognese; tatar pasta bolognese; buckwheat pasta bolognese; tatrapasta liha kaste',
      tags: 'tatrapasta;bolognese;pearoog;gluteenivaba;pasta',
      servings: 2,
      steps: '1. Keeda tatrapasta fusilli soolaga maitsestatud vees 8–10 min, kurna.\n2. Soojenda bolognese kaste pannil 4–5 min.\n3. Sega pasta kastmesse.\n4. Nirista oliivõli ja serveeri.',
      homeIng: 'sool',
      vegan: false, gf: true,
      ings: [
        { label: 'Tatrapasta fusilli', pid: '18045', qty: 200, unit: 'g', req: true, a1: '18046', a2: '18047' },
        { label: 'Bolognese kaste', pid: '15255', qty: 380, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    }

  ]; // END RECIPES

  // Filtreeri olemasolevad ID-d välja
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
