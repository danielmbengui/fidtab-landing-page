import { defaultLocale as DEFAULT_LOCALE } from "@/i18n/config";
import countriesData from "./countries.data.json";

export class ClassCountry {
    static DEFAULT_CODE = 'CH';
    static ANGOLA_CODE = 'AO';
    static SWISS_CODE = 'CH';
    static FRENCH_CODE = 'FR';
    static DEFAULT_PREFIXE = '+41';
    static DEFAULT_CURRENCY = "CHF";
    static CURRENCIES = ['CHF', 'USD', 'AOA', 'EUR'];
    static COUNTRIES = countriesData;

    constructor({
        uid = "",
        code = "",
        name = "",
        flags = {},
        prefixes = [],
        translations = {},
        /** Carte i18n du continent : `{ pt, de, es, fr, it }` — voir `ClassCountry.COUNTRIES[].continent`. */
        continent = {},
    } = {}) {
        this._uid = uid;
        this._code = code;
        this._name = name;
        this._flags = flags;
        this._prefixes = prefixes;
        this._translations = translations;
        this._continent =
            continent && typeof continent === "object" ? { ...continent } : {};
    }

    // --- GETTERS ---
    get uid() {
        return this._uid;
    }

    get code() {
        return this._code;
    }

    get name() {
        return this._name;
    }

    get flags() {
        return this._flags;
    }

    get prefixes() {
        return this._prefixes;
    }

    get translations() {
        return this._translations;
    }

    get continent() {
        return this._continent;
    }

    // --- SETTERS ---
    set uid(value) {
        this._uid = value;
    }

    set code(value) {
        this._code = value;
    }

    set name(value) {
        this._name = value;
    }

    set flags(value) {
        this._flags = value;
    }

    set prefixes(value) {
        if (!Array.isArray(value)) {
            throw new Error("prefixes must be an array");
        }
        this._prefixes = value;
    }

    set translations(value) {
        if (typeof value !== "object" || value === null) {
            throw new Error("translations must be an object");
        }
        this._translations = value;
    }

    set continent(value) {
        if (typeof value !== "object" || value === null) {
            throw new Error("continent must be an object");
        }
        this._continent = { ...value };
    }

    /** Libellé continent pour une locale BCP 47 courte (ex. `fr`). */
    getNameLabel(lang = DEFAULT_LOCALE) {
        const c = this._name || {};
        return (
            c[lang] ||
            c.fr ||
            c.en ||
            c.pt ||
            c.de ||
            c.es ||
            c.it ||
            ""
        );
    }
    getContinentLabel(lang = DEFAULT_LOCALE) {
        const c = this._continent || {};
        return (
            c[lang] ||
            c.fr ||
            c.en ||
            c.pt ||
            c.de ||
            c.es ||
            c.it ||
            ""
        );
    }

    // ✅ toJSON
    toJSON() {
        return {
            uid: this._uid,
            code: this._code,
            name: this._name,
            flags: this._flags,
            prefixes: this._prefixes,
            translations: this._translations,
            continent: this._continent,
        };
    }
    update(props = {}) {
        for (const key in props) {
            if (this.hasOwnProperty(`_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
    }
    clone() {
        //console.log('toJson', 'generation country', this.toJSON())
        return new ClassCountry(this.toJSON());
    }
    static getAllCountries(lang = DEFAULT_LOCALE) {
        const _countries = this.COUNTRIES;
        const _countries_lang = _countries.map(country => {
            const _name = country.name || "";
            const _translations = { "en": _name, ...country.translations } || {};
            const _name_lang = _translations[lang] || _name;
            const _continent = country.continent || {};
            const _continent_lang =
                _continent[lang] ||
                _continent.fr ||
                _continent.en ||
                _continent.pt ||
                "";
            return {
                ...country,
                name: _name_lang,
                translations: _translations,
                continentLabel: _continent_lang,
            };
        });
        return _countries_lang;
    }
    static getCountryByCode(code = "", lang = DEFAULT_LOCALE) {
        const _countries = ClassCountry.COUNTRIES;
        const _code = code.toUpperCase().trim();
        const _country = _countries.find(country => country.code.toUpperCase() === _code);
        const _name = _country?.name || "";
        const _translations = { "en": _name, ..._country?.translations } || {};
        const _name_lang = _translations[lang] || _name;
        const _continent = _country?.continent || {};
        return _country ? new ClassCountry({
            ..._country,
            name: _name_lang,
            translations: _translations,
            continent: _continent,
        }) : null;
    }
    static getCountriesByCode(codes = [],lang = DEFAULT_LOCALE) {
        if (codes.length === 0) return [];
        const _countries = this.getAllCountries(lang);
        const _codes = codes.map(code => code.toUpperCase());
        return _countries.filter(country => _codes.includes(country.code.toUpperCase())).map(country => this.getCountryByCode(country.code));
    }
    static getCountryByPrefixe(prefixe = "") {
        const _countries = ClassCountry.COUNTRIES;
        const _prefixe = prefixe.trim();
        const _country = _countries.find(country => country.prefixes.includes(_prefixe));
        if (!_country) return null;
        return this.getCountryByCode(_country.code);
    }
    static getPrefixeByCode(code = "") {
        const _countries = ClassCountry.COUNTRIES;
        const _code = code.trim();
        const _prefixes = this.getAllPrefixes();
        const _prefixe = _prefixes.find(prefixe => prefixe.prefixe === `+${_country.prefixes[0]}`);
        if (!_prefixe) return null;
        return _prefixe.prefixe;
    }
    static getPrefixes() {
        const seen = new Set();
        return this.COUNTRIES.flatMap(country => country.prefixes.map(prefixe => ({
            code: country.code,
            flags: country.flags,
            prefixe: `+${prefixe}`,
        })))
        /*.filter(item => {
            if (seen.has(item.prefixe)) return false;
            seen.add(item.prefixe);
            return true;
          })
            */
    }
    static extractCodeCountryFromPhoneNumber(phoneNumber = "") {
        if (!phoneNumber) return "";
        const prefixes = this.getPrefixes();
        for (const item of prefixes) {
            const prefixe = item.prefixe;
            const code = item.code;
            if (phoneNumber.startsWith(`${prefixe}`)) {
                return `${code}`;
            }
        }
        return "";
    }
    static extractPrefixeFromPhoneNumber(phoneNumber = "") {
        if (!phoneNumber) return "";
        const prefixes = this.getPrefixes();
        for (const item of prefixes) {
            const prefixe = item.prefixe;
            if (phoneNumber.startsWith(`${prefixe}`)) {
                return `${prefixe}`;
            }
        }
        return "";
    }
    static getAllPrefixes() {
        const prefixes = [];

        for (const _country of ClassCountry.COUNTRIES) {
            const _prefixes = _country.prefixes;
            for (const _prefixe of _prefixes) {
                prefixes.push({
                    code: _country.code,
                    flag: _country.flags.png,
                    prefixe: `+${_prefixe}`,
                });
            }
        }
        return prefixes;
    }
    static toFirestore(country = null) {
        if (!country || !(country instanceof ClassCountry)) return null;
        return {
            code: country.code,
            flagPng: country.flags.png,
            flagSvg: country.flags.svg,
            flagStr: country.flags.str,
            name: country.name,
            prefixes: country.prefixes,
            translations: country.translations,
            continent: country.continent,
        };
    }
}