//-----------------------------------------------------------------------------------
// index.js for Google Cloud Vision API
//-----------------------------------------------------------------------------------
"use strict";

const path = require("path");
const express = require("express"); 
const app = express();
const port = (process.env.PORT || 5000);
const Language = require('@google-cloud/language');
const Promise = require('promise');
const exphbs = require('express-handlebars')

app.engine('.hbs', exphbs({  
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  //the following helper allows us to pass an object into a handlebars variable
  helpers: { json: function (context) { return JSON.stringify(context);}}
}))
app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views')) 


//-----------------------------------------------------------------------------------
// Server listens on port 5000
//-----------------------------------------------------------------------------------
app.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err)
  }
  console.log(`server is listening on ${port}`)
})

// Setup public directory
app.use(express.static(__dirname + '/public'));


//-----------------------------------------------------------------------------------
// Gcloud Testing: Natural Language
//-----------------------------------------------------------------------------------

// Instantiates a client
const language = Language.v1beta2({
  projectId: ,//insert your project ID
  keyFilename: //insert your project json data
});

//this will later be passed dynamically into our analyzer
const text = "insert your text that you want analyzed here";

//initializes sentiment analysis by passing through text
const analyze = function(text){
	console.log("Entering Analyze");
	const promise = new Promise(function(resolve,reject){
		var data = {
			document: {
		  		'content': text,
		  		type: 'PLAIN_TEXT'
		  	}
		}
		if(text != null){
			resolve(data)
		}
		else{
			reject("REJECTED: Failed to analyze, please enter a valid, non-null string");
		}
	})
	return promise;
}

//gets sentiment of document and sentences
const getSentiment = function(data){
	console.log("Entering getSentiment");
	const promise = new Promise(function(resolve,reject){
		// Detects the sentiment of the document
		language.analyzeSentiment({ document: data.document })
		  .then((results) => {

		  	// document sentiment added to data object
			const sentiment = results[0].documentSentiment;
		    data.sentiment = sentiment;

		    // all sentences text and sentiment are added to data object
		    const sentences = results[0].sentences;
		    data.sentences = sentences;
		    resolve(data);
		    // console.log("\n\nSENTENCES IN DATA: " , data.sentences);

		    // print statements for testing
		    // sentences.forEach((sentence) => {
		    //   console.log(`Sentence: ${sentence.text.content}`);
		    //   console.log(`  Score: ${sentence.sentiment.score}`);
		    //   console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
		    // });
		}).catch(function(err) {
		    console.error(err);
		    reject("REJECTED AT GET SENTIMENT");
		});
	});
	return promise;
}

//gets entities and their sentiments
const getEntitySentiment = function(data){
	console.log("Entering getEntitySentiment");
	const promise = new Promise(function(resolve,reject){
		language.analyzeEntitySentiment({ document: data.document }).then(function(responses) {
		var response = responses[0];
		data.entities = response.entities;

		// console.log("\n\nENTITIES IN DATA: " , data.entities);
		// console.log("\n\nDATA " , data);
		resolve(data);
		}).catch(function(err) {
		    console.error(err);
		    reject("REJECTED AT GETENTITYSENTIMENT");
		});
	});
	return promise;
}



//increments entities and their sentiment ratings to a Redis database for easy access
const formatData = function(data){
	console.log("Entering formatData");
	const promise = new Promise(function(resolve,reject){

		var newData = {};
		data.entities.forEach(function(entity, index){

			//only include entities that have positive or negative sentiment
			if(entity.sentiment.score != 0){

				var name = entity.name;
				var sentiment = entity.sentiment.score;

				//if this entity is not already an object in newData
				if(!(name in newData)){
					var newEntity = { frequency: 0, 
									positive: 0,
									negative: 0,
									};
					newData[name] = newEntity; //referencing objects using variables require brackets
					// console.log("New data created " , newData, "\n\n");
				}

				//increments positive or negative depending on sentiment. sentiments of 0 are ignored
				if(sentiment > 0){
					newData[name].frequency += 1;
					newData[name].positive +=1;
				}
				else if(sentiment < 0){
					newData[name].frequency += 1;
					newData[name].negative +=1;
				}
				// console.log("current newdata: " , newData);
			}

			if(index == (data.entities.length -1)){
				data.totals = newData;
				// console.log("ADDED TOTAL DATA IS: \n" , data.totals);
				console.log(data);
				resolve(data.totals);
			}
		});
	});
	return promise;
}


//send data to frontend such that d3.js can use
const sendData = function(data){
	console.log("Entering sendData");
	app.get('/', (request, response) => {  
	  response.render('home', {
	    d3data: data
	  })
	})
}

analyze(text)
	.then(getSentiment)
	.then(getEntitySentiment)
	.then(formatData)
	.then(sendData)
	.catch(error=>cb(null,error));


