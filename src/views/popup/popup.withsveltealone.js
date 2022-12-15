require('./popup.scss')
import App from './Popup.svelte';

const app = new App({
    target: document.body,
    props: {
        name: 'popup'
    }
});

window.app = app;

export default app;
