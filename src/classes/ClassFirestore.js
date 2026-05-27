import { removeAccents } from "@/context/functions/functions_strings";
import { firestore } from "@/lib/firebaseConfig";
import { collection, deleteDoc, doc, DocumentReference, getCountFromServer, getDoc, getDocs, query, setDoc, Timestamp } from "firebase/firestore";

export class ClassFirestore {
    static COLLECTION = "";
    static NS_COLLECTION = "";
    static FIELDS_TO_OMIT_FIREBASE = [
        'storage_url',
        //'initials',
        // 'translate',
        //'description',
        //'slogan',
    ];
    static DOC_REF_FIELDS = Object.freeze({});
    static DOC_REF_ARRAY_FIELDS = Object.freeze({});
    static SORT_BY = Object.freeze({});
    constructor(uid = "", created_time = new Date(), last_edit_time = new Date(), storage_url = "") {
        this._uid = uid;
        this._created_time = ClassFirestore._toJsDate(created_time) || new Date();
        this._last_edit_time = ClassFirestore._toJsDate(last_edit_time) || new Date();
        this._storage_url = storage_url;
    }
    get uid() {
        return this._uid;
    }
    set uid(value) {
        this._uid = value;
    }
    get created_time() {
        return this._created_time;
    }
    set created_time(value) {
        this._created_time = ClassFirestore._toJsDate(value);
        this._touchLastEdit();
    }
    get last_edit_time() {
        return this._last_edit_time;
    }
    set last_edit_time(value) {
        this._last_edit_time = ClassFirestore._toJsDate(value);
    }
    get storage_url() {
        return this._storage_url;
    }
    set storage_url(value) {
        this._storage_url = value;
        this._touchLastEdit();
    }
    _touchLastEdit() {
        this._last_edit_time = ClassFirestore._toJsDate(new Date());
    }
    static getNameNormalized(value) {
        return removeAccents(value).toLowerCase().replace(/ /g, " ");
    }
    update(props = {}) {
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(this, `_${key}`) && props[key] !== undefined) {
                this[`_${key}`] = props[key];
            }
        }
        //this._touchLastEdit();
    }
    clone() {
        return this.constructor.makeInstance(this._uid, this.constructor.toJSON(this));
    }
    static toJSON(data = this) {
        const fields = [...this.FIELDS_TO_OMIT_FIREBASE];
        const out = { ...data };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]),
        );
        for (const field of fields) {
            cleaned[field] = "";
            delete cleaned[field];
        }
        return this.omitUndefinedDeep(cleaned);
    }
    static omitUndefinedDeep(val) {
        if (val === undefined) return undefined;
        if (val === null || typeof val !== "object") return val;
        if (val instanceof Date) {
            return Number.isNaN(val.getTime()) ? null : val;
        }
        if (Array.isArray(val)) {
            return val.map((v) =>
                v === undefined
                    ? null
                    : this.omitUndefinedDeep(v),
            );
        }
        const out = {};
        for (const [k, v] of Object.entries(val)) {
            if (v === undefined) continue;
            const next = this.omitUndefinedDeep(v);
            if (next !== undefined) out[k] = next;
        }
        return out;
    }
    static idToDocRef(uid, collectionPath = this.COLLECTION) {
        if (!uid || !collectionPath) return null;
        return doc(firestore, collectionPath, uid);
    }
    static docRefToId(ref) {
        if (typeof ref === "string") {
            const t = ref.trim();
            if (t) return t;
        }
        if (ref instanceof DocumentReference) {
            if (ref.id) return ref.id;
        }
        return "";
    }
    static idsToDocRefs(value, collectionPath = this.COLLECTION) {
        const ids = this.refArrayToIds(value);
        return ids.map((id) => doc(firestore, collectionPath, id));
    }
    static refArrayToIds(value) {
        if (!Array.isArray(value)) return [];
        const out = [];
        for (const item of value) {
            const uid = this.docRefToId(item);
            if (uid) out.push(uid);
            continue;
        }
        return out;
    }
    static normalizeDocRefArrayFieldsFromFirestore(data) {
        const out = { ...data };
        for (const field of Object.keys(ClassFirestore.DOC_REF_FIELDS)) {
            if (field in out && out[field] != null) {
                out[field] = ClassFirestore.docRefToId(out[field]);
            }
        }
        for (const field of Object.keys(ClassFirestore.DOC_REF_ARRAY_FIELDS)) {
            if (field in out && out[field] != null) {
                out[field] = ClassFirestore.refArrayToIds(out[field]);
            }
        }
        return out;
    }
    static _toJsDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (v instanceof Timestamp) return v.toDate();
        if (typeof v?.toDate === "function") return v.toDate();
        if (typeof v?.seconds === "number") return new Date(v.seconds * 1000);
        return null;
    }
    static makeInstance(uid, data = {}) {
        return new ClassFirestore({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassFirestore) {
                const payload = ClassFirestore.omitUndefinedDeep(ClassFirestore.toJSON(instance));
                if (payload) {
                    for (const [field, collectionPath] of Object.entries(ClassFirestore.DOC_REF_FIELDS)) {
                        payload[field] = ClassFirestore.idToDocRef(payload[field], collectionPath);
                    }
                }
                if (payload) {
                    for (const [field, collectionPath] of Object.entries(ClassFirestore.DOC_REF_ARRAY_FIELDS)) {
                        if (Array.isArray(payload[field])) {
                            payload[field] = ClassFirestore.idsToDocRefs(payload[field], collectionPath);
                        }
                    }
                }
                return this.omitUndefinedDeep(payload);
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            const uid = snapshot.id;
            const data = raw;
            return ClassFirestore.makeInstance(uid, data);
        },
    };
    // ── Refs ─────────────────────────────────────────────────
    static colRef() {
        if (!this.COLLECTION) return null;
        return collection(firestore, this.COLLECTION).withConverter(this.converter);
    }
    static subColRef(uid_parent, collection_parent) {
        if (!uid_parent || !collection_parent || !this.COLLECTION) return null;
        return collection(firestore, collection_parent, uid_parent, this.COLLECTION).withConverter(this.converter);
    }
    static docRef(uid) {
        if (!this.COLLECTION || !uid) return null;
        return doc(firestore, this.COLLECTION, uid).withConverter(this.converter);
    }
    static subDocRef(uid_parent, collection_parent, uid) {
        if (!uid_parent || !collection_parent || !uid) return null;
        return doc(firestore, collection_parent, uid_parent, this.COLLECTION, uid).withConverter(this.converter);
    }
    static queryRef(constraints = []) {
        if (!this.COLLECTION) return null;
        const col = this.colRef();
        if (!col) return null;
        return query(col, ...constraints).withConverter(this.converter);
    }
    // ── Count ────────────────────────────────────────────────
    static async count(constraints = []) {
        if (!this.COLLECTION) return 0;
        const q = constraints.length
            ? query(this.colRef(), ...constraints)
            : this.colRef();
        const snap = await getCountFromServer(q);
        return snap.data().count;
    }
    static async countAll() {
        if (!this.COLLECTION) return 0;
        const q = this.colRef();
        const snap = await getCountFromServer(q);
        return snap.data().count;
    }
    // ── Existe ──────────────────────────────────────────────────
    static async existsFirestore(uid) {
        if (!this.COLLECTION || !uid) return null;
        const snap = await getDoc(this.docRef(uid));
        return snap.exists();
    }
    // ── Get ──────────────────────────────────────────────────
    static async getFirestore(uid) {
        if (!this.COLLECTION || !uid) return null;
        if (!(await this.existsFirestore(uid))) return null;
        try {
            //console.log("getFirestore isExist", uid);
            const snap = await getDoc(this.docRef(uid));
            return snap.data();
        } catch (e) {
            console.error("ClassFirestore.getFirestore", e?.code ?? e?.name, e?.message ?? e);
            return null;
        }
    }
    static async getFirestoreJSON(uid) {
        const data = await this.getFirestore(uid);
        if (!data) return null;
        return this.toJSON(data);
    }
    // ── List ─────────────────────────────────────────────────
    static async listFirestore(constraints = []) {
        if (!this.COLLECTION) return [];
        const q = constraints.length > 0
            ? query(this.colRef(), ...constraints)
            : query(this.colRef());
        const snap = await getDocs(q);
        return snap.docs.map((d) => d.data());
    }
    static listFirestoreSort(list = [], sorted_by = "", direction = "asc") {
        if (!this.COLLECTION || !sorted_by || !direction || list.length === 0) return [];
        return list;
    }
    // ── Create ───────────────────────────────────────────────
    async createFirestore() {
        if (!this.constructor.COLLECTION) return null;
        if (!this._uid) {
            const newRef = doc(this.constructor.colRef());
            this._uid = newRef.id;
        }
        const ref = this.constructor.docRef(this._uid);
        await setDoc(ref, this, { merge: true });
        return this.constructor.makeInstance(this._uid, this.constructor.toJSON(this));
    }
    // ── Update ───────────────────────────────────────────────
    async updateFirestore() {
        if (!this.constructor.COLLECTION || !this._uid) return null;
        try {
            if (!this._uid) {
                console.error("ClassSalaryPayment.updateFirestore: _uid manquant");
                return null;
            }
            const ref = this.constructor.docRef(this._uid);
            await setDoc(ref, this, { merge: true });
            try {
                return this.constructor.makeInstance(this._uid, this.constructor.toJSON(this));
            } catch (rebuildErr) {
                console.warn(
                    `${this.constructor.name}.updateFirestore: écriture OK, reconstruction locale impossible`,
                    rebuildErr?.message ?? rebuildErr,
                );
                return this;
            }
        } catch (e) {
            console.error("ClassUser.updateFirestore", e?.code ?? e?.name, e?.message ?? e);
            return null;
        }
    }
    // ── Remove ───────────────────────────────────────────────
    async removeFirestore() {
        if (!this.constructor.COLLECTION || !this._uid) return null;
        try {
            if (!this._uid) return false;
            const ref = this.constructor.docRef(this._uid);
            await deleteDoc(ref);
            return true;
        } catch (e) {
            console.error("ClassUser.removeFirestore", e?.message ?? e);
            return false;
        }
    }
}