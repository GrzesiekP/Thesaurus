const coinMarketCapApiKey = "apiKey"

function CRYPTO_PRICE_IN_USD(cryptoTicker) {
  return Thesaurus.cryptoPriceInUsd(cryptoTicker, coinMarketCapApiKey)
}

function GOLD_PRICE(currency) {
   return Thesaurus.goldPrice(currency)
}

function NNTFI_FUND_PRICE(fundType, fundName) {
  return Thesaurus.nnTfiFundPrice(fundType, fundName)
}