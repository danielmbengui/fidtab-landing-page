export function removeAccents(str) {
  return str
    .normalize("NFD")                     // décompose les lettres accentuées
    .replace(/[\u0300-\u036f]/g, "")       // supprime les diacritiques
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ß/g, "ss")
    .replace(/ø/g, "o")
    .replace(/đ/g, "d")
    .replace(/ł/g, "l")
   // .replace(/[^a-z0-9\s-_]/g, "")   // enlève le reste des caractères spéciaux
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .replace(/['’]/g, "");                 // supprime apostrophes simples/typographiques
}
export function removeAccentsAndSpaces(str) {
  return str
    .normalize("NFD")                     // décompose les lettres accentuées
    .replace(/[\u0300-\u036f]/g, "")       // supprime les diacritiques
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ß/g, "ss")
    .replace(/ø/g, "o")
    .replace(/đ/g, "d")
    .replace(/ł/g, "l")
   // .replace(/[^a-z0-9\s-_]/g, "")   // enlève le reste des caractères spéciaux
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    //.replace(/\s+/g, " ")                   // supprime tous les espaces
    .replace(/\s+/g, "")
    .replace(/['’]/g, "");                 // supprime apostrophes simples/typographiques
}
export const cutString = (text = "", maxLength = 18) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
export const cutStringBetween = (text = "", maxLength = 18) => {
  if (text?.length > maxLength) {
    return `${text.substring(0, parseInt(maxLength / 2))}...${text.substring(text.length - parseInt(maxLength / 2))}`;
  }
  return (text);
}
export function capitalizeFirstLetter(str = "") {
  if (!str) return "";
  return (str[0].toUpperCase() + str.slice(1).toLowerCase());
}
export const getFirstLetters = (str = "", max = 5) => {
  return str
    .normalize("NFD")                  // sépare les accents
    .replace(/[\u0300-\u036f]/g, "")   // retire les accents
    .replace(/[-_']/g, " ")            // remplace tirets/apostrophes par espaces
    .replace(/\s+/g, " ")              // espaces multiples -> simple
    .trim()
    .replace(/[^A-Za-z]/g, "")         // garde seulement A-Z (optionnel)
    .slice(0, max);                       // x premières lettres
};