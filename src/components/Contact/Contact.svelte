<script>
    import {AppStore, ContactsStore, currentPage} from "../../stores/stores";

    require('./contact.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';
    import {createEventDispatcher} from "svelte";
    import {fa, gl, th} from "timeago.js/lib/lang";
    import Contacts from "../Contacts/Contacts.svelte";
    import App from "../../App.svelte";
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
        dispatch('click', 'ADD_CONTACT_SCREEN');
        AppStore.changePage({name: 'addContactScreen'});
    }

    let contact = { name: ''};
    if(!$AppStore || !$AppStore?.currentPage.data?.name){
        console.log('Name', $AppStore.currentPage.name)
        console.log('Data', $AppStore.currentPage.data)
        AppStore.changePage({name: 'contactsScreen'});
    } else {
        const contactName = $AppStore.currentPage.data.name;
        console.log({contactName})
        console.log($ContactsStore);
        contact = { name: $AppStore?.currentPage.data?.name, addresses: [], ...$ContactsStore[contactName] };
        console.log({contact})
    }
    function onAddAnAddressClick(){
        const addr = prompt("Enter the address to associate to this contact");
        if(addr !== null && addr !== '' && addr !== undefined){
            contact.addresses.push(addr);
            AppStore.updateContact(contact);
        }
    }
    function deleteAddress(){
        console.log(this.clickedAddress ,this.clickedContactName)
        if(this.clickedAddress && this.clickedContactName){
            const clickedContact = {
                name: $AppStore?.currentPage.data?.name,
                addresses: [],
                ...$ContactsStore[this.clickedContactName]
            };
            console.log({clickedContact});
            // Remove clickedAddress from clickedContact.addresses
            clickedContact.addresses = clickedContact.addresses.filter((addr)=>{ return addr !== this.clickedAddress});
            AppStore.updateContact(clickedContact);
            console.log({clickedContact})
        }
        // console.log(this.clickedAddress);
    }
</script>

<section class="menu_page_header">
    <button class="back-button" on:click={onBackClick}></button>
    <div class="contact-name-container">
        <span>{contact.name}</span>
    </div>
    <button class="close-button" on:click={onCloseClick}></button>
</section>
<section class="menu_page_content menu_page_content__full">
<!--    <p>-->
<!--        <span>Contact Name: {contact.name}</span>-->
<!--    </p>-->
    <hr/>
    <h2>Addresses:</h2>
    {#if contact.addresses.length === 0}
        <span>No addresses registered</span>
    {/if}
    {#each contact.addresses as address}
        <p>
            <span>- {address} </span>
            <span class="delete-address-span" on:click={deleteAddress.bind({clickedAddress: address, clickedContactName: contact.name})}>X</span>
        </p>
    {/each}
    <hr/>
    <p style="text-align: center; text-align: -webkit-center">
        <button class="alternative-button" on:click={onAddAnAddressClick}>Add an address</button>
    </p>
</section>
