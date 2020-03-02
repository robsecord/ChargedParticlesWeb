// Frameworks
import { reactLocalStorage } from 'reactjs-localstorage';
import * as _ from 'lodash';

// Internals
import { GLOBALS } from './globals';


class LocalCache {
    constructor() {
        this.abbr = GLOBALS.CODENAME_ABBR;
        this.version = GLOBALS.CODE_VERSION;
        this.expires = 'todo';
    }

    static instance() {
        if (!LocalCache.__instance) {
            LocalCache.__instance = new LocalCache();
        }
        return LocalCache.__instance;
    }

    static get(key, defaultValue = '') {
        const instance = LocalCache.instance();
        return instance._getByKey(key, defaultValue);
    }

    static set(key, value) {
        const instance = LocalCache.instance();
        instance._setByKey(key, value);
    }

    _isValidCache(key, cacheData) {
        const isValid = (cacheData.version === this.version);
        if (!isValid) { this._removeByKey(key); }
        return isValid;
    }

    _getByKey(key, defaultValue) {
        const cacheStr = reactLocalStorage.get(`${this.abbr}_${key}`);
        if (_.isEmpty(cacheStr)) { return defaultValue; }

        const cacheData = JSON.parse(cacheStr);
        return this._isValidCache(key, cacheData) ? cacheData.value : defaultValue;
    }

    _setByKey(key, value) {
        const cacheData = {value, version: this.version};
        const cacheStr = JSON.stringify(cacheData);
        reactLocalStorage.set(`${this.abbr}_${key}`, cacheStr);
    }

    _removeByKey(key) {
        reactLocalStorage.remove(`${this.abbr}_${key}`);
    }
}
LocalCache.__instance = null;

export { LocalCache };
