<script>
    import { onMount } from 'svelte';

    onMount(async () => {
        console.log('ONBOARD MOUNT')
    });
        import {Client} from "../../../../js-library/src/index";

    require('./onboarding.scss')
    import {AppStore, currentPage} from '../../stores/stores';

    let showCreateWalletScreen = false;
    let showImportWalletScreen = false;
    let showOnboardingScreen = false;
    let mnemonic = 'Generating.';
    let walletId = '';
    let importMnemonic = '';

    const client = globalThis.client;

    setTimeout(()=>{ mnemonic = 'Generating..'}, 200);
    setTimeout(()=>{ mnemonic = 'Generating...'}, 600);
    setTimeout(()=>{ mnemonic = 'Generating....'}, 1000);
    setTimeout(()=>{ mnemonic = 'Generating.....'}, 1400);

    async function fetchGenerateMnemonic(){
        console.log('GENEATE');
        const res = await client.sendMessage({action: 'GENERATE', args: ['MNEMONIC']});
        console.log('GENERATED', res);
        if(res && res.args){
            mnemonic = res.args[1];
            walletId = res.args[2];
        }
        return res;
    }

    setTimeout(async ()=>{
         let res = await fetchGenerateMnemonic();
        // if(!res || !res.args){
        //     setTimeout(async ()=>{
        //         res = await fetchGenerateMnemonic();
        //     })
        // }
    }, 2000);

    AppStore.subscribe((appstore) => {
        switch (appstore.currentPage.name) {
            case "createWalletScreen":
                showCreateWalletScreen = true;
                showImportWalletScreen = false;
                break;
            case "importWalletScreen":
                showImportWalletScreen = true;
                showCreateWalletScreen = false;
                break;
            default:
                showImportWalletScreen = false;
                showCreateWalletScreen = false;
                showOnboardingScreen = true;
        }
    })


    async function onCreateWalletClick() {
        AppStore.changePage({name: 'createWalletScreen'});
    }

    function onImportWalletClick() {
        AppStore.changePage({name: 'importWalletScreen'});
    }
</script>


<section class="onboarding-wrapper">
    <div class="onboarding-wrapper__home">
        <img src="img/logo.png" width="182"/>
        {#if showCreateWalletScreen}
            <div class="onboarding-wrapper__create-content">
                <div class="alert alert-warning">
                    <h3 style="color: white;">Backup your mnemonic seed securely.</h3>
                    <ul>
                        <li>Anyone with your mnemonic seed can take your assets.</li>
                        <li>Lost mnemonic seed can't be recovered.</li>
                    </ul>
                </div>
                <div class="mnemonic-display">{mnemonic}</div>
                <button on:click={() => AppStore.changePage({name:'onboardingScreen'})}>Back</button>
                <button on:click={async () =>{
                    client.sendMessage({action: 'CREATE', args: ['WALLET_FROM_MNEMONIC', mnemonic]})
                    setTimeout(async ()=>{
                        const fetchReq = await client.sendMessage({action: 'FETCH', args: ['ACCOUNT']})
                        const account = fetchReq.args[1];
                        console.log(account, await client.getCurrentAccount(), await client.fetchCurrentAccount());
                        AppStore.importWallet({walletId: walletId, type:'mnemonic', value: mnemonic});
                        AppStore.importAccount({walletId: walletId, ...account});
                    }, 2000)

                }}>Next</button>
            </div>
        {:else if showImportWalletScreen}
            <div class="onboarding-wrapper__import-content">
                <input bind:value={importMnemonic} placeholder="Enter mnemonic"/>

                <button on:click={() => AppStore.changePage({name:'onboardingScreen'})}>Back</button>
                <button on:click={async () => {
                const walletIdRes = await client.sendMessage({action: 'EXECUTE', args: ['MNEMONIC_TO_WALLET_ID', importMnemonic]});
                walletId = walletIdRes.args[2];
                AppStore.importWallet({walletId, type:'mnemonic', value: importMnemonic});
                const createReq = await client.sendMessage({action: 'CREATE', args: ['WALLET_FROM_MNEMONIC', importMnemonic]})
                const account = createReq.args[2];
                AppStore.importAccount({walletId: walletId, ...account});
               }
            }>Next</button>
            </div>
            <!--      <CreatWallet on:closeEllipsisMenu="{() => showEllipsisMenu = false}" />-->
        {:else}
            <div class="onboarding-wrapper__home-content">
                <nav>
                    <button on:click={onCreateWalletClick}>Create wallet</button>
                    <button on:click={onImportWalletClick}>Import wallet</button>
                </nav>
            </div>
        {/if}
    </div>

</section>
