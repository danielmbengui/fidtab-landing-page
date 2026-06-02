import { firestore } from "@/lib/firebaseConfig";
import { ClassFirestore } from "./ClassFirestore";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { ClassCompany } from "./ClassCompany";
import { ClassShop } from "./ClassShop";
import { ClassStock } from "./ClassStock";

function normalizeSaleScope(uidCompany, uidShop, uidSale = "") {
    return {
        uidCompany: String(uidCompany ?? "").trim(),
        uidShop: String(uidShop ?? "").trim(),
        uidSale: String(uidSale ?? "").trim(),
    };
}

export class ClassSale extends ClassFirestore {
    static COLLECTION = "SALES";
    static STORAGE_FOLDER = "sales";
    static NS_COLLECTION = "classes/sales";
    static PAYMENT_METHOD = Object.freeze({
        CASH: "cash",
        CARD: "card",
        TWINT: "twint",
        POINTS: "points",
        UNKNOWN: "unknown",
    });
    static STATUS = Object.freeze({
        PENDING: "pending",
        PAID: "paid",
        CANCELLED: "cancelled",
        REFUNDED: "refunded",
        UNKNOWN: "unknown",
    });

    constructor({
        uid = "",
        uid_company = "system",
        uid_shop = "",
        uid_user = "",
        amount_paid_with_other=0,
        amount_paid_with_points=0,
        amount_total=0,
        points_earned=0,
        currency="CHF",
        stocks=[], // new ClassSaleStock()
        payment_methods = [ClassSale.PAYMENT_METHOD.UNKNOWN],
        status = ClassSale.STATUS.UNKNOWN,
        created_time = new Date(),
        last_edit_time = new Date(),
    }) {
        super(uid, created_time, last_edit_time, "");
        this._uid_company = String(uid_company ?? "").trim();
        this._uid_shop = String(uid_shop ?? "").trim();
        this._uid_user = String(uid_user ?? "").trim();
        this._amount_paid_with_other = Number(amount_paid_with_other ?? 0);
        this._amount_paid_with_points = Number(amount_paid_with_points ?? 0);
        this._amount_total = Number(amount_total ?? 0);
        this._points_earned = Number(points_earned ?? 0);
        this._currency = String(currency ?? "CHF").trim();
        this._stocks = stocks.map((stock) => new ClassSaleStock(stock));
        this._payment_methods = payment_methods;
        this._status = status;
    }
    get uid_company() {
        return this._uid_company;
    }
    set uid_company(value) {
        this._uid_company = String(value ?? "").trim();
    }
    get uid_shop() {
        return this._uid_shop;
    }
    set uid_shop(value) {
        this._uid_shop = String(value ?? "").trim();
    }
    get uid_user() {
        return this._uid_user;
    }
    set uid_user(value) {
        this._uid_user = String(value ?? "").trim();
    }
    get amount_paid_with_other() {
        return this._amount_paid_with_other;
    }
    set amount_paid_with_other(value) {
        this._amount_paid_with_other = Number(value ?? 0);
    }
    get amount_paid_with_points() {
        return this._amount_paid_with_points;
    }

