/*
  Tracking v1 enabled
  window.GREENEST_WIDGET_CONFIG.siteToken
  window.GREENEST_WIDGET_CONFIG.vendor
  window.GREENEST_WIDGET_CONFIG.widgetVersion
  window.GREENEST_WIDGET_CONFIG.apiUrl
  window.GREENEST_WIDGET_CONFIG.debug
  window.GREENEST_WIDGET_CONFIG.cartAdapter
  window.GREENEST_WIDGET_CONFIG.cartAdapterMode // "hybrid" | "external"
*/
const STR = {
  et: {
    widget_title: "retseptiassistant",
    launcher_label: "Ava vestlus Greenestiga",
    launcher_greeting: "Tere! Mina olen sinu Retsepti Soovitaja!",
    launcher_help:
      "Aitan sul valida retsepte, lisan vajalikud tooted ostukorvi ja vastan ka klienditoe küsimustele.",
    launcher_cta: "Vajuta mu peale, et mind kasutada!",
    chat_close_label: "Sulge vestlus",
    chat_minimize_label: "Minimeeri vestlus",
    status_online: "Online",
    chat_placeholder: "Kirjuta siia...",
    send_btn: "Saada",
    sending_btn: "Saadan...",
    thinking_text: "Mõtlen...",
    open_cart_label: "Ava ostukorv",
    cart_title: "Ostukorv",
    cart_close_label: "Sulge ostukorv",
    cart_total_label: "Kokku",
    cart_empty: "Ostukorv on tühi.",
    cart_empty_btn: "Tühjenda",
    cart_close_btn: "Sulge",
    cart_checkout_btn: "Kassasse",
    cart_remove_btn: "Eemalda",
    cart_added_message: "Lisasin {count} toodet sinu ostukorvi.",
    powered_by: "Toetab Growlinee",
    welcome_message:
      "Tere! Kirjuta mulle vabalt: aitan retseptide, ostukorvi ja klienditoe küsimustega.",
    recipe_only_notice:
      "Selles režiimis on üksikute toodete otsing piiratud. Retseptid ja klienditugi (tarne/tagastus/makse/kontakt) on saadaval.",
    recipes_open: "Ava retseptid",
    recipes_close: "Sulge retseptid",
    recipes_title: "Retseptid",
    recipes_search_placeholder: "Otsi retsepti...",
    recipes_loading: "Laen retsepte...",
    recipes_load_failed: "Retseptide laadimine ebaõnnestus: {error}",
    recipes_not_found: "Retsepte ei leitud.",
    recipes_retry: "Proovi uuesti",
    preview_loading: "Laen retsepti tooteid...",
    preview_error: "Retsepti tooteid ei saanud laadida.",
    preview_retry: "Proovi uuesti",
    confirm_title: "Valitud retsept: {name}",
    confirm_products_note:
      "NB! Need ei ole ainukesed tooted mida vaja laheb vaata juhendit ja saad rohkem teada!",
    confirm_copy_guide_btn: "Kopeeri juhendi tekst",
    confirm_copy_done: "Juhend kopeeritud",
    confirm_copy_failed: "Kopeerimine ebaõnnestus",
    confirm_servings_label: "Mitmele inimesele?",
    confirm_add_btn: "Lisa ostukorvi",
    confirm_cancel_btn: "Tühista",
    confirm_cancelled_message: "Selge — ei lisanud midagi.",
    product_fallback_name: "Toode",
    recipe_fallback_title: "Retsept {count}",
    close_notice_label: "Sulge teavitus",
    cart_banner_text: "Sinu ostukorviga sobib {count} retsepti — ava assistent",
    cart_banner_cta: "Ava assistent",
    cart_candidates_loading: "Laen ostukorvi retsepte...",
    filters_vegan: "Vegan",
    filters_gluten_free: "Gluteenivaba",
    recipe_servings_suffix: "{count} inimesele",
    product_search_blocked:
      "Hetkel saan aidata retseptide ja toidukordade ideedega. Üksikute toodete otsing ja soovitamine on veel arenduses.",
    error_missing_api: "Puudub API aadress.",
    error_missing_api_long:
      "Puudub API aadress. Kontrolli GREENEST_WIDGET_CONFIG.apiUrl väärtust.",
    error_no_recipes_returned: "Retsepte ei tagastatud.",
    error_empty_query: "Sisesta küsimus.",
    error_parse_json: "JSON vastust ei saanud lugeda.",
    error_request_failed: "Päring ebaõnnestus.",
    error_unknown: "Tekkis tundmatu viga.",
    error_no_response: "Vastust ei saanud.",
    assistant_ingredients: "Koostisosad",
    assistant_steps: "Sammud",
    open_cart_link: "Ava ostukorv",
  },
};

const ACTIVE_LOCALE = "et";
const DEFAULT_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbw8Hpgwr4NgRtN0lpucsNgXU9sCYCKfvgUyl7IEBKjaOxunfNir3PFcwCn-t7qkTF1P/exec";
const DEFAULT_SITE_TOKEN = "REPLACE_WITH_GREENEST_SITE_TOKEN";
const DEFAULT_VENDOR = "growlinee";
const DEFAULT_WIDGET_VERSION = "v4.5";
const DEFAULT_CHECKOUT_URL = "https://greenest.ee/et/checkout";
const DEFAULT_TITLE_TEXT = STR[ACTIVE_LOCALE].widget_title;
const DEFAULT_HIDE_RECIPE_IMAGES = true;
const DEFAULT_RECIPE_ONLY_MODE = false;
const DEFAULT_SERVINGS = 2;
const DEFAULT_CART_ADAPTER_MODE = "hybrid";
const DEFAULT_SHOW_INTERNAL_CART_UI = false;
const DEFAULT_CHAT_LOGGING_ENABLED = true;
const MAX_RECIPE_ITEM_QTY = 48;
const WIDGET_BUILD = "20260221-chatlog3";

function isObject(value) {
  return value !== null && typeof value === "object";
}

function resolveCartAdapter(globalConfig) {
  if (!isObject(globalConfig)) return null;
  if (isObject(globalConfig.cartAdapter)) return globalConfig.cartAdapter;
  if (isObject(globalConfig.cart) && isObject(globalConfig.cart.adapter)) {
    return globalConfig.cart.adapter;
  }
  if (globalConfig.disableAutoCartAdapter === true) return null;
  return buildGreenestAutoCartAdapter(globalConfig);
}

function normalizeCartAdapterMode(mode) {
  const normalized = String(mode || "").trim().toLowerCase();
  if (normalized === "external") return "external";
  return "hybrid";
}

function getCookieValueByName(name) {
  const needle = `${String(name || "").trim()}=`;
  if (!needle || needle === "=") return "";
  try {
    const parts = String(document.cookie || "").split(";");
    for (let i = 0; i < parts.length; i += 1) {
      const part = String(parts[i] || "").trim();
      if (!part || part.indexOf(needle) !== 0) continue;
      const value = part.slice(needle.length);
      return decodeURIComponent(value || "");
    }
  } catch (_) {
    /* ignore */
  }
  return "";
}

function setCookieValue(name, value, maxAgeSec) {
  const key = String(name || "").trim();
  if (!key) return;
  const encoded = encodeURIComponent(String(value || ""));
  const maxAge = Number(maxAgeSec);
  const attrs = ["path=/", "SameSite=Lax"];
  if (Number.isFinite(maxAge) && maxAge > 0) {
    attrs.push(`max-age=${Math.floor(maxAge)}`);
  }
  if (window.location && window.location.protocol === "https:") {
    attrs.push("Secure");
  }
  document.cookie = `${key}=${encoded}; ${attrs.join("; ")}`;
}

function getGreenestLocaleFromPath() {
  const pathname = String((window.location && window.location.pathname) || "")
    .trim()
    .toLowerCase();
  if (/^\/et(?:\/|$)/.test(pathname)) return "et";
  return "en";
}

function getGreenestCheckoutUrl(globalConfig, locale) {
  const configured = String((globalConfig && globalConfig.checkoutUrl) || "").trim();
  if (configured) return configured;
  const lang = String(locale || getGreenestLocaleFromPath()).toLowerCase() === "et" ? "et" : "en";
  return `${window.location.origin}/${lang}/checkout`;
}

function normalizeGreenestProductId(raw) {
  const value = String(raw == null ? "" : raw).trim();
  if (!value) return "";
  if (!/[a-z]/i.test(value)) {
    const digits = value.replace(/\D/g, "");
    if (digits) return digits;
  }
  return value;
}

function pickGreenestProductId(candidate) {
  const data = isObject(candidate) ? candidate : {};
  const keys = [
    data.product_id,
    data.productId,
    data.external_product_id,
    data.externalProductId,
    data.shop_product_id,
    data.shopProductId,
    data.id,
    data.sku,
    data.productSku,
  ];
  for (let i = 0; i < keys.length; i += 1) {
    const normalized = normalizeGreenestProductId(keys[i]);
    if (normalized) return normalized;
  }
  return "";
}

function pickGreenestProductSku(candidate, fallback) {
  const data = isObject(candidate) ? candidate : {};
  const sku = String(
    data.sku || data.productSku || data.product_sku || fallback || ""
  ).trim();
  if (sku) return sku;
  return String(fallback || "").trim();
}

function buildGreenestAutoCartAdapter(globalConfig) {
  const cfg = isObject(globalConfig) ? globalConfig : {};
  const host = String((window.location && window.location.hostname) || "").toLowerCase();
  const isGreenestHost =
    host === "greenest.ee" ||
    host === "www.greenest.ee" ||
    host.endsWith(".greenest.ee");
  if (!isGreenestHost && cfg.forceAutoCartAdapter !== true) return null;

  const nuxtCfg = (window.__NUXT__ && window.__NUXT__.config) || {};
  const nuxtAxios = (nuxtCfg && nuxtCfg.axios) || {};
  const explicitBase = String(cfg.greenestApiBase || cfg.storeApiBase || "").trim();
  const inferredBase = String(
    nuxtAxios.browserBaseURL ||
      nuxtAxios.browserBaseUrl ||
      nuxtAxios.baseURL ||
      nuxtAxios.baseUrl ||
      ""
  ).trim();
  let apiBase = explicitBase || inferredBase || "https://api.greenest.ee/api";
  try {
    apiBase = new URL(apiBase, window.location.origin).toString().replace(/\/+$/, "");
  } catch (_) {
    return null;
  }
  if (!apiBase) return null;

  const state = {
    token: "",
    tokenPromise: null,
  };

  const resolveLocale = () => {
    const configured = String(cfg.storeLocale || cfg.locale || "").trim().toLowerCase();
    if (configured === "et" || configured === "en") return configured;
    return getGreenestLocaleFromPath();
  };

  const parseResponse = async (response) => {
    const text = await response.text();
    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch (_) {
      throw new Error("Greenest API returned non-JSON response");
    }
    if (!response.ok) {
      const err = String(json.error || json.message || `HTTP ${response.status}`).trim();
      throw new Error(err || "Greenest API request failed");
    }
    if (json && json.status && String(json.status).toLowerCase() !== "success") {
      const err = String(json.error || json.message || "Greenest API status error").trim();
      throw new Error(err || "Greenest API status error");
    }
    return json;
  };

  const request = (path, options = {}) => {
    const method = String(options.method || "GET").toUpperCase();
    const includeToken = options.includeToken !== false;
    const url = `${apiBase}${String(path || "").startsWith("/") ? "" : "/"}${String(path || "")}`;
    const headers = {
      Accept: "application/json, text/plain, */*",
      "App-Language": resolveLocale(),
      ...(isObject(options.headers) ? options.headers : {}),
    };

    const doFetch = (token) => {
      const init = {
        method,
        headers: { ...headers },
        credentials: "omit",
      };
      if (includeToken && token) {
        init.headers["Cart-Session-Token"] = token;
      }
      if (method !== "GET" && options.body != null) {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(options.body);
      }
      return fetch(url, init).then(parseResponse);
    };

    if (!includeToken) return doFetch("");
    return ensureToken().then(doFetch);
  };

  const ensureToken = () => {
    if (state.token) return Promise.resolve(state.token);
    const cookieToken = String(getCookieValueByName("cartSessionToken") || "").trim();
    if (cookieToken) {
      state.token = cookieToken;
      return Promise.resolve(cookieToken);
    }
    if (state.tokenPromise) return state.tokenPromise;

    state.tokenPromise = request("/cart/content/token", { method: "GET", includeToken: false })
      .then((json) => {
        const data = isObject(json && json.data) ? json.data : json;
        const token = String((data && data.token) || "").trim();
        if (!token) throw new Error("Greenest cart token missing");
        state.token = token;
        const expiresIn = Number((data && data.expires_in) || 7776000);
        setCookieValue("cartSessionToken", token, expiresIn);
        if (Number.isFinite(expiresIn) && expiresIn > 0) {
          setCookieValue(
            "cartExpirationDate",
            String(Date.now() + expiresIn * 1000),
            expiresIn
          );
        }
        return token;
      })
      .finally(() => {
        state.tokenPromise = null;
      });

    return state.tokenPromise;
  };

  const normalizeMutationItems = (items) => {
    const arr = Array.isArray(items) ? items : [];
    const out = [];
    for (let i = 0; i < arr.length; i += 1) {
      const row = arr[i];
      const id = pickGreenestProductId(row);
      if (!id) continue;
      const qtyRaw = Number(row && (row.quantity || row.qty || 1));
      const quantity = Number.isFinite(qtyRaw) ? Math.max(1, Math.round(qtyRaw)) : 1;
      out.push({
        product_id: id,
        quantity,
      });
    }
    return out;
  };

  const normalizeCartItems = (json) => {
    const data = isObject(json && json.data) ? json.data : json;
    const cart = data && data.cart;
    let rawItems = [];
    if (Array.isArray(cart)) rawItems = cart;
    else if (isObject(cart) && Array.isArray(cart.items)) rawItems = cart.items;
    else if (Array.isArray(data && data.items)) rawItems = data.items;

    const out = [];
    for (let i = 0; i < rawItems.length; i += 1) {
      const item = rawItems[i];
      if (!isObject(item)) continue;
      const product = isObject(item.product) ? item.product : {};
      const productData = isObject(product.data) ? product.data : {};
      const id = pickGreenestProductId({
        ...item,
        ...product,
      });
      if (!id) continue;
      const qtyRaw = Number(item.quantity || item.qty || 0);
      const qty = Number.isFinite(qtyRaw) ? Math.max(0, Math.round(qtyRaw)) : 0;
      if (qty <= 0) continue;
      const priceRaw = Number(
        product.price_to_view ||
          product.price_checkout ||
          product.price ||
          item.price ||
          item.unit_price ||
          0
      );
      const price = Number.isFinite(priceRaw) ? priceRaw : 0;
      const name = String(
        productData.name || product.name || item.name || item.title || ""
      ).trim();
      const sku = pickGreenestProductSku({ ...item, ...product }, id);

      out.push({
        id,
        product_id: id,
        productId: id,
        sku,
        name,
        qty,
        quantity: qty,
        price,
        unit_price: price,
      });
    }
    return out;
  };

  const addItems = (items) => {
    const products = normalizeMutationItems(items);
    if (!products.length) return Promise.resolve({ ok: true });
    return request("/cart/item/add-many", {
      method: "POST",
      body: { products },
    }).catch(() =>
      products.reduce(
        (chain, row) =>
          chain.then(() =>
            request("/cart/item/add", {
              method: "POST",
              body: row,
            })
          ),
        Promise.resolve()
      )
    );
  };

  const updateItem = (payload) => {
    const entry = isObject(payload && payload.item) ? payload.item : payload;
    const id = pickGreenestProductId(entry);
    const qtyRaw = Number(entry && (entry.quantity || entry.qty));
    const qty = Number.isFinite(qtyRaw) ? Math.round(qtyRaw) : 0;
    if (!id) return Promise.resolve({ ok: false });
    if (qty <= 0) {
      return request("/cart/item/remove", {
        method: "POST",
        body: { product_id: id },
      });
    }
    const targetQty = Math.max(1, qty);
    return request("/cart/item/remove", {
      method: "POST",
      body: { product_id: id },
    })
      .catch(() => ({ ok: true }))
      .then(() =>
        request("/cart/item/add", {
          method: "POST",
          body: { product_id: id, quantity: targetQty },
        })
      );
  };

  const removeItem = (payload) => {
    const entry = isObject(payload && payload.item) ? payload.item : payload;
    const id = pickGreenestProductId(entry);
    if (!id) return Promise.resolve({ ok: false });
    return request("/cart/item/remove", {
      method: "POST",
      body: { product_id: id },
    });
  };

  const clearCart = () =>
    request("/cart/destroy", {
      method: "POST",
      body: {},
    });

  const getCheckoutUrl = () => getGreenestCheckoutUrl(cfg, resolveLocale());

  const openCart = () => {
    window.location.href = getCheckoutUrl();
    return true;
  };

  const getCartItems = () =>
    request("/cart/content/list", {
      method: "GET",
    }).then(normalizeCartItems);

  return {
    mode: "hybrid",
    type: "greenest_auto_nuxt",
    apiBase,
    addItems,
    updateItem,
    removeItem,
    clearCart,
    openCart,
    checkout: openCart,
    getCheckoutUrl,
    getCartItems,
    getCartId() {
      const token = String(state.token || getCookieValueByName("cartSessionToken") || "").trim();
      return token;
    },
  };
}

