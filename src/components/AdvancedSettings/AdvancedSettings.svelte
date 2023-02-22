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
    function onFullResetClick(){
        if(confirm('Confirming will erase all information stored including all your keys. \n Please ensure you saved them before wiping.')){
            AppStore.fullReset();
        }
    }
    let value = `m/44'/`;
</script>

<section class="menu_page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="menu_page_content">
    <nav class="menu">
        <button class="menu-tab" on:click={onFullResetClick}>Full Extension Reset</button>
    </nav>
</section>
