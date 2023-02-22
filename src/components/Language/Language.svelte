<script>
    import {AppStore, SettingsStore} from "../../stores/stores";

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
        const x = this.code ?? 'en';
        AppStore.setI18nValue(x)
        onBackClick();
    }
    const availableLang = [{name:'en'}];
    const currentLang = $SettingsStore.i18n;
</script>

<section class="menu_page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button  class="close-button"  on:click={onCloseClick}></button>
</section>
<section class="menu_page_content">
    <h2>Select another language:</h2>
    <nav class="menu">
        {#each availableLang as lang}
            <button class="menu-tab {lang.name === currentLang ? `menu-tab-selected` : `` }" on:click={onSelectLanguageClick.bind({code:lang.name})}>
                <span>{lang.name}</span>
            </button>
        {/each}
    </nav>
</section>
