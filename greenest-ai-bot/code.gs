/*******************************
 * GREENEST AI – backend (v4.2)
 * - Spreadsheet ID baked in
 * - Allowed origins auto-derived & auto-set (no manual)
 * - Tracking endpoints: GET/POST action=track
 * - Chat message logs: GET/POST action=chatlog
 * - Optional: action=stats (basic usage analytics)
 *
 * UPDATES (this version):
 * - listRecipes output now includes recipeTitle/recipeName/title/name so widget chips show real names
 * - Tracking sheet auto-migrates and logs: vendor + widget_version + backend_version per event
 * - Chat log sheet auto-migrates and logs: user_message + assistant_message + error_message
 *******************************/

// --- Spreadsheet / Sheets ---
var SPREADSHEET_ID = '17_DHr_1NQWUOa-SWUu2t7y0eK2ntB9V24alfZbMMBgE'; // ✅ baked in
var AI_CATALOG_SHEET = 'AI_catalog';
var RECIPE_BANK_SHEET = 'Recipe_Bank';
var RECIPE_MAX_LIST = 50;

// --- Affiliate / Tracking ---
var EVENT_LOG_SHEET = 'Affiliate_Events';
var CHAT_LOG_SHEET = 'Chat_Message_Logs';
var SITE_TOKEN_PROP = 'GREENEST_SITE_TOKEN';
var ALLOWED_ORIGINS_PROP = 'GREENEST_ALLOWED_ORIGINS'; // "https://greenest.ee,https://www.greenest.ee"

// You provided a PAGE url; we will auto-normalize to origins.
var DEFAULT_ALLOWED_ORIGIN_URLS = [
  'https://greenest.ee/en/food-and-drinks' // ✅ baked in input
];

var CLAUDE_MODEL = 'claude-haiku-4-5-20251001'; // Anthropic Claude Haiku – used for shopping & recipe AI steps
var CLAUDE_SONNET_MODEL = 'claude-sonnet-4-6'; // Anthropic Claude Sonnet 4.6 – used for intent classification

// Backend attribution/version
var VENDOR_NAME = 'growlinee';
var BACKEND_VERSION = 'v4.3';

// Customer support knowledge base (sourced from greenest.ee policy pages)
var GREENEST_SUPPORT = {
  phone: '+372 51 900 330',
  order_phone: '+372 5663 5550',
  email: 'sales@greenest.ee',
  hours: 'E-R 08:00–16:00',
  delivery_url: 'https://greenest.ee/et/pages/kauba-kattetoimetamine',
  returns_url: 'https://greenest.ee/et/pages/tagastusoigus',
  terms_url: 'https://greenest.ee/et/pages/tellimistingimused',
  contacts_url: 'https://greenest.ee/et/pages/kontaktid',
  company: 'Nature Design OÜ',
  reg_no: '12802934',
  vat: 'EE101777465',
  address: 'Kurekivi tee 2, Lehmja, Rae vald, Harjumaa 75306, Estonia'
};

var SMALLTALK_RE = /(kuidas l[aä]heb|mis teed|kes sa oled|mida oskad|r[aä][aä]gi endast|small talk|lihtsalt jutustan)/i;

var SUPPORT_SHIPPING_RE = /(tarne|tarni|k[aä]ttetoimet|k[aä]tte saa|kauba katte|kuller|pakiautomaat|smartpost|shipping|kohale|saadetis|tarneaeg|tarnekulud|millal j[oõ]uab|millal saab pakk|millal tuleb pakk)/i;
var SUPPORT_RETURNS_RE = /(tagastus|tagast|return|refund|raha tagasi|pretensioon|reklamatsioon|katki|vigane|riknenud|defekt|garantii|warranty)/i;
var SUPPORT_PAYMENT_RE = /(makse|maksta|pangalink|panga[ -]?link|swedbank|seb|luminor|coop|lhv|arve|invoice|maksetasu|payment|ülekanne|sooduskood)/i;
var SUPPORT_CONTACT_RE = /(kontakt|telefon|helista|e-?mail|epost|klienditugi|support|aadress|lahtioleku|t[oö][oö]aeg)/i;
var SUPPORT_ORDER_RE = /(tellimus|order|tracking|kus mu pakk|kus pakk|tellimuse staatus|staatus|tellimuse number|pakk ei j[oõ]udnud)/i;

/*************************************************
 * Spreadsheet + Properties helpers
 *************************************************/
function getSpreadsheet_() {
  if (SPREADSHEET_ID && String(SPREADSHEET_ID).trim()) {
    return SpreadsheetApp.openById(String(SPREADSHEET_ID).trim());
  }
  return SpreadsheetApp.getActive();
}

function getScriptProp_(key) {
  return PropertiesService.getScriptProperties().getProperty(String(key || '').trim());
}

function setScriptProp_(key, val) {
  PropertiesService.getScriptProperties().setProperty(String(key || '').trim(), String(val == null ? '' : val));
}

function getSiteToken_() {
  return (getScriptProp_(SITE_TOKEN_PROP) || '').trim();
}

/*************************************************
 * Allowed origins: auto-derive + auto-set
 *************************************************/
function normalizeToOrigin_(urlOrOrigin) {
  var s = String(urlOrOrigin || '').trim();
  if (!s) return '';
  try {
    var u = new URL(s);
    return u.origin;
  } catch (e) {
    return '';
  }
}

function deriveDefaultOrigins_() {
  var origins = {};
  for (var i = 0; i < DEFAULT_ALLOWED_ORIGIN_URLS.length; i++) {
    var o = normalizeToOrigin_(DEFAULT_ALLOWED_ORIGIN_URLS[i]);
    if (o) origins[o] = true;
  }

  // Add www/non-www variant automatically
  var out = Object.keys(origins);
  var extra = {};
  out.forEach(function (o) {
    try {
      var u = new URL(o);
      if (u.hostname.indexOf('www.') === 0) {
        extra[u.protocol + '//' + u.hostname.replace(/^www\./, '')] = true;
      } else {
        extra[u.protocol + '//' + ('www.' + u.hostname)] = true;
      }
    } catch (e) {}
  });

  Object.keys(extra).forEach(function (k) { origins[k] = true; });

  return Object.keys(origins);
}

function ensureDefaultAllowedOriginsProp_() {
  var existing = (getScriptProp_(ALLOWED_ORIGINS_PROP) || '').trim();
  if (existing) return; // already set

  var derived = deriveDefaultOrigins_();
  if (derived.length) {
    setScriptProp_(ALLOWED_ORIGINS_PROP, derived.join(','));
  }
}

function getAllowedOrigins_() {
  ensureDefaultAllowedOriginsProp_();

  var raw = (getScriptProp_(ALLOWED_ORIGINS_PROP) || '').trim();
  if (!raw) return [];

  var parts = raw.split(',').map(function (s) { return String(s || '').trim(); }).filter(Boolean);
  var uniq = {};
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var o = normalizeToOrigin_(parts[i]);
    if (!o) continue;
    if (uniq[o]) continue;
    uniq[o] = true;
    out.push(o);
  }

  // Store back if normalized
  if (out.length && out.join(',') !== raw) {
    setScriptProp_(ALLOWED_ORIGINS_PROP, out.join(','));
  }

  return out;
}

function isOriginAllowed_(origin) {
  var allowed = getAllowedOrigins_();
  if (!allowed.length) return true; // MVP: allow all if empty

  origin = normalizeToOrigin_(origin) || String(origin || '').trim();
  if (!origin) {
    // soft-pass if origin missing (server-side hooks may omit it)
    return true;
  }

  for (var i = 0; i < allowed.length; i++) {
    if (origin === allowed[i]) return true;
  }
  return false;
}

// Lühike sõbralik vastus + klõpsatav link
function buildSupportLinkResponse_(intent) {
  if (intent === 'support_shipping') {
    return 'Kogu tarneinfo leiad siit 😊\n[Ava tarneinfo](' + GREENEST_SUPPORT.delivery_url + ')';
  }
  if (intent === 'support_returns') {
    return 'Tagastusinfo leiad siit 😊\n[Ava tagastusinfo](' + GREENEST_SUPPORT.returns_url + ')';
  }
  if (intent === 'support_payment') {
    return 'Maksetingimused leiad siit 😊\n[Ava tellimistingimused](' + GREENEST_SUPPORT.terms_url + ')';
  }
  if (intent === 'support_contact') {
    return 'Kontaktandmed leiad siit 😊\n[Ava kontaktleht](' + GREENEST_SUPPORT.contacts_url + ')';
  }
  if (intent === 'support_order') {
    return 'Tellimuse või paki staatuse kohta kõige kiirema info saamiseks helista palun ' + GREENEST_SUPPORT.order_phone + '. Aktiivset paki jälgimise süsteemi meil hetkel ei ole.';
  }
  return 'Kliendiabi info leiad siit 😊\n[Ava kontaktleht](' + GREENEST_SUPPORT.contacts_url + ')';
}

// Per-intent FAQ context – kasutatakse ainult escalation juhtudel
function buildFaqContext_(intent) {
  return (
    'GREENESTI KLIENDIABI:\n' +
    '- E-post: ' + GREENEST_SUPPORT.email + '\n' +
    '- Telefon: ' + GREENEST_SUPPORT.phone + ' (' + GREENEST_SUPPORT.hours + ')\n' +
    '- Saan aidata: tarne, tagastus, makse, tellimus, kontakt'
  );
}

// Static fallback – used only when Claude is unavailable
function buildSupportFallback_(intent) {
  var ctx = buildFaqContext_(intent);
  return {
    mode: 'support',
    assistantText: ctx,
    mainProducts: [],
    upsellProducts: [],
    vendor: VENDOR_NAME,
    version: BACKEND_VERSION
  };
}

function buildSmalltalkFallback_(lang) {
  var isEn = normalizeLang_(lang) === 'en';
  return {
    mode: 'smalltalk',
    assistantText: isEn
      ? 'Got it. Feel free to ask about recipes, shipping, returns, payment or contact details.'
      : 'Selge. Küsi julgelt retsepti, tarne, tagastuse, makse või kontakti kohta.',
    mainProducts: [],
    upsellProducts: [],
    vendor: VENDOR_NAME,
    version: BACKEND_VERSION
  };
}

/*************************************************
 * Claude Haiku – klienditoe ja smalltalk vastused
 * API võti: Apps Script → Project Settings → Script Properties → ANTHROPIC_API_KEY
 *************************************************/

// Strict rules – mirrored from trenniekspert pattern
var GREENEST_STRICT_RULES = [
  'Sa oled Greenesti kliendiabi assistent. Greenest (greenest.ee) on Eesti mahetoidu e-pood.',
  'Vasta sõbralikult ja lühidalt (1-3 lauset) ainult allpool toodud poe teabe põhjal.',
  'Kui infot pole, ütle ausalt et ei tea ja soovita kirjutada ' + GREENEST_SUPPORT.email + '.',
  'Ära leiuta fakte. Ära soovita tooteid ega retsepte — selleks on eraldi süsteem.',
  'Vasta eesti keeles, välja arvatud kui kasutaja kirjutab inglise keeles.',
].join('\n');

