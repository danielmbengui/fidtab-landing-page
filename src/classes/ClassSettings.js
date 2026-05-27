import { collection, doc, onSnapshot } from "firebase/firestore";
import { ClassFirestore } from "./ClassFirestore";
import { firestore } from "@/lib/firebaseConfig";

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

export class ClassSettings extends ClassFirestore {
  static DEFAULT_UID = "bgULm1LsYYG5JzwjXqPW";
  static COLLECTION = "SETTINGS";
  static NS_COLLECTION = "classes/settings";
  static FIELDS_TO_OMIT_FIREBASE = [...ClassFirestore.FIELDS_TO_OMIT_FIREBASE];

  static MIN_AMOUNT_TO_EARN_ONE_POINT = 10;
  static MAX_AMOUNT_TO_EARN_ONE_POINT = 150;
  static AMOUNT_TO_USE_ONE_POINT = 1;
  static DEFAULT_CURRENCY = "CHF";

  constructor({
    uid = ClassSettingsFidTab.DEFAULT_UID,
    min_amount_to_earn_one_point = ClassSettingsFidTab.MIN_AMOUNT_TO_EARN_ONE_POINT,
    max_amount_to_earn_one_point = ClassSettingsFidTab.MAX_AMOUNT_TO_EARN_ONE_POINT,
    amount_to_use_one_point = ClassSettingsFidTab.AMOUNT_TO_USE_ONE_POINT,
    currency_to_earn_one_point = ClassSettingsFidTab.DEFAULT_CURRENCY,
    uids_products_prohibited_from_earning_points = [],
    created_time = new Date(),
    last_edit_time = new Date(),
  } = {}) {
    super(uid, created_time, last_edit_time, "");
    this._min_amount_to_earn_one_point = Number(
      min_amount_to_earn_one_point ?? ClassSettingsFidTab.MIN_AMOUNT_TO_EARN_ONE_POINT,
    );
    this._max_amount_to_earn_one_point = Number(
      max_amount_to_earn_one_point ?? ClassSettingsFidTab.MAX_AMOUNT_TO_EARN_ONE_POINT,
    );
    this._amount_to_use_one_point = Number(
      amount_to_use_one_point ?? ClassSettingsFidTab.AMOUNT_TO_USE_ONE_POINT,
    );
    this._currency_to_earn_one_point = currency_to_earn_one_point ?? ClassSettingsFidTab.DEFAULT_CURRENCY;
    this._uids_products_prohibited_from_earning_points = normalizeProhibitedProductUids(
      uids_products_prohibited_from_earning_points,
    );
  }

  get min_amount_to_earn_one_point() {
    return this._min_amount_to_earn_one_point;
  }
  set min_amount_to_earn_one_point(value) {
    this._min_amount_to_earn_one_point = Number(
      value ?? ClassSettingsFidTab.MIN_AMOUNT_TO_EARN_ONE_POINT,
    );
  }
  get max_amount_to_earn_one_point() {
    return this._max_amount_to_earn_one_point;
  }
  set max_amount_to_earn_one_point(value) {
    this._max_amount_to_earn_one_point = Number(
      value ?? ClassSettingsFidTab.MAX_AMOUNT_TO_EARN_ONE_POINT,
    );
  }
  get amount_to_use_one_point() {
    return this._amount_to_use_one_point;
  }
  set amount_to_use_one_point(value) {
    this._amount_to_use_one_point = Number(
      value ?? ClassSettingsFidTab.AMOUNT_TO_USE_ONE_POINT,
    );
    this._touchLastEdit();
  }

  get currency_to_earn_one_point() {
    return this._currency_to_earn_one_point;
  }
  set currency_to_earn_one_point(value) {
    this._currency_to_earn_one_point = value ?? ClassSettingsFidTab.DEFAULT_CURRENCY;
  }

  get uids_products_prohibited_from_earning_points() {
    return this._uids_products_prohibited_from_earning_points;
  }
  set uids_products_prohibited_from_earning_points(value) {
    this._uids_products_prohibited_from_earning_points = normalizeProhibitedProductUids(value);
    this._touchLastEdit();
  }

  static makeInstance(uid, data = {}) {
    return new ClassSettingsFidTab({ uid, ...data });
  }

  static fromDefaults(uid = ClassSettingsFidTab.DEFAULT_UID) {
    return new ClassSettingsFidTab({ uid });
  }

  static converter = {
    toFirestore(instance) {
      if (instance instanceof ClassSettingsFidTab) {
        return ClassSettingsFidTab.toJSON(instance);
      }
      return instance;
    },
    fromFirestore(snapshot, options) {
      const raw = snapshot.data(options) ?? {};
      return ClassSettingsFidTab.makeInstance(snapshot.id, raw);
    },
  };

  static colRef() {
    return collection(firestore, this.COLLECTION).withConverter(this.converter);
  }

  static docRef(id = ClassSettingsFidTab.DEFAULT_UID) {
    return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
  }

  static async getOrCreateDefault() {
    const existing = await ClassSettingsFidTab.getFirestore(ClassSettingsFidTab.DEFAULT_UID);
    if (existing) return existing;

    const created = ClassSettingsFidTab.fromDefaults();
    await created.createFirestore();
    return created;
  }

  static subscribeFirestore(uid, onChange, onError) {
    if (!uid) {
      onChange(null);
      return () => {};
    }

    return onSnapshot(
      ClassSettingsFidTab.docRef(uid),
      (snapshot) => {
        onChange(snapshot.exists() ? snapshot.data() : null);
      },
      onError,
    );
  }
}
