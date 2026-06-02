import { ClassFirestore } from "./ClassFirestore";

export class ClassLoyalty extends ClassFirestore {
    static COLLECTION = "LOYALTIES";
    static NS_COLLECTION = "classes/loyalties";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
        //"created_time",
        //"last_edit_time",
    ];
    static AMOUNT_TO_EARN_ONE_POINT = 75;
    static CURRENCY_TO_EARN_ONE_POINT = "CHF";
    static UIDS_PRIDUCTS_PROHIBITED_FROM_EARNING_POINTS = [];
    static TIER = Object.freeze({
        NORMAL: "normal",
        REGULAR: "regular",
        PERSISTENT: "persistent",
        BRONZE: "bronze",
        SILVER: "silver",
        GOLD: "gold",
        PLATINUM: "platinum",
        DIAMOND: "diamond",
        MASTER: "master",
        GRAND_MASTER: "grand_master",
        LEGENDARY: "legendary",
        ULTIMATE: "ultimate",
        GODLIKE: "godlike",
        IMMORTAL: "immortal",
        UNKNOWN: "unknown",
    });
    static TIER_STEPS = Object.freeze([
        { tier: ClassLoyalty.TIER.IMMORTAL, minAmount: 100_000 },
        { tier: ClassLoyalty.TIER.GODLIKE, minAmount: 75_000 },
        { tier: ClassLoyalty.TIER.ULTIMATE, minAmount: 50_000 },
        { tier: ClassLoyalty.TIER.LEGENDARY, minAmount: 25_000 },
        { tier: ClassLoyalty.TIER.GRAND_MASTER, minAmount: 15_000 },
        { tier: ClassLoyalty.TIER.MASTER, minAmount: 12_000 },
        { tier: ClassLoyalty.TIER.DIAMOND, minAmount: 10_000 },
        { tier: ClassLoyalty.TIER.PLATINUM, minAmount: 7_500 },
        { tier: ClassLoyalty.TIER.GOLD, minAmount: 5_000 },
        { tier: ClassLoyalty.TIER.SILVER, minAmount: 3_000 },
        { tier: ClassLoyalty.TIER.BRONZE, minAmount: 1_500 },
        { tier: ClassLoyalty.TIER.PERSISTENT, minAmount: 750 },
        { tier: ClassLoyalty.TIER.REGULAR, minAmount: 300 },
        { tier: ClassLoyalty.TIER.NORMAL, minAmount: 0 },
    ]);

    /** Paliers du plus bas au plus haut (montant cumulé croissant). */
    static getTierStepsAscending() {
        return [...ClassLoyalty.TIER_STEPS].sort((a, b) => a.minAmount - b.minAmount);
    }
    constructor({
        uid = "",
        uid_user = "",
        uid_company = "",
        created_time = new Date(),
        last_edit_time = new Date(),
    }) {
        super(uid, created_time, last_edit_time, "");
    }
}

export class ClassLoyaltyItem {
    constructor({
        uid_company = "",
        uid_user = "",
        loyalty_points = 0.0,
        loyalty_amount = 0.0,
        created_time = new Date(),
        last_edit_time = new Date(),
    }) {
        this._uid_company = uid_company;
        this._uid_user = uid_user;
        this._loyalty_points = loyalty_points;
        this._loyalty_amount = loyalty_amount;
        this._created_time = ClassFirestore._toJsDate(created_time);
        this._last_edit_time = ClassFirestore._toJsDate(last_edit_time);
    }

