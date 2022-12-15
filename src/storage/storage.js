const Storage = {}

function getStorageData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }

            return resolve(result);
        });
    });
}

function setStorageData(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }

            return resolve();
        });
    });
}

function getStorageItem(
    key,
) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }

            return resolve([key]);
        });
    });
}

function setStorageItem(
    key,
    value,
) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }

            return resolve();
        });
    });
}

async function initializeStorageWithDefaults(defaults) {
    const currentStorageData = await getStorageData();
    const newStorageData = Object.assign({}, defaults, currentStorageData);
    await setStorageData(newStorageData);
}

module.exports = {
    Storage,
    getStorageData,
    setStorageData,
    getStorageItem,
    setStorageItem,
    initializeStorageWithDefaults
}
