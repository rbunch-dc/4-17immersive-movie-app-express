var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config')

console.log(config);

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+config.apiKey
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';


/* GET home page. */
router.get('/', function(req, res, next) {
	request.get(nowPlayingUrl,(error,response,movieData)=>{
		var movieData = JSON.parse(movieData);
		console.log(movieData)
		res.render('index', { 
			movieData: movieData.results,
			imageBaseUrl: imageBaseUrl
		});
	});
});

// router.get('/search',(req, res)=>{
// 	res.send("The get search page");
// });

router.post('/search',(req, res)=>{
	// req.body is available because of the body-parser moduel.
	// body-parser module was installed when you created teh expressaapp
	// req.bdoy is where POSTED data will live.
	// res.json(req.body);
	var termUserSearchedFor = req.body.searchString;
	var searchUrl = apiBaseUrl + '/search/movie?query='+termUserSearchedFor+'&api_key='+config.apiKey;
	request.get(searchUrl,(error,response,movieData)=>{
		res.json(JSON.parse(movieData));
	});
	// res.send("The post search page");
});


module.exports = router;
