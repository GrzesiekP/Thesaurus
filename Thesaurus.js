const CACHE_EXPIRATION = 2 * 60 * 60; // Two hours in seconds
const listingsLimit = 200;

/**
 * Fetches the date when the cryptocurrency prices were last refreshed.
 * @customfunction
 * @returns {string} The last data load date in a readable format.
 */
function LAST_DATA_LOAD_DATE(trigger) {
  const properties = PropertiesService.getScriptProperties();
  const lastDataLoadDate = properties.getProperty("lastDataLoadDate");

  if (!lastDataLoadDate) {
    return "No data load has been performed yet.";
  }

  // Convert ISO date to a more readable format
  const date = new Date(lastDataLoadDate);
  return date.toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });
}

/**
 * Custom function to get API statistics usage.
 * @customfunction
 * @returns {string} Usage statistics.
 */
function CMC_STATS(trigger) {
  const url = "https://pro-api.coinmarketcap.com/v1/key/info";
  const requestOptions = {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": GetCoinMarketCapApiKey(),
        "Accept": "application/json",
      },
      muteHttpExceptions: true,
    };

  const response = UrlFetchApp.fetch(url, requestOptions);
  const data = JSON.parse(response.getContentText());

  const usedToday = data.data.usage.current_day.credits_used || 0;
  const usedThisMonth = data.data.usage.current_month.credits_used || 0;
  const leftThisMonth = data.data.usage.current_month.credits_left || 0;
  const resetDate = new Date(data.data.plan.credit_limit_monthly_reset_timestamp || 0);
  const resetDateLocal = resetDate.toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });

  return `Wykorzystano dziś ${usedToday}. W tym miesiącu wykorzystano ${usedThisMonth}, pozostało ${leftThisMonth}. Limit odnawia się ${resetDateLocal}`
}

/**
 * Fetches the USD price of a cryptocurrency (e.g., BTC) using CoinMarketCap API.
 * @param {string} crypto_slug The name of the cryptocurrency (e.g., "bitcoin").
 * @customfunction
 */
function CRYPTO_USD_PRICE(crypto_slug, trigger) {
  const slug = crypto_slug.toLowerCase();
  const cache = CacheService.getScriptCache();

  // Check if the price is already cached
  const cachedPrice = cache.get(`crypto_${slug}`);
  if (cachedPrice) {
    console.log(`Price for ${slug} found in cache`);
    return parseFloat(cachedPrice);
  }

  // If not cached, fetch data for all cryptocurrencies defined in the sheet
  console.log(`Price for ${slug} not found in cache. Fetching new data.`);
  const allSlugs = getAllCryptoSlugsFromSheet_();
  const pricesDict = fetchCryptoPricesBySlugs_(allSlugs, GetCoinMarketCapApiKey());

  // Cache the fetched prices
  for (const [slug, price] of Object.entries(pricesDict)) {
    cache.put(`crypto_${slug}`, price, CACHE_EXPIRATION);
  }

  // Return the requested ticker's price if it exists
  if (pricesDict[slug]) {
    return pricesDict[slug];
  } else {
    throw new Error(`Cryptocurrency "${slug}" not found in API data`);
  }
}

function getAllCryptoSlugsFromSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Kursy");
  const range = sheet.getRange("D7:D");
  const values = range.getValues();
  const slugs = values.flat().filter(slug => slug); // Flatten and filter out empty values
  return slugs.map(slug => slug.toLowerCase());
}

function fetchCryptoPricesBySlugs_(slugs, apiKey) {
  const slugList = slugs.join(',');
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=${slugList}`;

  const requestOptions = {
    method: "GET",
    followRedirects: true,
    muteHttpExceptions: true,
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
    },
  };

  console.log(`Calling ${url}`);
  const result = UrlFetchApp.fetch(url, requestOptions);
  console.log(`API call completed`);
  const content = JSON.parse(result.getContentText());

  // Transform API response into a dictionary (slug -> price)
  const pricesDict = {};
  if (content.data) {
    for (const cryptoData of Object.values(content.data)) {
      const slug = cryptoData.slug.toLowerCase();
      pricesDict[slug] = cryptoData.quote.USD.price;
    }
  }

  // Update the last data load date
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty("lastDataLoadDate", new Date().toISOString());

  return pricesDict;
}

/**
 * Fetches and caches CoinMarketCap API key usage stats.
 * This helper function ensures a single API call is made.
 * @returns {Object} The API usage statistics.
 */
function fetchAndCacheUsageStats_() {
  const url = "https://pro-api.coinmarketcap.com/v1/key/info";
    const requestOptions = {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": GetCoinMarketCapApiKey(),
        "Accept": "application/json",
      },
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(url, requestOptions);
    const data = JSON.parse(response.getContentText());
    return data
}

/**
 * Reloads cryptocurrency data and updates the cache.
 * @customfunction
 */
function RELOAD_DATA() {
  const allSlugs = getAllCryptoSlugsFromSheet_();
  const pricesDict = fetchCryptoPricesBySlugs_(allSlugs, GetCoinMarketCapApiKey());
  const cache = CacheService.getScriptCache();

  // Cache the fetched prices
  for (const [slug, price] of Object.entries(pricesDict)) {
    cache.put(`crypto_${slug}`, price, CACHE_EXPIRATION);
  }

  SpreadsheetApp.getActive().toast("Pomyślnie zaktualizowano kursy.");
}