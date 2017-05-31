var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	const apiKey = 'fec8b5ab27b292a68294261bb21b04a5';
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey
	const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

	request.get(nowPlayingUrl,(error,response,movieData)=>{
		var movieData = JSON.parse(movieData);
		console.log(movieData)
		res.render('index', { 
			movieData: movieData.results,
			imageBaseUrl: imageBaseUrl
		});
	});

  
});

module.exports = router;