var GREENEST_STORE_KNOWLEDGE = [
  'ETTEVÕTE:',
  '- Nimi: Greenest (' + GREENEST_SUPPORT.company + ', reg ' + GREENEST_SUPPORT.reg_no + ', KMKR ' + GREENEST_SUPPORT.vat + ')',
  '- Aadress: ' + GREENEST_SUPPORT.address,
  '- E-post: ' + GREENEST_SUPPORT.email,
  '- Telefon: ' + GREENEST_SUPPORT.phone,
  '- Lahtiolekuaeg: ' + GREENEST_SUPPORT.hours,
  '',
  'TARNE (rohkem: ' + GREENEST_SUPPORT.delivery_url + '):',
  '- Pakiautomaadid (Smartpost): 4 EUR',
  '- Tavakuller Eestis: 6 EUR',
  '- Külmakaup Eestis: 8 EUR (üle 30 kg erihind)',
  '- Soome: 12,99 EUR; muud EL riigid: 14,90 EUR kuni 5 kg',
  '- Tellimused lukustuvad E ja N kell 08:00; pakk jõuab pakiautomaati laupäeval',
  '- Pakiautomaadis 7 päeva järeletulemiseks; kuller saadab SMS-i hommikul',
  '- Tasuta EL tarne puudub',
  '',
  'TAGASTUS (rohkem: ' + GREENEST_SUPPORT.returns_url + '):',
  '- Tagastusõigus 14 päeva kättesaamisest',
  '- Kaup peab olema kasutamata, originaalpakendis',
  '- Kirjuta 14 päeva jooksul: ' + GREENEST_SUPPORT.email + ' (nimi, toote nimi, tellimuse number)',
  '- Tagastuskulud kannab klient, v.a. defektse toote puhul',
  '- Raha tagastatakse 14 päeva jooksul',
  '- Kui pakk tuli tagasi saatjale: 4 EUR kulu arvatakse tagastusest maha',
  '',
  'MAKSEVIISID (rohkem: ' + GREENEST_SUPPORT.terms_url + '):',
  '- Pangalink: Swedbank, SEB, Danske, Luminor, LHV, Coop Pank (+0,25 EUR tasu)',
  '- Pangaülekanne: Nature Design OÜ',
  '  Swedbank EE234000234545666 / LHV EE527700771005774026',
  '  Selgitusse: tellimuse number',
  '- Hinnad sisaldavad 22% käibemaksu',
  '- Tellimus läheb töösse pärast täieliku makse laekumist',
].join('\n');

var GREENEST_SYSTEM_PROMPT_SUPPORT = [
  'Sa oled Greenesti klienditoe vestlusassistent.',
  '',
  GREENEST_STRICT_RULES,
  '',
  'POE TEAVE:',
  GREENEST_STORE_KNOWLEDGE,
].join('\n');

var GREENEST_SYSTEM_PROMPT_GENERAL = [
  'Sa oled Greenesti vestlusassistent, kes aitab kliente sõbralikult.',
  '',
  GREENEST_STRICT_RULES,
  '',
  'POE TEAVE:',
  GREENEST_STORE_KNOWLEDGE,
].join('\n');

// faqContext: optional string from buildFaqContext_() to ground Claude's answer
function callClaudeHaiku_(userMessage, faqContext) {
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');
  if (!apiKey) return null;

  var systemPrompt = faqContext ? GREENEST_SYSTEM_PROMPT_SUPPORT : GREENEST_SYSTEM_PROMPT_GENERAL;

  var userPrompt = faqContext
    ? ('Kliendi küsimus: ' + String(userMessage || '').trim() + '\nKontekst: ' + faqContext + '\n\nVasta 1–3 lausega ainult poe teabe põhjal. Kui kontekst sisaldab vastust, kasuta seda.')
    : ('Kliendi sõnum: ' + String(userMessage || '').trim() + '\n\nVasta lühidalt ja kasulikult. Ära soovita tooteid ega retsepte.');

  var payload = {
    model: CLAUDE_MODEL,
    max_tokens: 300,
    temperature: 0,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    var body = JSON.parse(response.getContentText());

    if (code !== 200 || !body.content || !body.content.length) {
      Logger.log('Claude API error: ' + code + ' ' + JSON.stringify(body));
      return null;
    }

    return String(body.content[0].text || '').trim() || null;
  } catch (err) {
    Logger.log('callClaudeHaiku_ exception: ' + err);
    return null;
  }
}

// Intent classifier system prompt – Claude Sonnet 4.6 smart router
var GREENEST_SONNET_CLASSIFIER_PROMPT = [
  'Sa oled Greenesti chatboti suunaja. Greenest on Eesti mahetoidu e-pood.',
  '',
  'Analüüsi kasutaja sõnumit ja otsusta mis on tema tegelik vajadus.',
  'Tagasta AINULT JSON: {"intent":"...","confidence":0.0-1.0}',
  '',
  'Võimalikud intendid: greeting, smalltalk, escalation,',
  'support_shipping, support_returns, support_payment, support_contact, support_order,',
  'recipe, shopping',
].join('\n');

