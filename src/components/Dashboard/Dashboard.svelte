<script>
    require('./dashboard.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';

</script>

<section class="dashboard_wrapper">
    <Tabs>
        <TabList>
            <Tab>Transaction history</Tab>
            <Tab>Identity history</Tab>
        </TabList>
        <TabPanel>
            <h2>No history to display.</h2>
        </TabPanel>
        <TabPanel>
            <h2>No history to display.</h2>
        </TabPanel>
    </Tabs>
</section>
