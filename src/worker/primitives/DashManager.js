const Dash = require('../../../../platform/packages/js-dash-sdk/dist/dash.min');
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

    // Will create a new instance from opts.
    async createInstance(walletOpts){
        console.log('[DashManager] Create instance...');
        const instance = {
            client: new Dash.Client({wallet: {offlineMode: false,...walletOpts}}),
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
