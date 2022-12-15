class ServiceWorkerPort {
    constructor() {
        this.editorExtensionId = null
        this.port = null;
    }
    connect(editorExtensionId){
        console.log('ServiceWorkerPort: Connecting to '+editorExtensionId);
        this.editorExtensionId = editorExtensionId;

        const port = chrome.runtime.connect(editorExtensionId);
        this.port = port;
        port.onMessage.addListener((message)=>this.handleMessage.call(this,message));
        return port;
        // console.log({res})
    }
    postMessage(msg){
        this.port.postMessage(msg);
    }
    handleMessage(msg){
        // function(msg) {
            console.log({msgFromPort: msg});
        // }
    }
    doSomething(){
        console.log('DO SOMETHING');
    }
};
module.exports = ServiceWorkerPort;
