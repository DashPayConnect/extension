import DashManager from './primitives/DashManager';
import MessageHandler from './primitives/MessageHandler';
import WorkDispatcher from './primitives/WorkDispatcher';
import SecureStorage from './primitives/SecureStorage';


(async()=>{
    const storage = new SecureStorage();
    await storage.init();
    const dashManager = new DashManager(storage);
    await dashManager.init();
    const workDispatcher = new WorkDispatcher(dashManager, storage);
    const messageHandler = new MessageHandler(workDispatcher);
    messageHandler.setListeners();
})()

