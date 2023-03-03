from flask import Flask, render_template
from json import load

app = Flask(__name__)



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
      print(i/6)
      temp.append({
        "colour":0, "value":0, "maxValue" : 4 - instability
    })
    return temp


if __name__ == "__main__":
    app.run(debug=True)


