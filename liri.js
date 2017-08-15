const fs = require("fs");
const inq = require("inquirer");
const spt = require("spotify");
const req = require("request");
const spot = require('node-spotify-api');
const twit = require('twitter');
const keys = require('./keys.js')
const spotify = new spot(keys.spot);

var twitUser = new twit(keys.twitterKeys);
var sN = {screen_name: 'SamC78059246'};

inq.prompt([
	{
		type: "list",
		name: "qType",
		message: "Please choose one of the following query types:",
		choices: [
			'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'
		]	
	}
]).then(function(reply) {

	if(reply.qType == "my-tweets") {

		var twitUser = new twit(keys.twitterKeys);
		var sN = {screen_name: 'SamC78059246'};

		twitUser.get('statuses/user_timeline', sN, function(error, tweets, response) {
			if(!error) {
				for(var i =0; i < tweets.length; i++) {
					console.log(' ');
					console.log(tweets[i].created_at);
					console.log(tweets[i].text);
				}
			};
		});

	} else if(reply.qType == "spotify-this-song") {

		inq.prompt([
			{
				name: "song",
				message: "What song would you like to search for?"
			}
		]).then(function(reply2) {

			spotify.search({type: 'track', query: reply2.song}, function(e, data) {
				if(e) {
					console.log("LIRI has encountered " + e);
					return;
				}

				if(data) {

					let songData = data;

					console.log("Artist: " + songData.tracks.items[0].album.artists[0].name);
					console.log("Album Name: " + songData.tracks.items[0].album.name);

				};

			});

		});

	} else if(reply.qType == "movie-this") {

		inq.prompt([

			{
				name: "mName",
				message: "\nWhat movie would you like to get info on?\n\n"
			}

		]).then(function(reply2) {

			let movie = reply2.mName.trim();

			if(movie == "") {

				req("http://www.omdbapi.com/?t=mr+nobody&apikey=40e9cece" ,function(error, response, body) {

					console.log("\nTitle: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Released + "\nRating: " + JSON.parse(body).Rated + "\nCountry: " + JSON.parse(body).Country 
								+ "\nLanguage: " + JSON.parse(body).Language + "\nActors: " + JSON.parse(body).Actors + "\nPlot Summary: " + JSON.parse(body).Plot);

				})


			} else {

				req("http://www.omdbapi.com/?t="+movie+"&apikey=40e9cece", function(error, response, body) {

					console.log("\nTitle: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Released + "\nRating: " + JSON.parse(body).Rated + "\nCountry: " + JSON.parse(body).Country 
								+ "\nLanguage: " + JSON.parse(body).Language + "\nActors: " + JSON.parse(body).Actors + "\nPlot Summary: " + JSON.parse(body).Plot);

				})

			}

		});


	} else {

		fs.readFile('random.txt', "utf8", function(e, data) {

			let song = data;

			if(e) console.log("LIRI has encountered the " + e + " error");

			spotify.search({type: 'track', query: song}, function(e, data) {

				if(e) {

					console.log("LIRI has encountered " + e);

				return;
				}

				if(data) {

					let songData = data;

					console.log("Artist: " + songData.tracks.items[0].album.artists[0].name);
					console.log("Album Name: " + songData.tracks.items[0].album.name);

				};

			});

		});

	};

});