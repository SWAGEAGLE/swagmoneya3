window.newS=true;
function toggleLogin(setup,start){
	$(document).ready(
    	$('#log').click(function(e){
            if (logValidate() != false){
	        	e.preventDefault();	
	        	username = $('#uname').val();
	        	pass = $('#psw').val();
	        	score();
	        	profile(username,pass,setup,start);
	        	login(username,pass,setup,start);
	        	logout();
	        	
			}
		}))	
	//FROM THE FROM FRONTPAGE TO REGISTER
   	 $(document).ready(
    	$('#reg').click(function(e){
    		showHideLog(setup,start);
        	e.preventDefault();
        	$('#login').hide()
        	$('#register').show()

    }))

}

// show/hide login at registration page
function showHideLog(setup,start){
	// go back to login (back button)
	$(document).ready(
    	$('#backLog').click(function(e){
        	e.preventDefault();
        	$('#register').hide()
        	$('#login').show()
    }))

    // go to game (next button)
    $(document).ready(
    	$('#toGame').click(function(e){
        	e.preventDefault();
            if (regValidate() != false){
	        	//new
	        	registerRequest(); 
	            $('#register').hide()
	            $('#game').show();
	            profile($('#usernameREG').val(),$('#passwdREG').val(),setup,start);
	            getUsers();
	        }
    }))
}

function getUsers(){

}
function login(user,pass,setup,start){
	$.getJSON("/login", {user: user, pass:pass},function(data){
		try{
			$('#welcomeLog').text('Welcome, '+data[0].username);
		    $('#login').hide();
		    gameStart(user);
		    getUsers();

		    $('#game').show();
		}
		catch(err){
			alert('Invalid username/password');
		}
		
    })

}

function logValidate(){
	if ($('#uname').val()== ""){
		alert( "Please provide your username!" );
        $('#uname').focus();
        return false;
	}

	if (document.logForm.psw.value == ""){
		alert( "Please provide your password!" );
        document.logForm.psw.focus() ;
        return false;
	}
}
function regValidate(){

	if ($('#fnameREG').val() == ""){
		alert( "Please provide your first name!" );
        $('#fnameREG').focus() ;
        return false;
	}

	if ($('#lnameREG').val() == ""){
		alert( "Please provide your last name!" );
        $('#lname').focus() ;
        return false;
	}

	if ($('#usernameREG').val() == ""){
		alert( "Please provide your username!" );
        $('#usernameREG').focus() ;
        return false;
	}

	if ($("#passwdREG").val() == ""){
		alert( "Please provide your password!" );
        $("#passwdREG").focus() ;
        return false;
	}

	if ($("#emailREG").val() == ""){
		alert( "Please provide your email!" );
        $("#emailREG").focus() ;
        return false;
	}

}

function profValidate(){
	if ($('#mfname').val() == ""){
		alert( "Please provide your first name!" );
        $('#mfname').focus() ;
        return false;
	}

	if ($('#mlname').val() == ""){
		alert( "Please provide your last name!" );
        $('#mlname').focus() ;
        return false;
	}

	if ($('#memail').val() == ""){
		alert( "Please provide your email!" );
        $('#memail').focus() ;
        return false;
	}
}

function registerRequest(){
	var params = {
	type: "POST", 
	url: "http://cslinux.utm.utoronto.ca:10430/insert", 
	data: { "fname": $("#fnameREG").val() , "lname" : $("#lnameREG").val(), "username" : $("#usernameREG").val(),
			"passwd" : $("#passwdREG").val(), "email" : $("#emailREG").val() } 
	};
	$.ajax(params);
	$('#welcomeLog').text('Welcome, '+$("#usernameREG").val());
	gameStart($("#usernameREG").val());
}