function classifyIntentWithSonnet_(query) {
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');
  if (!apiKey) return null;

  var payload = {
    model: CLAUDE_SONNET_MODEL,
    max_tokens: 60,
    temperature: 0,
    system: GREENEST_SONNET_CLASSIFIER_PROMPT,
    messages: [{ role: 'user', content: 'Sõnum: ' + String(query || '').trim() }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    if (code !== 200) return null;

    var body = JSON.parse(response.getContentText());
    var text = String((body.content && body.content[0] && body.content[0].text) || '').trim();
    var match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    var parsed = JSON.parse(match[0]);
    var intent = String(parsed.intent || '').trim();
    var validIntents = ['greeting','smalltalk','escalation','support_shipping','support_returns','support_payment','support_contact','support_order','recipe','shopping'];
    if (validIntents.indexOf(intent) === -1) return null;

    return intent;
  } catch (err) {
    Logger.log('classifyIntentWithSonnet_ error: ' + err);
    return null;
  }
}

function detectAssistantIntent_(query, products) {
  var q = String(query || '').toLowerCase().trim();
  if (!q) return 'smalltalk';
  // Fallback for product/recipe (used when Claude is unavailable)
  return decideMode_(query, products);
}

/*************************************************
 * Tokenid / tekstitöötlus
 *************************************************/
var STOPWORDS_ET = [
  'ja', 'või', 'ning', 'et', 'see', 'seda', 'selline',
  'mahe', 'mahedad', 'orgaaniline', 'organic', 'bio', 'eco', 'looduslik',
  'gluteenivaba', 'vegan', 'toode', 'tooted', 'valmistamiseks', 'kasutamiseks',
  'snäkk', 'snäkid', 'snack', 'snacks', 'vahepalaks', 'magustoit', 'maiustus',
  'komm', 'kommid', 'küpsis', 'küpsised', 'koogid',
  'tahan', 'teen', 'teha', 'palun', 'retsept', 'kuidas', 'valmista', 'kokka', 'portsjon', 'portsjonit'
];

function extractTokensFromText_(text, minLen) {
  minLen = (minLen == null) ? 4 : minLen;
  return String(text || '')
    .toLowerCase()
    .replace(/[,.;:!?()"'\[\]\\\/]/g, ' ')
    .split(/\s+/)
    .filter(function (w) {
      if (!w) return false;
      if (w.length < minLen) return false;
      return STOPWORDS_ET.indexOf(w) === -1;
    });
}

function escapeRegex_(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsAny_(text, arr) {
  for (var i = 0; i < arr.length; i++) if (text.indexOf(arr[i]) !== -1) return true;
  return false;
}

function getVal_(row, idx) {
  return (idx == null) ? '' : String(row[idx] == null ? '' : row[idx]);
}

function getFirstMappedVal_(row, map, keys) {
  if (!row || !map || !keys || !keys.length) return '';
  for (var i = 0; i < keys.length; i++) {
    var idx = map[keys[i]];
    if (idx == null) continue;
    var v = getVal_(row, idx).trim();
    if (v) return v;
  }
  return '';
}

function parseBool_(v) {
  var s = String(v == null ? '' : v).trim().toLowerCase();
  return ['true', 't', '1', 'jah', 'jaa', 'yes', 'y'].indexOf(s) !== -1;
}

function parseNumber_(v) {
  var n = Number(v);
  return isNaN(n) ? 0 : n;
}

function parseNullableNumber_(v) {
  if (v == null) return null;
  var s = String(v).trim();
  if (!s) return null;
  s = s.replace(',', '.');
  var n = Number(s);
  return isNaN(n) ? null : n;
}

function normalizeNameKey_(s) {
  return String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function normalizeProductIdentity_(v) {
  var s = String(v == null ? '' : v).trim();
  if (!s) return '';
  if (!/[a-z]/i.test(s)) {
    var digits = s.replace(/\D/g, '');
    if (digits) return digits;
  }
  return s.toLowerCase();
}

function getProductIdentityValues_(p) {
  if (!p) return [];

  var raw = [
    p.id,
    p.product_id,
    p.productId,
    p.external_product_id,
    p.externalProductId,
    p.shop_product_id,
    p.shopProductId,
    p.sku,
    p.productSku,
    p.product_sku,
    p.handle,
    p.slug,
    p.product_slug,
    p.productSlug
  ];

  var out = [];
  var seen = {};

  for (var i = 0; i < raw.length; i++) {
    var val = String(raw[i] == null ? '' : raw[i]).trim();
    if (!val || seen[val]) continue;
    seen[val] = true;
    out.push(val);
  }

  return out;
}

function getProductIdentityKeys_(p) {
  var vals = getProductIdentityValues_(p);
  var keys = {};

  for (var i = 0; i < vals.length; i++) {
    var raw = vals[i];
    keys[raw] = true;
    var normalized = normalizeProductIdentity_(raw);
    if (normalized) keys[normalized] = true;
  }

  return Object.keys(keys);
}

function resolveProductByIdentity_(index, idLike) {
  if (!index) return null;
  var raw = String(idLike == null ? '' : idLike).trim();
  if (!raw) return null;

  if (index[raw]) return index[raw];
  var normalized = normalizeProductIdentity_(raw);
  if (normalized && index[normalized]) return index[normalized];
  return null;
}

function getCanonicalProductKey_(p) {
  var vals = getProductIdentityValues_(p);
  if (!vals.length) return '';

  var preferred = String(p.id || p.product_id || p.sku || vals[0] || '').trim();
  var normalizedPreferred = normalizeProductIdentity_(preferred);
  if (normalizedPreferred) return normalizedPreferred;

  var normalizedFirst = normalizeProductIdentity_(vals[0]);
  return normalizedFirst || vals[0];
}

function getCanonicalProductKeyFromId_(idLike, index) {
  var product = resolveProductByIdentity_(index, idLike);
  if (product) return getCanonicalProductKey_(product);

  var raw = String(idLike == null ? '' : idLike).trim();
  if (!raw) return '';
  var normalized = normalizeProductIdentity_(raw);
  return normalized || raw;
}

function expandIngredientProductIds_(idLike, index) {
  var out = [];
  var seen = {};

  function add(v) {
    var raw = String(v == null ? '' : v).trim();
    if (!raw || seen[raw]) return;
    seen[raw] = true;
    out.push(raw);
  }

  add(idLike);

  var product = resolveProductByIdentity_(index, idLike);
  var aliases = getProductIdentityValues_(product);
  for (var i = 0; i < aliases.length; i++) add(aliases[i]);

  return out;
}

/*************************************************
 * Andmete laadimine: AI_catalog
 *************************************************/
function loadAiCatalog_() {
  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName(AI_CATALOG_SHEET);
  if (!sh) throw new Error('Sheet "' + AI_CATALOG_SHEET + '" ei leitud.');

  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];

  var header = values[0].map(function (h) { return String(h || '').trim(); });
  var map = {};
  header.forEach(function (name, idx) { if (name) map[name] = idx; });

  var rows = [];

  for (var r = 1; r < values.length; r++) {
    var row = values[r];

    var id = getVal_(row, map['id']).trim();
    var name = getVal_(row, map['productName']).trim();
    if (!id || !name) continue;

    var inStock = parseBool_(row[map['inStock']]);
    var stockLevel = parseNumber_(row[map['stockLevel']]);
    var isAvailable = !!inStock && stockLevel > 0;
    var productId = getFirstMappedVal_(row, map, [
      'product_id', 'productId',
      'shop_product_id', 'shopProductId',
      'external_product_id', 'externalProductId'
    ]);
    var sku = getFirstMappedVal_(row, map, ['sku', 'product_sku', 'productSku']);
    var handle = getFirstMappedVal_(row, map, ['handle', 'slug', 'product_slug', 'productSlug']);

    rows.push({
      sourceSheet: getVal_(row, map['sourceSheet']),
      id: String(id),
      product_id: String(productId || id),
      productId: String(productId || id),
      sku: String(sku || ''),
      handle: String(handle || ''),
      productName: name,
      category: getVal_(row, map['category']),
      subCategory: getVal_(row, map['subCategory']),
      categoryPath: getVal_(row, map['categoryPath']),
      price: parseNumber_(row[map['price']]),
      productUrl: getVal_(row, map['productUrl']),
      imageUrl: getVal_(row, map['imageUrl']),
      diet_vegan: parseBool_(row[map['diet_vegan']]),
      diet_glutenFree: parseBool_(row[map['diet_glutenFree']]),
      inStock: inStock,
      stockLevel: stockLevel,
      isAvailable: isAvailable,
      pack_size: parseNullableNumber_(row[map['pack_size']]),
      pack_unit: getVal_(row, map['pack_unit']) || getVal_(row, map['packUnit']) || '',
      qty_unit: getVal_(row, map['qty_unit']) || getVal_(row, map['unit']) || '',
      usageProfile: getVal_(row, map['usageProfile']),
      chatbotDescription: getVal_(row, map['chatbotDescription'])
    });
  }

  return rows;
}

function indexProductsById_(products) {
  var m = {};
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (!p) continue;
    var keys = getProductIdentityKeys_(p);
    for (var k = 0; k < keys.length; k++) {
      var key = String(keys[k] || '').trim();
      if (!key) continue;
      if (m[key]) continue; // keep first mapping stable
      m[key] = p;
    }
  }
  return m;
}

/*************************************************
 * Andmete laadimine: Recipe_Bank
 *************************************************/
function loadRecipeBank_() {
  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName(RECIPE_BANK_SHEET);
  if (!sh) throw new Error('Sheet "' + RECIPE_BANK_SHEET + '" ei leitud.');

  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];

  var header = values[0].map(function (h) { return String(h || '').trim(); });
  var map = {};
  header.forEach(function (name, idx) { if (name) map[name] = idx; });

  var out = [];

  for (var r = 1; r < values.length; r++) {
    var row = values[r];

    var recipeId = getVal_(row, map['recipe_id']).trim();
    var recipeName = getVal_(row, map['recipe_name']).trim();
    if (!recipeId || !recipeName) continue;

    var rec = {
      recipe_id: recipeId,
      recipe_name: recipeName,
      aliases: getVal_(row, map['aliases']).trim(),
      tags: getVal_(row, map['tags']).trim(),
      image_url: getVal_(row, map['image_url']).trim(),
      image_thumb_url: getVal_(row, map['image_thumb_url']).trim(),
      default_servings: parseNumber_(row[map['default_servings']]),
      instructions_steps: getVal_(row, map['instructions_steps']).trim(),
      home_ingredients: getVal_(row, map['home_ingredients']).trim(),
      random_pool: parseBool_(row[map['random_pool']]),
      diet_vegan: parseBool_(row[map['diet_vegan']]),
      diet_glutenFree: parseBool_(row[map['diet_glutenFree']]),
      ingredients: []
    };

    for (var i = 1; i <= 12; i++) {
      var label = getVal_(row, map['ing' + i + '_label']).trim();
      var pid = getVal_(row, map['ing' + i + '_product_id']).trim();
      var qty = getVal_(row, map['ing' + i + '_qty_base']).trim();
      var unit = getVal_(row, map['ing' + i + '_unit']).trim();
      var req = parseBool_(row[map['ing' + i + '_required']]);
      var qtyBase = parseNullableNumber_(qty);

      if (!label && !pid) continue;

      rec.ingredients.push({
        ingredientName: label,
        productId: pid ? String(pid) : '',
        amount: (qty ? qty : '') + (unit ? (' ' + unit) : ''),
        required: req,
        qty_base: qtyBase,
        qtyBase: qtyBase,
        unit: unit
      });
    }

    out.push(rec);
  }

  return out;
}

/*************************************************
 * ENDPOINT: listRecipes (chips)
 * IMPORTANT: include recipeTitle/recipeName/title/name so widget shows real names
 *************************************************/
function listRecipes_(limit) {
  limit = limit || RECIPE_MAX_LIST;
  var bank = loadRecipeBank_();
  var catalogAll = loadAiCatalog_();
  var productsById = indexProductsById_(catalogAll);

  var out = bank.map(function (r) {
    var nm = String(r.recipe_name || '').trim();
    // Collect unique product IDs from ingredients so the widget can filter
    // "which recipes contain my cart product" client-side.
    var productIds = [];
    var seen = {};
    var ings = r.ingredients || [];
    for (var i = 0; i < ings.length; i++) {
      var pid = String(ings[i].productId || '').trim();
      if (!pid) continue;
      var aliases = expandIngredientProductIds_(pid, productsById);
      for (var j = 0; j < aliases.length; j++) {
        var alias = String(aliases[j] || '').trim();
        if (!alias || seen[alias]) continue;
        seen[alias] = true;
        productIds.push(alias);
      }
    }
    return {
      recipe_id: r.recipe_id,
      recipe_name: nm,

      // UI compatibility aliases (so widget won't fall back to "Retsept 1")
      recipeTitle: nm,
      recipeName: nm,
      title: nm,
      name: nm,

      aliases: r.aliases || '',
      tags: r.tags || '',
      image_url: r.image_url || r.image_thumb_url || '',
      diet_vegan: !!r.diet_vegan,
      diet_glutenFree: !!r.diet_glutenFree,
      product_ids: productIds
    };
  });

  out.sort(function (a, b) {
    return String(a.recipe_name).localeCompare(String(b.recipe_name), 'et');
  });

  return out.slice(0, Math.max(1, limit));
}


/*************************************************
 * Affiliate Tracking: Sheet init + log
 * - auto-migrate headers
 * - log vendor + widget_version + backend_version
 *************************************************/
function ensureHeaders_(sh, requiredHeaders) {
  requiredHeaders = requiredHeaders || [];
  if (!requiredHeaders.length) return sh;

  if (sh.getLastRow() === 0) {
    sh.appendRow(requiredHeaders);
    return sh;
  }

  var lastCol = Math.max(1, sh.getLastColumn());
  var headerRow = sh.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h || '').trim(); });

  var existing = {};
  headerRow.forEach(function (h) { if (h) existing[h] = true; });

  var missing = requiredHeaders.filter(function (h) { return !existing[h]; });
  if (missing.length) {
    sh.insertColumnsAfter(lastCol, missing.length);
    sh.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
  }

  return sh;
}

function getHeaderMap_(sh) {
  var lastCol = Math.max(1, sh.getLastColumn());
  var headerRow = sh.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h || '').trim(); });
  var out = {};
  for (var i = 0; i < headerRow.length; i++) {
    var name = headerRow[i];
    if (!name) continue;
    out[name] = i;
  }
  return out;
}

function appendRowByHeader_(sh, valuesByHeader) {
  valuesByHeader = valuesByHeader || {};
  var map = getHeaderMap_(sh);
  var row = new Array(Math.max(1, sh.getLastColumn()));
  for (var i = 0; i < row.length; i++) row[i] = '';

  Object.keys(valuesByHeader).forEach(function (key) {
    var idx = map[key];
    if (idx == null) return;
    row[idx] = valuesByHeader[key];
  });

  sh.appendRow(row);
}

function isExactHeaderMatch_(sh, requiredHeaders) {
  requiredHeaders = requiredHeaders || [];
  if (!requiredHeaders.length) return true;

  var lastCol = Math.max(1, sh.getLastColumn());
  var headerRow = sh.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h || '').trim(); })
    .filter(function (h) { return !!h; });

  if (headerRow.length !== requiredHeaders.length) return false;
  for (var i = 0; i < requiredHeaders.length; i++) {
    if (headerRow[i] !== requiredHeaders[i]) return false;
  }
  return true;
}

function makeUniqueSheetName_(ss, baseName) {
  var name = String(baseName || '').trim();
  if (!name) name = 'Sheet';
  if (!ss.getSheetByName(name)) return name;

  var n = 1;
  while (ss.getSheetByName(name + '_' + n)) n++;
  return name + '_' + n;
}

function ensureEventSheet_() {
  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName(EVENT_LOG_SHEET);
  if (!sh) sh = ss.insertSheet(EVENT_LOG_SHEET);

  var requiredHeaders = [
    // keep legacy Affiliate_Events structure (existing production sheet)
    'ts_iso',
    'event',
    'session_id',
    'assisted',
    'reason',
    'page_url',
    'referrer',
    'user_agent',
    'origin',
    'product_ids',
    'recipe_id',
    'order_id',
    'revenue',
    'currency',
    'notes',
    'vendor',
    'widget_version',
    'backend_version'
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(requiredHeaders);
    return sh;
  }

  if (isExactHeaderMatch_(sh, requiredHeaders)) return sh;

  // Old/mixed structure -> archive and recreate clean sheet for stable mapping.
  var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : 'Etc/GMT';
  var baseBackupName = EVENT_LOG_SHEET + '_archive_' + Utilities.formatDate(new Date(), tz, 'yyyyMMdd_HHmmss');
  var backupName = makeUniqueSheetName_(ss, baseBackupName);
  sh.setName(backupName);

  var newSheet = ss.insertSheet(EVENT_LOG_SHEET);
  newSheet.appendRow(requiredHeaders);
  return newSheet;
}

