const checkForLastError = require('../../utils/checkForLastError');
/**
 * This Storage provides ability to store locally.
 * Per security restriction, it won't provide any .sync func as it would lead to them leaving the computer.
 *
 * In some cases (https://bugs.chromium.org/p/chromium/issues/detail?id=1108126) some vulnerabilities would still permit access.
 * Henceforth, nothing in the store is 100% secure which is why we use password protected data.
 *
 * It uses Session storage for data that needs to be cleared off at the end of the session.
 */
class SecureStorage {
    constructor() {
        this.object = {};
    }
    get(isSession = false){
        const { local, session } = chrome.storage;
        const store = (isSession) ? session : local;

        return new Promise((resolve, reject) => {
            store.get(null, (result) => {
                const err = checkForLastError();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    set(object, isSession = false){
        const { local,session } = chrome.storage;
        const store = (isSession) ? session : local;
        this.object = object;
        return new Promise((resolve, reject) => {
            store.set(object, () => {
                const err = checkForLastError();
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
};
module.exports = SecureStorage;
