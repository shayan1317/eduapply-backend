// import {BindingScope, injectable} from '@loopback/core';
// import admin from 'firebase-admin';
// import {Message, MulticastMessage} from 'firebase-admin/lib/messaging/messaging-api';
// const serviceAccount = require('../../eduapply-fcm-firebase-adminsdk-xuwwb-439ee15bca.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// })

// @injectable({scope: BindingScope.TRANSIENT})
// export class FirebaseService {
//   constructor() { }

//   sendNotification(message: Message) {
//     admin
//       .messaging()
//       .send(message)
//       .then((response: any) => {
//         console.log('Successfully sent message:', response);
//       })
//       .catch((error: any) => {
//         console.log('Error sending message:', error);
//       });
//   };

//   sendMulticastMessageNotification(multicastMessage: MulticastMessage) {
//     admin
//       .messaging()
//       .sendMulticast(multicastMessage)
//       .then((response: any) => {
//         console.log('Successfully sent message:', response);
//       })
//       .catch((error: any) => {
//         console.log('Error sending message:', error);
//       });
//   };

// }

export {}
