<script>
    import {AppStore} from "../../stores/stores";

    require('./security.scss')
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

    function onExportButtonClick(){
        if(confirm('Displaying your mnemonic may cause a security risk. Are you sure ?')) {
            alert($AppStore.wallets[Object.keys($AppStore.wallets)[0]].value);
        }
    }
</script>

<section class="menu_page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button class="close-button" on:click={onCloseClick}></button>
</section>
<section class="menu_page_content">
    <nav class="menu">
        <button class="menu-tab" on:click={onExportButtonClick}><span>Export Mnemonic</span></button>
    </nav>
</section>
