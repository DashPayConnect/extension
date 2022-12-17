const Dash = require('../../../../platform/packages/js-dash-sdk/dist/dash.min');
// Used to work with multiple Dash's instance.
class DashManager {
    constructor() {
        this.instances = {};
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

        return instance.client
            .getWalletAccount({index:accountIndex})
            .then((account) => instance.currentAccount = account)
            .then((res)=>{
                console.log(res)
                console.log('Done');
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

        const accountIndex = 0;
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
