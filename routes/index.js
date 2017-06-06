var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config')

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: config.sql.host,
	user: config.sql.user,
	password: config.sql.password,
	database: config.sql.database
});

connection.connect();

console.log(config);

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+config.apiKey
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';


/* GET home page. */
router.get('/', function(req, res, next) {
	request.get(nowPlayingUrl,(error,response,movieData)=>{
		var movieData = JSON.parse(movieData);
		// console.log(movieData)r
		console.log("===================");
		console.log(req.session);
		console.log("===================");
		res.render('movie_list', { 
			movieData: movieData.results,
			imageBaseUrl: imageBaseUrl,
			titleHeader: "Welcome to my movie app. These are now playing..."
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
		// res.json(JSON.parse(movieData));
		var movieData = JSON.parse(movieData);
		res.render('movie_list', { 
			movieData: movieData.results,
			imageBaseUrl: imageBaseUrl,
			titleHeader: `You searched for ${termUserSearchedFor}. The results are... `
		});
	});
	// res.send("The post search page");
});

router.get('/movie/:id',(req, res)=>{
	// the route has a :id in it. A : means WILDCARD
	// a wildcard is ANYTHING in that slot.
	// all wildcards in routes are available in req.params
	var thisMovieId = req.params.id;
	// Build the URL per the API docs
	var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${config.apiKey}`;
	// Use the request module to make an HTTP get request
	request.get(thisMovieUrl, (error, response, movieData)=>{
		// parse the response into JSON
		var movieData = JSON.parse(movieData);
		// First arg: the view file.
		// Second param: obj to send the view file
		// res.json(movieData);
		res.render('single-movie',{
			movieData: movieData,
			imageBaseUrl: imageBaseUrl
		});
	});
	// res.send(req.params.id);
});

router.get('/register', (req, res)=>{
	// res.send("THis is teh register page.")
	var message = req.query.msg;
	if(message == "badEmail"){
		message = "This email is already registered";
	}
	res.render('register',{message: message});
});

router.post('/registerProcess', (req,res)=>{
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	var selectQuery = "SELECT * FROM users WHERE email = ?";
	connection.query(selectQuery,[email],(error, results)=>{
		if(results.length == 0 ){
			// User is not in the db. Insert them
			var insertQuery = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
			connection.query(insertQuery, [name,email,password], (error,results)=>{
				// Add session vars -- name, email, loggedin, id
				req.session.name = name;
				req.session.email = email;
				req.session.loggedin = true;
				res.redirect('/?msg=registered')
			});
		}else{
			// User is in the db. Send them back to register with a message
			res.redirect('/register?msg=badEmail');
		}

	});
	// res.json(req.body);
});

router.get('/login', (req, res)=>{
	// res.send("THis is teh login page.")
	res.render('login',{ });
});

module.exports = router;
