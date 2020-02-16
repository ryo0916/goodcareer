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