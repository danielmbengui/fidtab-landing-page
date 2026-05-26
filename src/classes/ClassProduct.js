import { collection, doc } from "firebase/firestore";
import { ClassFirestore } from "./ClassFirestore";
import { firestore } from "@/lib/firebaseConfig";

export class ClassProduct extends ClassFirestore {
    static COLLECTION = "PRODUCTS";
    static STORAGE_FOLDER = "products";
    static NS_COLLECTION = "classes/products";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
        'reviews',
        //'description',
        //'slogan',
    ];
    static CATEGORY = Object.freeze({
        FOOD_AND_GROCERIES: "food_and_groceries",
        HOUSEHOLD: "household", //produits ménagers
        TOBACCO_AND_ACCESSORIES: "tobacco_and_accessories", //tabac et accessoires
        PERSONAL_CARE: "personal_care", //soins personnels
        BABY_PRODUCTS: "baby_products", //produits pour les enfants
        PET_PRODUCTS: "pet_products", //produits pour les animaux
        OFFICE_AND_STATIONERY: "office_and_stationery", //bureau et papeterie
        ELECTRONICS_AND_ACCESSORIES: "electronics_and_accessories", //électronique et accessoires
        BEAUTY_DEVICES: "beauty_devices", //appareils de beauté
        SERVICES: "services", //services
        UNKNOWN: "unknown",
    });
    static SUB_CATEGORY = Object.freeze({
        UNKNOWN: { category: ClassProduct.CATEGORY.UNKNOWN, value: "unknown", },
    });
    static TYPE = Object.freeze({
        UNKNOWN: { category: ClassProduct.CATEGORY.UNKNOWN, value: "unknown", },
    });
    static STATUS = Object.freeze({
        AVAILABLE: "available",
        UNAVAILABLE: "unavailable",
        OUT_OF_STOCK: "out_of_stock",
        LOW_STOCK: "low_stock",
        UNKNOWN: "unknown",
    });
    static UNIT = Object.freeze({
        PIECE: "piece",
        KG: "kg",
        L: "l",
        CL: "cl",
        PACK: "pack",
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
        uid_fidtab_product = "",
        uid_brand = "",
        uids_reviews=[],
        bar_code_number="",
        name = "",
        photo_url = "",
        description = "",
        short_description = "",
        price = 0,
        old_price = 0,
        buy_price=0,
        unit = ClassProduct.UNIT.PIECE,
        quantity = 0,
        stock = 0,
        origin_code_country = "",
        badge = ClassProduct.BADGES.UNKNOWN,
        is_deliverable = false,
        is_trending = false,
        is_favorite = false,
        is_to_discover = false,
        is_recommended = false,
        is_to_recommended,
        is_promo = false,
        is_discount=false,
        rating = 0,
        reviews = [],
        tags = [],
        category = ClassProduct.CATEGORY.UNKNOWN,
        sub_category = ClassProduct.SUB_CATEGORY.UNKNOWN.value,
        type = ClassProduct.TYPE.UNKNOWN.value,
        status = ClassProduct.STATUS.UNKNOWN,
        storage_url = "",
        created_time = new Date(),
        last_edit_time = new Date(),
    }) {
        const _storage_url = `${ClassProduct.COLLECTION}/${uid}/product.jpg`;
        super(uid, created_time, last_edit_time, storage_url || _storage_url);
        this._uid_company = uid_company;
        this._uid_fidtab_product = String(uid_fidtab_product ?? "");
        this._uid_brand = uid_brand;
        this._uids_reviews=uids_reviews;
        this._bar_code_number = bar_code_number;
        this._name = name;
        this._photo_url = photo_url;
        this._description = description;
        this._short_description = short_description;
        this._price = price;
        this._old_price = old_price;
        this._buy_price = buy_price;
        this._unit = unit;
        this._quantity = quantity;
        this._stock = stock;
        this._origin_code_country = origin_code_country;
        this._badge = badge;
        this._is_deliverable = is_deliverable;
        this._is_trending = is_trending;
        this._is_favorite = is_favorite;
        this._is_to_discover = is_to_discover;
        this._is_recommended = Boolean(
            is_recommended ?? is_to_recommended ?? false,
        );
        this._is_promo = is_promo;
        this._is_discount = is_discount;
        this._rating = rating;
        this._reviews = reviews;
        this._tags = tags;
        this._category = category;
        this._sub_category = sub_category;
        this._type = type;
        this._status = status;
    }
    get uid_company() {
        return this._uid_company;
    }
    set uid_company(value) {
        this._uid_company = value;
    }
    get uid_fidtab_product() {
        return this._uid_fidtab_product;
    }
    set uid_fidtab_product(value) {
        this._uid_fidtab_product = String(value ?? "");
    }
    get uid_brand() {
        return this._uid_brand;
    }
    set uid_brand(value) {
        this._uid_brand = value;
    }
    get uids_reviews() {
        return this._uids_reviews;
    }
    set uids_reviews(value) {
        this._uids_reviews = value;
    }
    get bar_code_number() {
        return this._bar_code_number;
    }
    set bar_code_number(value) {
        this._bar_code_number = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get photo_url() {
        return this._photo_url;
    }
    set photo_url(value) {
        this._photo_url = value;
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get short_description() {
        return this._short_description;
    }
    set short_description(value) {
        this._short_description = value;
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
    get unit() {
        return this._unit;
    }
    set unit(value) {
        this._unit = value;
    }
    get quantity() {
        return this._quantity;
    }
    set quantity(value) {
        this._quantity = value;
    }
    get stock() {
        return this._stock;
    }
    set stock(value) {
        this._stock = value;
    }
    get origin_code_country() {
        return this._origin_code_country;
    }
    set origin_code_country(value) {
        this._origin_code_country = value;
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
        this._is_deliverable = value;
    }
    get is_trending() {
        return this._is_trending;
    }
    set is_trending(value) {
        this._is_trending = value;
    }
    get is_favorite() {
        return this._is_favorite;
    }
    set is_favorite(value) {
        this._is_favorite = value;
    }
    get is_to_discover() {
        return this._is_to_discover;
    }
    set is_to_discover(value) {
        this._is_to_discover = value;
    }
    get is_recommended() {
        return this._is_recommended;
    }
    set is_recommended(value) {
        this._is_recommended = value;
    }
    /** @deprecated Utiliser is_recommended */
    get is_to_recommended() {
        return this._is_recommended;
    }
    set is_to_recommended(value) {
        this._is_recommended = value;
    }
    get is_promo() {
        return this._is_promo;
    }
    set is_promo(value) {
        this._is_promo = value;
    }
    get is_discount() {
        return this._is_discount;
    }
    set is_discount(value) {
        this._is_discount = value;
    }
    get rating() {
        return this._rating;
    }
    set rating(value) {
        this._rating = value;
    }
    get reviews() {
        return this._reviews;
    }
    set reviews(value) {
        this._reviews = value;
    }
    get tags() {
        return this._tags;
    }
    set tags(value) {
        this._tags = value;
    }
    get category() {
        return this._category;
    }
    set category(value) {
        this._category = value;
    }
    get sub_category() {
        return this._sub_category;
    }
    set sub_category(value) {
        this._sub_category = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    static randomBarCodeSegment(length = 4) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i += 1) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    static resolveBarCodeTaxonomySegment(value) {
        const normalized = String(value ?? "").trim();
        if (
            !normalized ||
            normalized === ClassProduct.SUB_CATEGORY.UNKNOWN.value ||
            normalized === ClassProduct.TYPE.UNKNOWN.value
        ) {
            return ClassProduct.randomBarCodeSegment();
        }
        return normalized;
    }

    static createBarCodeNumber(category, sub_category, type, uid) {
        const prefix = (value) => String(value ?? "").slice(0, 4).toUpperCase();
        const subCategory = ClassProduct.resolveBarCodeTaxonomySegment(sub_category);
        const typeValue = ClassProduct.resolveBarCodeTaxonomySegment(type);
        return `${prefix(category)}-${prefix(subCategory)}-${prefix(typeValue)}-${prefix(uid)}`;
    }

    static makeInstance(uid, data = {}) {
        if (data.category === ClassProduct.CATEGORY.FOOD_AND_GROCERIES) {
            return new ClassProductFoodAndGroceries({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.HOUSEHOLD) {
            return new ClassProductHousehold({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.TOBACCO_AND_ACCESSORIES) {
            return new ClassProductTobaccoAndAccessories({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.PERSONAL_CARE) {
            return new ClassProductPersonalCare({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.BABY_PRODUCTS) {
            return new ClassProductBabyProducts({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.PET_PRODUCTS) {
            return new ClassProductPetProducts({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.OFFICE_AND_STATIONERY) {
            return new ClassProductOfficeAndStationery({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.ELECTRONICS_AND_ACCESSORIES) {
            return new ClassProductElectronicsAndAccessories({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.BEAUTY_DEVICES) {
            return new ClassProductBeautyDevices({ uid, ...data });
        }
        if (data.category === ClassProduct.CATEGORY.SERVICES) {
            return new ClassProductServices({ uid, ...data });
        }
        return new ClassProduct({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProduct) {
                return ClassProduct.toJSON(instance);
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
            return ClassProduct.makeInstance(uid, data);
        },
    };

    static colRef() {
        return collection(firestore, this.COLLECTION).withConverter(this.converter);
    }

    static docRef(id) {
        return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
    }

    async createFirestore() {
        if (!this._uid) {
            const newRef = doc(this.constructor.colRef());
            this._uid = newRef.id;
            this._storage_url = `${ClassProduct.COLLECTION}/${newRef.id}/product.jpg`;
        }
        if (!String(this._bar_code_number ?? "").trim()) {
            this._bar_code_number = ClassProduct.createBarCodeNumber(
                this._category,
                this._sub_category,
                this._type,
                this._uid,
            );
        }
        return super.createFirestore();
    }
}
export class ClassProductFoodAndGroceries extends ClassProduct {
    static STORAGE_FOLDER = "products/food_and_groceries";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        STAPLES: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "staples", },
        FRUITS_AND_VEGETABLES: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "fruits_and_vegetables", },
        MEAT_AND_FISH: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "meat_and_fish", },
        DAIRY_AND_EGGS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "dairy_and_eggs", },
        OILS_AND_CONDIMENTS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "oils_and_condiments", },
        SPICES_AND_SEASONINGS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "spices_and_seasonings", },
        BREAKFAST_FOODS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "breakfast_foods", },
        BAKERY_AND_BAKING: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "bakery_and_baking", },
        SNACKS_AND_CONFECTIONERY: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "snacks_and_confectionery", },
        FROZEN_FOODS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "frozen_foods", },
        CANNED_PRESERVED_FOODS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "canned_preserved_foods", },
        DRINKS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "drinks", },
        ALCOHOL: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "alcohol", },
        TRADITIONAL_FOODS: { category: ClassProduct.CATEGORY.FOOD_AND_GROCERIES, value: "traditional_foods", },
    });
    static TYPE = Object.freeze({
        RICE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.STAPLES, value: "rice", },
        PASTA: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.STAPLES, value: "pasta", },
        FLOUR: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.STAPLES, value: "flour", },
        SUGAR: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.STAPLES, value: "sugar", },
        SALT: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.STAPLES, value: "salt", },
        GRAINS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.STAPLES, value: "grains", },
        BREAD: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.STAPLES, value: "bread", },


        FRESH_FRUITS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FRUITS_AND_VEGETABLES, value: "fresh_fruits", },
        FRESH_VEGETABLES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FRUITS_AND_VEGETABLES, value: "fresh_vegetables", },
        GARLIC: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FRUITS_AND_VEGETABLES, value: "garlic", },
        ONION: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FRUITS_AND_VEGETABLES, value: "onion", },

        CHICKEN: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "chicken", },
        BEEF: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "beef", },
        SAUSAGES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "sausages", },
        FISH: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "fish", },
        PORK: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "pork", },
        PRAWNS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "prawns", },
        CRAB: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "crab", },
        LOBSTER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "lobster", },
        SQUID: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.MEAT_AND_FISH, value: "squid", },


        MILK: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "milk", },
        YOGURT: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "yogurt", },
        CHEESE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "cheese", },
        EGGS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "eggs", },
        BUTTER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "butter", },
        CREAM: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "cream", },
        ICE_CREAM: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "ice_cream", },
        POWDERED_MILK: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "powdered_milk", },
        COFEE_DRINK: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "coffee_drink", },
        CHOCOLATE_DRINK: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DAIRY_AND_EGGS, value: "chocolate_drink", },


        COOKING_OIL: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "cooking_oil", },
        OLIVE_OIL: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "olive_oil", },
        PALM_OIL: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "palm_oil", },
        VINEGAR: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "vinegar", },
        KETCHUP: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "ketchup", },
        MAYONNAISE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "mayonnaise", },
        MUSTARD: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "mustard", },
        SALAD_SAUCE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "salad_sauce", },
        TOMATO_SAUCE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "tomato_sauce", },
        HOT_SAUCE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "hot_sauce", },
        SOY_SAUCE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "soy_sauce", },
        SEASONINGS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "seasonings", },
        PESTO: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "pesto", },
        BBQ_SAUCE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.OILS_AND_CONDIMENTS, value: "bbq_sauce", },

        HERBS_AND_SPICES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "herbs_and_spices", },
        PEPPER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "pepper", },
        CURRY: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "curry", },
        PIMENT: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "piment", },
        GARLIC_POWDER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "garlic_powder", },
        ONION_POWDER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "onion_powder", },
        BOUILLON_CUBES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "bouillon_cubes", },
        MIXED_SPICES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SPICES_AND_SEASONINGS, value: "mixed_spices", },

        COFFEE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BREAKFAST_FOODS, value: "coffee", },
        TEA: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BREAKFAST_FOODS, value: "tea", },
        CHOCOLATE_POWDER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BREAKFAST_FOODS, value: "chocolate_powder", },
        CEREALS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BREAKFAST_FOODS, value: "cereals", },
        JAM: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BREAKFAST_FOODS, value: "jam", },

        BISCUITS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BAKERY_AND_BAKING, value: "biscuits", },
        CAKE_MIX: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BAKERY_AND_BAKING, value: "cake_mix", },
        BAKING_POWDER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BAKERY_AND_BAKING, value: "baking_powder", },
        YEAST: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.BAKERY_AND_BAKING, value: "yeast", },

        CANDY: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SNACKS_AND_CONFECTIONERY, value: "candy", },
        CHEWING_GUM: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SNACKS_AND_CONFECTIONERY, value: "chewing_gum", },
        CHOCOLATE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SNACKS_AND_CONFECTIONERY, value: "chocolate", },
        COOKIES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SNACKS_AND_CONFECTIONERY, value: "cookies", },
        CHIPS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SNACKS_AND_CONFECTIONERY, value: "chips", },
        POPCORN: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.SNACKS_AND_CONFECTIONERY, value: "popcorn", },

        WATER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DRINKS, value: "water", },
        SOFT_DRINKS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DRINKS, value: "soft_drinks", },
        JUICE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DRINKS, value: "juice", },
        ENERGY_DRINKS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DRINKS, value: "energy_drinks", },
        MILK_DRINKS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DRINKS, value: "milk_drinks", },
        COFFEE_DRINKS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DRINKS, value: "coffee_drinks", },
        SPORTS_DRINKS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.DRINKS, value: "sports_drinks", },

        BEER: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "beer", },
        WINE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "wine", },
        SPIRITS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "spirits", },
        LIQUOR: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "liquor", },
        RUM: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "rum", },
        VODKA: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "vodka", },
        WHISKEY: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "whiskey", },
        TEQUILA: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "tequila", },
        GIN: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "gin", },
        BRANDY: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "brandy", },
        PORTO: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "porto", },
        SAKE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.ALCOHOL, value: "sake", },

        FROZEN_MEAT: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FROZEN_FOODS, value: "frozen_meat", },
        FROZEN_FISH: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FROZEN_FOODS, value: "frozen_fish", },
        FROZEN_VEGETABLES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FROZEN_FOODS, value: "frozen_vegetables", },
        ICE_CREAM: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.FROZEN_FOODS, value: "ice_cream", },

        TUNA: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.CANNED_PRESERVED_FOODS, value: "tuna", },
        TOMATO_PASTE: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.CANNED_PRESERVED_FOODS, value: "tomato_paste", },
        BEANS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.CANNED_PRESERVED_FOODS, value: "beans", },
        CORN: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.CANNED_PRESERVED_FOODS, value: "corn", },
        SARDINES: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.CANNED_PRESERVED_FOODS, value: "sardines", },
        SALMON: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.CANNED_PRESERVED_FOODS, value: "salmon", },

        ASIAN_FOODS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.TRADITIONAL_FOODS, value: "asian_foods", },
        EUROPEAN_FOODS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.TRADITIONAL_FOODS, value: "european_foods", },
        AFRICAN_FOODS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.TRADITIONAL_FOODS, value: "african_foods", },
        LATIN_AMERICAN_FOODS: { sub_category: ClassProductFoodAndGroceries.SUB_CATEGORY.TRADITIONAL_FOODS, value: "latin_american_foods", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductFoodAndGroceries.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductFoodAndGroceries.CATEGORY.FOOD_AND_GROCERIES;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductFoodAndGroceries({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductFoodAndGroceries) {
                return ClassProductFoodAndGroceries.toJSON(instance);
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
            return ClassProductFoodAndGroceries.makeInstance(uid, data);
        },
    };
}
export class ClassProductHousehold extends ClassProduct {
    static STORAGE_FOLDER = "products/household";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        CLEANING_PRODUCTS: { category: ClassProduct.CATEGORY.HOUSEHOLD, value: "cleaning_products", },
        LAUNDRY: { category: ClassProduct.CATEGORY.HOUSEHOLD, value: "laundry", },
        KITCHEN_SUPPLIES: { category: ClassProduct.CATEGORY.HOUSEHOLD, value: "kitchen_supplies", },
        TRASH_AND_STORAGE: { category: ClassProduct.CATEGORY.HOUSEHOLD, value: "trash_and_storage", },
    });
    static TYPE = Object.freeze({
        DETERGENT: { sub_category: ClassProductHousehold.SUB_CATEGORY.CLEANING_PRODUCTS, value: "detergent", },
        BLEACH: { sub_category: ClassProductHousehold.SUB_CATEGORY.CLEANING_PRODUCTS, value: "bleach", },
        CLEANING_SOAP: { sub_category: ClassProductHousehold.SUB_CATEGORY.CLEANING_PRODUCTS, value: "cleaning_soap", },
        DISINFECTANT: { sub_category: ClassProductHousehold.SUB_CATEGORY.CLEANING_PRODUCTS, value: "disinfectant", },
        WASHING_POWDER: { sub_category: ClassProductHousehold.SUB_CATEGORY.LAUNDRY, value: "washing_powder", },
        FABRIC_SOFTENER: { sub_category: ClassProductHousehold.SUB_CATEGORY.LAUNDRY, value: "fabric_softener", },
        STAIN_REMOVER: { sub_category: ClassProductHousehold.SUB_CATEGORY.LAUNDRY, value: "stain_remover", },
        ALUMINUM_FOIL: { sub_category: ClassProductHousehold.SUB_CATEGORY.KITCHEN_SUPPLIES, value: "aluminum_foil", },
        PLASTIC_WRAP: { sub_category: ClassProductHousehold.SUB_CATEGORY.KITCHEN_SUPPLIES, value: "plastic_wrap", },
        SPONGES: { sub_category: ClassProductHousehold.SUB_CATEGORY.KITCHEN_SUPPLIES, value: "sponges", },
        TRASH_BAGS: { sub_category: ClassProductHousehold.SUB_CATEGORY.TRASH_AND_STORAGE, value: "trash_bags", },
        STORAGE_BAGS: { sub_category: ClassProductHousehold.SUB_CATEGORY.TRASH_AND_STORAGE, value: "storage_bags", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductHousehold.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductHousehold.CATEGORY.HOUSEHOLD;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductHousehold({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductHousehold) {
                return ClassProductHousehold.toJSON(instance);
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
            return ClassProductHousehold.makeInstance(uid, data);
        },
    };
}
export class ClassProductTobaccoAndAccessories extends ClassProduct {
    static STORAGE_FOLDER = "products/tobacco_and_accessories";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        TOBACCO_PRODUCTS: { category: ClassProduct.CATEGORY.TOBACCO_AND_ACCESSORIES, value: "tobacco_products", },
    });
    static TYPE = Object.freeze({
        CIGARETTES: { sub_category: ClassProductTobaccoAndAccessories.SUB_CATEGORY.TOBACCO_PRODUCTS, value: "cigarettes", },
        ROLLING_PAPERS: { sub_category: ClassProductTobaccoAndAccessories.SUB_CATEGORY.TOBACCO_PRODUCTS, value: "rolling_papers", },
        FILTERS: { sub_category: ClassProductTobaccoAndAccessories.SUB_CATEGORY.TOBACCO_PRODUCTS, value: "filters", },
        LIGHTERS: { sub_category: ClassProductTobaccoAndAccessories.SUB_CATEGORY.TOBACCO_PRODUCTS, value: "lighters", },
        ASHTRAYS: { sub_category: ClassProductTobaccoAndAccessories.SUB_CATEGORY.TOBACCO_PRODUCTS, value: "ashtrays", },
        SMOKING_ACCESSORIES: { sub_category: ClassProductTobaccoAndAccessories.SUB_CATEGORY.TOBACCO_PRODUCTS, value: "smoking_accessories", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductTobaccoAndAccessories.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductTobaccoAndAccessories.CATEGORY.TOBACCO_AND_ACCESSORIES;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductTobaccoAndAccessories({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductTobaccoAndAccessories) {
                return ClassProductTobaccoAndAccessories.toJSON(instance);
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
            return ClassProductTobaccoAndAccessories.makeInstance(uid, data);
        },
    };
}
export class ClassProductPersonalCare extends ClassProduct {
    static STORAGE_FOLDER = "products/personal_care";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        ORAL_CARE: { category: ClassProduct.CATEGORY.PERSONAL_CARE, value: "oral_care", },
        HAIR_CARE: { category: ClassProduct.CATEGORY.PERSONAL_CARE, value: "hair_care", },
        BEARD_AND_GROOMING: { category: ClassProduct.CATEGORY.PERSONAL_CARE, value: "beard_and_grooming", },
        PERSONAL_HYGIENE: { category: ClassProduct.CATEGORY.PERSONAL_CARE, value: "personal_hygiene", },
        FEMININE_CARE: { category: ClassProduct.CATEGORY.PERSONAL_CARE, value: "feminine_care", },
    });
    static TYPE = Object.freeze({
        TOOTHPASTE: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.ORAL_CARE, value: "toothpaste", },
        MOUTHWASH: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.ORAL_CARE, value: "mouthwash", },
        TOOTHBRUSHES: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.ORAL_CARE, value: "toothbrushes", },
        DENTAL_FLOSS: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.ORAL_CARE, value: "dental_floss", },
        SHAMPOO: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.HAIR_CARE, value: "shampoo", },
        CONDITIONER: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.HAIR_CARE, value: "conditioner", },
        HAIR_GEL: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.HAIR_CARE, value: "hair_gel", },
        HAIR_OIL: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.HAIR_CARE, value: "hair_oil", },
        BEARD_OIL: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.BEARD_AND_GROOMING, value: "beard_oil", },
        TRIMMERS: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.BEARD_AND_GROOMING, value: "trimmers", },
        RAZORS: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.BEARD_AND_GROOMING, value: "razors", },
        SHAVING_CREAM: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.BEARD_AND_GROOMING, value: "shaving_cream", },
        SOAP: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.PERSONAL_HYGIENE, value: "soap", },
        DEODORANT: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.PERSONAL_HYGIENE, value: "deodorant", },
        WET_WIPES: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.PERSONAL_HYGIENE, value: "wet_wipes", },
        TOILET_PAPER: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.PERSONAL_HYGIENE, value: "toilet_paper", },
        PADS: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.FEMININE_CARE, value: "pads", },
        TAMPONS: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.FEMININE_CARE, value: "tampons", },
        INTIMATE_CARE: { sub_category: ClassProductPersonalCare.SUB_CATEGORY.FEMININE_CARE, value: "intimate_care", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductPersonalCare.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductPersonalCare.CATEGORY.PERSONAL_CARE;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductPersonalCare({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductPersonalCare) {
                return ClassProductPersonalCare.toJSON(instance);
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
            return ClassProductPersonalCare.makeInstance(uid, data);
        },
    };
}
export class ClassProductBabyProducts extends ClassProduct {
    static STORAGE_FOLDER = "products/baby_products";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        BABY_CARE: { category: ClassProduct.CATEGORY.BABY_PRODUCTS, value: "baby_care", },
    });
    static TYPE = Object.freeze({
        DIAPERS: { sub_category: ClassProductBabyProducts.SUB_CATEGORY.BABY_CARE, value: "diapers", },
        BABY_WIPES: { sub_category: ClassProductBabyProducts.SUB_CATEGORY.BABY_CARE, value: "baby_wipes", },
        BABY_MILK_POWDER: { sub_category: ClassProductBabyProducts.SUB_CATEGORY.BABY_CARE, value: "baby_milk_powder", },
        BABY_HYGIENE: { sub_category: ClassProductBabyProducts.SUB_CATEGORY.BABY_CARE, value: "baby_hygiene", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductBabyProducts.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductBabyProducts.CATEGORY.BABY_PRODUCTS;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductBabyProducts({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductBabyProducts) {
                return ClassProductBabyProducts.toJSON(instance);
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
            return ClassProductBabyProducts.makeInstance(uid, data);
        },
    };
}
export class ClassProductPetProducts extends ClassProduct {
    static STORAGE_FOLDER = "products/pet_products";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        PET_SUPPLIES: { category: ClassProduct.CATEGORY.PET_PRODUCTS, value: "pet_supplies", },
    });
    static TYPE = Object.freeze({
        PET_FOOD: { sub_category: ClassProductPetProducts.SUB_CATEGORY.PET_SUPPLIES, value: "pet_food", },
        TREATS: { sub_category: ClassProductPetProducts.SUB_CATEGORY.PET_SUPPLIES, value: "treats", },
        PET_HYGIENE: { sub_category: ClassProductPetProducts.SUB_CATEGORY.PET_SUPPLIES, value: "pet_hygiene", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductPetProducts.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductPetProducts.CATEGORY.PET_PRODUCTS;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductPetProducts({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductPetProducts) {
                return ClassProductPetProducts.toJSON(instance);
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            const uid = snapshot.id;
            //data.gender=gender;
            //data.country = country;
            return ClassProductPetProducts.makeInstance(uid, data);
        },
    };
}
export class ClassProductOfficeAndStationery extends ClassProduct {
    static STORAGE_FOLDER = "products/office_and_stationery";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        STATIONERY: { category: ClassProduct.CATEGORY.OFFICE_AND_STATIONERY, value: "stationery", },
        COLLECTIBLES: { category: ClassProduct.CATEGORY.OFFICE_AND_STATIONERY, value: "collectibles", },
    });
    static TYPE = Object.freeze({
        PENS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.STATIONERY, value: "pens", },
        PENCILS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.STATIONERY, value: "pencils", },
        NOTEBOOKS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.STATIONERY, value: "notebooks", },
        MARKERS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.STATIONERY, value: "markers", },
        SCHOOL_SUPPLIES: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.STATIONERY, value: "school_supplies", },
        PANINI_CARDS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.COLLECTIBLES, value: "panini_cards", },
        TRADING_CARDS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.COLLECTIBLES, value: "trading_cards", },
        STICKER_ALBUMS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.COLLECTIBLES, value: "sticker_albums", },
        BOOSTER_PACKS: { sub_category: ClassProductOfficeAndStationery.SUB_CATEGORY.COLLECTIBLES, value: "booster_packs", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductOfficeAndStationery.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductOfficeAndStationery.CATEGORY.OFFICE_AND_STATIONERY;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductOfficeAndStationery({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductOfficeAndStationery) {
                return ClassProductOfficeAndStationery.toJSON(instance);
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
            return ClassProductOfficeAndStationery.makeInstance(uid, data);
        },
    };
}
export class ClassProductElectronicsAndAccessories extends ClassProduct {
    static STORAGE_FOLDER = "products/electronics_and_accessories";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        ELECTRONICS_ACCESSORIES: { category: ClassProduct.CATEGORY.ELECTRONICS_AND_ACCESSORIES, value: "electronics_accessories", },
    });
    static TYPE = Object.freeze({
        BATTERIES: { sub_category: ClassProductElectronicsAndAccessories.SUB_CATEGORY.ELECTRONICS_ACCESSORIES, value: "batteries", },
        CHARGERS: { sub_category: ClassProductElectronicsAndAccessories.SUB_CATEGORY.ELECTRONICS_ACCESSORIES, value: "chargers", },
        USB_CABLES: { sub_category: ClassProductElectronicsAndAccessories.SUB_CATEGORY.ELECTRONICS_ACCESSORIES, value: "usb_cables", },
        EARPHONES: { sub_category: ClassProductElectronicsAndAccessories.SUB_CATEGORY.ELECTRONICS_ACCESSORIES, value: "earphones", },
        ADAPTERS: { sub_category: ClassProductElectronicsAndAccessories.SUB_CATEGORY.ELECTRONICS_ACCESSORIES, value: "adapters", },
        POWER_BANKS: { sub_category: ClassProductElectronicsAndAccessories.SUB_CATEGORY.ELECTRONICS_ACCESSORIES, value: "power_banks", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductElectronicsAndAccessories.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductElectronicsAndAccessories.CATEGORY.ELECTRONICS_AND_ACCESSORIES;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductElectronicsAndAccessories({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductElectronicsAndAccessories) {
                return ClassProductElectronicsAndAccessories.toJSON(instance);
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
            return ClassProductElectronicsAndAccessories.makeInstance(uid, data);
        },
    };
}
export class ClassProductBeautyDevices extends ClassProduct {
    static STORAGE_FOLDER = "products/beauty_devices";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        BEAUTY_DEVICES: { category: ClassProduct.CATEGORY.BEAUTY_DEVICES, value: "beauty_devices", },
    });
    static TYPE = Object.freeze({
        HAIR_DRYERS: { sub_category: ClassProductBeautyDevices.SUB_CATEGORY.BEAUTY_DEVICES, value: "hair_dryers", },
        HAIR_CLIPPERS: { sub_category: ClassProductBeautyDevices.SUB_CATEGORY.BEAUTY_DEVICES, value: "hair_clippers", },
        STRAIGHTENERS: { sub_category: ClassProductBeautyDevices.SUB_CATEGORY.BEAUTY_DEVICES, value: "straighteners", },
        ELECTRIC_RAZORS: { sub_category: ClassProductBeautyDevices.SUB_CATEGORY.BEAUTY_DEVICES, value: "electric_razors", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductBeautyDevices.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductBeautyDevices.CATEGORY.BEAUTY_DEVICES;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductBeautyDevices({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductBeautyDevices) {
                return ClassProductBeautyDevices.toJSON(instance);
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
            return ClassProductBeautyDevices.makeInstance(uid, data);
        },
    };
}
export class ClassProductServices extends ClassProduct {
    static STORAGE_FOLDER = "products/services";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassProduct.FIELDS_TO_OMIT_FIREBASE,
        // 'translate',
        //'description',
        //'slogan',
    ];
    static SUB_CATEGORY = Object.freeze({
        SERVICE_TYPES: { category: ClassProduct.CATEGORY.SERVICES, value: "service_types", },
    });
    static TYPE = Object.freeze({
        MONEY_TRANSFER: { sub_category: ClassProductServices.SUB_CATEGORY.SERVICE_TYPES, value: "money_transfer", },
        PRINTING: { sub_category: ClassProductServices.SUB_CATEGORY.SERVICE_TYPES, value: "printing", },
        MOBILE_RECHARGE: { sub_category: ClassProductServices.SUB_CATEGORY.SERVICE_TYPES, value: "mobile_recharge", },
        BILL_PAYMENT: { sub_category: ClassProductServices.SUB_CATEGORY.SERVICE_TYPES, value: "bill_payment", },
        PARCEL_SERVICES: { sub_category: ClassProductServices.SUB_CATEGORY.SERVICE_TYPES, value: "parcel_services", },
    });
    constructor(data = {}) {
        const _storage_url = `${ClassProductServices.STORAGE_FOLDER}/${data.uid}/product.jpg`;
        super(data);
        this._storage_url = _storage_url;
        this._category = ClassProductServices.CATEGORY.SERVICES;
    }
    static makeInstance(uid, data = {}) {
        return new ClassProductServices({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassProductServices) {
                return ClassProductServices.toJSON(instance);
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
            return ClassProductServices.makeInstance(uid, data);
        },
    };
}
