import { firestore } from "@/lib/firebaseConfig";
import { ClassFirestore } from "./ClassFirestore";
import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { ClassCompany } from "./ClassCompany";
import { ClassShop } from "./ClassShop";

function normalizeStockScope(uidCompany, uidShop, uidStock = "") {
    return {
        uidCompany: String(uidCompany ?? "").trim(),
        uidShop: String(uidShop ?? "").trim(),
        uidStock: String(uidStock ?? "").trim(),
    };
}

export class ClassStock extends ClassFirestore {
    static COLLECTION = "STOCKS";
    static STORAGE_FOLDER = "stocks";
    static NS_COLLECTION = "classes/stocks";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
        'reviews',
    ];
    static STATUS = Object.freeze({
        AVAILABLE: "available",
        UNAVAILABLE: "unavailable",
        OUT_OF_STOCK: "out_of_stock",
        LOW_STOCK: "low_stock",
        UNKNOWN: "unknown",
    });
    static TAGS = Object.freeze({
        ARTISAN: "artisan",
        BIO: "bio",
        HALAL: "halal",
        VEGAN: "vegan",
        GLUTEN_FREE: "gluten_free",
        LACTOSE_FREE: "lactose_free",
        NUT_FREE: "nut_free",
        SOY_FREE: "soy_free",
        WHEAT_FREE: "wheat_free",
        ORGANIC: "organic",
        LOCAL: "local",
        PROMO: "promo",
        NEW: "new",
        BEST_SELLER: "best_seller",
        FEATURED: "featured",
        BEST_VALUE: "best_value",
        BEST_OFFER: "best_offer",
        BEST_DEAL: "best_deal",
        UNKNOWN: "unknown",
    });
    static BADGES = Object.freeze({
        NEW: "new",
        SALE: "sale",
        FEATURED: "featured",
        UNKNOWN: "unknown",
    });

    constructor({
        uid = "",
        uid_company = "system",
        uid_shop = "",
        uid_product = "",
        uids_reviews = [],
        price = 0,
        old_price = 0,
        buy_price = 0,
        stock = 0,
        badge = ClassStock.BADGES.UNKNOWN,
        is_deliverable = false,
        is_trending = false,
        is_favorite = false,
        is_to_discover = false,
        is_recommended = false,
        is_promo = false,
        is_discount = false,
        tags = [],
        status = ClassStock.STATUS.UNKNOWN,
        created_time = new Date(),
        last_edit_time = new Date(),
    }) {
        super(uid, created_time, last_edit_time, "");
        this._uid_company = String(uid_company ?? "").trim();
        this._uid_shop = String(uid_shop ?? "").trim();
        this._uid_product = String(uid_product ?? "").trim();
        this._uids_reviews = uids_reviews;
        this._price = price;
        this._old_price = old_price;
        this._buy_price = buy_price;
        this._stock = stock;
        this._badge = badge;
        this._is_deliverable = is_deliverable;
        this._is_trending = is_trending;
        this._is_favorite = is_favorite;
        this._is_to_discover = is_to_discover;
        this._is_recommended = is_recommended;
        this._is_promo = is_promo;
        this._is_discount = is_discount;
        this._tags = tags;
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
    get uid_product() {
        return this._uid_product;
    }
    set uid_product(value) {
        this._uid_product = String(value ?? "").trim();
    }
    get uids_reviews() {
        return this._uids_reviews;
    }
    set uids_reviews(value) {
        this._uids_reviews = value;
    }
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = value;
    }
    get old_price() {
        return this._old_price;
    }
    set old_price(value) {
        this._old_price = value;
    }
    get buy_price() {
        return this._buy_price;
    }
    set buy_price(value) {
        this._buy_price = value;
    }
    get stock() {
        return this._stock;
    }
    set stock(value) {
        this._stock = value;
    }
    get badge() {
        return this._badge;
    }
    set badge(value) {
        this._badge = value;
    }
    get is_deliverable() {
        return this._is_deliverable;
    }
    set is_deliverable(value) {
        this._is_deliverable = Boolean(value);
    }
    get is_trending() {
        return this._is_trending;
    }
    set is_trending(value) {
        this._is_trending = Boolean(value);
    }
    get is_favorite() {
        return this._is_favorite;
    }
    set is_favorite(value) {
        this._is_favorite = Boolean(value);
    }
    get is_to_discover() {
        return this._is_to_discover;
    }
    set is_to_discover(value) {
        this._is_to_discover = Boolean(value);
    }
    get is_recommended() {
        return this._is_recommended;
    }
    set is_recommended(value) {
        this._is_recommended = Boolean(value);
    }
    get is_promo() {
        return this._is_promo;
    }
    set is_promo(value) {
        this._is_promo = Boolean(value);
    }
    get is_discount() {
        return this._is_discount;
    }
    set is_discount(value) {
        this._is_discount = Boolean(value);
    }
    get tags() {
        return this._tags;
    }
    set tags(value) {
        this._tags = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }

    static makeInstance(uid, data = {}) {
        return new ClassStock({ uid, ...data });
    }

    static async listShopIdsForCompany(uidCompany) {
        const { uidCompany: normalizedCompany } = normalizeStockScope(uidCompany);
        if (!normalizedCompany) return [];

        const snap = await getDocs(query(ClassShop.colRef(normalizedCompany)));
        return snap.docs.map((entry) => entry.id);
    }

    static async listFirestoreForShop(uidCompany, uidShop, constraints = []) {
        const { uidCompany: normalizedCompany, uidShop: normalizedShop } = normalizeStockScope(
            uidCompany,
            uidShop,
        );
        if (!normalizedCompany || !normalizedShop) return [];

        const q = constraints.length > 0
            ? query(this.colRef(normalizedCompany, normalizedShop), ...constraints)
            : query(this.colRef(normalizedCompany, normalizedShop));
        const snap = await getDocs(q);
        return snap.docs.map((entry) => entry.data());
    }

    static async listFirestoreForCompany(uidCompany, constraints = []) {
        const shopIds = await this.listShopIdsForCompany(uidCompany);
        const all = [];

        for (const uidShop of shopIds) {
            const stocks = await this.listFirestoreForShop(uidCompany, uidShop, constraints);
            all.push(...stocks);
        }

        return all;
    }

    static async getFirestoreForShop(uidCompany, uidShop, uid) {
        const {
            uidCompany: normalizedCompany,
            uidShop: normalizedShop,
            uidStock: normalizedUid,
        } = normalizeStockScope(uidCompany, uidShop, uid);
        if (!normalizedCompany || !normalizedShop || !normalizedUid) return null;

        try {
            const snap = await getDoc(this.docRef(normalizedCompany, normalizedShop, normalizedUid));
            return snap.exists() ? snap.data() : null;
        } catch (error) {
            console.error("ClassStock.getFirestoreForShop", error?.message ?? error);
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

    static async findFirestoreInCompany(uidCompany, uidStock) {
        const { uidCompany: normalizedCompany, uidStock: normalizedUid } = normalizeStockScope(
            uidCompany,
            "",
            uidStock,
        );
        if (!normalizedCompany || !normalizedUid) return null;

        const shopIds = await this.listShopIdsForCompany(normalizedCompany);
        for (const uidShop of shopIds) {
            const stock = await this.getFirestoreForShop(normalizedCompany, uidShop, normalizedUid);
            if (stock) return stock;
        }

        return null;
    }

    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassStock) {
                return ClassStock.toJSON(instance);
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            return ClassStock.makeInstance(snapshot.id, raw);
        },
    };

    static colRef(uidCompany, uidShop) {
        const { uidCompany: normalizedCompany, uidShop: normalizedShop } = normalizeStockScope(
            uidCompany,
            uidShop,
        );
        return collection(
            firestore,
            `${ClassCompany.COLLECTION}/${normalizedCompany}/${ClassShop.COLLECTION}/${normalizedShop}/${this.COLLECTION}`,
        ).withConverter(this.converter);
    }

    static colGroupRef() {
        return collectionGroup(firestore, this.COLLECTION).withConverter(this.converter);
    }

    static async existsForProductUid(uidProduct, uidCompany = "") {
        const normalizedProductUid = String(uidProduct ?? "").trim();
        const normalizedCompany = String(uidCompany ?? "").trim();
        if (!normalizedProductUid) return false;

        try {
            if (normalizedCompany) {
                const shopIds = await this.listShopIdsForCompany(normalizedCompany);
                for (const uidShop of shopIds) {
                    const snap = await getDocs(
                        query(
                            this.colRef(normalizedCompany, uidShop),
                            where("uid_product", "==", normalizedProductUid),
                            limit(1),
                        ),
                    );
                    if (!snap.empty) return true;
                }
                return false;
            }

            const snap = await getDocs(
                query(
                    this.colGroupRef(),
                    where("uid_product", "==", normalizedProductUid),
                    limit(1),
                ),
            );
            return !snap.empty;
        } catch (error) {
            console.error("ClassStock.existsForProductUid", error?.message ?? error);
            throw error;
        }
    }

    static docRef(uidCompany, uidShop, id) {
        const {
            uidCompany: normalizedCompany,
            uidShop: normalizedShop,
            uidStock: normalizedUid,
        } = normalizeStockScope(uidCompany, uidShop, id);
        return doc(
            firestore,
            `${ClassCompany.COLLECTION}/${normalizedCompany}/${ClassShop.COLLECTION}/${normalizedShop}/${this.COLLECTION}`,
            normalizedUid,
        ).withConverter(this.converter);
    }

    async createFirestore() {
        if (!this._uid_company || !this._uid_shop) return null;

        const uidCompany = this._uid_company;
        const uidShop = this._uid_shop;

        if (!this._uid) {
            const newRef = doc(this.constructor.colRef(uidCompany, uidShop));
            this._uid = newRef.id;
        }

        if (!this._uid_product) return null;

        const ref = this.constructor.docRef(uidCompany, uidShop, this._uid);
        await setDoc(ref, this, { merge: true });
        return this.constructor.makeInstance(this._uid, {
            ...this.constructor.toJSON(this),
            uid_company: uidCompany,
            uid_shop: uidShop,
        });
    }

    async updateFirestore() {
        if (!this._uid_company || !this._uid_shop || !this._uid) return null;

        try {
            const ref = this.constructor.docRef(this._uid_company, this._uid_shop, this._uid);
            await setDoc(ref, this, { merge: true });
            return this.constructor.makeInstance(this._uid, {
                ...this.constructor.toJSON(this),
                uid_company: this._uid_company,
                uid_shop: this._uid_shop,
            });
        } catch (error) {
            console.error("ClassStock.updateFirestore", error?.message ?? error);
            return null;
        }
    }

    async removeFirestore() {
        if (!this._uid_company || !this._uid_shop || !this._uid) return null;

        try {
            const ref = this.constructor.docRef(this._uid_company, this._uid_shop, this._uid);
            await deleteDoc(ref);
            return true;
        } catch (error) {
            console.error("ClassStock.removeFirestore", error?.message ?? error);
            return false;
        }
    }
}
