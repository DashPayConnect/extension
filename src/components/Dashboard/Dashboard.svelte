<script>
    require('./dashboard.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';


    import { format, render, cancel, register } from 'timeago.js';

    const transactionHistory =  globalThis?.client?.currentAccount?.transactionHistory || [];

    const calculateAmount = function (transaction) {
        if (transaction.type === 'received') {
            return transaction.to[0].satoshis;
        }
        return -transaction.from[0].satoshis;
    };


    const transactionHistoryItems = transactionHistory.filter((transaction) => transaction.type === 'received' || transaction.type === 'sent').map((transaction) => {
        const newTransactionHistoryItem = {}

        if (transaction.type === 'received') {
            newTransactionHistoryItem.type = 'Received';
            newTransactionHistoryItem.amount = transaction.to[0].satoshis / 1e8;
            // FIXME: I'm probably sure this might move in the future, watch me.
            newTransactionHistoryItem.time = format(transaction.time*1e3, 'en_US');
            newTransactionHistoryItem.from = transaction.from[0].address
            newTransactionHistoryItem.description = `Received from ${newTransactionHistoryItem.from.substring(0,3)}...${newTransactionHistoryItem.from.slice(-3)}`
        } else if (transaction.type === 'sent') {
            newTransactionHistoryItem.type = 'Sent';
            newTransactionHistoryItem.amount = -transaction.to[0].satoshis / 1e8;
            newTransactionHistoryItem.time = format(transaction.time*1e3, 'en_US');
            newTransactionHistoryItem.to = transaction.to[0].address;
            newTransactionHistoryItem.description = `Sent to ${newTransactionHistoryItem.to.substring(0,3)}...${newTransactionHistoryItem.to.slice(-3)}`
        }
        return newTransactionHistoryItem;
    });

</script>

<section class="dashboard_wrapper">
    <Tabs>
        <TabList>
            <Tab>Transaction history</Tab>
            <Tab>Identity history</Tab>
        </TabList>
        <TabPanel>
            {#each Object.entries(transactionHistoryItems) as [key, val]}
                <div class="transaction-item">
                    <div class="transaction-item-heading">
                        <span class="{val.type}-transaction"></span><h2>{val.type}</h2>
                        <div class="transaction-item-heading-right">
                            <h3>{val.amount}</h3>
                        </div>
                    </div>
                    <div class="transaction-item-content">
                        <h3>{val.time}: {val.description}</h3>
                    </div>
                </div>
            {/each}
        </TabPanel>
        <TabPanel>
            <h2>No history to display.</h2>
        </TabPanel>
    </Tabs>
</section>
