<script>
    require('./header.scss')
    import {AccountStore } from '../../stores/stores';

    import EllipsisMenu from '../EllipsisMenu/EllipsisMenu.svelte';
    import PaymentModal from '../PaymentModal/PaymentModal.svelte';
    let showEllipsisMenu = false;
    let showReceiveModal = false;
    let showSendModal = false;

    function onEllipsisClick(){
        showEllipsisMenu = true;
    }
    let account = $AccountStore[Object.keys($AccountStore)[0]];
    let address;
    if(account){
        address = account.address.address;
    }
    function onAddressClick(){
        window.navigator.clipboard.writeText(address);
    }
    function openReceiveModal(){
        showReceiveModal = true
    }
    function openSendModal(){
        showSendModal = true
    }
</script>
<header>
    <button class="connected_status_indicator">
        <div class="color-indicator">
            <span class="color-indicator__inner_circle-connected">●</span>
        </div>
        <img alt="Dash Logo" src="img/logo.png" width="60" style="margin-left:5px">
    </button>
    <section class="balance_wrapper">
        <p class="balance_wrapper__address-dash text-hover" data-hover="Click to copy" on:click={onAddressClick}>{address.slice(0, 4) + '...' + address.slice(-6)} </p>
        <p class="balance_wrapper__amount-dash">0</p>
        <p class="balance_wrapper__amount-fiat">0,00$</p>
    </section>
    <section class="options_wrapper">
        <img alt="options ellipsis logo"  class="ellipsis-menu-button" src="img/ellipsis-v.svg" width="6px" on:click={onEllipsisClick}/>
    </section>
    <div class="header_overlay_container">
        <button style="margin-right: 5px" on:click={openReceiveModal}>Receive</button>
        <button style="margin-left: 5px" on:click={openSendModal}>Send</button>
    </div>
</header>
{#if showEllipsisMenu}
    <EllipsisMenu on:closeEllipsisMenu="{() => showEllipsisMenu = false}" />
{/if}
{#if showReceiveModal}
    <PaymentModal on:closePaymentModal="{() => showReceiveModal = false}" screen="receive"/>
{/if}
{#if showSendModal}
    <PaymentModal on:closePaymentModal="{() => showSendModal = false}" screen="send" />
{/if}
