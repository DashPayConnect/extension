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

    let isInitialized = false
    import {AppStore, logs, WalletStore} from './stores/stores'
    import {Client} from "../../js-library";

    const client = new Client();
    globalThis.client = client;
    const editorExtensionId = "camoceckaeifkkpepgjoccjfjkcjhojc";
    client.connect().then(()=> isInitialized = true);

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
        {#if !Object.keys($WalletStore).length}
            <svelte:component this="{OnBoarding}" />
        {:else}
            <svelte:component this={Header} />
            <svelte:component this="{Dashboard}" />
            <svelte:component this={Footer} />
        {/if}
    {/if}

</div>
