(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==="object"&&typeof module==="object")module.exports=factory();else if(typeof define==="function"&&define.amd)define([],factory);else if(typeof exports==="object")exports["DashPayConnect"]=factory();else root["DashPayConnect"]=factory()})(self,(()=>(()=>{var __webpack_modules__={"./src/primitives/ServiceWorkerPort.js":module=>{class ServiceWorkerPort{constructor(){this.editorExtensionId=null;this.port=null}connect(editorExtensionId){console.log("ServiceWorkerPort: Connecting to "+editorExtensionId);this.editorExtensionId=editorExtensionId;const port=chrome.runtime.connect(editorExtensionId);this.port=port;port.onMessage.addListener((message=>this.handleMessage.call(this,message)));return port}postMessage(msg){this.port.postMessage(msg)}handleMessage(msg){console.log({msgFromPort:msg})}doSomething(){console.log("DO SOMETHING")}}module.exports=ServiceWorkerPort},"./src/primitives/StdMessage.js":module=>{const ACTIONS={PING:"PING",PONG:"PONG",CREATE:"CREATE",EXECUTE:"EXECUTE",GENERATE:"GENERATE",FETCH:"FETCH",CONNECT:"CONNECT",UPDATE:"UPDATE",CLOSE:"CLOSE",DISCONNECT:"DISCONNECT",UNDEFINED_ACTION:"UNDEFINED_ACTION"};class StdMessage{static fromMessage(message,sender){return new StdMessage(message.action,message.args,sender?sender:message.sender)}constructor(action=ACTIONS.UNDEFINED_ACTION,args=[],sender=null){this.action=action;this.args=args;this.sender=sender}getTabId(){return this.sender.tab?.id||false}toJSON(){const{action,args,sender}=this;return{action,args,sender}}}StdMessage.ACTIONS=ACTIONS;module.exports=StdMessage}};var __webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(cachedModule!==undefined){return cachedModule.exports}var module=__webpack_module_cache__[moduleId]={exports:{}};__webpack_modules__[moduleId](module,module.exports,__webpack_require__);return module.exports}var __webpack_exports__={};(()=>{let serviceWorkerPort;const ServiceWorkerPort=__webpack_require__("./src/primitives/ServiceWorkerPort.js");const StdMessage=__webpack_require__("./src/primitives/StdMessage.js");const editorExtensionId="camoceckaeifkkpepgjoccjfjkcjhojc";chrome.runtime.onConnect.addListener((port=>{console.log("CONTENT SCRIPT ON CONNECT");console.log(port);return true}));if(chrome.runtime.onMessageExternal){chrome.runtime.onMessageExternal.addListener((async(message,sender,sendResponse)=>{console.log("ONMESSAGEEXTERNAL");return true}))}chrome.runtime.onMessage.addListener((async(message,sender,sendResponse)=>{console.log("CONTENT SCRIPT LISTENER");const stdMessage=StdMessage.fromMessage(message);console.log(stdMessage);switch(stdMessage.action){case StdMessage.ACTIONS.DISCONNECT:console.log("disconnect request");serviceWorkerPort.postMessage(new StdMessage(StdMessage.ACTIONS.CLOSE));serviceWorkerPort.disconnect();break;case StdMessage.ACTIONS.CONNECT:serviceWorkerPort=new ServiceWorkerPort;serviceWorkerPort.connect(editorExtensionId);window.postMessage({type:"ACCOUNT",args:stdMessage.args},"*");setInterval((()=>{serviceWorkerPort.postMessage(new StdMessage(StdMessage.ACTIONS.PING,[...stdMessage.args,+new Date]))}),2e4);serviceWorkerPort.port.onMessage.addListener((message=>{const streamStdMessage=StdMessage.fromMessage(message);switch(streamStdMessage.action){case"PONG":console.log(`Status: ping: ${streamStdMessage.args[1]-streamStdMessage.args[0]}`);break;case StdMessage.ACTIONS.UNDEFINED_ACTION:default:console.log(`UNSUPPORTED action ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`);break}}));break;case StdMessage.ACTIONS.CREATE:window.postMessage(stdMessage,"*");break;case StdMessage.ACTIONS.GENERATE:window.postMessage(stdMessage,"*");break;case StdMessage.ACTIONS.EXECUTE:window.postMessage(stdMessage,"*");break;case StdMessage.ACTIONS.FETCH:window.postMessage(stdMessage,"*");break;case StdMessage.ACTIONS.UNDEFINED_ACTION:default:console.log(`UNSUPPORTED action ${stdMessage.action}. Provided object ${JSON.stringify({stdMessage})}`);window.postMessage(stdMessage,"*");break}return true}))})();return __webpack_exports__})()));
//# sourceMappingURL=contentScript.js.map