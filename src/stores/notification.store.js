import { defineStore } from 'pinia'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { getNotificationList } from '../services/notification.service'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notificationList: [],
        notificationCount: 0,
        connection: null,
    }),
    actions: {
        async updateNotificationList() {
            try {
                const res = await getNotificationList()
                this.notificationList = res.data
            } catch (error) {
                console.error(error);
            }
        },
        addNotification(data) {
            console.log('push', this.notificationList);
            this.notificationList.push(data)
            console.log('done', this.notificationList );
        }
    },
})