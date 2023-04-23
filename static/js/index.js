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

    if (response["status"]){
        console.log("ERER")
        throwError(response["message"])
    }
    else{
        let playerId = response["playerId"]
        window.location.replace("/game/" + roomId + "?id="+ playerId)
    }


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

function throwError(message, colour="#ff0000"){
    const errorBox = document.createElement("div")
    errorBox.className = "errorBox"
    errorBox.innerHTML = `<h3 class="errorMsg">${message}</h3>`
    document.body.appendChild(errorBox)
    
    setTimeout(() => {
        // errorBox.remove();
        errorBox.style.opacity = '0';
    }, 1500);
    errorBox.addEventListener('transitionend', () => errorBox.remove());
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