function t(key, vars) {
  const table = STR[ACTIVE_LOCALE] || {};
  const template = table[key] || key;
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    if (!vars || vars[name] === undefined || vars[name] === null) {
      return "";
    }
    return String(vars[name]);
  });
}

const RECIPE_ONLY_NOTICE = t("recipe_only_notice");
const LAUNCHER_GREETING_LOOP_MS = 52000;
const CART_STORAGE_KEY = "greenest_widget_cart_v1";
const CART_BANNER_LAST_SEEN_KEY = "gw_last_seen_cart_sig";
const CART_BANNER_DISMISSED_KEY = "gw_dismissed_cart_sig";
const CART_BANNER_COOLDOWN_KEY = "gw_banner_cooldown_until";
const CART_BANNER_COOLDOWN_MS = 10000;

function makeCartSignature(items) {
  if (!Array.isArray(items) || !items.length) return "";
  const normalized = items
    .map((item) => {
      if (!item) return null;
      const id = String(pickGreenestProductId(item) || "").trim();
      const qty = Number(item.qty || 0);
      if (!id || !Number.isFinite(qty) || qty <= 0) return null;
      return id;
    })
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  if (!normalized.length) return "";
  return normalized.join("|");
}

function getSessionState() {
  try {
    return {
      lastSeenSig: window.sessionStorage.getItem(CART_BANNER_LAST_SEEN_KEY) || "",
      dismissedSig: window.sessionStorage.getItem(CART_BANNER_DISMISSED_KEY) || "",
      cooldownUntil: Number(window.sessionStorage.getItem(CART_BANNER_COOLDOWN_KEY) || 0),
    };
  } catch (_) {
    return { lastSeenSig: "", dismissedSig: "", cooldownUntil: 0 };
  }
}

function setSessionState(next) {
  if (!next || typeof next !== "object") return;
  try {
    if ("lastSeenSig" in next) {
      window.sessionStorage.setItem(CART_BANNER_LAST_SEEN_KEY, String(next.lastSeenSig || ""));
    }
    if ("dismissedSig" in next) {
      window.sessionStorage.setItem(CART_BANNER_DISMISSED_KEY, String(next.dismissedSig || ""));
    }
    if ("cooldownUntil" in next) {
      window.sessionStorage.setItem(CART_BANNER_COOLDOWN_KEY, String(Number(next.cooldownUntil) || 0));
    }
  } catch (_) {
    /* ignore */
  }
}

const GLOBAL_WIDGET_CONFIG = window.GREENEST_WIDGET_CONFIG || {};
const WEBAPP_URL = GLOBAL_WIDGET_CONFIG.apiUrl || DEFAULT_WEBAPP_URL;
const GREENEST_SITE_TOKEN =
  typeof GLOBAL_WIDGET_CONFIG.siteToken === "string"
    ? GLOBAL_WIDGET_CONFIG.siteToken
    : DEFAULT_SITE_TOKEN;
const GREENEST_VENDOR =
  typeof GLOBAL_WIDGET_CONFIG.vendor === "string"
    ? GLOBAL_WIDGET_CONFIG.vendor
    : DEFAULT_VENDOR;
const GREENEST_WIDGET_VERSION =
  typeof GLOBAL_WIDGET_CONFIG.widgetVersion === "string"
    ? GLOBAL_WIDGET_CONFIG.widgetVersion
    : DEFAULT_WIDGET_VERSION;
const GREENEST_CHECKOUT_URL =
  typeof GLOBAL_WIDGET_CONFIG.checkoutUrl === "string"
    ? GLOBAL_WIDGET_CONFIG.checkoutUrl
    : DEFAULT_CHECKOUT_URL;
const GREENEST_TITLE_TEXT =
  typeof GLOBAL_WIDGET_CONFIG.titleText === "string"
    ? GLOBAL_WIDGET_CONFIG.titleText
    : DEFAULT_TITLE_TEXT;
const HIDE_RECIPE_IMAGES =
  typeof GLOBAL_WIDGET_CONFIG.hideRecipeImages === "boolean"
    ? GLOBAL_WIDGET_CONFIG.hideRecipeImages
    : DEFAULT_HIDE_RECIPE_IMAGES;
const RECIPE_ONLY_MODE =
  typeof GLOBAL_WIDGET_CONFIG.recipeOnlyMode === "boolean"
    ? GLOBAL_WIDGET_CONFIG.recipeOnlyMode
    : DEFAULT_RECIPE_ONLY_MODE;
const DEFAULT_SERVINGS_COUNT =
  Number.isFinite(Number(GLOBAL_WIDGET_CONFIG.defaultServings)) &&
  Number(GLOBAL_WIDGET_CONFIG.defaultServings) > 0
    ? Number(GLOBAL_WIDGET_CONFIG.defaultServings)
    : DEFAULT_SERVINGS;
const PRODUCT_SEARCH_DISABLED_MESSAGE =
  typeof GLOBAL_WIDGET_CONFIG.productSearchDisabledMessage === "string"
    ? GLOBAL_WIDGET_CONFIG.productSearchDisabledMessage
    : t("product_search_blocked");
const ENABLE_AUTO_ADD =
  typeof GLOBAL_WIDGET_CONFIG.enableAutoAddToCart === "boolean"
    ? GLOBAL_WIDGET_CONFIG.enableAutoAddToCart
    : true;
const GREENEST_CART_ADAPTER = resolveCartAdapter(GLOBAL_WIDGET_CONFIG);
const GREENEST_CART_ADAPTER_MODE = normalizeCartAdapterMode(
  GLOBAL_WIDGET_CONFIG.cartAdapterMode ||
    (GREENEST_CART_ADAPTER && GREENEST_CART_ADAPTER.mode) ||
    (GLOBAL_WIDGET_CONFIG.cart && GLOBAL_WIDGET_CONFIG.cart.mode) ||
    DEFAULT_CART_ADAPTER_MODE
);
const SHOW_INTERNAL_CART_UI =
  typeof GLOBAL_WIDGET_CONFIG.showInternalCartUI === "boolean"
    ? GLOBAL_WIDGET_CONFIG.showInternalCartUI
    : DEFAULT_SHOW_INTERNAL_CART_UI;
const GREENEST_DEBUG = GLOBAL_WIDGET_CONFIG.debug === true;
const ENABLE_CHAT_LOGGING =
  typeof GLOBAL_WIDGET_CONFIG.enableChatLogging === "boolean"
    ? GLOBAL_WIDGET_CONFIG.enableChatLogging
    : DEFAULT_CHAT_LOGGING_ENABLED;
const GREENEST_CHAT_CLIENT_ID = String(
  GLOBAL_WIDGET_CONFIG.clientId ||
    GLOBAL_WIDGET_CONFIG.customerId ||
    GLOBAL_WIDGET_CONFIG.shopifyCustomerId ||
    ""
).trim();
const GREENEST_CHAT_STORE_ORIGIN = String(
  GLOBAL_WIDGET_CONFIG.storeOrigin || ""
).trim();
const GREENEST_CHAT_CART_ID = String(GLOBAL_WIDGET_CONFIG.cartId || "").trim();
const DRAWER_FADE_MS = 220;

