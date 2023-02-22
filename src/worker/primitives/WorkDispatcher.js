const {mnemonicToWalletId} = require('@dashevo/wallet-lib/src/utils/mnemonic');
const {ca} = require("timeago.js/lib/lang");


// Handle and dispatch received message accross the service worker.

class WorkDispatcher {
    constructor(dashManager, storage) {
        this.dashManager = dashManager;
        this.storage = storage
        console.log('[WorkDispatcher] Created');

    }

    async create(request) {
        console.log('[WorkDispatcher] Create request', request);

        const createType = request.args[0];
        const mnemonic = request.args[1];
        switch (createType) {
            case 'WALLET_FROM_MNEMONIC':
                const network = request.args[2] ?? 'testnet';
                const instance = await this.dashManager.createInstance({mnemonic, network});
                request.args.push(instance.currentAccount.getUnusedAddress());
                return;
            default:
                console.error(`Unexpected create work requested`, createType, JSON.stringify(request));
                break;
        }
        return request;
    }
    async connect(request){
        console.log('[WorkDispatcher] Connect request', request);
        const fetchReq = await this.fetch({args: ['ACCOUNT']});
        console.log({fetchReq});
        const [,account] = fetchReq.args;
        request.args.push(account);
        return request
    }
    async fetch(request) {
        console.log('[WorkDispatcher] Fetch request', request);
        const fetchType = request.args[0];
        console.log({fetchType});
        const entries = Object.entries(this.dashManager.instances);
        const account = this.dashManager.getInstance(entries[0][0]).currentAccount;
        console.log(account);
        switch (fetchType) {
            case 'ACCOUNT':
                if(entries.length){
                    const { accountPath, walletId, walletType, index: accountIndex } = account;
                    const accountObj = { accountIndex, accountPath, walletId, walletType, address: account.getAddress(0) };
                    request.args.push(accountObj);
                    request.args.push(await account.getConfirmedBalance());
                    request.args.push(await account.getTransactionHistory());
                }
                break;
            case 'ADDRESS':
                const { accountPath, walletId, walletType, index: accountIndex } = account;
                request.args.push(await account.getAddress());
                break
            case 'BALANCE':
                request.args.push(await account.getConfirmedBalance());
                break;
            case 'TRANSACTION_HISTORY':
                request.args.push(await account.getTransactionHistory());
                break;
            default:
                console.error(`Unexpected fetch work requested`, fetchType, JSON.stringify(request));
        }
        return request;

    }

    generate(request) {
        console.log('[WorkDispatcher] Generate request', request);
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

    async update(request) {
        console.log('[WorkDispatcher] Update request', request);
        const [updateType,walletId, accountIndex, network, offlineMode] = request.args;
        console.log(request.args);
        switch (updateType) {
            case "NETWORK":
                await this.dashManager.changeAccountInstanceNetwork(walletId, accountIndex, network, offlineMode);
                request.args.push(network);
                break;
            case "OFFLINE_MODE":
                await this.dashManager.changeAccountInstanceNetwork(walletId, accountIndex, network, offlineMode);
                request.args.push(offlineMode);
                break;
            default:
                console.error(`Unexpected update work requested`, JSON.stringify(request));
        }
        return request;
    }
    async execute(request) {
        console.log('[WorkDispatcher] Execute request', request);
        const executeType = request.args[0];
        switch (executeType) {
            case "TRANSACTION":
                const [,address, amount ]= request.args;
                console.log('TRANSACTION', address, amount);
                console.log(this.storage)
                // console.log(this.dashManager.instances)
                // app State will have info of currentWallet
                console.log(await this.storage.getAppState())
                const instance = await this.dashManager.getInstance(this.storage.object.currentWallet);
                try {
                    const tx = instance.currentAccount.createTransaction({recipient: address, amount});
                    console.log(tx);
                    const txid = instance.currentAccount.broadcastTransaction(tx);
                    console.log(txid);
                    request.args.push(txid);
                }catch (e) {
                    request.args.push(e.message);
                }
                break;
            case "SWITCH_ACCOUNT":
                const accountWalletId = request.args[1];
                const accountIndex = request.args[2];
                await this.dashManager.switchAccountInstance(accountWalletId, accountIndex);
                request.args.push(true);
                break;
            case "MNEMONIC_TO_WALLET_ID":
                const mnemonic = request.args[1];
                const walletId = await mnemonicToWalletId(mnemonic);
                request.args.push(walletId);
                break;
            default:
                console.error(`Unexpected execute work requested`, JSON.stringify(request));
        }
        console.log('[WorkDispatcher] Returning request', request);
        return request;
    }
};
module.exports = WorkDispatcher;
