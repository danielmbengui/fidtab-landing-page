import { collection, collectionGroup, doc, deleteDoc, getDoc, getDocs, onSnapshot, query, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { ClassFirestore } from "./ClassFirestore";
import { ClassContact } from "./ClassContact";
import { ClassProduct } from "./ClassProduct";
import { ClassBrand } from "./ClassBrand";
import { LOCALES } from "@/i18n/locales";

function migrateLegacySocials(payload = {}) {
  const socials = { ...ClassContact.SOCIALS };

  const contact = payload.contact;
  if (contact && typeof contact === "object" && !(contact instanceof ClassContact)) {
    const legacySocials = contact.socials ?? contact;
    if (legacySocials && typeof legacySocials === "object") {
      for (const key of ClassContact.SOCIAL_KEYS) {
        if (legacySocials[key] !== undefined && legacySocials[key] !== "") {
          socials[key] = legacySocials[key];
        }
      }
    }
  }

  if (payload.socials != null && typeof payload.socials === "object") {
    for (const key of ClassContact.SOCIAL_KEYS) {
      if (payload.socials[key] !== undefined) {
        socials[key] = payload.socials[key];
      }
    }
  }

  if (payload.map_embed_url && !socials.google_maps_embed_url) {
    socials.google_maps_embed_url = payload.map_embed_url;
  }
  if (payload.map_link && !socials.google_maps_url) {
    socials.google_maps_url = payload.map_link;
  }

  return ClassContact._normalizeSocials(socials);
}

function migrateLegacyPayload(payload) {
  const out = { ...payload };

  out.socials = migrateLegacySocials(out);

  if (out.tagline && !out.tag) {
    out.tag = out.tagline;
  }

  delete out.address;
  delete out.contact;
  delete out.opening_hours;
  delete out.uid_club;
  delete out.address_street;
  delete out.address_zip;
  delete out.address_city;
  delete out.address_country;
  delete out.phone;
  delete out.phone_label;
  delete out.email_contact;
  delete out.email_orders;
  delete out.tagline;
  delete out.map_embed_url;
  delete out.map_link;

  return out;
}

export class ClassCompany extends ClassFirestore {
  static COLLECTION = "COMPANIES";
  static STORAGE_FOLDER = "companies";
  static NS_COLLECTION = "classes/company";
  static DEFAULT_UID = "default";
  static FIELDS_TO_OMIT_FIREBASE = [...ClassFirestore.FIELDS_TO_OMIT_FIREBASE];
  static AMOUNT_TO_EARN_ONE_POINT = 75;
  static CURRENCY_TO_EARN_ONE_POINT = "CHF";
  static UIDS_PRIDUCTS_PROHIBITED_FROM_EARNING_POINTS = [];

  static createDefaultSocials() {
    return new ClassContact({}).socials;
  }

  constructor({
    uid = ClassCompany.DEFAULT_UID,
    name = "",
    tag="",
    banners=[],
    socials = ClassCompany.createDefaultSocials(),
    logo_url = "",
    settings = null,
    created_time = new Date(),
    last_edit_time = new Date(),
  } = {}) {
    const storagePath = `${ClassCompany.STORAGE_FOLDER}/${uid}/logo.jpg`;
    super(uid, created_time, last_edit_time, storagePath);
    this._name = String(name ?? "").trim();
    this._tag = String(tag ?? "").trim();
    this._banners = normalizeCompanyBanners(banners);
    this._socials = ClassContact._normalizeSocials(socials);
    this._logo_url = String(logo_url ?? "").trim();
    this._settings = settings ? new ClassCompagnySettings(settings) : null;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = String(value ?? "").trim();
    this._touchLastEdit();
  }
  get tag() {
    return this._tag;
  }
  set tag(value) {
    this._tag = String(value ?? "").trim();
    this._touchLastEdit();
  }
  get banners() {
    return this._banners;
  }
  set banners(value) {
    this._banners = normalizeCompanyBanners(value);
    this._touchLastEdit();
  }

  get logo_url() {
    return this._logo_url;
  }
  set logo_url(value) {
    this._logo_url = String(value ?? "").trim();
    this._touchLastEdit();
  }

  get socials() {
    return this._socials;
  }
  set socials(value) {
    this._socials = ClassContact._normalizeSocials(value);
    this._touchLastEdit();
  }

  get settings() {
    return this._settings;
  }
  set settings(value) {
    this._settings = value ? new ClassCompagnySettings(value) : null;
    this._touchLastEdit();
  }

  static toJSON(data = this) {
    const source =
      data instanceof ClassCompany
        ? data
        : ClassCompany.makeInstance(data?.uid ?? ClassCompany.DEFAULT_UID, data ?? {});

    const cleaned = {
      uid: source.uid,
      name: source.name,
      tag: source.tag,
      banners: normalizeCompanyBanners(source.banners),
      socials: ClassContact._normalizeSocials(source.socials),
      logo_url: source.logo_url,
      settings: source.settings ? source.settings.toJSON() : null,
      created_time: source.created_time,
      last_edit_time: source.last_edit_time,
    };

    for (const field of ClassCompany.FIELDS_TO_OMIT_FIREBASE) {
      delete cleaned[field];
    }

    return ClassFirestore.omitUndefinedDeep(cleaned);
  }

  static toFirestore(instance = this) {
    if (!(instance instanceof ClassCompany)) {
      return ClassFirestore.omitUndefinedDeep(instance);
    }
    return ClassCompany.toJSON(instance);
  }

  static makeInstance(uid, data = {}) {
    const payload = migrateLegacyPayload({ ...data, uid });
    return new ClassCompany(payload);
  }

  static fromDefaults(uid = ClassCompany.DEFAULT_UID) {
    return new ClassCompany({ uid });
  }

  static converter = {
    toFirestore(instance) {
      if (instance instanceof ClassCompany) {
        return ClassCompany.toFirestore(instance);
      }
      return instance;
    },
    fromFirestore(snapshot, options) {
      const raw = snapshot.data(options) ?? {};
      raw.settings = raw.settings ? new ClassCompagnySettings(raw.settings) : null;
      return ClassCompany.makeInstance(snapshot.id, raw);
    },
  };

  static colRef() {
    return collection(firestore, this.COLLECTION).withConverter(this.converter);
  }

  static docRef(id) {
    return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
  }

  static async getOrCreateDefault() {
    const existing = await ClassCompany.getFirestore(ClassCompany.DEFAULT_UID);
    if (existing) return existing;

    const created = ClassCompany.fromDefaults();
    await created.createFirestore();
    return created;
  }

  /**
   * Écoute le document établissement en temps réel.
   * @param {string} uid
   * @param {(company: ClassCompany | null) => void} onChange
   * @param {(error: Error) => void} [onError]
   * @returns {() => void}
   */
  static subscribeFirestore(uid, onChange, onError) {
    if (!uid) {
      onChange(null);
      return () => { };
    }

    return onSnapshot(
      ClassCompany.docRef(uid),
      (snapshot) => {
        onChange(snapshot.exists() ? snapshot.data() : null);
      },
      onError,
    );
  }

  async createFirestore() {
    if (!this._uid) {
      this._uid = ClassCompany.DEFAULT_UID;
    }
    this._storage_url = `${ClassCompany.STORAGE_FOLDER}/${this._uid}/logo.jpg`;
    return super.createFirestore();
  }

  async updateFirestore() {
    return super.updateFirestore();
  }
}

function normalizeCompanyBannerItem(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const banner = {
    enabled: value.enabled !== false,
  };
  for (const locale of LOCALES) {
    banner[locale] = String(value[locale] ?? "").trim();
  }

  return LOCALES.some((locale) => banner[locale]) ? banner : null;
}

function normalizeCompanyBanners(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => normalizeCompanyBannerItem(item))
    .filter(Boolean);
}

