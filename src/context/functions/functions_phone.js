import { parsePhoneNumberFromString } from 'libphonenumber-js';
//import { defaultLanguage, NS_DAYS } from "./i18n/settings";
//import allExamples from 'libphonenumber-js/examples.json'; // tous les types
import allExamples from 'libphonenumber-js/mobile/examples';
//import { getExampleNumber } from 'libphonenumber-js'
import { ClassCountry } from '@/classes/ClassCountry';

export const DEFAULT_PHONE_COUNTRY = ClassCountry.SWISS_CODE;

export function getPhoneCountryCode(countryCode) {
  const normalized = String(countryCode ?? '').trim().toUpperCase();
  if (normalized === ClassCountry.SWISS_CODE) return ClassCountry.SWISS_CODE;
  const found = ClassCountry.getCountryByCode(normalized);
  return found ? found.code : ClassCountry.SWISS_CODE;
}

export function getPrefixForCountry(countryCode = DEFAULT_PHONE_COUNTRY) {
  const code = getPhoneCountryCode(countryCode);
  const country = ClassCountry.getCountryByCode(code);
  if (country?.prefixes?.length) return `+${country.prefixes[0]}`;
  return ClassCountry.DEFAULT_PREFIXE;
}

const PHONE_SELECT_PRIORITY = ['CH', 'FR', 'DE', 'IT'];

export function getCountriesForPhoneSelect(lang = 'fr') {
  const all = ClassCountry.getAllCountries(lang);
  const priority = PHONE_SELECT_PRIORITY
    .map((code) => all.find((country) => country.code === code))
    .filter(Boolean);
  const rest = all
    .filter((country) => !PHONE_SELECT_PRIORITY.includes(country.code))
    .sort((a, b) => a.name.localeCompare(b.name, lang, { sensitivity: 'base' }));
  return [...priority, ...rest];
}

export function validatePhoneParts(nationalNumber, countryCode = DEFAULT_PHONE_COUNTRY) {
  const code = getPhoneCountryCode(countryCode);
  const prefix = getPrefixForCountry(code);
  const raw = `${prefix}${formatPhoneCompact(nationalNumber)}`;
  return parseAndValidatePhone(raw, code);
}

// Valide, normalise et formate
export function isValidPhoneNumberCustom(phone_number, code = ClassCountry.DEFAULT_CODE) {
  const phone = parsePhoneNumberFromString(phone_number, code); // ex: 'CH', 'AO', 'FR'
  if (!phone) return false;
  return phone.isValid();
}
export function parseAndValidatePhone(raw, defaultCountry = ClassCountry.DEFAULT_CODE) {
  const phone = parsePhoneNumberFromString(raw, defaultCountry); // ex: 'CH', 'AO', 'FR'
  if (!phone) return {
    is_valid: false,
    is_possible: false,
    phone_number: null,       // +41791234567
    international: null,        // +41 79 123 45 67
    national: null,                  // 079 123 45 67
    type: null,                             // 'MOBILE' | 'FIXED_LINE' | ...
    country: defaultCountry                             // code ISO (détecté)
  };
  return {
    is_valid: phone.isValid(),
    is_possible: phone.isPossible(),
    phone_number: phone.isValid() ? phone.number : null,       // +41791234567
    international: phone.formatInternational(),        // +41 79 123 45 67
    national: phone.formatNational(),                  // 079 123 45 67
    type: phone.getType(),                             // 'MOBILE' | 'FIXED_LINE' | ...
    country: phone.country                             // code ISO (détecté)
  };
}
export function getExampleFor(country = ClassCountry.DEFAULT_CODE, type = 'mobile') {
  const entry = allExamples[country];
  if (!entry) return null;
  //const raw = entry[type] || entry.mobile || entry.fixed_line; // fallback
  //if (!raw) return null;
  //  console.log("Exemples possibles", entry)
  // On reparse pour bénéficier des méthodes (formatNational, etc.)
  return parsePhoneNumberFromString(entry, country);
}
export function getPlaceHolderPhoneNumber(country = DEFAULT_PHONE_COUNTRY) {
  const code = getPhoneCountryCode(country);
  const parsed = getExampleFor(code);
  if (!parsed?.number) return '';
  const phone = parsePhoneNumberFromString(parsed.number, code);
  return phone?.formatNational() ?? '';
}
export function formatPhoneNumberInternational(phone_number = "", country = ClassCountry.DEFAULT_CODE) {
  if (!phone_number) return "";
  const phone = parsePhoneNumberFromString(phone_number, country); // ex: 'CH', 'AO', 'FR'
  if (!phone) return "";
  return phone.formatInternational();
}
/**
 * Formate un numéro en chaîne compacte : tous les caractères se suivent sans aucun espace
 * (supprime espaces, tabulations, retours à la ligne et autres séparateurs d’espacement Unicode).
 * @param {string} [raw]
 * @returns {string}
 */
export function formatPhoneCompact(raw) {
  if (raw == null || raw === '') return '';
  return String(raw).replace(/\s/g, '');
}