
const express = require('express');
const hbs     = require('hbs');
const app     = express();
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const punkAPI = new PunkAPIWrapper();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static("public"));

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/beers', (req, res, next) => {
  punkAPI.getBeers()
  .then(responseFromDB => {
    res.render('allBeers.hbs', { beers: responseFromDB });
  })
  .catch(error => console.log(error));
});

app.get("/random-beer", (req, res, next) => {
  punkAPI.getRandom()
    .then(beers => {
      const theBeer = beers[0];
      res.render("random-beer", theBeer );
    })
    .catch(error => console.log(error));
});

// Bonus: Iteration 6
app.get('/beers/:id', (req, res, next) => {
  punkAPI.getBeer(req.params.id)
    .then(beers => {
      const theBeer = beers[0];
      res.render('partials/beerPartial', theBeer);
    })
    .catch(error => console.log(error));
});

app.listen(3000);