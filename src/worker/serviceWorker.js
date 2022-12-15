/*



The service worker
The extension service worker handles and listens for browser events.
There are many types of events, such as navigating to a new page, removing a bookmark, or closing a tab.
It can use all the Chrome APIs, but it cannot interact directly with the content of web pages; that’s the job of content scripts.


 */
// import Dash from 'dash';
// import Dash from '../../static/dash.min';
import Dash from '../../../platform/packages/js-dash-sdk/dist/dash.min';
// import Dashx from '@dashevo/wallet-lib';
// import {Wallet, EVENTS, CONSTANTS} from '@dashevo/wallet-lib';

//(function() { return this || window || global || self; }).call(null);


// console.log(CONSTANTS);
// import Dash from 'dash';
const StdMessage = require('../primitives/StdMessage');
// const Dash = require('dash');

// const DAPIClient = require('@dashevo/dapi-client');
// const client = new DAPIClient();

// client.core.getStatus().then((coreStatus) => {
//     console.dir(coreStatus);
// });

async function getFromStore(){
    return new Promise((res)=>{
        chrome.storage.sync.get(function(data){ console.log({data}); res(data); });
    })
}

const network = "testnet";
const opts = {
    network,
    wallet: {
        mnemonic: null,
        offlineMode: true,
    },
}
globalThis.Dash = Dash;
globalThis.isInitialized = false;
globalThis.DashPayConnect = {
    instance: null,
    account: null,
    getAccount(){
        if(!globalThis.DashPayConnect.account) return null;
        const { accountPath, walletId, walletType } = globalThis.DashPayConnect.account;
        return { accountPath, walletId, walletType, ...globalThis.DashPayConnect.getAddress() };
    },
    getAddress(){
        return globalThis.DashPayConnect.account.getUnusedAddress();
    },
    getBalance(){
        return globalThis.DashPayConnect.account.getTotalBalance();
    }
};;


// function init(){
//     getFromStore().then((store)=>{
//         if(!store.installationDate){
//             store.installationDate = +new Date();
//         }
//         if(!store.initDate){
//             store.initDate = +new Date();
//         }
//         if(store.mnemonic !== null){
//             (async ()=>{
//                 opts.wallet.mnemonic = store.mnemonic;
//                 console.log({opts}, store);
//                 if(opts.wallet.mnemonic === undefined){
//                     // opts.wallet.mnemonic = null;
//                     opts.wallet.mnemonic = 'script double orphan gospel grain cost gift cigar faith elephant custom quit';
//                 }
//                 const clientInstance = new globalThis.Dash.Client(opts);
//                 DashPayConnect.instance = clientInstance;
//                 const account = await clientInstance.wallet.getAccount();
//                 console.log({clientInstance})
//                 DashPayConnect.account = account;
//                 globalThis.isInitialized = true;
//             })();
//         } else {
//             console.log('Miss mnemonic');
//         }
//
//         chrome.storage.sync.set(store);
//     })
// }

// init();

