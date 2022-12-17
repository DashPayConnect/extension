let serviceWorkerPort;
const ServiceWorkerPort = require('../primitives/ServiceWorkerPort');
const StdMessage = require('../primitives/StdMessage');
const editorExtensionId = "camoceckaeifkkpepgjoccjfjkcjhojc";

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log({messageFromContentScript: message});
//     chrome.tabs.sendMessage(tabId, { message: "from content: "+method, tabId}, undefined, sendResponse);
// })
// setInterval(()=>{
//     console.log('Content Scriptt')
// }, 2000)
//
//


chrome.runtime.onConnect.addListener(port => {
    console.log('CONTENT SCRIPT ON CONNECT');
    console.log(port);
    return true;
    // if (port.name === 'frame') {
    //     // global framePort can be used by code that will run in the future
    //     framePort = port;
    //     port.postMessage({foo: 'bar'});
    // }
});

if(chrome.runtime.onMessageExternal){
    chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
        console.log('ONMESSAGEEXTERNAL')
        return true;
    });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('CONTENT SCRIPT LISTENER');
    // from here, we know the sending tab (message.sender) or the service worker (sender.id) requesting.
    const stdMessage = StdMessage.fromMessage(message);
    console.log(stdMessage);
    switch (stdMessage.action){
        case StdMessage.ACTIONS.DISCONNECT:
            console.log('disconnect request');
            serviceWorkerPort.postMessage(new StdMessage(StdMessage.ACTIONS.CLOSE));
            serviceWorkerPort.disconnect();
            break;
        case StdMessage.ACTIONS.CONNECT:
            serviceWorkerPort = new ServiceWorkerPort();
            serviceWorkerPort.connect(editorExtensionId);

            // We received information about the wallet we are connected to.
            window.postMessage({ type: "ACCOUNT", args: stdMessage.args}, "*")

            // Keeping the service worker alive
            setInterval(()=>{
                serviceWorkerPort.postMessage(new StdMessage(StdMessage.ACTIONS.PING, [...stdMessage.args,+new Date()]));
            }, 20000);

            // FIXME: Clean me.
            serviceWorkerPort.port.onMessage.addListener((message)=>{
                // Receiving message from service worker connection we just established
                const streamStdMessage = StdMessage.fromMessage(message);
                switch (streamStdMessage.action) {
                    case "PONG":
                        console.log(`Status: ping: ${streamStdMessage.args[1]-streamStdMessage.args[0]}`);
                        break;
                    case StdMessage.ACTIONS.UNDEFINED_ACTION:
                    default:
                        console.log(`UNSUPPORTED action ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`)
                        break;

                }
            });
            break;
        case StdMessage.ACTIONS.CREATE:
            window.postMessage(stdMessage, "*")
            break
        case StdMessage.ACTIONS.GENERATE:
            window.postMessage(stdMessage, "*")
            break
        case StdMessage.ACTIONS.EXECUTE:
            window.postMessage(stdMessage, "*")
            break
        case StdMessage.ACTIONS.FETCH:
            window.postMessage(stdMessage, "*")
            break
        case StdMessage.ACTIONS.UNDEFINED_ACTION:
        default:
            console.log(`UNSUPPORTED action ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`)
            window.postMessage(stdMessage, "*")
            break;
    }
    // console.log({messageFromContentScript: message});
    // chrome.tabs.sendMessage(tabId, { message: "from content: "+method, tabId}, undefined, sendResponse);
    return true;
})
