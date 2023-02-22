<script>
    require('./dashboard.scss')
    import Tabs from '../Tabs/Tabs.svelte';
    import TabList from '../Tabs/TabList.svelte';
    import TabPanel from '../Tabs/TabPanel.svelte';
    import Tab from '../Tabs/Tab.svelte';


    import { format, render, cancel, register } from 'timeago.js';

    const transactionHistory = [
        {
            from: [
                {address: 'yirJaK8KCE5YAmwvLadizqFw3TCXqBuZXL'},
                {address: 'yiXh4Yo5djG6QH8WzXkKm5EFzqLRJWakXz'}
            ],
            to: [
                {
                    address: 'yMX3ycrLVF2k6YxWQbMoYgs39aeTfY4wrB',
                    satoshis: 1000000000
                },
                {
                    address: 'yhdRfg5gNr587dtEC4YYMcSHmLVEGqqtHc',
                    satoshis: 159999359
                }
            ],
            type: 'sent',
            time: 1629237076,
            txId: 'e6b6f85a18d77974f376f05d6c96d0fdde990e733664248b1a00391565af6841',
            blockHash: '000001f9c5de4d2b258a975bfbf7b9a3346890af6389512bea3cb6926b9be330',
            isChainLocked: true,
            isInstantLocked: true
        },
        {
            from: [{address: 'yNCqctyQaq51WU1hN5aNwsgMsZ5fRiB7GY'}],
            to: [
                {
                    address: 'yiXh4Yo5djG6QH8WzXkKm5EFzqLRJWakXz',
                    satoshis: 1150000000
                },
                {
                    address: 'yh6Hcyipdvp6WJpQxjNbaXP4kzPQUJpY3n',
                    satoshis: 49999753
                }
            ],
            type: 'account_transfer',
            time: 1629236158,
            txId: '6f76ca8038c6cb1b373bbbf80698afdc0d638e4a223be12a4feb5fd8e1801135',
            blockHash: '000000444b3f2f02085f8befe72da5442c865c290658766cf935e1a71a4f4ba7',
            isChainLocked: true,
            isInstantLocked: true
        },
        {
            from: [{address: 'yj8rRKATAUHcAgXvNZekob58xKm2oNyvhv'}],
            to: [
                {
                    address: 'yYJmzWey5kNecAThet5BFxAga1F4b4DKQ2',
                    satoshis: 1260000000
                },
                {
                    address: 'yirJaK8KCE5YAmwvLadizqFw3TCXqBuZXL',
                    satoshis: 9999753
                }
            ],
            type: 'account_transfer',
            time: 1629234873,
            txId: '6f37b0d6284aab627c31c50e1c9d7cce39912dd4f2393f91734f794bc6408533',
            blockHash: '000000dffb05c071a8c05082a475b7ce9c1e403f3b89895a6c448fe08535a5f5',
            isChainLocked: true,
            isInstantLocked: true
        },
        {
            from: [{address: 'yj8rRKATAUHcAgXvNZekob58xKm2oNyvhv'}],
            to: [
                {
                    address: 'yj8rRKATAUHcAgXvNZekob58xKm2oNyvhv',
                    satoshis: 1270000000
                },
                {
                    address: 'yhaAB6e8m3F8zmGX7WAVYa6eEfmSrrnY8x',
                    satoshis: 400000000
                },
                {
                    address: 'yLk4Hw3w4zDudrDVP6W8J9TggkY57zQUki',
                    satoshis: 107099720
                }
            ],
            type: 'address_transfer',
            time: 1629234474,
            txId: 'c3fb3620ebd1c7678879b40df1495cc86a179b5a6f9e48ce0b687a5c6f5a1db5',
            blockHash: '000001953ea0bbb8ad04a9a1a2a707fef207ad22a712d7d3c619f0f9b63fa98c',
            isChainLocked: true,
            isInstantLocked: true
        },
        {
            from: [
                {address: 'ygHAVkMtYSqoTWHebDv7qkhMV6dHyuRsp2'},
                {address: 'ygk3GCSba2J3L9G665Snozhj9HSkh5ByVE'},
                {address: 'yTwEca67QSkZ6axGdpNFzWPaCj8zqYybY7'},
                {address: 'yercyhdN9oEkZcB9BsW5ktFaDxFEuK6qXN'},
                {address: 'yMLhEsiP2ajSh8STmXnNmkWXtoHsmawZxd'}
            ],
            to: [
                {
                    address: 'yj8rRKATAUHcAgXvNZekob58xKm2oNyvhv',
                    satoshis: 1777100000
                },
                {
                    address: 'yNDpPsJqXKM36zHSNEW7c1zSvNnrZ699FY',
                    satoshis: 99170
                }
            ],
            type: 'address_transfer',
            time: 1629216608,
            txId: 'f230a9414bf577d93d6f7f2515d9b549ede78cfba4168920892970fa8aa1eef8',
            blockHash: '00000084b4d9e887a6ad3f37c576a17d79c35ec9301e55210eded519e8cdcd3a',
            isChainLocked: true,
            isInstantLocked: true
        },
        {
            from: [{address: 'yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr'}],
            to: [
                {
                    address: 'yY16qMW4TSiYGWUyANYWMSwgwGe36KUQsR',
                    satoshis: 46810176
                },
                {
                    address: 'ygHAVkMtYSqoTWHebDv7qkhMV6dHyuRsp2',
                    satoshis: 729210000
                }
            ],
            type: 'received',
            time: 1629207543,
            txId: '1cbb35edc105918b956838570f122d6f3a1fba2b67467e643e901d09f5f8ac1b',
            blockHash: '00000c1e4556add15119392ed36ec6af2640569409abfa23a9972bc3be1b3717',
            isChainLocked: true,
            isInstantLocked: true
        }
    ];
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
