<script>
    require('./paymentModal.scss')
    import * as QRCodeGenerator from 'qrcode-generator';
    import {createEventDispatcher, onDestroy, onMount} from 'svelte';
    import {AppStore, ContactsStore} from '../../stores/stores'

    const dispatch = createEventDispatcher();

    const closePaymentModal = () => dispatch('closePaymentModal');


    export let screen;

    async function fetchRate(){
        return fetch('https://rates2.dashretail.org/rates?source=dashretail&symbol=dashusd')
            .then(async (res)=>{
                const [{price}] = (await res.json());
                return price;
            })
    }

    let rate = 70;
    fetchRate().then((fetchedRate) => {
        rate = fetchedRate;
    });

    let sendingAmount = 0;
    let sendingAmountInFiat = 0;
    let sendingAddress = '';
    let receivingAddress = globalThis.client.getCurrentAccount()?.address?.address;

    function onFullResetClick() {
        AppStore.fullReset();
        alert('FullReset');
    }

    function onExportKeyClick() {
        alert($AppStore.wallets[Object.keys($AppStore.wallets)[0]].value);
    }

    function onAddressClick() {
        window.navigator.clipboard.writeText(receivingAddress);
    }

    async function onSendClick() {
        if ($ContactsStore[sendingAddress] !== undefined) {
            sendingAddress = $ContactsStore[sendingAddress].addresses[0];
        }
        confirm(`Paying ${sendingAmount} to ${sendingAddress}`)
        const req = await globalThis.client.requestTransaction({
            address: sendingAddress,
            amount: sendingAmount
        });
        console.log({req});
        alert('Paid!');
    }

    // function closeEllipsisMenu(){

    // }
    onMount(() => {
        if (screen === 'receive') {
            const qrcode = QRCodeGenerator(4, 'L');
            qrcode.addData('dash:' + receivingAddress)
            qrcode.make();
            const svg = qrcode.createSvgTag()
            document.getElementById('qrcode').innerHTML = svg;
        }
    })

    function updateSendingAmountInFiat(){
        console.log('Update value');
        sendingAmountInFiat = sendingAmount * rate;
    }

    function onDisplayContactListClick() {
        alert('Contact list')
    }

    let contactsFiltered = Object.values($ContactsStore);
    function filterByFieldValue() {
        console.log('filterByFieldValue');
        contactsFiltered = Object.values($ContactsStore).filter(contact => {
            const contactLowered = contact.name.toLowerCase();
            const contactAddress = contact.addresses && contact.addresses[0];
            console.log(contactAddress, sendingAddress, contact)
            return contactLowered.includes(sendingAddress.toLowerCase()) || contactAddress.includes(sendingAddress);
        })
    }

</script>
<div class="payment-modal-background" on:click={closePaymentModal}></div>

<nav class="payment-modal">
    <button class="payment-modal-close-button" on:click={closePaymentModal}>X</button>
    {#if screen === 'send'}
        <h1 style="text-align: center">Send</h1>
        <form style="padding: 20px">
            <div class="currency-input-container" style="margin-top: 25px">
                <span style="width: 100px; font-size: 14px">Amount: </span>
                <input type="number" class="currency-input" placeholder="0"
                                bind:value={sendingAmount} on:change={updateSendingAmountInFiat}/>
                <span>Dash ($ {sendingAmountInFiat})</span>
            </div>
            <div class="recipient-input-container">
                <span style="width: 100px; font-size: 14px">Recipient: </span>
                <input type="text" class="recipient-input" on:keypress={filterByFieldValue} bind:value={sendingAddress}/>
            </div>
            {#if Object.keys(contactsFiltered).length !== 0}
                <div class="contacts-list-container">
                    <div class="contacts-list">
                        {#each contactsFiltered as contact}
                            <div class="contacts-list-item" on:click={() => sendingAddress = contact.name}>
                                <span class="contacts-list-item-span">- {contact.name} ({contact.addresses.length > 0 ? contact.addresses[0] : 'No address registered'})</span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
            <span style="margin-top: 10px">
                <button style="position: absolute; width: 80px; bottom: 0; left: 100px; right: 100px; text-align: center"
                        on:click={onSendClick}>Send</button>
            </span>
        </form>
    {/if}
    {#if screen === 'receive'}
        <h1 style="text-align: center">Receive</h1>
        <div id="qrcode"></div>
        <div style="display: flex; width: 250px;
            margin: auto;
            background-color: transparent;">
            <span style="text-align: center" class="text-hover" data-hover="Click to copy" on:click={onAddressClick}>
                {receivingAddress}
            </span>
            <div className="selected-account__copy">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z"
                          fill="var(--color-icon-alternative)"></path>
                </svg>
            </div>
        </div>

    {/if}
</nav>
