import { ClassFirestore } from "./ClassFirestore";

export class ClassCity extends ClassFirestore {
    static COLLECTION = "CITIES";
    static STORAGE_FOLDER = "cities";
    static NS_COLLECTION = "classes/cities";
    static FIELDS_TO_OMIT_FIREBASE = [
        // 'translate',
        //'description',
        //'slogan',
    ];
    constructor({
        uid = "",
        code = "",
        name = { fr: "", en: "", de:"",it:""},
        flag_png = "",
        code_country = "",
        enabled=false,
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        const _storage_url = `${ClassCity.STORAGE_FOLDER}/${uid}/city.jpg`;
        super(uid, created_time, last_edit_time, _storage_url);
        //this._uid = uid;
        this._code = code;
        this._name = name;
        this._flag_png = flag_png;
        this._code_country = code_country;
        this._enabled = enabled;
    }
    get code() {
        return this._code;
    }
    get name() {
        return this._name;
    }
    get flag_png() {
        return this._flag_png;
    }
    get code_country() {
        return this._code_country;
    }
    get enabled() {
        return this._enabled;
    }
    set code(value) {
        this._code = value;
    }
    set name(value) {
        this._name = value;
    }
    set flag_png(value) {
        this._flag_png = value;
    }
    set code_country(value) {
        this._code_country = value;
    }
    set enabled(value) {
        this._enabled = value;
    }
    static makeInstance(uid, data = {}) {
        return new ClassCity({ uid, ...data });
    }

    static normalizeName(value) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            return {
                fr: String(value.fr ?? "").trim(),
                en: String(value.en ?? value.fr ?? "").trim(),
                de: String(value.de ?? value.fr ?? "").trim(),
                it: String(value.it ?? value.fr ?? "").trim(),
            };
        }
        const text = String(value ?? "").trim();
        return { fr: text, en: text, de: text, it: text };
    }

    static normalizeFromRaw(uid, raw = {}) {
        const cityType = raw.cityType && typeof raw.cityType === "object" ? raw.cityType : null;
        const source = cityType ?? raw;
        const code = String(source.code ?? raw.code ?? "").trim();
        const code_country = String(
            source.country?.code ?? raw.code_country ?? "",
        ).trim().toUpperCase();
        const flag_png = String(source.flagPng ?? raw.flag_png ?? "").trim();
        const enabled = raw.enabled ?? source.enabled;
        const name = ClassCity.normalizeName(
            raw.name
            ?? (cityType
                ? {
                    fr: cityType.nameFR ?? "",
                    en: cityType.nameEN ?? cityType.nameFR ?? "",
                    de: cityType.nameDE ?? cityType.nameFR ?? "",
                    it: cityType.nameIT ?? cityType.nameFR ?? "",
                }
                : ""),
        );

        return ClassCity.makeInstance(uid, {
            code,
            name,
            flag_png,
            code_country,
            enabled: enabled !== false,
        });
    }

    static getCityLabel(city, lang = "fr") {
        if (!city) return "";
        const name = city.name ?? city._name;
        if (typeof name === "string") return name.trim() || city.code || "";
        if (name && typeof name === "object") {
            const locale = String(lang ?? "fr").trim().toLowerCase();
            return String(name[locale] ?? name.fr ?? name.en ?? city.code ?? "").trim();
        }
        return String(city.code ?? "").trim();
    }

    static getCityCanonicalName(city) {
        return ClassCity.getCityLabel(city, "fr");
    }

    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassCity) {
                const payload = ClassCity.toJSON(instance);
                if (payload) {
                    for (const [field, collectionPath] of Object.entries(ClassCity.DOC_REF_ARRAY_FIELDS)) {
                        if (Array.isArray(payload[field])) {
                            payload[field] = ClassCity.idsToDocRefs(payload[field], collectionPath);
                        }
                    }
                }
                return payload;
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            const uid = snapshot.id;
            return ClassCity.normalizeFromRaw(uid, raw);
        },
    };
}