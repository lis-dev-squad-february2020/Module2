const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log('session', req.session);
  let currentUser;
  if (req.session.currentUser) {
    currentUser = req.session.currentUser.username
  }

  if (req.session.passport) {
    currentUser = req.session.passport.user.username
  }

  res.render('index', { currentUser });
});

router.use((req, res, next) => {
  if (req.session.currentUser || req.session.passport) {
    next(); // ------------------------
  } else {                          // |
    res.redirect('/login');         // |
  }                                 // |
});                                 // |
                                    // |
//-------------------------------------
// |
// |
router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;