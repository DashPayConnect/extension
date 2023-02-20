<script>
    import Header from "./components/Header/Header.svelte";
    import Dashboard from "./components/Dashboard/Dashboard.svelte";
    import AdvancedSettings from "./components/AdvancedSettings/AdvancedSettings.svelte";
    import Settings from "./components/Settings/Settings.svelte";
    import Currency from "./components/Currency/Currency.svelte";
    import Language from "./components/Language/Language.svelte";
    import CurrencyAndLanguage from "./components/CurrencyAndLanguage/CurrencyAndLanguage.svelte";
    import OnBoarding from "./components/OnBoarding/OnBoarding.svelte";
    import Footer from "./components/Footer/Footer.svelte";
    import Networks from "./components/Networks/Networks.svelte";
    import EventEmitter from 'events'
    import {
        onMount,
        onDestroy,
        setContext,
        beforeUpdate,
        afterUpdate,
    } from "svelte";
    import { fade } from "svelte/transition";

    $: firstRun = undefined;
    $: wallets = undefined;

    let isInitialized = false
    let currentComponent = Dashboard;
    let currentHeader = Header;
    let currentFooter = Footer;
    import {AppStore, logs, WalletsStore} from './stores/stores'
    import {Client} from "../../js-library";

    global.emitter = new EventEmitter();
    const client = new Client();
    globalThis.client = client;
    const editorExtensionId = "camoceckaeifkkpepgjoccjfjkcjhojc";
    console.log('[APP] Connecting...')
    client.connect().then(()=> {
        isInitialized = true;
        console.log('[APP] Initialized');
        console.log({App_WalletsStore: $WalletsStore})
        console.log(Object.keys($WalletsStore))
        console.log(Object.keys($WalletsStore).length)
        console.log(currentComponent)
    });

    setContext("app_functions", {
        // switchPage: (name, data) => switchPage(name, data),
        // openModal: (modal, data) => openModal(modal, data),
        // getModalData: () => {
        //     return modalData;
        // },
        // closeModal: () => (showModal = false),
        firstRun: () => (firstRun ? true : false),
        // appHome: () => switchPage("CoinsMain"),
        // setAccountAdded: () => (accountAdded = true),
    });

    AppStore.subscribe((appstore) => {
        switch (appstore.currentPage.name) {
            case "settingsScreen":
                console.log('SettingsScreen');
                currentComponent = Settings;
                currentHeader = undefined;
                currentFooter = undefined;
                break;
            case "advancedSettingsScreen":
                console.log('advancedSettingsScreen');
                currentComponent = AdvancedSettings;
                currentHeader = undefined;
                currentFooter = undefined;
                break;
            case "networksScreen":
                console.log('networksScreen');
                currentComponent = Networks;
                currentHeader = undefined;
                currentFooter = undefined;
                break;
            case "currencyAndLanguageScreen":
                console.log('currencyAndLanguageScreen');
                currentComponent = CurrencyAndLanguage;
                currentHeader = undefined;
                currentFooter = undefined;
                break;
            case "currencyScreen":
                console.log('currencyScreen');
                currentComponent = Currency;
                currentHeader = undefined;
                currentFooter = undefined;
                break;
            case "languageScreen":
                console.log('languageScreen');
                currentComponent = Language
                currentHeader = undefined;
                currentFooter = undefined;
                break;
            default:
                currentComponent = Dashboard;
                currentHeader = Header;
                currentFooter = Footer;
        }
    })

    function onDashboardClick(e){
        console.log('Internal click done');
        console.log(e);
    }
    function onComponentClick(e){
        console.log('Internal onComponentClick done');
        if(e.type === 'click'){
            console.log('onComponentClick', e);
            switch (e.detail) {
                case "SETTINGS_SCREEN":
                    currentComponent = Settings;
                    break;
                case "NETWORKS_SCREEN":
                    currentComponent = Networks;
                    break;
                case "CURRENCY_AND_LANGUAGE_SCREEN":
                    currentComponent = CurrencyAndLanguage;
                    break;
                case "CURRENCY_SCREEN":
                    currentComponent = Currency;
                    break;
                case "LANGUAGE_SCREEN":
                    currentComponent = Language;
                    break;
                case "ADVANCED_SETTINGS_SCREEN":
                    currentComponent = AdvancedSettings;
                    break;
                default:
                    currentComponent = Dashboard;
                    currentHeader = Header;
                    currentFooter = Footer;
            }
        }
    }
</script>

<div>
    {#if isInitialized}
        {#if !Object.keys($WalletsStore).length}
            <svelte:component this="{OnBoarding}" />
        {:else}
            <svelte:component this={currentHeader} on:click={onComponentClick} />
            <svelte:component this="{currentComponent}" on:click={onComponentClick} />
            <svelte:component this={currentFooter} on:click={onComponentClick}  />
        {/if}
    {/if}
</div>
