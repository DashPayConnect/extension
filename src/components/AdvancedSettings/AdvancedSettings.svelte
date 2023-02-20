<script>
    import {AppStore} from "../../stores/stores";

    require('./advancedSettings.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    function onBackClick(){
        dispatch('click', 'SETTINGS_SCREEN');
        AppStore.changePage({name: 'settingsScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onPathValueChange(){
        const x = this.value ?? 'm/0\'/';
        console.log("PATH: "+x.toString());
    }
    function onSaveClick(){
        alert("SAVE TODO");
    }
    let value = `m/44'/`;
</script>

<section class="page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="dashboard_wrapper">
    <nav class="menu">
        <span>BIP 44 Path: <input on:change={onPathValueChange} value="{value}"/></span>
        <button class="save-button" on:click={onSaveClick}>Save</button>
    </nav>
</section>
