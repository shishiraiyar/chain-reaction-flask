from flask import Flask, render_template, request
from json import load, dump
from time import sleep
from random import randrange

app = Flask(__name__)


joinEnable = False
#when u click start set cur player to players[0]

## ADD GAME OVER##
##Better error messages##
##Front end for errors##
##Test join after game start##
##Dont give full data. Give only some data##
##Fix Moveenable## DONE

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/createRoom", methods=["POST"])
def createRoom():
    roomId = randrange(1000,9999)
    putData(roomId, emptyData()) #make it such that CANT MOVE UNTIL START BUTTON IS PRESSED
    return {"roomId":roomId}

@app.route("/joinRoom/<roomId>", methods=["POST"])
def joinRoom(roomId):
    playerId = randrange(1, 10000)
    data = getData(roomId)
    if (data == -1):
        return {"idk":"Room not found"}
    data["numPlayers"] = data["numPlayers"] + 1
    data["players"].append(playerId)
    if (data["numPlayers"] == 1):
        data["host"] = playerId
    putData(roomId, data)

    return {"playerId":playerId}

@app.route("/game/<roomId>")#/game/121212?id=2110
def gamePage(roomId):
    playerId = request.args.get("id", default=1, type=int)
    data = getData(roomId)
    isHost = playerId == data["host"]
    return render_template("game.html", roomId=roomId, playerId=playerId, isHost=isHost)

@app.route("/getData/<roomId>")
def returnData(roomId):
    
    data = getData(roomId)
    if(data == -1):
        return {"idk": "Room not found"}    #HANDLE ERRORS IN FRONT MAYBE
    return data 
#DONT GIVE FULL DATA. Make a new json with grid and other necessary params only
    
@app.route("/start/<roomId>", methods=["POST"])
def start(roomId):
    data = getData(roomId)
    id = request.json["id"]
    if (data["host"] != id):
        print("NOT HOST")
        return -1
    data["isStarted"] = True
    data["currentPlayerIndex"] = 0
    putData(roomId, data)
    return {"ok":0}


#CHANGE CURRENTPLAYER TO CURRENTPLAYERINDEX VERY IMP


@app.route("/move/<roomId>", methods=["POST"])
def move(roomId):

    data = getData(roomId)
    if(data == -1):
        return {"idk": "Room not found"}
    
    if (not data["isStarted"]):
        print("NOT START")
        return -1

    currentPlayerIndex = data["currentPlayerIndex"]
    currentPlayerId = data["players"][currentPlayerIndex]
    numPlayers = data["numPlayers"]
    moveEnable = data["moveEnable"]

    playerId = int(request.json["playerId"])
    square = int(request.json["square"])

    if (data["isGameOver"]):
        print("GAMOVAAAAAAAAAAAAAAAA")
        return -1
    


    if (not moveEnable):
        print("Moveenable")
        return -1                        #maybe custom errors
    if (playerId != currentPlayerId):
        print("wrong player")
        return -1
    
    grid = data["grid"]
    if (grid[square]["value"]!= 0  and grid[square]["colour"] != currentPlayerIndex):
        print("Wrong move")
        # print(grid[square]["colour"], currentPlayer)
        return -1
    
    data["moveEnable"] = False
    grid[square]["colour"] = currentPlayerIndex

    # grid[square]["value"] += 1
    #push to stack 
    stack = []
    stack.append(square)

    while(len(stack)>0): #while stack not empty
        sleep(0.5)
        #write to file here
        data["grid"] = grid
        putData(roomId, data)
        
        if (isGameOver(grid)):
            data["isGameOver"] = True
            break

        i = stack.pop()
        #increase value here
        grid[i]["value"]+=1
        

        print("i:", i)             
        if (grid[i]["value"] == grid[i]["maxValue"]):
            #set its value to 0
            grid[i]["value"] = 0

            #set neighbours colours to this
            #increase neighbours value
            if (i//6 !=0):
                grid[i-6]["colour"] = grid[i]["colour"]
                # grid[i-6]["value"]+=1
                stack.append(i-6)
                


            if(i%6!=0):
                grid[i-1]["colour"] = grid[i]["colour"]
                # grid[i-1]["value"]+=1
                stack.append(i-1)
                

            if(i%6!=5):
                grid[i+1]["colour"] = grid[i]["colour"]
                # grid[i+1]["value"]+=1
                stack.append(i+1)
                

            if (i//6 != 5):
                grid[i+6]["colour"] = grid[i]["colour"]
                # grid[i+6]["value"] += 1
                stack.append(i+6)
                

        else:
            pass

    #move done
    data["grid"] = grid
    data["currentPlayerIndex"] = (currentPlayerIndex+1)%numPlayers
    data["moveEnable"] = True
    putData(roomId, data)
    

    return {"aa":1}


                    
### IT HAS TO BE RECURSIVE. OR it has to have stack. 
### Or else you can have neighbouring fours
            
# Top left right down

	

    

def getData(roomId):
    with open("board.json") as file:
        fileData = load(file)
    data = fileData.get(roomId, -1)
    return data

def putData(roomId, data):
    with open("board.json", "r") as file:
        fileData = load(file)

    fileData[roomId] = data

    with open("board.json", "w") as file:
        dump(fileData, file, indent=4)
    

        

"""
Server maintains 
Build for one room first
{room id : object of array of objects}
each request must be accompanied by a room id and a player id
when a player joins a game they get a room id that must be passed with every subsequent request

When a player clicks on a square, front end checks if its a valid move
Backend checks if its this player's move and only then does the move
Iterative function that is called that checks if any square is over its max and adds to its neighbours.
also changes neighbours colours. sleep after every loop. flag if anything changed.
maybe process lock kind of thing is required to make sure others cant make a move at the same time

Flask is multithreaded so peace. Clients keep requesting for the board(maybe at set intervals).

"""

def emptyData():
    temp = {}
    temp["isStarted"] = False #same as join enable #CHANGE LATER
    temp["isGameOver"] = False
    temp["moveEnable"] = True
    temp["numPlayers"]=0
    temp["currentPlayerIndex"] = None
    temp["players"] = []
    temp["host"] = None
    temp["grid"] = emptyGrid()
    
    return temp
    

def emptyGrid():
    temp = []
    for i in range(36):
      instability = 0
      if (i//6==0 or i//6==5):
        instability+=1

      if(i%6==0 or i%6==5):
        instability+=1
      temp.append({
        "colour":0, "value":0, "maxValue" : 4 - instability
    })
    return temp

def isGameOver(grid):
    alivePlayers = set()
    sqrCount =0         #ensures there are atleast two squares with value>1. or else gameover triggers when first player moves
    for i in range(36):
        if (grid[i]["value"] > 0):
            alivePlayers.add(grid[i]["colour"])
            sqrCount+=1

    if (len(alivePlayers)<2 and sqrCount>1):
        return True
    else:
        return False


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


