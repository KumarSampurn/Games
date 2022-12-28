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
const score = document.querySelector("#score")

let result =0


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
    score.textContent=result
}
let timerId=null
function moveMole(){
    timeId =null
    timerId=setInterval(randomSquare,550)
}


currentTime=10

function displayScore(){
    console.log("Final Score is : " + result)
}

function countDown(){
    currentTime--;
    timeleft.textContent=currentTime;
    if(currentTime<1)
    {
        displayScore()
        clearInterval(countDownTimerId)
        clearInterval(timerId)
    }
}
let countDownTimerId =null



let startButton = document.getElementById("start")
startButton.addEventListener("click",()=>{
    countDownTimerId = setInterval(countDown,1000)
    moveMole()
}) 