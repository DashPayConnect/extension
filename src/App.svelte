<script>
    import Header from "./components/Header/Header.svelte";
    import Dashboard from "./components/Dashboard/Dashboard.svelte";
    import OnBoarding from "./components/OnBoarding/OnBoarding.svelte";
    import Footer from "./components/Footer/Footer.svelte";

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

    import {AppStore, logs, WalletStore} from './stores/stores'

    // AppStore.subscribe(appStore => {
    //     console.log('Wallets',appStore.wallets)
    // })

    // logs.subscribe(logVal => {
    //     firstRun = logVal.firstRun;
    //     console.log('First ran at: ', logVal.firstRun);
    // });
    // WalletStore.subscribe(walletsValue => {
    //     console.log({walletsValue});
    //     wallets = walletsValue;
    // })

    // console.log("First Run",logs.get, AppStore)
    setContext("app_functions", {
        // switchPage: (name, data) => switchPage(name, data),
        // openModal: (modal, data) => openModal(modal, data),
        // getModalData: () => {
        //     return modalData;
        // },
        // closeModal: () => (showModal = false),
        firstRun: () => (firstRun ? true : false),
        // appHome: () => switchPage("CoinsMain"),
        checkFirstRun: () => checkFirstRun(),
        // themeToggle: themeToggle,
        // setAccountAdded: () => (accountAdded = true),
    });
    console.log('====')
    console.log($wallets)
    console.log(Object.keys($WalletStore).length)

    const checkFirstRun = () => {
        console.log('Check first run');
        chrome.runtime.sendMessage({ type: "isFirstRun" }, (isFirstRun) => {
            firstRun = isFirstRun;
            // if (!firstRun && $currentPage.name === "FirstRunMain") {
                // SettingsStore.changePage({ name: "CoinsMain" });
            // }
            // if (!firstRun && $currentPage.name === "FirstRunRestoreMain") {
                // SettingsStore.changePage({ name: "CoinsMain" });
            // }
            // firstRun ? SettingsStore.changePage({ name: "FirstRunMain" }) : null;
            // if (firstRun) accountAdded = true;
        });
    };
    console.log({$wallets})
</script>

<div>

    <!--{#if !wallets.length > 0}-->
    {#if !Object.keys($WalletStore).length}
        <svelte:component this="{OnBoarding}" />
    {:else}
        <svelte:component this={Header} />
        <svelte:component this="{Dashboard}" />
        <svelte:component this={Footer} />
    {/if}
</div>
