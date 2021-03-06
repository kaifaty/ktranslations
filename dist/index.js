export class Translate {
    constructor(data) {
        this.data = {};
        if (data) {
            this.setStorage(data);
        }
    }
    setStorage(data) {
        this.data = data;
    }
    appendStorage(data) {
        Object.keys(data).forEach(key => {
            if (this.data[key]) {
                this.data[key] = Object.assign(Object.assign({}, this.data[key]), data[key]);
            }
            else {
                this.data[key] = data[key];
            }
        });
    }
    _checkPath(path, point = this.data) {
        let res = point;
        for (const v of path) {
            if (res[v] === undefined)
                return null;
            if (typeof res[v] === 'string')
                return null;
            res = res[v];
        }
        return res;
    }
    get(key, lang, values, replaceToEmpty = false) {
        if (!key)
            return '';
        const path = key.split('.');
        let v = this._checkPath(path);
        if (!v && typeof this.data.common === "object") {
            v = this._checkPath(path, this.data.common)
                || this._checkPath(path.slice(1), this.data.common);
        }
        if (!v) {
            return key;
        }
        let res = (v === null || v === void 0 ? void 0 : v[lang]) || (v === null || v === void 0 ? void 0 : v.en) || key;
        if (typeof res !== 'string') {
            return key;
        }
        if (values) {
            res = res.replace(/\{([a-zA-Z0-9_.,=)( ]+)\}/g, (m, n) => {
                const v = getValue(n, values);
                if (v !== undefined) {
                    return v;
                }
                return replaceToEmpty ? '' : m;
            });
        }
        res = res.replace(/\[([a-zA-Z0-9_.,=)(]+)\]/g, (m, n) => {
            return this.get(n, lang, values);
        });
        return res;
    }
}
function getValue(key, values) {
    const path = key.split('.');
    let v = values;
    for (const subkey of path) {
        v = v[subkey];
        if (typeof v !== 'object')
            break;
    }
    if (v === undefined)
        return undefined;
    return v.toString();
}
