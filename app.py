from flask import Flask, render_template, request
from json import load, dump
from time import sleep

app = Flask(__name__)

moveEnable = True
numPlayers = 3
currentPlayer = 0
joinEnable = False


@app.route("/")
def home():
    #return clearDb()
    return render_template("index.html")

@app.route("/getData/<roomId>")
def returnData(roomId):
    with open("board.json") as file:
        fileData = load(file)
    data = fileData.get(roomId, -1)
    if(data == -1):
        return {"idk": "Room not found"}
    return data
    
@app.route("/move/<roomId>", methods=["POST"])
def move(roomId):
    global moveEnable
    global numPlayers
    global currentPlayer
    with open("board.json") as file:
        fileData = load(file)
    data = fileData.get(roomId, -1)
    if(data == -1):
        return {"idk": "Room not found"}
    #get global stuff from data here
    playerId = int(request.json["playerId"])
    square = int(request.json["square"])
    if (not moveEnable):
        print("Moveenable")
        return -1                        #maybe custom errors
    if (playerId != currentPlayer):
        print("wrong player")
        return -1
    
    grid = data["grid"]
    if (grid[square]["value"]!= 0  and grid[square]["colour"] != currentPlayer):
        print("Wrong move")
        # print(grid[square]["colour"], currentPlayer)
        return -1
    

    grid[square]["colour"] = currentPlayer


    moveEnable = False
    # grid[square]["value"] += 1
    #push to stack 
    stack = []
    stack.append(square)

    while(len(stack)>0): #while stack not empty
        sleep(0.5)
        #write to file here
        data["grid"] = grid
        fileData[roomId] = data
        with open("board.json", "w") as file:
            dump(fileData, file, indent = 4)
        
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
            # stack.pop()
            pass

    #move done
    data["grid"] = grid
    fileData[roomId] = data
    with open("board.json", "w") as file:
        dump(fileData, file, indent = 4)



                    
### IT HAS TO BE RECURSIVE. OR it has to have stack. 
### Or else you can have neighbouring fours
            
# Top left right down


    currentPlayer = (currentPlayer+1)%numPlayers
    moveEnable = True
    return {"aa":1}
	
   

"""
while(flag): #while stack not empty
        flag = False
        for i in range(36): #remove for
            if (grid[i]["value"] == grid[square]["maxValue"]):
                flag = True
                #set its value to 0
                grid[i]["value"] = 0
                #set neighbours colours to this
                #increase neighbours value
                if (i//6 !=0):
                    grid[i-6]["colour"] = grid[i]["colour"]
                    grid[i-6]["value"]+=1

                if (i//6 != 5):
                    grid[i+6]["colour"] = grid[i]["colour"]
                    grid[i+6]["value"] += 1
                    
"""


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

def clearDb():
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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


