const express = require('express');
const router = express.Router();

const Celebrity = require('../models/celebrity');

/* GET home page. */
router.get('/celebrities', (req, res, next) => {
  Celebrity.find()
    .then(allCelebritiesFromDB => { // <- Backend requesting data from Mongo (DB) 
      res.render('celebrities', { allCelebrities: allCelebritiesFromDB }); 
      //^ Backend is responding to the front end with the data 
      // that was got from Mongo
    })
    .catch(error => {
      next(error);
    });
});

router.get('/celebrities/new', (req, res) => {
  res.render('celebrities/new', {
    title: "Build Your Celebrity's Profile"
  });
});


router.post('/celebrities', (req, res, next) => {
  const { name, occupation, catchPhrase } = req.body;

  const newCelebrity = new Celebrity({name, occupation, catchPhrase});

  newCelebrity.save()
    .then(() => {
      res.redirect('/celebrities');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/celebrities/:id', (req, res, next) => {
  Celebrity.findById(req.params.id)
    .then(celebrity => {
      res.render('celebrities/show', { celebrity });
    })
    .catch(error => {
      next(error);
  });
});


router.get('/celebrities/:id/edit', (req, res) => {
  Celebrity.findById(req.params.id)
    .then(celebrity => {
      res.render('celebrities/edit', {
        title: `Edit ${celebrity.name}`,
        celebrity: celebrity
      });
    })
    .catch(error => {
      next(error);
  });
});

router.post('/celebrities/:id', (req, res, next) => {
  const updatedCelebrity = {
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
  };

  Celebrity.update({_id: req.params.id}, updatedCelebrity)
    .then(() => {
      res.redirect('/celebrities');
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/celebrities/:id/delete', (req, res, next) => {
  Celebrity.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/celebrities');
    })
    .catch(error => {
      next(error);
    });
  });
  
module.exports = router;
