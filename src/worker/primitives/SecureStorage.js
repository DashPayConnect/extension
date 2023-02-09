const checkForLastError = require('../../utils/checkForLastError');
const SubscribableStore = require('./SubscribableStore');
/**
 * This Storage provides ability to store locally for a worker.
 * Per security restriction, it won't provide any .sync func as it would lead to them leaving the computer.
 *
 * In some cases (https://bugs.chromium.org/p/chromium/issues/detail?id=1108126) some vulnerabilities would still permit access.
 * Henceforth, nothing in the store is 100% secure which is why we use password protected data.
 *
 * It uses Session storage for data that needs to be cleared off at the end of the session.
 *
 * It uses SubscribableStore for data that needs to be persisted (storage.local)
 */
const defaultState = {};

const chromeStorage = {
    getWorkerState: async function get(isSession = false){
        const { local, session } = chrome.storage;
        const store = (isSession) ? session : local;

        return new Promise((resolve, reject) => {
            store.get('worker', (result) => {
                console.log({currentWorkerStateFromChromeStorage: result})
                const err = checkForLastError();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    getAppState :async function get(isSession = false){
        const { local, session } = chrome.storage;
        const store = (isSession) ? session : local;

        return new Promise((resolve, reject) => {
            store.get('app', (result) => {
                const err = checkForLastError();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    setWorkerState: async function set(object, isSession = false){
        const { local,session } = chrome.storage;
        const store = (isSession) ? session : local;
        return new Promise((resolve, reject) => {
            const newWorkerState = {worker: object.worker ?? object};
            store.set(newWorkerState, () => {
                const err = checkForLastError();
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
    setAppState: async function set(object, isSession = false){
        const { local,session } = chrome.storage;
        const store = (isSession) ? session : local;
        return new Promise((resolve, reject) => {
            const newAppState = {app: object.app ?? object};
            store.set(newAppState, () => {
                const err = checkForLastError();
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
    clear: async function clear(isSession = false){
        const { local,session } = chrome.storage;
        const store = (isSession) ? session : local;
        return new Promise(async (resolve, reject) => {
            store.clear();
            console.log("Cleared...", await this.get(), this.object)
            resolve(true)
        });
    }
};

class SecureStorage {
    constructor() {
        this.store = new SubscribableStore();
    }

    async init(){
        // await chromeStorage.clear();

        // Subscribe to changes in the local state
        this.store.subscribe((state) => {
            console.log([`[SecureStorage] Local Worker state changed to ${JSON.stringify(state)}`]);
            chromeStorage.setWorkerState(state);
        }, true);

        console.log(`[SecureStorage] Initializing...`)
        const state = await chromeStorage.getWorkerState() || {...defaultState};
        this.store.setState(state);

        if(!this.store.get('initializedDatetime')){
            this.store.put('initializedDatetime', new Date().toISOString());
        }
        this.store.put('lastInitialization', new Date().toISOString());
        console.log(`[SecureStorage] Initialized state to ${JSON.stringify(state)}`)
    }
    getWorkerState(){
        return this.store.getState();
    }
    async getAppState(){
        return chromeStorage.getAppState();
    }
    async setAppState(state){
        console.log('[SecureStorage] Setting app state...', state);
        return chromeStorage.setAppState(state);
    }
    async setWorkerState(state){
        console.log('[SecureStorage] Setting worker state...', state);
        return chromeStorage.setWorkerState(state);
    }
    async clearAppState(){
        console.log('[SecureStorage] Clear app state...');
        await this.store.setState({...defaultState});
    }
};
module.exports = SecureStorage;
