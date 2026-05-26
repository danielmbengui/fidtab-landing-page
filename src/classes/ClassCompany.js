import { collection, doc, deleteDoc, getDoc, getDocs, onSnapshot, query, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { ClassFirestore } from "./ClassFirestore";
import { ClassAddress } from "./ClassAddress";
import { ClassContact } from "./ClassContact";
import {
  ClassOpeningHours,
  OPENING_HOURS_WEEKDAYS,
} from "./ClassOpeningHours";
import { ClassProduct } from "./ClassProduct";
import { ClassBrand } from "./ClassBrand";

function normalizeBusLines(value) {
  return ClassAddress.normalizePublicTransportBuses(value);
}

function contactFromLegacyFields(payload) {
  const emails = [];
  if (payload.email_contact) {
    emails.push({ type: ClassContact.TYPE_EMAIL.CONTACT, value: payload.email_contact });
  }
  if (payload.email_orders) {
    emails.push({ type: ClassContact.TYPE_EMAIL.ORDERS, value: payload.email_orders });
  }

  const phones = [];
  if (payload.phone) {
    phones.push({
      type: payload.phone_label || ClassContact.TYPE_PHONE.SHOP,
      value: payload.phone,
    });
  }

  if (!emails.length && !phones.length) return null;
  return new ClassContact({ emails, phones });
}

function addressFromLegacyFields(payload) {
  if (!payload.address_street && !payload.address_city && !payload.address_zip) {
    return null;
  }

  return new ClassAddress({
    street: payload.address_street ?? "",
    zip_code: payload.address_zip ?? "",
    city_name: payload.address_city ?? "",
    country_code: payload.address_country ?? "",
    public_transport_buses: normalizeBusLines(payload.public_transport_buses),
  });
}

function hydrateAddress(value) {
  if (value instanceof ClassAddress) return value;
  if (value && typeof value === "object") return new ClassAddress(value);
  return ClassCompany.createDefaultAddress();
}

function hydrateContact(value) {
  if (value instanceof ClassContact) return value;
  if (value && typeof value === "object") return ClassContact.fromFirestore(value);
  return ClassCompany.createDefaultContact();
}

function hydrateOpeningHours(value) {
  if (value instanceof ClassOpeningHours) return value;
  return ClassOpeningHours.fromFirestore(value ?? {});
}

function migrateLegacyPayload(payload) {
  const out = { ...payload };

  if (!out.address) {
    out.address = addressFromLegacyFields(out);
  }

  if (!out.contact) {
    out.contact = contactFromLegacyFields(out);
  }

  if (out.contact && typeof out.contact === "object" && !(out.contact instanceof ClassContact)) {
    const socials = { ...ClassContact.SOCIALS };
    for (const key of ClassContact.SOCIAL_KEYS) {
      if (out.contact[key] !== undefined) {
        socials[key] = out.contact[key];
      }
    }
    if (out.contact.socials != null && typeof out.contact.socials === "object") {
      for (const key of ClassContact.SOCIAL_KEYS) {
        if (out.contact.socials[key] !== undefined) {
          socials[key] = out.contact.socials[key];
        }
      }
    }
    if (out.map_embed_url && !socials.google_maps_embed_url) {
      socials.google_maps_embed_url = out.map_embed_url;
    }
    if (out.map_link && !socials.google_maps_url) {
      socials.google_maps_url = out.map_link;
    }
    out.contact = { ...out.contact, socials };
  }

  if (out.tagline && !out.tag) {
    out.tag = out.tagline;
  }

  if (Array.isArray(out.opening_hours)) {
    delete out.opening_hours;
  }

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

  static createDefaultAddress() {
    return new ClassAddress({ country_code: "CH" });
  }

  static createDefaultContact() {
    return new ClassContact({});
  }

  static createDefaultOpeningHours() {
    return new ClassOpeningHours({});
  }

  constructor({
    uid = ClassCompany.DEFAULT_UID,
    name = "",
    tag = "",
    address = ClassCompany.createDefaultAddress(),
    contact = ClassCompany.createDefaultContact(),
    opening_hours = ClassCompany.createDefaultOpeningHours(),
    logo_url = "",
    settings = null,
    created_time = new Date(),
    last_edit_time = new Date(),
  } = {}) {
    const storagePath = `${ClassCompany.STORAGE_FOLDER}/${uid}/logo.jpg`;
    super(uid, created_time, last_edit_time, storagePath);
    this._name = String(name ?? "").trim();
    this._tag = String(tag ?? "").trim();
    this._address = hydrateAddress(address);
    this._contact = hydrateContact(contact);
    this._opening_hours = hydrateOpeningHours(opening_hours);
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

  get address() {
    return this._address;
  }
  set address(value) {
    this._address = hydrateAddress(value);
    this._touchLastEdit();
  }

  get contact() {
    return this._contact;
  }
  set contact(value) {
    this._contact = hydrateContact(value);
    this._touchLastEdit();
  }

  get opening_hours() {
    return this._opening_hours;
  }
  set opening_hours(value) {
    this._opening_hours = hydrateOpeningHours(value);
    this._touchLastEdit();
  }

  get logo_url() {
    return this._logo_url;
  }
  set logo_url(value) {
    this._logo_url = String(value ?? "").trim();
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
      address: ClassAddress.toFirestore(source.address),
      contact: ClassContact.toFirestore(source.contact),
      opening_hours: ClassOpeningHours.toFirestore(source.opening_hours),
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
  static AMOUNT_TO_USE_ONE_POINT = 1;
  static CURRENCY_TO_EARN_ONE_POINT = "CHF";
  static UIDS_PRIDUCTS_PROHIBITED_FROM_EARNING_POINTS = [];
  constructor({
    amount_to_earn_one_point = ClassCompagnySettings.AMOUNT_TO_EARN_ONE_POINT,
    amount_to_use_one_point = ClassCompagnySettings.AMOUNT_TO_USE_ONE_POINT,
    currency_to_earn_one_point = ClassCompagnySettings.CURRENCY_TO_EARN_ONE_POINT,
    uids_products_prohibited_from_earning_points = ClassCompagnySettings.UIDS_PRIDUCTS_PROHIBITED_FROM_EARNING_POINTS,
    show_banner_promotion = false,
    last_edit_time = new Date(),
  }) {
    this._amount_to_earn_one_point = Number(
      amount_to_earn_one_point ?? ClassCompagnySettings.AMOUNT_TO_EARN_ONE_POINT,
    );
    this._amount_to_use_one_point = Number(
      amount_to_use_one_point ?? ClassCompagnySettings.AMOUNT_TO_USE_ONE_POINT,
    );
    this._currency_to_earn_one_point = String(
      currency_to_earn_one_point ?? ClassCompagnySettings.CURRENCY_TO_EARN_ONE_POINT,
    );
    this._uids_products_prohibited_from_earning_points = normalizeProhibitedProductUids(
      uids_products_prohibited_from_earning_points,
    );
    this._show_banner_promotion = show_banner_promotion;
    this._last_edit_time = ClassFirestore._toJsDate(last_edit_time);
  }
  get amount_to_earn_one_point() {
    return this._amount_to_earn_one_point;
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
  get show_banner_promotion() {
    return this._show_banner_promotion;
  }
  get last_edit_time() {
    return this._last_edit_time;
  }
  set amount_to_earn_one_point(value) {
    this._amount_to_earn_one_point = Number(value ?? ClassCompagnySettings.AMOUNT_TO_EARN_ONE_POINT);
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
  set show_banner_promotion(value) {
    this._show_banner_promotion = value;
  }
  set last_edit_time(value) {
    this._last_edit_time = ClassFirestore._toJsDate(value);
  }
  toJSON() {
    return {
      amount_to_earn_one_point: this._amount_to_earn_one_point,
      amount_to_use_one_point: this._amount_to_use_one_point,
      currency_to_earn_one_point: this._currency_to_earn_one_point,
      uids_products_prohibited_from_earning_points: this._uids_products_prohibited_from_earning_points,
      show_banner_promotion: this._show_banner_promotion,
      last_edit_time: this._last_edit_time,
    };
  }
  toFirestore() {
    return {
      amount_to_earn_one_point: this._amount_to_earn_one_point,
      amount_to_use_one_point: this._amount_to_use_one_point,
      currency_to_earn_one_point: this._currency_to_earn_one_point,
      uids_products_prohibited_from_earning_points: this._uids_products_prohibited_from_earning_points,
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

export { OPENING_HOURS_WEEKDAYS };
