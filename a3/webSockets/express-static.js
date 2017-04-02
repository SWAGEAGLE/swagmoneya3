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
app.listen(10435, function () {
  console.log('Example app listening on port 10433!');
});
// perform a clean wipe of the database
app.get('/new', function(req,res){
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').drop();
		db.collection('scores').drop();
		db.createCollection('appusers');
		db.createCollection('scores');
	})

	res.end('ok');
});

app.get('/login', function(req,res){
	user=req.query.user;
	pass=req.query.pass
	console.log("in /login: "+user);
	MongoClient.connect(url, function(err,db){
		db.collection('appusers').find({username:user, passwd:pass},{username:1,passwd:1, fname:1, lname:1, email:1}).toArray(function (err, docs) {
	       // db.close();

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
app.post('/register', function(req,res){
	console.log('register');

});
// for now, the login submit button triggers this
app.post('/insert', function(req, res, next) {
	console.log('hi');
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

app.post('/update', function(req, res, next) {

	var item={
	    passwd : req.body.newpasswd, 
	    email : req.body.email
	};

  	MongoClient.connect(url, function(err, db) {
	    //assert.equal(null, err);
	    db.collection('appusers').update({'username': req.body.user}, {$set: item}, function(err, result) {
	      //assert.equal(null, err);
	      console.log('Item updated');
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
