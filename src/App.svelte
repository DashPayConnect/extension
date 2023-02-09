<script>
    import Header from "./components/Header/Header.svelte";
    import Dashboard from "./components/Dashboard/Dashboard.svelte";
    import OnBoarding from "./components/OnBoarding/OnBoarding.svelte";
    import Footer from "./components/Footer/Footer.svelte";
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
</script>

<div>

    {#if isInitialized}
        {#if !Object.keys($WalletsStore).length}
            <svelte:component this="{OnBoarding}" />
        {:else}
            <svelte:component this={Header} />
            <svelte:component this="{Dashboard}" />
            <svelte:component this={Footer} />
        {/if}
    {/if}

</div>
