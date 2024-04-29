<template>
    <div>
        <button @click="updatePrice">Update Price</button>
    </div>
</template>

<script>
import * as signalR from '@microsoft/signalr'

export default {
    data() {
        return {
            connection: null,
            token: localStorage.getItem('access_token'),
        }
    },
    created() {
        this.startConnection()
    },
    methods: {
        async startConnection() {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl('https://63nb9hjh-3002.asse.devtunnels.ms/hubs/auction', {
                    // accessTokenFactory: () => this.token,
                    // transport: signalR.HttpTransportType.LongPolling,
                    withCredentials: false 
                })
                // .configureLogging(signalR.LogLevel.Information)
                .build()

            this.connection
                .start()
                .then(() => {
                    console.log('SignalR Connected.')
                })
                .catch((error) => {
                    console.error('SignalR Connection Error: ', error)
                })
        },
        async updatePrice() {
            if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
                const auctionId = 13062 // Thay thế bằng id của phiên đấu giá muốn cập nhật
                const newPrice = 100 // Giá mới của sản phẩm
                console.log('Price hehehehehe.')

                try {
                console.log('Price hihiiii.')

                    await this.connection.invoke('UpdatePriceAsync', auctionId, newPrice)
                    console.log('Price updated successfully.')
                } catch (error) {
                    console.error('Error updating price: ', error)
                }
            } else {
                console.error('SignalR connection is not established.')
            }
        },
    },
}
</script>

<style>
/* Your styles here */
</style>
