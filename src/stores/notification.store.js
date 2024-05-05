import { defineStore } from 'pinia'
import { getNotificationList, readNotification } from '../services/notification.service'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notificationList: [],
        newNotificationCount: 0,
        connection: null,
    }),
    actions: {
        async updateNotificationList() {
            try {
                const res = await getNotificationList()
                this.notificationList = res.data
                this.newNotificationCount = res.data.filter(item => item.isRead === false).length
            } catch (error) {
                console.error(error);
            }
        },
        addNotification(data) {
            this.notificationList.push(data)
        },
        increaseNotification() {
            this.newNotificationCount++
        },
        decreaseNotification() {
            if(!this.newNotificationCount) return
            this.newNotificationCount--
        },
        async markReadNotification(id) {
            try {
                await readNotification(id)
            } catch (error) {
                console.error(error);
            }
        }
    },
})