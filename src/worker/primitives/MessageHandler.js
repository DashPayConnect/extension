const StdMessage = require("../../primitives/StdMessage");

class MessageHandler {
    constructor(workDispatcher) {
        this.workDispatcher = workDispatcher;
    }
    setListeners(){
        const handler = this.handleMessage.bind(this);
        chrome.runtime.onMessageExternal.addListener(handler)
        chrome.runtime.onMessage.addListener(handler)
        // chrome.runtime.onConnect.addListener(function(port) {
        //     console.log('on connect');
        //     port.onMessage.addListener(function(msg) {
        //         console.log('port message');
        //         const stdMessage = StdMessage.fromMessage(msg);
        //         switch (stdMessage.action) {
        //             // case StdMessage.ACTIONS.FETCH:
        //             // if(stdMessage.args[0] === 'ADDRESS'){
        //             //     port.postMessage(new StdMessage(StdMessage.ACTIONS.FETCH, [...stdMessage.args, +new Date()]));
        //             //
        //             //     return this.DashPayConnect.getAddress();
        //             // }
        //             // break;
        //             case StdMessage.ACTIONS.PING:
        //                 port.postMessage(new StdMessage(StdMessage.ACTIONS.PONG, [...stdMessage.args, +new Date()]));
        //                 break;
        //             case StdMessage.ACTIONS.CLOSE:
        //             case StdMessage.ACTIONS.UNDEFINED_ACTION:
        //             default:
        //                 console.log(`UNSUPPORTED MESSAGE ACTION ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`)
        //                 break;
        //         }
        //     });
        // });
    }
    handleMessage(message, sender, sendResponse){
        const {workDispatcher} = this;
        const stdMessage = StdMessage.fromMessage(message, sender)
        let response = stdMessage;

        new Promise(async (resolve)=>{

             // sendResponse(stdMessage)
             // return resolve(stdMessage);
            const type = stdMessage.args[0];
            console.info(`> REQ - [${stdMessage.action}|${type} - ${JSON.stringify(stdMessage)}`);


            switch (stdMessage.action) {
                case StdMessage.ACTIONS.CREATE:
                    response = await workDispatcher.create(stdMessage);
                    break;
                case StdMessage.ACTIONS.FETCH:
                    console.log('beforeFetch');
                    response = await workDispatcher.fetch(stdMessage);
                    console.log('afterFetch',response);
                    break;
                case StdMessage.ACTIONS.EXECUTE:
                    response = await workDispatcher.execute(stdMessage);
                    break;
                case StdMessage.ACTIONS.GENERATE:
                    console.log('Message.Generate')
                    response = await workDispatcher.generate(stdMessage);
                    console.log('Message.Generated')
                    break;
                case StdMessage.ACTIONS.DISCONNECT:
                    console.log('External request to disconnect');
                    break;
                case StdMessage.ACTIONS.CONNECT:
                    console.log('External request to connect');
                    response = await workDispatcher.connect(stdMessage);
                    break;
                case StdMessage.ACTIONS.UNDEFINED_ACTION:
                default:
                    console.log(`UNSUPPORTED action ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`)
                    response.args.push('ERROR: UNSUPPORTED ACTION');
                    break;
            }
            console.info(`< RES - [${response?.action}|${type} - ${JSON.stringify(response)}`);

            // We pass along the message as we are already listening for potential connection.
            // Content script might need to perform some connection from their end.
            if(stdMessage.getTabId()) {
                chrome.tabs.sendMessage(response.getTabId(), response, undefined, sendResponse)
            }
            sendResponse(response)
            return resolve(response);
        });
        return true;
    }
};
module.exports = MessageHandler;
