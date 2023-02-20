<script>
    import {AppStore} from "../../stores/stores";

    require('./language.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();

    function onBackClick(){
        dispatch('click', 'CURRENCY_AND_LANGUAGE_SCREEN');
        AppStore.changePage({name: 'currencyAndLanguageScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onSelectLanguageClick(){
        const x = this.code ?? 'ENG_DEFAULT';
        alert("LANG: "+x.toString());
    }
</script>

<section class="page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="dashboard_wrapper">
    <nav class="menu">
        <button class="menu-tab menu-tab-selected" on:click={onSelectLanguageClick.bind({code:'ENG'})}>
            <span>English</span>
        </button>
    </nav>
</section>
