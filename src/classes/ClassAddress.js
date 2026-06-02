import { ClassFirestore } from "./ClassFirestore";

export class ClassAddress {
    constructor(raw = {}) {
        const data = ClassAddress.normalizePayload(raw);
        this._uid_city = data.uid_city ?? "";
        this._street = data.street ?? "";
        this._street_1 = data.street_1 ?? "";
        this._short_street = data.short_street ?? "";
        this._city_code = data.city_code ?? "";
        this._city_name = data.city_name ?? "";
        this._zip_code = data.zip_code ?? "";
        this._district = data.district ?? "";
        this._province = data.province ?? "";
        this._country_code = data.country_code ?? "";
        this._public_transport_buses = ClassAddress.normalizePublicTransportBuses(
            data.public_transport_buses,
        );
        this._neighborhood = data.neighborhood ?? "";
        this._position = ClassAddress.normalizePosition(data.position);
    }

    static normalizePayload(data = {}) {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return {};
        }

        const out = {};
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith("_")) {
                out[key.slice(1)] = value;
                continue;
            }
            out[key] = value;
        }
        return out;
    }

    static normalizePosition(value) {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            return {};
        }

        if (typeof value.latitude === "number" && typeof value.longitude === "number") {
            return {
                latitude: value.latitude,
                longitude: value.longitude,
            };
        }

        if (typeof value.lat === "number" && typeof value.lng === "number") {
            return {
                latitude: value.lat,
                longitude: value.lng,
            };
        }

        return {};
    }

    static normalizePublicTransportBuses(value) {
        if (Array.isArray(value)) {
            return value
                .map((line) => String(line ?? "").trim())
                .filter(Boolean);
        }

        if (typeof value === "string") {
            return value
                .split(/[,;\s]+/)
                .map((line) => line.trim())
                .filter(Boolean);
        }

        return [];
    }

    get uid_city() {
        return this._uid_city;
    }

    get street() {
        return this._street;
    }

    get street_1() {
        return this._street_1;
    }

    get short_street() {
        return this._short_street;
    }

    get city_code() {
        return this._city_code;
    }

    get city_name() {
        return this._city_name;
    }

    get zip_code() {
        return this._zip_code;
    }

    get district() {
        return this._district;
    }

    get province() {
        return this._province;
    }

    get country_code() {
        return this._country_code;
    }
    get public_transport_buses() {
        return this._public_transport_buses;
    }

    get neighborhood() {
        return this._neighborhood;
    }

    get position() {
        return this._position;
    }

    set uid_city(value) {
        this._uid_city = value;
    }
    set street(value) {
        this._street = value;
    }
    set street_1(value) {
        this._street_1 = value;
    }
    set short_street(value) {
        this._short_street = value;
    }
    set city_code(value) {
        this._city_code = value;
    }
    set city_name(value) {
        this._city_name = value;
    }
    set zip_code(value) {
        this._zip_code = value;
    }
    set district(value) {
        this._district = value;
    }
    set province(value) {
        this._province = value;
    }
    set country_code(value) {
        this._country_code = value;
    }
    set public_transport_buses(value) {
        this._public_transport_buses = ClassAddress.normalizePublicTransportBuses(value);
    }
    set neighborhood(value) {
        this._neighborhood = value;
    }
    set position(value) {
        this._position = ClassAddress.normalizePosition(value);
    }
    get full_address() {
        return `${this._street ? this._street : ''}, ${this.street_1}, ${this.city_name} ${this.zip_code} ${this.district} ${this.province} ${this.country_code}`;
    }

    static toJSON(data = this) {
        const source = data instanceof ClassAddress ? data : new ClassAddress(data);
        const payload = {
            uid_city: source.uid_city,
            street: source.street,
            street_1: source.street_1,
            short_street: source.short_street,
            city_code: source.city_code,
            city_name: source.city_name,
            zip_code: source.zip_code,
            district: source.district,
            province: source.province,
            country_code: source.country_code,
            full_address: source.full_address,
            public_transport_buses: source.public_transport_buses,
            neighborhood: source.neighborhood,
        };

        const position = source.position;
        if (position && Object.keys(position).length > 0) {
            payload.position = position;
        }

        return ClassFirestore.omitUndefinedDeep(payload);
    }

    _createFullAddress(countryName="") {
        var full_address = "";
        if (this._street) {
            full_address += this._street;
        }
        if (this._street_1) {
            full_address += `, ${this._street_1}`;
        }
        if(this._district) {
            full_address += `, ${this._district}`;
        }
        if (this._zip_code) {
            full_address += `, ${this._zip_code}`;
        }
        if (this._province) {
            full_address += ` ${this._province}`;
        }
        if (this._city_name) {
            full_address += `, ${this._city_name}`;
        }
        if (countryName) {
            full_address += ` - ${countryName}`;
        }
        return full_address;
    }

    static toFirestore(data = this) {
        return ClassAddress.toJSON(data);
    }

    static fromFirestore(data = {}) {
        return new ClassAddress(data);
    }
}