    set amount_paid_with_points(value) {
        this._amount_paid_with_points = Number(value ?? 0);
    }
    get amount_total() {
        return this._amount_total;
    }
    set amount_total(value) {
        this._amount_total = Number(value ?? 0);
    }
    get points_earned() {
        return this._points_earned;
    }
    set points_earned(value) {
        this._points_earned = Number(value ?? 0);
    }
    get currency() {
        return this._currency;
    }
    set currency(value) {
        this._currency = String(value ?? "CHF").trim();
    }
    get stocks() {
        return this._stocks;
    }
    set stocks(value) {
        this._stocks = Array.isArray(value)
            ? value.map((stock) => (stock instanceof ClassSaleStock ? stock : new ClassSaleStock(stock)))
            : [];
    }
    get payment_methods() {
        return this._payment_methods;
    }
    set payment_methods(value) {
        this._payment_methods = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    static makeInstance(uid, data = {}) {
        return new ClassSale({ uid, ...data });
    }

    static toJSON(data = this) {
        const payload = ClassFirestore.toJSON(data);
        if (data instanceof ClassSale && Array.isArray(data._stocks)) {
            payload.stocks = data._stocks.map((stock) => ClassSaleStock.toJSON(
                stock instanceof ClassSaleStock ? stock : ClassSaleStock.makeInstance(stock),
            ));
        }
        return payload;
    }

    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassSale) {
                const payload = ClassSale.toJSON(instance);
                payload.stocks = instance.stocks.map((stock) => ClassSaleStock.toJSON(stock));
                return payload;
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            raw.stocks = (raw.stocks ?? []).map((stock) => ClassSaleStock.fromFirestore(stock));
            return ClassSale.makeInstance(snapshot.id, raw);
        },
    };
    static colRef(uidCompany, uidShop) {
        return collection(
            firestore,
            `${ClassCompany.COLLECTION}/${uidCompany}/${ClassShop.COLLECTION}/${uidShop}/${this.COLLECTION}`,
        ).withConverter(this.converter);
    }
    static docRef(uidCompany, uidShop, id) {
        return doc(
            firestore,
            `${ClassCompany.COLLECTION}/${uidCompany}/${ClassShop.COLLECTION}/${uidShop}/${this.COLLECTION}`,
            id,
        ).withConverter(this.converter);
    }

    static async listShopIdsForCompany(uidCompany) {
        const { uidCompany: normalizedCompany } = normalizeSaleScope(uidCompany);
        if (!normalizedCompany) return [];

        const snap = await getDocs(query(ClassShop.colRef(normalizedCompany)));
        return snap.docs.map((entry) => entry.id);
    }

    static async getFirestoreForShop(uidCompany, uidShop, uid) {
        const {
            uidCompany: normalizedCompany,
            uidShop: normalizedShop,
            uidSale: normalizedUid,
        } = normalizeSaleScope(uidCompany, uidShop, uid);
        if (!normalizedCompany || !normalizedShop || !normalizedUid) return null;

        try {
            const snap = await getDoc(this.docRef(normalizedCompany, normalizedShop, normalizedUid));
            return snap.exists() ? snap.data() : null;
        } catch (error) {
            console.error("ClassSale.getFirestoreForShop", error?.message ?? error);
            return null;
        }
    }

    static async getFirestoreForCompany(uidCompany, uid, uidShop = "") {
        const normalizedShop = String(uidShop ?? "").trim();
        if (normalizedShop) {
            return this.getFirestoreForShop(uidCompany, normalizedShop, uid);
        }

        return this.findFirestoreInCompany(uidCompany, uid);
    }

    static async findFirestoreInCompany(uidCompany, uidSale) {
        const { uidCompany: normalizedCompany, uidSale: normalizedUid } = normalizeSaleScope(
            uidCompany,
            "",
            uidSale,
        );
        if (!normalizedCompany || !normalizedUid) return null;

        const shopIds = await this.listShopIdsForCompany(normalizedCompany);
        for (const uidShop of shopIds) {
            const sale = await this.getFirestoreForShop(normalizedCompany, uidShop, normalizedUid);
            if (sale) return sale;
        }

        return null;
    }

    static lineReferencesProductUid(line, uidProduct, stockUids = new Set()) {
        const normalizedProductUid = String(uidProduct ?? "").trim();
        if (!line || !normalizedProductUid) return false;

        const uidStock = String(line.uid_stock ?? line._uid_stock ?? "").trim();
        if (uidStock && (stockUids.has(uidStock) || uidStock === normalizedProductUid)) {
            return true;
        }

        const uidProductLine = String(line.uid_product ?? line._uid_product ?? "").trim();
        return uidProductLine === normalizedProductUid;
    }

    static async existsForProductUid(uidProduct, uidCompany = "") {
        const normalizedProductUid = String(uidProduct ?? "").trim();
        const normalizedCompany = String(uidCompany ?? "").trim();
        if (!normalizedProductUid) return false;

        try {
            if (!normalizedCompany) {
                const companiesSnap = await getDocs(query(ClassCompany.colRef()));
                for (const companyDoc of companiesSnap.docs) {
                    if (await this.existsForProductUidInCompany(normalizedProductUid, companyDoc.id)) {
                        return true;
                    }
                }
                return false;
            }

            return this.existsForProductUidInCompany(normalizedProductUid, normalizedCompany);
        } catch (error) {
            console.error("ClassSale.existsForProductUid", error?.message ?? error);
            throw error;
        }
    }

    static async existsForProductUidInCompany(uidProduct, uidCompany) {
        const normalizedProductUid = String(uidProduct ?? "").trim();
        const normalizedCompany = String(uidCompany ?? "").trim();
        if (!normalizedProductUid || !normalizedCompany) return false;

        const stockUids = new Set(
            (await ClassStock.listFirestoreForCompany(normalizedCompany, [
                where("uid_product", "==", normalizedProductUid),
            ]))
                .map((stock) => String(stock.uid ?? "").trim())
                .filter(Boolean),
        );

        const shopIds = await this.listShopIdsForCompany(normalizedCompany);
        for (const uidShop of shopIds) {
            const snap = await getDocs(query(this.colRef(normalizedCompany, uidShop)));
            for (const docSnap of snap.docs) {
                const sale = docSnap.data();
                const lines = sale?.stocks ?? [];
                for (const line of lines) {
                    if (this.lineReferencesProductUid(line, normalizedProductUid, stockUids)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    async createFirestore() {
        if (!this._uid_company || !this._uid_shop || !this._uid_user) return null;

        const uidCompany = this._uid_company;
        const uidShop = this._uid_shop;

        if (!this._uid) {
            const newRef = doc(this.constructor.colRef(uidCompany, uidShop));
            this._uid = newRef.id;
        }

        if (!this._stocks || this._stocks.length === 0) return null;

        const ref = this.constructor.docRef(uidCompany, uidShop, this._uid);
        await setDoc(ref, this, { merge: true });
        return this.constructor.makeInstance(this._uid, {
            ...this.constructor.toJSON(this),
            uid_company: uidCompany,
            uid_shop: uidShop,
        });
    }
    async updateFirestore() {
        if (!this._uid_company || !this._uid_shop || !this._uid_user || !this._uid) return null;

        try {
            const ref = this.constructor.docRef(this._uid_company, this._uid_shop, this._uid);
            await setDoc(ref, this, { merge: true });
            return this.constructor.makeInstance(this._uid, {
                ...this.constructor.toJSON(this),
                uid_company: this._uid_company,
                uid_shop: this._uid_shop,
            });
        } catch (error) {
            console.error("ClassSale.updateFirestore", error?.message ?? error);
            return null;
        }
    }
    async removeFirestore() {
        if (!this._uid_company || !this._uid_shop || !this._uid_user || !this._uid) return null;

        try {
            const ref = this.constructor.docRef(this._uid_company, this._uid_shop, this._uid);
            await deleteDoc(ref);
            return true;
        } catch (error) {
            console.error("ClassSale.removeFirestore", error?.message ?? error);
            return false;
        }
    }
}

export class ClassSaleStock {
    constructor({
        uid_stock = "",
        quantity = 0,
        price = 0,
        total = 0,
        points_to_earn = 0,
    }) {
        this._uid_stock = String(uid_stock ?? "").trim();
        this._quantity = Number(quantity ?? 0);
        this._price = Number(price ?? 0);
        this._total = Number(total ?? 0);
        this._points_to_earn = Number(points_to_earn ?? 0);
    }
    get uid_stock() {
        return this._uid_stock;
    }
    set uid_stock(value) {
        this._uid_stock = String(value ?? "").trim();
    }
    get quantity() {
        return this._quantity;
    }
    set quantity(value) {
        this._quantity = Number(value ?? 0);
    }
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = Number(value ?? 0);
    }
    get total() {
        return this._total;
    }
    set total(value) {
        this._total = Number(value ?? 0);
    }
    get points_to_earn() {
        return this._points_to_earn;
    }
    set points_to_earn(value) {
        this._points_to_earn = Number(value ?? 0);
    }
    static toJSON(data = this) {
        const out = { ...data };
        const cleaned = Object.fromEntries(
            Object.entries(out)
                .filter(([k, v]) => k.startsWith("_") && v !== undefined)
                .map(([k, v]) => [k.replace(/^_/, ""), v]),
        );
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
    static fromFirestore(data = {}) {
        return ClassSaleStock.makeInstance(data);
    }
    static makeInstance(data = {}) {
        return new ClassSaleStock(data);
    }

}
