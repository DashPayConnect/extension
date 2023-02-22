<script>
    require('./paymentModal.scss')
    import * as QRCodeGenerator from 'qrcode-generator';
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import {AppStore} from '../../stores/stores'

    const dispatch = createEventDispatcher();

    const closePaymentModal = () => dispatch('closePaymentModal');


    export let screen;

    let sendingAmount = 0;
    let sendingAddress = '';
    let receivingAddress = globalThis.client.getCurrentAccount()?.address?.address;

    function onFullResetClick(){
        AppStore.fullReset();
        alert('FullReset');
    }
    function onExportKeyClick(){
        alert($AppStore.wallets[Object.keys($AppStore.wallets)[0]].value);
    }
    function onAddressClick(){
        window.navigator.clipboard.writeText(receivingAddress);
    }
    async function onSendClick(){
        alert(`Paying ${sendingAmount} to ${sendingAddress}`)
        await globalThis.client.requestTransaction({
            address: sendingAddress,
            amount: sendingAmount
        });
        alert('Paid!');
    }
    // function closeEllipsisMenu(){

    // }
    onMount(()=>{
        if(screen === 'receive'){
        const qrcode = QRCodeGenerator(4, 'L');
        qrcode.addData('dash:'+receivingAddress)
        qrcode.make();
        const svg = qrcode.createSvgTag()
        document.getElementById('qrcode').innerHTML = svg;
        }
    })

</script>
<div class="payment-modal-background" on:click={closePaymentModal}></div>

<nav class="payment-modal">
    <button class="payment-modal-close-button" on:click={closePaymentModal}>X</button>
    {#if screen === 'send'}
        <h1>Send</h1>
        <form>
            <input type="number" bind:value={sendingAmount} /> Dash

            <p>To</p>
            <input type="text" bind:value={sendingAddress} />

            <span style="margin-top: 10px">
                <button on:click={onSendClick}>Send</button>
            </span>
        </form>
    {/if}
    {#if screen === 'receive'}
        <h1>Receive</h1>
        <div id="qrcode"></div>
        <p style="text-align: center"  class="text-hover" data-hover="Click to copy" on:click={onAddressClick}>{receivingAddress}</p>
    {/if}
</nav>