(function () {
  if (
    window.__GREENEST_WIDGET_MOUNTED__ ||
    window.__GREENEST_WIDGET_V45_MOUNTED__ ||
    window.__GREENEST_WIDGET_V43_MOUNTED__
  ) {
    return;
  }
  window.__GREENEST_WIDGET_MOUNTED__ = true;
  window.__GREENEST_WIDGET_V45_MOUNTED__ = true;
  window.__GREENEST_WIDGET_V43_MOUNTED__ = true;
  const CLIENT_KEY = "greenest_widget_client_id_v1";
  const SESSION_KEY = "greenest_widget_session_id_v1";
  const RECIPE_CACHE_KEY = "greenest_recipe_list_cache_v1";
  const RECIPE_CACHE_TTL_MS = 60 * 60 * 1000;

  function hashTo7Digits(value) {
    const s = String(value || "");
    let h = 0;
    for (let i = 0; i < s.length; i += 1) {
      h = (h * 31 + s.charCodeAt(i)) % 9000000;
    }
    return String(1000000 + Math.abs(h));
  }

  function normalize7DigitId(value) {
    const s = String(value || "").trim();
    if (!s) return "";
    const digits = s.replace(/\D/g, "");
    if (digits.length >= 7) return digits.slice(-7);
    if (digits.length > 0) return (`0000000${digits}`).slice(-7);
    return hashTo7Digits(s);
  }

  function generate7DigitId() {
    return String(Math.floor(1000000 + Math.random() * 9000000));
  }

  function getClientId() {
    try {
      const existing = window.localStorage.getItem(CLIENT_KEY);
      const normalized = normalize7DigitId(existing);
      if (normalized) {
        if (normalized !== existing) {
          window.localStorage.setItem(CLIENT_KEY, normalized);
        }
        return normalized;
      }
      const generated = generate7DigitId();
      window.localStorage.setItem(CLIENT_KEY, generated);
      return generated;
    } catch (error) {
      console.warn("[GreenestWidget] Failed to persist client id", error);
      return generate7DigitId();
    }
  }

  function getSessionId() {
    try {
      const existing = window.localStorage.getItem(SESSION_KEY);
      if (existing) return existing;
      const generated =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `sess_${Math.random().toString(16).slice(2)}${Date.now()}`;
      window.localStorage.setItem(SESSION_KEY, generated);
      return generated;
    } catch (error) {
      console.warn("[GreenestWidget] Failed to persist session id", error);
      return `sess_${Math.random().toString(16).slice(2)}${Date.now()}`;
    }
  }

  function getCachedRecipes() {
    try {
      const raw = window.localStorage.getItem(RECIPE_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.data) || !parsed.ts) return null;
      if (Date.now() - parsed.ts > RECIPE_CACHE_TTL_MS) return null;
      return parsed.data;
    } catch (error) {
      return null;
    }
  }

  function setCachedRecipes(data) {
    try {
      window.localStorage.setItem(
        RECIPE_CACHE_KEY,
        JSON.stringify({ ts: Date.now(), data })
      );
    } catch (error) {
      /* ignore */
    }
  }

  function isRecipeQuery(rawQuery) {
    const query = String(rawQuery || "").trim().toLowerCase();
    if (!query) return false;

    const recipeIndicators = [
      "retsept",
      "valmistada",
      "küpsetada",
      "kokata",
      "kuidas teha",
      "koostisosad",
      "sammud",
    ];
    const recipeStarters = ["tahan teha", "soovin teha"];
    const recipeDishes = [
      "supp",
      "salat",
      "pasta",
      "kook",
      "pannkoogid",
      "ahjus",
      "praad",
    ];

    return (
      recipeIndicators.some((word) => query.includes(word)) ||
      recipeStarters.some((prefix) => query.startsWith(prefix)) ||
      recipeDishes.some((word) => query.includes(word))
    );
  }

  function isSupportQuery(rawQuery) {
    const query = String(rawQuery || "").trim().toLowerCase();
    if (!query) return false;
    return /(tarne|tarni|kättetoimet|kuller|pakiautomaat|tagastus|makse|tellimus|kontakt|telefon|email|e-mail|klienditugi|support|saadetis)/i.test(
      query
    );
  }

  function isSmalltalkOrGreeting(rawQuery) {
    const query = String(rawQuery || "").trim().toLowerCase();
    if (!query) return false;
    if (/^\s*(tere|tervist|tsau|hei|hello|hey)\s*[!,.?]*\s*$/i.test(query))
      return true;
    if (
      /^\s*(aitäh|tänan|ok|okei|selge|super|lahe|vahva|mhm|jah|jaa)\s*[!,.?]*\s*$/i.test(
        query
      )
    )
      return true;
    return /(kuidas läheb|mis teed|kes sa oled|mida oskad|small talk)/i.test(
      query
    );
  }

  function isProductOnlyQuery(rawQuery) {
    const query = String(rawQuery || "").trim().toLowerCase();
    if (!query) return false;
    if (isRecipeQuery(query)) return false;
    if (isSupportQuery(query)) return false;
    if (isSmalltalkOrGreeting(query)) return false;

    const productIndicators = [
      "osta",
      "tellida",
      "tahan osta",
      "soovin osta",
      "lisa ostukorvi",
      "otsi toodet",
      "leia toode",
      "buy",
      "product",
      "toode:",
    ];

    const hasProductIndicator = productIndicators.some((word) =>
      query.includes(word)
    );
    const hasPriceIndicator =
      /€/.test(query) || /\beur\b/i.test(query) || /\d+\s*(€|eur)/i.test(query);
    return hasProductIndicator || hasPriceIndicator;
  }

  class GreenestWidget {
    constructor() {
      this.webAppUrl = WEBAPP_URL;
      this.siteToken = GREENEST_SITE_TOKEN;
      this.vendor = GREENEST_VENDOR;
      this.widgetVersion = GREENEST_WIDGET_VERSION;
      this.debug = GREENEST_DEBUG;
      this.clientId = getClientId();
      this.enableChatLogging = ENABLE_CHAT_LOGGING;
      this.chatClientId = GREENEST_CHAT_CLIENT_ID || this.clientId;
      this.chatStoreOrigin = GREENEST_CHAT_STORE_ORIGIN;
      this.chatCartId = GREENEST_CHAT_CART_ID;
      this.sessionId = getSessionId();
      this.cartAdapter = GREENEST_CART_ADAPTER;
      this.cartAdapterMode = GREENEST_CART_ADAPTER_MODE;
      this.hasAddedToCart = false;
      this.lastTrackStatus = "";
      this.root = null;
      this.launcher = null;
      this.chatPanel = null;
      this.chatOpen = false;
      this.greetingTooltipEl = null;
      this.messagesEl = null;
      this.typingIndicator = null;
      this.errorEl = null;
      this.textarea = null;
      this.veganCheckbox = null;
      this.glutenCheckbox = null;
      this.sendButton = null;
      this.recipesTriggerBtn = null;
      this.recipesTriggerRow = null;
      this.recipeDrawer = null;
      this.recipeDrawerStatus = null;
      this.recipeSearchInput = null;
      this.recipeListEl = null;
      this.recipeDrawerFooter = null;
      this.recipeDrawerOpen = false;
      this.recipeFilter = "";
      this.recipes = [];
      this.recipeError = "";
      this.nudgeTimer = null;
      this.cart = { items: [] };
      this.cartOpen = false;
      this.cartOverlay = null;
      this.cartModal = null;
      this.cartItemsEl = null;
      this.cartTotalEl = null;
      this.cartEmptyBtn = null;
      this.cartCloseBtn = null;
      this.cartCheckoutLink = null;
      this.cartBadgeEls = [];
      this.cartTopBtn = null;
      this.cartHeaderBtn = null;
      this.lastCartFocus = null;
      this.bodyOverflow = "";
      this.boundHandleKeyDown = this.handleKeyDown.bind(this);
      this.recipeOnlyMode = RECIPE_ONLY_MODE;
      this.hideRecipeImages = HIDE_RECIPE_IMAGES;
      this.defaultServings = DEFAULT_SERVINGS_COUNT;
      this.showInternalCartUI = SHOW_INTERNAL_CART_UI;
      this.cartBannerEl = null;
      this.cartBannerSig = "";
      this.cartBannerHideTimer = null;
      this.cartBannerCooldownTimer = null;
      this.lastCandidatesCount = 0;
      this.lastCandidates = [];
      this.lastRecommendationSig = "";
      this.lastRecommendationHasItems = false;
      this.chatOpenAnimTimer = null;
      this.greetingHideTimer = null;
      this.greetingSequenceTimer = null;
      this.greetingLoopTimer = null;
      this.externalCartHydrated = false;
    }

    init() {
      this.render();
      if (this.showInternalCartUI) {
        this.cart = this.loadCart();
      }
      this.updateCartUI();
      if (this.getCartProductIds().length) {
        this.refreshCartRecipeCandidates()
          .then(() => this.maybeShowCartBanner("init_local", { ignoreCooldown: true }))
          .catch(() => {
            /* ignore */
          });
      }
      this.loadExternalCartSnapshot();
      this.startLauncherNudge();
      this.fetchRecipes();
      this.initDebugHooks();
      this.trackEvent("widget_loaded", { assisted: 0, reason: "auto" });
      document.addEventListener("keydown", this.boundHandleKeyDown);
    }

    render() {
      this.root = document.createElement("div");
      this.root.className = "greenest-widget";

      const launcher = this.createLauncher();
      this.root.appendChild(launcher);
      document.body.appendChild(this.root);
      this.maybeShowLauncherGreeting();
      const chatPanel = this.createChatPanel();
      document.body.appendChild(chatPanel);
      if (this.showInternalCartUI) {
        this.createCartUI();
      }
      const banner = this.createCartBanner();
      if (banner) {
        document.body.appendChild(banner);
      }
    }

    createLauncher() {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "greenest-launcher";
      button.setAttribute("aria-label", t("launcher_label"));
      button.innerHTML = `<span class="greenest-launcher-g" aria-hidden="true">g</span>`;
      button.addEventListener("click", () => this.toggleChat());
      button.addEventListener("click", () => this.stopLauncherGreetingSequence());
      if (this.showInternalCartUI) {
        this.addCartBadge(button);
      }
      this.launcher = button;
      return button;
    }

    createChatPanel() {
      const panel = document.createElement("section");
      panel.className = "greenest-chat-panel";
      panel.dataset.build = WIDGET_BUILD;
      this.chatPanel = panel;

      const header = document.createElement("header");
      header.className = "greenest-chat-header";
      const headerBrand = document.createElement("div");
      headerBrand.className = "greenest-header-brand";

      const logo = document.createElement("div");
      logo.className = "greenest-header-logo";
      logo.setAttribute("aria-hidden", "true");
      logo.innerHTML = `<span class="greenest-logo-g">g</span>`;
      headerBrand.appendChild(logo);

      const headerMeta = document.createElement("div");
      headerMeta.className = "greenest-header-meta";
      const title = document.createElement("strong");
      title.textContent = GREENEST_TITLE_TEXT;
      headerMeta.appendChild(title);

      const status = document.createElement("div");
      status.className = "greenest-header-status";
      status.innerHTML = `<span class="greenest-status-dot" aria-hidden="true"></span>${t("status_online")}`;
      headerMeta.appendChild(status);

      const poweredHeader = document.createElement("div");
      poweredHeader.className = "greenest-header-powered";
      const poweredHeaderLink = document.createElement("a");
      poweredHeaderLink.href = "https://growlinee.com";
      poweredHeaderLink.target = "_blank";
      poweredHeaderLink.rel = "noreferrer noopener";
      poweredHeaderLink.textContent = t("powered_by");
      poweredHeader.appendChild(poweredHeaderLink);
      headerMeta.appendChild(poweredHeader);

      headerBrand.appendChild(headerMeta);
      header.appendChild(headerBrand);

      const headerActions = document.createElement("div");
      headerActions.className = "greenest-header-actions";

      if (this.showInternalCartUI) {
        const cartBtn = document.createElement("button");
        cartBtn.type = "button";
        cartBtn.className = "greenest-icon-btn greenest-cart-header-btn";
        cartBtn.setAttribute("aria-label", t("open_cart_label"));
        cartBtn.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 6h-2l-1 2h2l3.6 7.59-1.35 2.44a1 1 0 0 0 .87 1.48h9.73v-2H10.42a.25.25 0 0 1-.22-.37l.9-1.63h6.68a1 1 0 0 0 .92-.63L21 8H7.21l-.21-.5A1 1 0 0 0 6 7H4V5h2a1 1 0 0 1 .97.76L7 6zm1 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>`;
        cartBtn.addEventListener("click", () => this.openCart("header"));
        this.cartHeaderBtn = cartBtn;
        this.addCartBadge(cartBtn);
        headerActions.appendChild(cartBtn);
      }

      const minimizeBtn = document.createElement("button");
      minimizeBtn.type = "button";
      minimizeBtn.className = "greenest-minimize-btn";
      minimizeBtn.setAttribute("aria-label", t("chat_minimize_label"));
      minimizeBtn.textContent = "−";
      minimizeBtn.addEventListener("click", () => this.closeChat());
      headerActions.appendChild(minimizeBtn);

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "greenest-close-btn";
      closeBtn.setAttribute("aria-label", t("chat_close_label"));
      closeBtn.textContent = "✕";
      closeBtn.addEventListener("click", () => this.closeChat());
      headerActions.appendChild(closeBtn);

      header.appendChild(headerActions);
      panel.appendChild(header);

      const messages = document.createElement("div");
      messages.className = "greenest-chat-messages";
      this.messagesEl = messages;
      panel.appendChild(messages);

      this.appendWelcomeMessage();

      const typing = document.createElement("div");
      typing.className = "greenest-typing";
      typing.textContent = "";
      this.typingIndicator = typing;
      panel.appendChild(typing);

      const recipesTriggerRow = document.createElement("div");
      recipesTriggerRow.className = "greenest-recipes-trigger-row";
      this.recipesTriggerRow = recipesTriggerRow;
      const recipesTrigger = document.createElement("button");
      recipesTrigger.type = "button";
      recipesTrigger.className = "greenest-recipes-trigger";
      recipesTrigger.textContent = t("recipes_open");
      recipesTrigger.setAttribute("aria-expanded", "false");
      recipesTrigger.addEventListener("click", () => this.toggleRecipeDrawer());
      this.recipesTriggerBtn = recipesTrigger;
      recipesTriggerRow.appendChild(recipesTrigger);
      panel.appendChild(recipesTriggerRow);

      const filters = document.createElement("div");
      filters.className = "greenest-filters";

      const veganLabel = document.createElement("label");
      const veganCheckbox = document.createElement("input");
      veganCheckbox.type = "checkbox";
      this.veganCheckbox = veganCheckbox;
      veganLabel.appendChild(veganCheckbox);
      veganLabel.appendChild(document.createTextNode(t("filters_vegan")));

      const glutenLabel = document.createElement("label");
      const glutenCheckbox = document.createElement("input");
      glutenCheckbox.type = "checkbox";
      this.glutenCheckbox = glutenCheckbox;
      glutenLabel.appendChild(glutenCheckbox);
      glutenLabel.appendChild(document.createTextNode(t("filters_gluten_free")));

      filters.appendChild(veganLabel);
      filters.appendChild(glutenLabel);
      panel.appendChild(filters);

      const form = document.createElement("form");
      form.className = "greenest-chat-form";
      this.chatForm = form;

      const inputRow = document.createElement("div");
      inputRow.className = "greenest-input-row";

      const textareaWrap = document.createElement("div");
      textareaWrap.className = "greenest-textarea-wrap";

      const textarea = document.createElement("textarea");
      textarea.className = "greenest-textarea";
      textarea.id = "g-query";
      textarea.placeholder = t("chat_placeholder");
      textarea.rows = 3;
      this.textarea = textarea;
      textareaWrap.appendChild(textarea);
      inputRow.appendChild(textareaWrap);

      const sendBtn = document.createElement("button");
      sendBtn.type = "submit";
      sendBtn.className = "greenest-send-btn";
      sendBtn.textContent = t("send_btn");
      this.sendButton = sendBtn;

      inputRow.appendChild(sendBtn);
      form.appendChild(inputRow);

      const errorEl = document.createElement("div");
      errorEl.className = "greenest-error";
      this.errorEl = errorEl;
      form.appendChild(errorEl);

      form.addEventListener("submit", (event) => this.handleSubmit(event));
      panel.appendChild(form);

      const poweredBy = document.createElement("div");
      poweredBy.className = "greenest-powered-by";
      const poweredLink = document.createElement("a");
      poweredLink.href = "https://growlinee.com";
      poweredLink.target = "_blank";
      poweredLink.rel = "noreferrer noopener";
      poweredLink.textContent = t("powered_by");
      poweredBy.appendChild(poweredLink);
      panel.appendChild(poweredBy);

      const recipeDrawer = this.createRecipeDrawer();
      panel.appendChild(recipeDrawer);

      if (!this.webAppUrl) {
        this.showError(t("error_missing_api_long"));
        this.disableChatInputs(true);
      }

      return panel;
    }

    createCartUI() {
      const topBtn = document.createElement("button");
      topBtn.type = "button";
      topBtn.className = "greenest-cart-top-btn";
      topBtn.setAttribute("aria-label", t("open_cart_label"));
      topBtn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 6h-2l-1 2h2l3.6 7.59-1.35 2.44a1 1 0 0 0 .87 1.48h9.73v-2H10.42a.25.25 0 0 1-.22-.37l.9-1.63h6.68a1 1 0 0 0 .92-.63L21 8H7.21l-.21-.5A1 1 0 0 0 6 7H4V5h2a1 1 0 0 1 .97.76L7 6zm1 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
        </svg>`;
      topBtn.addEventListener("click", () => this.openCart("top"));
      this.cartTopBtn = topBtn;
      this.addCartBadge(topBtn);
      document.body.appendChild(topBtn);

      const overlay = document.createElement("div");
      overlay.className = "greenest-cart-overlay";
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          this.closeCart();
        }
      });
      this.cartOverlay = overlay;

      const modal = document.createElement("div");
      modal.className = "greenest-cart-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", t("cart_title"));
      this.cartModal = modal;
      overlay.appendChild(modal);

      const header = document.createElement("div");
      header.className = "greenest-cart-header";
      const title = document.createElement("strong");
      title.textContent = t("cart_title");
      const close = document.createElement("button");
      close.type = "button";
      close.className = "greenest-cart-close";
      close.setAttribute("aria-label", t("cart_close_label"));
      close.textContent = "✕";
      close.addEventListener("click", () => this.closeCart());
      header.appendChild(title);
      header.appendChild(close);
      modal.appendChild(header);

      const items = document.createElement("div");
      items.className = "greenest-cart-items";
      this.cartItemsEl = items;
      modal.appendChild(items);

      const footer = document.createElement("div");
      footer.className = "greenest-cart-footer";

      const totalRow = document.createElement("div");
      totalRow.className = "greenest-cart-total-row";
      const totalLabel = document.createElement("span");
      totalLabel.textContent = t("cart_total_label");
      const totalValue = document.createElement("span");
      totalValue.className = "greenest-cart-total";
      totalValue.textContent = this.formatPrice(0);
      this.cartTotalEl = totalValue;
      totalRow.appendChild(totalLabel);
      totalRow.appendChild(totalValue);
      footer.appendChild(totalRow);

      const actions = document.createElement("div");
      actions.className = "greenest-cart-actions";
      const emptyBtn = document.createElement("button");
      emptyBtn.type = "button";
      emptyBtn.className = "greenest-cart-empty";
      emptyBtn.textContent = t("cart_empty_btn");
      emptyBtn.addEventListener("click", () => {
        this.emptyCart();
        this.closeCart();
        this.fadeClearChatLog();
      });
      this.cartEmptyBtn = emptyBtn;
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "greenest-cart-close-btn";
      closeBtn.textContent = t("cart_close_btn");
      closeBtn.addEventListener("click", () => this.closeCart());
      this.cartCloseBtn = closeBtn;
      const checkout = document.createElement("a");
      checkout.className = "greenest-cart-checkout";
      checkout.textContent = t("cart_checkout_btn");
      checkout.target = "_blank";
      checkout.rel = "noreferrer noopener";
      checkout.href = this.getCheckoutUrl();
      checkout.addEventListener("click", (event) => {
        this.trackEvent("checkout_clicked", { assisted: 0, reason: "ui" });
        this.handleAdapterCheckout("checkout_click", event);
      });
      this.cartCheckoutLink = checkout;
      actions.appendChild(emptyBtn);
      actions.appendChild(closeBtn);
      actions.appendChild(checkout);
      footer.appendChild(actions);
      modal.appendChild(footer);

      document.body.appendChild(overlay);
    }

    fetchRecipes(force = false) {
      if (!this.webAppUrl) {
        this.recipeError = t("error_missing_api");
        this.renderRecipeList();
        return;
      }

      if (!force) {
        const cached = getCachedRecipes();
        if (cached && cached.length) {
          this.recipes = cached;
          this.recipeError = "";
          this.renderRecipeList();
          return;
        }
      }

      const url = `${this.webAppUrl}?action=listRecipes&_ts=${Date.now()}`;
      this.recipeError = "";
      this.setRecipeStatus(t("recipes_loading"), false);

      fetch(url)
        .then((response) =>
          response.text().then((text) => {
            let data;
            try {
              data = JSON.parse(text);
            } catch (error) {
              error.responseText = text;
              throw error;
            }
            if (!response.ok || data.ok === false) {
              const err = new Error(
                (data && data.error) || t("error_unknown")
              );
              err.responseText = text;
              throw err;
            }
            return data;
          })
        )
        .then((data) => {
          const recipes = Array.isArray(data.recipes) ? data.recipes : [];
          this.recipes = recipes
            .map((recipe, idx) => this.normalizeRecipeItem(recipe, idx))
            .filter((item) => item.label);
          if (!this.recipes.length) {
            throw new Error(t("error_no_recipes_returned"));
          }
          setCachedRecipes(this.recipes);
          this.recipeError = "";
          this.renderRecipeList();
        })
        .catch((error) => {
          console.error("[GreenestWidget] Failed to load recipes", error, {
            stack: error.stack,
            responseText: error.responseText,
          });
          this.recipes = [];
          this.recipeError = error.message || t("error_unknown");
          this.renderRecipeList();
        });
    }

    normalizeRecipeItem(recipe, index = 0) {
      const title =
        recipe.recipe_name ||
        recipe.recipeTitle ||
        recipe.recipeName ||
        recipe.title ||
        recipe.name ||
        t("recipe_fallback_title", { count: index + 1 });
      return {
        id: recipe.recipe_id || recipe.recipeId || recipe.id || String(index),
        label: title,
        imageUrl: recipe.image_url || recipe.image_thumb_url || "",
        tags: recipe.tags || "",
        baseServings:
          Number(recipe.base_servings || recipe.baseServings || recipe.servings) ||
          this.defaultServings,
        dietVegan: Boolean(recipe.diet_vegan),
        dietGlutenFree: Boolean(recipe.diet_glutenFree),
        productIds: Array.isArray(recipe.product_ids)
          ? recipe.product_ids.map(String)
          : [],
      };
    }

    createRecipeDrawer() {
      const drawer = document.createElement("div");
      drawer.className = "greenest-recipe-drawer";
      drawer.hidden = true;
      this.recipeDrawer = drawer;
      drawer.addEventListener("click", (event) => {
        if (event.target === drawer) {
          if (this.debug) {
            console.log("[GreenestWidget] Recipe drawer overlay clicked");
          }
          this.setRecipeDrawerOpen(false);
        }
      });
      drawer.setAttribute("aria-hidden", "true");

      const header = document.createElement("div");
      header.className = "greenest-recipe-drawer-header";
      const title = document.createElement("strong");
      title.textContent = t("recipes_title");
      const close = document.createElement("button");
      close.type = "button";
      close.className = "greenest-recipes-close";
      close.setAttribute("aria-label", t("recipes_close"));
      close.textContent = "✕";
      close.addEventListener("click", () => {
        if (this.debug) {
          console.log("[GreenestWidget] Recipe drawer close clicked");
        }
        this.setRecipeDrawerOpen(false);
      });
      header.appendChild(title);
      header.appendChild(close);
      drawer.appendChild(header);

      const searchRow = document.createElement("div");
      searchRow.className = "greenest-recipe-search-row";
      const searchInput = document.createElement("input");
      searchInput.type = "search";
      searchInput.className = "greenest-recipe-search";
      searchInput.placeholder = t("recipes_search_placeholder");
      searchInput.addEventListener("input", () => {
        this.recipeFilter = searchInput.value;
        this.renderRecipeList();
      });
      this.recipeSearchInput = searchInput;
      searchRow.appendChild(searchInput);
      drawer.appendChild(searchRow);

      const status = document.createElement("div");
      status.className = "greenest-recipe-status";
      status.hidden = true;
      this.recipeDrawerStatus = status;
      drawer.appendChild(status);

      const list = document.createElement("div");
      list.className = "greenest-recipe-list";
      this.recipeListEl = list;
      drawer.appendChild(list);

      const footer = document.createElement("div");
      footer.className = "greenest-recipe-drawer-footer";
      this.recipeDrawerFooter = footer;
      drawer.appendChild(footer);

      return drawer;
    }

    setRecipeDrawerOpen(open) {
      if (!this.recipeDrawer) return;
      this.recipeDrawerOpen = Boolean(open);
      if (this.debug) {
        console.log("[GreenestWidget] setRecipeDrawerOpen", this.recipeDrawerOpen);
      }
      if (this.recipeDrawerOpen) {
        this.recipeDrawer.hidden = false;
        requestAnimationFrame(() => {
          if (!this.recipeDrawerOpen) return;
          this.recipeDrawer.classList.add("is-open");
        });
      } else {
        this.recipeDrawer.classList.remove("is-open");
        window.setTimeout(() => {
          if (this.recipeDrawerOpen) return;
          this.recipeDrawer.hidden = true;
        }, DRAWER_FADE_MS);
      }
      this.recipeDrawer.setAttribute(
        "aria-hidden",
        this.recipeDrawerOpen ? "false" : "true"
      );
      if (this.recipesTriggerBtn) {
        this.recipesTriggerBtn.textContent = this.recipeDrawerOpen
          ? t("recipes_close")
          : t("recipes_open");
        this.recipesTriggerBtn.setAttribute(
          "aria-expanded",
          this.recipeDrawerOpen ? "true" : "false"
        );
      }
      if (this.recipesTriggerBtn) {
        const target = this.recipeDrawerOpen
          ? this.recipeDrawerFooter
          : this.recipesTriggerRow;
        if (target && this.recipesTriggerBtn.parentNode !== target) {
          if (this.recipesTriggerBtn.parentNode) {
            this.recipesTriggerBtn.parentNode.removeChild(this.recipesTriggerBtn);
          }
          target.appendChild(this.recipesTriggerBtn);
        }
      }
      if (this.recipeDrawerOpen) {
        this.renderRecipeList();
      }
    }

    toggleRecipeDrawer() {
      if (this.debug) {
        console.log("[GreenestWidget] Recipe drawer trigger clicked");
      }
      this.setRecipeDrawerOpen(!this.recipeDrawerOpen);
    }

    startLauncherNudge() {
      if (this.nudgeTimer) return;
      try {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }
      } catch (_) {
        /* ignore */
      }
      window.setTimeout(() => this.nudgeLauncherOnce(), 1500);

      const schedule = () => {
        const delay = 18000 + Math.floor(Math.random() * 10000);
        this.nudgeTimer = window.setTimeout(() => {
          this.nudgeLauncherOnce();
          schedule();
        }, delay);
      };
      schedule();
    }

    nudgeLauncherOnce() {
      if (!this.launcher) return;
      if (this.chatOpen) return;
      if (this.recipeDrawerOpen) return;
      try {
        if (this.launcher.matches(":hover")) return;
      } catch (_) {
        /* ignore */
      }

      this.launcher.classList.remove("is-nudging");
      void this.launcher.offsetWidth;
      this.launcher.classList.add("is-nudging");
    }

    maybeShowLauncherGreeting() {
      if (!this.launcher) return;
      this.startLauncherGreetingLoop();
    }

    startLauncherGreetingLoop() {
      if (this.greetingLoopTimer) return;
      const run = () => {
        if (!this.chatOpen && !this.recipeDrawerOpen) {
          this.startLauncherGreetingSequence();
        }
        const jitter = Math.floor(Math.random() * 24000);
        this.greetingLoopTimer = window.setTimeout(run, LAUNCHER_GREETING_LOOP_MS + jitter);
      };
      run();
    }

    startLauncherGreetingSequence() {
      this.stopLauncherGreetingSequence();
      const messages = [t("launcher_greeting"), t("launcher_help"), t("launcher_cta")];
      if (!messages.length) return;

      let idx = 0;
      const showNext = () => {
        if (this.chatOpen) return;
        const isLast = idx >= messages.length - 1;
        const duration = isLast ? 5200 : 3600;
        this.nudgeLauncherOnce();
        this.showLauncherGreeting(messages[idx], duration);
        idx += 1;
        if (idx < messages.length) {
          this.greetingSequenceTimer = window.setTimeout(showNext, duration + 400);
        } else {
          this.greetingSequenceTimer = null;
        }
      };

      showNext();
    }

    stopLauncherGreetingSequence() {
      if (this.greetingSequenceTimer) {
        window.clearTimeout(this.greetingSequenceTimer);
        this.greetingSequenceTimer = null;
      }
      this.hideLauncherGreeting(true);
    }

    showLauncherGreeting(text, durationMs) {
      this.hideLauncherGreeting(true);

      const tip = document.createElement("div");
      tip.className = "greenest-intro-tooltip";
      tip.setAttribute("role", "status");
      tip.setAttribute("aria-live", "polite");

      const message = document.createElement("span");
      message.textContent = text;
      tip.appendChild(message);

      const close = document.createElement("button");
      close.type = "button";
      close.className = "greenest-intro-close";
      close.setAttribute("aria-label", t("close_notice_label"));
      close.textContent = "✕";
      close.addEventListener("click", () => this.stopLauncherGreetingSequence());
      tip.appendChild(close);

      if (this.root) {
        this.root.appendChild(tip);
      }
      this.greetingTooltipEl = tip;

      requestAnimationFrame(() => {
        if (this.greetingTooltipEl) {
          this.greetingTooltipEl.classList.add("is-visible");
        }
      });

      const hideAfter = Math.max(1200, Number(durationMs) || 6000);
      this.greetingHideTimer = window.setTimeout(
        () => this.hideLauncherGreeting(),
        hideAfter
      );
    }

    hideLauncherGreeting(immediate = false) {
      if (this.greetingHideTimer) {
        window.clearTimeout(this.greetingHideTimer);
        this.greetingHideTimer = null;
      }
      const tip = this.greetingTooltipEl;
      if (!tip) return;
      this.greetingTooltipEl = null;

      if (immediate) {
        tip.remove();
        return;
      }
      tip.classList.remove("is-visible");
      window.setTimeout(() => tip.remove(), 300);
    }

    // Manual test checklist:
    // 1) Open recipes -> trigger moves into drawer footer, label is "Close recipes".
    // 2) Select a recipe -> drawer closes, user message appears, trigger returns to row.
    // 3) ESC closes drawer first, chat remains open.

    setRecipeStatus(message, showRetry) {
      if (!this.recipeDrawerStatus) return;
      this.recipeDrawerStatus.innerHTML = "";
      if (!message) {
        this.recipeDrawerStatus.hidden = true;
        return;
      }
      const text = document.createElement("span");
      text.textContent = message;
      this.recipeDrawerStatus.appendChild(text);
      if (showRetry) {
        const retry = document.createElement("button");
        retry.type = "button";
        retry.className = "greenest-recipe-retry";
        retry.textContent = t("recipes_retry");
        retry.addEventListener("click", () => this.fetchRecipes(true));
        this.recipeDrawerStatus.appendChild(retry);
      }
      this.recipeDrawerStatus.hidden = false;
    }

    getFilteredRecipes() {
      const query = (this.recipeFilter || "").trim().toLowerCase();
      if (!query) return this.recipes.slice();
      return this.recipes.filter((recipe) => {
        const name = String(recipe.label || "").toLowerCase();
        const tags = String(recipe.tags || "").toLowerCase();
        return name.includes(query) || tags.includes(query);
      });
    }

    renderRecipeList() {
      if (!this.recipeListEl) return;
      this.recipeListEl.innerHTML = "";

      if (this.recipeError) {
        this.setRecipeStatus(
          t("recipes_load_failed", { error: this.recipeError }),
          true
        );
        return;
      }

      const filtered = this.getFilteredRecipes();
      if (!filtered.length) {
        this.setRecipeStatus(t("recipes_not_found"), false);
        return;
      }

      this.setRecipeStatus("", false);
      filtered.forEach((recipe) => {
        this.recipeListEl.appendChild(this.createRecipeCard(recipe));
      });
    }

    createRecipeCard(recipe) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "greenest-recipe-card";

      const displayLabel = this.getRecipeDisplayLabel(recipe);

      if (!this.hideRecipeImages && recipe.imageUrl) {
        const img = document.createElement("img");
        img.className = "greenest-recipe-thumb";
        img.src = recipe.imageUrl;
        img.alt = displayLabel;
        img.loading = "lazy";
        img.width = 56;
        img.height = 56;
        card.appendChild(img);
      }

      const info = document.createElement("div");
      info.className = "greenest-recipe-info";
      const name = document.createElement("div");
      name.className = "greenest-recipe-name";
      name.textContent = displayLabel;
      info.appendChild(name);

      const badges = document.createElement("div");
      badges.className = "greenest-recipe-badges";
      if (recipe.dietVegan) {
        const badge = document.createElement("span");
        badge.className = "greenest-recipe-badge";
        badge.textContent = t("filters_vegan");
        badges.appendChild(badge);
      }
      if (recipe.dietGlutenFree) {
        const badge = document.createElement("span");
        badge.className = "greenest-recipe-badge";
        badge.textContent = t("filters_gluten_free");
        badges.appendChild(badge);
      }
      if (badges.childNodes.length) {
        info.appendChild(badges);
      }

      card.appendChild(info);
      card.addEventListener("click", () => {
        this.handleRecipeSelection(recipe);
      });

      return card;
    }

    appendWelcomeMessage() {
      if (!this.messagesEl) return;
      const message = document.createElement("div");
      message.className = "greenest-message assistant";
      message.dataset.welcome = "1";
      const bubble = document.createElement("div");
      bubble.className = "greenest-bubble assistant";
      bubble.textContent = t("welcome_message");
      message.appendChild(bubble);
      this.messagesEl.appendChild(message);
    }

    clearChatUI({ keepWelcome = true } = {}) {
      if (this.textarea) {
        this.textarea.value = "";
      }
      this.showError("");

      if (this.messagesEl) {
        const messages = this.messagesEl.querySelectorAll(".greenest-message");
        messages.forEach((el) => el.remove());
        if (keepWelcome) {
          this.appendWelcomeMessage();
        }
      }

      if (this.textarea) {
        this.textarea.focus();
      }
    }

    fadeRemoveElement_(element, ms = 240) {
      if (!element) return;
      element.classList.add("gw-fade-target");
      void element.offsetWidth;
      element.classList.add("gw-fade-out");
      window.setTimeout(() => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, ms);
    }

    fadeClearChatLog() {
      if (this.textarea) {
        this.textarea.value = "";
      }
      this.showError("");

      if (!this.messagesEl) return;
      const messages = Array.from(
        this.messagesEl.querySelectorAll(".greenest-message")
      );
      if (!messages.length) return;

      messages.forEach((message) => {
        if (message.dataset.welcome === "1") return;
        this.fadeRemoveElement_(message, 240);
      });
    }

    disableChatInputs(state) {
      this.textarea.disabled = state;
      this.veganCheckbox.disabled = state;
      this.glutenCheckbox.disabled = state;
      this.sendButton.disabled = state;
    }

    toggleChat() {
      if (this.chatOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    submitRecipeFromBank(recipe) {
      if (!this.webAppUrl) {
        this.appendMessage("assistant", t("error_missing_api"));
        return;
      }

      const query = this.buildRecipeQuery(recipe);
      const requestId = this.makeRequestId("req");

      this.trackEvent("assistant_query", {
        assisted: 1,
        reason: "recipe_bank",
        query_len: query.length,
        recipe_id: recipe.id,
      });

      this.setLoading(true);
      this.setThinking(true);

      const payload = {
        query,
        recipeId: recipe.id,
        querySource: "recipe_bank",
      };

      fetch(this.webAppUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((response) => response.text().then((text) => ({ response, text })))
        .then(({ response, text }) => {
          let data;
          try {
            data = JSON.parse(text);
          } catch (_) {
            throw new Error(t("error_parse_json"));
          }

          if (!response.ok || data.ok === false) {
            throw new Error(
              data && data.error ? data.error : t("error_request_failed")
            );
          }

          const assistantText =
            data.assistantText || data.message || t("error_no_response");
          this.appendMessage("assistant", assistantText);
          this.logChatMessage({
            requestId,
            status: "ok",
            userMessage: query,
            assistantMessage: assistantText,
          });

          const mainProducts = Array.isArray(data.mainProducts)
            ? data.mainProducts
            : [];
          const fallback = Array.isArray(data.coreProducts)
            ? data.coreProducts
            : [];
          const products = mainProducts.length ? mainProducts : fallback;
          const addedCount = this.addProductsToCart(products);
          if (addedCount > 0) {
            this.notifyCartAddition(addedCount);
            this.trackEvent("cart_add", {
              assisted: 1,
              reason: "recipe_bank",
              items_added: addedCount,
              source: "recipe_bank",
              recipe_id: recipe.id,
              recipe_label: recipe.label,
            });
          } else {
            this.trackEvent("cart_add_failed", {
              assisted: 1,
              reason: "empty_products",
              source: "recipe_bank",
              recipe_id: recipe.id,
              recipe_label: recipe.label,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          const errorMessage =
            error && error.message ? error.message : t("error_unknown");
          this.appendMessage(
            "assistant",
            errorMessage
          );
          this.logChatMessage({
            requestId,
            status: "error",
            userMessage: query,
            errorMessage,
          });
        })
        .finally(() => {
          this.setLoading(false);
          this.setThinking(false);
          if (this.textarea) this.textarea.blur();
        });
    }

    openChat() {
      if (!this.chatPanel) return;
      if (this.chatOpenAnimTimer) {
        window.clearTimeout(this.chatOpenAnimTimer);
        this.chatOpenAnimTimer = null;
      }
      this.chatPanel.classList.remove("is-opening");
      void this.chatPanel.offsetWidth;
      this.chatPanel.classList.add("is-open");
      this.chatPanel.classList.add("is-opening");
      this.chatOpen = true;
      this.stopLauncherGreetingSequence();
      this.trackEvent("widget_opened", { assisted: 0, reason: "ui" });
      this.chatOpenAnimTimer = window.setTimeout(() => {
        if (!this.chatPanel) return;
        this.chatPanel.classList.remove("is-opening");
        this.chatOpenAnimTimer = null;
      }, 860);
      setTimeout(() => this.textarea && this.textarea.focus(), 150);
    }

    closeChat() {
      if (!this.chatPanel) return;
      if (this.chatOpenAnimTimer) {
        window.clearTimeout(this.chatOpenAnimTimer);
        this.chatOpenAnimTimer = null;
      }
      this.chatPanel.classList.remove("is-open");
      this.chatPanel.classList.remove("is-opening");
      this.chatOpen = false;
    }

    handleSubmit(event) {
      event.preventDefault();
      this.showError("");
      const query = (this.textarea.value || "").trim();
      const requestId = this.makeRequestId("req");
      if (!query) {
        this.showError(t("error_empty_query"));
        return;
      }

      this.appendMessage("user", query);

      if (this.recipeOnlyMode && isProductOnlyQuery(query)) {
        this.appendRecipeOnlyNotice();
        this.logChatMessage({
          requestId,
          status: "ok",
          userMessage: query,
          assistantMessage: RECIPE_ONLY_NOTICE,
        });
        this.textarea.value = "";
        this.textarea.focus();
        return;
      }

      const payload = {
        query,
        veganOnly: Boolean(this.veganCheckbox.checked),
        glutenFreeOnly: Boolean(this.glutenCheckbox.checked),
      };

      if (!this.webAppUrl) {
        this.showError(t("error_missing_api"));
        return;
      }

      this.trackEvent("assistant_query", {
        assisted: 1,
        reason: "chat",
        query_len: query.length,
        vegan_only: payload.veganOnly ? 1 : 0,
        gluten_free_only: payload.glutenFreeOnly ? 1 : 0,
      });

      this.showError("");
      this.setLoading(true);
      this.setThinking(true);

      fetch(this.webAppUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((response) => response.text().then((text) => ({ response, text })))
        .then(({ response, text }) => {
          let data;
          try {
            data = JSON.parse(text);
          } catch (error) {
            throw new Error(t("error_parse_json"));
          }

          if (!response.ok || data.ok === false) {
            throw new Error(
              data && data.error ? data.error : t("error_request_failed")
            );
          }

          const assistantText =
            data.assistantText || data.message || t("error_no_response");
          this.appendMessage("assistant", assistantText);
          this.logChatMessage({
            requestId,
            status: "ok",
            userMessage: query,
            assistantMessage: assistantText,
          });
        })
        .catch((error) => {
          console.error(error);
          const errorMessage =
            error && error.message ? error.message : t("error_unknown");
          this.showError(errorMessage);
          this.logChatMessage({
            requestId,
            status: "error",
            userMessage: query,
            errorMessage,
          });
        })
        .finally(() => {
          this.setLoading(false);
          this.setThinking(false);
          this.textarea.value = "";
          this.textarea.focus();
        });
    }

    setLoading(isLoading) {
      if (!this.sendButton) return;
      this.sendButton.disabled = isLoading;
      this.sendButton.textContent = isLoading
        ? t("sending_btn")
        : t("send_btn");
    }

    setThinking(isThinking) {
      if (!this.typingIndicator) return;
      this.typingIndicator.textContent = isThinking ? t("thinking_text") : "";
    }

    appendMessage(role, text) {
      if (!this.messagesEl) return;
      const message = document.createElement("div");
      message.className = `greenest-message ${role}`;
      const bubble = document.createElement("div");
      bubble.className = `greenest-bubble ${role === "user" ? "user" : "assistant"}`;

      if (role === "assistant") {
        const content = this.renderAssistantContent(text);
        bubble.appendChild(content);
      } else {
        bubble.innerHTML = this.escapeAndFormat(text);
      }

      message.appendChild(bubble);
      this.messagesEl.appendChild(message);
      this.scrollMessages();
    }

    scrollMessages() {
      if (!this.messagesEl) return;
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }

    notifyCartAddition(count) {
      if (!this.messagesEl) return;
      const wrapper = document.createElement("div");
      wrapper.className = "greenest-message assistant";
      const bubble = document.createElement("div");
      bubble.className = "greenest-bubble assistant";
      const text = document.createElement("p");
      text.style.margin = "0";
      text.textContent = t("cart_added_message", { count });
      bubble.appendChild(text);

      wrapper.appendChild(bubble);
      this.messagesEl.appendChild(wrapper);
      this.scrollMessages();
    }

    renderAssistantContent(rawText) {
      const parsed = this.parseAssistantText(rawText || "");
      const hasStructure =
        parsed.title || parsed.ingredients.length || parsed.steps.length || parsed.extras.length;

      if (!hasStructure) {
        const fallback = document.createElement("div");
        fallback.innerHTML = this.escapeAndFormat(rawText);
        return fallback;
      }

      const container = document.createElement("div");
      if (parsed.title) {
        const title = document.createElement("h3");
        title.textContent = parsed.title;
        container.appendChild(title);
      }

      if (parsed.ingredients.length) {
        const heading = document.createElement("h4");
        heading.textContent = t("assistant_ingredients");
        container.appendChild(heading);
        const list = document.createElement("ul");
        parsed.ingredients.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
        container.appendChild(list);
      }

      if (parsed.steps.length) {
        const heading = document.createElement("h4");
        heading.textContent = t("assistant_steps");
        container.appendChild(heading);
        const list = document.createElement("ol");
        parsed.steps.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
        container.appendChild(list);
      }

      parsed.extras.forEach((section) => {
        if (!section.items.length) return;
        const heading = document.createElement("h4");
        heading.textContent = section.title;
        container.appendChild(heading);
        const list = document.createElement("ul");
        section.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
        container.appendChild(list);
      });

      return container;
    }

    parseAssistantText(text) {
      const lines = (text || "")
        .split(/\r?\n/)
        .map((line) => line.trim());
      const filtered = lines.filter((line) => line.length);
      const data = {
        title: filtered[0] || "",
        ingredients: [],
        steps: [],
        extras: [],
      };

      let currentExtra = null;

      lines.forEach((line) => {
        if (!line) {
          currentExtra = null;
          return;
        }

        if (
          /^(kodused koostisosad|kodused\s*\/\s*värsked|kodust\s*\/\s*värsked)/i.test(
            line
          )
        ) {
          currentExtra = { title: line, items: [] };
          data.extras.push(currentExtra);
          return;
        }

        if (/^koostisosad/i.test(line)) {
          currentExtra = null;
          return;
        }

        if (/^sammud/i.test(line)) {
          currentExtra = null;
          return;
        }

        if (line.startsWith("- ")) {
          const value = line.slice(2).trim();
          if (!value) return;
          if (currentExtra) {
            currentExtra.items.push(value);
          } else {
            data.ingredients.push(value);
          }
          return;
        }

        const stepMatch = line.match(/^(\d+)\.\s*(.+)/);
        if (stepMatch) {
          data.steps.push(stepMatch[2]);
          currentExtra = null;
          return;
        }
      });

      return data;
    }

    escapeAndFormat(text) {
      return this.escapeHtml(text).replace(/\n/g, "<br/>");
    }

    escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    handleKeyDown(event) {
      if (event.key === "Escape") {
        if (this.recipeDrawerOpen) {
          event.preventDefault();
          this.setRecipeDrawerOpen(false);
          return;
        }
        if (this.cartOpen) {
          event.preventDefault();
          this.closeCart();
          return;
        }
        if (this.chatOpen) {
          event.preventDefault();
          this.closeChat();
        }
      }
    }

    initDebugHooks() {
      if (!this.debug) return;
      window.GREENEST_WIDGET_DEBUG = window.GREENEST_WIDGET_DEBUG || {};
      window.GREENEST_WIDGET_DEBUG.trackEvent = (eventName, extraParams) =>
        this.trackEvent(eventName, extraParams);
      window.GREENEST_WIDGET_DEBUG.pingBackend = () => this.pingBackend();
      window.GREENEST_WIDGET_DEBUG.getSessionId = () => this.sessionId;
      window.GREENEST_WIDGET_DEBUG.addProductsToCart = (products) =>
        this.addProductsToCart(products);
      window.GREENEST_WIDGET_DEBUG.getCart = () => this.cart;
      window.GREENEST_WIDGET_DEBUG.refreshCartRecipeCandidates = (productIds) =>
        this.refreshCartRecipeCandidates(productIds);
      window.GREENEST_WIDGET_DEBUG.getBannerState = () => {
        const ss = getSessionState();
        return {
          bannerElExists: Boolean(this.cartBannerEl),
          isVisible: this.isCartBannerVisible(),
          lastCandidatesCount: this.lastCandidatesCount,
          lastRecommendationSig: this.lastRecommendationSig || "",
          lastRecommendationHasItems: this.lastRecommendationHasItems,
          cartBannerSig: this.cartBannerSig || "",
          cartItemCount: this.getCartProductIds().length,
          recipesLoaded: this.recipes ? this.recipes.length : 0,
          externalCartHydrated: this.externalCartHydrated,
          dismissedSig: ss.dismissedSig || "",
          cooldownUntil: ss.cooldownUntil || 0,
          cooldownActive: Boolean(ss.cooldownUntil && Date.now() <= ss.cooldownUntil),
        };
      };
      window.GREENEST_WIDGET_DEBUG.forceBanner = () =>
        this.maybeShowCartBanner("force", { ignoreCooldown: true });
      window.GREENEST_WIDGET_API = window.GREENEST_WIDGET_API || {};
      window.GREENEST_WIDGET_API.addProductsToCart = (products) =>
        this.addProductsToCart(products);
      window.GREENEST_WIDGET_API.refreshCartRecipeCandidates = (productIds) =>
        this.refreshCartRecipeCandidates(productIds);
      window.GREENEST_WIDGET_DEBUG.getConfig = () => ({
        webAppUrl: this.webAppUrl,
        siteToken: this.siteToken,
        vendor: this.vendor,
        widgetVersion: this.widgetVersion,
        clientId: this.clientId,
        cartAdapterEnabled: Boolean(this.cartAdapter),
        cartAdapterMode: this.cartAdapterMode,
        showInternalCartUI: this.showInternalCartUI,
      });
      if (typeof window.GREENEST_WIDGET_DEBUG.updateStatus === "function") {
        window.GREENEST_WIDGET_DEBUG.updateStatus(this.lastTrackStatus);
      }
    }

    setDebugStatus(text) {
      this.lastTrackStatus = text || "";
      if (
        this.debug &&
        window.GREENEST_WIDGET_DEBUG &&
        typeof window.GREENEST_WIDGET_DEBUG.updateStatus === "function"
      ) {
        window.GREENEST_WIDGET_DEBUG.updateStatus(this.lastTrackStatus);
      }
    }

    makeRequestId(prefix = "req") {
      const safePrefix = String(prefix || "req")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "") || "req";
      return `${safePrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    resolveChatCartId() {
      if (this.chatCartId) return this.chatCartId;
      try {
        if (this.cartAdapter && typeof this.cartAdapter.getCartId === "function") {
          const maybeId = this.cartAdapter.getCartId();
          if (typeof maybeId === "string" && maybeId.trim()) return maybeId.trim();
        }
      } catch (_) {
        /* ignore */
      }
      try {
        if (window.Shopify && window.Shopify.cartToken) {
          return String(window.Shopify.cartToken || "").trim();
        }
      } catch (_) {
        /* ignore */
      }
      return "";
    }

    buildChatLogPayload(entry = {}) {
      const origin = window.location.origin || "";
      const errorMessage = String(entry.errorMessage || "").trim();
      const status = String(
        entry.status || (errorMessage ? "error" : "ok")
      )
        .trim()
        .toLowerCase();

      return {
        action: "chatlog",
        site_token: this.siteToken || "",
        request_id: String(entry.requestId || this.makeRequestId("req")).trim(),
        status: status || "ok",
        client_id: String(
          entry.clientId || this.chatClientId || this.clientId || ""
        ).trim(),
        session_id: this.sessionId,
        store_origin: String(
          entry.storeOrigin || this.chatStoreOrigin || origin
        ).trim(),
        cart_id: String(entry.cartId || this.resolveChatCartId() || "").trim(),
        user_message: String(entry.userMessage || ""),
        assistant_message: String(entry.assistantMessage || ""),
        error_message: errorMessage,
        page_url: window.location.href,
        origin: origin,
        referrer: document.referrer || "",
        user_agent: navigator.userAgent,
        vendor: this.vendor,
        widget_version: this.widgetVersion,
        added_to_cart: this.hasAddedToCart ? "yes" : "no",
      };
    }

    logChatMessage(entry = {}) {
      try {
        if (!this.enableChatLogging) return null;
        if (!this.webAppUrl) return null;

        const payload = this.buildChatLogPayload(entry);
        if (
          !payload.user_message &&
          !payload.assistant_message &&
          !payload.error_message
        ) {
          return null;
        }

        return fetch(this.webAppUrl, {
          method: "POST",
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch((error) => {
          if (this.debug) {
            console.warn("[GreenestWidget] chatlog failed", error);
          }
          return null;
        });
      } catch (error) {
        if (this.debug) {
          console.warn("[GreenestWidget] chatlog exception", error);
        }
        return null;
      }
    }

    trackEvent(eventName, extraParams = {}) {
      try {
        if (!this.webAppUrl) {
          console.warn("[GreenestWidget] Missing API URL; tracking skipped.");
          this.setDebugStatus(`tracking skipped: ${eventName}`);
          return null;
        }
        if (!this.siteToken) {
          console.warn("[GreenestWidget] Missing site token; tracking may fail.");
        }

        const params = new URLSearchParams();
        const requestId = String(
          extraParams.request_id ||
            extraParams.requestId ||
            this.makeRequestId("evt")
        ).trim();
        const status = String(extraParams.status || "ok").trim().toLowerCase();
        if (eventName === "cart_add" || eventName === "cart_add_confirmed") {
          this.hasAddedToCart = true;
        }
        const storeOrigin =
          this.chatStoreOrigin || window.location.origin || "";
        const cartId = this.resolveChatCartId();

        params.set("action", "track");
        params.set("request_id", requestId);
        params.set("event", eventName || "");
        params.set("status", status || "ok");
        params.set("client_id", this.clientId || "");
        params.set("site_token", this.siteToken || "");
        params.set("vendor", this.vendor);
        params.set("widget_version", this.widgetVersion);
        params.set("session_id", this.sessionId);
        params.set("store_origin", storeOrigin);
        if (cartId) params.set("cart_id", cartId);
        params.set("page_url", window.location.href);
        params.set("origin", window.location.origin);
        params.set("referrer", document.referrer || "");
        params.set("user_agent", navigator.userAgent);
        params.set("assisted", String(extraParams.assisted == null ? "" : extraParams.assisted));
        params.set("reason", String(extraParams.reason || ""));

        Object.keys(extraParams).forEach((key) => {
          if (
            key === "assisted" ||
            key === "reason" ||
            key === "request_id" ||
            key === "requestId" ||
            key === "status" ||
            key === "client_id" ||
            key === "clientId" ||
            key === "store_origin" ||
            key === "storeOrigin" ||
            key === "cart_id" ||
            key === "cartId"
          ) {
            return;
          }
          if (extraParams[key] === undefined || extraParams[key] === null) return;
          params.set(key, String(extraParams[key]));
        });

        const url = `${this.webAppUrl}?${params.toString()}`;
        if (this.debug) {
          console.log("[GreenestWidget] Tracking", eventName, url);
        }
        this.setDebugStatus(`tracking: ${eventName}`);
        return fetch(url, { method: "GET", keepalive: true })
          .then((response) => {
            this.setDebugStatus(`tracking: ${eventName} (${response.status})`);
            return response;
          })
          .catch((error) => {
            console.warn("[GreenestWidget] Tracking failed", error);
            this.setDebugStatus(`tracking failed: ${eventName}`);
            return null;
          });
      } catch (error) {
        console.warn("[GreenestWidget] Tracking exception", error);
        this.setDebugStatus(`tracking error: ${eventName}`);
        return null;
      }
    }

    pingBackend() {
      const url = `${this.webAppUrl}?action=ping`;
      return fetch(url, { method: "GET" })
        .then((response) =>
          response.text().then((text) => ({
            status: response.status,
            text,
          }))
        )
        .catch((error) => {
          console.warn("[GreenestWidget] Ping failed", error);
          return { status: "error", text: String(error) };
        });
    }

    showError(message) {
      if (this.errorEl) {
        this.errorEl.textContent = message || "";
      }
    }

    sanitizeRecipeLabel(label) {
      let cleaned = String(label || "").trim();
      if (!cleaned) return cleaned;
      cleaned = cleaned.replace(/^tahan teha\s+/i, "");
      cleaned = cleaned.replace(/\s*\((vegan|gluteenivaba)\)\s*$/i, "");
      cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
      return cleaned;
    }

    getRecipeDisplayLabel(recipe) {
      return this.sanitizeRecipeLabel(recipe && recipe.label ? recipe.label : "");
    }

    buildRecipeQuery(recipe, servings) {
      const raw = String(recipe && recipe.label ? recipe.label : "").trim();
      if (!raw) return "tahan teha";
      let query = raw;
      if (!/^tahan teha\b/i.test(raw)) {
        query = `tahan teha ${raw}`;
      }
      if (servings) {
        query += ` (${t("recipe_servings_suffix", { count: servings })})`;
      }
      return query;
    }

    appendRecipeOnlyNotice() {
      if (!this.messagesEl) return;
      const last = this.messagesEl.lastElementChild;
      if (last && last.dataset && last.dataset.recipeOnlyNotice === "1") {
        return;
      }
      const message = document.createElement("div");
      message.className = "greenest-message assistant";
      message.dataset.recipeOnlyNotice = "1";
      const bubble = document.createElement("div");
      bubble.className = "greenest-bubble assistant";
      const content = this.renderAssistantContent(RECIPE_ONLY_NOTICE);
      bubble.appendChild(content);
      message.appendChild(bubble);
      this.messagesEl.appendChild(message);
      this.scrollMessages();
      this.trackEvent("manual_recipe_blocked", {
        assisted: 0,
        reason: "recipe_only_mode",
      });
    }

    handleRecipeSelection(recipe) {
      this.setRecipeDrawerOpen(false);
      this.trackEvent("recipe_selected", {
        assisted: 1,
        reason: "recipe_bank",
        recipe_id: recipe.id,
        recipe_label: recipe.label,
      });
      this.showRecipePreviewConfirmation(recipe);
    }

    fetchRecipePreview(recipe, servings) {
      if (!this.webAppUrl) {
        return Promise.reject(new Error(t("error_missing_api")));
      }

      const query = this.buildRecipeQuery(recipe, servings);
      const payload = {
        query,
        recipeId: recipe.id,
        querySource: "recipe_bank",
        previewOnly: true,
      };

      return fetch(this.webAppUrl, {
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((response) => response.text().then((text) => ({ response, text })))
        .then(({ response, text }) => {
          let data;
          try {
            data = JSON.parse(text);
          } catch (_) {
            throw new Error(t("error_parse_json"));
          }

          if (!response.ok || data.ok === false) {
            throw new Error(
              data && data.error ? data.error : t("error_request_failed")
            );
          }

          const ingredientMatches = Array.isArray(data.ingredientMatches)
            ? data.ingredientMatches
            : [];
          const mainProducts = Array.isArray(data.mainProducts)
            ? data.mainProducts
            : [];
          const fallback = Array.isArray(data.coreProducts)
            ? data.coreProducts
            : [];

          const normalizePreviewProduct = (product, ingredientMeta) => {
            if (!product || typeof product !== "object") return null;
            const parsedAmount = this.parseIngredientAmount(
              ingredientMeta && ingredientMeta.amount
            );
            const qtyRaw =
              (ingredientMeta &&
                (ingredientMeta.qty_base ?? ingredientMeta.qtyBase)) ??
              product.qty_base ??
              product.qtyBase ??
              parsedAmount.qtyBase;
            const qtyNum = Number(qtyRaw);
            const qtyBase =
              Number.isFinite(qtyNum) && qtyNum > 0 ? qtyNum : null;
            const unit = String(
              (ingredientMeta && ingredientMeta.unit) ||
                product.unit ||
                product.qty_unit ||
                parsedAmount.unit ||
                ""
            ).trim();
            const id = String(
              product.product_id ||
                product.productId ||
                product.id ||
                product.sku ||
                (ingredientMeta && ingredientMeta.productId) ||
                ""
            ).trim();
            if (!id) return null;
            const required =
              ingredientMeta && ingredientMeta.required != null
                ? Boolean(ingredientMeta.required)
                : Boolean(product.required !== false);

            return {
              ...product,
              id,
              product_id: id,
              productId: id,
              qty_base: qtyBase,
              qtyBase,
              unit,
              qty_unit: unit || String(product.qty_unit || "").trim(),
              required,
              ingredientName: String(
                (ingredientMeta && ingredientMeta.ingredientName) ||
                  product.ingredientName ||
                  ""
              ).trim(),
            };
          };

          let products = mainProducts
            .map((product) => normalizePreviewProduct(product, null))
            .filter((product) => product && product.required !== false);
          const hasMainQty = products.some((product) => {
            const qty = Number(product.qty_base ?? product.qtyBase);
            return Number.isFinite(qty) && qty > 0;
          });

          if ((!products.length || !hasMainQty) && ingredientMatches.length) {
            const byId = {};
            ingredientMatches.forEach((match) => {
              if (!match || !match.product) return;
              const normalized = normalizePreviewProduct(match.product, match);
              if (!normalized || normalized.required === false) return;
              const key = normalized.id;
              if (!byId[key]) {
                byId[key] = normalized;
                return;
              }
              const existing = byId[key];
              const exQty = Number(existing.qty_base ?? existing.qtyBase);
              const inQty = Number(normalized.qty_base ?? normalized.qtyBase);
              const exUnit = String(existing.unit || existing.qty_unit || "").trim();
              const inUnit = String(normalized.unit || normalized.qty_unit || "").trim();
              if (
                Number.isFinite(exQty) &&
                exQty > 0 &&
                Number.isFinite(inQty) &&
                inQty > 0 &&
                exUnit === inUnit
              ) {
                existing.qty_base = exQty + inQty;
                existing.qtyBase = existing.qty_base;
              } else if (
                (!Number.isFinite(exQty) || exQty <= 0) &&
                Number.isFinite(inQty) &&
                inQty > 0
              ) {
                existing.qty_base = inQty;
                existing.qtyBase = inQty;
                existing.unit = inUnit;
                existing.qty_unit = inUnit;
              }
            });
            products = Object.values(byId);
          }

          if (!products.length) {
            products = fallback
              .map((product) => normalizePreviewProduct(product, null))
              .filter(Boolean);
          }
          const baseServings =
            Number(
              data.base_servings ||
                data.baseServings ||
                data.servings ||
                data.base_serving
            ) ||
            Number(recipe && recipe.baseServings) ||
            this.defaultServings;

          return {
            products,
            baseServings,
            assistantText: String(data.assistantText || data.message || "").trim(),
          };
        });
    }

    parseIngredientAmount(amountText) {
      const raw = String(amountText || "").trim();
      if (!raw) return { qtyBase: null, unit: "" };
      const match = raw.match(/^(\d+(?:[.,]\d+)?)(?:\s*(.*))?$/);
      if (!match) return { qtyBase: null, unit: "" };
      const qty = Number(String(match[1] || "").replace(",", "."));
      const unit = String(match[2] || "").trim();
      if (!Number.isFinite(qty) || qty <= 0) {
        return { qtyBase: null, unit };
      }
      return { qtyBase: qty, unit };
    }

    computeNeededQty(qtyBase, baseServings, targetServings) {
      const baseQty = Number(qtyBase);
      const base = Number(baseServings);
      const target = Number(targetServings);
      if (!Number.isFinite(baseQty) || baseQty <= 0) return null;
      if (!Number.isFinite(base) || base <= 0) return null;
      if (!Number.isFinite(target) || target <= 0) return null;
      return baseQty * (target / base);
    }

    normalizeUnit(value) {
      return String(value || "").trim().toLowerCase();
    }

    isPieceLikeUnit(unit) {
      const normalized = this.normalizeUnit(unit).replace(/\./g, "");
      if (!normalized) return false;
      const pieceUnits = [
        "tk",
        "tükk",
        "tükki",
        "tkd",
        "pcs",
        "pc",
        "piece",
        "pieces",
        "pack",
        "pakk",
        "pakki",
        "purk",
        "purki",
        "pudel",
        "pudelit",
        "karp",
        "karpi",
        "kott",
        "kotike",
        "can",
        "jar",
        "bottle",
        "clove",
        "küüs",
        "viil",
        "slice",
        "leht",
        "sheet",
      ];
      if (pieceUnits.indexOf(normalized) !== -1) return true;
      return /(tk|pcs?|piece|pack|pakk|purk|pudel|karp|kott)$/.test(normalized);
    }

    computeFallbackCartUnits(needed, unit, baseServings, targetServings) {
      if (needed === null) return null;
      if (this.isPieceLikeUnit(unit)) {
        return Math.max(1, Math.ceil(needed));
      }

      const base = Number(baseServings);
      const target = Number(targetServings);
      if (
        Number.isFinite(base) &&
        base > 0 &&
        Number.isFinite(target) &&
        target > 0
      ) {
        return Math.max(1, Math.ceil(target / base));
      }

      return 1;
    }

    clampRecipeCartUnits(units) {
      const n = Number(units);
      if (!Number.isFinite(n) || n <= 0) return null;
      return Math.max(1, Math.min(MAX_RECIPE_ITEM_QTY, Math.ceil(n)));
    }

    computeCartUnits(needed, unit, packSize, packUnit) {
      if (needed === null) return null;
      const size = Number(packSize);
      if (!Number.isFinite(size) || size <= 0) return null;
      const unitNorm = this.normalizeUnit(unit);
      const packUnitNorm = this.normalizeUnit(packUnit);
      if (!unitNorm || !packUnitNorm || unitNorm !== packUnitNorm) return null;
      return Math.max(1, Math.ceil(needed / size));
    }

    formatNeededQty(value) {
      if (!Number.isFinite(value)) return "";
      const rounded = Math.round(value * 100) / 100;
      return Number.isInteger(rounded) ? String(rounded) : String(rounded);
    }

    computeRecipeCartItems(products, baseServings, targetServings) {
      if (!Array.isArray(products) || !products.length) return [];
      return products.map((product) => {
        const name =
          product.name ||
          product.title ||
          product.productName ||
          t("product_fallback_name");
        const id = String(
          product.product_id ||
            product.productId ||
            product.id ||
            product.sku ||
            product.name ||
            product.title ||
            ""
        ).trim();
        const qtyBaseRaw = product.qty_base ?? product.qtyBase ?? product.qty;
        const unit = product.unit || product.qty_unit || product.unit_name || "";
        const packSize = product.pack_size ?? product.packSize ?? product.pack;
        const packUnit = product.pack_unit ?? product.packUnit ?? product.packUnitName;
        const qtyBaseNum = Number(qtyBaseRaw);
        const effectiveQtyBase =
          Number.isFinite(qtyBaseNum) && qtyBaseNum > 0 ? qtyBaseNum : 1;
        const needed = this.computeNeededQty(
          effectiveQtyBase,
          baseServings,
          targetServings
        );
        let cartUnits = this.computeCartUnits(needed, unit, packSize, packUnit);
        if (cartUnits === null && needed !== null) {
          cartUnits = this.computeFallbackCartUnits(
            needed,
            unit,
            baseServings,
            targetServings
          );
        }
        cartUnits = this.clampRecipeCartUnits(cartUnits);
        const price = Number(product.price || product.unit_price || 0);
        const alreadyInCart = id
          ? Number((this.cart.items.find((i) => i.id === id) || {}).qty || 0)
          : 0;
        const qtyToAdd = cartUnits !== null ? Math.max(0, cartUnits - alreadyInCart) : null;
        return {
          id,
          product_id: String(product.product_id || product.productId || id).trim() || id,
          productId: String(product.product_id || product.productId || id).trim() || id,
          name,
          needed,
          unit,
          cart_units: cartUnits,
          already_in_cart: alreadyInCart,
          qty_to_add: qtyToAdd,
          price: Number.isFinite(price) ? price : 0,
        };
      });
    }

    renderProductsSummary(containerEl, products) {
      if (!containerEl) return;
      containerEl.innerHTML = "";
      const list = document.createElement("ul");
      products.forEach((product) => {
        const item = document.createElement("li");
        if (product.cart_units === null) {
          item.textContent = `${product.name} — kogusandmed puuduvad`;
          item.style.opacity = "0.6";
        } else if (product.qty_to_add === 0) {
          const neededText = this.formatNeededQty(product.needed);
          item.textContent = `✓ ${product.name} — ${neededText}${product.unit} (juba korvis)`;
          item.style.opacity = "0.65";
        } else {
          const neededText = this.formatNeededQty(product.needed);
          const addText = product.already_in_cart > 0
            ? ` (+${product.qty_to_add} tk, korvis juba ${product.already_in_cart})`
            : ` (korvi: ${product.qty_to_add} tk)`;
          item.textContent = `${product.name} — ${neededText}${product.unit}${addText}`;
        }
        list.appendChild(item);
      });
      containerEl.appendChild(list);
    }

    showRecipePreviewConfirmation(recipe) {
      if (!this.messagesEl) return;
      const displayLabel = this.getRecipeDisplayLabel(recipe);
      const initialServings =
        Number(recipe && recipe.baseServings) || this.defaultServings;
      let targetServings = initialServings;
      let baseServings = initialServings;
      let previewProducts = [];
      let previewReady = false;
      let previewCartItems = [];
      let guideCopyText = "";

      const wrapper = document.createElement("div");
      wrapper.className = "greenest-message assistant";
      wrapper.dataset.recipeConfirm = "1";
      const bubble = document.createElement("div");
      bubble.className = "greenest-bubble assistant";

      const title = document.createElement("div");
      title.className = "greenest-confirm-title";
      title.textContent = t("confirm_title", { name: displayLabel });
      bubble.appendChild(title);

      const recipeGuide = document.createElement("div");
      recipeGuide.className = "greenest-confirm-guide";
      bubble.appendChild(recipeGuide);

      const copyGuideBtn = document.createElement("button");
      copyGuideBtn.type = "button";
      copyGuideBtn.className = "greenest-confirm-copy";
      copyGuideBtn.textContent = t("confirm_copy_guide_btn");
      copyGuideBtn.hidden = true;
      bubble.appendChild(copyGuideBtn);

      const servingsRow = document.createElement("div");
      servingsRow.className = "greenest-servings-row";
      const servingsLabel = document.createElement("span");
      servingsLabel.textContent = t("confirm_servings_label");
      servingsRow.appendChild(servingsLabel);

      const servingsControls = document.createElement("div");
      servingsControls.className = "greenest-servings-controls";
      const chipValues = [2, 4, 6];
      const chips = chipValues.map((value) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "greenest-servings-chip";
        chip.textContent = String(value);
        chip.dataset.value = String(value);
        servingsControls.appendChild(chip);
        return chip;
      });

      const servingsInput = document.createElement("input");
      servingsInput.type = "number";
      servingsInput.className = "greenest-servings-input";
      servingsInput.min = "1";
      servingsInput.step = "1";
      servingsInput.value = String(targetServings);
      servingsControls.appendChild(servingsInput);
      servingsRow.appendChild(servingsControls);
      bubble.appendChild(servingsRow);

      const status = document.createElement("div");
      status.className = "greenest-confirm-status";
      status.textContent = t("preview_loading");
      bubble.appendChild(status);

      const productsContainer = document.createElement("div");
      productsContainer.className = "greenest-confirm-products";
      bubble.appendChild(productsContainer);

      const productsNote = document.createElement("div");
      productsNote.className = "greenest-confirm-note";
      productsNote.textContent = t("confirm_products_note");
      productsNote.hidden = true;
      bubble.appendChild(productsNote);

      const actions = document.createElement("div");
      actions.className = "greenest-confirm-actions";

      const confirmBtn = document.createElement("button");
      confirmBtn.type = "button";
      confirmBtn.className = "greenest-confirm-primary";
      confirmBtn.textContent = t("confirm_add_btn");
      confirmBtn.disabled = true;

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "greenest-confirm-secondary";
      cancelBtn.textContent = t("confirm_cancel_btn");

      actions.appendChild(confirmBtn);
      actions.appendChild(cancelBtn);
      bubble.appendChild(actions);
      wrapper.appendChild(bubble);
      this.messagesEl.appendChild(wrapper);
      this.scrollMessages();

      this.trackEvent("cart_add_confirm_shown", {
        assisted: 1,
        reason: "recipe_bank",
        recipe_id: recipe.id,
        recipe_label: recipe.label,
      });

      confirmBtn.addEventListener("click", () => {
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;
        const cartItems = previewCartItems.filter(
          (item) => item.qty_to_add !== null && item.qty_to_add > 0
        );
        const addedCount = this.addProductsToCart(
          cartItems.map((item) => ({
            id: item.id,
            product_id: item.product_id || item.productId || item.id,
            productId: item.product_id || item.productId || item.id,
            name: item.name,
            qty: item.qty_to_add,
            price: item.price,
          }))
        );
        if (addedCount > 0) {
          this.notifyCartAddition(addedCount);
        }
        const missingDataCount = previewCartItems.filter(
          (item) => item.cart_units === null
        ).length;
        this.trackEvent("cart_add", {
          assisted: 1,
          reason: "recipe_bank",
          recipe_id: recipe.id,
          recipe_label: recipe.label,
          servings: targetServings,
          items_added: addedCount,
          item_count: cartItems.length,
          missing_data_count: missingDataCount || undefined,
        });
        this.trackEvent("cart_add_confirmed", {
          assisted: 1,
          reason: "recipe_bank",
          recipe_id: recipe.id,
          recipe_label: recipe.label,
        });
      });

      cancelBtn.addEventListener("click", () => {
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;
        this.trackEvent("cart_add_cancelled", {
          assisted: 1,
          reason: "recipe_bank",
          recipe_id: recipe.id,
          recipe_label: recipe.label,
        });
        this.appendMessage("assistant", t("confirm_cancelled_message"));
      });

      copyGuideBtn.addEventListener("click", () => {
        const textToCopy = String(guideCopyText || recipeGuide.textContent || "").trim();
        if (!textToCopy) return;
        const defaultLabel = t("confirm_copy_guide_btn");
        copyGuideBtn.disabled = true;
        this.copyTextToClipboard(textToCopy)
          .then(() => {
            copyGuideBtn.textContent = t("confirm_copy_done");
            this.trackEvent("guide_text_copied", {
              assisted: 1,
              reason: "recipe_bank",
              recipe_id: recipe.id,
              recipe_label: recipe.label,
            });
          })
          .catch(() => {
            copyGuideBtn.textContent = t("confirm_copy_failed");
          })
          .finally(() => {
            window.setTimeout(() => {
              copyGuideBtn.textContent = defaultLabel;
              copyGuideBtn.disabled = false;
            }, 1400);
          });
      });

      const updateChipStates = () => {
        chips.forEach((chip) => {
          const value = Number(chip.dataset.value);
          chip.classList.toggle("is-active", value === targetServings);
        });
      };

      const updateProductsList = () => {
        if (!previewReady) return;
        previewCartItems = this.computeRecipeCartItems(
          previewProducts,
          baseServings,
          targetServings
        );
        this.renderProductsSummary(productsContainer, previewCartItems);
        productsNote.hidden = previewCartItems.length === 0;
        const hasAddable = previewCartItems.some(
          (item) => item.qty_to_add !== null && item.qty_to_add > 0
        );
        confirmBtn.disabled = !hasAddable;
      };

      const setTargetServings = (value) => {
        const next = Number(value);
        if (!Number.isFinite(next) || next <= 0) return;
        targetServings = next;
        servingsInput.value = String(targetServings);
        updateChipStates();
        updateProductsList();
      };

      chips.forEach((chip) => {
        chip.addEventListener("click", () => {
          setTargetServings(Number(chip.dataset.value));
        });
      });

      servingsInput.addEventListener("change", () => {
        setTargetServings(Number(servingsInput.value));
      });

      updateChipStates();

      const loadPreview = () => {
        status.textContent = t("preview_loading");
        confirmBtn.disabled = true;
        previewReady = false;
        productsNote.hidden = true;
        this.fetchRecipePreview(recipe, targetServings)
          .then((result) => {
            previewProducts = Array.isArray(result.products) ? result.products : [];
            baseServings =
              Number(result.baseServings) || baseServings || this.defaultServings;
            guideCopyText = String(result.assistantText || "").trim();
            if (result.assistantText) {
              recipeGuide.innerHTML = "";
              recipeGuide.appendChild(this.renderAssistantContent(result.assistantText));
            }
            copyGuideBtn.hidden = !guideCopyText;
            previewReady = true;
            status.textContent = "";
            updateProductsList();
          })
          .catch((error) => {
            console.error(error);
            previewReady = false;
            confirmBtn.disabled = true;
            productsNote.hidden = true;
            guideCopyText = "";
            copyGuideBtn.hidden = true;
            const retry = document.createElement("button");
            retry.type = "button";
            retry.className = "greenest-confirm-retry";
            retry.textContent = t("preview_retry");
            retry.addEventListener("click", () => {
              status.innerHTML = "";
              loadPreview();
            });
            status.innerHTML = "";
            status.appendChild(document.createTextNode(t("preview_error")));
            status.appendChild(retry);
          });
      };

      loadPreview();
    }

    copyTextToClipboard(text) {
      const value = String(text || "").trim();
      if (!value) return Promise.reject(new Error("empty_copy_text"));
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        return navigator.clipboard.writeText(value);
      }
      return new Promise((resolve, reject) => {
        try {
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.setAttribute("readonly", "readonly");
          ta.style.position = "fixed";
          ta.style.top = "-9999px";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          const ok = document.execCommand("copy");
          ta.remove();
          if (ok) resolve();
          else reject(new Error("exec_copy_failed"));
        } catch (err) {
          reject(err);
        }
      });
    }

    getCartAdapterMethod(methodNames) {
      if (!this.cartAdapter || !Array.isArray(methodNames)) return null;
      for (let i = 0; i < methodNames.length; i += 1) {
        const methodName = methodNames[i];
        if (!methodName) continue;
        const maybeFn = this.cartAdapter[methodName];
        if (typeof maybeFn === "function") {
          return {
            name: methodName,
            fn: maybeFn.bind(this.cartAdapter),
          };
        }
      }
      return null;
    }

    getCartSnapshotItems() {
      if (!this.cart || !Array.isArray(this.cart.items)) return [];
      return this.cart.items
        .map((item) => this.toCartAdapterItem(item))
        .filter(Boolean);
    }

    normalizeCartItemsForWidget(items) {
      const rows = Array.isArray(items) ? items : [];
      const outById = {};
      rows.forEach((row) => {
        if (!row || typeof row !== "object") return;
        const productId = String(
          pickGreenestProductId(row) || row.id || row.productId || row.sku || ""
        ).trim();
        if (!productId) return;
        const qtyRaw = Number(row.qty || row.quantity || row.count || row.amount || 0);
        const qty = Number.isFinite(qtyRaw) ? Math.round(qtyRaw) : 0;
        if (qty <= 0) return;
        const priceRaw = Number(
          row.price ||
            row.unit_price ||
            row.unitPrice ||
            row.price_to_view ||
            row.price_checkout ||
            0
        );
        const price = Number.isFinite(priceRaw) ? priceRaw : 0;
        const name = String(
          row.name || row.title || row.productName || row.label || t("product_fallback_name")
        ).trim();
        const sku = String(
          row.sku || row.productSku || row.product_sku || productId
        ).trim();

        if (!outById[productId]) {
          outById[productId] = {
            id: productId,
            product_id: productId,
            productId: productId,
            sku: sku || productId,
            name: name || t("product_fallback_name"),
            qty,
            price,
          };
          return;
        }

        const existing = outById[productId];
        existing.qty += qty;
        if (price > 0) existing.price = price;
        if ((!existing.name || existing.name === t("product_fallback_name")) && name) {
          existing.name = name;
        }
      });
      return Object.keys(outById).map((id) => outById[id]);
    }

    extractCartItemsFromAdapterResult(result) {
      if (Array.isArray(result)) return result;
      if (!result || typeof result !== "object") return [];
      if (Array.isArray(result.items)) return result.items;
      if (result.data && Array.isArray(result.data.items)) return result.data.items;
      if (result.data && result.data.cart && Array.isArray(result.data.cart.items)) {
        return result.data.cart.items;
      }
      return [];
    }

    applyExternalCartSnapshot(items, reason) {
      const normalized = this.normalizeCartItemsForWidget(items);
      this.cart = { items: normalized };
      if (this.showInternalCartUI) {
        this.saveCart();
      }
      this.updateCartUI();
      this.externalCartHydrated = true;
      this.refreshCartRecipeCandidates()
        .then(() => this.maybeShowCartBanner(reason || "adapter_sync", { ignoreCooldown: true }))
        .catch(() => {
          /* ignore */
        });
    }

    loadExternalCartSnapshot() {
      if (!this.cartAdapter) return;
      const method = this.getCartAdapterMethod([
        "getCartItems",
        "listItems",
        "getItems",
        "listCartItems",
      ]);
      if (!method) return;

      const context = this.buildCartAdapterContext("load_cart_snapshot", {
        itemCount: this.cart.items.length,
      });

      try {
        const result = method.fn(context, context);
        if (result && typeof result.then === "function") {
          result
            .then((payload) => {
              const items = this.extractCartItemsFromAdapterResult(payload);
              this.applyExternalCartSnapshot(items, "adapter_hydrate");
            })
            .catch((error) => this.reportCartAdapterError("get_cart_items", error));
          return;
        }
        const items = this.extractCartItemsFromAdapterResult(result);
        this.applyExternalCartSnapshot(items, "adapter_hydrate");
      } catch (error) {
        this.reportCartAdapterError("get_cart_items", error);
      }
    }

    buildCartAdapterContext(action, extraParams = {}) {
      return {
        action: String(action || ""),
        sessionId: this.sessionId,
        vendor: this.vendor,
        widgetVersion: this.widgetVersion,
        pageUrl: window.location.href,
        origin: window.location.origin,
        timestamp: new Date().toISOString(),
        cart: {
          items: this.getCartSnapshotItems(),
        },
        ...extraParams,
      };
    }

    toCartAdapterItem(item) {
      if (!item) return null;
      const productId = String(
        pickGreenestProductId(item) || item.id || item.productId || item.sku || ""
      ).trim();
      if (!productId) return null;
      const qty = Number(item.qty || item.quantity || 1);
      if (!Number.isFinite(qty) || qty <= 0) return null;
      const price = Number(item.price || item.unit_price || 0);
      const safePrice = Number.isFinite(price) ? price : 0;
      const name = String(item.name || item.title || item.productName || "").trim();
      const sku = String(
        item.sku || item.productSku || item.product_sku || productId
      ).trim();
      return {
        id: productId,
        sku: sku || productId,
        product_id: productId,
        productId: productId,
        name,
        qty,
        quantity: qty,
        unit_price: safePrice,
        price: safePrice,
      };
    }

    asAdapterBatchPayload(items, context) {
      const normalized = Array.isArray(items)
        ? items.map((item) => this.toCartAdapterItem(item)).filter(Boolean)
        : [];
      normalized.items = normalized;
      normalized.context = context;
      normalized.sessionId = context.sessionId;
      normalized.vendor = context.vendor;
      normalized.widgetVersion = context.widgetVersion;
      normalized.action = context.action;
      return normalized;
    }

    reportCartAdapterError(actionLabel, error) {
      const message =
        error && error.message ? String(error.message) : String(error || "Unknown");
      console.warn(`[GreenestWidget] cartAdapter ${actionLabel} failed`, error);
      this.trackEvent("cart_adapter_error", {
        assisted: 0,
        reason: actionLabel,
        adapter_action: actionLabel,
        error: message.slice(0, 180),
      });
    }

    handleAdapterResult(result, actionLabel) {
      if (!result || typeof result.then !== "function") return;
      result.catch((error) => this.reportCartAdapterError(actionLabel, error));
    }

    callCartAdapterMethod(methodNames, primaryArg, secondaryArg, actionLabel) {
      const method = this.getCartAdapterMethod(methodNames);
      if (!method) return false;
      try {
        const result = method.fn(primaryArg, secondaryArg);
        this.handleAdapterResult(result, actionLabel || method.name);
        return true;
      } catch (error) {
        this.reportCartAdapterError(actionLabel || method.name, error);
        return false;
      }
    }

    syncAddToExternalCart(items, actionReason) {
      if (!Array.isArray(items) || !items.length) return false;
      const context = this.buildCartAdapterContext(actionReason, {
        itemCount: items.length,
      });
      const payload = this.asAdapterBatchPayload(items, context);
      if (!payload.length) return false;

      const batchHandled = this.callCartAdapterMethod(
        ["addItems", "addToCart", "addProducts", "addLineItems", "add"],
        payload,
        context,
        "add_items"
      );
      if (batchHandled) return true;

      const single = this.getCartAdapterMethod([
        "addItem",
        "addProduct",
        "addLineItem",
      ]);
      if (!single) return false;

      payload.forEach((entry) => {
        const singlePayload = {
          ...entry,
          item: entry,
          context,
        };
        try {
          const result = single.fn(singlePayload, context);
          this.handleAdapterResult(result, "add_item");
        } catch (error) {
          this.reportCartAdapterError("add_item", error);
        }
      });
      return true;
    }

    syncQtyToExternalCart(item, actionReason) {
      const normalized = this.toCartAdapterItem(item);
      if (!normalized) return false;
      const context = this.buildCartAdapterContext(actionReason, {
        itemCount: this.cart.items.length,
      });
      const payload = {
        ...normalized,
        item: normalized,
        context,
      };
      return this.callCartAdapterMethod(
        [
          "updateItem",
          "updateQuantity",
          "setItemQuantity",
          "setQuantity",
          "setQty",
        ],
        payload,
        context,
        "update_item"
      );
    }

    syncRemoveFromExternalCart(itemId, actionReason) {
      const id = String(itemId || "").trim();
      if (!id) return false;
      const context = this.buildCartAdapterContext(actionReason, {
        itemCount: this.cart.items.length,
      });
      const payload = {
        id,
        itemId: id,
        sku: id,
        product_id: id,
        productId: id,
        context,
      };
      return this.callCartAdapterMethod(
        ["removeItem", "removeFromCart", "remove", "deleteItem"],
        payload,
        context,
        "remove_item"
      );
    }

    syncEmptyExternalCart(actionReason) {
      const context = this.buildCartAdapterContext(actionReason, { itemCount: 0 });
      return this.callCartAdapterMethod(
        ["clearCart", "emptyCart", "clear", "reset"],
        context,
        context,
        "clear_cart"
      );
    }

    getAdapterCheckoutUrl() {
      if (!this.cartAdapter) return "";
      if (typeof this.cartAdapter.checkoutUrl === "string") {
        return this.cartAdapter.checkoutUrl;
      }
      if (typeof this.cartAdapter.url === "string") {
        return this.cartAdapter.url;
      }
      const method = this.getCartAdapterMethod(["getCheckoutUrl", "checkoutUrl"]);
      if (!method) return "";

      const context = this.buildCartAdapterContext("checkout_url", {
        itemCount: this.cart.items.length,
      });
      const payload = this.asAdapterBatchPayload(this.cart.items, context);
      try {
        const result = method.fn(payload, context);
        if (typeof result === "string" && result.trim()) {
          return result.trim();
        }
        this.handleAdapterResult(result, "checkout_url");
      } catch (error) {
        this.reportCartAdapterError("checkout_url", error);
      }
      return "";
    }

    handleAdapterCheckout(actionReason, event) {
      const context = this.buildCartAdapterContext(actionReason, {
        itemCount: this.cart.items.length,
      });
      const payload = this.asAdapterBatchPayload(this.cart.items, context);
      const handled =
        this.callCartAdapterMethod(
          ["checkout", "beginCheckout", "goToCheckout"],
          payload,
          context,
          "checkout"
        ) ||
        this.callCartAdapterMethod(
          ["openCart", "open", "showCart"],
          payload,
          context,
          "open_cart"
        );
      if (handled && event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      return handled;
    }

    openExternalCart(actionReason) {
      const context = this.buildCartAdapterContext(actionReason, {
        itemCount: this.cart.items.length,
      });
      const payload = this.asAdapterBatchPayload(this.cart.items, context);
      return (
        this.callCartAdapterMethod(
          ["openCart", "open", "showCart"],
          payload,
          context,
          "open_cart"
        ) ||
        this.callCartAdapterMethod(
          ["checkout", "beginCheckout", "goToCheckout"],
          payload,
          context,
          "checkout"
        )
      );
    }

    loadCart() {
      try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return { items: [] };
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.items)) {
          return { items: [] };
        }
        return {
          items: parsed.items.filter((item) => item && item.id && item.qty > 0),
        };
      } catch (error) {
        return { items: [] };
      }
    }

    saveCart() {
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      } catch (error) {
        /* ignore */
      }
    }

    addProductsToCart(products) {
      if (!Array.isArray(products) || !products.length) return 0;
      let addedCount = 0;
      const addedItems = [];
      products.forEach((product) => {
        const id = String(
          product.product_id ||
            product.productId ||
            product.id ||
            product.sku ||
            product.name ||
            product.title ||
            ""
        ).trim();
        if (!id) return;
        const productId = String(product.product_id || product.productId || id).trim() || id;
        const sku = String(
          product.sku || product.productSku || product.product_sku || productId
        ).trim();
        const name = product.name || product.title || product.productName || "Nimetu toode";
        const qty = Number(product.qty || product.quantity || 1);
        if (!Number.isFinite(qty) || qty <= 0) return;
        const price = Number(product.price || product.unit_price || 0);
        const safePrice = Number.isFinite(price) ? price : 0;
        const existing = this.cart.items.find((item) => item.id === productId);
        if (existing) {
          existing.qty += qty;
          existing.product_id = existing.product_id || productId;
          existing.productId = existing.productId || productId;
          existing.sku = existing.sku || sku || productId;
          if (safePrice > 0) {
            existing.price = safePrice;
          }
        } else {
          this.cart.items.push({
            id: productId,
            product_id: productId,
            productId: productId,
            sku: sku || productId,
            name,
            qty,
            price: safePrice,
          });
        }
        addedItems.push({
          id: productId,
          product_id: productId,
          productId: productId,
          sku: sku || productId,
          name,
          qty,
          price: safePrice,
        });
        addedCount += qty;
      });

      if (addedCount > 0) {
        if (this.showInternalCartUI) {
          this.saveCart();
        }
        this.updateCartUI();
        this.syncAddToExternalCart(addedItems, "add_items");
        this.refreshCartRecipeCandidates()
          .then(() => {
            this.maybeShowCartBanner("cart_add", { ignoreCooldown: true });
          })
          .catch(() => {
            /* ignore */
          });
      }
      return addedCount;
    }

    changeQty(id, delta) {
      const item = this.cart.items.find((entry) => entry.id === id);
      if (!item) return;
      item.qty += delta;
      const isRemoved = item.qty <= 0;
      if (item.qty <= 0) {
        this.cart.items = this.cart.items.filter((entry) => entry.id !== id);
      }
      if (this.showInternalCartUI) {
        this.saveCart();
      }
      this.updateCartUI();
      if (isRemoved) {
        this.syncRemoveFromExternalCart(id, "remove_item");
      } else {
        this.syncQtyToExternalCart(item, "update_item");
      }
    }

    removeItem(id) {
      const exists = this.cart.items.some((entry) => entry.id === id);
      if (!exists) return;
      this.cart.items = this.cart.items.filter((entry) => entry.id !== id);
      if (this.showInternalCartUI) {
        this.saveCart();
      }
      this.updateCartUI();
      this.syncRemoveFromExternalCart(id, "remove_item");
    }

    emptyCart() {
      if (!this.cart.items.length) return;
      this.cart.items = [];
      if (this.showInternalCartUI) {
        this.saveCart();
      }
      this.updateCartUI();
      this.syncEmptyExternalCart("clear_cart");
    }

    addCartBadge(button) {
      const badge = document.createElement("span");
      badge.className = "greenest-cart-badge";
      badge.textContent = "0";
      button.appendChild(badge);
      this.cartBadgeEls.push(badge);
    }

    updateCartBadges() {
      const count = this.cart.items.reduce((sum, item) => sum + (item.qty || 0), 0);
      this.cartBadgeEls.forEach((badge) => {
        badge.textContent = String(count);
        badge.hidden = count === 0;
      });
    }

    updateCartUI() {
      this.renderCartItems();
      this.updateCartBadges();
      if (this.cartCheckoutLink) {
        this.cartCheckoutLink.href = this.getCheckoutUrl();
      }
    }

    renderCartItems() {
      if (!this.cartItemsEl) return;
      this.cartItemsEl.innerHTML = "";
      if (!this.cart.items.length) {
        const empty = document.createElement("div");
        empty.className = "greenest-cart-empty-state";
        empty.textContent = t("cart_empty");
        this.cartItemsEl.appendChild(empty);
        if (this.cartTotalEl) {
          this.cartTotalEl.textContent = this.formatPrice(0);
        }
        if (this.cartEmptyBtn) {
          this.cartEmptyBtn.disabled = true;
        }
        return;
      }

      if (this.cartEmptyBtn) {
        this.cartEmptyBtn.disabled = false;
      }

      let total = 0;
      this.cart.items.forEach((item) => {
        total += (item.price || 0) * (item.qty || 0);
        this.cartItemsEl.appendChild(this.createCartItemRow(item));
      });

      if (this.cartTotalEl) {
        this.cartTotalEl.textContent = this.formatPrice(total);
      }
    }

    createCartItemRow(item) {
      const row = document.createElement("div");
      row.className = "greenest-cart-item";
      row.dataset.itemId = item.id;

      const info = document.createElement("div");
      info.className = "greenest-cart-item-info";
      const name = document.createElement("div");
      name.className = "greenest-cart-item-name";
      name.textContent = item.name;
      info.appendChild(name);
      const price = document.createElement("div");
      price.className = "greenest-cart-item-price";
      price.textContent = this.formatPrice((item.price || 0) * (item.qty || 0));
      info.appendChild(price);
      row.appendChild(info);

      const qty = document.createElement("div");
      qty.className = "greenest-cart-item-qty";
      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "greenest-cart-qty-btn";
      minus.textContent = "-";
      minus.addEventListener("click", () => this.changeQty(item.id, -1));
      const value = document.createElement("span");
      value.className = "greenest-cart-qty-value";
      value.textContent = String(item.qty);
      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "greenest-cart-qty-btn";
      plus.textContent = "+";
      plus.addEventListener("click", () => this.changeQty(item.id, 1));
      qty.appendChild(minus);
      qty.appendChild(value);
      qty.appendChild(plus);
      row.appendChild(qty);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "greenest-cart-remove";
      remove.textContent = t("cart_remove_btn");
      remove.addEventListener("click", () => this.removeItem(item.id));
      row.appendChild(remove);

      return row;
    }

    openCart(trigger) {
      if (!this.showInternalCartUI) {
        const opened = this.openExternalCart(trigger || "ui");
        if (opened) {
          this.trackEvent("cart_opened", { assisted: 0, reason: "adapter" });
        }
        return;
      }
      if (
        this.cartAdapter &&
        this.cartAdapterMode === "external" &&
        this.openExternalCart(trigger || "ui")
      ) {
        this.trackEvent("cart_opened", { assisted: 0, reason: "adapter" });
        return;
      }
      if (!this.cartOverlay) return;
      if (this.cartOpen) return;
      this.cartOpen = true;
      this.lastCartFocus = document.activeElement;
      this.bodyOverflow = document.body.style.overflow || "";
      document.body.style.overflow = "hidden";
      this.cartOverlay.hidden = false;
      this.cartOverlay.setAttribute("aria-hidden", "false");
      this.updateCartUI();
      requestAnimationFrame(() => {
        if (!this.cartOpen) return;
        this.cartOverlay.classList.add("is-open");
        const closeBtn = this.cartOverlay.querySelector(".greenest-cart-close");
        if (closeBtn) {
          closeBtn.focus();
        }
      });
      this.trackEvent("cart_opened", { assisted: 0, reason: trigger || "ui" });
    }

    closeCart() {
      if (!this.cartOverlay || !this.cartOpen) return;
      this.cartOpen = false;
      this.cartOverlay.classList.remove("is-open");
      this.cartOverlay.setAttribute("aria-hidden", "true");
      const restoreFocus = this.lastCartFocus;
      window.setTimeout(() => {
        if (this.cartOpen) return;
        this.cartOverlay.hidden = true;
        document.body.style.overflow = this.bodyOverflow;
        if (restoreFocus && typeof restoreFocus.focus === "function") {
          restoreFocus.focus();
        }
      }, 220);
    }

    getCheckoutUrl() {
      const adapterUrl = this.getAdapterCheckoutUrl();
      const base = adapterUrl || GREENEST_CHECKOUT_URL || DEFAULT_CHECKOUT_URL;
      try {
        const url = new URL(base, window.location.href);
        url.searchParams.set("gw_session_id", this.sessionId);
        url.searchParams.set("gw_vendor", this.vendor);
        url.searchParams.set("gw_widget_version", this.widgetVersion);
        return url.toString();
      } catch (error) {
        return base;
      }
    }

    formatPrice(value) {
      const amount = Number.isFinite(value) ? value : 0;
      return `€${amount.toFixed(2)}`;
    }

    // ── Cart banner & recipe candidates ──────────────────────────────────────

    createCartBanner() {
      const banner = document.createElement("div");
      banner.className = "greenest-cart-banner";
      banner.hidden = true;

      const content = document.createElement("div");
      content.className = "greenest-cart-banner-content";

      const text = document.createElement("span");
      text.className = "greenest-cart-banner-text";
      text.textContent = t("cart_banner_text", { count: 0 });
      content.appendChild(text);

      const link = document.createElement("a");
      link.className = "greenest-cart-banner-link";
      link.textContent = t("cart_banner_cta");
      link.href = "#";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.handleCartBannerClick();
      });
      content.appendChild(link);
      banner.appendChild(content);

      const close = document.createElement("button");
      close.type = "button";
      close.className = "greenest-cart-banner-close";
      close.setAttribute("aria-label", t("close_notice_label"));
      close.textContent = "✕";
      close.addEventListener("click", () => this.dismissCartBanner());
      banner.appendChild(close);

      this.cartBannerEl = banner;
      return banner;
    }

    isCartBannerVisible() {
      return this.cartBannerEl && this.cartBannerEl.classList.contains("is-visible");
    }

    showCartBanner(signature) {
      if (!this.cartBannerEl || !signature) return;
      if (this.cartBannerHideTimer) {
        window.clearTimeout(this.cartBannerHideTimer);
        this.cartBannerHideTimer = null;
      }
      const count = this.lastCandidatesCount || 0;
      const textEl = this.cartBannerEl.querySelector(".greenest-cart-banner-text");
      if (textEl) {
        textEl.textContent = t("cart_banner_text", { count });
      }
      this.cartBannerSig = signature;
      this.cartBannerEl.hidden = false;
      requestAnimationFrame(() => {
        if (!this.cartBannerEl) return;
        this.cartBannerEl.classList.add("is-visible");
      });
      setSessionState({ lastSeenSig: signature });
    }

    hideCartBanner(immediate = false) {
      if (!this.cartBannerEl) return;
      if (this.cartBannerHideTimer) {
        window.clearTimeout(this.cartBannerHideTimer);
        this.cartBannerHideTimer = null;
      }
      if (immediate) {
        this.cartBannerEl.classList.remove("is-visible");
        this.cartBannerEl.hidden = true;
        return;
      }
      this.cartBannerEl.classList.remove("is-visible");
      this.cartBannerHideTimer = window.setTimeout(() => {
        if (!this.cartBannerEl) return;
        this.cartBannerEl.hidden = true;
      }, 240);
    }

    dismissCartBanner() {
      if (this.cartBannerSig) {
        setSessionState({ dismissedSig: this.cartBannerSig });
        this.trackEvent("cart_banner_dismissed", { assisted: 0, reason: "banner" });
      }
      this.hideCartBanner(true);
    }

    setBannerCooldown(ms) {
      const duration = Number(ms);
      if (!Number.isFinite(duration) || duration <= 0) return;
      setSessionState({ cooldownUntil: Date.now() + duration });
    }

    maybeShowCartBanner(reason, options = {}) {
      console.log("[Greenest] maybeShowCartBanner called, reason:", reason, "lastCandidatesCount:", this.lastCandidatesCount, "lastRecommendationSig:", this.lastRecommendationSig);
      if (!this.cartBannerEl) {
        console.log("[Greenest] maybeShowCartBanner - no cartBannerEl");
        return;
      }
      const signature = String(this.lastRecommendationSig || "");
      if (!signature || !this.lastRecommendationHasItems) {
        console.log("[Greenest] maybeShowCartBanner - no signature or no hasItems, signature:", signature, "hasItems:", this.lastRecommendationHasItems);
        this.hideCartBanner();
        return;
      }
      if (!this.lastCandidatesCount || this.lastCandidatesCount <= 0) {
        console.log("[Greenest] maybeShowCartBanner - no candidatesCount:", this.lastCandidatesCount);
        this.hideCartBanner();
        return;
      }
      if (this.cartBannerSig === signature && this.isCartBannerVisible()) {
        console.log("[Greenest] maybeShowCartBanner - already visible with same sig");
        return;
      }
      const state = getSessionState();
      const now = Date.now();
      if (!options.ignoreCooldown && state.cooldownUntil && now <= state.cooldownUntil) {
        console.log("[Greenest] maybeShowCartBanner - cooldown active");
        this.hideCartBanner();
        return;
      }
      if (signature === state.dismissedSig) {
        console.log("[Greenest] maybeShowCartBanner - signature was dismissed");
        this.hideCartBanner();
        return;
      }
      console.log("[Greenest] maybeShowCartBanner - SHOWING BANNER!");
      this.showCartBanner(signature);
    }

    handleCartBannerClick() {
      console.log("[Greenest] handleCartBannerClick - start");
      const sig = this.cartBannerSig || "";
      this.openChat();
      console.log("[Greenest] handleCartBannerClick - after openChat");
      this.hideCartBanner(true);
      console.log("[Greenest] handleCartBannerClick - after hideCartBanner");
      if (sig && this.hasSystemMessage("cart_recipe_candidates", sig)) return;
      this.trackEvent("cart_banner_opened", { assisted: 0, reason: "banner" });
      const productIds = this.getCartProductIds();
      console.log("[Greenest] handleCartBannerClick - productIds:", productIds);
      if (sig) {
        this.injectSystemMessage("cart_recipe_candidates", [], { sig, loading: true });
      }
      console.log("[Greenest] handleCartBannerClick - about to call fetch");
      this.fetchCartRecipeCandidates(productIds, 20).then((candidates) => {
        console.log("[Greenest] handleCartBannerClick - fetch returned:", candidates.length);
        // If API returns empty, use fallback from loaded recipes
        if (!candidates.length) {
          console.log("[Greenest] API returned no candidates, checking local recipes");
          candidates = this._getFallbackRecipesFromCart(productIds);
        }
        if (!candidates.length) {
          // No recipes found, update loading to show empty state
          if (sig) {
            this.updateCartCandidatesMessage(sig, []);
          }
          return;
        }
        if (sig) {
          this.updateCartCandidatesMessage(sig, candidates);
        } else {
          this.injectSystemMessage("cart_recipe_candidates", candidates, {
            sig: makeCartSignature(this.cart.items),
          });
        }
      });
    }

    _getFallbackRecipesFromCart(cartProductIds) {
      if (!this.recipes || !this.recipes.length) return [];
      const ids = new Set(
        (Array.isArray(cartProductIds) ? cartProductIds : []).map((id) => String(id || "").trim()).filter(Boolean)
      );
      // If recipes have product_ids (after backend redeploy), filter to matching ones only
      const recipesWithProductIds = this.recipes.filter(
        (r) => Array.isArray(r.productIds) && r.productIds.length > 0
      );
      if (ids.size > 0 && recipesWithProductIds.length > 0) {
        const matched = recipesWithProductIds.filter((r) =>
          r.productIds.some((pid) => ids.has(String(pid)))
        );
        const source = matched.length > 0 ? matched : recipesWithProductIds;
        return source.map((recipe) => ({
          recipe_id: recipe.id,
          recipe_name: recipe.label,
          match_count: recipe.productIds.filter((pid) => ids.has(String(pid))).length,
          total_ingredients: recipe.productIds.length,
          base_servings: recipe.baseServings || this.defaultServings,
          fallback: true,
        }));
      }
      // No product_ids in recipe data (old backend) — return all recipes without false count
      return this.recipes.map((recipe) => ({
        recipe_id: recipe.id,
        recipe_name: recipe.label,
        match_count: 0,
        total_ingredients: 0,
        base_servings: recipe.baseServings || this.defaultServings,
        fallback: true,
      }));
    }

    updateBannerCandidates(data) {
      if (!data || typeof data !== "object") return;
      if (!Object.prototype.hasOwnProperty.call(data, "candidates")) return;
      const candidates = Array.isArray(data.candidates) ? data.candidates : [];
      this.lastCandidates = candidates;
      let count = candidates.length;
      if (!count && this.getCartProductIds().length > 0) {
        // API not yet deployed — compute count from local fallback so it matches what's shown
        const fallback = this._getFallbackRecipesFromCart(this.getCartProductIds());
        count = fallback.length || 1;
      }
      this.lastCandidatesCount = count;
      if (!count && this.isCartBannerVisible()) {
        this.hideCartBanner();
      }
    }

    getCartProductIds() {
      const items = this.cart && Array.isArray(this.cart.items) ? this.cart.items : [];
      const seen = {};
      const out = [];
      items.forEach((item) => {
        const id = String(pickGreenestProductId(item) || "").trim();
        if (!id || seen[id]) return;
        seen[id] = true;
        out.push(id);
      });
      return out;
    }

    buildSignatureFromProductIds(productIds) {
      const unique = Array.from(
        new Set((Array.isArray(productIds) ? productIds : []).map((id) => String(id || "").trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b));
      return unique.join("|");
    }

    refreshCartRecipeCandidates(productIds) {
      console.log("[Greenest] refreshCartRecipeCandidates called");
      const explicitIds =
        Array.isArray(productIds) && productIds.length
          ? Array.from(new Set(productIds.map((id) => String(id || "").trim()).filter(Boolean)))
          : [];
      const ids = explicitIds.length ? explicitIds : this.getCartProductIds();
      const sig = explicitIds.length
        ? this.buildSignatureFromProductIds(explicitIds)
        : makeCartSignature(this.cart.items);
      this.lastRecommendationSig = sig;
      this.lastRecommendationHasItems = ids.length > 0;
      console.log("[Greenest] refreshCartRecipeCandidates - ids:", ids, "sig:", sig);
      return this.fetchCartRecipeCandidates(ids, 20).then((candidates) => {
        console.log("[Greenest] refreshCartRecipeCandidates - fetch returned:", candidates.length);
        this.updateBannerCandidates({ candidates });
        console.log("[Greenest] refreshCartRecipeCandidates - lastCandidatesCount now:", this.lastCandidatesCount);
        return candidates;
      });
    }

    fetchCartRecipeCandidates(productIds, limit = 5) {
      const unique = Array.from(
        new Set((productIds || []).map((id) => String(id || "").trim()).filter(Boolean))
      );
      if (!unique.length || !this.webAppUrl) return Promise.resolve([]);
      let url;
      try {
        url = new URL(this.webAppUrl, window.location.href);
      } catch (_) {
        return Promise.resolve([]);
      }
      url.searchParams.set("action", "cartRecipeCandidates");
      url.searchParams.set("product_ids", unique.join(","));
      if (Number.isFinite(Number(limit)) && Number(limit) > 0) {
        url.searchParams.set("limit", String(Number(limit)));
      }
      console.log("[Greenest] fetchCartRecipeCandidates - URL:", url.toString());
      // Wrap in Promise to ensure it can't hang
      return new Promise((resolve) => {
        const timeoutMs = 5000;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log("[Greenest] fetchCartRecipeCandidates - timeout triggered");
          controller.abort();
          resolve([]);
        }, timeoutMs);
        fetch(url.toString(), { method: "GET", signal: controller.signal })
          .then((res) => {
            clearTimeout(timeoutId);
            return res.text().then((text) => ({ res, text }));
          })
          .then(({ res, text }) => {
            let data;
            try { data = JSON.parse(text); } catch (_) { resolve([]); return; }
            if (!res.ok || data.ok === false) { resolve([]); return; }
            const candidates = Array.isArray(data.candidates) ? data.candidates : [];
            console.log("[Greenest] fetchCartRecipeCandidates API returned:", candidates.length, "candidates");
            resolve(candidates);
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            console.log("[Greenest] fetchCartRecipeCandidates failed:", err.name === "AbortError" ? "timeout" : err);
            resolve([]);
          });
      });
    }

    hasSystemMessage(type, sig) {
      if (!this.messagesEl) return false;
      return Boolean(
        this.messagesEl.querySelector(
          `.greenest-message[data-system-type="${type}"][data-cart-sig="${sig}"]`
        )
      );
    }

    getSystemMessageEl(type, sig) {
      if (!this.messagesEl) return null;
      return this.messagesEl.querySelector(
        `.greenest-message[data-system-type="${type}"][data-cart-sig="${sig}"]`
      );
    }

    injectSystemMessage(type, payload, options = {}) {
      if (!this.messagesEl || !type) return;
      const sig = options.sig || "";
      if (sig && this.hasSystemMessage(type, sig)) return;
      if (type !== "cart_recipe_candidates") return;

      const candidates = Array.isArray(payload) ? payload : [];
      const wrapper = document.createElement("div");
      wrapper.className = "greenest-message assistant greenest-system-message";
      wrapper.dataset.systemType = type;
      if (sig) wrapper.dataset.cartSig = sig;

      const bubble = document.createElement("div");
      bubble.className = "greenest-bubble assistant";

      const title = document.createElement("div");
      title.className = "greenest-system-title";
      title.textContent = "Sinu ostukorvi järgi";
      bubble.appendChild(title);

      if (options.loading) {
        const loading = document.createElement("div");
        loading.className = "greenest-system-loading";
        loading.textContent = t("cart_candidates_loading");
        bubble.appendChild(loading);
      } else {
        const list = document.createElement("div");
        list.className = "greenest-system-recipe-list";
        this._renderRecipeCandidateCards(list, candidates, sig);
        bubble.appendChild(list);
      }

      wrapper.appendChild(bubble);
      this.messagesEl.appendChild(wrapper);
      this.scrollMessages();
    }

    updateCartCandidatesMessage(sig, candidates) {
      const wrapper = this.getSystemMessageEl("cart_recipe_candidates", sig);
      if (!wrapper) return;
      const bubble = wrapper.querySelector(".greenest-bubble");
      if (!bubble) return;
      const loading = bubble.querySelector(".greenest-system-loading");
      if (loading) loading.remove();
      let list = bubble.querySelector(".greenest-system-recipe-list");
      if (!list) {
        list = document.createElement("div");
        list.className = "greenest-system-recipe-list";
        bubble.appendChild(list);
      }
      list.innerHTML = "";
      this._renderRecipeCandidateCards(list, Array.isArray(candidates) ? candidates : [], sig);
      this.scrollMessages();
    }

    _renderRecipeCandidateCards(list, candidates, sig) {
      candidates.forEach((candidate) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "greenest-system-recipe-card";
        const name = String(candidate.recipe_name || candidate.recipeName || "Retsept");
        const matchCount = Number(candidate.match_count || 0);
        const total = Number(candidate.total_ingredients || 0);

        const nameEl = document.createElement("div");
        nameEl.className = "greenest-system-recipe-name";
        nameEl.textContent = name;
        card.appendChild(nameEl);

        if (matchCount > 0 || total > 0) {
          const meta = document.createElement("div");
          meta.className = "greenest-system-recipe-meta";
          meta.textContent = `${matchCount}/${total} koostisosa juba korvis`;
          card.appendChild(meta);
        }

        card.addEventListener("click", () => {
          const recipe = {
            id: String(candidate.recipe_id || candidate.recipeId || ""),
            label: name,
            baseServings:
              Number(candidate.base_servings || candidate.baseServings) || this.defaultServings,
          };
          if (recipe.id) {
            this.trackEvent("cart_recipe_clicked", {
              assisted: 0,
              reason: "cart_banner",
              sig: sig,
              recipe_id: recipe.id,
              match_count: matchCount,
              total_ingredients: total,
            });
            this.handleRecipeSelection(recipe);
          }
        });

        list.appendChild(card);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".greenest-widget")) {
      return;
    }
    const widget = new GreenestWidget();
    widget.init();
  });
})();
