/**
 * writeGreenestBlogRecipes2()
 * Lisa Greenesti blogi retseptid (2. osa) Recipe_Bank lehele.
 * Käivita GAS editoris: Run → writeGreenestBlogRecipes2
 *
 * Allikad: greenest.ee/et/blogi (leheküljed 2–4)
 */
function writeGreenestBlogRecipes2() {
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

  // Toote ID-d (viide):
  // 825/824=mungoad, 817/816=kikerherned, 822=punased oad, 819=valged oad, 292=mustad oad
  // 15664=rohelised läätsed 5kg, 3340=rohelised läätsed 25kg, 3339=punased läätsed 25kg
  // 691=toortatar, 18055=tatrakruup, 18056=tatratang, 18054=tatrajahu
  // 114=spelta mie nuudlid, 685/686=bulgur
  // 196=tomatikaste, 197=tomatikaste basiilikuga, 189=pelati tomatid, 191=tomatipüree
  // 13796=arrabiata kaste, 200=tomatikaste köögiviljadega
  // 182=oliivõli, 183=oliivõli lastele, 180=palsamiäädikas, 181=õunaäädikas, 494=õunaäädikas 250ml
  // 1123=kookospiim 330ml, 1125=kookospiim 400ml, 1133=kookoskreem
  // 499=kookosõli lõhnatu, 501=neitsi kookosõli, 15436=kookoshelbed
  // 530=tahhiini, 831=maapähklid, 18025=maapähklivõi (smuuud), 18028=kašu või
  // 579=india pähklid 350g, 968=india pähklid 75g
  // 582=kreeka pähklid 100g, 583=kreeka pähklid 300g
  // 566=mandlid blanš 100g, 567=mandlid 350g, 593=mandlilaastud
  // 585=kõrvitsaseemned 150g, 586=kõrvitsaseemned 350g
  // 604=vahtrasiirup, 596=kookosõiesuhkur, 168=akaatsiamesi
  // 138=kakaopulber, 806=toorkakaopulber
  // 3221=kivideta datlid, 14579=kookosjahu 2.5kg
  // 4421=sidrunimahl, 921=sidrunikoor
  // 125=kooriviljapuljongi kuubikud, 126=kooriviljapuljong
  // 325=küpsetuspulber, 537=sorgojahu
  // 18035=musta küüslaugu pasta, 18033=must küüslauk koorimata
  // 18039=tatramüsli rosinatega, 18040=tatramüsli kuivatatud õuntega
  // 345=kookosvesi, 184=rohelised oliivid, 190=kuivatatud tomatid oliivõlis

  var RECIPES = [

    // ── LK 3: Röstpaprika-tomatikastmes nuudlid mungoadega ──────────────
    // https://greenest.ee/et/blogi/rostpaprika-tomatikastmes-nuudlid-mungubadega
    {
      id: 'blog_rostpaprika_nuudlid_mungoad',
      name: 'Röstpaprika-tomatikastmes spelta nuudlid mungoadega',
      aliases: 'röstpaprika nuudlid mungoad; paprika tomat nuudlid; roasted pepper noodles mung bean; spelta nuudlid paprika mungoad',
      tags: 'spelta;nuudlid;mungoad;tomatikaste;vegan;pearoog;pasta',
      servings: 3,
      steps: '1. Pooli paprikad (2 tk), rösti nahapool üleval 220°C ahjus kuni nahk tumeneb (ca 20 min). Pane kaussi ja kata 10 min, seejärel koori.\n2. Kuumuta pannil oliivõli, lisa sibul, prae 3–4 min. Lisa küüslauk, prae 1 min.\n3. Lisa tomatikaste ja puljong, hauta 10 min.\n4. Kustuta kuumus, lisa röstitud paprikad, saumikserda ühtlaseks kastmeks.\n5. Keeda spelta nuudlid vastavalt juhistele, kurna.\n6. Sega nuudlid kastmesse, lisa mungoad, soojenda 3 min.\n7. Serveeri värskete ürtidega.',
      homeIng: '2 punast paprikat, 1 sibul, 2 küüslauguküünt, sool, pipar, basiilik',
      vegan: true, gf: false,
      ings: [
        { label: 'Spelta mie nuudlid', pid: '114', qty: 200, unit: 'g', req: true },
        { label: 'Mungoad', pid: '825', qty: 200, unit: 'g', req: true, a1: '824', a2: '817' },
        { label: 'Tomatikaste köögiviljadega', pid: '200', qty: 350, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 5, unit: 'g', req: false, a1: '125' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
      ]
    },

    // ── LK 3: Chana Masala spinatiga ─────────────────────────────────────
    // https://greenest.ee/et/blogi/chana-masala-spinatiga
    {
      id: 'blog_chana_masala_spinat',
      name: 'Chana masala kikerhernestega ja spinatiga',
      aliases: 'chana masala spinat; kikerherne karri spinat; chickpea curry spinach; chana masala kikerherned',
      tags: 'kikerherned;karri;spinat;tomatipüree;vegan;gluteenivaba;pearoog;india',
      servings: 4,
      steps: '1. Kuumuta oliivõli potis. Lisa kaneel, nelk, kardemom ja vürtsiseemned, prae 30 sek.\n2. Lisa purustatud sibul, pruunista põhjalikult.\n3. Lisa küüslauk ja ingver, prae kuni toores lõhn kaob.\n4. Lisa tomatipüree, sool, suhkur, hauta 6 min.\n5. Sega sisse vürtsid: kurkum, tšilli, koriander, garam masala.\n6. Lisa kikerherned, spinat ja veidi vett. Hauta kuni spinat närtsinud.\n7. Blenderda ca 1 tass kikerherneid kreemjuse lisamiseks, sega tagasi.\n8. Serveeri tatrakruubu, tatratangu või tatrapastaga.',
      homeIng: '2 keskmist sibulat (purustatud), 400 g tomatipüreed, 1 spl ingver-küüslaugupasta, spinat, vürtsid (kurkum, tšilli, koriander, garam masala, kaneel, nelk, kardemom), sool, suhkur',
      vegan: true, gf: true,
      ings: [
        { label: 'Kikerherned', pid: '817', qty: 480, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Tomatipüree', pid: '191', qty: 400, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 5, unit: 'g', req: false, a1: '125' }
      ]
    },

    // ── LK 3: Datli ja mandli energiabatoonid ─────────────────────────
    // https://greenest.ee/et/blogi/datli-ja-mandli-energiabatoonid
    {
      id: 'blog_datli_mandli_energiabatoonid',
      name: 'Datli ja mandli energiabatoonid kuivatatud vaarikaga',
      aliases: 'datli mandli batoon; energy bars date almond; datli mandel batoon; datli energiabatoon mandlid',
      tags: 'datlid;mandlid;kuivatatud vaarikad;energiabatoon;gluteenivaba;vegan;magustoit',
      servings: 6,
      steps: '1. Purusta kõik koostisosad köögikombainis ühtlaseks massiks.\n2. Suru küpsetuspaberiga vooderdatud vormi.\n3. Lase sügavkülmas 1 tund seista.\n4. Lõika batoonideks.\n5. Säilita külmkapis suletud karbis.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Kivideta datlid', pid: '3221', qty: 200, unit: 'g', req: true },
        { label: 'Mandlid', pid: '566', qty: 100, unit: 'g', req: true, a1: '567', a2: '579' },
        { label: 'Kuivatatud vaarikad', pid: '7517', qty: 15, unit: 'g', req: false }
      ]
    },

    // ── LK 4: Rohelise mungoa daal ────────────────────────────────────
    // https://greenest.ee/et/blogi/rohelise-mungoa-daal
    {
      id: 'blog_rohelise_mungoa_daal',
      name: 'Rohelise mungoa daal tomatiga',
      aliases: 'mungoa daal; rohelised mungoad daal; green mung bean dal; mungoa supp india',
      tags: 'mungoad;daal;tomatipüree;vegan;gluteenivaba;pearoog;india;supp',
      servings: 4,
      steps: '1. Leota mungoad üleöö külmas vees, kurna ja loputa.\n2. Kuumuta oliivõli potis, lisa loorberileht ja köömnaseemned, prae 30 sek.\n3. Lisa sibul, prae kuni läbipaistev. Lisa küüslauk ja ingver, prae 2 min.\n4. Lisa tomatipüree, sool ja vürtsid (kurkum, tšilli, koriander, garam masala), hauta 6 min.\n5. Lisa mungoad ja 800 ml vett, keeda kaetult 30 min kuni mungoad pehmed.\n6. Tampige veidi kreemjuse lisamiseks.\n7. Tempereeri: kuumuta oliivõli, lisa köömnaseemned, vala peale.\n8. Serveeri tatrakruubu, tatratangu või tatrapastaga.',
      homeIng: '1 sibul, küüslauk ja ingver, 1 loorberileht, köömnaseemned, vürtsid (kurkum, tšilli, koriander, garam masala), Himaalaja sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Mungoad', pid: '825', qty: 200, unit: 'g', req: true, a1: '824', a2: '817' },
        { label: 'Tomatipüree', pid: '191', qty: 400, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' }
      ]
    },

    // ── LK 4: Toortatraleivakesed (kreekerid) ─────────────────────────
    // https://greenest.ee/et/blogi/toortatraleivakesed
    {
      id: 'blog_toortatraleivakesed',
      name: 'Toortatra kreekerid kuivatatud tomatite ja oliividega',
      aliases: 'toortatraleivakesed; toor-tatar kreeker; raw buckwheat crackers; toortatra leivakesed kuivatatud tomat',
      tags: 'toortatar;kreeker;leivakesed;gluteenivaba;vegan;küpsetised',
      servings: 6,
      steps: '1. Leota toortatar vähemalt 6 tundi (või üleöö) külmas vees, kurna ja loputa hoolikalt.\n2. Pane kõik koostisosad köögikombaini: tatras, kuivatatud tomatid, oliivid, linaseemned, vürtsid, sool.\n3. Töötle kuni ühtlane mass (paus küljed kraapimiseks).\n4. Jaga 2–3 osaks, laota küpsetuspaberil ahjuplaadile õhukese ühtlase kihina.\n5. Kuivata 70°C ahjus ventilaatoriga 4–6 tundi kuni täiesti kuiv ja krõbe.\n6. Murra tükkideks, säilita õhukindlas purgis.',
      homeIng: '1 tass jahvatatud linaseemned, 2 tl sibulajahu, 2 tl küüslaugujahu, 1 spl Provence ürte, Himaalaja sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Toortatar', pid: '691', qty: 200, unit: 'g', req: true, a1: '18055', a2: '18056' },
        { label: 'Kuivatatud tomatid oliivõlis', pid: '190', qty: 60, unit: 'g', req: false },
        { label: 'Rohelised oliivid', pid: '184', qty: 60, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    // ── LK 4: Musta oa pilaff ─────────────────────────────────────────
    // https://greenest.ee/et/blogi/musta-oa-pilaff
    {
      id: 'blog_musta_oa_pilaff',
      name: 'Musta oa–tatrakruup pilaff',
      aliases: 'musta oa pilaff; mustad oad pilaff; black bean pilaf; musta oa tatar pilaff',
      tags: 'mustad oad;tatrakruup;tomatipüree;pilaff;gluteenivaba;vegan;pearoog',
      servings: 4,
      steps: '1. Kuumuta potis oliivõli, lisa sibul ja porgand (riivitud), prae mõni minut.\n2. Lisa küüslauk ja tatrakruup, kuumuta lühidalt.\n3. Vala peale kooriviljapuljong (ca 600 ml keev vesi + puljongipulber), lisa mustad oad.\n4. Keeda kaetult kuni tatrakruup pehme (ca 15 min), sega aeg-ajalt.\n5. Sega sisse tomatipüree, keeda kuni vedelik imendunud.\n6. Lase 10–15 min seista, serveeri.',
      homeIng: '1 suur sibul, 1 porgand (riivitud), 3 küüslauguküünt, loorberilehed, sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 250, unit: 'g', req: true, a1: '18056', a2: '685' },
        { label: 'Mustad oad', pid: '292', qty: 240, unit: 'g', req: true, a1: '822', a2: '819' },
        { label: 'Tomatipüree', pid: '191', qty: 250, unit: 'ml', req: true, a1: '503', a2: '196' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 10, unit: 'g', req: true, a1: '125' },
        { label: 'Oliivõli', pid: '182', qty: 3, unit: 'spl', req: true, a1: '183' }
      ]
    },

    // ── LK 4: Kookosjahu küpsised ─────────────────────────────────────
    // https://greenest.ee/et/blogi/kookosjahu-kupsised
    {
      id: 'blog_kookosjahu_kupsised',
      name: 'Kookosjahu küpsised vahtrasiirupiga',
      aliases: 'kookosjahu küpsised; coconut flour cookies; kookos küpsised gluteenivaba; kookosjahu vahtrasiirup küpsis',
      tags: 'kookosjahu;vahtrasiirup;kookosõli;küpsised;küpsetised;gluteenivaba;vegan;magustoit',
      servings: 4,
      steps: '1. Kuumuta ahi 180°C.\n2. Sega kookosjahu, kookosõli ja vahtrasiirup kausis, sõtku käega ühtlaseks tainaks.\n3. Lase 5 min puhata.\n4. Aseta tainas kahe küpsetuspaberi vahele, rulli lamedaks (ca 5 mm).\n5. Lõika küpsisevormi või noa abil kujud.\n6. Küpseta 10–12 min kuni kuldpruun.\n7. Lase täielikult jahtuda enne söömist.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookosjahu', pid: '14579', qty: 200, unit: 'g', req: true },
        { label: 'Kookosõli', pid: '501', qty: 125, unit: 'ml', req: true, a1: '499' },
        { label: 'Vahtrasiirup', pid: '604', qty: 125, unit: 'ml', req: true, a1: '168', a2: '596' }
      ]
    },

    // ── LK 4: Kookosepallikesed ───────────────────────────────────────
    // https://greenest.ee/et/blogi/kookosepallikesed
    {
      id: 'blog_kookosepallikesed',
      name: 'Kookosepallikesed vahtrasiirupi ja mandlitega',
      aliases: 'kookosepallikesed; coconut balls; kookos pallid vahtrasiirup; kookospallikesed mandlid',
      tags: 'kookoshelbed;kookosõli;vahtrasiirup;mandlid;energiapallid;gluteenivaba;vegan;magustoit',
      servings: 3,
      steps: '1. Sulata kookosõli kergelt (käesooja).\n2. Sega kookosõli, kookoshelbed ja vahtrasiirup ühtlaseks.\n3. Pane 5 min külmkappi.\n4. Vormi lusikaga pallid peopesas.\n5. Rulli kookoshelbedes.\n6. Pane külmkappi 15 min enne serveerimist.',
      homeIng: '',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookosõli', pid: '501', qty: 80, unit: 'g', req: true, a1: '499' },
        { label: 'Kookoshelbed', pid: '15436', qty: 60, unit: 'g', req: true },
        { label: 'Vahtrasiirup', pid: '604', qty: 40, unit: 'ml', req: true, a1: '168', a2: '596' },
        { label: 'Mandlid', pid: '566', qty: 20, unit: 'g', req: false, a1: '567', a2: '568' }
      ]
    },

    // ── LK 4: Vegan Tom Kha kookospiimaga ────────────────────────────
    // https://greenest.ee/et/blogi/vegan-tom-kha-3
    {
      id: 'blog_vegan_tom_kha',
      name: 'Vegan Tom Kha kookospiima supp',
      aliases: 'vegan tom kha; tom kha gai vegan; kookospiim seenesupp; thai kookossupp vegan',
      tags: 'kookospiim;seened;vegan;gluteenivaba;supp;pearoog;thai',
      servings: 4,
      steps: '1. Prae pannil kergelt sibul, porgand ja seened.\n2. Tõsta potti koos kooriviljapuljongiga, kookospiimaga ja vürtsidega (sidrunhein, galangal, kaffir laimi lehed).\n3. Hauta madalal tulel 10 min.\n4. Lisa tšilli ja sidrunimahl, kuumuta 5 min.\n5. Maitsesta, lisa koriander.\n6. Keeda tatrapasta või spelta nuudlid eraldi, serveeri supiga.',
      homeIng: '1 sibul, 1 porgand, 200 g seeni, 1 tšilli, koriander, sidrunhein (kuivatatud), galangal, kaffir laimi lehed',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookospiim', pid: '1125', qty: 600, unit: 'ml', req: true, a1: '1123', a2: '1133' },
        { label: 'Kooriviljapuljong', pid: '126', qty: 10, unit: 'g', req: true, a1: '125' },
        { label: 'Sidrunimahl', pid: '4421', qty: 2, unit: 'spl', req: true, a1: '181' },
        { label: 'Tatrapasta penne', pid: '18047', qty: 200, unit: 'g', req: false, a1: '18045', a2: '114' }
      ]
    },

    // ── LK 4: Karriga hummus ──────────────────────────────────────────
    // https://greenest.ee/et/blogi/karriga-hummus
    {
      id: 'blog_karriga_hummus',
      name: 'Karriga kikerhernehummus tahhiiniga',
      aliases: 'karriga hummus; kikerhernehummus karri; curry hummus; kikerherne karri hummus tahhiini',
      tags: 'kikerherned;tahhiini;karri;hummus;gluteenivaba;vegan;määre;kaste',
      servings: 4,
      steps: '1. Kurna ja loputa kikerherned.\n2. Pane kõik koostisosad köögikombaini: kikerherned, tahhiini, oliivõli, sidrunimahl, küüslauk, vürtsid, sool.\n3. Blenderda ühtlaseks kreemjaks massiks.\n4. Vajaduse korral lisa vett.\n5. Serveeri oliivõli ja kõrvitsaseemnetega.',
      homeIng: '1 küüslauguküünt, 0.5 tl karripulbrit, 1 tl paprikapulbrit, koriandrit, soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Kikerherned', pid: '817', qty: 480, unit: 'g', req: true, a1: '816', a2: '819' },
        { label: 'Tahhiini', pid: '530', qty: 2, unit: 'spl', req: true },
        { label: 'Oliivõli', pid: '182', qty: 50, unit: 'ml', req: true, a1: '183' },
        { label: 'Sidrunimahl', pid: '4421', qty: 1, unit: 'spl', req: true, a1: '181' },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 15, unit: 'g', req: false, a1: '586', a2: '593' }
      ]
    },

    // ── LK 4: Maapähklikaste ─────────────────────────────────────────
    // https://greenest.ee/et/blogi/maapahklikaste
    {
      id: 'blog_maapahklikaste',
      name: 'Maapähklivõie kaste sidruniga',
      aliases: 'maapähklikaste; peanut butter sauce; maapähklivõi kaste; peanut sauce sidrun',
      tags: 'maapähklivõi;palsamiäädikas;vahtrasiirup;kaste;gluteenivaba;vegan;määre',
      servings: 4,
      steps: '1. Pane kõik koostisosad blenderisse: maapähklivõie, oliivõli, sidrunimahl, vahtrasiirup, küüslauk.\n2. Lisa veidi vett (ca 4 spl) kremjuse saavutamiseks.\n3. Blenderda ühtlaseks.\n4. Maitsesta vajadusel.\n5. Serveeri salatite, nuudlite või kreekeritega.',
      homeIng: '1 küüslauguküünt, 1 cm ingveri tükk, sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Maapähklivõie', pid: '18025', qty: 120, unit: 'ml', req: true, a1: '18028', a2: '18029' },
        { label: 'Sidrunimahl', pid: '4421', qty: 2, unit: 'spl', req: true, a1: '181' },
        { label: 'Vahtrasiirup', pid: '604', qty: 1, unit: 'spl', req: true, a1: '168', a2: '596' },
        { label: 'Palsamiäädikas', pid: '180', qty: 1, unit: 'spl', req: false, a1: '181', a2: '494' }
      ]
    },

    // ── LK 3: Tatrajahu pannkoogid (Tõrvaaugu talu retsept) ────────────
    // https://greenest.ee/et/blogi/retsept-torvaaugu-mahe-talu-tatrajahu-pannkoogid
    {
      id: 'blog_torvaaugu_tatrajahu_pannkoogid',
      name: 'Tõrvaaugu talu tatrajahu pannkoogid',
      aliases: 'Tõrvaaugu tatrajahu pannkook; tatrajahu pannkoogid; buckwheat flour pancakes; tator pannkook talu',
      tags: 'tatrajahu;pannkoogid;hommikusöök;küpsetised;gluteenivaba;vegan',
      servings: 3,
      steps: '1. Sega sool ja suhkur munadega (või asendusega: 1 spl linaseemned + 3 spl vett = 1 muna).\n2. Lisa tatrajahu, kookospiim ja kookosõli, sega ühtlaseks tainaks — konsistents nagu hapukoor.\n3. Lase tainal 5 min puhata.\n4. Prae pannil kookosõlis mõlemalt poolt kuldpruuniks.\n5. Serveeri vahtrasiirupi, marmelaadi või moosiega.',
      homeIng: 'näpuotsatäis soola, 1 tl suhkrut või vahtrasiirupit',
      vegan: true, gf: true,
      ings: [
        { label: 'Toor-tatrajahu', pid: '18054', qty: 250, unit: 'ml', req: true, a1: '537' },
        { label: 'Kookospiim', pid: '1123', qty: 500, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Kookosõli', pid: '501', qty: 1, unit: 'spl', req: true, a1: '499' },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: false, a1: '168', a2: '596' },
        { label: 'Vaarika marmelaad', pid: '18065', qty: 2, unit: 'spl', req: false, a1: '18066', a2: '233' }
      ]
    },

    // ── LK 4: India pähkli hapukoor (kastmena, määrdena) ─────────────
    // https://greenest.ee/et/blogi/india-pahkli-hapukoor
    {
      id: 'blog_india_pahkli_hapukoor',
      name: 'India pähkli hapukoor (cashew cream)',
      aliases: 'india pähkli hapukoor; cashew sour cream; kašu hapukoor; india pähkel koor kaste',
      tags: 'india pähklid;hapukoor;kaste;gluteenivaba;vegan;määre',
      servings: 4,
      steps: '1. Leota india pähkleid külmas vees 4–6 tundi (või keeva veega 30 min).\n2. Kurna, loputa.\n3. Blenderda koos sidrunimahlaga, näpuotsatäis soola ja 4–6 spl veega ühtlaseks kreemjaks massiks.\n4. Maitsesta vajadusel.\n5. Serveeri karri, taco, hautise või salati kõrvale.',
      homeIng: 'näpuotsatäis soola, vesi leotamiseks',
      vegan: true, gf: true,
      ings: [
        { label: 'India pähklid', pid: '579', qty: 150, unit: 'g', req: true, a1: '968', a2: '566' },
        { label: 'Sidrunimahl', pid: '4421', qty: 2, unit: 'spl', req: true, a1: '181' }
      ]
    },

    // ── LK 4: Kanepiseemne pesto ──────────────────────────────────────
    // https://greenest.ee/et/blogi/kanepiseemne-pesto
    // Lähim toode kataloogis: kõrvitsaseemned (kanepiseemneid pole kataloogis)
    {
      id: 'blog_kõrvitsaseemne_oliiv_pesto',
      name: 'Kõrvitsaseemnete–oliivi pesto',
      aliases: 'kõrvitsaseemne pesto; seemne pesto oliivid; pumpkin seed pesto; kõrvitsaseemned oliivõli pesto',
      tags: 'kõrvitsaseemned;oliivõli;sidrunikoor;pesto;gluteenivaba;vegan;kaste;määre',
      servings: 4,
      steps: '1. Pane blenderisse kõrvitsaseemned, oliivõli, sidrunimahl, sidrunikoor, küüslauk ja sool.\n2. Blenderda ühtlaseks (jäta veidi tekstuuri).\n3. Maitsesta vajadusel.\n4. Serveeri tatrapasta, tatrakruubu, kreekerite või salatiga.',
      homeIng: '1 küüslauguküünt, sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Kõrvitsaseemned', pid: '585', qty: 80, unit: 'g', req: true, a1: '586', a2: '566' },
        { label: 'Oliivõli', pid: '182', qty: 60, unit: 'ml', req: true, a1: '183' },
        { label: 'Sidrunimahl', pid: '4421', qty: 2, unit: 'spl', req: true, a1: '181' },
        { label: 'Sidrunikoor', pid: '921', qty: 1, unit: 'tl', req: false }
      ]
    },

    // ── LK 2: Lk 2 retsept – Gluteenivaba seemneleib ─────────────────
    // https://greenest.ee/et/blogi/gluteenivaba-ja-jahuvaba-seemneleib
    {
      id: 'blog_gluteenivaba_seemneleib',
      name: 'Gluteenivaba ja jahuvaba seemneleib',
      aliases: 'seemneleib gluteenivaba; gluteenivaba leib seemned; seed bread gluten free; jahuvaba seemneleib',
      tags: 'kõrvitsaseemned;mandlid;kookosõli;leib;küpsetised;gluteenivaba;vegan',
      servings: 8,
      steps: '1. Sega kausis kõrvitsaseemned, mandlid, kookoshelbed, kookosõli, küpsetuspulber ja sool.\n2. Vajaduse korral lisa sooja vett natukene, et mass koos püsiks.\n3. Aseta vormi või küpsetusplaadile.\n4. Küpseta 180°C ahjus 30–35 min kuni pruun ja kindel.\n5. Jahuta täielikult enne lõikamist.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Kõrvitsaseemned', pid: '585', qty: 150, unit: 'g', req: true, a1: '586', a2: '588' },
        { label: 'Mandlid', pid: '566', qty: 100, unit: 'g', req: true, a1: '567', a2: '593' },
        { label: 'Kookoshelbed', pid: '15436', qty: 60, unit: 'g', req: false },
        { label: 'Kookosõli', pid: '501', qty: 50, unit: 'g', req: true, a1: '499' },
        { label: 'Küpsetuspulber', pid: '325', qty: 1, unit: 'tl', req: true }
      ]
    },

    // ── LISARETSEPT: Tatrapasta arrabiata mungoadega ───────────────────
    {
      id: 'tatrapasta_arrabiata_mungoad',
      name: 'Tatrapasta arrabiata mungoadega',
      aliases: 'tatrapasta mungoad arrabiata; tatar pasta mungoad; buckwheat pasta mung bean arrabiata',
      tags: 'tatrapasta;mungoad;arrabiata;vürtsikas;gluteenivaba;vegan;pearoog',
      servings: 2,
      steps: '1. Keeda mungoad pehmes vees 20–25 min, kurna (või kasuta konservitud).\n2. Keeda tatrapasta soolaga maitsestatud vees 8–10 min, kurna.\n3. Soojenda arrabiata kaste pannil 3–4 min, lisa mungoad.\n4. Sega pasta kastmesse, nirista oliivõli.\n5. Maitsesta ja serveeri.',
      homeIng: 'sool',
      vegan: true, gf: true,
      ings: [
        { label: 'Tatrapasta fusilli', pid: '18045', qty: 200, unit: 'g', req: true, a1: '18046', a2: '18047' },
        { label: 'Arrabiata kaste', pid: '13796', qty: 380, unit: 'g', req: true, a1: '196', a2: '197' },
        { label: 'Mungoad', pid: '825', qty: 150, unit: 'g', req: true, a1: '824', a2: '817' },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: false, a1: '183' }
      ]
    },

    // ── LISARETSEPT: Kookosjahu pannkoogid vahtrasiirupiga ────────────
    {
      id: 'kookosjahu_pannkoogid_vahtrasiirup',
      name: 'Kookosjahu pannkoogid vahtrasiirupi ja marmelaadiga',
      aliases: 'kookosjahu pannkook; coconut flour pancakes; kookos pannkook gluteenivaba; kookosjahu pannkoogid vegan',
      tags: 'kookosjahu;kookospiim;vahtrasiirup;pannkoogid;hommikusöök;gluteenivaba;vegan;küpsetised',
      servings: 2,
      steps: '1. Sega kookosjahu, küpsetuspulber ja kookospiim ühtlaseks tainaks.\n2. Lisa vahtrasiirup ja kookosõli, sega.\n3. Prae pannil kookosõlis väikesed pannkoogid mõlemalt poolt kuldpruuniks (ca 2–3 min kummalgi).\n4. Serveeri vaarika marmelaadi ja vahtrasiirupiga.',
      homeIng: 'näpuotsatäis soola',
      vegan: true, gf: true,
      ings: [
        { label: 'Kookosjahu', pid: '14579', qty: 100, unit: 'g', req: true },
        { label: 'Kookospiim', pid: '1123', qty: 200, unit: 'ml', req: true, a1: '1125', a2: '1133' },
        { label: 'Küpsetuspulber', pid: '325', qty: 1, unit: 'tl', req: true },
        { label: 'Vahtrasiirup', pid: '604', qty: 2, unit: 'spl', req: true, a1: '168', a2: '596' },
        { label: 'Kookosõli', pid: '501', qty: 2, unit: 'spl', req: true, a1: '499' },
        { label: 'Vaarika marmelaad', pid: '18065', qty: 2, unit: 'spl', req: false, a1: '18066', a2: '233' }
      ]
    },

    // ── LISARETSEPT: Tahhiini–sidrunikoor tatrakruup kauss ─────────────
    {
      id: 'tahhiini_sidrunikoor_tatrakruup',
      name: 'Tahhiini–sidrunikoor tatrakruup kauss kõrvitsaseemnetega',
      aliases: 'tahhiini tatrakruup; tatrakruup tahhiini sidrunikoor; buckwheat tahini lemon bowl; tahhiini kõrvitsaseemned tatar',
      tags: 'tahhiini;sidrunikoor;tatrakruup;kõrvitsaseemned;gluteenivaba;vegan;pearoog;vahemere',
      servings: 2,
      steps: '1. Keeda tatrakruup soolaga maitsestatud vees 15 min, kurna.\n2. Kastmeks sega tahhiini, sidrunimahl, oliivõli ja näpuotsatäis sidrunikoort.\n3. Vala kaste tatrakruupude peale, sega.\n4. Lisa kõrvitsaseemned ja oliivid.\n5. Serveeri toatemerperatuuril.',
      homeIng: 'sool, pipar',
      vegan: true, gf: true,
      ings: [
        { label: 'Röstitud tatrakruup', pid: '18055', qty: 200, unit: 'g', req: true, a1: '18056', a2: '691' },
        { label: 'Tahhiini', pid: '530', qty: 2, unit: 'spl', req: true },
        { label: 'Sidrunimahl', pid: '4421', qty: 2, unit: 'spl', req: true, a1: '181' },
        { label: 'Sidrunikoor', pid: '921', qty: 0.5, unit: 'tl', req: false },
        { label: 'Kõrvitsaseemned', pid: '585', qty: 30, unit: 'g', req: false, a1: '586', a2: '593' },
        { label: 'Rohelised oliivid', pid: '184', qty: 50, unit: 'g', req: false },
        { label: 'Oliivõli', pid: '182', qty: 2, unit: 'spl', req: true, a1: '183' }
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
