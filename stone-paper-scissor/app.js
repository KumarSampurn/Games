const computerChoiceDisplay = document.getElementById("computer-choice")
const userChoiceDisplay = document.getElementById("user-choice")
const resultDisplay = document.getElementById("result")

const possibleChoices = document.querySelectorAll("button");
// console.log(possibleChoices)

let userChoice, computerChoice, result;
let choices = ["Rock","Paper", "Scissors"];


possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click',(e)=>{
userChoice = e.target.id;
userChoiceDisplay.innerHTML=userChoice;
generateComputerChoice()


}))

function generateComputerChoice()
{
    const randomNumber = Math.floor(Math.random()*3);
    console.log(randomNumber);
    computerChoice= choices[randomNumber];
    computerChoiceDisplay.innerHTML=computerChoice;
    winner()
}

function winner()
{
    if(userChoice === computerChoice)
        result = "Draw";

        else if ( userChoice === "Rock" && computerChoice ==="Paper")
        result = "Computer"
        
        else if ( userChoice === "Rock" && computerChoice ==="Scissors")
        result = "User"
        
        else if ( userChoice === "Scissors" && computerChoice ==="Paper")
        result = "User"
        
        else if ( userChoice === "Scissors" && computerChoice ==="Rock")
        result = "Computer"
        
        else if ( userChoice === "Rock" && computerChoice ==="Scissors")
        result = "User"
        
        else if ( userChoice === "Rock" && computerChoice ==="Paper")
        result = "Computer"

        resultDisplay.innerHTML=result;
}