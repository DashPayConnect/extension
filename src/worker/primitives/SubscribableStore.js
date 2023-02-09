const events = require('events');

const KEYS = {
    UPDATE_KEY: 'UPDATE/KEY',
    UPDATE_STATE: 'UPDATE/STATE'
}
class SubscribableStore extends events.EventEmitter {
    constructor() {
        super();
        this.state = {};
    }
    // Provide subscription to state changes
    subscribe(handler, fullState = false){
        if(fullState){
            this.on(KEYS.UPDATE_STATE, handler);
            return;
        }
        this.on(KEYS.UPDATE_KEY, handler);
    }
    unsubscribe(handler, fullState = false){
        if(fullState){
            this.removeListener(KEYS.UPDATE_STATE, handler);
            return;
        }
        this.removeListener(KEYS.UPDATE_KEY, handler);
    }
    put(key, value) {
        this.state[key] = value;
        this.emit(KEYS.UPDATE_KEY, {key, value});
        this.emit(KEYS.UPDATE_STATE, {...this.getState()});
    }
    getState(){
        return this.state;
    }
    setState(state){
        this.state = {...state};
        this.emit(KEYS.UPDATE_STATE, {...this.getState()});
    }
    get(key) {
        return this.state[key];
    }
};
SubscribableStore.KEYS = KEYS;
module.exports = SubscribableStore;
