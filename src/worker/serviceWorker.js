import DashManager from './primitives/DashManager';
import MessageHandler from './primitives/MessageHandler';
import WorkDispatcher from './primitives/WorkDispatcher';
import SecureStorage from './primitives/SecureStorage';

const storage = new SecureStorage();
const dashManager = new DashManager(storage);
const workDispatcher = new WorkDispatcher(dashManager, storage);
const messageHandler = new MessageHandler(workDispatcher);
messageHandler.setListeners();
