import { firestore } from "@/lib/firebaseConfig";
import { normalizeReviewRating } from "@/lib/reviewRating";
import { ClassFirestore } from "./ClassFirestore";
import { collection, doc } from "firebase/firestore";

export class ClassReview extends ClassFirestore {
    static COLLECTION = "REVIEWS";
    static NS_COLLECTION = "classes/reviews";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
    ];
    static MIN_RATING = 0;
    static MAX_RATING = 5;
    static TYPE = Object.freeze({
        PRODUCT: "product",
        UNKNOWN: "unknown",
    });
    static normalizeRating(value) {
        return normalizeReviewRating(value, {
            min: ClassReview.MIN_RATING,
            max: ClassReview.MAX_RATING,
        });
    }
    constructor({
        uid = "",
        uid_company = "",
        uid_user = "",
        rating = ClassReview.MIN_RATING,
        comment = "",
        type = ClassReview.TYPE.UNKNOWN,
        created_time = new Date(),
        last_edit_time = new Date(),
    }) {
        super(uid, created_time, last_edit_time, "");
        this._uid_company = uid_company;
        this._uid_user = uid_user;
        this._rating = ClassReview.normalizeRating(rating);
        this._comment = comment;
        this._type = type;
    }
    get uid_company() {
        return this._uid_company;
    }
    set uid_company(value) {
        this._uid_company = value;
    }
    get uid_user() {
        return this._uid_user;
    }
    set uid_user(value) {
        this._uid_user = value;
    }
    get rating() {
        return this._rating;
    }
    set rating(value) {
        this._rating = ClassReview.normalizeRating(value);
    }
    get comment() {
        return this._comment;
    }
    set comment(value) {
        this._comment = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    static makeInstance(uid, data = {}) {
        if (data.type === ClassReview.TYPE.PRODUCT) {
            return new ClassReviewProduct({ uid, ...data });
        }
        return new ClassReview({ uid, ...data });
    }
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassReview) {
                return ClassReview.toJSON(instance);
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
            return ClassReview.makeInstance(uid, data);
        },
    };
    static colRef() {
        return collection(firestore, this.COLLECTION).withConverter(this.converter);
    }

    static docRef(id) {
        return doc(firestore, this.COLLECTION, id).withConverter(this.converter);
    }
}
export class ClassReviewProduct extends ClassReview {
    static COLLECTION = "REVIEWS";
    static NS_COLLECTION = "classes/reviews";
    static FIELDS_TO_OMIT_FIREBASE = [
        ...ClassFirestore.FIELDS_TO_OMIT_FIREBASE,
    ];
    static MIN_RATING = 0;
    static MAX_RATING = 5;
    constructor({
        uid = "",
        uid_user = "",
        uid_product = "",
        rating = ClassReview.MIN_RATING,
        comment = "",
        type = ClassReview.TYPE.PRODUCT,
        created_time = new Date(),
        last_edit_time = new Date(),
    } = {}) {
        super({
            uid,
            uid_user,
            rating,
            comment,
            type,
            created_time,
            last_edit_time,
        });
        this._uid_product = uid_product;
    }
    get uid_product() {
        return this._uid_product;
    }
    set uid_product(value) {
        this._uid_product = value;
    }
    static makeInstance(uid, data = {}) {
        return new ClassReviewProduct({ uid, ...data });
    }
    static converter = {
        toFirestore(instance) {
            if (instance instanceof ClassReviewProduct) {
                return ClassReview.toJSON(instance);
            }
            return instance;
        },
        fromFirestore(snapshot, options) {
            return ClassReview.makeInstance(snapshot.id, snapshot.data(options));
        },
    };
}