require('./register.scss')


const editorExtensionId = "kcaghheadgiepldjcemnmnmpkfchmpma";
const {Client} = require('../../../../js-library/src/index');
let client = new Client();
globalThis.client = client;
const mnemonicElement = document.getElementById('mnemonic_value');
// mnemonicElement.onclick = async ()=>{
//     let queryOptions = { active: true, currentWindow: true };
//     let tabs = await chrome.tabs.query(queryOptions);
    // chrome.tabs.sendMessage(
    //     tabs[0].id,
    //     { color: "#00FF00" },
    //     function (response) {
    //         console.log(response);
    //     }
    // );




    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if(message.action === 'CREATE'){
            mnemonicElement.innerText = message.args[0];
        }
        console.log({messageReceivedInIndex: message});
    })


    console.log('sending');
    chrome.runtime.sendMessage(editorExtensionId, {action: "CREATE"},
         function (response) {
            console.log({response});
            client.connect().then((res)=>{
                console.log('connected');
                // mnemonicElement.innerText = client.instance.wallet.mnemonic;

            })
             console.log('connecting');
         });
    // chrome.runtime.sendMessage(editorExtensionId, {action: "FETCH", args:['ACCOUNT']},
    //     async function (response) {
    //     console.log({response});
    //         await client.connect();
    //         console.log(client.getAccount())
    //         const {address, walletId, walletType, accountPath} = client.getAccount();
    //         console.log({address, walletId, walletType, accountPath});
    //         console.log({response});
    //     });
// }

// chrome.runtime.sendMessage({action:'FETCH', args:['ACCOUNT']});
// document.getElementById('go-to-options').addEventListener('click', () => {
//     chrome.runtime.openOptionsPage();
// });
//
chrome.runtime.onMessage.addListener(function(request) {
    console.log({register:request})
//     if (request.message.method === 'open') {
//         chrome.windows.create({
//             url: '/dialog.html',
//             type: 'popup', width: 400, height: 400,
//         });
//     }
});
