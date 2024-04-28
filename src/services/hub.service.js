import { HubConnectionBuilder } from '@microsoft/signalr'

class CallHub {
    constructor() {
        this.client = new HubConnectionBuilder().withUrl('/hubs/auction').build()
    }

    start() {
        this.client.start()
    }
}

export default new CallHub()