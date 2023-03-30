window.onload = (event)=>{
    
document.getElementById("create").addEventListener("click", async ()=>{
    createRoom()
})

document.getElementById("join").addEventListener("click", async ()=>{
    let roomId = parseInt(document.getElementById("roomNo").value)
    joinRoom(roomId)
})



}

async function createRoom(){
    let response = await fetch("/createRoom", {//perfectly valid apparently
        method:"POST"
    }).then((response)=>response.json())
    let roomId = response["roomId"]
    joinRoom(roomId)
}

async function joinRoom(roomId){
    let response = await fetch("/joinRoom/" + roomId, {//perfectly valid apparently
        method:"POST"
    }).then((response)=>response.json())
    console.log(roomId,response["playerId"])
    let playerId = response["playerId"]
    window.location.replace("/game/" + roomId + "?id="+ playerId)

}


async function postig(){//Delthis
    await fetch("/createRoom", {
        method:"POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

}

//Both host and others should see same url
//So createroom returns room id and host does join room right after
//first person to join room becomes host. when returning game.html it also sends roomid, playerid and isHost
//only host gets start button. when clicked check for host= in backend again

//others join the room later
//in data there's a host= 12121

//only host can start the game
//once started the start button is to be removed idk how
//or maybe send it in html and use jinja to give only host the button in the first place
//when clicked it makes a post request and also deletes itself