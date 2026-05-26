import { ClassCountry } from '@/classes/ClassCountry';

export const formatPrice = (amount, currency = ClassCountry.DEFAULT_CURRENCY) => {
  if (currency === "AOA") {
    return `${amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Kz`;
  }
  const localeByCurrency = {
    CHF: "fr-CH",
    USD: "en-US",
    AOA: "pt-AO",
  };

  const locale = localeByCurrency[currency] || "fr-CH";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "AOA" ? 0 : 2,
    maximumFractionDigits: currency === "AOA" ? 0 : 2,
  }).format(amount);
}