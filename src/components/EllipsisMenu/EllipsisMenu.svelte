<script>
    require('./ellipsisMenu.scss')
    import { createEventDispatcher, onDestroy } from 'svelte';
    import {AppStore} from '../../stores/stores'
    import AccountsModal from '../AccountsModal/AccountsModal.svelte';

    const dispatch = createEventDispatcher();
    const client = globalThis.client;

    let showAccountsModal = false;
    function onOpenAccountClick(){
        showAccountsModal = true;
    }

    const closeEllipsisMenu = () => dispatch('closeEllipsisMenu');

    function onFullResetClick(){
        if(confirm('Confirming will erase all information stored including all your keys. \n Please ensure you saved them before wiping.')){
            AppStore.fullReset();
        }
    }
    async function onCreateAccountClick(){
        if(confirm('Confirm creating a new account ?')){
            const sameWalletAccounts = $AppStore.accounts.filter((el)=> el.walletId === client.currentAccount.walletId);
            console.log(sameWalletAccounts);
            await client.switchCurrentAccount(client.currentAccount.walletId, sameWalletAccounts.length);
            const account = await client.getCurrentAccount();
            AppStore.importAccount({walletId: account.walletId, ...account, balance: account.balance});
            globalThis.emitter.emit('SWITCH_ACCOUNT');

        }
    }
    function onSwitchAccountClick(){
        showAccountsModal = true;
    }
    function onExportKeyClick(){
        if(confirm('Confirm creating a new account ?')) {
            alert($AppStore.wallets[Object.keys($AppStore.wallets)[0]].value);
        }
    }
    // function closeEllipsisMenu(){

    // }
</script>
<div class="ellipsis-menu-background" on:click={closeEllipsisMenu}></div>

<nav class="ellipsis-menu">
    <button on:click={onExportKeyClick}>Export Mnemonic</button>
    <button on:click={onFullResetClick}>Full Reset</button>
    <button on:click={onSwitchAccountClick}>Switch Account</button>
    <button on:click={onCreateAccountClick}>Create New Account</button>
</nav>
{#if showAccountsModal}
    <AccountsModal on:closeAccountsModal="{() => showAccountsModal = false}" />
{/if}
