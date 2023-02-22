<script>
    import {AppStore, SettingsStore} from "../../stores/stores";

    require('./currency.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    import {fi} from "timeago.js/lib/lang";
    const dispatch = createEventDispatcher();

    function onCurrencyClick(){
        dispatch('click', 'CURRENCY_SCREEN');
        AppStore.changePage({name: 'currencyScreen'});
    }
    function onBackClick(){
        dispatch('click', 'CURRENCY_AND_LANGUAGE_SCREEN');
        AppStore.changePage({name: 'currencyAndLanguageScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onSelectCurrencyClick(){
        const x = this.isoCode ?? 'USD';
        AppStore.setFiatCurrency(x);
        onBackClick();
    }
    const availableFiats = [{name:'USD'}];
    const currentFiat = $SettingsStore.fiat;
</script>

<section class="menu_page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="menu_page_content">
    <nav class="menu">
        {#each availableFiats as fiat}
            <button class="menu-tab {fiat.name === currentFiat ? `menu-tab-selected` : `` }" on:click={onSelectCurrencyClick.bind({isoCode:fiat.name})}>
                <span>{fiat.name}</span>
            </button>
        {/each}
    </nav>
</section>
