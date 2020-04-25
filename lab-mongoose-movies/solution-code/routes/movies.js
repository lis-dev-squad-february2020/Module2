const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');

// GET -> get data
// POST -> create data
// PATCH -> update a whole document
// PUT -> update just a single attribute of the document
// DELETE -> delete a document

/* GET home page. */
router.get('/movies', (req, res, next) => {
  Movie.find()
  .then(allMoviesFromDB => { // <- Backend requesting data from Mongo (DB) 
    res.render('movies', { movies: allMoviesFromDB }); 
    //^ Backend is responding to the front end with the data 
    // that was got from Mongo
  })
  .catch(error => {
    next(error);
  });
});

router.get('/movies/new', (req, res) => {
  res.render('movies/new', {
    title: "Create a New Movie"
  });
});


router.post('/movies', (req, res, next) => {
  const { title, plot, genre } = req.body;

  const newMovie = new Movie({title, plot, genre});

  newMovie.save()
    .then(() => {
      res.redirect('/movies');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/movies/:id', (req, res, next) => {
  Movie.findById(req.params.id)
    .then(movie => {
      res.render('movies/show', { movie });
    })
    .catch(error => {
      next(error);
  });
});


router.get('/movies/:id/edit', (req, res, next) => {
  Movie.findById(req.params.id)
  .then(movie => {
    res.render('movies/edit', {
      title: `Edit ${movie.title}`,
      movie: movie
    });
  })
  .catch(error => {
    next(error);
  });
});

router.post('/movies/:id', (req, res, next) => {
  const updatedMovie = {
    title: req.body.title,
    plot: req.body.plots,
    genre: req.body.genre,
  };

  Movie.update({_id: req.params.id}, updatedMovie)
    .then(() => {
      res.redirect('/movies');
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/movies/:id/delete', (req, res, next) => {
  Movie.findById(req.params.id)
  .then(movie => {
    movie.remove()
      .then(() => {
        res.redirect('/movies');
      })
      .catch(error => {
        next(error);
      });
  });
});

module.exports = router;
