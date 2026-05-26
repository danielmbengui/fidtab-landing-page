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