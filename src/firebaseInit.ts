import {serviceAccountKey} from './constants';

var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: 'postgres://postgres:123456@localhost:5432/EDUAPPLY',
});
export const messaging = admin.messaging();
