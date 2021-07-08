namespace ThesaurusApi.Services
{
    public interface ICurrencyService
    {
        decimal Convert(decimal amount, SupportedCurrencies currencyFrom, SupportedCurrencies currencyTo);
    }
}