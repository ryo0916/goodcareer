const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/companies', (req, res) => {
  admin.firestore().collection('companies').orderBy('createdAt', 'desc').get()
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

  admin.firestore()
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

exports.api = functions.region('asia-northeast1').https.onRequest(app);