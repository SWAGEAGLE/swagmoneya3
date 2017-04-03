/* What about serving up static content, kind of like apache? */
// sorry no script, gonna have to go through for credientials
var express = require('express');
//var tools = require('./new');
var app = express();

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

var url = 'mongodb://kathmuha:10556@mcsdb.utm.utoronto.ca/kathmuha_309');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// static_files has all of statically returned content
// https://expressjs.com/en/starter/static-files.html
app.use('/',express.static('static_files')); // this directory has files to be returned
app.listen(10430, function () {
  console.log('Example app listening on port 10433!');
});
// perform a clean wipe of the database for testing purposes
app.get('/new', function(req,res){
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').remove({});
		db.collection('scores').remove({});
		db.createCollection('appusers');
		db.createCollection('scores');
	})

});

app.get('/login', function(req,res){
	user=req.query.user;
	pass=req.query.pass;
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').find({username:user, passwd:pass},{username:1,passwd:1, fname:1, lname:1, email:1}).toArray(function (err, docs) {
	        db.close();

	        if (err) {
	            console.log('Error');
	            console.log(err);
	            res.status(403).end();
	        }
	        else {
	            console.log('Success');
	            console.log(docs);
	           	res.status(200).send(docs);
	        }
	    });
	})
});

app.post('/insertScore',function(req,res){
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
	res.status(201).send();
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
// for now, the login submit button triggers this
app.post('/insert', function(req, res, next) {
	// validation
	var regExp = /^[A-Za-z0-9]+$/;
	if(req.body.username.match(regExp)==null){return res.status(400).send()}
	if(req.body.passwd.match(regExp)==null){return res.status(400).send()}


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
  	res.status(201).send();

});

app.post('/update', function(req, res, next) {
	//validation 
	if(req.body.passwd.match(regExp)==null){return res.status(400).send()}
	if(req.body.email.match(regExp)==null){return res.status(400).send()}
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
  	res.status(202).send();
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
