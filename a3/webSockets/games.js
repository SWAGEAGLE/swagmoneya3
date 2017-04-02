
// Stage
// Note: Yet another way to declare a class, using .prototype.


//inheritance
Player.prototype = Actor.prototype;

//ACTOR CLASS
function Actor(name,x,y){
        this.x = x;
        this.y = y;
        this.name = name;
}


function Player(username,name,x,y){
    Actor.call(this,name,x,y);
    this.username = username;

}
//game world class
function GameWorld(){
    this.stage = new Stage(20,20) 
    this.stage.initialize();
}


function Stage(width, height){
    this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
    this.players={}; //  special actors, the players
    // the logical width and height of the stage
    this.width=width;
    this.height=height;
    // take a look at the value of these to understand why we capture them this way
    // an alternative would be to use 'new Image()'
}

Stage.prototype.initialize=function(){
    // Add walls around the outside of the stage, so actors can't leave the stage
    for (var i = 1 ; i <= this.height ; i++){
        var w1 = 
            {
            name: 'wall',
            x : 1,
            y: i
            };
        this.addActor(w1);
        var w2 = 
            {
            name: 'wall',
            x : this.width,
            y: i
            };
        this.addActor(w2)
    }
        

    for (var i = 1 ; i <= this.width ; i++){
        var w1 =
            new Actor('wall',i,1);

        var w2 = new Actor('wall',i,this.height);
        this.addActor(w1);
        this.addActor(w2)
    }

    // Add some Boxes to the stage
    // Add in some Monsters
    for (var i = 2; i < this.width ; i++){
        for (var j = 2 ; j < this.height; j++){
            if(j % 7 == 0 && i % 6 == 0){
                var m = 
                    new Actor('monster',i,j);
                    
                this.addActor(m);
            }
        }
    }
    //FIRST SET OF BOXES
    for (var i = 2; i < this.width ; i++){
            for (var j = 2 ; j < this.height; j++){
                if(j % 2== 0&& (i < 7 || i> 15) && this.getActor(i,j) == null) {
                    var m = 
                        new Actor('box',i,j);
                    this.addActor(m);
                }
            }
    }    
}

// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){ return ""; }

Stage.prototype.addActor=function(actor){
    this.actors.push(actor);
}

Stage.prototype.addPlayer = function(username){
    var x;
    var y;
    for (var i = 0; i < this.width ; i++){
            for (var j = 0 ; j < this.height; j++){
                if(this.getActor(i,j) == null){
                    x = i;
                    y = j;                  
                }      
            }
                
    }  
    var player = new Player(username,'player',x,y);
    console.log(username);
    this.players[username] = player;
    console.log(this.players[username]);
    this.actors.push(player);
}

Stage.prototype.removeActor=function(actor){
    // Lookup javascript array manipulation (indexOf and splice).
    this.actors.splice(this.actors.indexOf(actor),1);
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
    
    $('.table tr:eq('.concat(x-1,')',' td:eq(',y-1,') img')).attr('src',src);
}
Stage.prototype.randNum=function(){
    return Math.floor(Math.random() * (5 - 1) + 1);
}
// Take one step in the animation of the game.  
Stage.prototype.step=function(){
    //MONSTERS MOVE AT RANDOM AND AROUND BOXES
    //number of monsters, check to see if you killed all of them
    let monstercounter = 0;
    for(var i=0;i<this.actors.length;i++){
        var actor = this.actors[i];
        if(actor.name ==  "monster"){
            monstercounter++;
            let canstill = ['N','W','E','S','NE','NW','SE','SW'];
            let movement;
            while(true){
                if(canstill.length == 0){
                    this.removeActor(actor);
                    break;
                }
                let move = Math.floor((Math.random() * canstill.length));
                let direction = canstill[move];
                let flag = false;
                switch(direction){
                    case 'N':
                         if((movement = this.monstermove(actor,1,0)) == true){
                            flag = true;
                            break;
                         }
                         if((movement == "GAME OVER")){
                            return false;
                         }
                         else{
                            canstill.splice(move,1);
                            break
                         }

                    case 'E':
                        if((movement = this.monstermove(actor,0,1)) == true){
                            flag = true;
                            break;
                        }
                         if((movement == "GAME OVER")){
                            return false;
                        }
                         else{
                            canstill.splice(move,1);
                            break;
                         }

                    case 'S':
                        if((movement = this.monstermove(actor,-1,0)) == true){
                            flag = true;
                            break;
                        }
                         if((movement == "GAME OVER")){
                            return false;
                        }
                         else{
                            canstill.splice(move,1);
                            break;
                         }
                    case 'W':
                        if((movement = this.monstermove(actor,0,-1)) == true){
                            flag = true;
                            break;
                        }
                         if((movement == "GAME OVER")){
                            return false;
                        }
                         else{
                            canstill.splice(move,1);
                            break;
                         }
                    case 'NE':
                        if((movement = this.monstermove(actor,1,1)) == true){
                            flag = true;
                            break;
                         }
                         if((movement == "GAME OVER")){
                            return false;
                         }
                         else{
                            canstill.splice(move,1);
                            break;
                         }
                    case 'NW':
                        if((movement = this.monstermove(actor,1,-1)) == true){
                            flag = true;
                            break;
                         }
                         if((movement == "GAME OVER")){
                            return false;
                         }
                         else{
                            canstill.splice(move,1);
                            break;
                         }
                    case 'SE':
                        if((movement = this.monstermove(actor,-1,1)) == true){
                            flag = true;
                            break;
                         }
                         if((movement == "GAME OVER")){
                            return false;
                         }
                         else{
                            canstill.splice(move,1);
                            break;
                         }
                    case 'SW':
                        if((movement = this.monstermove(actor,-1,-1)) == true){
                            flag = true;
                            break;
                        }
                         if((movement == "GAME OVER")){
                            return false;
                         }
                         else{
                            canstill.splice(move,1);
                            break;
                         }
                }
                if(flag)
                    break;


            }
        }
    }
    if(monstercounter == 0)
        return false;
    return true;
    
}

