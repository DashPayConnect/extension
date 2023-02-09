import DashManager from './primitives/DashManager';
import MessageHandler from './primitives/MessageHandler';
import WorkDispatcher from './primitives/WorkDispatcher';
import SecureStorage from './primitives/SecureStorage';
import SubscribableStore from './primitives/SubscribableStore';


(async()=>{
    globalThis.worker = {
        version: require('../../static/manifest.json').version,
    };
    console.log('[ServiceWorker] Initializing...', globalThis.worker.version);
    const secureStorage = new SecureStorage();
    await secureStorage.init();

    globalThis.worker.storage = secureStorage;

    const dashManager = new DashManager(secureStorage);
    await dashManager.init();
    globalThis.worker.dashManager = dashManager;

    const workDispatcher = new WorkDispatcher(dashManager, secureStorage);
    globalThis.worker.workDispatcher = workDispatcher;

    const messageHandler = new MessageHandler(workDispatcher);
    globalThis.worker.messageHandler = messageHandler;
    messageHandler.setListeners();
})()

