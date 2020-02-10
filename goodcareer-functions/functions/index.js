const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllCompanies, postOneCompany } = require('./handlers/companies')
const { signup, login, uploadImage } = require('./handlers/users')


app.get('/companies', getAllCompanies)
app.post('/company', FBAuth, postOneCompany);

// SIGNUP route
app.post('/signup', signup);

// Login
app.post('/login', login);

app.post('/user/image', uploadImage)

exports.api = functions.region('asia-northeast1').https.onRequest(app);