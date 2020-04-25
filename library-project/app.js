require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const helpers      = require('handlebars-helpers')();


// handlebar helpers npm package
hbs.registerHelper(helpers);

// custom helper 1
hbs.registerHelper('isSelected', (author, bookAuthor) => {
  if (author === bookAuthor) {
    return 'selected';
  } else {
    return '';
  }
});

// custom helper 2
hbs.registerHelper('multipleSelect', ( allAuthors, bookAuthors ) => {
  let options = '';
  allAuthors.forEach((author) => {
      if (authorIsPresentInBook(author, bookAuthors)) {
        options += `<option value=${author._id} selected>${author.name}</option>`;
      } else {
        options += `<option value=${author._id}>${author.name}</option>`;
      }
  });
  return options;
});

function authorIsPresentInBook(author, bookAuthors) {
  return bookAuthors.some(bookAuthor => {
    return bookAuthor.name === author.name;
  });
}

mongoose
  .connect('mongodb://localhost/library-project', { useUnifiedTopology: true , useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');

app.use('/', index);

module.exports = app;