function logAffiliateEvent_(payload, meta) {
  payload = payload || {};
  meta = meta || {};

  var sh = ensureEventSheet_();
  var tsIso = new Date().toISOString();
  var eventName = String(payload.event || '').trim();
  if (!eventName) throw new Error('Missing event');

  var cartId = safeLogCell_(payload.cart_id || payload.cartId || '', 300);
  var sessionId = safeLogCell_(
    payload.session_id || payload.sessionId || cartId || '',
    160
  );
  var clientId = safeLogCell_(getStableUserId_(payload), 32);
  if (!sessionId) sessionId = clientId;

  var assisted = parseBool_(payload.assisted) ? '1' : '0';
  var reason = String(payload.reason || '').trim();
  var status = safeLogCell_(
    payload.status || (String(payload.error || '').trim() ? 'error' : 'ok'),
    32
  ).toLowerCase();

  var pageUrl = String(payload.page_url || '').trim();
  var ref = String(payload.referrer || '').trim();
  var ua = String(payload.user_agent || meta.user_agent || '').trim();

  var origin = normalizeToOrigin_(payload.origin || meta.origin) || String(payload.origin || meta.origin || '').trim();

  var productIds = payload.product_ids;
  if (Array.isArray(productIds)) productIds = productIds.join(',');
  productIds = String(productIds || '').trim();

  var recipeId = String(payload.recipe_id || '').trim();

  var orderId = String(payload.order_id || '').trim();
  var revenue = (payload.revenue == null || payload.revenue === '') ? '' : String(payload.revenue).trim();
  var currency = String(payload.currency || '').trim();

  var notes = String(payload.notes || '').trim();

  // NEW
  var vendor = VENDOR_NAME; // enforce server-side attribution
  var widgetVersion = String(
    payload.widget_version ||
    payload.widgetVersion ||
    payload.widget_ver ||
    payload.widgetVer ||
    ''
  ).trim();
  var backendVersion = BACKEND_VERSION;

  if (eventName === 'cart_add' || eventName === 'cart_add_confirmed') {
    markCartAddSeen_(clientId, sessionId);
  }

  var rowByHeader = {
    // legacy headers (source-of-truth for existing production sheet)
    ts_iso: tsIso,
    event: eventName,
    session_id: sessionId,
    assisted: assisted,
    reason: reason,
    page_url: pageUrl,
    referrer: ref,
    user_agent: ua,
    origin: origin,
    product_ids: productIds,
    recipe_id: recipeId,
    order_id: orderId,
    revenue: revenue,
    currency: currency,
    notes: notes,
    vendor: vendor,
    widget_version: widgetVersion,
    backend_version: backendVersion
  };

  appendRowByHeader_(sh, rowByHeader);

  return {
    ok: true,
    logged: true,
    ts: tsIso,
    status: status || 'ok',
    client_id: clientId,
    session_id: sessionId,
    vendor: vendor,
    version: backendVersion,
    widget_version: widgetVersion
  };
}

function ensureChatLogSheet_() {
  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName(CHAT_LOG_SHEET);
  if (!sh) sh = ss.insertSheet(CHAT_LOG_SHEET);

  var requiredHeaders = [
    // simplified analytics columns
    'date',
    'id',
    'chat_log',
    'added_to_cart'
  ];

  if (sh.getLastRow() === 0) {
    sh.appendRow(requiredHeaders);
    return sh;
  }

  var lastCol = Math.max(1, sh.getLastColumn());
  var headerRow = sh.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h || '').trim(); })
    .filter(function (h) { return !!h; });

  var exact = headerRow.length === requiredHeaders.length;
  if (exact) {
    for (var i = 0; i < requiredHeaders.length; i++) {
      if (headerRow[i] !== requiredHeaders[i]) {
        exact = false;
        break;
      }
    }
  }

  if (exact) return sh;

  // Preserve old detailed log sheet by archiving, then create a clean simple sheet.
  var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : 'Etc/GMT';
  var baseBackupName = CHAT_LOG_SHEET + '_archive_' + Utilities.formatDate(new Date(), tz, 'yyyyMMdd_HHmmss');
  var backupName = makeUniqueSheetName_(ss, baseBackupName);
  sh.setName(backupName);

  var newSheet = ss.insertSheet(CHAT_LOG_SHEET);
  newSheet.appendRow(requiredHeaders);
  return newSheet;
}

function safeLogCell_(val, maxLen) {
  var s = String(val == null ? '' : val);
  s = s.replace(/\r\n/g, '\n');
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

function hashTo7Digits_(s) {
  s = String(s == null ? '' : s);
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = ((h * 31) + s.charCodeAt(i)) % 9000000;
  }
  return String(1000000 + Math.abs(h));
}

function normalize7DigitId_(raw) {
  var s = String(raw == null ? '' : raw).trim();
  if (!s) return '';

  var digits = s.replace(/\D/g, '');
  if (digits.length >= 7) return digits.slice(-7);
  if (digits.length > 0) return ('0000000' + digits).slice(-7);

  return hashTo7Digits_(s);
}

function getStableUserId_(payload) {
  payload = payload || {};
  var base =
    payload.client_id ||
    payload.clientId ||
    payload.session_id ||
    payload.sessionId ||
    payload.cart_id ||
    payload.cartId ||
    '';

  var id = normalize7DigitId_(base);
  if (id) return id;
  return String(Math.floor(1000000 + Math.random() * 9000000));
}

function cartAddCacheKey_(idOrSession) {
  return 'GREENEST_CART_ADD_' + String(idOrSession || '').trim();
}

function markCartAddSeen_(userId, sessionId) {
  var cache = CacheService.getScriptCache();
  if (!cache) return;
  var ttl = 60 * 60 * 12; // 12h
  if (userId) cache.put(cartAddCacheKey_(userId), '1', ttl);
  if (sessionId) cache.put(cartAddCacheKey_(sessionId), '1', ttl);
}

function hasCartAddSeen_(userId, sessionId) {
  var cache = CacheService.getScriptCache();
  if (!cache) return false;
  if (userId && cache.get(cartAddCacheKey_(userId)) === '1') return true;
  if (sessionId && cache.get(cartAddCacheKey_(sessionId)) === '1') return true;
  return false;
}

