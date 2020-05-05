const express = require('express');
const router  = express.Router();
const Movie = require('../models/movie.js');
const uploadCloud = require('../config/cloudinary.js');

/* GET home page */
router.get('/', (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.render('index', { movies });
    });
});

router.get('/movie/add', (req, res) => {
  res.render('movie-add');
});

router.post('/movie/add', uploadCloud.single('photo'), (req, res) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const newMovie = new Movie({title, description, imgPath, imgName});
  newMovie.save()
    .then(movie => {
      res.redirect("/");
    });
});



module.exports = router;
