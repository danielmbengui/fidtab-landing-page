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
  static STORAGE_FOLDER = "APP_BUNDLES";
  static COLLECTION = "SETTINGS";
  static NS_COLLECTION = "classes/settings";
  static FIELDS_TO_OMIT_FIREBASE = [...ClassFirestore.FIELDS_TO_OMIT_FIREBASE];

  static MIN_AMOUNT_TO_EARN_ONE_POINT = 10;
  static MAX_AMOUNT_TO_EARN_ONE_POINT = 150;
  static AMOUNT_TO_USE_ONE_POINT = 1;
  static DEFAULT_CURRENCY = "CHF";

  static MAC_INTEL_BUNDLE_NAME = "FidTab-MacIntel.dmg";
  static MAC_SILICON_BUNDLE_NAME = "FidTab-MacSilicon.dmg";
  static MAC_UNIVERSAL_BUNDLE_NAME = "FidTab-MacUniversal.dmg";
  static WINDOWS_BUNDLE_NAME = "FidTab-Windows.exe";

  constructor({
    uid = ClassSettings.DEFAULT_UID,
    available_countries = [],
    min_amount_to_earn_one_point = ClassSettings.MIN_AMOUNT_TO_EARN_ONE_POINT,
    max_amount_to_earn_one_point = ClassSettings.MAX_AMOUNT_TO_EARN_ONE_POINT,
    amount_to_use_one_point = ClassSettings.AMOUNT_TO_USE_ONE_POINT,
    currency_to_earn_one_point = ClassSettings.DEFAULT_CURRENCY,
    uids_products_prohibited_from_earning_points = [],
    current_version_app="0.1.0",
    latest_version_app="0.1.0",
    app_download_url = "",
    app_mac_intel_download_url = "",
    app_mac_silicon_download_url = "",
    app_mac_universal_download_url = "",
    app_windows_download_url = "",
    created_time = new Date(),
    last_edit_time = new Date(),
  } = {}) {
    const storage_url = `${ClassSettings.STORAGE_FOLDER}/`;
    super(uid, created_time, last_edit_time, storage_url);
    this._available_countries = available_countries;
    this._min_amount_to_earn_one_point = Number(
      min_amount_to_earn_one_point ?? ClassSettings.MIN_AMOUNT_TO_EARN_ONE_POINT,
    );
    this._max_amount_to_earn_one_point = Number(
      max_amount_to_earn_one_point ?? ClassSettings.MAX_AMOUNT_TO_EARN_ONE_POINT,
    );
    this._amount_to_use_one_point = Number(
      amount_to_use_one_point ?? ClassSettings.AMOUNT_TO_USE_ONE_POINT,
    );
    this._currency_to_earn_one_point = currency_to_earn_one_point ?? ClassSettings.DEFAULT_CURRENCY;
    this._uids_products_prohibited_from_earning_points = normalizeProhibitedProductUids(
      uids_products_prohibited_from_earning_points,
    );
    this._current_version_app = current_version_app;
    this._latest_version_app = latest_version_app;
    this._app_download_url = app_download_url;
    this._app_mac_intel_download_url = app_mac_intel_download_url;
    this._app_mac_silicon_download_url = app_mac_silicon_download_url;
    this._app_mac_universal_download_url = app_mac_universal_download_url;
    this._app_windows_download_url = app_windows_download_url;
  }

  get available_countries() {
    return this._available_countries;
  }
  set available_countries(value) {
    this._available_countries = value;
    this._touchLastEdit();
  }
  get min_amount_to_earn_one_point() {
    return this._min_amount_to_earn_one_point;
  }
  set min_amount_to_earn_one_point(value) {
    this._min_amount_to_earn_one_point = Number(
      value ?? ClassSettings.MIN_AMOUNT_TO_EARN_ONE_POINT,
    );
    this._touchLastEdit();
  }
  get max_amount_to_earn_one_point() {
    return this._max_amount_to_earn_one_point;
  }
  set max_amount_to_earn_one_point(value) {
    this._max_amount_to_earn_one_point = Number(
      value ?? ClassSettings.MAX_AMOUNT_TO_EARN_ONE_POINT,
    );
    this._touchLastEdit();
  }
  get amount_to_use_one_point() {
    return this._amount_to_use_one_point;
  }
  set amount_to_use_one_point(value) {
    this._amount_to_use_one_point = Number(
      value ?? ClassSettings.AMOUNT_TO_USE_ONE_POINT,
    );
    this._touchLastEdit();
  }

  get currency_to_earn_one_point() {
    return this._currency_to_earn_one_point;
  }
  set currency_to_earn_one_point(value) {
    this._currency_to_earn_one_point = value ?? ClassSettings.DEFAULT_CURRENCY;
    this._touchLastEdit();
  }

  get uids_products_prohibited_from_earning_points() {
    return this._uids_products_prohibited_from_earning_points;
  }
  set uids_products_prohibited_from_earning_points(value) {
    this._uids_products_prohibited_from_earning_points = normalizeProhibitedProductUids(value);
    this._touchLastEdit();
  }

  get current_version_app() {
    return this._current_version_app;
  }
  set current_version_app(value) {
    this._current_version_app = value;
    this._touchLastEdit();
  }
  get latest_version_app() {
    return this._latest_version_app;
  }
  set latest_version_app(value) {
    this._latest_version_app = value;
    this._touchLastEdit();
  }
  get app_download_url() {
    return this._app_download_url;
  }
  set app_download_url(value) {
    this._app_download_url = value;
    this._touchLastEdit();
  }
  get app_mac_intel_download_url() {
    return this._app_mac_intel_download_url;
  }
  set app_mac_intel_download_url(value) {
    this._app_mac_intel_download_url = value;
    this._touchLastEdit();
  }
  get app_mac_silicon_download_url() {
    return this._app_mac_silicon_download_url;
  }
  set app_mac_silicon_download_url(value) {
    this._app_mac_silicon_download_url = value;
    this._touchLastEdit();
  }
  get app_mac_universal_download_url() {
    return this._app_mac_universal_download_url;
  }
  set app_mac_universal_download_url(value) {
    this._app_mac_universal_download_url = value;
    this._touchLastEdit();
  }
  get app_windows_download_url() {
    return this._app_windows_download_url;
  }
  set app_windows_download_url(value) {
    this._app_windows_download_url = value;
    this._touchLastEdit();
  }
  static makeInstance(uid, data = {}) {
    return new ClassSettings({ uid, ...data });
  }

  static fromDefaults(uid = ClassSettings.DEFAULT_UID) {
    return new ClassSettings({ uid });
  }

  static converter = {
    toFirestore(instance) {
      if (instance instanceof ClassSettings) {
        return ClassSettings.toJSON(instance);
      }
      return instance;
    },
    fromFirestore(snapshot, options) {
      const raw = snapshot.data(options) ?? {};
      return ClassSettings.makeInstance(snapshot.id, raw);
    },
  };

  static colRef() {
    return collection(firestore, this.COLLECTION).withConverter(this.converter);
  }

  static docRef(id = ClassSettings.DEFAULT_UID) {
    return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
  }

  static async getOrCreateDefault() {
    const existing = await ClassSettings.getFirestore(ClassSettings.DEFAULT_UID);
    if (existing) return existing;

    const created = ClassSettings.fromDefaults();
    await created.createFirestore();
    return created;
  }

  static subscribeFirestore(uid, onChange, onError) {
    if (!uid) {
      onChange(null);
      return () => {};
    }

    return onSnapshot(
      ClassSettings.docRef(uid),
      (snapshot) => {
        onChange(snapshot.exists() ? snapshot.data() : null);
      },
      onError,
    );
  }
}

export { normalizeProhibitedProductUids };