function makeRequestId_(prefix) {
  var p = String(prefix || 'req').replace(/[^a-zA-Z0-9_-]/g, '');
  if (!p) p = 'req';
  return p + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function logChatMessage_(payload, meta) {
  payload = payload || {};
  meta = meta || {};

  var sh = ensureChatLogSheet_();
  var tsIso = new Date().toISOString();
  var datePart = tsIso.slice(0, 10);
  var requestId = safeLogCell_(payload.request_id || payload.requestId || makeRequestId_('req'), 120);
  var sessionId = safeLogCell_(payload.session_id || payload.sessionId || '', 160);
  var userId = safeLogCell_(getStableUserId_(payload), 32);
  var userMessage = safeLogCell_(payload.user_message || payload.userMessage || '', 15000);
  var assistantMessage = safeLogCell_(payload.assistant_message || payload.assistantMessage || '', 15000);
  var errorMessage = safeLogCell_(payload.error_message || payload.errorMessage || '', 15000);

  var chatParts = [];
  if (userMessage) chatParts.push('User: ' + userMessage);
  if (assistantMessage) chatParts.push('Assistant: ' + assistantMessage);
  if (errorMessage) chatParts.push('Error: ' + errorMessage);
  var chatLog = chatParts.join(' | ');

  var addedFromPayload = parseBool_(payload.added_to_cart || payload.addedToCart);
  var addedToCart = (addedFromPayload || hasCartAddSeen_(userId, sessionId)) ? 'yes' : 'no';

  appendRowByHeader_(sh, {
    date: datePart,
    id: userId,
    chat_log: chatLog,
    added_to_cart: addedToCart
  });

  return {
    ok: true,
    logged: true,
    action: 'chatlog',
    sheet: CHAT_LOG_SHEET,
    ts: tsIso,
    request_id: requestId,
    id: userId,
    added_to_cart: addedToCart,
    vendor: VENDOR_NAME,
    version: BACKEND_VERSION
  };
}

function validateTrackingAuth_(payload, meta) {
  meta = meta || {};
  payload = payload || {};

  // 1) origin allowlist (soft if origin missing)
  if (!isOriginAllowed_(meta.origin || payload.origin)) {
    throw new Error('Origin not allowed');
  }

  // 2) token check (hard if token is configured)
  var requiredToken = getSiteToken_();
  if (requiredToken) {
    var got = String(payload.site_token || '').trim();
    if (!got || got !== requiredToken) {
      throw new Error('Invalid site_token');
    }
  }
}

/*************************************************
 * RECIPE/SHOPPING – existing logic
 *************************************************/
function scoreRecipeBankRow_(rec, query) {
  var q = String(query || '').toLowerCase().trim();
  var qTokens = extractTokensFromText_(q, 3);

  var name = String(rec.recipe_name || '').toLowerCase();
  var aliases = String(rec.aliases || '').toLowerCase();
  var tags = String(rec.tags || '').toLowerCase();

  var score = 0;
  if (name && name.length >= 4 && q.indexOf(name) !== -1) score += 60;

  for (var i = 0; i < qTokens.length; i++) {
    var t = qTokens[i];
    if (!t) continue;

    var re = new RegExp('(^|\\s|-)'+ escapeRegex_(t) +'(\\s|$|-)','i');

    if (re.test(name)) score += 18;
    else if (name.indexOf(t) !== -1) score += 10;

    if (aliases) {
      if (re.test(aliases)) score += 10;
      else if (aliases.indexOf(t) !== -1) score += 6;
    }

    if (tags && tags.indexOf(t) !== -1) score += 2;
  }

  return score;
}


function pickRecipeWithAI_(query, candidates) {
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');
  if (!apiKey || !candidates.length) return null;

  var lines = candidates.map(function (r) {
    var aliases = String(r.recipe_name_aliases || r.aliases || '').trim();
    var tags = String(r.recipe_tags || r.tags || '').trim();
    return String(r.recipe_id || '').trim() + '|' + String(r.recipe_name || '').trim() +
           (aliases ? '|' + aliases : '') + (tags ? '|' + tags : '');
  });

  var prompt = [
    'Kliendi otsing retsepti jaoks: "' + String(query || '').trim() + '"',
    '',
    'Saadaval retseptid (id|nimi|aliases|tags):',
    lines.join('\n'),
    '',
    'Vali 1 kõige paremini sobiv retsept.',
    'Kui ükski ei sobi, tagasta {"id":null}.',
    'Tagasta AINULT JSON kujul {"id":"retsepti_id"}, mitte midagi muud.'
  ].join('\n');

  var payload = {
    model: CLAUDE_MODEL,
    max_tokens: 80,
    temperature: 0,
    system: 'Vali järgnevast nimekirjast kliendi otsingule kõige paremini sobiv retsept. Kasuta oma otsustust — arvesta sünonüüme ja konteksti. Kui sobivat pole, tagasta {"id":null}.',
    messages: [{ role: 'user', content: prompt }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var body = JSON.parse(response.getContentText());
    if (response.getResponseCode() !== 200 || !body.content || !body.content.length) return null;
    var text = String(body.content[0].text || '').trim().replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    var parsed = JSON.parse(text);
    return parsed.id || null;
  } catch (err) {
    Logger.log('pickRecipeWithAI_ error: ' + err);
    return null;
  }
}

function selectRecipeFromBank_(query, recipeBank, veganOnly, glutenFreeOnly, requestedRecipeId) {
  if (!recipeBank || !recipeBank.length) return null;
  requestedRecipeId = String(requestedRecipeId || '').trim();

  var candidates = recipeBank.filter(function (r) {
    if (veganOnly && !r.diet_vegan) return false;
    if (glutenFreeOnly && !r.diet_glutenFree) return false;
    return true;
  });

  if (!candidates.length) candidates = recipeBank.slice(0);

  if (requestedRecipeId) {
    for (var j = 0; j < candidates.length; j++) {
      if (String(candidates[j].recipe_id || '').trim() === requestedRecipeId) {
        return candidates[j];
      }
    }
    for (var k = 0; k < recipeBank.length; k++) {
      if (String(recipeBank[k].recipe_id || '').trim() === requestedRecipeId) {
        return recipeBank[k];
      }
    }
  }

  // Try AI-based selection first (Claude understands context and synonyms)
  var aiPickedId = pickRecipeWithAI_(query, candidates);
  if (aiPickedId) {
    for (var ai = 0; ai < candidates.length; ai++) {
      if (String(candidates[ai].recipe_id || '').trim() === String(aiPickedId).trim()) {
        return candidates[ai];
      }
    }
  }

  // Fallback: keyword scoring if AI unavailable or returned null
  var bestScore = -1;
  var best = [];

  for (var i = 0; i < candidates.length; i++) {
    var rec = candidates[i];
    var s = scoreRecipeBankRow_(rec, query);

    if (s > bestScore) { bestScore = s; best = [rec]; }
    else if (s === bestScore) { best.push(rec); }
  }

  if (bestScore <= 0) {
    var pool = candidates.filter(function (r) { return !!r.random_pool; });
    if (!pool.length) pool = candidates;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return best[Math.floor(Math.random() * best.length)];
}

function mergeIngredientMetaIntoProduct_(wrapped, ing) {
  if (!wrapped) return null;
  ing = ing || {};

  var out = {};
  Object.keys(wrapped).forEach(function (k) { out[k] = wrapped[k]; });

  var qtyBase = (ing.qty_base == null || ing.qty_base <= 0) ? null : Number(ing.qty_base);
  var unit = String(ing.unit || '').trim();

  out.qty_base = qtyBase;
  out.qtyBase = qtyBase;
  out.unit = unit;
  out.qty_unit = unit || out.qty_unit || '';
  out.required = !!ing.required;
  out.ingredientName = String(ing.ingredientName || '').trim();

  return out;
}

function parseSteps_(text) {
  var s = String(text || '').trim();
  if (!s) return [];

  var lines = s.split(/\n+/).map(function (x) { return String(x || '').trim(); }).filter(Boolean);
  if (lines.length >= 2) return lines;

  var parts = s.split(/(?:\s*;\s*|\s+\.\s+|\s+\-\s+)/).map(function (x) { return String(x || '').trim(); }).filter(Boolean);
  if (parts.length >= 2) return parts;

  return [s];
}

function normalizeLang_(lang) {
  return String(lang || '').trim().toLowerCase() === 'en' ? 'en' : 'et';
}

function formatRecipeTextFromBank_(rec, lang) {
  if (!rec) return '';

  var isEn = normalizeLang_(lang) === 'en';
  var title = String(rec.recipe_name || '').trim();
  var servings = rec.default_servings ? Number(rec.default_servings) : null;

  var lines = [];
  lines.push(servings ? (title + ' (' + servings + ' ' + (isEn ? 'servings' : 'portsjonit') + ')') : title);
  lines.push('');

  var reqLines = [];
  var optLines = [];

  for (var i = 0; i < (rec.ingredients || []).length; i++) {
    var ing = rec.ingredients[i] || {};
    var nm = String(ing.ingredientName || '').trim();
    if (!nm) continue;

    var amt = String(ing.amount || '').trim();
    var row = '- ' + (amt ? (amt + ' ') : '') + nm;

    if (ing.required) reqLines.push(row);
    else optLines.push(row + (isEn ? ' (optional)' : ' (valikuline)'));
  }

  if (reqLines.length || optLines.length) {
    lines.push(isEn ? 'Ingredients (from Greenest):' : 'Koostisosad (Greenestist):');
    reqLines.forEach(function (x) { lines.push(x); });
    optLines.forEach(function (x) { lines.push(x); });
    lines.push('');
  }

  var home = String(rec.home_ingredients || '').trim();
  if (home) {
    lines.push(isEn ? 'Home / fresh:' : 'Kodust / värsked:');
    var homeLines = home.split(/\n|, /).map(function (x) { return String(x || '').trim(); }).filter(Boolean);
    homeLines.forEach(function (x) { lines.push('- ' + x); });
    lines.push('');
  }

  var steps = parseSteps_(rec.instructions_steps);
  if (steps.length) {
    lines.push(isEn ? 'Steps:' : 'Sammud:');
    for (var j = 0; j < steps.length; j++) {
      var st = String(steps[j] || '').trim();
      if (!st) continue;
      if (/^\d+\./.test(st)) lines.push(st);
      else lines.push((j + 1) + '. ' + st);
    }
  }

  return lines.join('\n').trim();
}

function decideMode_(query, products) {
  var q = String(query || '').toLowerCase().trim();

  var explicitRecipe = ['retsept', 'kuidas teha', 'tee mulle', 'tahan teha', 'valmista', 'kokka', 'õhtusöök', 'lõuna', 'hommikusöök', 'portsjon'];
  var explicitShop = ['osta', 'ostan', 'lisa ostukorvi', 'kingitus', 'kingituseks', 'soovin osta', 'otsin'];

  if (containsAny_(q, explicitShop)) return 'shopping';
  if (containsAny_(q, explicitRecipe)) return 'recipe';

  var probe = getTopShoppingCandidates_(products, query, 1);
  if (probe.topScore > 0) return 'shopping';

  return 'recipe';
}

function scoreProductForShopping_(p, query, queryTokens) {
  var qLower = String(query || '').toLowerCase().trim();
  var name = String(p.productName || '').toLowerCase();
  if (!name) return 0;

  var score = 0;

  if (qLower && qLower.length >= 2 && name.indexOf(qLower) !== -1) score += 25;

  (queryTokens || []).forEach(function (t) {
    if (!t) return;
    var re = new RegExp('(^|\\s|-)'+ escapeRegex_(t) +'(\\s|$|-)','i');
    if (re.test(name)) score += 12;
    else if (name.indexOf(t) !== -1) score += 6;
  });

  if (p.isAvailable) score += 2;
  return score;
}

function uniqueByProductName_(scoredList, limit) {
  var seen = {};
  var out = [];
  for (var i = 0; i < scoredList.length; i++) {
    var p = scoredList[i].product;
    var key = normalizeNameKey_(p && p.productName);
    if (!key) continue;
    if (seen[key]) continue;
    seen[key] = true;
    out.push(scoredList[i]);
    if (out.length >= limit) break;
  }
  return out;
}

function getTopShoppingCandidates_(products, query, limit) {
  limit = limit || 8;
  var tokens = extractTokensFromText_(query, 2);
  var scored = [];

  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var s = scoreProductForShopping_(p, query, tokens);
    if (s > 0) scored.push({ product: p, score: s });
  }

  scored.sort(function (a, b) { return b.score - a.score; });

  return {
    topScore: scored.length ? scored[0].score : 0,
    candidates: scored.slice(0, Math.max(limit, 50))
  };
}

// Step 1: AI normaliseerib kliendi päringu — parandab kirjavead, teisendab käänded nimetavasse
function normalizeShoppingQuery_(query) {
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');
  if (!apiKey) return query;

  var payload = {
    model: CLAUDE_MODEL,
    max_tokens: 60,
    temperature: 0,
    system: 'Normaliseeri eestikeelne tooteotsing. Tagasta ainult puhas otsingutermin, midagi muud mitte.',
    messages: [{ role: 'user', content: 'Päring: "' + String(query || '').trim() + '"' }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var body = JSON.parse(response.getContentText());
    if (response.getResponseCode() !== 200 || !body.content || !body.content.length) return query;
    var normalized = String(body.content[0].text || '').trim();
    return normalized || query;
  } catch (err) {
    Logger.log('normalizeShoppingQuery_ error: ' + err);
    return query;
  }
}

// Step 3: AI valib rule-based kandidaatidest parimad 1-3
function pickShoppingProductsWithAI_(originalQuery, normalizedQuery, candidates) {
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');
  if (!apiKey || !candidates.length) return null;

  var lines = candidates.map(function (e) {
    var p = e.product;
    var cat = p.categoryPath || p.category || '';
    return p.id + '|' + p.productName + (cat ? '|' + cat : '');
  });

  var prompt = [
    'Kliendi otsing: "' + originalQuery + '" (normaliseeritud: "' + normalizedQuery + '")',
    '',
    'Kandidaattooted (id|nimi|kategooria):',
    lines.join('\n'),
    '',
    'Vali 1–3 kõige täpsemini sobivat toodet parimas järjekorras.',
    'Kui ükski kandidaat ei sobi kliendi otsinguga, tagasta {"ids":[]}.',
    'Tagasta AINULT JSON kujul {"ids":["id1","id2","id3"]}, mitte midagi muud.'
  ].join('\n');

  var payload = {
    model: CLAUDE_MODEL,
    max_tokens: 120,
    temperature: 0,
    system: 'Vali järgnevast nimekirjast kliendi otsingule kõige paremini sobivad tooted. Kui sobivaid pole, tagasta {"ids":[]}.',
    messages: [{ role: 'user', content: prompt }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var body = JSON.parse(response.getContentText());
    if (response.getResponseCode() !== 200 || !body.content || !body.content.length) return null;
    var text = String(body.content[0].text || '').trim();
    text = text.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    var parsed = JSON.parse(text);
    return Array.isArray(parsed.ids) ? parsed.ids : null;
  } catch (err) {
    Logger.log('pickShoppingProductsWithAI_ error: ' + err);
    return null;
  }
}

function buildShoppingResponse_(query, products, lang) {
  var isEn = normalizeLang_(lang) === 'en';
  // Step 1: AI normaliseerib päringu (kirjavead, käänded)
  var normalizedQuery = normalizeShoppingQuery_(query);
  Logger.log('Shopping query: "' + query + '" → normalized: "' + normalizedQuery + '"');

  // Step 2: rule-based keyword filter normaliseeritud päringuga
  var top = getTopShoppingCandidates_(products, normalizedQuery, 50);
  var candidates = top.candidates;

  // Kui keyword filter ei leia midagi, AI otsib kogu kataloogist (käändevormid vm)
  if (!candidates.length) {
    candidates = products.map(function (p) { return { product: p, score: 0 }; });
  }

  // Step 3: AI valib kandidaatidest parimad 1-3
  var aiIds = pickShoppingProductsWithAI_(query, normalizedQuery, candidates);

  if (aiIds && aiIds.length) {
    var byId = {};
    candidates.forEach(function (e) { byId[String(e.product.id)] = e.product; });
    var mainProducts = [];
    aiIds.forEach(function (id) {
      var p = byId[String(id)];
      if (p) mainProducts.push(wrapProductForApi_(p, lang));
    });
    if (mainProducts.length) {
      return {
        mode: 'shopping',
        assistantText: isEn
          ? 'I found products that match your search.'
          : 'Leidsin sinu otsingule sobivad tooted.',
        mainProducts: mainProducts,
        upsellProducts: []
      };
    }
  }

  // AI tagastas [] — ei leidnud sobivaid tooteid → Haiku vastab kontekstitundlikult
  var noProductsReply = callClaudeHaikuLang_(query, null, getLangInstruction_(lang));
  return {
    mode: 'smalltalk',
    assistantText: noProductsReply || (isEn ? 'I could not find products matching your search. Can I help with something else?' : 'Selle otsingu jaoks ei leidnud sobivaid tooteid. Saan aidata millegi muuga?'),
    mainProducts: [],
    upsellProducts: []
  };
}

function buildRecipeResponseFromBank_(query, productsAll, veganOnly, glutenFreeOnly, recipeId, lang) {
  var isEn = normalizeLang_(lang) === 'en';
  var recipeBank = loadRecipeBank_();
  var rec = selectRecipeFromBank_(query, recipeBank, veganOnly, glutenFreeOnly, recipeId);

  if (!rec) {
    return {
      mode: 'recipe',
      assistantText: isEn
        ? 'I could not find a recipe in Recipe_Bank right now.'
        : 'Hetkel ei leidnud Recipe_Bankist ühtegi retsepti.',
      mainProducts: [],
      upsellProducts: []
    };
  }

  var productsById = indexProductsById_(productsAll);
  var assistantText = formatRecipeTextFromBank_(rec, lang);

  var missingIngredients = [];
  var mainProducts = [];
  var mainById = {};
  var ingredientMatches = [];

  for (var i = 0; i < (rec.ingredients || []).length; i++) {
    var ing = rec.ingredients[i] || {};
    var pid = String(ing.productId || '').trim();
    var p = pid ? productsById[pid] : null;

    if (!p && pid) missingIngredients.push(String(ing.ingredientName || '').trim());

    var wrapped = p ? wrapProductForApi_(p, lang) : null;
    var enrichedProduct = mergeIngredientMetaIntoProduct_(wrapped, ing);

    ingredientMatches.push({
      ingredientName: String(ing.ingredientName || '').trim(),
      amount: String(ing.amount || '').trim(),
      qty_base: (ing.qty_base == null ? null : Number(ing.qty_base)),
      qtyBase: (ing.qty_base == null ? null : Number(ing.qty_base)),
      unit: String(ing.unit || '').trim(),
      required: !!ing.required,
      productId: pid,
      product: enrichedProduct
    });

    if (ing.required && enrichedProduct && enrichedProduct.id) {
      var key = String(enrichedProduct.id);
      var existingMain = mainById[key];
      if (!existingMain) {
        mainById[key] = enrichedProduct;
        mainProducts.push(enrichedProduct);
      } else {
        var exQty = (existingMain.qty_base == null) ? null : Number(existingMain.qty_base);
        var inQty = (enrichedProduct.qty_base == null) ? null : Number(enrichedProduct.qty_base);
        var exUnit = String(existingMain.unit || '').trim();
        var inUnit = String(enrichedProduct.unit || '').trim();
        if (exQty != null && inQty != null && exUnit === inUnit) {
          existingMain.qty_base = exQty + inQty;
          existingMain.qtyBase = existingMain.qty_base;
        } else if (exQty == null && inQty != null) {
          existingMain.qty_base = inQty;
          existingMain.qtyBase = inQty;
          existingMain.unit = inUnit;
          existingMain.qty_unit = inUnit;
        }
      }
    }
  }

  var home = String(rec.home_ingredients || '').trim();
  if (home) {
    assistantText += isEn
      ? '\n\nHome / fresh (not added to cart):\n'
      : '\n\nKodused / värsked (ei lisata ostukorvi):\n';
    var homeLines = home.split(/\n|, /).map(function (x) { return String(x || '').trim(); }).filter(Boolean);
    homeLines.forEach(function (x) { assistantText += '- ' + x + '\n'; });
    assistantText = assistantText.replace(/\n$/, '');
  }

  if (missingIngredients.length) {
    assistantText += isEn
      ? '\n\nNote: some ingredients could not be matched to a catalog product by product ID:\n'
      : '\n\nMärge: mõne koostisosa jaoks ei leidnud toote-ID järgi kataloogist vastet:\n';
    missingIngredients.forEach(function (x) { assistantText += '- ' + x + '\n'; });
    assistantText = assistantText.replace(/\n$/, '');
  }

  var imageQuery = rec.recipe_name || query;
  var imageUrl = 'https://source.unsplash.com/800x600/?' + encodeURIComponent(imageQuery);

  return {
    mode: 'recipe',
    recipe_id: rec.recipe_id,
    recipeId: rec.recipe_id,
    recipeTitle: rec.recipe_name,
    base_servings: rec.default_servings || null,
    baseServings: rec.default_servings || null,
    servings: rec.default_servings || null,
    assistantText: assistantText,
    imageUrl: imageUrl,
    ingredientMatches: ingredientMatches,
    missingIngredients: missingIngredients,
    mainProducts: mainProducts,
    upsellProducts: [],
    vendor: VENDOR_NAME,
    version: BACKEND_VERSION
  };
}

function wrapProductForApi_(p, lang) {
  var isEn = normalizeLang_(lang) === 'en';
  var isAvailable = !!p.isAvailable;
  var productId = String(p.product_id || p.productId || p.id || '').trim();
  var sku = String(p.sku || p.productSku || '').trim();
  return {
    id: String(p.id),
    product_id: productId || String(p.id),
    productId: productId || String(p.id),
    sku: sku || '',
    name: p.productName,
    category: p.category,
    subCategory: p.subCategory,
    categoryPath: p.categoryPath,
    price: Number(p.price || 0),
    productUrl: p.productUrl,
    imageUrl: p.imageUrl || '',
    sourceSheet: p.sourceSheet || '',
    diet_vegan: !!p.diet_vegan,
    diet_glutenFree: !!p.diet_glutenFree,
    inStock: !!p.inStock,
    stockLevel: Number(p.stockLevel || 0),
    isAvailable: isAvailable,
    pack_size: (p.pack_size == null ? null : Number(p.pack_size)),
    pack_unit: p.pack_unit || '',
    qty_unit: p.qty_unit || '',
    availabilityLabel: isAvailable ? (isEn ? 'In stock' : 'Laos') : (isEn ? 'Out of stock' : 'Laost otsas'),
    usageProfile: p.usageProfile,
    chatbotDescription: p.chatbotDescription
  };
}

function getLangInstruction_(lang) {
  return normalizeLang_(lang) === 'en' ? ' Respond in English.' : ' Vasta eesti keeles.';
}

function handleAssistantQuery_(query, veganOnly, glutenFreeOnly, recipeId, lang) {
  recipeId = String(recipeId || '').trim();
  veganOnly = !!veganOnly;
  glutenFreeOnly = !!glutenFreeOnly;
  lang = normalizeLang_(lang);
  var isEn = lang === 'en';

  // Direct recipe lookup – skip intent detection
  if (recipeId) {
    var catalogForRecipe = loadAiCatalog_();
    return buildRecipeResponseFromBank_(query, catalogForRecipe, veganOnly, glutenFreeOnly, recipeId, lang);
  }

  // Step 1: Claude Sonnet 4.6 classifies intent (smart router)
  var intent = classifyIntentWithSonnet_(query) || detectAssistantIntent_(query, []);

  // --- Escalation ---
  if (intent === 'escalation') {
    var escText = isEn
      ? 'I understand this is frustrating. Please contact our customer support directly:\n- Email: ' + GREENEST_SUPPORT.email + '\n- Phone: ' + GREENEST_SUPPORT.phone + ' (' + GREENEST_SUPPORT.hours + ')\n\nWe\'ll get back to you as soon as possible.'
      : 'Mõistan, et olukord on ebameeldiv. Palun võta otse ühendust meie klienditoega:\n- E-post: ' + GREENEST_SUPPORT.email + '\n- Telefon: ' + GREENEST_SUPPORT.phone + ' (' + GREENEST_SUPPORT.hours + ')\n\nVastame esimesel võimalusel.';
    return { mode: 'support', assistantText: escText, mainProducts: [], upsellProducts: [], vendor: VENDOR_NAME, version: BACKEND_VERSION };
  }

  // --- Greeting ---
  if (intent === 'greeting') {
    var greetText = isEn
      ? 'Hi! I\'m the Greenest assistant. I can help with recipes and answer customer support questions (shipping, returns, payment, contact). How can I help?'
      : 'Tere! Olen Greenesti assistent. Saan aidata retseptidega ja vastata klienditoe küsimustele (tarne, tagastus, makse, kontakt). Kuidas saan aidata?';
    return { mode: 'smalltalk', assistantText: greetText, mainProducts: [], upsellProducts: [], vendor: VENDOR_NAME, version: BACKEND_VERSION };
  }

  // --- Support intents ---
  if (String(intent).indexOf('support_') === 0) {
    var supportText = buildSupportLinkResponse_(intent);
    if (isEn) supportText = translateSupportResponse_(intent);
    return { mode: 'support', assistantText: supportText, mainProducts: [], upsellProducts: [], vendor: VENDOR_NAME, version: BACKEND_VERSION };
  }

  // --- Smalltalk: Claude answers in chosen language ---
  if (intent === 'smalltalk') {
    var langHint = getLangInstruction_(lang);
    var claudeSmall = callClaudeHaikuLang_(query, null, langHint);
    if (claudeSmall) {
      return { mode: 'smalltalk', assistantText: claudeSmall, mainProducts: [], upsellProducts: [], vendor: VENDOR_NAME, version: BACKEND_VERSION };
    }
    return buildSmalltalkFallback_(lang);
  }

  // --- Shopping / recipe ---
  var catalogAll = loadAiCatalog_();

  if (intent === 'shopping') {
    var filtered = catalogAll.filter(function (p) {
      if (veganOnly && !p.diet_vegan) return false;
      if (glutenFreeOnly && !p.diet_glutenFree) return false;
      return true;
    });

    if (!filtered.length) {
      var noFilterText = isEn ? 'No products found with the selected filters. Try changing the filters.' : 'Filtrite põhjal ei leitud ühtegi toodet. Proovi muuta filtreid.';
      return { mode: 'shopping', assistantText: noFilterText, mainProducts: [], upsellProducts: [], vendor: VENDOR_NAME, version: BACKEND_VERSION };
    }

    var res = buildShoppingResponse_(query, filtered, lang);
    res.vendor = VENDOR_NAME;
    res.version = BACKEND_VERSION;
    return res;
  }

  if (intent === null || intent === undefined) {
    var unknownReply = callClaudeHaikuLang_(query, null, getLangInstruction_(lang));
    return { mode: 'smalltalk', assistantText: unknownReply || buildSmalltalkFallback_(lang).assistantText, mainProducts: [], upsellProducts: [], vendor: VENDOR_NAME, version: BACKEND_VERSION };
  }

  return buildRecipeResponseFromBank_(query, catalogAll, veganOnly, glutenFreeOnly, '', lang);
}

function translateSupportResponse_(intent) {
  var s = GREENEST_SUPPORT;
  if (intent === 'support_shipping') return 'You can find all shipping and delivery info here:\n[Open shipping info](' + s.delivery_url + ')';
  if (intent === 'support_returns') return 'You can find returns and refunds info here:\n[Open returns info](' + s.returns_url + ')';
  if (intent === 'support_payment') return 'You can find payment terms here:\n[Open payment terms](' + s.terms_url + ')';
  if (intent === 'support_contact') return 'You can find our contact details here:\n[Open contact page](' + s.contacts_url + ')';
  if (intent === 'support_order') return 'For the fastest update on your order or parcel status, please call ' + s.order_phone + '. We do not currently have an active parcel tracking system.';
  return 'For support, please contact: ' + s.email;
}

function callClaudeHaikuLang_(userMessage, faqContext, langHint) {
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');
  if (!apiKey) return null;

  var systemPrompt = (faqContext ? GREENEST_SYSTEM_PROMPT_SUPPORT : GREENEST_SYSTEM_PROMPT_GENERAL) + (langHint || '');
  var userPrompt = faqContext
    ? ('Customer message: ' + String(userMessage || '').trim() + '\nContext: ' + faqContext + '\n\nAnswer in 1–3 sentences based on the store info only.')
    : ('Customer message: ' + String(userMessage || '').trim() + '\n\nAnswer briefly and helpfully. Do not suggest products or recipes.');

  var payload = {
    model: CLAUDE_MODEL,
    max_tokens: 300,
    temperature: 0,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var code = response.getResponseCode();
    var body = JSON.parse(response.getContentText());
    if (code !== 200 || !body.content || !body.content.length) return null;
    return String(body.content[0].text || '').trim() || null;
  } catch (err) {
    Logger.log('callClaudeHaikuLang_ exception: ' + err);
    return null;
  }
}

function translateChatEntries_(payload) {
  payload = payload || {};
  var sourceLang = normalizeLang_(payload.sourceLang || payload.source_lang);
  var targetLang = normalizeLang_(payload.targetLang || payload.target_lang);
  var entries = Array.isArray(payload.entries) ? payload.entries : [];
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');

  var cleanEntries = entries.map(function (entry, index) {
    var data = entry || {};
    return {
      id: String(data.id || ('entry_' + index)).trim() || ('entry_' + index),
      kind: String(data.kind || 'assistant_text').trim() || 'assistant_text',
      text: String(data.text || '').trim()
    };
  }).filter(function (entry) {
    return !!entry.text;
  });

  if (!cleanEntries.length || sourceLang === targetLang) {
    return {
      ok: true,
      sourceLang: sourceLang,
      targetLang: targetLang,
      translations: cleanEntries.map(function (entry) {
        return { id: entry.id, text: entry.text };
      })
    };
  }

  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  var systemPrompt = [
    'You translate Greenest chat entries between Estonian and English.',
    'Return ONLY valid JSON in the form {"translations":[{"id":"...","text":"..."}]}.',
    'Preserve each entry id exactly.',
    'Translate only natural language.',
    'Preserve markdown links, bullet lists, numbering, URLs, prices, quantities, units, product names, recipe names, SKUs and codes.',
    'Do not add explanations, quotes or extra keys.',
    'Keep line breaks and list structure intact.'
  ].join('\n');

  var userPrompt = [
    'Source language: ' + sourceLang,
    'Target language: ' + targetLang,
    'Entries JSON:',
    JSON.stringify(cleanEntries)
  ].join('\n\n');

  var requestPayload = {
    model: CLAUDE_MODEL,
    max_tokens: Math.max(300, cleanEntries.length * 220),
    temperature: 0,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  };

  var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify(requestPayload),
    muteHttpExceptions: true
  });

  var code = response.getResponseCode();
  var body = JSON.parse(response.getContentText());
  if (code !== 200 || !body.content || !body.content.length) {
    throw new Error('Translation failed: ' + code);
  }

  var text = String(body.content[0].text || '').trim();
  text = text.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
  var match = text.match(/\{[\s\S]*\}/);
  if (match) text = match[0];

  var parsed = JSON.parse(text);
  var translations = Array.isArray(parsed.translations) ? parsed.translations : [];
  var byId = {};
  translations.forEach(function (item) {
    byId[String(item.id || '').trim()] = String(item.text || '').trim();
  });

  return {
    ok: true,
    sourceLang: sourceLang,
    targetLang: targetLang,
    translations: cleanEntries.map(function (entry) {
      return {
        id: entry.id,
        text: byId[entry.id] || entry.text
      };
    })
  };
}

/*************************************************
 * Stats (basic usage analytics)
 * GET ?action=stats&days=7
 *************************************************/
function buildStats_(days) {
  days = parseNumber_(days || 7);
  days = Math.max(1, Math.min(90, days));

  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName(EVENT_LOG_SHEET);
  if (!sh || sh.getLastRow() < 2) {
    return { ok: true, days: days, events: {}, unique_sessions: 0, rows: 0, vendor: VENDOR_NAME, version: BACKEND_VERSION };
  }

  var values = sh.getDataRange().getValues();
  var header = values[0].map(function (h) { return String(h || '').trim(); });
  var idx = {};
  header.forEach(function (h, i) { idx[h] = i; });

  var now = new Date();
  var cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  var eventCounts = {};
  var sessions = {};

  var rowsUsed = 0;
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var ts = row[idx['ts_iso']];
    var tsDate = ts ? new Date(ts) : null;
    if (!tsDate || tsDate < cutoff) continue;

    rowsUsed++;

    var ev = String(row[idx['event']] || '').trim();
    var sid = String(row[idx['session_id']] || '').trim();
    if (ev) eventCounts[ev] = (eventCounts[ev] || 0) + 1;
    if (sid) sessions[sid] = true;
  }

  return {
    ok: true,
    vendor: VENDOR_NAME,
    version: BACKEND_VERSION,
    days: days,
    rows: rowsUsed,
    unique_sessions: Object.keys(sessions).length,
    events: eventCounts
  };
}

/*************************************************
 * Cart recipe candidates
 * GET ?action=cartRecipeCandidates&product_ids=114,125&limit=20
 * Returns recipes that contain at least one of the given product IDs,
 * sorted by match ratio (most covered first).
 *************************************************/

function pickCartRecipeWithAI_(cartProductNames, candidates) {
  var apiKey = getScriptProp_('ANTHROPIC_API_KEY');
  if (!apiKey || !candidates.length) return null;

  var cartList = cartProductNames.length
    ? cartProductNames.join(', ')
    : '(tundmatud tooted)';

  var lines = candidates.map(function (c) {
    return c.recipe_id + '|' + c.recipe_name +
      ' (sobib ' + c.match_count + '/' + c.total_ingredients + ' koostisosaga)';
  });

  var prompt = [
    'Kliendi ostukorvis on: ' + cartList,
    '',
    'Kandidaatretseptid (id|nimi|sobivus):',
    lines.join('\n'),
    '',
    'Vali 1-3 kõige mõistlikumat retseptisoovitust arvestades:',
    '- Kas retsept on temaatiliselt seotud ostukorvi toodetega?',
    '- Kas retseptil on juba piisavalt koostisosi kaetud?',
    '- Ära soovita kui sobivus on alla 20% (väga vähe kattuvust)',
    '',
    'Tagasta AINULT JSON: {"picks":[{"id":"retsepti_id","reason":"lühike põhjendus eesti keeles"}]}',
    'Kui ükski ei sobi, tagasta {"picks":[]}'
  ].join('\n');

  var payload = {
    model: CLAUDE_MODEL,
    max_tokens: 200,
    temperature: 0,
    system: 'Soovita kliendi ostukorvi põhjal kõige sobivamad retseptid. Kasuta oma otsustust.',
    messages: [{ role: 'user', content: prompt }]
  };

  try {
    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var body = JSON.parse(response.getContentText());
    if (response.getResponseCode() !== 200 || !body.content || !body.content.length) return null;
    var text = String(body.content[0].text || '').trim().replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    var parsed = JSON.parse(text);
    return Array.isArray(parsed.picks) ? parsed.picks : null;
  } catch (err) {
    Logger.log('pickCartRecipeWithAI_ error: ' + err);
    return null;
  }
}

function buildCartRecipeCandidates_(productIds, limit) {
  if (!productIds || !productIds.length) return [];
  limit = limit || 20;

  var ids = {};
  var catalogAll = loadAiCatalog_();
  var productsById = indexProductsById_(catalogAll);
  for (var i = 0; i < productIds.length; i++) {
    var key = getCanonicalProductKeyFromId_(productIds[i], productsById);
    if (key) ids[key] = true;
  }
  var wanted = Object.keys(ids);
  if (!wanted.length) return [];

  // Collect cart product names for AI context
  var cartProductNames = [];
  for (var ci = 0; ci < productIds.length; ci++) {
    var cartKey = getCanonicalProductKeyFromId_(productIds[ci], productsById);
    if (cartKey && productsById[cartKey]) {
      var pName = String(productsById[cartKey].productName || productsById[cartKey].product_name || '').trim();
      if (pName) cartProductNames.push(pName);
    }
  }

  var bank = loadRecipeBank_();
  var candidates = [];

  for (var r = 0; r < bank.length; r++) {
    var rec = bank[r];
    var ings = rec.ingredients || [];
    var totalSet = {};
    var matchedSet = {};

    for (var j = 0; j < ings.length; j++) {
      var p = getCanonicalProductKeyFromId_(ings[j].productId, productsById);
      if (!p) continue;
      totalSet[p] = true;
      if (ids[p]) matchedSet[p] = true;
    }

    var matchCount = Object.keys(matchedSet).length;
    if (!matchCount) continue;

    var totalCount = Object.keys(totalSet).length;
    var ratio = totalCount ? matchCount / totalCount : 0;

    candidates.push({
      recipe_id: rec.recipe_id,
      recipe_name: rec.recipe_name || '',
      match_count: matchCount,
      total_ingredients: totalCount,
      match_ratio: ratio,
      base_servings: rec.default_servings || null,
      matched_product_ids: Object.keys(matchedSet)
    });
  }

  candidates.sort(function (a, b) {
    if (b.match_ratio !== a.match_ratio) return b.match_ratio - a.match_ratio;
    return b.match_count - a.match_count;
  });

  var topCandidates = candidates.slice(0, Math.max(10, limit * 2));

  // AI picks the most relevant recipes from top candidates
  var aiPicks = pickCartRecipeWithAI_(cartProductNames, topCandidates);
  if (aiPicks && aiPicks.length) {
    var aiPickIds = {};
    aiPicks.forEach(function (pick) { aiPickIds[String(pick.id || '').trim()] = pick.reason || ''; });

    // Return AI-selected recipes first (with reason), then remaining by ratio
    var aiResults = [];
    var remaining = [];
    topCandidates.forEach(function (c) {
      if (aiPickIds[c.recipe_id] !== undefined) {
        aiResults.push(Object.assign({}, c, { ai_reason: aiPickIds[c.recipe_id], ai_pick: true }));
      } else {
        remaining.push(c);
      }
    });
    return aiResults.concat(remaining).slice(0, Math.max(1, limit));
  }

  // Fallback: return rule-based sorted candidates
  return topCandidates.slice(0, Math.max(1, limit));
}

/*************************************************
 * API
 *************************************************/
function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    ensureDefaultAllowedOriginsProp_();

    var body = e.postData && e.postData.contents;
    var payload = body ? JSON.parse(body) : {};
    var action = String(payload.action || (e && e.parameter && e.parameter.action) || '').trim().toLowerCase();

    // ---- TRACK ----
    if (action === 'track' || action === 'trackevent') {
      var meta = {
        origin: String(payload.origin || '').trim(),
        user_agent: String(payload.user_agent || '').trim()
      };
      validateTrackingAuth_(payload, meta);
      return jsonResponse_(logAffiliateEvent_(payload, meta));
    }

    // ---- CHAT LOG ----
    if (action === 'chatlog' || action === 'chat_log' || action === 'logchat' || action === 'chatmessage') {
      var chatMeta = {
        origin: String(payload.origin || payload.store_origin || '').trim(),
        user_agent: String(payload.user_agent || '').trim()
      };
      validateTrackingAuth_(payload, chatMeta);
      return jsonResponse_(logChatMessage_(payload, chatMeta));
    }

    if (action === 'translate') {
      return jsonResponse_(translateChatEntries_(payload));
    }

    // ---- ASSISTANT ----
    var query = String(payload.query || '').trim();
    var veganOnly = !!payload.veganOnly;
    var glutenFreeOnly = !!payload.glutenFreeOnly;
    var recipeId = String(payload.recipeId || payload.recipe_id || '').trim();
    var lang = String(payload.lang || 'et').trim();

    if (!query) return jsonResponse_({ ok: false, error: 'Missing query' });

    var result = handleAssistantQuery_(query, veganOnly, glutenFreeOnly, recipeId, lang);
    result.ok = true;
    result.lang = normalizeLang_(lang);
    return jsonResponse_(result);

  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message || err) });
  }
}


