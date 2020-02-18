const { db } = require('../util/admin')

exports.getAllCompanies = (req, res) => {
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
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
}

exports.postOneCompany = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newCompany = {
    body: req.body.body,
    userImage: req.user.imageUrl,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db
    .collection('companies')
    .add(newCompany)
    .then(doc => {
      const resCompany = newCompany;
      resCompany.companyId = doc.id;
      res.json({ message: `document ${doc.id} created successfully`});
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong'});
      console.error(err);
    });
}

exports.getCompany = (req, res) => {
  let companyData = {};
  db.doc(`/companies/${req.params.companyId}`).get()
    .then(doc => {
      if(!doc.exists){
        if(!doc.exists){
          return res.status(404).json({ error: 'Company not found'})
        }
        companyData = doc.data();
        companyData.companyId = doc.id;
        return db.collection('comments').orderBy('createdAt', 'desc').where('companyId', '==', req.params.companyId).get();
      }
    })
    .then(data => {
      companyData.comments = [];
      data.forEach(doc => {
        companyData.comments.push(doc.data())
      });
      return res.json(companyData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnCompany = (req, res) => {
  if(req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    companyId: req.params.companyId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/companies/${req.params.companyId}`).get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Company not found'});
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1});
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.code });
    })
}

// Like a company
exports.likeCompany = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('companyId', '==', req.params.companyId).limit(1);

  const companyDocument = db.doc(`/companies/${req.params.companyId}`);

  let companyData;

  companyDocument.get()
    .then(doc => {
      if(doc.exists){
        companyData = doc.data();
        companyData.companyId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Company not found'})
      }
    })
    .then(data => {
      if(data.empty) {
        return db.collection('likes').add({
          companyId: req.params.companyId,
          userHandle: req.user.handle
        })
        .then(() => {
          companyData.likeCount++
          return companyDocument.update({ likeCount: companyData.likeCount});
        })
        .then(() => {
          return res.json(companyData);
        })
      } else {
        return res.status(400).json({ error: 'Company already liked'});
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
}

exports.unlikeCompany = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('companyId', '==', req.params.companyId).limit(1);

  const companyDocument = db.doc(`/companies/${req.params.companyId}`);

  let companyData;

  companyDocument.get()
    .then(doc => {
      if(doc.exists){
        companyData = doc.data();
        companyData.companyId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Company not found'})
      }
    })
    .then(data => {
      if(data.empty) {
        return res.status(400).json({ error: 'Company not liked'});

      } else {
        return db.doc(`/likes/${data.docs[0].data().id}`).delete()
          .then(() => {
            companyData.likeCount--;
            return companyDocument.update({ likeCount: companyData.likeCount})
          })
          .then(() => {
            res.json(companyData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
}

//Delete a company
exports.deleteCompany = (req, res) => {
  const document = db.doc(`/companies/${req.params.companyId}`);
  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: 'Company not found'});
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(403).json({ error: 'Unauthorized'});
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Scream deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
}