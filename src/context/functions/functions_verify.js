import { auth } from "@/lib/firebaseConfig";
import { validatePassword } from "firebase/auth";

export async function isValidPassword(password = "") {
  const status = await validatePassword(auth, password);
  return ({
    isValid: status.isValid,
    containsLowercaseLetter: status.containsLowercaseLetter,
    containsUppercaseLetter: status.containsUppercaseLetter,
    containsNumericCharacter: status.containsNumericCharacter,
    containsNonAlphanumericCharacter: status.containsNonAlphanumericCharacter,
    meetsMinPasswordLength: status.meetsMinPasswordLength,
    meetsMaxPasswordLength: status.meetsMaxPasswordLength,
  });
}
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
  export function isValidEmail(email) {
    if (!email) return false;
    // Expression régulière pour la validation de l'email
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  export function isValidDandelaAcademyEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@dandela-academy\.com$/i;
    return regex.test(email);
  }
  export function isValidURL(url) {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname;
  
      if (!hostname.includes('.')) return false;
  
      const tld = hostname.split('.').pop();
      if (tld.length < 2) return false;
  
      return true;
    } catch (_) {
      return false;
    }
  }