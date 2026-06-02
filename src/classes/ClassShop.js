import { collection, doc, deleteDoc, getDoc, getDocs, onSnapshot, query, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { ClassFirestore } from "./ClassFirestore";
import { ClassAddress } from "./ClassAddress";
import { ClassContact } from "./ClassContact";
import {
  ClassOpeningHours,
  OPENING_HOURS_WEEKDAYS,
} from "./ClassOpeningHours";
import { ClassCompany } from "./ClassCompany";

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
  return ClassShop.createDefaultAddress();
}

function hydrateContact(value) {
  if (value instanceof ClassContact) return value;
  if (value && typeof value === "object") return ClassContact.fromFirestore(value);
  return ClassShop.createDefaultContact();
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

export class ClassShop extends ClassFirestore {
  static COLLECTION = "SHOPS";
  static STORAGE_FOLDER = "shops";
  static NS_COLLECTION = "classes/shops";
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
    uid = "",
    uid_company = "",
    name = "",
    tag = "",
    address = ClassShop.createDefaultAddress(),
    contact = ClassShop.createDefaultContact(),
    opening_hours = ClassShop.createDefaultOpeningHours(),
    enabled = false,
    created_time = new Date(),
    last_edit_time = new Date(),
  } = {}) {
    const storagePath = `${ClassCompany.STORAGE_FOLDER}/${uid}/logo.jpg`;
    super(uid, created_time, last_edit_time, storagePath);
    this._uid_company = String(uid_company ?? "").trim();
    this._name = String(name ?? "").trim();
    this._tag = String(tag ?? "").trim();
    this._address = hydrateAddress(address);
    this._contact = hydrateContact(contact);
    this._opening_hours = hydrateOpeningHours(opening_hours);
    this._enabled = Boolean(enabled);
  }

  get uid_company() {
    return this._uid_company;
  }
  set uid_company(value) {
    this._uid_company = String(value ?? "").trim();
    this._touchLastEdit();
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

  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = Boolean(value);
    this._touchLastEdit();
  }

  _createFullAddress(countryName = "") {
    return this.address._createFullAddress(countryName);
  }

  static _createFullAddress(shop, countryName = "") {
    const instance =
      shop instanceof ClassShop
        ? shop
        : ClassShop.makeInstance(shop?.uid ?? shop?.id ?? "", shop ?? {});

    return instance._createFullAddress(countryName);
  }

  static toJSON(data = this) {
    const source =
      data instanceof ClassShop
        ? data
        : ClassShop.makeInstance(data?.uid ?? "", data ?? {});

    const cleaned = {
      uid: source.uid,
      uid_company: source.uid_company,
      name: source.name,
      tag: source.tag,
      address: ClassAddress.toFirestore(source.address),
      contact: ClassContact.toFirestore(source.contact),
      opening_hours: ClassOpeningHours.toFirestore(source.opening_hours),
      enabled: source.enabled,
      created_time: source.created_time,
      last_edit_time: source.last_edit_time,
    };

    for (const field of ClassShop.FIELDS_TO_OMIT_FIREBASE) {
      delete cleaned[field];
    }

    return ClassFirestore.omitUndefinedDeep(cleaned);
  }

  static toFirestore(instance = this) {
    if (!(instance instanceof ClassShop)) {
      return ClassFirestore.omitUndefinedDeep(instance);
    }
    return ClassShop.toJSON(instance);
  }

  static makeInstance(uid, data = {}) {
    const payload = migrateLegacyPayload({ ...data, uid });
    return new ClassShop({ uid, ...payload });
  }

  static converter = {
    toFirestore(instance) {
      if (instance instanceof ClassShop) {
        return ClassShop.toJSON(instance);
      }
      return instance;
    },
    fromFirestore(snapshot, options) {
      const raw = snapshot.data(options) ?? {};
      return ClassShop.makeInstance(snapshot.id, raw);
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

  static async getFirestoreForCompany(uidCompany, uid) {
    const normalizedCompany = String(uidCompany ?? "").trim();
    const normalizedUid = String(uid ?? "").trim();
    if (!normalizedCompany || !normalizedUid) return null;

    try {
      const snapshot = await getDoc(ClassShop.docRef(normalizedCompany, normalizedUid));
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      console.error("ClassShop.getFirestoreForCompany", error?.message ?? error);
      return null;
    }
  }

  async createFirestore() {
    if (!this._uid_company) return null;

    const uidCompany = this._uid_company;

    if (!this._uid) {
      const newRef = doc(this.constructor.colRef(uidCompany));
      this._uid = newRef.id;
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
      console.error("ClassStock.updateFirestore", error?.message ?? error);
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
      console.error("ClassStock.removeFirestore", error?.message ?? error);
      return false;
    }
  }
}

export { OPENING_HOURS_WEEKDAYS };