function normalizeProhibitedProductUids(value) {
  if (Array.isArray(value)) {
    return value.map((uid) => String(uid ?? "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,;]+/)
      .map((uid) => uid.trim())
      .filter(Boolean);
  }
  return [];
}

export class ClassCompagnySettings {
  static AMOUNT_TO_EARN_ONE_POINT = 75;
  static MIN_AMOUNT_TO_EARN_ONE_POINT = 75;
  static MAX_AMOUNT_TO_EARN_ONE_POINT = 75;
  static AMOUNT_TO_USE_ONE_POINT = 1;
  static CURRENCY_TO_EARN_ONE_POINT = "CHF";
  static UIDS_PRIDUCTS_PROHIBITED_FROM_EARNING_POINTS = [];
  constructor({
    amount_to_earn_one_point = ClassCompagnySettings.AMOUNT_TO_EARN_ONE_POINT,
    min_amount_to_earn_one_point,
    max_amount_to_earn_one_point,
    amount_to_use_one_point = ClassCompagnySettings.AMOUNT_TO_USE_ONE_POINT,
    currency_to_earn_one_point = ClassCompagnySettings.CURRENCY_TO_EARN_ONE_POINT,
    uids_products_prohibited_from_earning_points = ClassCompagnySettings.UIDS_PRIDUCTS_PROHIBITED_FROM_EARNING_POINTS,
    has_fidtab_website=false,
    show_banner_promotion = false,
    last_edit_time = new Date(),
  }) {
    const legacyAmount = Number(
      amount_to_earn_one_point ?? ClassCompagnySettings.AMOUNT_TO_EARN_ONE_POINT,
    )
    this._amount_to_earn_one_point = legacyAmount
    this._min_amount_to_earn_one_point = Number(
      min_amount_to_earn_one_point ?? legacyAmount,
    )
    this._max_amount_to_earn_one_point = Number(
      max_amount_to_earn_one_point ?? legacyAmount,
    )
    this._amount_to_use_one_point = Number(
      amount_to_use_one_point ?? ClassCompagnySettings.AMOUNT_TO_USE_ONE_POINT,
    );
    this._currency_to_earn_one_point = String(
      currency_to_earn_one_point ?? ClassCompagnySettings.CURRENCY_TO_EARN_ONE_POINT,
    );
    this._uids_products_prohibited_from_earning_points = normalizeProhibitedProductUids(
      uids_products_prohibited_from_earning_points,
    );
    this._has_fidtab_website = Boolean(has_fidtab_website);
    this._show_banner_promotion = show_banner_promotion;
    this._last_edit_time = ClassFirestore._toJsDate(last_edit_time);
  }
  get amount_to_earn_one_point() {
    return this._amount_to_earn_one_point;
  }
  get min_amount_to_earn_one_point() {
    return this._min_amount_to_earn_one_point;
  }
  get max_amount_to_earn_one_point() {
    return this._max_amount_to_earn_one_point;
  }
  get amount_to_use_one_point() {
    return this._amount_to_use_one_point;
  }
  get currency_to_earn_one_point() {
    return this._currency_to_earn_one_point;
  }
  get uids_products_prohibited_from_earning_points() {
    return this._uids_products_prohibited_from_earning_points;
  }
  get has_fidtab_website() {
    return this._has_fidtab_website;
  }
  get show_banner_promotion() {
    return this._show_banner_promotion;
  }
  get last_edit_time() {
    return this._last_edit_time;
  }
  set amount_to_earn_one_point(value) {
    this._amount_to_earn_one_point = Number(value ?? ClassCompagnySettings.AMOUNT_TO_EARN_ONE_POINT);
  }
  set min_amount_to_earn_one_point(value) {
    this._min_amount_to_earn_one_point = Number(
      value ?? ClassCompagnySettings.MIN_AMOUNT_TO_EARN_ONE_POINT,
    );
  }
  set max_amount_to_earn_one_point(value) {
    this._max_amount_to_earn_one_point = Number(
      value ?? ClassCompagnySettings.MAX_AMOUNT_TO_EARN_ONE_POINT,
    );
  }
  set amount_to_use_one_point(value) {
    this._amount_to_use_one_point = Number(value ?? ClassCompagnySettings.AMOUNT_TO_USE_ONE_POINT);
  }
  set currency_to_earn_one_point(value) {
    this._currency_to_earn_one_point = String(value ?? ClassCompagnySettings.CURRENCY_TO_EARN_ONE_POINT);
  }
  set uids_products_prohibited_from_earning_points(value) {
    this._uids_products_prohibited_from_earning_points = normalizeProhibitedProductUids(value);
  }
  set has_fidtab_website(value) {
    this._has_fidtab_website = Boolean(value);
  }
  set show_banner_promotion(value) {
    this._show_banner_promotion = value;
  }
  set last_edit_time(value) {
    this._last_edit_time = ClassFirestore._toJsDate(value);
  }
  toJSON() {
    return {
      amount_to_earn_one_point: this._min_amount_to_earn_one_point,
      min_amount_to_earn_one_point: this._min_amount_to_earn_one_point,
      max_amount_to_earn_one_point: this._max_amount_to_earn_one_point,
      amount_to_use_one_point: this._amount_to_use_one_point,
      currency_to_earn_one_point: this._currency_to_earn_one_point,
      uids_products_prohibited_from_earning_points: this._uids_products_prohibited_from_earning_points,
      has_fidtab_website: this._has_fidtab_website,
      show_banner_promotion: this._show_banner_promotion,
      last_edit_time: this._last_edit_time,
    };
  }
  toFirestore() {
    return {
      amount_to_earn_one_point: this._min_amount_to_earn_one_point,
      min_amount_to_earn_one_point: this._min_amount_to_earn_one_point,
      max_amount_to_earn_one_point: this._max_amount_to_earn_one_point,
      amount_to_use_one_point: this._amount_to_use_one_point,
      currency_to_earn_one_point: this._currency_to_earn_one_point,
      uids_products_prohibited_from_earning_points: this._uids_products_prohibited_from_earning_points,
      has_fidtab_website: this._has_fidtab_website,
      show_banner_promotion: this._show_banner_promotion,
      last_edit_time: this._last_edit_time,
    };
  }
}
export class ClassCompanyProduct extends ClassProduct {
  static COLLECTION = "PRODUCTS";
  static STORAGE_FOLDER = "products";

  constructor(data = {}) {
    const uidCompany = String(data.uid_company ?? ClassCompany.DEFAULT_UID).trim();
    const uid = data.uid ?? "";
    const storage_url =
      data.storage_url ||
      `${ClassCompany.STORAGE_FOLDER}/${uidCompany}/${ClassCompanyProduct.STORAGE_FOLDER}/${uid || "draft"}/product.jpg`;

    super({ ...data, uid_company: uidCompany, storage_url });
  }

  static makeInstance(uid, data = {}) {
    return new ClassCompanyProduct({ uid, ...data });
  }

  static async listFirestoreForCompany(uidCompany, constraints = []) {
    if (!uidCompany) return [];
    const q =
      constraints.length > 0
        ? query(this.colRef(uidCompany), ...constraints)
        : query(this.colRef(uidCompany));
    const snap = await getDocs(q);
    return snap.docs.map((entry) => entry.data());
  }

  static async getFirestoreForCompany(uidCompany, uid) {
    if (!uidCompany || !uid) return null;
    try {
      const snap = await getDoc(this.docRef(uidCompany, uid));
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error("ClassCompanyProduct.getFirestoreForCompany", error?.message ?? error);
      return null;
    }
  }

  static converter = {
    toFirestore(instance) {
      if (instance instanceof ClassCompanyProduct) {
        return ClassCompanyProduct.toJSON(instance);
      }
      return instance;
    },
    fromFirestore(snapshot, options) {
      const raw = snapshot.data(options) ?? {};
      return ClassCompanyProduct.makeInstance(snapshot.id, raw);
    },
  };

  static colRef(uidCompany) {
    return collection(
      firestore,
      `${ClassCompany.COLLECTION}/${uidCompany}/${this.COLLECTION}`,
    ).withConverter(this.converter);
  }

  static colGroupRef() {
    return collectionGroup(firestore, this.COLLECTION).withConverter(this.converter);
  }

  static docRef(uidCompany, id) {
    return doc(
      firestore,
      `${ClassCompany.COLLECTION}/${uidCompany}/${this.COLLECTION}`,
      id,
    ).withConverter(this.converter);
  }

  async createFirestore() {
    if (!this._uid_company) return null;

    const uidCompany = this._uid_company;

    if (!this._uid) {
      const newRef = doc(this.constructor.colRef(uidCompany));
      this._uid = newRef.id;
      this._storage_url = `${ClassCompany.STORAGE_FOLDER}/${uidCompany}/${ClassCompanyProduct.STORAGE_FOLDER}/${newRef.id}/product.jpg`;
    }

    if (!String(this._bar_code_number ?? "").trim()) {
      this._bar_code_number = ClassProduct.createBarCodeNumber(
        this._category,
        this._sub_category,
        this._type,
        this._uid,
      );
    }

    const ref = this.constructor.docRef(uidCompany, this._uid);
    await setDoc(ref, this, { merge: true });
    return this.constructor.makeInstance(this._uid, {
      ...this.constructor.toJSON(this),
      uid_company: uidCompany,
    });
  }

  async updateFirestore() {
    if (!this._uid_company || !this._uid) return null;

    try {
      const ref = this.constructor.docRef(this._uid_company, this._uid);
      await setDoc(ref, this, { merge: true });
      return this.constructor.makeInstance(this._uid, {
        ...this.constructor.toJSON(this),
        uid_company: this._uid_company,
      });
    } catch (error) {
      console.error("ClassCompanyProduct.updateFirestore", error?.message ?? error);
      return null;
    }
  }

  async removeFirestore() {
    if (!this._uid_company || !this._uid) return null;

    try {
      const ref = this.constructor.docRef(this._uid_company, this._uid);
      await deleteDoc(ref);
      return true;
    } catch (error) {
      console.error("ClassCompanyProduct.removeFirestore", error?.message ?? error);
      return false;
    }
  }
}
export class ClassCompanyBrand extends ClassBrand {
  static COLLECTION = "BRANDS";
  static NS_COLLECTION = "classes/brands";
  static STORAGE_FOLDER = "brands";
  static FIELDS_TO_OMIT_FIREBASE = [
      ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
      //"created_time",
      //"last_edit_time",
  ];
  constructor(data = {}) {
    const uidCompany = String(data.uid_company ?? ClassCompany.DEFAULT_UID).trim();
    const uid = data.uid ?? "";
    const storage_url =
      data.storage_url ||
      `${ClassCompany.STORAGE_FOLDER}/${uidCompany}/${ClassCompanyBrand.STORAGE_FOLDER}/${uid || "draft"}/brand.jpg`;

    super({ ...data, uid_company: uidCompany, storage_url });
  }
  static makeInstance(uid, data = {}) {
      return new ClassCompanyBrand({ uid, ...data });
  }
  // ── Converter Firestore ──────────────────────────────────
  static converter = {
      toFirestore(instance) {
          if (instance instanceof ClassCompanyBrand) {
              return ClassCompanyBrand.toJSON(instance);
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
          return ClassCompanyBrand.makeInstance(uid, data);
      },
  };

  static colRef(uidCompany = ClassCompany.DEFAULT_UID) {
      return collection(firestore, `${ClassCompany.COLLECTION}/${uidCompany}/${this.COLLECTION}`).withConverter(this.converter);
  }

  static docRef(uidCompany = ClassCompany.DEFAULT_UID, id) {
      return doc(firestore, `${ClassCompany.COLLECTION}/${uidCompany}/${this.COLLECTION}`, id).withConverter(this.converter);
  }

  static async listFirestoreForCompany(uidCompany, constraints = []) {
    if (!uidCompany) return [];
    const q =
      constraints.length > 0
        ? query(this.colRef(uidCompany), ...constraints)
        : query(this.colRef(uidCompany));
    const snap = await getDocs(q);
    return snap.docs.map((entry) => entry.data());
  }

  static async getFirestoreForCompany(uidCompany, uidBrand) {
    if (!uidCompany || !uidBrand) return null;
    try {
      const snap = await getDoc(this.docRef(uidCompany, uidBrand));
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error("ClassCompanyBrand.getFirestoreForCompany", error?.message ?? error);
      return null;
    }
  }

  async createFirestore() {
    if (!this._uid_company) return null;

    const uidCompany = this._uid_company;

    if (!this._uid) {
      const newRef = doc(this.constructor.colRef(uidCompany));
      this._uid = newRef.id;
      this._storage_url = `${ClassCompany.STORAGE_FOLDER}/${uidCompany}/${ClassCompanyBrand.STORAGE_FOLDER}/${newRef.id}/brand.jpg`;
    }

    const ref = this.constructor.docRef(uidCompany, this._uid);
    await setDoc(ref, this, { merge: true });
    return this.constructor.makeInstance(this._uid, {
      ...this.constructor.toJSON(this),
      uid_company: uidCompany,
    });
  }
  async updateFirestore() {
    if (!this._uid_company || !this._uid) return null;

    try {
      const ref = this.constructor.docRef(this._uid_company, this._uid);
      await setDoc(ref, this, { merge: true });
      return this.constructor.makeInstance(this._uid, {
        ...this.constructor.toJSON(this),
        uid_company: this._uid_company,
      });
    } catch (error) {
      console.error("ClassCompanyBrand.updateFirestore", error?.message ?? error);
      return null;
    }
  }

  async removeFirestore() {
    if (!this._uid_company || !this._uid) return null;

    try {
      const ref = this.constructor.docRef(this._uid_company, this._uid);
      await deleteDoc(ref);
      return true;
    } catch (error) {
      console.error("ClassCompanyBrand.removeFirestore", error?.message ?? error);
      return false;
    }
  }
}
