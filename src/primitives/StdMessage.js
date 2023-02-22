const ACTIONS = {
    PING:"PING",
    PONG:"PONG",
    CREATE:"CREATE",
    EXECUTE:"EXECUTE",
    GENERATE:"GENERATE",
    FETCH:"FETCH",
    CONNECT:"CONNECT",
    UPDATE:"UPDATE",
    CLOSE:"CLOSE",
    DISCONNECT:"DISCONNECT",
    UNDEFINED_ACTION:"UNDEFINED_ACTION"
}
class StdMessage {
    static fromMessage(message, sender){
        return new StdMessage(message.action, message.args, sender ? sender : message.sender);
    }
    constructor(action = ACTIONS.UNDEFINED_ACTION, args = [], sender = null) {
        this.action = action;
        this.args = args;
        this.sender = sender;
    }
    getTabId(){
        return this.sender.tab?.id || false;
    }
    toJSON(){
        const { action, args, sender }= this;
        return {
            action, args, sender
        };
    }
};
StdMessage.ACTIONS = ACTIONS;
module.exports = StdMessage;
