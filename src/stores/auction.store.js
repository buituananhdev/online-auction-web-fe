import { defineStore } from 'pinia'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { getSingleAuction } from '../services/auction.service'
import { useNotificationStore } from './notification.store'

export const useAuctionStore = defineStore('auctions', {
    state: () => ({
        watchingAuction: {},
        connection: null,
    }),
    actions: {
        initializeConnection(token) {
            this.connection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_APP_HUB}`, {
                    accessTokenFactory: () => token,
                    withCredentials: true,
                })
                .build()

            this.connection.on('RECEIVE_NOTIFICATION', this.handleNotification)
            this.connection
                .start()
                .then(this.onConnectionEstablished)
                .catch(this.onConnectionError)
            console.log('this connect', this.connection);
        },
        onListenEvent() {
            console.log('Listening to events...')
        },
        async setWatchingAuction(auction) {
            this.watchingAuction = auction
        },
        async syncAuction(id) {
            try {
                const res = await getSingleAuction(id)
                this.setWatchingAuction(res.data)
            } catch (err) {
                console.error(err)
            }
        },
        handleNotification(data) {
            ElNotification({
                title: data.title,
                message: data.content,
                type: 'info',
                onClick: () => {
                    window.location.href = data.redirectUrl;
                }
            })
            if (data.relatedID === this.watchingAuction.id) {
                this.syncAuction(data.relatedID)
                console.log(data);
            }
            useNotificationStore().addNotification(data)
        },
        onConnectionEstablished() {
            console.log('SignalR Connected.')
            this.onListenEvent()
        },
        onConnectionError(error) {
            console.error('SignalR Connection Error: ', error)
        },
    },
})