//imposter from amogus- extremely necessary and helpful comment
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
        if(Object.keys(inventory).length == 0) {
          print("You don't have anything in your inventory!")
          return;
        }
        
        invText = "You have "
        let count = 1
        for (const [key, value] of Object.entries(inventory)) {
          if(count != Object.keys(inventory).length) {
            if(value > 1) {
              invText += `${value} ${key}s `
            } else if (value == 1) {
              invText += `${value} ${key} `
            }
          } else if(count == Object.keys(inventory).length) {
            if(value > 1) {
              invText += `${value} ${key}s`
            } else if (value == 1) {
              invText += `${value} ${key}`
            }
          }
          
          if(count == Object.keys(inventory).length-1) {
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
        //assumes that the monster rates are listed from GREATEST TO LEAST
        randInt = generateRandom(0, 100);
        for (var i = 0; i < Object.keys(playerStats["location"].monsters).length; i++) {
          if (randInt <= playerStats["location"].monsters[i][2]) {
            //make monster appear and initiate fight
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
            if(inventory[item] == null) {
              console.log("we in boys")
              inventory[item] = 1;
            } else if(inventory[item] > 0) {
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
    print("That isn't a command! Type 'help' for a list of commands.")
  } else if(currentState == "battling") {
    //kill things
  }
}