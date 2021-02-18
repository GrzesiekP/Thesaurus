function getHtmlTextinGS_(url) {
    const options = {
      "method": "GET",
      "followRedirects": true,
      "mode": "no-cors",
      "muteHttpExceptions": true
    }
  
    return UrlFetchApp.fetch(url, options).getContentText()
  }