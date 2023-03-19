roomId = 12
playerId = 1;


async function displayGrid(){
    let data = await getData()
    let grid = data["grid"]
    let htmlString = ""
    for (let i=0; i<grid.length; i++){
        if (grid[i]["value"] == 0)
            htmlString += '<div name="square" class="square fullImg" id="'+ i +'"><img /></div>'
        else{
            // console.log(grid[i]["value"], grid[i]["colour"])
            let imgFile = getImageFile(grid[i]["value"], grid[i]["colour"]) 
            // console.log(imgFile)
            htmlString += '<div name="square" class="square fullImg" id="' + i + '"><img src="' + imgFile + '"/></div>'
        }
    }
    document.getElementsByClassName("grid")[0].innerHTML = htmlString;

    for (let i=0; i<grid.length; i++){
        let squareElement = document.getElementsByName("square")[i]
        squareElement.addEventListener("click", function(){
            onClick(squareElement.id)
        })
    } 
}

async function onClick(squareNumber){
    playerId = document.getElementById("player").value

    console.log(playerId)
    console.log("CLOCKCKC")
    let data = {"playerId": playerId, "square": squareNumber}
    await fetch("/move/" + roomId, {
        method:"POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}
window.onload = async (event) => {
    await displayGrid()
    setInterval(updateGrid, 500)
  };


async function updateGrid(){
    console.log("A")
    let data = await getData()
    let grid = data["grid"]

    for (let i=0; i<grid.length; i++){
        let squareElement = document.getElementsByName("square")[i]
        if (grid[i]["value"] != 0){
            let imgFile = getImageFile(grid[i]["value"], grid[i]["colour"]) 
            squareElement.childNodes[0].src = imgFile
        }
        else 
            squareElement.childNodes[0].src = "../static/images/blank.png"
    }
}

// async function post(data){//sends stuff to server. write one more func that gets data and calls this
//     let response = await fetch("/api", {
//         method:"POST",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     }).then(response =>response.json())
//     console.log(response)

// }













async function getData(){
    let response = await fetch("/getData/" + roomId).then(response => response.json())
    return response
}

function getImageFile(value, colour){
    let imgFile = "../static/images/"
    switch(value){
        case 1:imgFile += "single"; break;
        case 2:imgFile += "double"; break;
        case 3:imgFile += "triple"; break;
        case 4:imgFile += "quadraple"; break;
    }
    switch(colour){
        case 0:imgFile += "Red.png"; break;
        case 1:imgFile += "Green.png"; break;
        case 2:imgFile += "Blue.png"; break;
    }
    return imgFile
}



/*
var htmlString = ""
    for(let i=0; i<grid.length; i++){
      var imgFile = ""
      if (grid[i]["value"] != 0) {
        imgFile += 'images/' + grid[i]["colour"] + grid[i]["value"] + '.png';
        htmlString += '<div class="square fullImg" id="' + i + '"><img src="' + imgFile + '"/></div>'
      }
      
    }
    document.getElementsByClassName("grid")[0].innerHTML = htmlString;


    var gridElements = document.getElementsByClassName("square");

    for (let i=0; i< gridElements.length; i++){
      gridElements[i].addEventListener("click", function(){

        isClicked(i)
        // currentPlayer = (currentPlayer+1)%3
        // console.log("p",currentPlayer)

    }
    )
  }
  sleep(500)
  }
*/