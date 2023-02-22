const Dash = require('../../../../platform/packages/js-dash-sdk/dist/dash.min');
const {th} = require("timeago.js/lib/lang");
// Used to work with multiple Dash's instance.
class DashManager {
    constructor(storage) {
        this.instances = {};

        this.storage = storage;
    }
    async init(){
        console.log(`[DashManager] Initializing...`)
        const {app:{currentAccount, currentWallet, wallets}} = await this.storage.getAppState();
        console.log(await this.storage.getAppState());
        console.log('currentAccount', currentAccount);
        console.log('currentWallet', currentWallet);
        console.log('wallets', wallets);

        if(wallets && wallets[currentWallet]){
            const wallet = wallets[currentWallet];
            if(wallet.type !== 'mnemonic'){
                console.log(`[DashManager] Wallet type ${wallet.type} not supported. Won't create instance`);
                return;
            }
            const mnemonic = wallet.value;
            await this.createInstance({mnemonic, index: currentAccount});
        } else {
            console.log(`[DashManager] No wallet found. Won't create instance`);
            console.log(this.storage)
            console.log(await this.storage.getAppState())
        }
    }
    getInstance(walletId){
        console.log('[DashManager] Get instance...');
        return this.instances[walletId];
    }
    async switchAccountInstance(walletId, accountIndex){
        console.log('[DashManager] Switching instance...');

        const instance = this.getInstance(walletId)
        // console.log(walletId, this.instances, this.instances[walletId])
        if(!instance){
            return false;
        }

        const storage = this.storage;
        return instance.client
            .getWalletAccount({index:accountIndex})
            .then((account) => instance.currentAccount = account)
            .then(async (res)=>{
                console.log(`[DashManager] Switched to ${walletId}:${accountIndex}.`)
                const appState = await storage.getAppState();
                console.log({appState});
                appState.currentAccount = accountIndex;
                appState.currentWallet = walletId;
                await storage.setAppState(appState);
                return instance;
            });
    }
    async changeAccountInstanceNetwork(walletId, accountIndex, network, offlineMode = true){
        console.log('[DashManager] Set network...');
        console.log(walletId, accountIndex, network);
        console.log(this.instances);
        let instance = this.getInstance(walletId)
        if(!instance){
            console.log(`Current request instance ${walletId} not found. Default on first existing....`)
            instance = Object.entries(this.instances)[0][1];
            walletId = instance.walletId;
        }

        console.log({instance})
        const walletOpts = {
            mnemonic: instance.client.wallet.mnemonic,
            index: instance.currentAccount.index,
            network: network ?? instance.client.network,
            offlineMode: offlineMode ?? instance.client.wallet.offlineMode,
        }
        const clientOpts = {
            network: walletOpts.network,
        }
        await this.createInstance(walletOpts, clientOpts);
    }

    // Will create a new instance from opts.
    async createInstance(walletOpts, clientOpts){
        console.log('[DashManager] Create instance...');
        console.log({walletOpts, clientOpts});
        const instance = {
            client: new Dash.Client({wallet: {offlineMode: true,...walletOpts},...clientOpts}),
            currentAccount: null,
        };
        const walletId = instance.client.wallet.walletId;
        if(this.instances[walletId]){
            return false;
        }
        this.instances[walletId] = instance;

        const wallets = {...this.storage.store.getState().wallets};
        wallets[walletId] = walletOpts;
        await this.storage.store.put('wallets',wallets);

        const accountIndex = walletOpts.index || 0;
        return this.switchAccountInstance(walletId, accountIndex);
    }

    computeWalletIdFromMnemonic(mnemonic){
        return Dash.WalletLib.utils.mnemonicToWalletId(mnemonic)
    }
    generateMnemonic(){
        console.log('[DashManager] Generating mnemonic...');
        const {phrase: mnemonic} = Dash.Core.Mnemonic(128);
        return {
            mnemonic,
            //FIXME: we actually use the HDPrivateKey to compute walletId, so we would need to compute it first.
            // walletId: this.computeWalletIdFromMnemonic(mnemonic)
        }
    }
};
module.exports = DashManager;
