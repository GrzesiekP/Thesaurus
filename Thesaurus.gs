const coinMarketCapApiKey = "apiKey"

function THESAURUS_AVAILABLE() {
    return true;
}

function CRYPTO_USD_PRICE(cryptoTicker) {
    return cryptoPriceInUsd_(cryptoTicker, coinMarketCapApiKey)
}

function GOLD_PRICE(currency) {
    return goldPrice_(currency)
}

function NNTFI_FUND_PRICE(fundType, fundName) {
    return nnTfiFundPrice_(fundType, fundName)
}

function cryptoPriceInUsd_(cryptoTicker, apiKey) {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"

    const requestOptions = {
        method: "GET",
        "followRedirects": true,
        "muteHttpExceptions": true,
        headers: {
            "X-CMC_PRO_API_KEY": apiKey
        }
    }

    const result = UrlFetchApp.fetch(url, requestOptions)
    const content = JSON.parse(result.getContentText())

    const price = content.data.filter(c => c.symbol === cryptoTicker)[0].quote.USD.price

    return price
}

function goldPrice_(currency) {
    const url = "https://data-asg.goldprice.org/dbXRates/" + currency

    const result = UrlFetchApp.fetch(url, requestOptions)

    const parsedData = JSON.parse(result.getContentText())
    const goldPrice = parsedData['items'][0]['xauPrice']

    return goldPrice
}

function nnTfiFundPrice_(fundType, fundName) {
    fundType = fundType.trim()
    fundName = fundName.trim()
    const url = "https://www.nntfi.pl/fundusze-inwestycyjne/" + fundType + "/" + fundName + "?unitsCategoryId=K"

    const result = getHtmlTextinGS_(url)

    const pattern = '<div class="end_date_price"><span class="fund_value">'
    const startIndex = result.lastIndexOf(pattern) + pattern.length
    const newString = result.substring(startIndex)
    const endIndex = newString.indexOf(' <')
    const priceString = newString.substr(0, endIndex).replace(',', '.')

    const price = parseFloat(priceString)

    return price
}


function getHtmlTextinGS_(url) {
    return UrlFetchApp.fetch(url, requestOptions).getContentText()
}

const requestOptions = {
    "method": "GET",
    "followRedirects": true,
    "mode": "no-cors",
    "muteHttpExceptions": true
}