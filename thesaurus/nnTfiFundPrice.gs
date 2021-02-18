function nnTfiFundPrice(fundType, fundName) {
    fundType = fundType.trim()
    fundName = fundName.trim()
    const url = "https://www.nntfi.pl/fundusze-inwestycyjne/" + fundType + "/" + fundName + "?unitsCategoryId=K"
  
    const result = getHtmlTextinGS_(url)
    
    const pattern = '<div class="end_date_price"><span class="fund_value">'
    const startIndex = result.lastIndexOf(pattern) + pattern.length
    const newString = result.substring(startIndex)
    const endIndex = newString.indexOf(' <')
    const priceString = newString.substr(0, endIndex).replace(',','.')
    
    const price = parseFloat(priceString)
    
    return price
  }
