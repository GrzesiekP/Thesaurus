# O projekcie
Kod skrpytów gotowych do użycia jako custom functions w Arkuszach Google. 

## Instrukcja - instalacja copy-paste
1. Wklej zawartość `Thesaurus.js` do dowolnego pliku `*.gs` w Edytorze Skryptów danego Arkusza Google
2. Podmień `coinMarketCapApiKey` na swój własny
3. Uruchom `THESAURUS_AVAILABLE` lub inną funkcję, żeby przyznać uprawnienia.

## Funkcje

### THESAURUS_AVAILABLE()
Funkcja testowa sprawdzająca, czy skrypt działa.

### CRYPTO_USD_PRICE(cryptoTicker)
Zwraca cenę wskazanej kryptowaluty w USD według kursu z CoinMarketCap. Wymaga podmiany `coinMarketCapApiKey`.
Przyklad: `=CRYPTO_USD_PRICE("ETH")`

### GOLD_PRICE(currency)
Zwraca cenę złota w podanej walucie.
Przykład: `=GOLD_PRICE("PLN")`

### NNTFI_FUND_PRICE(fundType, fundName)
Zwraca wecenę wskazanego funduszu NNTFI.
Argumenty należy wziąc z URL strony funduszu. 
Np. z `https://www.nntfi.pl/fundusze-inwestycyjne/fundusze-akcji/nn-akcji?unitsCategoryId=A` **fundType** to `fundusze-inwestycyjne`, a **fundName** to `nn-akcji`.
Przykład `=NNTFI_FUND_PRICE("fundusze-inwestycyjne", "nn-akcji")`
