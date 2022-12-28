const gridDisplay = document.querySelector('#grid')
function createHoles(){

    for(let i =0 ; i < 9 ;i ++)
    {
        let hole = document.createElement("div")
        hole.setAttribute("id", i+1)
        hole.setAttribute("class", "square")
        gridDisplay.appendChild(hole)
    }
}
createHoles()



const squares = document.querySelectorAll(".square")
const mole = document.querySelector(".mole")
const timeleft = document.querySelector("#time-left")
const heading = document.querySelector("#score")


let result =0
let currentTime=30

function randomSquare(){
    squares.forEach(square=>{
        square.classList.remove("mole")
    })
    let randomSquare= squares[Math.floor(Math.random()*9)]
    randomSquare.classList.add("mole")
}

squares.forEach(square=>{
    square.addEventListener("mousedown",checkMatch)
})

function checkMatch(){
    
    if (this.classList.contains("mole"))
    {
        result++;
        
    }
    heading.innerHTML="<h1> Score : "+ result + "</h1>"
}


let timerId=null
function moveMole(){
    timerId=setInterval(randomSquare,582)
}



function displayScore(){
    gridDisplay.setAttribute("style", "display: block");
    heading.textContent= "Game Over"
    gridDisplay.innerHTML=""
    gridDisplay.innerHTML="<h1> Your Score : "+ result+ "</h1><h6>Refresh to Start</h6>"
    timeleft.innerHTML=""
}



let countDownTimerId =null
function countDown(){
    currentTime--;
    timeleft.innerHTML="<h1>Time Left :" + currentTime + "</h1>";
    if(currentTime<1)
    {
        displayScore()
        clearInterval(countDownTimerId)
        clearInterval(timerId)
    }
}

let startButton = document.getElementById("start")
startButton.addEventListener("click",()=>{
    heading.innerHTML="<h1> Score : "+ result + "</h1>"
    timeleft.innerHTML="<h1>Time Left :" + currentTime + "</h1>";
    countDownTimerId = setInterval(countDown,1000)
    moveMole()
}) 