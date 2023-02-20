<script>
    import {AppStore} from "../../stores/stores";

    require('./settings.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    function onBackClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onNetworksClick(){
        dispatch('click', 'NETWORKS_SCREEN');
        AppStore.changePage({name: 'networksScreen'});
    }
    function onAdvancedSettingsClick(){
        dispatch('click', 'ADVANCED_SETTINGS_SCREEN');
        AppStore.changePage({name: 'advancedSettingsScreen'});
    }
    function onCurrencyAndLanguageClick(){
        dispatch('click', 'CURRENCY_AND_LANGUAGE_SCREEN');
        AppStore.changePage({name: 'currencyAndLanguageScreen'});
    }
</script>

<section class="page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button class="close-button" on:click={onCloseClick}></button>
    <span>Version: 1.0.0</span>
</section>
<section class="page_content">
    <nav class="menu">
        <button class="menu-tab" on:click={onNetworksClick}><span>Networks</span></button>
        <button class="menu-tab" on:click={onCurrencyAndLanguageClick}><span>Currency & Language</span></button>
        <button class="menu-tab" on:click={onAdvancedSettingsClick}><span>Advanced Settings</span></button>
    </nav>
</section>
