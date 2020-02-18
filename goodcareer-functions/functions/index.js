const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllCompanies, postOneCompany, getCompany, commentOnCompany, likeCompany, unlikeCompany } = require('./handlers/companies')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')

app.get('/companies', getAllCompanies);
app.post('/company', FBAuth, postOneCompany);
app.get('/company/:companyId', getCompany);

// delete company
// check company
app.get('/company/:companyId/like', FBAuth, likeCompany);
// uncheck company
// app.get('/company/:companyId/unlike', FBAuth, unlikeCompany);
// comment company
app.post('/company/:companyId/comment', FBAuth, commentOnCompany);

// SIGNUP ROUTE
app.post('/signup', signup);

// LOGIN ROUTE
app.post('/login', login);

// UPLOAD IMAGE ROUTE
app.post('/user/image', FBAuth, uploadImage);

// ADD DETAIL ROUTE
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.region('asia-northeast1').https.onRequest(app);