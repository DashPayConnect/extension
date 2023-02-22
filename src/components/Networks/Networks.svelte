<script>
    import {AppStore, NetworksStore, SettingsStore, WalletsStore} from "../../stores/stores";

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
    const client = globalThis.client;
    const walletId = Object.entries($WalletsStore)[0][0];
    const accountIndex = 0;//FIXME
    async function onSelectNetworkClick(){
        const network = this.network ?? 'mainnet';
        AppStore.setNetwork(network);

        const res = await client.sendMessage({action: 'UPDATE', args: ['NETWORK', walletId, accountIndex, network]});
        console.log({res});
        onBackClick();
    }
    function onBackClick(){
        dispatch('click', 'SETTINGS_SCREEN');
        AppStore.changePage({name: 'settingsScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }

    console.log($NetworksStore);
    console.log($NetworksStore.networks);
    const networks = $NetworksStore;
    console.log({networks});
    let currentNetwork = $SettingsStore.network;
    console.log({currentNetwork});
    async function switchOfflineMode(){
        const updatedOfflineMode = !$SettingsStore.offlineMode;
        AppStore.setOfflineMode(updatedOfflineMode);
        const res = await client.sendMessage({action: 'UPDATE', args: ['OFFLINE_MODE', walletId, accountIndex, $SettingsStore.network, updatedOfflineMode]});
        console.log({res});
        onBackClick();
    }
</script>

<section class="menu_page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="menu_page_content">
    <nav class="menu">
        {#each networks as network}
            <button class="menu-tab {network.name === currentNetwork ? `menu-tab-selected` : `` }" on:click={onSelectNetworkClick.bind({network:network.name})}>
                <span>{network.name}</span>
            </button>
        {/each}

        <button class="menu-tab" on:click={switchOfflineMode}>
            <span>Switch Current Offline Mode: {$SettingsStore.offlineMode ? 'true' : 'false'}</span>
        </button>
        <hr/>
        <button class="menu-tab" on:click={onAddNetworkClick}>
            <span>Add Network</span>
        </button>
    </nav>
</section>
