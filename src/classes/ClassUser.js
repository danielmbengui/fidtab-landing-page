import {
  collection,
  collectionGroup,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";
import { ClassFirestore } from "./ClassFirestore";
import { capitalizeFirstLetter } from "@/context/functions/functions_strings";
import { defaultLocale } from "@/i18n/config";
import {
  LOYALTY_CHF_PER_POINT,
  LOYALTY_POINTS_PER_CHF,
  LOYALTY_TIER,
  LOYALTY_TIER_LABELS,
  LOYALTY_TIER_THRESHOLDS,
  calculateLoyaltyPointsFromAmount,
  getLoyaltyAmountFromPoints,
  getLoyaltyLabelFromAmount,
  getLoyaltyLabelFromPoints,
  getLoyaltyTierFromAmount,
  getLoyaltyTierFromPoints,
  normalizeLoyaltyAmount,
  normalizeLoyaltyPoints,
} from "@/lib/loyaltyUserStatics";
/**
 * Modèle utilisateur Firestore — à faire évoluer (méthodes métier, getters, etc.).
 * Le provider mappe chaque snapshot vers `ClassUser.fromFirestore`.
 */
export class ClassUser extends ClassFirestore {
  static COLLECTION = "USERS";
  static STORAGE_FOLDER = "users";
  static NS_COLLECTION = "classes/users";
  static STORAGE_PRE_USER = "PRE_USER";
  static UID_REMOVED_USER = "OaCIPf9Fe9or4F7ngS6W";
  static MIN_YEARS_OLD = 10;
  static PASSWORD_RULES = [
    { id: "len", label: "8 caractères minimum", test: (p) => p.length >= 8 },
    { id: "upper", label: "Une lettre majuscule (A–Z)", test: (p) => /[A-Z]/.test(p) },
    { id: "lower", label: "Une lettre minuscule (a–z)", test: (p) => /[a-z]/.test(p) },
    { id: "num", label: "Un chiffre (0–9)", test: (p) => /[0-9]/.test(p) },
    { id: "spec", label: "Un caractère spécial (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];
  static FIELDS_TO_OMIT_FIREBASE = [
    ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
    //'storage_url',
    //'is_verified',
    //'scores',
  ];
  /**
   * Champs dont la valeur Firestore est un tableau de `DocumentReference` :
   * clé = nom du champ sur le document user, valeur = segment de collection cible (1er segment du chemin).
   * Ex. `favorite_sport` → docs dans `SPORT`, `blocked_list` → `USERS`.
   */
  static TYPE = Object.freeze({
    COMPANY: 'company', // entreprise
    EXTERNAL: 'external', // externe
    UNKNOWN: 'unknown',
  });
  static ROLE = Object.freeze({
    ADMIN: 'admin', // administrateur
    EMPLOYEE: 'employee', // employé
    CUSTOMER: 'customer', // client
    UNKNOWN: 'unknown',
  });
  static GENDER = Object.freeze({
    WOMAN: 'female',
    MAN: 'male',
    OTHER: 'other',
    UNKNOWN: 'unknown',
  });
  static STATUS = Object.freeze({
    FIRST_CONNECTION: 'first_connection',
    COMPLETE_PROFILE: 'complete_profile',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    UNKNOWN: 'unknown',
  });
  static LOYALTY_TIER = LOYALTY_TIER;
  static LOYALTY_TIER_THRESHOLDS = LOYALTY_TIER_THRESHOLDS;
  static LOYALTY_CHF_PER_POINT = LOYALTY_CHF_PER_POINT;
  static LOYALTY_POINTS_PER_CHF = LOYALTY_POINTS_PER_CHF;
  static LOYALTY_TIER_LABELS = LOYALTY_TIER_LABELS;
  static normalizeLoyaltyPoints = normalizeLoyaltyPoints;
  static normalizeLoyaltyAmount = normalizeLoyaltyAmount;
  static calculateLoyaltyPointsFromAmount = calculateLoyaltyPointsFromAmount;
  static getLoyaltyAmountFromPoints = getLoyaltyAmountFromPoints;
  static getLoyaltyTierFromAmount = getLoyaltyTierFromAmount;
  static getLoyaltyTierFromPoints = getLoyaltyTierFromPoints;
  static getLoyaltyLabelFromAmount = getLoyaltyLabelFromAmount;
  static getLoyaltyLabelFromPoints = getLoyaltyLabelFromPoints;

  static normalizePreferedLanguage(value) {
    if (value == null || value === "") return defaultLocale;
    return String(value).trim().toLowerCase();
  }

  /**
   * @param {unknown} value
   * @returns {Date | null}
   */
  static normalizeBirth(value) {
    if (value == null || value === "") return null;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const [year, month, day] = trimmed.split("-").map(Number);
        const date = new Date(year, month - 1, day, 0, 0, 0, 0);
        return Number.isNaN(date.getTime()) ? null : date;
      }
    }

    const date = ClassFirestore._toJsDate(value);
    if (!date || Number.isNaN(date.getTime())) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  static calculateYearsOld(date = null) {
    const birthDate = date instanceof Date ? date : ClassUser.normalizeBirth(date);
    if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) return 0;
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      now.getMonth() > birthDate.getMonth() ||
      (now.getMonth() === birthDate.getMonth() &&
        now.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }
    return age;
  }

  constructor({
    uid = "",
    uid_company = "system",
    uids_products_whishlist=[],
    display_name="",
    email="",
    phone_number="",
    photo_url="",
    gender=ClassUser.GENDER.UNKNOWN,
    birth=null,
    country_code="",
    role=ClassUser.ROLE.UNKNOWN,
    status=ClassUser.STATUS.UNKNOWN,
    is_verified=false,
    prefered_language=defaultLocale,
    created_time = new Date(),
    last_edit_time = new Date(),
  } = {}) {
    const _storage_url = `${ClassUser.COLLECTION}/${uid}/profile.jpg`;
    super(uid, created_time, last_edit_time, _storage_url);
    this._uid_company = uid_company;
    this._uids_products_whishlist = uids_products_whishlist;
    this._display_name = display_name;
    this._email = email;
    this._phone_number = phone_number;
    this._photo_url = photo_url;
    this._gender = gender;
    this._birth = ClassFirestore._toJsDate(birth);
    this._country_code = country_code;
    this._type = ClassUser.TYPE.UNKNOWN;
    this._role = role;
    this._status = status;
    this._is_verified = is_verified;
    this._prefered_language = ClassUser.normalizePreferedLanguage(prefered_language);
  }
  get uid_company() {
    return this._uid_company;
  }
  set uid_company(value) {
    this._uid_company = value;
  }
  get uids_products_whishlist() {
    return this._uids_products_whishlist;
  }
  set uids_products_whishlist(value) {
    this._uids_products_whishlist = value;
  }
  get display_name() {
    return this._display_name;
  }
  set display_name(value) {
    this._display_name = value;
  }
  get email() {
    return this._email;
  }
  set email(value) {
    this._email = value;
  }
  get phone_number() {
    return this._phone_number;
  }
  set phone_number(value) {
    this._phone_number = value;
  }
  get photo_url() {
    return this._photo_url;
  }
  set photo_url(value) {
    this._photo_url = value;
  }
  get gender() {
    return this._gender;
  }
  set gender(value) {
    this._gender = value;
  }
  get birth() {
    return this._birth;
  }
  set birth(value) {
    this._birth = ClassUser.normalizeBirth(value);
  }
  get country_code() {
    return this._country_code;
  }
  set country_code(value) {
    this._country_code = value;
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }
  get role() {
    return this._role;
  }
  set role(value) {
    this._role = value;
  }
  get status() {
    return this._status;
  }
  set status(value) {
    this._status = value;
  }
  get statusLabel() {
    switch (this._status) {
      case ClassUser.STATUS.FIRST_CONNECTION:
        return "Vous devez compléter votre première connexion";
      case ClassUser.STATUS.ACTIVE:
        return "Vous êtes actif";
      case ClassUser.STATUS.INACTIVE:
        return "Vous êtes inactif";
      default:
        return "Statut inconnu";
    }
  }
  get is_verified() {
    return this._is_verified;
  }
  set is_verified(value) {
    this._is_verified = value;
  }
  get prefered_language() {
    return ClassUser.normalizePreferedLanguage(this._prefered_language);
  }
  set prefered_language(value) {
    this._prefered_language = ClassUser.normalizePreferedLanguage(value);
  }

  /*
  clone() {
    return ClassUser.makeInstance(this._uid, this.toJSON());
}
*/

  static makeInstance(uid, data = {}) {
    if(data.role === ClassUser.ROLE.ADMIN) {
      return new ClassUserAdmin({ uid, ...data });
    }
    if(data.role === ClassUser.ROLE.CUSTOMER) {
      return new ClassUserCustomer({ uid, ...data });
    }
    if(data.type === ClassUser.TYPE.COMPANY) {
      return new ClassUserCompany({ uid, ...data });
    }
    if(data.type === ClassUser.TYPE.EXTERNAL) {
      return new ClassUserExternal({ uid, ...data });
    }
    return new ClassUser({ uid, ...data });
  }
  // ── Converter Firestore ──────────────────────────────────
  static converter = {
    toFirestore(instance) {
      if (instance instanceof ClassUser) {
        return ClassUser.omitUndefinedDeep(ClassUser.toJSON(instance));
      }
      return instance;
    },
    fromFirestore(snapshot, options) {
      const raw = snapshot.data(options) ?? {};
      const uid = snapshot.id;
      const data = ClassUser.normalizeDocRefArrayFieldsFromFirestore(raw);
      //const country = ClassCountry.getCountryByCode(data.country?.code || data.country_code || "");
      //const gender = ClassUser.formatGenderFromFirestore(data.gender);
      //const scores = ClassUserScores._convertScoresFromFirestore({ ...data.scores, uid_user: uid });
      //console.log("country class user", country);
      //data.gender=gender;
      //data.country = country;
      return ClassUser.makeInstance(uid, data);
    },
  };
  // ── Refs ─────────────────────────────────────────────────
  static colRef() {
    return collection(firestore, this.COLLECTION).withConverter(this.converter);
  }
  static docRef(id) {
    return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
  }

  static async existsFirestore(uid) {
    if (!uid) return null;
    const snap = await getDoc(this.docRef(uid));
    return snap.exists();
  }
  static async existsFirestoreByPhone(phone) {
    const ownerUid = await ClassUser.findUidByPhone(phone);
    return Boolean(ownerUid);
  }
  static async findUidByPhone(phone) {
    const _phone = String(phone ?? "").trim();
    if (!_phone) return null;
    try {
      const q = query(
        this.colRef(),
        where("phone_number", "==", _phone),
        limit(1),
      );
      const snap = await getDocs(q);
      return snap.empty ? null : snap.docs[0].id;
    } catch (error) {
      console.error("Error finding user by phone", error);
      return null;
    }
  }
  static async existsFirestoreByEmail(email) {
    return Boolean(await ClassUser.findUidByEmail(email));
  }
  static async findUidByEmail(email) {
    const _email = String(email ?? "").trim().toLowerCase();
    if (!_email) return null;
    try {
      const q = query(
        this.colRef(),
        where("email", "==", _email),
        limit(1),
      );
      const snap = await getDocs(q);
      return snap.empty ? null : snap.docs[0].id;
    } catch (error) {
      console.error("Error finding user by email", error);
      return null;
    }
  }

  // ── Count ────────────────────────────────────────────────
  static async count(constraints = []) {
    const _constraints = [
      //where("is_active", "==", true),
      //where("is_blocked", "==", false),
      //where("is_guess", "==", false),
      //where("is_removed_definitively", "==", false),
      ...constraints,
    ]
    return super.count(_constraints);
  }
  static async countAll(constraints = []) {
    return super.countAll(constraints);
  }
  // ── Get ──────────────────────────────────────────────────
  static async getFirestore(uid) {
    const user = await super.getFirestore(uid);
    if (!user) return null;
    return user;
  }

  /**
   * Écoute le document utilisateur en temps réel.
   * @param {string} uid
   * @param {(user: ClassUser | null) => void} onChange
   * @param {(error: Error) => void} [onError]
   * @returns {() => void}
   */
  static subscribeFirestore(uid, onChange, onError) {
    if (!uid) {
      onChange(null);
      return () => {};
    }

    return onSnapshot(
      this.docRef(uid),
      (snapshot) => {
        onChange(snapshot.exists() ? snapshot.data() : null);
      },
      onError,
    );
  }
  // ── List ─────────────────────────────────────────────────
  static async listFirestore(constraints = []) {
    const _constraints = [
      //where("is_active", "==", true),
      //where("is_blocked", "==", false),
      //where("is_guess", "==", false),
      // where("is_removed_definitively", "==", false),
      //orderBy(this.SORT_BY.DISPLAY_NAME_NORMALIZED, "asc"),
      ...constraints
    ]
    //const users = await super.listFirestore(_constraints);
    return await super.listFirestore(_constraints);
  }
  // ── Create ───────────────────────────────────────────────
  async createFirestore() {
    return super.createFirestore();
  }
  // ── Update ───────────────────────────────────────────────
  async updateFirestore() {
    return super.updateFirestore();
  }
  // ── Remove ───────────────────────────────────────────────
  async removeFirestore() {
    return super.removeFirestore();
  }
}
/**
 * Modèle utilisateur Firestore — à faire évoluer (méthodes métier, getters, etc.).
 * Le provider mappe chaque snapshot vers `ClassUser.fromFirestore`.
 */
export class ClassUserCompany extends ClassUser {
  static FIELDS_TO_OMIT_FIREBASE = [
    ...ClassUser.FIELDS_TO_OMIT_FIREBASE,
    //'storage_url',
    //'is_verified',
    //'scores',
  ];
  static TYPE = Object.freeze({
    COMPANY: 'company', // entreprise
  });
  static ROLE = Object.freeze({
    ADMIN: 'admin', // administrateur
    EMPLOYEE: 'employee', // employé
  });

  constructor(data = {}) {
    super(data);
    this._type = ClassUser.TYPE.COMPANY;
  }
  static makeInstance(uid, data = {}) {
    return new ClassUserCompany({ uid, ...data });
  }
}
export class ClassUserAdmin extends ClassUserCompany {
  static FIELDS_TO_OMIT_FIREBASE = [
    ...ClassUser.FIELDS_TO_OMIT_FIREBASE,
    //'storage_url',
    //'is_verified',
    //'scores',
  ];
  static ROLE = Object.freeze({
    ADMIN: 'admin', // administrateur
  });
  constructor(data = {}) {
    super(data);
    this._role = ClassUserCompany.ROLE.ADMIN;
  }
  static makeInstance(uid, data = {}) {
    return new ClassUserAdmin({ uid, ...data });
  }
}
/**
 * Modèle utilisateur Firestore — à faire évoluer (méthodes métier, getters, etc.).
 * Le provider mappe chaque snapshot vers `ClassUser.fromFirestore`.
 */
export class ClassUserExternal extends ClassUser {
  static FIELDS_TO_OMIT_FIREBASE = [
    ...ClassUser.FIELDS_TO_OMIT_FIREBASE,
    //'storage_url',
    //'is_verified',
    //'scores',
  ];
  static TYPE = Object.freeze({
    EXTERNAL: 'external', // externe
  });
  static ROLE = Object.freeze({
    CUSTOMER: 'customer', // client
  });

  constructor(data = {}) {
    super(data);
    this._type = ClassUser.TYPE.EXTERNAL;
  }
  static makeInstance(uid, data = {}) {
    return new ClassUserExternal({ uid, ...data });
  }
}
export class ClassUserCustomer extends ClassUserExternal {
  static FIELDS_TO_OMIT_FIREBASE = [
    ...ClassUserExternal.FIELDS_TO_OMIT_FIREBASE,
  ];
  static ROLE = Object.freeze({
    CUSTOMER: 'customer',
  });

  constructor({
    uid = "",
    uids_companies_loyalties = [],
    uids_products_whishlist = [],
    loyalty_uid = "",
    loyalty_tier = LOYALTY_TIER.NORMAL,
    loyalty_points = 0,
    loyalty_amount = 0,
    ...rest
  } = {}) {
    super({
      uid,
      uids_products_whishlist,
      role: ClassUser.ROLE.CUSTOMER,
      ...rest,
    });
    this._type = ClassUser.TYPE.EXTERNAL;
    this._role = ClassUser.ROLE.CUSTOMER;
    this._uids_companies_loyalties = uids_companies_loyalties;
    this._loyalty_uid = loyalty_uid;
    this._loyalty_tier = loyalty_tier;
    this._loyalty_points = normalizeLoyaltyPoints(loyalty_points);
    this._loyalty_amount = normalizeLoyaltyAmount(loyalty_amount);
  }
  get uids_companies_loyalties() {
    return this._uids_companies_loyalties;
  }
  set uids_companies_loyalties(value) {
    this._uids_companies_loyalties = value;
  }
  get uids_products_whishlist() {
    return this._uids_products_whishlist;
  }
  set uids_products_whishlist(value) {
    this._uids_products_whishlist = value;
  }
  get loyalty_uid() {
    return this._loyalty_uid;
  }
  set loyalty_uid(value) {
    this._loyalty_uid = value;
  }
  get loyalty_tier() {
    return this._loyalty_tier;
  }
  set loyalty_tier(value) {
    this._loyalty_tier = value;
  }
  get loyalty_points() {
    return this._loyalty_points;
  }
  set loyalty_points(value) {
    this._loyalty_points = normalizeLoyaltyPoints(value);
  }
  get loyalty_amount() {
    return this._loyalty_amount;
  }
  set loyalty_amount(value) {
    this._loyalty_amount = normalizeLoyaltyAmount(value);
  }
  get loyaltyLabel() {
    if (this._loyalty_amount > 0) {
      return getLoyaltyLabelFromAmount(this._loyalty_amount);
    }
    return getLoyaltyLabelFromPoints(this._loyalty_points);
  }

  /** Palier fidélité calculé à partir du montant cumulé en boutique (`loyalty_amount`). */
  get loyaltyTierFromAmount() {
    return getLoyaltyTierFromAmount(this._loyalty_amount);
  }

  /** Palier fidélité dérivé des points via le montant équivalent (sans modifier `loyalty_tier`). */
  get loyaltyTierFromPoints() {
    return getLoyaltyTierFromAmount(
      getLoyaltyAmountFromPoints(this._loyalty_points),
    );
  }

  static makeInstance(uid, data = {}) {
    return new ClassUserCustomer({ uid, ...data });
  }
}
/**
 * Modèle utilisateur Firestore — à faire évoluer (méthodes métier, getters, etc.).
 * Le provider mappe chaque snapshot vers `ClassUser.fromFirestore`.
 */
export class ClassFcmToken extends ClassFirestore {
  static COLLECTION = "fcm_tokens";
  static NS_COLLECTION = "classes/fcm_tokens";
  static FIELDS_TO_OMIT_FIREBASE = [
    "uid",
    "storage_url",
    //"last_edit_time",
    //"created_time",
    //"user_ref",
  ];
  static DOC_REF_FIELDS = Object.freeze({
    user_ref: ClassUser.COLLECTION,
    //favorite_sport: ClassSport.COLLECTION,
    //followers: ClassUser.COLLECTION,
    //following: ClassUser.COLLECTION,
    //sports_ref: ClassSport.COLLECTION,
  });
  constructor({
    uid = "",
    uid_user = "",
    created_time = null,
    last_edit_time = null,
    fcm_token = "",
    device_type = "",
  }) {
    super(uid, created_time, last_edit_time);
    this._uid_user = uid_user;
    this._fcm_token = fcm_token;
    this._device_type = device_type;
  }
  get uid_user() {
    return this._uid_user;
  }
  set uid_user(value) {
    this._uid_user = value;
  }
  get fcm_token() {
    return this._fcm_token;
  }
  set fcm_token(value) {
    this._fcm_token = value;
  }
  get device_type() {
    return this._device_type;
  }
  set device_type(value) {
    this._device_type = value;
  }
  static makeInstance(uid, data = {}) {
    return new ClassFcmToken({ uid, ...data });
  }
  static converter = {
    toFirestore(instance) {
      const payload = ClassFcmToken.omitUndefinedDeep(ClassFcmToken.toJSON(instance));
      //payload.created_at = payload.created_time || null;
      payload.device_type = capitalizeFirstLetter(payload.device_type || "");
      return payload;
    },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      //const created_time = data.created_at || null;
      //const last_edit_time = data.created_at || null;
      return ClassFcmToken.makeInstance(snapshot.id, data);
    }
  };

  // ── Refs ─────────────────────────────────────────────────
  static colRef(uidUser) {
    if (!uidUser) return null;
    return collection(
      firestore,
      ClassUser.COLLECTION,
      uidUser,
      this.COLLECTION,
    ).withConverter(this.converter);
  }
  static colGroupRef() {
    return collectionGroup(firestore, this.COLLECTION).withConverter(this.converter);
  }
  static docRef(uidUser, id) {
    if (!uidUser || !id) return null;
    return doc(firestore, ClassUser.COLLECTION, uidUser, this.COLLECTION, id).withConverter(this.converter);
  }
  // ── Existe ──────────────────────────────────────────────────
  static async existsFirestore(uidUser, uidToken) {
    if (!uidUser || !uidToken) return false;
    const snap = await getDoc(this.docRef(uidUser, uidToken));
    return snap.exists();
  }
  static async existsFirestoreByToken(uidUser, tokenValue) {
    if (!uidUser || !tokenValue) return false;
    const q = query(this.colRef(uidUser), where("fcm_token", "==", tokenValue));
    const snap = await getDocs(q);
    return snap.size > 0;
  }
  // ── Get ──────────────────────────────────────────────────
  static async getFirestore(uidUser, uidToken) {
    if (!this.COLLECTION || !uidUser || !uidToken) return null;
    if (!(await this.existsFirestore(uidUser, uidToken))) return null;
    const snap = await getDoc(this.docRef(uidUser, uidToken));
    return snap.data();
  }
  static async getFirestoreByToken(uidUser, tokenValue) {
    if (!uidUser || !tokenValue) return null;
    const q = query(this.colRef(uidUser), where("fcm_token", "==", tokenValue), limit(1));
    const snap = await getDocs(q);
    return snap.size > 0 ? snap.docs[0].data() : null;
  }
  static async listFirestore(uidUser, constraints = []) {
    if (!this.COLLECTION || !uidUser) return null;
    const _constraints = [
      ...constraints,
    ];
    const q = _constraints.length
      ? query(this.colRef(uidUser), ..._constraints)
      : query(this.colRef(uidUser));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
    //return snap.data();
  }
  // ── Create ───────────────────────────────────────────────
  async createFirestore() {
    if (!this._uid_user || !this._fcm_token) return null;
    const uidUser = this._uid_user;
    if (!this._uid) {
      const newRef = doc(ClassFcmToken.colRef(uidUser));
      this._uid = newRef.id;
    }

    const ref = ClassFcmToken.docRef(uidUser, this._uid);
    this._created_time = new Date();
    this._last_edit_time = new Date();
    await setDoc(ref, this, { merge: true });
    return this.constructor.makeInstance(this._uid, ClassFcmToken.toJSON(this));
  }
    // ── Update ───────────────────────────────────────────────
    async updateFirestore() {
      super.updateFirestore();
    }
    // ── Remove ───────────────────────────────────────────────
    async removeFirestore() {
      return super.removeFirestore();
    }

  static async setFirestore(uidUser, uidToken, payload = {}, options = { merge: true }) {
    if (!this.COLLECTION || !uidUser || !uidToken) return null;
    try {
      // Write raw payload on a non-converted ref to avoid converter mismatch
      // when payload is a plain object (not a ClassFcmToken instance).
      const rawRef = doc(firestore, ClassUser.COLLECTION, uidUser, this.COLLECTION, uidToken);
      const data = this.omitUndefinedDeep(payload);
      await setDoc(rawRef, data, options);
      return await this.getFirestore(uidUser, uidToken);
    } catch (e) {
      console.error("ClassFcmToken.setFirestore", e?.code ?? e?.name, e?.message ?? e);
      return null;
    }
  }

}