const handler =  async (message, sender, sendResponse) => {
    new Promise((res)=>{
        const stdMessage = StdMessage.fromMessage(message, sender)
        console.log(stdMessage, sender)
        switch (stdMessage.action) {
            case StdMessage.ACTIONS.CREATE:
                const createType = stdMessage.args[0];
                switch (createType){
                    case "WALLET_FROM_MNEMONIC":
                        opts.wallet.mnemonic = stdMessage.args[1];
                        chrome.storage.sync.set(opts);
                        const clientInstance = new globalThis.Dash.Client(opts);
                        globalThis.DashPayConnect.instance = clientInstance;
                        console.log({clientInstanceCreate: clientInstance})
                        clientInstance.wallet.getAccount().then((account)=>{
                            globalThis.DashPayConnect.account = account;
                            console.log('Check 4');
                            globalThis.isInitialized = true;
                            console.log(account);
                            stdMessage.args.push(account.getUnusedAddress());
                            if(stdMessage.getTabId()) {
                                chrome.tabs.sendMessage(stdMessage.getTabId(), stdMessage, undefined, sendResponse)
                            }
                            console.log('send -====>', stdMessage);
                            sendResponse(stdMessage)
                            res(stdMessage);
                        })
                        console.log('CHeck 1');
                        break;
                    default:
                        break;
                }
                console.log('CHeck 2');
                break;
            case StdMessage.ACTIONS.FETCH:
                const type = stdMessage.args[0];
                switch (type){
                    case "ACCOUNT":
                        if(globalThis.DashPayConnect && globalThis.DashPayConnect.account){
                            const { accountPath, walletId, walletType } = globalThis.DashPayConnect.account;
                            const accountObj = { accountPath, walletId, walletType, address:globalThis.DashPayConnect.account.getUnusedAddress() };
                            stdMessage.args.push(accountObj);
                            if(stdMessage.getTabId()) {
                                chrome.tabs.sendMessage(stdMessage.getTabId(), stdMessage, undefined, sendResponse)
                            }
                            console.log('send -====>', stdMessage);
                            sendResponse(stdMessage)
                        }

                        // When it's from register.html, to answer we need this;
                        // chrome.tabs.sendMessage(stdMessage.getTabId(), stdMessage, undefined, sendResponse)
                        // return sendResponse(DashPayConnect.getAccount());
                        break;
                    case "ADDRESS":
                        return sendResponse(DashPayConnect.getAddress());
                        break;
                    case "BALANCE":
                        return sendResponse(DashPayConnect.getBalance());
                        break;
                    default:
                        console.log('UNKNOWN', stdMessage);
                }
                break;
            case StdMessage.ACTIONS.DISCONNECT:
                console.log('External request to disconnect');
                // We pass along the message as we are already listening for potential connection.
                // Content script might need to perform some connection from their end.
                chrome.tabs.sendMessage(stdMessage.getTabId(), stdMessage, undefined, sendResponse)
                break;
            case StdMessage.ACTIONS.CONNECT:
                console.log('External request to connect');
                // We pass along the message as we are already listening for potential connection.
                // Content script might need to perform some connection from their end.
                console.log(globalThis, globalThis.DashPayConnect);

                if(globalThis.DashPayConnect.account){
                    console.log(globalThis.DashPayConnect)
                    console.log(globalThis.DashPayConnect.getAccount)
                    console.log(globalThis.DashPayConnect.account);

                    const { accountPath, walletId, walletType } = globalThis.DashPayConnect.account;
                    const accountObj = { accountPath, walletId, walletType, address:globalThis.DashPayConnect.account.getUnusedAddress() };
                    stdMessage.args.push(accountObj);
                } else {
                    getFromStore().then((resultOptions)=>{
                        console.log({resultOptions})
                        const clientInstance = new globalThis.Dash.Client(resultOptions);
                        globalThis.DashPayConnect.instance = clientInstance;
                        console.log({clientInstanceConnect: clientInstance})
                        clientInstance.wallet.getAccount().then((account)=>{
                            globalThis.DashPayConnect.account = account;
                            globalThis.isInitialized = true;
                            console.log('accunt set');
                        });
                    })
                    // const opts = localStorage.getItem('opts');
                    // console.log(opts);
                }
                console.log(stdMessage.getTabId());
                if(stdMessage.getTabId()){
                    chrome.tabs.sendMessage(stdMessage.getTabId(), stdMessage, undefined, sendResponse)
                }
                sendResponse(stdMessage)
                break;
            case StdMessage.ACTIONS.EXECUTE:
                if(stdMessage.args[0] === 'MNEMONIC_TO_WALLET_ID'){
                    stdMessage.args.push(Dash.WalletLib.utils.mnemonicToWalletId(stdMessage.args[1]));
                }
                console.log(stdMessage);
                if(stdMessage.getTabId()) {
                    console.log('res to tab');
                    chrome.tabs.sendMessage(stdMessage.getTabId(), stdMessage, undefined, sendResponse)
                }
                console.log('res total');
                sendResponse(stdMessage)
                break;
            case StdMessage.ACTIONS.GENERATE:
                if(stdMessage.args[0] === 'MNEMONIC'){
                    const mnemonic = Dash.Core.Mnemonic().phrase
                    stdMessage.args.push(mnemonic);
                    stdMessage.args.push(Dash.WalletLib.utils.mnemonicToWalletId(mnemonic));
                }
                if(stdMessage.getTabId()) {
                    chrome.tabs.sendMessage(stdMessage.getTabId(), stdMessage, undefined, sendResponse)
                }
                sendResponse(stdMessage)
                break;
            case StdMessage.ACTIONS.UNDEFINED_ACTION:
            default:
                console.log(`UNSUPPORTED action ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`)
                break;

            // case 'connect': {
            //     console.log('Request to connect');
            //     // We pass along the message as we are already listening for potential connection.
            //     // Content script might need to perform some connection from their end.
            //     chrome.tabs.sendMessage(tabId, { message, tabId }, undefined, sendResponse)
            //     break;
            // }
            // case 'sendMessage': {
            //     const [message] = args
            //     chrome.tabs.sendMessage(tabId, { message, tabId }, undefined, sendResponse)
            //     break
            // }
            // case 'ping': {
            //     // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            //     //     console.log({tabs});
            //         // chrome.tabs.sendMessage(tabs[0].id, {message: 'pong'}, function(response) {
            //         //     console.log({response});
            //         // });
            //     // });
            //
            //     chrome.tabs.sendMessage(tabId, { message: 'pong', tabId }, undefined, sendResponse)
            //     break
            // }
            // case 'executeScript': {
            //     const [code] = args
            //     chrome.tabs.executeScript(tabId, { code }, ([result]) => sendResponse(result))
            //     break
            // }


            // case "open": {
            //         chrome.windows.create({
            //             url: '/dialog.html',
            //             type: 'popup', width: 400, height: 400,
            //         });
            // }
        }
        console.log('CHeck 3');
    }).then((res)=>{
        console.log("Promise end");
        return res;
    })
    return true;
}
// From outside (like active tab)
chrome.runtime.onMessageExternal.addListener(handler )
chrome.runtime.onMessage.addListener(handler )


