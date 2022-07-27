let main = document.querySelector("main");
let input = document.querySelector("input");
let prevP = document.createElement("p");
let docElements = [];
document.body.appendChild(prevP);
//let index = require("./index.js")
//confusion
let inventory = {};
let hunting;
let currentTurn = "player";

class moveClass {
  constructor(name, powr, type, energy, accuracy) {
    this.name = name;
    this.powr = powr;
    this.type = type;
    this.energy = energy;
    this.accuracy = accuracy;
  }

  generateDamage() {
    if (generateRandom(0, 1) < accuracy) {
      if (this.type == "magic") {
        return [Math.Floor(generateRandom(0.85, 1) * playerStats["m-attack"] * this.powr), energy]
      } else if (this.type == "physical") {
        return [Math.Floor(generateRandom(0.7, 1) * playerStats["attack"] * this.powr), energy]
      }
    } else {
      return ["miss", energy];
    }
  }
}

let stab = new moveClass("stab", 10, "physical", 5, 100);


let playerStats = {
  "health": 100,
  "defence": 0,
  "attack": 10,
  "m-attack": 5,
  "energy": 100,
  "location": null,
  "moves": [stab]
}
let currentState = "idle";

function generateRandom(min, max) {
  let diff = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * diff);
  rand = rand + min;
  return rand;
}

class enemyClass {
  constructor(name, health, xp, atk, drops) {
    this.name = name;
    this.health = health;
    this.xp = xp;
    this.atk = atk;
    this.drops = drops;
  }
  generateDrops() {
    //drop table be like drops = {"bones":[0,3,85]}
    //0 to 3 bones and 85% chance of getting one of those
    //todo: append drops to a dictionary, like this drops = {"bones":3428, "amongus": 69348} and then return
    let drops = {}
    for (var i = 0; i < Object.keys(this.drops).length; i++) {
      let randomint = generateRandom(0, 100);
      if (randomint <= this.drops[Object.keys(this.drops)[i]][2]) {
        drops[Object.keys(this.drops)[i]] = generateRandom(this.drops[Object.keys(this.drops)[i]][0], this.drops[Object.keys(this.drops)[i]][1] + 1);
      }

    }
    return drops;
  }
  generateDmg() {
    //make randomness? 
    return Math.floor(generateRandom(0.8, 1) * (this.atk * 1000 - playerStats.defence / 1000))
  }
}

//create teh enemies
let croissant = new enemyClass("croissant", 100, 1000, 10, { "croissant": [1, 2, 100] })
//hey look it me
hunting = croissant;
//croissant is a placeholder lol

let rooms = {
  "Center Room": { items: ["imposter", "among us tablet"], exits: { west: "West Room", east: "East Room", north: "North Room", south: "South Room" }, description: "The center of the dungeon. Lit only by the glowing wisps swirling above. Uncannily peaceful.", monsters: { "croissant": [croissant, 100] }, name: "Center Room" },
  "West Room": { items: ["sus potion"], exits: { east: "Center Room" }, description: "big among us gamer", name: "West Room" },
  "East Room": { items: ["clash of clans"], exits: { west: "Center Room" }, description: "omg!!! clash of clans tablet!!!", name: "East Room" },
  "North Room": { items: ["fruit tycoon"], exits: { south: "Center Room" }, description: "fruit tycoon room pog", name: "North Room" },
  "South Room": { items: ["your dad"], exits: { north: "Center Room" }, description: "grocery store long lost to time- just like your dad", name: "South Room" }
};

playerStats["location"] = rooms["Center Room"];

function splitText(text) {
  words = text.split(" ");
  verb = words.shift();
  noun = words.join(" ");
  return [verb.lower(), noun.lower()];
  //var noun = text[0:firstSpace]
  //returns [attack, imposter] or [take, amongnus] (add quotes too lazy)

}


