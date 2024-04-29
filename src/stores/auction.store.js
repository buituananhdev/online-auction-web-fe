// stores/counter.js
import { defineStore } from 'pinia'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { getSingleAuction } from '../services/auction.service'

let connection

export const useAuctionStore = defineStore('auctions', {
    state: () => ({
        auctionList: [],
        detailAuction: {},
        currentAuctionId: 0
    }),
    actions: {
        initializeConnection(token) {
            console.log('token', token);
            connection = new HubConnectionBuilder()
                .withUrl('https://63nb9hjh-3002.asse.devtunnels.ms/hubs/auction', {
                    accessTokenFactory: () => token,
                    withCredentials: true,
                })
                .build()

            connection.on('RECEIVE_NOTIFICATION', (data) => {
                console.log('heeeeeeeeeeeeee',data)
            })

            connection
                .start()
                .then(() => {
                    console.log('SignalR Connected.')
                    this.onListenEvent() // Start listening to events after connection is established
                })
                .catch((error) => {
                    console.error('SignalR Connection Error: ', error)
                })
        },
        onListenEvent() {
            console.log('Listening to events...')
        },
        async setCurrentAuctionId(id) {
            this.currentAuctionId = id
        },
        async getDetailAuction() {
            try {
                const res = await getSingleAuction(this.currentAuctionId)
                this.detailAuction = res.data
            } catch (error) {
                console.error(error);
            }
        }
    },
})
