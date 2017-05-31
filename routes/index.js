var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config')

console.log(config);

/* GET home page. */
router.get('/', function(req, res, next) {
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
