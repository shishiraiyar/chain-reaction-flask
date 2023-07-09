roomId = roomId;
playerId = playerId;
//get room id and player id from server when getting redirected
const socket = io()  // put this in page load

function drawEmptyGrid(){
    let htmlString = ""
    for (let i=0; i<36; i++){
        let svgImg = getSvgImg(0, 0)  // <svg> </svg>
        htmlString +=  svgImg 
        if (i%6 == 5) htmlString+="<br>"
    }
    document.getElementsByClassName("grid")[0].innerHTML = htmlString;

    for (let i=0; i<36; i++){
        let squareElement = document.getElementsByClassName("svgImg")[i]
        squareElement.addEventListener("click", function(){
            onClick(i)
        })
    } 
}

async function onClick(squareNumber){
    socket.emit("move", roomId, playerId, squareNumber)
}

window.onload = async (event) => {
    drawEmptyGrid()
    enableStartButton()
    socket.emit("loadedGamePage", roomId, playerId)//must do after drawing empty grid
  };


async function updateGrid(grid){
    for (let i=0; i<grid.length; i++){
        let svg = document.getElementsByClassName("svgImg")[i]
        svg.childNodes[0].setAttribute("d", getSvgPath(grid[i]["value"]))
        svg.childNodes[0].setAttribute("fill", getColourHex(grid[i]["colour"]))
    }
}



function getSvgImg(value, colour){ 
    
    let colourHex = getColourHex(colour)
    let path = getSvgPath(value)

    let svg = `<svg viewBox="0 0 100 100" class="svgImg"><path d="${path}"
    fill="${colourHex}" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

    return svg
}

function getSvgPath(value){
    value = value%5             //for future if needed
    switch(value){
        case 0: return "";

        case 1: return "M 50 30 a 20 20 0 1 1 0 40 a 20 20 0 1 1 0 -40";

        case 2: return "M 50 35 a 20 20 0 1 1 0 30 a 20 20 0 1 1 0 -30" ; 

        case 3: return "M 50 65 a 15 15 0 1 0 13 -22.5 a 15 15 0 1 0 -26 0 a 15 15 0 1 0 13 22.5"; 

        case 4: return "M 50 30 a 15 15 0 1 1 20 20 a 15 15 0 1 1 -20 20 a 15 15 0 1 1 -20 -20 a 15 15 0 1 1 20 -20"; 
    }
}

function getColourHex(colour){
    const colours = ["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff", "#ffff00"]
    return colours[colour%colours.length]
}

function enableStartButton(){
    let startButton = document.getElementById("start")
    if (!startButton)
        return
    startButton.addEventListener("click", async()=>{
        let response = await fetch("/start/" + roomId, {
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"id": playerId})
        }).then((response)=>response.json())
        console.log(response)
        if (response["status"]){
            throwError(response["message"]);
        }
        if (!response["status"]){
            startButton.remove()
        }
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

socket.on("error", (error)=>{
    throwError(error)
})


socket.on("gridUpdate", (grid)=>{
    updateGrid(grid)
  })

