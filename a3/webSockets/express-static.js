/* What about serving up static content, kind of like apache? */

var express = require('express');
//var tools = require('./new');
var app = express();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://kathmuha:10556@mcsdb.utm.utoronto.ca/kathmuha_309';

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
app.use('/',express.static('static_files')); // this directory has files to be returned
app.listen(10430, function () {
  console.log('Example app listening on port 10433!');
});
// perform a clean wipe of the database
app.get('/new', function(req,res){
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').remove({});
		db.collection('scores').remove({});
		db.createCollection('appusers');
		db.createCollection('scores');
	})

	res.end('ok');
});

app.get('/login', function(req,res){
	user=req.query.user;
	pass=req.query.pass
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').find({username:user, passwd:pass},{username:1,passwd:1, fname:1, lname:1, email:1}).toArray(function (err, docs) {
	        db.close();

	        if (err) {
	            console.log('Error');
	            console.log(err);
	            res.end();
	        }
	        else {
	            console.log('Success');
	            console.log(docs);
	           	res.send(docs);
	        }
	    });
	})
});

app.get('/insertScore',function(req,res){
	var item = {
	  	_id : "kevinID",
	    username : "kevin",
	    score: "100"
  	};

	MongoClient.connect(url, function(err,db){
		db.collection('scores').insert(item, function(err, result){
			console.log('scores insert');
			console.log(item);
		});

	});
});
app.get('/highscores',function(req,res){

	MongoClient.connect(url, function(err,db){
		db.collection('scores').find({}).sort({score:1}).toArray(function (err, docs) {
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

	        db.close();
	    });
	})
});
app.post('/register', function(req,res){
	console.log('register');

});
// for now, the login submit button triggers this
app.post('/insert', function(req, res, next) {
	var item = {
	  	_id : req.body.username,
	    fname: req.body.fname ,
	    lname : req.body.lname,
	    username : req.body.username,
	    passwd : req.body.passwd, 
	    email : req.body.email
  	};

  	MongoClient.connect(url, function(err, db) {
    	//assert.equal(null, err);
    	db.collection('appusers').insert(item, function(err, result) {
      	//assert.equal(null, err);
      	console.log('Item inserted');
      	db.close();
    	});
  	});

});
/*
app.get('/currentUsers',function(req,res){

	MongoClient.connect(url, function(err,db){
		db.collection('currentUsers').find({}).toArray(function (err, docs) {
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

	        db.close();

		});
	});
});
app.post('/deleteCurrentUser', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
	    db.collection('currentUsers').remove({ username: req.body.username}, function(err, result) {
	      console.log('user deleted');
	      db.close();
    	});
	});

});
app.post('/insertCurrentUser', function(req, res, next) {
	var item={
		_id : req.body.username,
		username : req.body.username
	}

	MongoClient.connect(url, function(err, db) {
	    db.collection('currentUsers').insert(item, function(err, result) {
	      console.log('user inserted');
	      db.close();
    	});
	});

});
*/
app.post('/update', function(req, res, next) {

	var item={
	    passwd : req.body.newpasswd, 
	    email : req.body.email
	};

  	MongoClient.connect(url, function(err, db) {
	    db.collection('appusers').update({'username': req.body.user}, {$set: item}, function(err, result) {
	      console.log('Item updated');
	      db.close();
    	});
	});

});
// list all the users in appusers
app.get('/listUsers', function(req,res){
	
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
