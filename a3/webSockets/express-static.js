/* What about serving up static content, kind of like apache? */

var express = require('express');
var app = express();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://kathmuha:10556@mcsdb.utm.utoronto.ca/kathmuha_309';

// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
app.use('/',express.static('static_files')); // this directory has files to be returned

app.listen(10435, function () {
  console.log('Example app listening on port 10433!');
});

// perform a clean wipe of the database
app.get('/new', function(req,res){
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').drop();
		//db.collection('scores').drop();
		db.createCollection('appusers');
		db.createCollection('scores');
	})

	res.end('ok');
});

// for now, the login submit button triggers this
app.post('/insert', function(req, res, next) {
  var item = {
    name : "kevin",
    email : "kevin@example.com"
  };
  console.log(item.name);
  MongoClient.connect(url, function(err, db) {
    //assert.equal(null, err);
    db.collection('appusers').insert(item, function(err, result) {
      //assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });

});

// list all the users in appusers
app.get('/listUsers', function(req,res){
	console.log('yaaaa');
	
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').find({}).toArray(function (err, docs) {
	       // db.close();

	        if (err) {
	            console.log('Error');
	            console.log(err);
	            res.end();
	        }
	        else {
	            console.log('Success');
	            console.log(docs);
	           	res.json(docs);
	        }
	    });
	})
	//res.end('yaaaa');
});
