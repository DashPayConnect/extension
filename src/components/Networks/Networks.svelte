<script>
    import {AppStore} from "../../stores/stores";

    require('./networks.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    function onAddNetworkClick(){
        alert('Feature coming soon');
        // dispatch('click', 'NETWORKS_SCREEN');
        // AppStore.changePage({name: 'networksScreen'});
    }
    function onSelectNetworkClick(){
        const x = this.network ?? 'mainnetDefault';
        alert("Network: "+x.toString());
        // dispatch('click', 'NETWORKS_SCREEN');
        // AppStore.changePage({name: 'networksScreen'});
    }
    function onBackClick(){
        dispatch('click', 'SETTINGS_SCREEN');
        AppStore.changePage({name: 'settingsScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
</script>

<section class="page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="dashboard_wrapper">
    <nav class="menu">
        <button class="menu-tab menu-tab-selected" on:click={onSelectNetworkClick.bind({network:'mainnet'})}>
            <span>Mainnet</span>
        </button>
        <button class="menu-tab" on:click={onSelectNetworkClick.bind({network:'testnet'})}>
            <span>Testnet</span>
        </button>
        <button class="menu-tab" on:click={onAddNetworkClick}>
            <span>Add Network</span>
        </button>
    </nav>
</section>
