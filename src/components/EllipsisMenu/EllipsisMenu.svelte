<script>
    require('./ellipsisMenu.scss')
    import { createEventDispatcher, onDestroy } from 'svelte';
    import {AppStore} from '../../stores/stores'

    const dispatch = createEventDispatcher();

    const closeEllipsisMenu = () => dispatch('closeEllipsisMenu');

    function onFullResetClick(){
        AppStore.fullReset();
        alert('FullReset');
    }
    function onExportKeyClick(){
        alert($AppStore.wallets[Object.keys($AppStore.wallets)[0]].value);
    }
    // function closeEllipsisMenu(){

    // }
</script>
<div class="ellipsis-menu-background" on:click={closeEllipsisMenu}></div>

<nav class="ellipsis-menu">
    <button on:click={onExportKeyClick}>Export Key</button>
    <button on:click={onFullResetClick}>Full Reset</button>
</nav>
