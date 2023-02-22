<script>
    import {AppStore, ContactsStore} from "../../stores/stores";

    require('./contacts.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    import {each} from "svelte/internal";
    const dispatch = createEventDispatcher();
    function onBackClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onCloseClick(){
        dispatch('click', 'DASHBOARD');
        AppStore.changePage({name: 'dashboardScreen'});
    }
    function onAddContactClick(){
        const contactName = prompt("Enter contact name")
        if(contactName !== null && contactName !== '' && contactName !== undefined){
            AppStore.importContact({name: contactName, addresses:[]});
            globalThis.lastCreatedContactName = contactName;
            dispatch('click', 'CONTACT_SCREEN');
            AppStore.changePage({name: 'contactScreen', data: {name: contactName}});
        }
    }
    const contacts = $ContactsStore;
    console.log({contacts})
</script>

<section class="menu_page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <button class="close-button" on:click={onCloseClick}></button>
</section>
<section class="menu_page_content">
    <nav class="menu">
        {#if Object.keys(contacts).length === 0}
            <div class="no-contacts">
                <span>No contacts</span>
            </div>
        {:else}
            {#each Object.values(contacts) as contact}
                <div class="contact-item" on:click={() => {
                    dispatch('click', 'CONTACT_SCREEN');
                    AppStore.changePage({name: 'contactScreen', data: {name: contact.name}});
                }}>
                    <div class="contact-item__name">{contact.name}</div>
                    <div class="contact-item__description">
                        <span>{contact.addresses.length} addresses associated.</span>
                        <span>0 Identity associated.</span>
                    </div>
                </div>
            {/each}
        {/if}
        <button class="menu-tab" on:click={onAddContactClick}><span>Add a contact</span></button>
    </nav>
</section>
