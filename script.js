let main = document.querySelector("main");
let input = document.querySelector("input");
var prevP = document.querySelector("p");
var index = require("./index.js")
//confusion
var inventory = [];

var playerStats = {
  "health": 100,
  "defence": 0,
  "attack": 10,
  "location": null
}
var currentState = "idle";

function generateRandom(min, max) {
    let diff = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * diff);
    rand = rand + min;
    return rand;
}

class enemyClass {
  constructor(name, health, xp, atk, drops) {
    this.health = health;
    this.xp = xp;
    this.atk = atk;
    this.drops = drops;
  }
  generateDrops() {
    //drop table be like drops = {"bones":[0,3,85]}
    //0 to 3 bones and 85% chance of getting one of those
    //todo: append drops to a dictionary, like this drops = {"bones":3428, "amongus": 69348} and then return
    drops = {}
    for(var i = 0; i < Object.keys(this.drops).length; i++) {
      if(generateRandom(0, Object.keys(drops)[i][2]) <= Object.keys(drops)[i][2]) {
        drops[Object.keys(this.drops[i])] = generateRandom(Object.keys(drops)[i][0], Object.keys(drops)[i][1])
      }
    }
    return drops;
  }
  generateDmg() {
    //make randomness? 
    return Math.floor(generateRandom(0.8, 1) * (this.atk * 1000-playerStats.defence/1000))
  }
}

//create teh enemies
var croissant = new enemyClass(100, 1000, 10, {"croissant":[1,2, 100]})
//hey look it me


let rooms = {
  "Center Room": { items: ["imposter", "among us tablet"], exits: { west: "West Room", east: "East Room", north: "North Room", south: "South Room" }, description: "The center of the dungeon. Lit only by the glowing wisps swirling above. Uncannily peaceful.", monsters:{"croissant":[croissant,100]}, name:"Center Room" },
  "West Room": { items: ["sus potion"], exits: { east: "Center Room" }, description: "big among us gamer", name:"West Room" },
  "East Room": { items: ["clash of clans"], exits: { west: "Center Room" }, description: "omg!!! clash of clans tablet!!!", name:"East Room" }, 
  "North Room": { items: ["fruit tycoon"], exits:{south: "Center Room"}, description:"fruit tycoon room pog", name:"North Room"}, 
  "South Room": {items: ["your dad"], exits:{north: "Center Room"}, description: "grocery store long lost to time- just like your dad", name:"South Room"}
};

playerStats["location"] = rooms["Center Room"];

function splitText(text) {
  words = text.split(" ");
  verb = words.shift();
  noun = words.join(" ");
  return [verb, noun];
  //var noun = text[0:firstSpace]

}

function getCommand(text) {
  words = splitText(text);
  didMove = false;
  words = [words[0].toLowerCase(), words[1].toLowerCase()];
  lowerText = text.toLowerCase();
  if (words[1] == "") {
    if (lowerText == "describe") {
      describe();
      return;
    }
    if(lowerText == "inventory") {
      print(inventory);
      return;
    }
    if (lowerText == "east" && playerStats["location"]["exits"]["east"] != null) {
      playerStats["location"] = rooms[playerStats["location"]["exits"]["east"]];
      describe();
      didMove = true;
    } else if (lowerText == "west" && playerStats["location"]["exits"]["west"] != null) {
      playerStats["location"] = rooms[playerStats["location"]["exits"]["west"]];
      describe();
      didMove = true;
    } else if (lowerText == "north" && playerStats["location"]["exits"]["north"] != null) {
      playerStats["location"] = rooms[playerStats["location"]["exits"]["north"]];
      describe();
      didMove = true;
    } else if (lowerText == "south" && playerStats["location"]["exits"]["south"] != null) {
      playerStats["location"] = rooms[playerStats["location"]["exits"]["south"]];
      describe();
      didMove = true;
    } else if (["south", "west", "north", "east"].includes(lowerText)) {
      print("You can't go in that direction!")
      return;
    }
    if(didMove == true) {
      //assumes that the monster rates are listed from GREATEST TO LEAST
      randInt = generateRandom(0, 100);
      for(var i = 0; i < Object.keys(playerStats["location"].monsters).length; i++) {
        if(randInt <= playerStats["location"].monsters[i][2]) {
          //make monster appear and initiate fight
          didMove = false;
          return;
        }
      }
    }
    if (lowerText == "help") {
      print("The commands are: <br> 'describe', which describes the room you are currently in <br> 'inventory', which tells you what's in your inventory <br> and 'east','west','south','north' to control where you want to go <br>")
    }
  } else {
    if(words[0] == "take") {
      for(i = 0; i < playerStats["location"]["items"].length; i++) {
        if(playerStats["location"]["items"][i] == words[1]) {
          inventory.push(playerStats["location"]["items"][i]);
          print("You have taken the " + playerStats["location"]["items"][i]);
          console.log(inventory);
          //wtf is this lmao
          rooms[playerStats["location"].name].items.splice(i, 1);
          return;
        }
      }
      print("That item isn't in your room!")
      return;
      
    }
  }

  print("That isn't a command! Type 'help' for a list of commands.")
}



function describe() {
  console.log(playerStats)
  print(playerStats["location"]["description"] + "\n")
  itemTxt = "";
  exitTxt = "";
  for(var i = playerStats["location"].items.length-1; i >= 0; i--) {
    prefix = ""
    if(["a", "e", "i", "o","u"].includes(playerStats["location"].items[i][0])) {
      prefix = "an "
    } else {
      prefix = "a "
    }
    if(i == 0 && playerStats["location"].items.length > 1) {
      itemTxt += "and " + prefix + playerStats["location"].items[i];
    } else if(playerStats["location"].items.length > 2) {
      itemTxt += prefix + playerStats["location"].items[i] + ", ";
    } else {
      itemTxt += prefix + playerStats["location"].items[i] + " ";
    }
  } 
  print("There is " + itemTxt + " in the room.");
  for(var i = Object.keys(playerStats["location"].exits).length-1; i >= 0; i--) {
    if(i == 0 && Object.keys(playerStats["location"].exits).length > 1) {
      exitTxt += " and an exit to the " + Object.keys(playerStats["location"].exits)[i]
    } else if(Object.keys(playerStats["location"].exits).length > 2){
      exitTxt += "  an exit to the " + Object.keys(playerStats["location"].exits)[i] + ","
    } else {
      exitTxt += "  an exit to the " + Object.keys(playerStats["location"].exits)[i]
    }
  }
  print("There is " + exitTxt + " here. <br><br>")
}

function print(text) {
  //big iq moment?!?!? i actually did somethign!?!?!?
  var p = document.createElement("p");
  p.innerHTML = text;
  //prevP.before(p);
  //prevP = p;
  p.style.fontFamily = "monospace";
  input.before(p);
  //prevP.style.fontFamily = "monospace";
  input.scrollIntoView();
}


function getInput(evt) {
  if (evt.code === "Enter" && currentState == "idle") {
    let text = input.value;
    input.value = "";
    //print(text);
    getCommand(text)
  }
}

input.addEventListener("keyup", getInput, false);
console.log(splitText("among"))