function profile(user,pass,setup,start){
	$(document).ready(
    	$('#profile').click(function(e){
        	e.preventDefault();
        	$('#game').hide();
        	$('#prof').show();
        	console.log("user: "+user+"pass: "+pass);
        	$.getJSON("/login", {user: user, pass:pass},function(data){
					document.getElementById('oldPasswd').value='';
					document.getElementById('newPasswd').value='';
        			document.getElementById('memail').value=data[0].email;
        	})
    }))

    // go back to game (back button)
	$(document).ready(
    	$('#backGame').click(function(e){
        	e.preventDefault();
        	$('#prof').hide();
        	$('#game').show();
    }))

    // go to game (next button)
    $(document).ready(
    	$('#toGame2').click(function(e){
        	e.preventDefault();
	        	if (profValidate()!= false){

		        	fname = $('#mfname').val();
		        	lname = $('#mlname').val();
		        	uname = user;
		        	opass = $('#oldPasswd').val();
			        npass = $('#newPasswd').val();
			        email = $('#memail').val();
			        profUpdate(uname,opass,npass,email, setup, start);
		        }
    }))
}

var startTime;
var seconds;
function display(date){
	// later record end time
    var endTime = new Date();

    // time difference in ms
    var timeDiff = endTime - date;

    // strip the miliseconds
    timeDiff /= 1000;

    // get seconds
    seconds = Math.round(timeDiff % 60);
    console.log("sec "+seconds);
    $("#score").text("SCORE: "+seconds);
    //setTimeout(display(date), 1000);
}
function score() {
	// for the example we start counting at Start
	startTime = new Date();
	//setInterval(display(),1000);
  	display();
}
function setScore(){
	var username = $('#uname').val();
	var params = { 
	method: "PUT", 
	url: "api/api.php", 
	data: {'score': seconds, 'usernameSCORE': username} 
	};
	$.ajax(params);
}


function profUpdate(user,oldpasswd,newpasswd,email,setup,start){
	var ret;
	$.getJSON("/login", {user: user, pass:oldpasswd},function(data){
		console.log(data[0]);
		try{

			if (oldpasswd==""){alert("Please enter old password"); return false;}
			if (newpasswd==""){alert("Please enter a new password"); return false;}
			if (email==""){alert("Please enter an email"); return false;}
			
			var params = { 
				method: "POST", 
				url: "http://cslinux.utm.utoronto.ca:10430/update", 
				data: {user: user, newpasswd: newpasswd, email: email}
			};
			ret=true;
			$.ajax(params);
			profile(username,newpasswd,setup,start);
		    $('#prof').hide();
        	$('#game').show();
		}
		catch(err){
			ret=false;
		}
		finally{
			
			return ret;
		}
		
    })
}

function setUp(width,height){
	console.log('in setUp');
	 // Create a table of blank images, give each image an ID so we can reference it later
    var s='<table class = "table">';
    // YOUR CODE GOES HERE
    s+="</table>";
    // Put it in the stageElementID (innerHTML)
    $('#'.concat('Stage')).append(s);
    for (var i = 0 ; i < width ; i++){
        $(".table").append("<tr></tr>");
    }
    for(var i = 0  ; i < width; i++){
        for(j = 0 ; j < height ; j++)
            $('.table tr').eq(i).append('<td class="game"> <img class = "autosize" src =""/></td>');
    }    
}

/****** RENDER CLASS **********/

function Render(){
    this.blankImageSrc=document.getElementById('blankImage').src;
    this.monsterImageSrc=document.getElementById('monsterImage').src;
    this.playerImageSrc=document.getElementById('playerImage').src;
    this.boxImageSrc=document.getElementById('boxImage').src;
    this.wallImageSrc=document.getElementById('wallImage').src;
    this.actors = [];
    this.players = [];
    this.currentUsers=[];
}

