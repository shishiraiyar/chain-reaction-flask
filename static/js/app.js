roomId = roomId;
playerId = playerId;
//get room id and player id from server when getting redirected

async function displayGrid(){
    let data = await getData()
    let grid = data["grid"]
    let htmlString = ""
    for (let i=0; i<grid.length; i++){
        let svgImg = getSvgImg(grid[i]["value"], grid[i]["colour"])  // <svg> </svg>
        htmlString +=  svgImg 
        if (i%6 == 5) htmlString+="<br>"

    }
    document.getElementsByClassName("grid")[0].innerHTML = htmlString;

    for (let i=0; i<grid.length; i++){
        let squareElement = document.getElementsByClassName("svgImg")[i]
        squareElement.addEventListener("click", function(){
            onClick(i)
        })
    } 
}

async function onClick(squareNumber){

    let data = {"playerId": playerId, "square": squareNumber}
    let response = await fetch("/move/" + roomId, {
        method:"POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response)=>response.json())
    console.log(response)
    if (response["status"]){
        throwError(response["message"]);

    }
    updateGrid()
}

window.onload = async (event) => {
    await displayGrid()
    enableStartButton()
    setInterval(updateGrid, 500)
  };


async function updateGrid(){
    let t1 = new Date().valueOf()
    let data = await getData()
    console.log(parseInt(new Date().valueOf()) - parseInt(t1))
    let grid = data["grid"]

    for (let i=0; i<grid.length; i++){
        let svg = document.getElementsByClassName("svgImg")[i]
        svg.childNodes[0].setAttribute("d", getSvgPath(grid[i]["value"]))
        svg.childNodes[0].setAttribute("fill", getColourHex(grid[i]["colour"]))

    }
}



async function getData(){
    let response = await fetch("/getData/" + roomId).then(response => response.json())
    return response
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


        // if (grid[i]["value"] == 0)
        //     htmlString += '<div name="square" class="square fullImg" id="'+ i +'"><img /></div>'
        // else{
        //     let imgFile = getImageFile(grid[i]["value"], grid[i]["colour"]) 
        //     htmlString += '<div name="square" class="square fullImg" id="' + i + '"><img src="' + imgFile + '"/></div>'
        // }

// function getImageFile(value, colour){
//     let imgFile = "../static/images/"
//     switch(value){
//         case 1:imgFile += "single"; break;
//         case 2:imgFile += "double"; break;
//         case 3:imgFile += "triple"; break;
//         case 4:imgFile += "quadraple"; break;
//     }
//     switch(colour){
//         case 0:imgFile += "Red.png"; break;
//         case 1:imgFile += "Green.png"; break;
//         case 2:imgFile += "Blue.png"; break;
//     }
//     return imgFile
// }