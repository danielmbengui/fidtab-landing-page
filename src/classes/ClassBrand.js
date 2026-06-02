import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { ClassFirestore } from "./ClassFirestore";
import { ClassProduct } from "./ClassProduct";

export class ClassBrand extends ClassFirestore {
    static COLLECTION = "BRANDS";
    static NS_COLLECTION = "classes/brands";
    static STORAGE_FOLDER = "brands";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
        //"created_time",
        //"last_edit_time",
    ];
    static CATEGORY = Object.freeze({
        ...ClassProduct.CATEGORY,
        UNKNOWN: "unknown",
    });

    static buildStoragePath(uid = "") {
        const id = String(uid ?? "").trim() || "draft";
        return `${ClassBrand.STORAGE_FOLDER}/${id}/brand.jpg`;
    }

    constructor({
        uid = "",
        uid_company = "system",
        uid_club = "",
        uid_fidtab_brand = "",
        name = "",
        categories = [],
        photo_url = "",
        created_time = new Date(),
        last_edit_time = new Date(),
        storage_url = "",
    }) {
        const _storage_url = storage_url || ClassBrand.buildStoragePath(uid);
        super(uid, created_time, last_edit_time, _storage_url);
        this._uid_company = uid_company;
        this._uid_club = uid_club;
        this._uid_fidtab_brand = String(uid_fidtab_brand ?? "");
        this._name = name;
        this._categories = categories;
        this._photo_url = photo_url;
    }
    get uid_company() {
        return this._uid_company;
    }
    set uid_company(value) {
        this._uid_company = value;
        this._touchLastEdit();
    }
    get uid_club() {
        return this._uid_club;
    }
    set uid_club(value) {
        this._uid_club = value;
        this._touchLastEdit();
    }
    get uid_fidtab_brand() {
        return this._uid_fidtab_brand;
    }
    set uid_fidtab_brand(value) {
        this._uid_fidtab_brand = String(value ?? "");
        this._touchLastEdit();
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        this._touchLastEdit();
    }
    get categories() {
        return this._categories;
    }
    set categories(value) {
        this._categories = value;
        this._touchLastEdit();
    }
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = value;
        this._touchLastEdit();
    }
    static makeInstance(uid, data = {}) {
        return new ClassBrand({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassBrand) {
                return ClassBrand.toJSON(instance);
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            const uid = snapshot.id;
            const data = raw;
            //const country = ClassCountry.getCountryByCode(data.country?.code || data.country_code || "");
            //const gender = ClassUser.formatGenderFromFirestore(data.gender);
            //const scores = ClassUserScores._convertScoresFromFirestore({ ...data.scores, uid_user: uid });
            //console.log("country class user", country);
            //data.gender=gender;
            //data.country = country;
            return ClassBrand.makeInstance(uid, data);
        },
    };

    static colRef() {
        return collection(firestore, this.COLLECTION).withConverter(this.converter);
    }

    static docRef(id) {
        return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
    }

    async createFirestore() {
        if (!this._uid) {
            const newRef = doc(this.constructor.colRef());
            this._uid = newRef.id;
            this._storage_url = ClassBrand.buildStoragePath(newRef.id);
        }
        return super.createFirestore();
    }
}