const {expect} = require('chai');
const SubscribableStore = require('./SubscribableStore');

describe('SubscribableStore', function suite() {
    this.timeout(60000);
    let store;
    const receivedValue = [];
    const receivedValueState = [];

    it('should instantiate', async () => {
        store = new SubscribableStore();
        expect(store).to.not.equal(null);
        expect(store.constructor.name).to.equal('SubscribableStore');
        expect(store.state).to.deep.equal({});
    });
    it('should set subscription for key', function () {
        const handler = (value) => {
            // console.log('handler called with value', value);
            receivedValue.push(value);
        };
        store.subscribe(handler);
    });
    it('should set subscription for full state', function () {
        const handler2 = (state) => {
            // console.log('handler called with state', state);
            receivedValueState.push(state);
        };
        store.subscribe(handler2, true);
    });
    it('should put values', function () {
        store.put('key1', {someValue:'value1'});
        store.put('key2', {bool:true, number: 42, squawk: 'squawk', obj: {a:1, b:2, c:3}});
        store.put('key1', {someValue:'value2'});
    });
    it('should have received key subscription', function () {
        expect(receivedValue.length).to.equal(3);
        expect(receivedValue[0]).to.deep.equal({key: "key1", value:{someValue:'value1'}});
        expect(receivedValue[1]).to.deep.equal({key: "key2", value:{bool:true, number: 42, squawk: 'squawk', obj: {a:1, b:2, c:3}}});
        expect(receivedValue[2]).to.deep.equal({key: 'key1', value:{someValue:'value2'}});
    });
    it('should have received state subscription', function () {
        expect(receivedValueState.length).to.equal(3);
        expect(receivedValueState[0]).to.deep.equal({key1:{someValue:'value1'}});
        expect(receivedValueState[1]).to.deep.equal({key1:{someValue:'value1'}, key2:{bool:true, number: 42, squawk: 'squawk', obj: {a:1, b:2, c:3}}});
        expect(receivedValueState[2]).to.deep.equal({key1:{someValue:'value2'}, key2:{bool:true, number: 42, squawk: 'squawk', obj: {a:1, b:2, c:3}}});
    });
    it('should get key', function () {
        expect(store.get('key1')).to.deep.equal({someValue:'value2'});
        expect(store.get('key2')).to.deep.equal({bool:true, number: 42, squawk: 'squawk', obj: {a:1, b:2, c:3}});
    });
    it('should get state', function () {
        expect(store.getState()).to.deep.equal({key1:{someValue:'value2'}, key2:{bool:true, number: 42, squawk: 'squawk', obj: {a:1, b:2, c:3}}});
    });
    it('should set state', function () {
        store.setState({somethingElse: true})
        expect(store.getState()).to.deep.equal({somethingElse: true});
    });

});
