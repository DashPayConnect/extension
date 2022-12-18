<script>
    require('./accountsModal.scss')
    import * as QRCodeGenerator from 'qrcode-generator';
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import {AppStore} from '../../stores/stores'

    const dispatch = createEventDispatcher();

    let accounts = [];
    onMount(()=>{
        accounts = $AppStore.accounts;
        // console.log('====');
        // console.log($AppStore);
    })
    async function switchAccount(walletId, accountIndex){
        await client.switchCurrentAccount(walletId, accountIndex);
        const account = await client.getCurrentAccount();
        AppStore.importAccount({walletId: account.walletId, ...account, balance: account.balance});
        globalThis.emitter.emit('SWITCH_ACCOUNT');
        closeAccountsModal();
    }
    const closeAccountsModal = () => dispatch('closeAccountsModal');
</script>
<div class="accounts-modal-background" on:click={closeAccountsModal}></div>

<nav class="accounts-modal">
    <button class="accounts-modal-close-button" on:click={closeAccountsModal}>X</button>
    <h1>Accounts</h1>
    <div class="accounts-modal-list">
        {#each accounts as account, i}
            <button on:click={()=>{ switchAccount(account.walletId, account.accountIndex)}}>{(account.accountIndex === 0)? 'Main Account' : `Account ${account.accountIndex}`}</button>
        {/each}
    </div>

</nav>
