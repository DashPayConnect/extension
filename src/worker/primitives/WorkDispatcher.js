// Handle and dispatch received message accross the service worker.
class WorkDispatcher {
    constructor(dashManager, storage) {
        this.dashManager = dashManager;
        this.storage = storage
    }

    async create(request) {
        const createType = request.args[0];
        const mnemonic = request.args[1];
        switch (createType) {
            case 'WALLET_FROM_MNEMONIC':
                const instance = await this.dashManager.createInstance({mnemonic});
                request.args.push(instance.currentAccount.getUnusedAddress());
                return;
            default:
                console.error(`Unexpected create work requested`, createType, JSON.stringify(request));
                break;
        }
        return request;
    }
    connect(request){
        const account = this.fetch({args: ['ACCOUNT']}).args[1];
        request.args.push(account);
        return request
    }
    fetch(request) {
        const fetchType = request.args[0];
        console.log({fetchType});
        switch (fetchType) {
            case 'ACCOUNT':
                const entries = Object.entries(this.dashManager.instances);
                console.log(entries);
                if(entries.length){
                    const account = this.dashManager.getInstance(entries[0][0]).currentAccount;
                    console.log(account);
                    const { accountPath, walletId, walletType } = account;
                    const accountObj = { accountPath, walletId, walletType, address: account.getAddress(0) };
                    request.args.push(accountObj);
                }
                break;
            case 'ADDRESS':
                break;
            case "BALANCE":
                break;
            default:
                console.error(`Unexpected fetch work requested`, fetchType, JSON.stringify(request));
        }
        return request;

    }

    generate(request) {
        const generateType = request.args[0];
        switch (generateType) {
            case "MNEMONIC":
                console.log('Work.Generate')
                request.args.push(this.dashManager.generateMnemonic().mnemonic);
                console.log('Work.Generated')
                break;
            default:
                console.error(`Unexpected generate work requested`, JSON.stringify(request));
        }
        return request;
    }

    async execute(request) {
        const executeType = request.args[0];
        switch (executeType) {
            case "SWITCH_ACCOUNT":
                const walletId = request.args[1];
                const accountIndex = request.args[2];
                await this.dashManager.switchAccountInstance(walletId, accountIndex);
                request.args.push(true);
            default:
                console.error(`Unexpected execute work requested`, JSON.stringify(request));
        }
        return request;
    }
};
module.exports = WorkDispatcher;