function getCommand(text) {
  if (currentState == "idle") {
    words = splitText(text);
    didMove = false;
    words = [words[0].toLowerCase(), words[1].toLowerCase()];
    lowerText = text.toLowerCase();
    if (words[1] == "") {
      if (lowerText == "describe") {
        describe();
        return;
      }
      if (lowerText == "inventory") {
        if (Object.keys(inventory).length == 0) {
          print("You don't have anything in your inventory!")
          return;
        }

        invText = "You have "
        let count = 1
        for (const [key, value] of Object.entries(inventory)) {
          if (count != Object.keys(inventory).length) {
            if (value > 1) {
              invText += `${value} ${key}s `
            } else if (value == 1) {
              invText += `a ${key} `
            }
          } else if (count == Object.keys(inventory).length) {
            if (value > 1) {
              invText += `${value} ${key}s`
            } else if (value == 1 && ["a", "e", "i", "o", "u"].includes(key[0])) {
              invText += `an ${key}`
            } else if (value == 1) {
              invText += `a ${key}`
            }
          }

          if (count == Object.keys(inventory).length - 1) {
            invText += "and "
          }
          count += 1

        }
        print(invText + ".")
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
      if (didMove == true) {
        //assumes that the monster rates are listed from LEAST TO GREATEST?
        randInt = generateRandom(0, 100);
        total = 0;
        for (var i = 0; i < Object.keys(playerStats["location"].monsters).length; i++) {
          total += playerStats["location"].monsters[i][2];
          if (randInt <= total) {
            //make monster appear and initiate fight
            hunting = hunt(monsters[i]);
            didMove = false;
            return;
          }
        }
      }
      if (lowerText == "help") {
        print("The commands are: <br> 'describe', which describes the room you are currently in <br> 'inventory', which tells you what's in your inventory <br> and 'east','west','south','north' to control where you want to go <br>")
      }
    } else { // if there is more than 1 word in the command i.e. take imposter
      if (words[0] == "take") {
        for (i = 0; i < playerStats["location"]["items"].length; i++) {
          if (playerStats["location"]["items"][i] == words[1]) {
            let item = playerStats["location"]["items"][i];
            print(item)
            if (inventory[item] == null) {
              console.log("we in boys")
              inventory[item] = 1;
            } else if (inventory[item] > 0) {
              inventory[item] += 1;
            }
            print("You have taken the " + item);
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
  } else if (currentState == "battling") {
    if (currentTurn == "player") {
      if (["1", "2", "3", "4"].includes(words[0])) {
        if (playerStats["moves"][parseInt(words[0])] != null) { //check if move exists
          let damage = playerStats["moves"][parseInt(words[0]) - 1].generateDamage();
          hunting.health -= damage;
          if(hunting.health <= 0) {
            //win
            currentState = "idle";
          }
        } else {
          print("Pick an existing move! Enter a number from 1-4 or 'run' to flee." + moveMessage);
          return; //prevent from switching to enemy turn
        }
      } else if(words[0].lower() == "run") {
        
      }
      currentTurn = "enemy";
    } else if (currentTurn == "enemy") {
      playerStats["health"] -= hunting.generateDmg;
      currentTurn = "player";
    }
  }
  print("That isn't a command! Type 'help' for a list of commands.")
}



function describe() {
  console.log(playerStats)
  print(playerStats["location"]["description"] + "\n")
  itemTxt = "";
  exitTxt = "";
  if (playerStats["location"].items.length > 0) {
    for (let i = playerStats["location"].items.length - 1; i >= 0; i--) {
      prefix = ""
      if (["a", "e", "i", "o", "u"].includes(playerStats["location"].items[i][0])) {
        prefix = "an "
      } else {
        prefix = "a "
      }
      if (i == 0 && playerStats["location"].items.length > 1) {
        itemTxt += "and " + prefix + playerStats["location"].items[i];
      } else if (playerStats["location"].items.length > 2) {
        itemTxt += prefix + playerStats["location"].items[i] + ", ";
      } else {
        itemTxt += prefix + playerStats["location"].items[i] + " ";
      }
    }
    print("There is " + itemTxt + " in the room.");
  } else {
    print("There is nothing in the room.")
  }


  for (let i = Object.keys(playerStats["location"].exits).length - 1; i >= 0; i--) {
    if (i == 0 && Object.keys(playerStats["location"].exits).length > 1) {
      exitTxt += " and an exit to the " + Object.keys(playerStats["location"].exits)[i]
    } else if (Object.keys(playerStats["location"].exits).length > 2) {
      exitTxt += "  an exit to the " + Object.keys(playerStats["location"].exits)[i] + ","
    } else {
      exitTxt += "  an exit to the " + Object.keys(playerStats["location"].exits)[i]
    }
  }
  print("There is " + exitTxt + " here. <br><br>")
}

function print(text) {
  //big iq moment?!?!? i actually did somethign!?!?!?
  p = document.createElement("p");
  p.innerHTML = text;
  p.style.fontFamily = "monospace";
  prevP.before(p);
  prevP = p;
  docElements.push(prevP);
  if (docElements.length >= 10) {
    docElements[0].remove();
    docElements.splice(0, 1);
  }
  //prevP = p;

  //input.before(p);
  //prevP.style.fontFamily = "monospace";
  input.scrollIntoView();
}


function getInput(evt) {
  //???
  moveMsg = "Your moves are: "
  if (evt.code === "Enter" && currentState == "idle") {
    let text = input.value;
    input.value = "";
    //print(text);
    getCommand(text)
  }
}

function hunt(enemy) {
  currentState = "battling";

  moveMessage = `Your move(s) are `
  for (var i = 0; i < playerStats["moves"].length; i++) {
    if (i == playerStats["moves"].length - 1 && playerStats["moves"].length > 1) { //check if last move and if moves length is not 1 (and a among us or I have one amongus not I have and one amonugs)
      moveMessage = moveMessage.concat("and " + playerStats["moves"][i].name + ".")
    } else if (i == playerStats["moves"].length - 1) {
      moveMessage = moveMessage.concat(playerStats["moves"][i].name + ".")
    } else {
      moveMessage = moveMessage.concat(playerStats["moves"][i].name + " ")
    }

  }
  print(`A ${enemy.name} appeared and attacks you! It has ${enemy.health} HP! <br> ` + moveMessage + "You can also run. What do you do?");
  return enemy;
}

input.addEventListener("keyup", getInput, false);
console.log(splitText("among"))
console.log(croissant.generateDrops())
console.log(generateRandom(1, 2))
hunt(croissant)