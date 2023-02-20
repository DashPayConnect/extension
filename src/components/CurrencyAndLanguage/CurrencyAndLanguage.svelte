<script>
    import {AppStore} from "../../stores/stores";

    require('./currencyAndLanguage.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    function onCurrencyClick(){
        dispatch('click', 'CURRENCY_SCREEN');
        AppStore.changePage({name: 'currencyScreen'});
    }
    function onBackClick(){
        dispatch('click', 'SETTINGS_SCREEN');
        AppStore.changePage({name: 'settingsScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onLanguageClick(){
        dispatch('click', 'LANGUAGE_SCREEN');
        AppStore.changePage({name: 'languageScreen'});
    }
</script>

<section class="page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="dashboard_wrapper">
    <nav class="menu">
        <button class="menu-tab" on:click={onCurrencyClick}>
            <span>Currency</span>
        </button>
        <button class="menu-tab" on:click={onLanguageClick}>
            <span>Language</span>
        </button>
    </nav>
</section>
