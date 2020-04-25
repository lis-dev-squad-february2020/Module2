const express = require('express');
const router  = express.Router();

const Book = require('../models/book.js');
const Author = require('../models/author.js');

/* GET home page */
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/books', (req, res) => {
  Book.find() 
    .then(allTheBooksRetrievedFromDB => {
      res.render('books', { books: allTheBooksRetrievedFromDB });  
    });
});

router.get('/books/add', (req, res) => {
  res.render('book-add');
});

router.get('/authors/add', (req, res) => {
  res.render('author-add');
});

router.get('/books/edit', (req, res) => {
  const bookId = req.query.book_id;
  Book.findById(bookId)
    .populate('author')
    .then(theBook => {
      Author.find().then(allAuthors => {
        res.render('book-edit', { 
          book: theBook, 
          allAuthors: allAuthors 
        });
      });
    });
});

router.get('/books/:bookId', (req, res) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .populate('author')
    .then(theBook => {
        res.render('book-details', { book: theBook});
    });
});

router.post('/books/add', (req, res) => {
  const { title, author, description, rating } = req.body;
  const newBook = new Book({ title, author, description, rating });
  newBook.save(() => {
    res.redirect('/books');
  });
});

router.post('/books/edit', (req, res) => {
  const bookId = req.query.book_id;
  const { title, author, description, rating } = req.body;
  Book.update({_id: bookId}, { $set: { title, author, description, rating }})
    .then(() => {
      res.redirect('/books');
    });
});

router.post('/authors/add', (req, res) => {
  const { 
    name, 
    lastName, 
    nationality, 
    birthday, 
    pictureUrl
  } = req.body;
  const newAuthor = new Author({ 
    name, 
    lastName, 
    birthday, 
    pictureUrl,
    nationality,  
  });

  newAuthor.save()
    .then(author => {
      res.redirect('/books');
    })
    .catch((err) => {
      console.log('error occurred', err);
    });
});

router.post("/reviews/add", (req, res, next) => {
  const bookId = req.query.book_id;
  const { user, comments } = req.body;
  Book.update( {_id: req.query.book_id }, { $push: { reviews: { user, comments}}})
    .then(book => {
      ress.redirect('/books');
    })
    .catch(next());
});

module.exports = router;