Stage.prototype.monstermove = function(actor,x,y){
    var adjacent = this.getActor(actor.x + x,actor.y + y);
    if(adjacent == null){
        this.move(actor,x,y);
        return true;
    }

    if(adjacent.name == 'player'){
            this.move(actor,x,y);
            return "GAME OVER";
    }
    //if(adjacent.name == 'monster')
    //  if(this.monstermove(adjacent,x,y)){
        //  this.move(actor,x,y,this.monsterImageSrc);
        //  return true;
    //  }
    return false;
    
}



// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
    for(var i = 0; i < this.actors.length ; i++){
        if(this.actors[i].x == x && this.actors[i].y == y)
            return this.actors[i];
    }
    return null;
}

Stage.prototype.movebox = function(box,x,y){
      var newBox = this.getActor(box.x + x, box.y + y); 
      if(newBox== null){
        box.x += x;
        box.y += y;
        return true;
      }
      if(newBox.name == 'monster' || newBox.name == 'wall')
        return false;
      if(this.movebox(newBox,x,y)){
        box.x += x;
        box.y += y;
        return true;
      }
      return false;



}

Stage.prototype.move = function(actor,x,y){
    actor.x += x;
    actor.y += y;
}

Stage.prototype.playeraction = function(player,direction){
    switch(direction){
        case 'N':
            var actor = this.getActor(player.x - 1,player.y);
            if(actor == null)
                this.move(player,-1,0);    
            else if(actor.name == 'box')
                if(this.movebox(actor,-1,0))
                    this.move(player,-1,0);
            break;
        case 'E':
            var actor = this.getActor(player.x,player.y + 1);
            if(actor == null) //case free panel
                this.move(player,0,1);
            else if(actor.name == 'box')
                if(this.movebox(actor,0,1))
                    this.move(player,0,1);
            break;
        case 'S':
            var actor = this.getActor(player.x + 1,player.y);
            if(actor == null)
                this.move(player,1,0);
            else if(actor.name == 'box')
                if(this.movebox(actor,1,0))
                    this.move(player,1,0);
            break;
        case 'W':
            var actor = this.getActor(player.x ,player.y - 1);
            if(actor == null)
                this.move(player,0,-1);
            else if(actor.name == 'box')
                if(this.movebox(actor,0,-1))
                    this.move(player,0,-1);
            break;
        case 'NE':  
            var actor = this.getActor(player.x - 1,player.y + 1);
            if(actor == null)
                this.move(player,-1,1);
            break;
        case 'NW':
            var actor = this.getActor(player.x - 1,player.y - 1);
            if(actor == null) //case free panel
                this.move(player,-1,-1);
            break;

        case 'SE':
            var actor = this.getActor(player.x + 1,player.y + 1);
            if(actor == null) //case free panel
                this.move(player,1,1);     
            break;

        case 'SW':
            var actor = this.getActor(player.x + 1,player.y - 1);
            if(actor == null)
                this.move(player,1,-1);    
            break;

    }


    


}

//not working (keyboard navigation..trying to implement so that we don't have repeating code)
Stage.prototype.keysaction=function (e,player) {
    e = e || window.event;
    switch(e.keyCode){
        case 68:
            this.playeraction(player,'W');
            break;
        case 87:
            this.playeraction(player,'N');
            break;
        case 65:
            this.playeraction(player,'E');
            break;
        case 88:
            this.playeraction(player,'S');
            break;
        case 81:
            this.playeraction(player,'NW');
            break;
        case 69:
            this.playeraction(player,'NE');
            break;
        case 90:
            this.playeraction(player,'SW');
            break;
        case 67:
            this.playeraction(player,'SE');
            break;        
    }


}

// End Class Stage

/********************************GAME SERVER*********************************************************************************/
var WebSocketServer = require('ws').Server;
var server = new WebSocketServer({port: 10436});
var gameworld = new GameWorld();
/*
gameworld.server.on('close', function() {
    console.log('disconnected');
});
*/
server.on('connection', function(ws){
    console.log('new player request');
    ws.on('message',function(message){
        //console.log('did we make it');
        var parsed = JSON.parse(message);
        //console.log(message);
        if(parsed.new != null){
            console.log("in parsed: "+parsed.username);
            gameworld.stage.addPlayer(parsed.username);
            ws.send(JSON.stringify({actors: gameworld.stage.actors, players: gameworld.stage.players}));
            //console.log('game data sent');
        }else if(parsed.move != null){

            //console.log(gameworld.stage.players[parsed.username]);
            gameworld.stage.playeraction(gameworld.stage.players[parsed.username],parsed.move);
            ws.send(JSON.stringify({actors: gameworld.stage.actors}));
        }
    })

    setInterval(function(){
        gameworld.stage.step();
        ws.send(JSON.stringify({actors: gameworld.stage.actors, players: gameworld.stage.players}))
    },2000)
});
