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
    industry: req.body.industry,
    userHandle: req.user.handle,
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