import { formatPhoneCompact } from "@/context/functions/functions_phone";
import { ClassFirestore } from "./ClassFirestore";

export class ClassContact {
    /** Types d’adresses e-mail. */
    static TYPE_EMAIL = Object.freeze({
        CONTACT: "contact",
        SUPPORT: "support",
        PROMOTIONS: "promotions",
        FIDELITY: "fidelity",
        ORDERS: "orders",
        OTHER: "other",
    });

    /** Types de numéros de téléphone. */
    static TYPE_PHONE = Object.freeze({
        SHOP: "shop",
        CUSTOMER_SERVICE: "customer_service",
        OTHER: "other",
    });

    static SOCIALS = {
        website_url: "",
        whatsapp_phone_number: "",
        telegram_url: "",
        google_maps_url: "",
        google_maps_embed_url: "",
        google_play_store_url: "",
        apple_store_url: "",
        instagram_url: "",
        facebook_url: "",
        linkedin_url: "",
        tiktok_url: "",
        twitter_url: "",
        youtube_url: "",
    };
    static SOCIAL_KEYS = Object.freeze(Object.keys(ClassContact.SOCIALS));

    constructor(raw = {}) {
        const data = ClassContact.normalizePayload(raw);
        this._emails = ClassContact._normalizeEmailsArray(data.emails);
        this._phones = ClassContact._normalizePhonesArray(data.phones);
        this._socials = ClassContact._normalizeSocials(data.socials);
    }

    static normalizePayload(data = {}) {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return { emails: [], phones: [], socials: {} };
        }

        const raw = {};
        for (const [key, value] of Object.entries(data)) {
            const normalizedKey = key.startsWith("_") ? key.slice(1) : key;
            raw[normalizedKey] = value;
        }

        const emails = raw.emails ?? [];
        const phones = raw.phones ?? [];
        const socials = { ...ClassContact.SOCIALS };

        // Legacy : champs plats au niveau contact (migration depuis l’ancien schéma).
        for (const key of ClassContact.SOCIAL_KEYS) {
            if (raw[key] !== undefined) {
                socials[key] = raw[key];
            }
        }

        // Objet nested `socials` : prioritaire sur les champs plats legacy.
        if (raw.socials != null && typeof raw.socials === "object" && !Array.isArray(raw.socials)) {
            for (const key of ClassContact.SOCIAL_KEYS) {
                if (raw.socials[key] !== undefined) {
                    socials[key] = raw.socials[key];
                }
            }
        }

        return { emails, phones, socials };
    }

    static _normalizeString(value) {
        if (value === undefined || value === null) return "";
        return String(value).trim();
    }

    static _resolveEmailType(rawType) {
        const normalized = ClassContact._normalizeString(rawType).toLowerCase();
        const allowed = Object.values(ClassContact.TYPE_EMAIL);
        if (allowed.includes(normalized)) return normalized;

        if (["général", "general", "contact", "info"].includes(normalized)) {
            return ClassContact.TYPE_EMAIL.CONTACT;
        }
        if (["commandes", "orders", "order"].includes(normalized)) {
            return ClassContact.TYPE_EMAIL.ORDERS;
        }
        if (["support", "sav"].includes(normalized)) {
            return ClassContact.TYPE_EMAIL.SUPPORT;
        }
        if (["fidélité", "fidelite", "fidelity", "loyalty"].includes(normalized)) {
            return ClassContact.TYPE_EMAIL.FIDELITY;
        }

        return ClassContact.TYPE_EMAIL.OTHER;
    }

    static _resolvePhoneType(rawType) {
        const normalized = ClassContact._normalizeString(rawType).toLowerCase();
        const allowed = Object.values(ClassContact.TYPE_PHONE);
        if (allowed.includes(normalized)) return normalized;

        if (["boutique", "shop", "magasin", "store"].includes(normalized)) {
            return ClassContact.TYPE_PHONE.SHOP;
        }
        if (["service client", "customer service", "customer_service", "sav"].includes(normalized)) {
            return ClassContact.TYPE_PHONE.CUSTOMER_SERVICE;
        }

        return ClassContact.TYPE_PHONE.OTHER;
    }

    static _normalizeEmailEntry(entry) {
        if (entry == null) return null;

        if (typeof entry === "string") {
            const value = ClassContact._normalizeString(entry);
            if (!value) return null;
            return {
                type: ClassContact.TYPE_EMAIL.CONTACT,
                value,
            };
        }

        if (typeof entry === "object") {
            const value = ClassContact._normalizeString(entry.value);
            if (!value) return null;
            return {
                type: ClassContact._resolveEmailType(entry.type),
                value,
            };
        }

        return null;
    }

    static _normalizePhoneEntry(entry) {
        if (entry == null) return null;

        if (typeof entry === "string") {
            const value = formatPhoneCompact(ClassContact._normalizeString(entry));
            if (!value) return null;
            return {
                type: ClassContact.TYPE_PHONE.SHOP,
                value,
            };
        }

        if (typeof entry === "object") {
            const value = formatPhoneCompact(ClassContact._normalizeString(entry.value));
            if (!value) return null;
            return {
                type: ClassContact._resolvePhoneType(entry.type),
                value,
            };
        }

        return null;
    }

    static _normalizeEmailsArray(value) {
        if (!Array.isArray(value)) return [];
        return value
            .map((entry) => ClassContact._normalizeEmailEntry(entry))
            .filter(Boolean);
    }

    static _normalizePhonesArray(value) {
        if (!Array.isArray(value)) return [];
        return value
            .map((entry) => ClassContact._normalizePhoneEntry(entry))
            .filter(Boolean);
    }

    static _normalizeSocialEntry(entry) {
        const base = { ...ClassContact.SOCIALS };
        if (entry == null || typeof entry !== "object" || Array.isArray(entry)) {
            return { ...base };
        }

        const out = { ...base };
        for (const key of ClassContact.SOCIAL_KEYS) {
            if (key in entry) {
                out[key] = ClassContact._normalizeString(entry[key]);
            }
        }
        return out;
    }

    static _normalizeSocials(value) {
        if (value == null) return { ...ClassContact.SOCIALS };
        if (typeof value === "object" && !Array.isArray(value)) {
            return ClassContact._normalizeSocialEntry(value);
        }
        return { ...ClassContact.SOCIALS };
    }

    get emails() {
        return this._emails.map((entry) => ({ ...entry }));
    }

    set emails(value) {
        this._emails = ClassContact._normalizeEmailsArray(value);
    }

    get phones() {
        return this._phones.map((entry) => ({ ...entry }));
    }

    set phones(value) {
        this._phones = ClassContact._normalizePhonesArray(value);
    }

    get socials() {
        return { ...this._socials };
    }

    set socials(value) {
        this._socials = ClassContact._normalizeSocials(value);
    }

    static toJSON(data = this) {
        const source = data instanceof ClassContact ? data : ClassContact.fromFirestore(data);

        return ClassFirestore.omitUndefinedDeep({
            emails: source.emails.map((entry) => ({ ...entry })),
            phones: source.phones.map((entry) => ({ ...entry })),
            socials: { ...source.socials },
        });
    }

    static toFirestore(data = this) {
        return ClassContact.toJSON(data);
    }

    static fromFirestore(data = {}) {
        return new ClassContact(data);
    }
}
