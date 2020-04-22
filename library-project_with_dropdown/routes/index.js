const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/books', (req, res) => {
  //^ allows the front-end to get info from the backend - entry point
  Book.find()
    .then(allBooksFromDB => { // <- Backend requesting data from Mongo (DB) 
      let userAuthenticated = req.session.currentUser ? true : false;
      res.render('books', {
        books: allBooksFromDB,
        userAuthenticated
      });
      //^ Backend is responding to the front end with the data 
      // that was got from Mongo
    })
    .catch(error => {
      console.log('Error while retrieving the books');
    });
});

router.get('/books/add', (req, res) => {
  Author.find().then(authors => {
    console.log("authors", authors);
    res.render('book-add', {
      authors
    });
  });
});

router.post('/books/add', (req, res) => {
  const {
    title,
    author,
    description,
    rating
  } = req.body;

  const newBook = new Book({
    title,
    author,
    description,
    rating
  });
  newBook.save()
    .then((book) => {
      res.redirect('/books');
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/books/edit', (req, res) => {
  let bookId = req.query.book_id;
  console.log("author", req.body.author);
  const {
    title,
    author,
    description,
    rating
  } = req.body;

  console.log('author being edited', author);

  Book.update({
      _id: bookId
    }, {
      $set: {
        title,
        author,
        description,
        rating
      }
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/books/edit', (req, res) => {
  let bookId = req.query.book_id;
  //Fetch the book using Mongoose using findById
  Book.findById(bookId)
    .populate('author')
    .then(book => {
      Author.find().then(allAuthors => {
        res.render('book-edit', {
          book,
          allAuthors
        });
      });
    })
    .catch(error => {
      console.log('Error while retrieving book details: ', error);
    });
});

router.get('/books/:bookId', (req, res) => {
  Book.findById(req.params.bookId)
    .populate('author')
    .then(theBook => {
      res.render('book-details', {
        book: theBook
      });
    })
    .catch(error => {
      console.log('Error while retrieving book details: ', error);
    });
});

router.post('/reviews/add', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update( {_id: req.query.book_id }, { $push: { reviews: { user, comments}}})
    .then(book => {
      res.redirect('/books');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;