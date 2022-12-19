const possibleChoices = document.querySelectorAll("button");
// console.log(possibleChoices)

var ele1= document.querySelector(".img1");
var ele2= document.querySelector(".img2");
var heading= document.querySelector("h1");

let userChoice, computerChoice, result;
let choices = ["Rock","Paper", "Scissors"];


possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click',(e)=>{
userChoice = e.target.id;
ele2.setAttribute("src","images/"+userChoice+".png");
generateComputerChoice()

}))

function generateComputerChoice()
{
    const randomNumber = Math.floor(Math.random()*3);
    console.log(randomNumber);
    computerChoice= choices[randomNumber];
    ele1.setAttribute("src","images/"+computerChoice+".png");
    winner()
}

function winner()
{
    if(userChoice === computerChoice)
        result = "Its a Draw!!";

        else if ( userChoice === "Rock" && computerChoice ==="Paper")
        result = "🚩 Computer Wins!"
        
        else if ( userChoice === "Rock" && computerChoice ==="Scissors")
        result = "User Wins! 🚩"
        
        else if ( userChoice === "Scissors" && computerChoice ==="Paper")
        result = "User Wins! 🚩"
        
        else if ( userChoice === "Scissors" && computerChoice ==="Rock")
        result = "🚩 Computer Wins!"
        
        else if ( userChoice === "Paper" && computerChoice ==="Scissors")
        result = "🚩 Computer Wins!"
        
        else if ( userChoice === "Paper" && computerChoice ==="Rock")
        result = "User Wins! 🚩"

        heading.innerHTML=result;
        console.log("user" ,userChoice);
        console.log("computer" ,computerChoice);

}