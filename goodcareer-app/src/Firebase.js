import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const settings = {timestampsInSnapshots: true};

const config = {
  apiKey: process.env.firebase_api_key,
  authDomain: process.env.auth_domain,
  databaseURL: process.env.database_url,
  projectId: process.env.project_id,
  storageBucket: process.env.storage_bucket,
  messagingSenderId: process.env.messaging_id
};

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;