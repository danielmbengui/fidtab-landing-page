import { ClassFirestore } from "./ClassFirestore";

export const OPENING_HOURS_WEEKDAYS = Object.freeze([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]);

export class ClassOpeningHours {
    constructor({
        monday = new ClassOpeningHoursItem({}),
        tuesday = new ClassOpeningHoursItem({}),
        wednesday = new ClassOpeningHoursItem({}),
        thursday = new ClassOpeningHoursItem({}),
        friday = new ClassOpeningHoursItem({}),
        saturday = new ClassOpeningHoursItem({}),
        sunday = new ClassOpeningHoursItem({}),
    } = {}) {
        this._monday = monday instanceof ClassOpeningHoursItem ? monday : new ClassOpeningHoursItem(monday);
        this._tuesday = tuesday instanceof ClassOpeningHoursItem ? tuesday : new ClassOpeningHoursItem(tuesday);
        this._wednesday = wednesday instanceof ClassOpeningHoursItem ? wednesday : new ClassOpeningHoursItem(wednesday);
        this._thursday = thursday instanceof ClassOpeningHoursItem ? thursday : new ClassOpeningHoursItem(thursday);
        this._friday = friday instanceof ClassOpeningHoursItem ? friday : new ClassOpeningHoursItem(friday);
        this._saturday = saturday instanceof ClassOpeningHoursItem ? saturday : new ClassOpeningHoursItem(saturday);
        this._sunday = sunday instanceof ClassOpeningHoursItem ? sunday : new ClassOpeningHoursItem(sunday);
    }

    get monday() {
        return this._monday;
    }
    get tuesday() {
        return this._tuesday;
    }
    get wednesday() {
        return this._wednesday;
    }
    get thursday() {
        return this._thursday;
    }
    get friday() {
        return this._friday;
    }
    get saturday() {
        return this._saturday;
    }
    get sunday() {
        return this._sunday;
    }
    set monday(value) {
        this._monday = value instanceof ClassOpeningHoursItem ? value : new ClassOpeningHoursItem(value);
    }
    set tuesday(value) {
        this._tuesday = value instanceof ClassOpeningHoursItem ? value : new ClassOpeningHoursItem(value);
    }
    set wednesday(value) {
        this._wednesday = value instanceof ClassOpeningHoursItem ? value : new ClassOpeningHoursItem(value);
    }
    set thursday(value) {
        this._thursday = value instanceof ClassOpeningHoursItem ? value : new ClassOpeningHoursItem(value);
    }
    set friday(value) {
        this._friday = value instanceof ClassOpeningHoursItem ? value : new ClassOpeningHoursItem(value);
    }
    set saturday(value) {
        this._saturday = value instanceof ClassOpeningHoursItem ? value : new ClassOpeningHoursItem(value);
    }
    set sunday(value) {
        this._sunday = value instanceof ClassOpeningHoursItem ? value : new ClassOpeningHoursItem(value);
    }

    static getDayItem(source, day) {
        if (!source || typeof source !== "object") return null;
        if (source instanceof ClassOpeningHours) {
            return source[day] ?? source[`_${day}`] ?? null;
        }
        return source[day] ?? null;
    }

    static toJSON(data = this) {
        const source =
            data instanceof ClassOpeningHours
                ? data
                : ClassOpeningHours.fromFirestore(data ?? {});

        const out = {};
        for (const day of OPENING_HOURS_WEEKDAYS) {
            const item = ClassOpeningHours.getDayItem(source, day);
            out[day] = ClassOpeningHoursItem.toJSON(item ?? {});
        }
        return ClassFirestore.omitUndefinedDeep(out);
    }

    static toFirestore(data = this) {
        if (data instanceof ClassOpeningHours) {
            return ClassOpeningHours.toJSON(data);
        }
        return ClassOpeningHours.toJSON(ClassOpeningHours.fromFirestore(data ?? {}));
    }

    static fromFirestore(data = {}) {
        if (data instanceof ClassOpeningHours) return data;
        const entries = {};
        for (const day of OPENING_HOURS_WEEKDAYS) {
            entries[day] = ClassOpeningHoursItem.fromFirestore(data?.[day] ?? {});
        }
        return new ClassOpeningHours(entries);
    }
}

export class ClassOpeningHoursItem {
    constructor({
        is_open = false,
        open_time = null,
        close_time = null,
    } = {}) {
        this._is_open = Boolean(is_open);
        this._open_time = ClassOpeningHoursItem.normalizeTime(open_time);
        this._close_time = ClassOpeningHoursItem.normalizeTime(close_time);

        if (!this._is_open) {
            this._open_time = null;
            this._close_time = null;
        }
    }

    static normalizeTime(value) {
        if (value === null || value === undefined || value === "") return null;
        const normalized = String(value).trim().replace(",", ".");
        if (normalized === "") return null;
        const n = Number(normalized);
        if (!Number.isFinite(n)) return null;
        const snapped = Math.round(n * 2) / 2;
        if (snapped < 0 || snapped > 23.5) return null;
        return snapped;
    }

    static MAX_TIME = 23.5;
    static MIN_TIME = 0;

    get is_open() {
        return this._is_open;
    }
    get open_time() {
        return this._open_time;
    }
    get close_time() {
        return this._close_time;
    }
    set is_open(value) {
        this._is_open = Boolean(value);
        if (!this._is_open) {
            this._open_time = null;
            this._close_time = null;
        }
    }
    set open_time(value) {
        this._open_time = ClassOpeningHoursItem.normalizeTime(value);
    }
    set close_time(value) {
        this._close_time = ClassOpeningHoursItem.normalizeTime(value);
    }

    static toJSON(data = this) {
        const source =
            data instanceof ClassOpeningHoursItem
                ? data
                : ClassOpeningHoursItem.fromFirestore(data ?? {});

        return ClassFirestore.omitUndefinedDeep({
            is_open: source.is_open,
            open_time: source.is_open ? source.open_time : null,
            close_time: source.is_open ? source.close_time : null,
        });
    }

    static toFirestore(data = this) {
        return ClassOpeningHoursItem.toJSON(data);
    }

    static fromFirestore(data = {}) {
        return new ClassOpeningHoursItem(data);
    }
}
