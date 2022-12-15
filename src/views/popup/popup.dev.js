require('./popup.scss')
const {Client} = require("../../../../js-library/src/index");


async function getFromStore(){
    return new Promise((res)=>{
        chrome.storage.sync.get(function(data){ console.log({data}); res(data); });
    })
}

let client;
getFromStore()
    .then(async (store)=>{
        if(!store.mnemonic){
            chrome.tabs.create({
                url: "/register.html",
            });
            window.close();
        } else {
            const {Client} = require('../../../../js-library/src/index');
            client = new Client();
            globalThis.client = client;
            await client.connect()
            document.getElementById('dash-address').innerText = client.getAccount().address.address
            document.getElementById('dash-value').innerText = client.getBalance()
        }
    console.log({store});
})

document.getElementById('go-to-options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener(function(request) {

    console.log({request})
    if (request.message.method === 'open') {
        chrome.windows.create({
            url: '/dialog.html',
            type: 'popup', width: 400, height: 400,
        });
    }
});

chrome.runtime.onConnect.addListener(function (port) {
    console.log('ON CON')
    chrome.runtime.sendMessage(editorExtensionId, {
        action: 'FETCH',
        args: ['ADDRESS']
    });
    // port.onMessage.addListener(function (msg) {
    //     if (port.name === "uiOps") {
    //         const idToQuery = msg.id;
    //         if (document.getElementById(idToQuery)) {
    //             port.postMessage({
    //                 exists: true,
    //             });
    //         } else {
    //             port.postMessage({
    //                 exists: false,
    //             });
    //         }
    //     }
    // });
});

//
// Query tab
// let queryOptions = { active: true, currentWindow: true };
// let tabs = await chrome.tabs.query(queryOptions);

// Open up connection
// const port = chrome.tabs.connect(tabs[0].id, {
//     name: "uiOps",
// });
