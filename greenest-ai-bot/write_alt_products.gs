// === JOOKSUTA GAS EDITORIS: writeAltProducts() ===
// Kirjutab retseptipõhised alternatiivtooted Recipe_Bank tabelisse.
// Kastmed on kontekstuaalsed (arrabiata sobib chili'sse aga mitte karri'sse).

function writeAltProducts() {
  var SPREADSHEET_ID = '17_DHr_1NQWUOa-SWUu2t7y0eK2ntB9V24alfZbMMBgE';
  var RECIPE_BANK_SHEET = 'Recipe_Bank';

  // Retseptipõhised kastme alternatiivid (kontekstist sõltuvad)
  var RECIPE_SAUCE_ALTS = {
    'vegan_kikerherne_karri': {'196': ['195', '200']},
    'vegan_kikerherne_tomatisupp': {'196': ['195', '200']},
    'vegan_kikerherne_tomati_hautis_bulgur': {'191': ['503']},
    'vegan_mungoad_kookosekarri_tatratang': {'191': ['503']},
    'kreemine_valge_oa_tomatisupp_kookosega': {'191': ['503']},
    'vegan_laats_bolognese': {'196': ['195', '197']},
    'vegan_musta_oa_chili_bulgur': {'196': ['195', '13796']},
    'vegan_3bean_chili_bulgur': {'196': ['195', '13796'], '191': ['503']},
    'vegan_valge_oa_arrabiata_tatrapasta': {'13796': ['196', '197']},
    'vegan_one_pot_pasta': {'196': ['195', '197']},
    'vegan_spelt_nuudlid_kookos_tomat_oad': {'196': ['195', '197']},
    'vegan_tatrapasta_oliiv_kuivtoma': {'197': ['196', '195']},
    'minestrone_oad_pelati_nuudlid': {'197': ['196', '195']}
  };

  // Üldised toote alternatiivid (sobivad igas retseptis)
  var PRODUCT_ALTS = {
    '168': ['169', '172'],
    '169': ['168', '172'],
    '172': ['168', '169'],
    '181': ['494', '495'],
    '182': ['183'],
    '183': ['182'],
    '191': ['503'],
    '232': ['233', '235'],
    '233': ['232', '235'],
    '235': ['232', '233'],
    '376': ['378'],
    '378': ['376'],
    '494': ['181', '495'],
    '495': ['181', '494'],
    '499': ['501'],
    '501': ['499'],
    '503': ['191'],
    '579': ['968'],
    '585': ['586', '588'],
    '586': ['585', '589'],
    '588': ['585', '589'],
    '589': ['586', '588'],
    '598': ['599'],
    '599': ['598'],
    '685': ['686'],
    '686': ['685'],
    '816': ['817'],
    '817': ['816'],
    '824': ['825'],
    '825': ['824'],
    '968': ['579'],
    '1123': ['1125'],
    '1125': ['1123'],
    '3340': ['15664'],
    '15664': ['3340'],
    '16725': ['16728', '16729', '16730'],
    '16728': ['16725', '16729', '16730'],
    '16729': ['16725', '16728', '16730'],
    '16730': ['16725', '16728', '16729'],
    '16731': ['16725', '16728', '16729'],
    '16733': ['16725', '16728', '16729'],
    '17924': ['17925', '17926', '18025'],
    '17925': ['17924', '17926', '18025'],
    '17926': ['17924', '17925', '18025'],
    '18025': ['17924', '17925', '17926'],
    '18026': ['17924', '17925', '17926'],
    '18027': ['17924', '17925', '17926'],
    '18039': ['18040'],
    '18040': ['18039'],
    '18044': ['18045', '18046', '18047'],
    '18045': ['18044', '18046', '18047'],
    '18046': ['18044', '18045', '18047'],
    '18047': ['18044', '18045', '18046'],
    '18048': ['18044', '18045', '18046'],
    '18058': ['17924', '17925', '17926']
  };

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(RECIPE_BANK_SHEET);
  if (!sh) { Logger.log('ERROR: Recipe_Bank sheet not found'); return; }

  var allData = sh.getDataRange().getValues();
  var hdr = allData[0];

  function colIdx(name) { return hdr.indexOf(name); }

  var updatedCells = 0;
  var updatedRows = 0;
  var batchUpdates = [];

  for (var r = 1; r < allData.length; r++) {
    var row = allData[r];
    var recipeId = String(row[0] || '').trim();
    if (!recipeId) continue;

    var sauceAlts = RECIPE_SAUCE_ALTS[recipeId] || {};
    var rowChanged = false;

    for (var n = 1; n <= 12; n++) {
      var pidIdx = colIdx('ing' + n + '_product_id');
      if (pidIdx < 0) continue;
      var pid = String(row[pidIdx] || '').trim();
      if (!pid) continue;

      var alts = sauceAlts[pid] || PRODUCT_ALTS[pid] || [];

      for (var a = 1; a <= 3; a++) {
        var altColIdx = colIdx('ing' + n + '_alt' + a + '_product_id');
        if (altColIdx < 0) continue;

        var altVal = (a <= alts.length) ? alts[a - 1] : '';
        var currentVal = String(row[altColIdx] || '').trim();

        if (altVal !== currentVal) {
          batchUpdates.push({ r: r + 1, c: altColIdx + 1, v: altVal });
          rowChanged = true;
          updatedCells++;
        }
      }
    }
    if (rowChanged) updatedRows++;
  }

  for (var i = 0; i < batchUpdates.length; i++) {
    var upd = batchUpdates[i];
    sh.getRange(upd.r, upd.c).setValue(upd.v);
  }

  Logger.log('Valmis! Uuendatud ' + updatedCells + ' lahtrit ' + updatedRows + ' retseptis.');
  SpreadsheetApp.getUi().alert('Valmis! Uuendatud ' + updatedCells + ' lahtrit ' + updatedRows + ' retseptis.');
}
