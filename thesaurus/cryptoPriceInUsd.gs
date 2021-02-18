function cryptoPriceInUsd(cryptoTicker, apiKey) {
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