// From internal extension
// chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
//     console.log(message);
//     const stdMessage = StdMessage.fromMessage(message, sender)
//     console.log(stdMessage)
//     switch (stdMessage.action) {
//         case StdMessage.ACTIONS.FETCH:
//             const type = stdMessage.args[0];
//             switch (type){
//                 case "ACCOUNT":
//                     return sendResponse(DashPayConnect.getAccount());
//                     break;
//                 case "ADDRESS":
//                     return sendResponse(DashPayConnect.getAddress());
//                     break;
//                 case "BALANCE":
//                     return sendResponse(DashPayConnect.getBalance());
//                     break;
//                 default:
//                     console.log('UNKNOWN', stdMessage);
//             }
//             break;
//     }
// })

chrome.runtime.onConnect.addListener(function(port) {
    console.log('on connect');
    port.onMessage.addListener(function(msg) {
        console.log('port message');
        const stdMessage = StdMessage.fromMessage(msg);
        switch (stdMessage.action) {
            // case StdMessage.ACTIONS.FETCH:
                // if(stdMessage.args[0] === 'ADDRESS'){
                //     port.postMessage(new StdMessage(StdMessage.ACTIONS.FETCH, [...stdMessage.args, +new Date()]));
                //
                //     return this.DashPayConnect.getAddress();
                // }
                // break;
            case StdMessage.ACTIONS.PING:
                port.postMessage(new StdMessage(StdMessage.ACTIONS.PONG, [...stdMessage.args, +new Date()]));
                break;
            case StdMessage.ACTIONS.CLOSE:
            case StdMessage.ACTIONS.UNDEFINED_ACTION:
            default:
                console.log(`UNSUPPORTED MESSAGE ACTION ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`)
                break;
        }
    });
});

// const { version } = require('../../package.json')
// const { initializeStorageWithDefaults } = require('./../storage/storage');
// const PortStream = require('extension-port-stream')
// const LocalMessageDuplexStream = require("post-message-stream")
//
// chrome.runtime.onInstalled.addListener(async () => {
//     // Here goes everything you want to execute after extension initialization
//     await initializeStorageWithDefaults({
//         version
//     });
//
//     console.log('Extension successfully installed!');
// });
//
// // Log storage changes, might be safely removed
// chrome.storage.onChanged.addListener((changes) => {
//     for (const [key, value] of Object.entries(changes)) {
//         console.log(
//             `"${key}" changed from "${value.oldValue}" to "${value.newValue}"`,
//         );
//     }
// });
//
//
// chrome.runtime.onMessageExternal.addListener(
//     function(request, sender, sendResponse) {
//         console.log({request, sender, sendResponse});
//     });
//
// chrome.runtime.onConnect.addListener(()=>{
//     console.log('ON CONNECT');
//     const pageStream = new LocalMessageDuplexStream({
//         name: "DashPay:content",
//         target: "DashPay:Dapp",
//     });
//
//     const extensionPort = chrome.runtime.connect({
//         name: "DashPayConnect",
//     });
//
//     const extensionStream = new PortStream(extensionPort);
//
//     extensionStream.pipe(pageStream);
//     pageStream.pipe(extensionStream);
// })