Render.prototype.draw = function(){
    for(var i = 2 ; i < 20 ; i++){
        for(var j = 2 ; j < 20 ; j++){
            this.setImage(i,j,"");
        }
    }
    for(var i  = 0 ; i < this.actors.length ; i++){
        var img;
        switch(this.actors[i].name){
            case 'wall':
                img = this.wallImageSrc;
                break;
            case 'monster':
                img = this.monsterImageSrc;
                break;
            case 'player':
                img = this.playerImageSrc;
                break
            case 'box':
                img = this.boxImageSrc;
                break;
        }
        this.setImage(this.actors[i].x,this.actors[i].y,img);
    }
    
}

Render.prototype.setImage=function(x, y, src){
    $('.table tr:eq('.concat(x-1,')',' td:eq(',y-1,') img')).attr('src',src);
}


function move(){}
	move.prototype.movement = function(direction){
    window.socket.send(JSON.stringify({move: direction, username: us}));
    window.rend.draw();
}

function gameStart(user){
	console.log('in gameStart');
	window.us=user;

	/*****CLIENT SOCKET CODE******/
	$(document).ready(function(){
	    window.socket = new WebSocket("ws://cslinux.utm.utoronto.ca:10432");
	    if (newS){
	    	setUp(20,20);
	    }
	    window.rend = new Render();
	    socket.onopen = function (event) {
	        console.log('connected to game server');
	        socket.send(JSON.stringify({ username: user, new: true}))
	    };
	    socket.onmessage = function(event){
	        var dat = JSON.parse(event.data);
	        if(dat.actors != null){
	            //console.log('received actors');
	            rend.actors = dat.actors;
	        } 
	        if (dat.users != null){
	        	rend.currentUsers=dat.users;
	        	for (i=0; i<rend.currentUsers.length;i++){
					var new1=document.getElementById('rightSide');
					new1.innerHTML+='<label><b>&nbsp;- '+rend.currentUsers[i]+'<b></label><br>';
				}
				socket.send(JSON.stringify({currentUsers:rend.currentUsers}))
	        }
	        rend.draw();
	        
	    }
	   document.onkeydown = function(e){
	   		socket.send(JSON.stringify({username: user, event:e.keyCode}));
	   }
	});
}

function logout(){
	$(document).ready(
    	$('#logout').click(function(e){
        	e.preventDefault();

        	$('#game').hide();
        	$('#login').show();
        	document.getElementById('uname').value='';
			document.getElementById('psw').value='';
			window.newS=false;
        }))
}


function setScores(){
	$.getJSON("/highscores", {},
	function(data){
		var table = document.getElementById("highscores");
		console.log(data);
		console.log(Object.keys(data).length);
		var i;
		for (i=0; i<data.length;i++){
			console.log("element: "+data[i].username);
		    var row = table.insertRow(i+1);
		    var cell1 = row.insertCell(0);
		    var cell2 = row.insertCell(1);
		    cell1.innerHTML = data[i].username;
		    cell2.innerHTML = data[i].score;
		}
    })
}


/*
function challenge(user){
	$(document).ready(
    	$('#sendChal').click(function(e){
    		e.preventDefault();
    		//var dataobj={challenger: user, opponent: $("#chal").val()};
    		var params = { 
					method: "PUT", 
					url: "api/api.php", 
					data: {challenger: user, opponent: $("#chal").val()}
				};

			$.ajax(params).done(alert("hi"));
    	}))
}

function requests(user){
	$.getJSON("api/api.php", {user: user},
		function(data){
			var i;
			for (i=0; i<data.length;i++){
				var new1=document.getElementById('rightSide');
				new1.innerHTML+='<label>USERNAME: '+data[i][0]+" SCORE:"+data[i][1]+'</label><br>';
				new1.innerHTML+='<button type="submit" id="'+data[i][0]+i+'">Accept</button>';
				new1.innerHTML+='<button type="submit" id="decline">Decline</button>';
			}	
		})
}

function logout(){
	$(document).ready(
    	$('#logout').click(function(e){
        	e.preventDefault();
        	$('#game').hide();
        	$('#login').show();
        	document.getElementById('uname').value='';
			document.getElementById('psw').value='';
        }))
}*/
