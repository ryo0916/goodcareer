const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!　yay!");
});

exports.getCompanies = functions.https.onRequest((req, res) => {
  admin.firestore().collection('companies').get()
    .then(data => {
      let companies = [];
      data.forEach(doc => {
        companies.push(doc.data());
      });
      return res.json(companies);
    })
    .catch(err => console.error(err));
});

exports.createCompany = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: 'Method not allowed'});
  }
  const newCompany = {
    body: req.body.body,
    industry: req.body.industry,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
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