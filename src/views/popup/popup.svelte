<script>
    export let name;
    function handleClick() {
        alert('clicked')
    }
</script>

<img alt="Dash" src="img/dash_logo_2018_rgb_for_screens.png" width="200px">

<h1>Hello {name}!</h1>

<div>
    <p>SASS is working!</p>
    <button
            id="go-to-options"
            class="button"
            style="margin-top: 2rem;"
            on:click={handleClick}
    >
        Open options page
    </button>
</div>
