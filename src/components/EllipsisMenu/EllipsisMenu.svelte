<script>
    require('./ellipsisMenu.scss')
    import { createEventDispatcher, onDestroy } from 'svelte';
    import {AppStore} from '../../stores/stores'
    import AccountsModal from '../AccountsModal/AccountsModal.svelte';

    const dispatch = createEventDispatcher();
    const client = globalThis.client;

    let showAccountsModal = false;
    let showNetworkModal = false;
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
        if(confirm('Displaying your mnemonic may cause a security risk. Are you sure ?')) {
            alert($AppStore.wallets[Object.keys($AppStore.wallets)[0]].value);
        }
    }
    function onNetworkClick(){
        showNetworkModal = true
    }

    // function closeEllipsisMenu(){
    function onSettingsClick(){
        dispatch('click', 'SETTINGS_SCREEN');
        AppStore.changePage({name: 'settingsScreen'});
        // closeEllipsisMenu();
    };
    function onSecurityClick(){
        dispatch('click', 'SECURITY_SCREEN');
        AppStore.changePage({name: 'securityScreen'});
    };
    function onAccountsClick(){
        onOpenAccountClick();
    };
    function onContactsClick(){
        dispatch('click', 'CONTACTS_SCREEN');
        AppStore.changePage({name: 'contactsScreen'});
    };
    // }
</script>
<div class="ellipsis-menu-background" on:click={closeEllipsisMenu}></div>

<nav class="ellipsis-menu">
    <button on:click={onAccountsClick}>Accounts</button>
    <button on:click={onContactsClick}>Contacts</button>
    <button on:click={onSettingsClick}>Settings</button>
    <button on:click={onSecurityClick}>Security</button>
    <span style="color:black">Version: 1.0.0</span>
</nav>
{#if showAccountsModal}
    <AccountsModal on:closeAccountsModal="{() => showAccountsModal = false}" />
{/if}
