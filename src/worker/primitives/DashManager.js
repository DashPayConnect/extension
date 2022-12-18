const Dash = require('../../../../platform/packages/js-dash-sdk/dist/dash.min');
// Used to work with multiple Dash's instance.
class DashManager {
    constructor(storage) {
        this.instances = {};

        this.storage = storage;
    }
    async init(){
        console.log(`[DashManager] Initializing...`)
        const {currentAccount, currentWallet} = this.storage.object;
        if(this.storage.object.wallets && this.storage.object.wallets[currentWallet]){
            const { mnemonic } = this.storage.object.wallets[currentWallet];
            await this.createInstance({mnemonic, index: currentAccount});
        }
    }
    getInstance(walletId){
        return this.instances[walletId];
    }
    async switchAccountInstance(walletId, accountIndex){
        const instance = this.getInstance(walletId)

        // console.log(walletId, this.instances, this.instances[walletId])
        if(!instance){
            return false;
        }

        const storage = this.storage;
        return instance.client
            .getWalletAccount({index:accountIndex})
            .then((account) => instance.currentAccount = account)
            .then((res)=>{
                console.log(`[DashManager] Switched to ${walletId}:${accountIndex}.`)
                storage.set({currentWallet: walletId, currentAccount: accountIndex})
                return instance;
            });
    }

    // Will create a new instance from opts.
    async createInstance(walletOpts){
        const instance = {
            client: new Dash.Client({wallet: {offlineMode: false,...walletOpts}}),
            currentAccount: null,
        };
        const walletId = instance.client.wallet.walletId;
        if(this.instances[walletId]){
            return false;
        }
        this.instances[walletId] = instance;

        const wallets = {...this.storage.get()?.wallets};
        wallets[walletId] = walletOpts;
        await this.storage.set({wallets});

        const accountIndex = walletOpts.index || 0;
        return this.switchAccountInstance(walletId, accountIndex);
    }

    computeWalletIdFromMnemonic(mnemonic){
        return Dash.WalletLib.utils.mnemonicToWalletId(mnemonic)
    }
    generateMnemonic(){
        const {phrase: mnemonic} = Dash.Core.Mnemonic(128);
        return {
            mnemonic,
            //FIXME: we actually use the HDPrivateKey to compute walletId, so we would need to compute it first.
            // walletId: this.computeWalletIdFromMnemonic(mnemonic)
        }
    }
};
module.exports = DashManager;