    get uid_company() {
        return this._uid_company;
    }
    get uid_user() {
        return this._uid_user;
    }
    get loyalty_tier() {
        return ClassLoyaltyItem._get_loyalty_tier_from_amount(this._loyalty_amount);
    }
    get loyalty_points() {
        return this._loyalty_points;
    }
    get loyalty_amount() {
        return this._loyalty_amount;
    }
    set loyalty_points(value) {
        this._loyalty_points = value;
    }
    set loyalty_amount(value) {
        this._loyalty_amount = value;
    }
    get created_time() {
        return this._created_time;
    }
    set created_time(value) {
        this._created_time = ClassFirestore._toJsDate(value);
    }
    get last_edit_time() {
        return this._last_edit_time;
    }
    set last_edit_time(value) {
        this._last_edit_time = ClassFirestore._toJsDate(value);
    }
    static _get_loyalty_tier_from_amount(amount) {
        const value = ClassLoyaltyItem._normalizeLoyalty_amount(amount);
        for (const step of ClassLoyalty.TIER_STEPS) {
            if (value >= step.minAmount) return step.tier
        }
        return ClassLoyalty.TIER.NORMAL
    }
    static _normalizeLoyalty_amount(value) {
        const n = Number(value)
        if (!Number.isFinite(n) || n < 0) return 0
        return Math.round(n * 100) / 100
    }
    static toJSON(data = this) {
        const source =
            data instanceof ClassLoyaltyItem
                ? data
                : ClassLoyaltyItem.makeInstance(data ?? {});

        return ClassLoyaltyItem.omitUndefinedDeep({
            uid_company: source.uid_company,
            uid_user: source.uid_user,
            loyalty_points: source.loyalty_points,
            loyalty_amount: source.loyalty_amount,
            ...(source.created_time ? { created_time: source.created_time } : {}),
            ...(source.last_edit_time ? { last_edit_time: source.last_edit_time } : {}),
        });
    }
    static omitUndefinedDeep(obj) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== undefined)
        );
    }
    static makeInstance(data = {}) {
        return new ClassLoyaltyItem(data);
    }
}

export class ClassLoyaltyAction extends ClassFirestore {
    static COLLECTION = "LOYALTY_ACTIONS";
    static NS_COLLECTION = "classes/loyalty_actions";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
        //"created_time",
        //"last_edit_time",
    ];
    static TYPE = Object.freeze({
        SEND: "send",
        RECEIVE: "receive",
        UNKNOWN: "unknown",
    });
    static STATUS = Object.freeze({
        PENDING: "pending",
        ACCEPTED: "accepted",
        REJECTED: "rejected",
        UNKNOWN: "unknown",
    });
    constructor({
        uid = "",
        uid_company = "",
        uid_user = "",
        uid_target = "",
        loyalty_points = 0.0,
        type = ClassLoyaltyAction.TYPE.UNKNOWN,
        status = ClassLoyaltyAction.STATUS.PENDING,
        created_time = new Date(),
        last_edit_time = new Date(),
    }) {
        super(uid, created_time, last_edit_time, "");
        this._uid_company = uid_company;
        this._uid_user = uid_user;
        this._uid_target = uid_target;
        this._loyalty_points = loyalty_points;
        this._type = type;
        this._status = status;
    }
    get uid_company() {
        return this._uid_company;
    }
    get uid_user() {
        return this._uid_user;
    }
    get uid_target() {
        return this._uid_target;
    }
    get loyalty_points() {
        return this._loyalty_points;
    }
    get type() {
        return this._type;
    }
    get status() {
        return this._status;
    }
    set uid_company(value) {
        this._uid_company = value;
    }
    set uid_user(value) {
        this._uid_user = value;
    }
    set uid_target(value) {
        this._uid_target = value;
    }
    set loyalty_points(value) {
        this._loyalty_points = value;
    }
    set type(value) {
        this._type = value;
    }
    set status(value) {
        this._status = value;
    }
    static makeInstance(uid, data = {}) {
        if (data.type === ClassLoyaltyAction.TYPE.SEND) {
            return new ClassLoyaltySend({ uid, ...data });
        } else if (data.type === ClassLoyaltyAction.TYPE.RECEIVE) {
            return new ClassLoyaltyReceive({ uid, ...data });
        }
        return new ClassLoyaltyAction({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassLoyaltyAction) {
                const payload = ClassLoyaltyAction.toJSON(instance);
                return payload;
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            const uid = snapshot.id;
            const data = raw;
            return ClassLoyaltyAction.makeInstance(uid, data);
        },
    };
}
export class ClassLoyaltySend extends ClassLoyaltyAction {
    constructor(data={}) {
        super({
            ...data,
            type: ClassLoyaltyAction.TYPE.SEND,
        });
    }
    static makeInstance(uid, data = {}) {
        return new ClassLoyaltySend({ uid, ...data });
    }
}
export class ClassLoyaltyReceive extends ClassLoyaltyAction {
    constructor(data={}) {
        super({
            ...data,
            type: ClassLoyaltyAction.TYPE.RECEIVE,
        });
    }
    static makeInstance(uid, data = {}) {
        return new ClassLoyaltyReceive({ uid, ...data });
    }
}