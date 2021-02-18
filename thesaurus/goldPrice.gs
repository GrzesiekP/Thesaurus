function goldPrice(currency) {
    const url = "https://data-asg.goldprice.org/dbXRates/" + currency

    const requestOptions = {
        "method": "GET",
        "followRedirects": true,
        "muteHttpExceptions": true
    };

    const result = UrlFetchApp.fetch(url, requestOptions)

    const parsedData = JSON.parse(result.getContentText())
    const goldPrice = parsedData['items'][0]['xauPrice']

    return goldPrice
}