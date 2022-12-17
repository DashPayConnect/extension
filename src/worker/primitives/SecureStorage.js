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
const defaultState = {};
class SecureStorage {
    constructor() {
        this.object = {};
    }

    async init(){
        console.log(`[SecureStorage] Initializing...`)
        const state = await this.get() || {...defaultState};

        if(!state?.storage?.initializedDatetime > 0){
            state.storage = {
                initializedDatetime: new Date().toISOString()
            }
        }
        state.storage.lastInitialization = new Date().toISOString();
        this.object = state;
        console.log(`[SecureStorage] Initialized state to ${JSON.stringify(state)}`)
        await this.set(this.object);
    }


    async get(isSession = false){
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
    async set(object, isSession = false){
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
    async clear(isSession = false){
        const { local,session } = chrome.storage;
        const store = (isSession) ? session : local;
        let object = this.object;
        return new Promise(async (resolve, reject) => {
            store.clear();
            object = await store.set({...defaultState});
            console.log("Cleared...", await this.get(), this.object)
            resolve(true)
        });
    }
};
module.exports = SecureStorage;
