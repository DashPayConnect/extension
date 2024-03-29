import {writable, derived, get} from 'svelte/store';


export const defaultAppStore = {
    version: '1.0.0',
    'currentPage': {
        'name': '',
        'data': {}
    },
    'themeStyle': 'light',
    logs: {
        firstRun: null,
    },
    contacts: {},
    currentAccount: 0,
    currentWallet: '',
    wallets: {},
    networks: [
        {name: 'testnet'},
        {name: 'livenet'},
        {name: 'devnet'},
    ],
    accounts: [],
    settings: {
        fiat: 'USD',
        i18n: 'en',
        network: 'testnet',
        offlineMode: true,
    }
}

const createAppStore = () => {
    let initialized = false;
    const AppStore = writable(defaultAppStore);

    const isExtension = (chrome.storage?.local) ? true : false;
    const getAppStoreState = () => {
        //Set the Store to the value of the chome.storage.local

        if (isExtension) {
            chrome.storage.local.get({"app": defaultAppStore}, function (currentStoredStore) {
                if (!currentStoredStore.app.logs.firstRun) {
                    currentStoredStore.app.logs.firstRun = +new Date();
                }

                initialized = true;
                // default USD fiat
                if (!currentStoredStore.app.settings.fiat) {
                    currentStoredStore.app.settings.fiat = "USD"
                }
                AppStore.set(currentStoredStore.app)
            });
        } else {
            let currentStoredStore = (JSON.parse(localStorage.getItem("app")) || defaultAppStore);
            if (!currentStoredStore.logs.firstRun) {
                currentStoredStore.logs.firstRun = +new Date();
                // default USD fiat
                if (!currentStoredStore.settings.fiat) {
                    currentStoredStore.settings.fiat = "USD"
                }

            }
            AppStore.set(currentStoredStore)
            initialized = true;
        }

    }

    //This is called everytime the AppStore is updated
    AppStore.subscribe(currentAppStore => {
        console.log('AppStore changed...', initialized, currentAppStore)
        //Only accept and Array Object to be saved to the storage and only
        //if store has already been initialized
        if (!initialized) {
            return currentAppStore
        }
        if (isExtension) {
            if (currentAppStore.currentPage) {
                console.log('AppStore saved to localStore');
                console.log({currentAppStore});
                // TODO: check if possible to use SecureStorage
                chrome.storage.local.set({"app": currentAppStore});
            } else {
                console.log('Recovering...');
                //Recover store value in memory to previous chome.storage.local value
                getAppStoreState();
            }
        } else {
            if (currentAppStore.currentPage) {
                console.log('AppStore saved to localStore');
                console.log({currentAppStore});
                localStorage.setItem("app", JSON.stringify(currentAppStore));
            } else {
                console.log('Recovering...');
                //Recover store value in memory to previous chome.storage.local value
                getAppStoreState();
            }
        }

    });

    getAppStoreState();

    let subscribe = AppStore.subscribe;
    let update = AppStore.update;
    let set = AppStore.set;

    return {
        subscribe,
        set,
        update,
        initialized: () => initialized,
        //Change the current page of the app
        //an also accept a data package the new page may need;
        changePage: (pageInfoObj) => {
            console.log('AppStore changePage...', pageInfoObj);
            // //Return if the object isn't a proper page object
            // if (!isPageInfoObj(pageInfoObj)) return;
            //
            if (!pageInfoObj.data) pageInfoObj.data = {};
            AppStore.update(appStore => {
                appStore.currentPage = pageInfoObj;
                return appStore;
            })
        },
        changeCurrentAccount: (accountIndex) => {
            console.log('AppStore changeCurrentAccount...', accountIndex);
            AppStore.update(appStore => {
                appStore.currentAccount = accountIndex;
                return appStore;
            })
        },
        changeCurrentWallet: (walletId) => {
            console.log('AppStore changeCurrentWallet...', walletId);
            AppStore.update(appStore => {
                appStore.currentWallet = walletId;
                return appStore;
            })
        },
        fullReset: () => {
            console.log('AppStore fullReset...');
            AppStore.update(appStore => {
                appStore = defaultAppStore;
                return appStore;
            })
        },
        importWallet: (walletInfoObj) => {
            console.log('AppStore importWallet...');
            AppStore.update(appStore => {
                console.log(walletInfoObj);
                appStore.wallets[walletInfoObj.walletId] = walletInfoObj;
                return appStore;
            })
        },
        importAccount: (accountInfoObj) => {
            console.log('AppStore importAccount...');
            AppStore.update(appStore => {
                if (!appStore.accounts.find((el) => {
                    console.log(el);
                    return el.walletId === accountInfoObj.walletId
                        && el.accountIndex === accountInfoObj.accountIndex;
                })) {
                    appStore.accounts.push(accountInfoObj);
                }
                return appStore;
            })
        },
        importContact: (contactInfoObj) => {
            console.log('AppStore importContact...');
            AppStore.update(appStore => {
                appStore.contacts[contactInfoObj.name] = contactInfoObj;
                return appStore;
            });
        },
        updateContact: (contactInfoObj) => {
                console.log('AppStore updateContact...');
                AppStore.update(appStore => {
                appStore.contacts[contactInfoObj.name] = contactInfoObj;
                return appStore;
                });
            },
        setLastBackupDate: () => {
            // SettingsStore.update(settingsStore => {
            //     settingsStore.lastBackupDate = new Date().toLocaleString()
            //     settingsStore.dismissWarning = false;
            //     return settingsStore;
            // })
        },
        setLastCoinAddedDate: () => {
            // SettingsStore.update(settingsStore => {
            //     settingsStore.lastCoinAddedDate = new Date().toLocaleString()
            //     settingsStore.dismissWarning = false;
            //     return settingsStore;
            // })
        },
        setLastCoinAddedType: (type) => {
            // SettingsStore.update(settingsStore => {
            //     settingsStore.lastCoinAddedType = type
            //     return settingsStore;
            // })
        },
        dismissWarning: () => {
            // SettingsStore.update(settingsStore => {
            //     settingsStore.dismissWarning = true;
            //     return settingsStore;
            // })
        },
        hideTokens: (value) => {
            // SettingsStore.update(settingsStore => {
            //     settingsStore.hideTokens = value;
            //     return settingsStore;
            // })
        },
        setIsVaultCreated: (value) => {
            // SettingsStore.update(settingsStore => {
            //     settingsStore.isVaultCreated = value;
            //     return settingsStore;
            // })
        },
        setFiatCurrency: (value) => {
            AppStore.update(appStore => {
                appStore.settings.fiat = value;
                return appStore;
            })
        },
        setI18nValue: (value) => {
            AppStore.update(appStore => {
                appStore.settings.i18n = value;
                return appStore;
            })
        },
        setNetwork: (value) => {
            AppStore.update(appStore => {
                appStore.settings.network = value;
                return appStore;
            })
        },
        setOfflineMode: (value) => {
            AppStore.update(appStore => {
                appStore.settings.offlineMode = value;
                return appStore;
            })
        }
    };
}

export const AppStore = createAppStore();

//Derived Store to return the current page object
export const currentPage = derived(
    AppStore,
    $currentPage => {
        return AppStore.currentPage
    }
);

//Derived Store to return the current page object
export const logs = derived(
    AppStore,
    $AppStore => {
        return $AppStore.logs
    }
);

export const currentAccount = derived(
    AppStore,
    $AppStore => {
        return $AppStore.currentAccount
    });

export const currentWallet = derived(
    AppStore,
    $AppStore => {
        return $AppStore.currentWallet
    });

export const WalletsStore = derived(
    AppStore,
    $AppStore => {
        return $AppStore.wallets
    }
);

export const NetworksStore = derived(
    AppStore,
    $AppStore => {
        return $AppStore.networks
    }
);
export const AccountStore = derived(
    AppStore,
    $AppStore => {
        return $AppStore.accounts
    }
);

export const ContactsStore = derived(
    AppStore,
    $AppStore => {
        return $AppStore.contacts
    });

export const SettingsStore = derived(
    AppStore,
    $AppStore => {
        return $AppStore.settings
    }
);
