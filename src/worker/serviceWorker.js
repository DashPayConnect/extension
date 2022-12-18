import DashManager from './primitives/DashManager';
import MessageHandler from './primitives/MessageHandler';
import WorkDispatcher from './primitives/WorkDispatcher';
import SecureStorage from './primitives/SecureStorage';


(async()=>{
    globalThis.worker = {
        version: require('../../static/manifest.json').version,
    };
    const storage = new SecureStorage();
    await storage.init();
    globalThis.worker.storage = storage;

    const dashManager = new DashManager(storage);
    await dashManager.init();
    globalThis.worker.dashManager = dashManager;

    const workDispatcher = new WorkDispatcher(dashManager, storage);
    globalThis.worker.workDispatcher = workDispatcher;

    const messageHandler = new MessageHandler(workDispatcher);
    globalThis.worker.messageHandler = messageHandler;
    messageHandler.setListeners();
})()

