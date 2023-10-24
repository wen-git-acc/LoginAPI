const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, } = require('firebase-admin/firestore');

import { serviceAccount} from "./secretConfig";

initializeApp({
  credential: cert(serviceAccount)
});

export const firestore = getFirestore();