function loadChatHistory_(userId) {
  if (!userId) return [];
  var sheet = ensureChatLogSheet_();
  var hMap = getHeaderMap_(sheet);
  var idCol = hMap['id'];
  var chatCol = hMap['chat_log'];
  if (idCol == null || chatCol == null) return [];

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var messages = [];
  var data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

  for (var i = 0; i < data.length; i++) {
    var rowId = String(data[i][idCol] || '').trim();
    if (rowId !== String(userId).trim()) continue;

    var chatLog = String(data[i][chatCol] || '').trim();
    if (!chatLog) continue;

    // Parse "User: ... | Assistant: ..." pairs
    var parts = chatLog.split(' | ');
    for (var p = 0; p < parts.length; p++) {
      var part = parts[p].trim();
      if (part.indexOf('User: ') === 0) {
        messages.push({ role: 'user', content: part.substring(6) });
      } else if (part.indexOf('Assistant: ') === 0) {
        messages.push({ role: 'assistant', content: part.substring(11) });
      }
    }
  }

  return messages;
}

function doGet(e) {
  try {
    ensureDefaultAllowedOriginsProp_();

    var params = (e && e.parameter) ? e.parameter : {};
    var action = String(params.action || '').trim().toLowerCase();

    if (action === 'ping') {
      return jsonResponse_({
        ok: true,
        action: 'ping',
        ts: new Date().toISOString(),
        vendor: VENDOR_NAME,
        version: BACKEND_VERSION,
        spreadsheet_id: SPREADSHEET_ID,
        event_log_sheet: EVENT_LOG_SHEET,
        chat_log_sheet: CHAT_LOG_SHEET,
        allowed_origins: getAllowedOrigins_(),
        token_required: !!getSiteToken_()
      });
    }

    if (action === 'setupanalytics' || action === 'setup_analytics') {
      var eventSheet = ensureEventSheet_();
      var chatSheet = ensureChatLogSheet_();
      return jsonResponse_({
        ok: true,
        action: 'setupAnalytics',
        spreadsheet_id: SPREADSHEET_ID,
        event_log_sheet: EVENT_LOG_SHEET,
        event_columns: Math.max(1, eventSheet.getLastColumn()),
        chat_log_sheet: CHAT_LOG_SHEET,
        chat_columns: Math.max(1, chatSheet.getLastColumn()),
        vendor: VENDOR_NAME,
        version: BACKEND_VERSION
      });
    }

    if (action === 'listrecipes') {
  var limit = parseNumber_(params.limit || RECIPE_MAX_LIST);
  return jsonResponse_({
    ok: true,
    action: 'listRecipes',
    recipes: listRecipes_(limit),
    vendor: 'growlinee',
    version: 'v4.2'
  });
}


    if (action === 'cartrecipecandidates') {
      var rawProducts = String(params.product_ids || params.productIds || '').trim();
      if (!rawProducts) return jsonResponse_({ ok: false, error: 'Missing product_ids' });
      var pidList = rawProducts.split(',').map(function (s) { return String(s || '').trim(); }).filter(Boolean);
      var candLimit = parseNumber_(params.limit || 20);
      var cands = buildCartRecipeCandidates_(pidList, candLimit);
      return jsonResponse_({ ok: true, action: 'cartRecipeCandidates', candidates: cands, vendor: VENDOR_NAME, version: BACKEND_VERSION });
    }

    if (action === 'stats') {
      return jsonResponse_(buildStats_(params.days || 7));
    }

    if (action === 'chathistory') {
      var histUserId = String(params.user_id || params.userId || params.client_id || params.clientId || '').trim();
      if (!histUserId) return jsonResponse_({ ok: false, error: 'Missing user_id' });
      var normalizedId = normalize7DigitId_(histUserId) || histUserId;
      var histMessages = loadChatHistory_(normalizedId);
      return jsonResponse_({ ok: true, action: 'chathistory', user_id: normalizedId, messages: histMessages, vendor: VENDOR_NAME, version: BACKEND_VERSION });
    }

    if (action === 'track' || action === 'trackevent') {
      var payload = {
        action: 'track',
        site_token: params.site_token,
        request_id: params.request_id || params.requestId,
        event: params.event,
        status: params.status,
        client_id: params.client_id || params.clientId,
        session_id: params.session_id,
        store_origin: params.store_origin || params.storeOrigin,
        cart_id: params.cart_id || params.cartId,
        assisted: params.assisted,
        reason: params.reason,
        page_url: params.page_url,
        referrer: params.referrer,
        user_agent: params.user_agent,
        origin: params.origin,
        product_ids: params.product_ids,
        recipe_id: params.recipe_id,
        order_id: params.order_id,
        revenue: params.revenue,
        currency: params.currency,
        notes: params.notes,

        // NEW: allow widget to pass version (saved to sheet)
        widget_version: params.widget_version || params.widgetVersion || params.widget_ver || params.widgetVer || ''
      };

      var meta = { origin: String(params.origin || '').trim(), user_agent: String(params.user_agent || '').trim() };
      validateTrackingAuth_(payload, meta);
      return jsonResponse_(logAffiliateEvent_(payload, meta));
    }

    if (action === 'chatlog' || action === 'chat_log' || action === 'logchat' || action === 'chatmessage') {
      var chatPayload = {
        action: 'chatlog',
        site_token: params.site_token,
        request_id: params.request_id || params.requestId,
        status: params.status,
        client_id: params.client_id || params.clientId,
        session_id: params.session_id || params.sessionId,
        store_origin: params.store_origin || params.storeOrigin,
        cart_id: params.cart_id || params.cartId,
        user_message: params.user_message || params.userMessage,
        assistant_message: params.assistant_message || params.assistantMessage,
        error_message: params.error_message || params.errorMessage,
        added_to_cart: params.added_to_cart || params.addedToCart,
        page_url: params.page_url || params.pageUrl,
        referrer: params.referrer,
        user_agent: params.user_agent || params.userAgent,
        origin: params.origin,
        widget_version: params.widget_version || params.widgetVersion || ''
      };

      var chatMeta = {
        origin: String(params.origin || params.store_origin || '').trim(),
        user_agent: String(params.user_agent || params.userAgent || '').trim()
      };
      validateTrackingAuth_(chatPayload, chatMeta);
      return jsonResponse_(logChatMessage_(chatPayload, chatMeta));
    }

    // default assistant GET
    var query = String(params.query || '').trim();
    var veganOnly = String(params.veganOnly || '').toLowerCase() === 'true';
    var glutenFreeOnly = String(params.glutenFreeOnly || '').toLowerCase() === 'true';
    var recipeId = String(params.recipeId || params.recipe_id || '').trim();
    var lang = normalizeLang_(params.lang);

    if (!query) return jsonResponse_({ ok: false, error: 'Missing query' });

    var result = handleAssistantQuery_(query, veganOnly, glutenFreeOnly, recipeId, lang);
    result.ok = true;
    result.lang = normalizeLang_(lang);
    return jsonResponse_(result);

  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message || err) });
  }
}
