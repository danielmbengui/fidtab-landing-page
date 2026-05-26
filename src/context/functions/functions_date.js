import { DEFAULT_LOCALE, appLocaleToIntlLocale } from '@/i18n/config'

const defaultLanguage = appLocaleToIntlLocale(DEFAULT_LOCALE);
export function getDateFormat({
  date = new Date(),
  isComplete=true,
  isNumeric=false,
  isShort=false,
  withSeconds=false,
  lang = defaultLanguage
}) {
  if (!date) {
    return null;
  }
  const obj = {
    year: 'numeric',
    month: isShort ? 'short' : 'long',
    day: 'numeric',
  }
  if(isNumeric) {
    obj.month = 'numeric';
    obj.day = 'numeric';
  }
  if(isComplete) {
    obj.hour = '2-digit';
    obj.minute = '2-digit';
  }
  if(withSeconds) {
    obj.second = '2-digit';
  }

  if (date instanceof Date) {
    return date.toLocaleDateString(lang, obj);
  } else {
    return date;
  }
}
export function getHourFormat({
  date = new Date(),
  withSeconds=false,
  lang = defaultLanguage
}) {
  const obj = {
    hour: '2-digit',
    minute: '2-digit',
    //second: '2-digit',
    // hour12: false, // si tu veux forcer le format 24h
  }
  if(withSeconds) {
    obj.second = '2-digit';
  }
  return date.toLocaleTimeString(lang, obj);
}

export function getRelativeDate(date = new Date()) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if(diffDays === 0) {
    return "Aujourd'hui";
  }
  if(diffDays === 1) {
    return "Hier";
  }
  return diffDays;
}
export function getDaysDifference(startDate, endDate) {
  if(!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) return 0;
  const diff = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  return diffDays;
}
export function getDaysDifferenceLabel(startDate, endDate, lang=DEFAULT_LOCALE) {
  if(!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) return 0;
  const diffDays = getDaysDifference(startDate, endDate);
  /*
  if(diffDays < 30) return `${diffDays} jours`;
  if(diffDays < 60) return "Hier";
  if(diffDays === 2) return "Avant-hier";
  if(diffDays === 3) return "Il y a 3 jours";
  if(diffDays === 4) return "Il y a 4 jours";
  if(diffDays === 5) return "Il y a 5 jours";
  if(diffDays === 6) return "Il y a 6 jours";
  */
  return `${diffDays} jours`;
}



export function getLastDayInMonth(month, year) {
    // month = 1 pour janvier, 2 pour février...
    return new Date(year, month, 0).getDate();
  }
  export function getFormattedDateComplete(date = new Date(), lang = defaultLanguage) {
    if (date instanceof Date) {
      return date.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } else {
      return null;
    }
  }
  export function getFormattedDateCompleteNumeric(date = null, lang = defaultLanguage) {
    if (!date) {
      return null;
    }
    if (date instanceof Date) {
      return date.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } else {
      return date;
    }
  }
  export function getFormattedDate(date = new Date(), lang = defaultLanguage) {
    if (!date) {
      return null;
    }
    if (date instanceof Date) {
      return date.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else {
      return date;
    }
  }
  export function getFormattedDateNumeric(date = new Date(), lang = defaultLanguage) {
    if (!date) {
      return null;
    }
    if (date instanceof Date) {
      return date.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    } else {
      return date;
    }
  }
  export function getFormattedMonth(date = new Date(), lang = defaultLanguage, type = 'long') {
    if (date instanceof Date) {
      return date.toLocaleDateString(lang, {
        //year: 'numeric',
        month: type,
        //day: 'numeric',
      });
    } else {
      return date;
    }
  }
  export function getFormattedHourComplete(date = new Date(), lang = defaultLanguage) {
    return date.toLocaleTimeString(lang, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      // hour12: false, // si tu veux forcer le format 24h
    });
    /*
    if (date instanceof Date) {
      return(`${date.getHours()}h ${date.getMinutes() > 0 ? `${date.getMinutes()}min` : ''} ${date.getSeconds() > 0 ? `${date.getSeconds()}sec` : ''}`);
    } else {
      return date;
    }
      */
  }
  export function getFormattedHour(date = new Date(), lang = defaultLanguage) {
    if (date instanceof Date) {
      return date.toLocaleTimeString(lang, {
        hour: '2-digit',
        minute: '2-digit',
        //second: '2-digit',
        // hour12: false, // si tu veux forcer le format 24h
      });
    } else {
      return date;
    }
    /*
    if (date instanceof Date) {
      return(`${date.getHours()}h ${date.getMinutes() > 0 ? `${date.getMinutes()}min` : ''}`);
    } else {
      return date;
    }
    */
  }
  export function addDaysToDate(date, nDays = 0) {
    const resultat = new Date(date);
    resultat.setDate(resultat.getDate() + nDays);
    return resultat;
  }
  export function getStartOfDay(date) {
    if (!(date instanceof Date)) {
      return null;
    }
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day, 0, 0, 0);
  }
  export function convertDoubleToHour(hour = 0) {
    if (hour > 0) {
      const entier = parseInt(hour);
      const reste = hour - entier;
      return `${entier}h${reste > 0 ? reste * 60 : ''}`;
    }
    return 0;
  }