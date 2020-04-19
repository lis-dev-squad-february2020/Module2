const express = require('express');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
const hbs = require('hbs');
let path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

app.set('view engine', 'hbs');
app.set('views',  path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended : true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// Create the api object with the credentials
let spotifyApi = new SpotifyWebApi({
    clientId : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token.
spotifyApi.clientCredentialsGrant()
.then((data) => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
}, (err) => {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
    res.render('index');
});
  
app.get('/artists', (req, res) => {
    //Get search keyword
    let artist = req.query.artist;
    spotifyApi
        .searchArtists(artist)
            .then(data => {
                let artists = data.body.artists.items;
                res.render('artists', { artists, artist });  
            })
            .catch(err => {
                console.log('The error while searching artists occurred: ', err);
            });
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
            .then(data => {
                console.log('The received data from the API: ', data.body);
                let albums = data.body.items;
                res.render('albums', { albums });
            })
            .catch(err => {
                console.log('The error while searching artists occurred: ', err);
            });
});

app.get('/tracks/:trackId', (req, res) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
            .then(data => {
                console.log('The received data from the API: ', data.body);
                let tracks = data.body.items;
                res.render('tracks', { tracks });
            })
            .catch(err => {
                console.log('The error while searching artists occurred: ', err);
            });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening in port 3000');
});