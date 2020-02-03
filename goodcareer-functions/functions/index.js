const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const config = {
  apiKey: "AIzaSyBCak4ASMj3VIQkDVbIQ9Wkuz4gbVFqV7c",
  authDomain: "goodcareer-746e4.firebaseapp.com",
  databaseURL: "https://goodcareer-746e4.firebaseio.com",
  projectId: "goodcareer-746e4",
  storageBucket: "goodcareer-746e4.appspot.com",
  messagingSenderId: "53080588448",
  appId: "1:53080588448:web:2d03c1d362c832bc7c49c5",
  measurementId: "G-LS4ZYRH9C8"
};


const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/companies', (req, res) => {
  db.collection('companies').orderBy('createdAt', 'desc').get()
    .then(data => {
      let companies = [];
      data.forEach(doc => {
        companies.push({
          companyId: doc.id,
          ...doc.data()
        });
      });
      return res.json(companies);
    })
    .catch(err => console.error(err));
})

app.post('/company', (req, res) => {
  const newCompany = {
    body: req.body.body,
    industry: req.body.industry,
    createdAt: new Date().toISOString()
  };

  db
    .collection('companies')
    .add(newCompany)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully`});
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong'});
      console.error(err);
    });
});

// SIGNUP route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  let token, userId;
  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if(doc.exists){
        return res.status(400).json({ handle: 'this handle is already taken'});
      } else {
        return firebase
      .auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      if(err.code === 'auth/email-already-in-use'){
        return res.status(400).json({email: 'Email is already in use'})
      } else {
        return res.status(500).json({ error: err.code })
      }
    })
});

exports.api = functions.region('asia-northeast1').https.onRequest(app);