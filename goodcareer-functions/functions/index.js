const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllCompanies, postOneCompany } = require('./handlers/companies')
const { signup, login, uploadImage, addUserDetail } = require('./handlers/users')

app.get('/companies', getAllCompanies)
app.post('/company', FBAuth, postOneCompany);

// SIGNUP ROUTE
app.post('/signup', signup);

// LOGIN ROUTE
app.post('/login', login);

// UPLOAD IMAGE ROUTE
app.post('/user/image', FBAuth, uploadImage)

// ADD DETAIL ROUTE
app.post('/user', FBAuth, addUserDetail);

exports.api = functions.region('asia-northeast1').https.onRequest(app);