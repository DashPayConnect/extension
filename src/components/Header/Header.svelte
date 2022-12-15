<script>
    require('./header.scss')
    import {AccountStore } from '../../stores/stores';

    import EllipsisMenu from '../EllipsisMenu/EllipsisMenu.svelte';
    let showEllipsisMenu = false;

    function onEllipsisClick(){
        showEllipsisMenu = true;
    }
    let account = $AccountStore[Object.keys($AccountStore)[0]];
    let address;
    if(account){
        console.log(account);
        address = account.address.address.slice(0, 4) + '...' + account.address.address.slice(-6)
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
        <p class="balance_wrapper__address-dash">{address} </p>
        <p class="balance_wrapper__amount-dash">0</p>
        <p class="balance_wrapper__amount-fiat">0,00$</p>
    </section>
    <section class="options_wrapper">
        <img alt="options ellipsis logo"  class="ellipsis-menu-button" src="img/ellipsis-v.svg" width="6px" on:click={onEllipsisClick}/>
    </section>
</header>
{#if showEllipsisMenu}
    <EllipsisMenu on:closeEllipsisMenu="{() => showEllipsisMenu = false}" />
{/if}
