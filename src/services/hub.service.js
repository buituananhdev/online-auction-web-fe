import * as signalR from '@microsoft/signalr'

// class CallHub {
//     constructor() {
//         this.client = new HubConnectionBuilder().withUrl('https://63nb9hjh-3002.asse.devtunnels.ms/api/hubs/auction').build()
//     }

//     start() {
//         this.client.start()
//     }
// }

// export default new CallHub()
const token = localStorage.getItem('access_token')

// const connection = new signalR.HubConnectionBuilder()
//                         .withUrl('https://63nb9hjh-3002.asse.devtunnels.ms/hubs/auction',
//                         {
//                             accessTokenFactory: () => token,
//                             transport: signalR.HttpTransportType.LongPolling,
//                             skipNegotiation: true
//                         }
//                     ).build()
// async function start() {
//         await connection.start() 
//         connection.invoke('hehhe', () =>{
//             console.log("hiihi");
//         })
//     }
// }
export default token;