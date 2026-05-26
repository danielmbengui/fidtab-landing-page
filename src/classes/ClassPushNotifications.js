import { doc, setDoc } from "firebase/firestore";
import { ClassFirestore } from "./ClassFirestore";
import { ClassUser } from "./ClassUser";

export class ClassPushNotifications extends ClassFirestore {
    static COLLECTION = "push_notifications";
    static NS_COLLECTION = "classes/push_notifications";
    static FIELDS_TO_OMIT_FIREBASE = [
        // 'translate',
        //'description',
        //'slogan',
    ];

    static SORT_BY = Object.freeze({
        NAME: 'name',
        NAME_NORMALIZED: 'name_normalized',
    });
}
export class ClassUserPushNotifications extends ClassFirestore {
    static COLLECTION = "user_push_notifications";
    static NS_COLLECTION = "classes/user_push_notifications";
    static FIELDS_TO_OMIT_FIREBASE = [
        // 'translate',
        //'description',
        //'slogan',
    ];
    static DOC_REF_FIELDS = Object.freeze({
        sender: ClassUser.COLLECTION,
    });
    static DOC_REF_ARRAY_FIELDS = Object.freeze({
        user_refs: ClassUser.COLLECTION,
    });
    static STATUS = Object.freeze({
        STARTED: "started",
        SCHEDULED: "scheduled",
        SUCCEEDED: "succeeded",
        FAILED: "failed",
        CANCELLED: "cancelled",
        UNKNOWN: "unknown",
    });
    constructor({
        uid = "",
        created_time = null,
        last_edit_time = null,
        initial_page_name = "",
        notification_sound = "default",
        notification_text = "",
        notification_title = "",
        notification_image_url = "",
        batch_index = 0,
        num_batches = 0,
        num_sent = 0,
        token_count = 0,
        parameter_data = {},
        sender = null,
        status = ClassUserPushNotifications.STATUS.UNKNOWN,
        timestamp = null,
        scheduled_time = null,
        user_refs = [],
        target_audience = "",
    }) {
        super(uid, created_time, last_edit_time);
        this._initial_page_name = initial_page_name;
        this._notification_sound = notification_sound;
        this._notification_text = notification_text;
        this._notification_title = notification_title;
        this._notification_image_url = notification_image_url;
        this._num_batches = num_batches;
        this._batch_index = batch_index;
        this._num_sent = num_sent;
        this._token_count = token_count;
        this._parameter_data = parameter_data;
        this._sender = sender;
        this._status = status;
        this._timestamp = timestamp;
        this._scheduled_time = scheduled_time;
        this._user_refs = user_refs;
        this._target_audience = target_audience;
    }
    get initial_page_name() {
        return this._initial_page_name;
    }
    set initial_page_name(value) {
        this._initial_page_name = value;
    }
    get notification_sound() {
        return this._notification_sound;
    }
    set notification_sound(value) {
        this._notification_sound = value;
    }
    get notification_text() {
        return this._notification_text;
    }
    set notification_text(value) {
        this._notification_text = value;
    }
    get notification_title() {
        return this._notification_title;
    }
    set notification_title(value) {
        this._notification_title = value;
    }
    get notification_image_url() {
        return this._notification_image_url;
    }
    set notification_image_url(value) {
        this._notification_image_url = value;
    }
    get num_sent() {
        return this._num_sent;
    }
    set num_sent(value) {
        this._num_sent = value;
    }
    get token_count() {
        return this._token_count;
    }
    set token_count(value) {
        this._token_count = value;
    }
    get parameter_data() {
        return this._parameter_data;
    }
    set parameter_data(value) {
        this._parameter_data = value;
    }
    get sender() {
        return this._sender;
    }
    set sender(value) {
        this._sender = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    get timestamp() {
        return this._timestamp;
    }
    set timestamp(value) {
        this._timestamp = value;
    }
    get scheduled_time() {
        return this._scheduled_time;
    }
    set scheduled_time(value) {
        this._scheduled_time = value;
    }
    get user_refs() {
        return this._user_refs;
    }
    set user_refs(value) {
        this._user_refs = value;
    }
    get target_audience() {
        return this._target_audience;
    }
    set target_audience(value) {
        this._target_audience = value;
    }
    get num_batches() {
        return this._num_batches;
    }
    set num_batches(value) {
        this._num_batches = value;
    }
    get batch_index() {
        return this._batch_index;
    }
    set batch_index(value) {
        this._batch_index = value;
    }
    static makeInstance(uid, data = {}) {
        return new ClassUserPushNotifications({ uid, ...data });
    }
    // ── Converter Firestore ──────────────────────────────────
    static converter = {
        toFirestore(instance) {
            const payload = ClassUserPushNotifications.omitUndefinedDeep(ClassUserPushNotifications.toJSON(instance));
            //payload.created_at = payload.created_time || null;
            //payload.device_type = capitalizeFirstLetter(payload.device_type || "");
            //payload.created_time = null;
            //delete payload.created_time;
            //payload.scores = instance.convertScoresToFirestore(payload.scores || {});
            if (payload) {
              for (const [field, collectionPath] of Object.entries(ClassUserPushNotifications.DOC_REF_FIELDS)) {
                payload[field] = ClassUserPushNotifications.idToDocRef(payload[field], collectionPath);
              }
            }
            if (payload) {
              for (const [field, collectionPath] of Object.entries(ClassUserPushNotifications.DOC_REF_ARRAY_FIELDS)) {
                if (Array.isArray(payload[field])) {
                  payload[field] = ClassUserPushNotifications.idsToDocRefs(payload[field], collectionPath);
                }
              }
            }
            if (payload && Array.isArray(payload.user_refs)) {
              payload.user_refs = payload.user_refs
                .map((ref) => (typeof ref === "string" ? ref : ref?.path))
                .filter(Boolean)
                .join(",");
            }
            return payload;
        },
        fromFirestore(snapshot, options) {
            const raw = snapshot.data(options) ?? {};
            const data = ClassUserPushNotifications.normalizeDocRefArrayFieldsFromFirestore(raw);
            if (typeof data.user_refs === "string" && data.user_refs) {
                data.user_refs = data.user_refs.split(",").filter(Boolean);
            } else if (!Array.isArray(data.user_refs)) {
                data.user_refs = [];
            }
            if (data.sender != null) {
                data.sender = ClassUserPushNotifications.docRefToId(data.sender);
            }
            return ClassUserPushNotifications.makeInstance(snapshot.id, data);
        },
    };
    // ── Create ───────────────────────────────────────────────
    async createFirestore() {
        if (!this._uid) {
            const newRef = doc(this.constructor.colRef());
            this._uid = newRef.id;
        }
        const ref = this.constructor.docRef(this._uid);
        await setDoc(ref, this, { merge: true });
        return this.constructor.makeInstance(this._uid, this.constructor.toJSON(this));
    }
}