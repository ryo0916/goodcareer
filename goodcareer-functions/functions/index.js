const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');
 
const { 
  getAllCompanies, 
  postOneCompany, 
  getCompany, 
  commentOnCompany, 
  likeCompany, 
  unlikeCompany, 
  deleteCompany 
} = require('./handlers/companies')

const { 
  signup, 
  login, 
  uploadImage, 
  addUserDetails, 
  getAuthenticatedUser,
  getUserDetails,
  markNotifications 
} = require('./handlers/users')

app.get('/companies', getAllCompanies);
app.post('/company', FBAuth, postOneCompany);
app.get('/company/:companyId', getCompany);

// delete company
app.delete('/company/:companyId', FBAuth, deleteCompany);
// check company
app.get('/company/:companyId/like', FBAuth, likeCompany);
// uncheck company
app.get('/company/:companyId/unlike', FBAuth, unlikeCompany);
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
app.get('/user/:handle', getUserDetails);
app.post('notifications', FBAuth, markNotifications);

exports.api = functions.region('asia-northeast1').https.onRequest(app);

exports.createNotificationOnLike = functions.region('asia-northeast1').firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/companies/${snapshot.data().screamId}`).get()
      .then((doc) => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
          return db.doc(`/notifications`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            companyId: doc.id
          });
        }
      })
      .catch(err => 
        console.error(err))
  });

  
exports.deleteNotificationOnUnlike = functions
.region('asia-northeast1')
.firestore.document('likes/{id}')
.onDelete((snapshot) => {
  return db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch((err) => {
      console.error(err);
      return;
    })
})

exports.createNotificationOnComment = functions
  .region('asia-northeast1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/companies/${snapshot.data().screamId}`).get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
          return db.doc(`/notifications`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            companyId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  })

exports.onUserImageChange = functions.region('europe-west1').firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      let batch = db.batch();
      return db.collection('screams').where('userHandle', '==', change.before.data().handle).get()
        .then((data) => {
          data.forEach(doc => {
            const company = db.doc(`/comanies/${doc.id}`)
            batch.update(company, { userImage: change.after.data().imageUrl})
          })
          return batch.commit();
        })
    } else return true;
  })

exports.onCompanyDelete = functions
  .region('europe-west1')
  .firestore.document('/companies/{userId}')
  .onDelete((snapshot, context) => {
    const companyId = context.params.companyId;
    const batch = db.batch();
    return db.collection('comments').where('companyId', '==', companyId).get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        })
        return db.collection('likes').where('companyId', '==', companyId).get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        })
        return db.collection('notifications').where('companyId', '==', companyId);
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        })
        return batch.commit();
      })
      .catch(err => console.error(err));
  })