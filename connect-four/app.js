const gridDisplay = document.querySelector(".grid")
// adding divs 
for(let i =0 ; i< 42 ;i ++)
{
   
        newElement= document.createElement("div")
        newElement.classList.add("commonSquare")
        newElement.setAttribute("id",i)
        if(i>=35)
            newElement.addEventListener("click",markSquare)
        gridDisplay.appendChild(newElement)
    
   
}
let squares = Array.from(document.querySelectorAll(".grid div"))


let currentPlayer = "playerOne"

function changePlayer()
{
    if(currentPlayer==="playerOne")
    {
        currentPlayer="playerTwo"
    }
    else
    {
        currentPlayer="playerOne"
    }
}

function checkConnectFour(index){
    // console.log(index%7)
horizontalCheck(index)
verticalCheck(index)
// diagonalCheck()
}

function checkNextFourIndexFrom(index){
let indices = [index,index+1,index+2,index+3]
for(let i =0 ; i<indices.length ; i++)
{
    if(squares[indices[i]].classList.contains(currentPlayer))
    {
        continue;
    }
    else
    {
        return false;
    }
}
return true;
}

function horizontalCheck(index){
    index=parseInt(index)
    

    switch(index%7){
        case 0:
            if(checkNextFourIndexFrom(index))
                youWin()
            break;
        case 1:  
            if(checkNextFourIndexFrom(index-1)||
            checkNextFourIndexFrom(index))
                youWin()
            break;  
        case 2:
            if(checkNextFourIndexFrom(index-2)||
            checkNextFourIndexFrom(index-1)||
            checkNextFourIndexFrom(index))
                youWin()
            break;
        case 3:
            if(checkNextFourIndexFrom(index-3)||
            checkNextFourIndexFrom(index-2)||
            checkNextFourIndexFrom(index-1)||
            checkNextFourIndexFrom(index)           )
                youWin()
            break;
        case 4:
            if(checkNextFourIndexFrom(index-3)||
            checkNextFourIndexFrom(index-2)||
            checkNextFourIndexFrom(index-1))
                youWin()
            break;
        case 5:
            if(checkNextFourIndexFrom(index-3)||
            checkNextFourIndexFrom(index-2))
                youWin()
            break;
        case 6:
            if(checkNextFourIndexFrom(index-3))
                youWin()
            break;
    }
}

function verticalCheck(index){
    index=parseInt(index)
if(index<=20)
{
    if(squares[index].classList.contains(currentPlayer)&&
    squares[index+7].classList.contains(currentPlayer)&&
    squares[index+14].classList.contains(currentPlayer)&&
    squares[index+21].classList.contains(currentPlayer))
    {
        youWin()
    }
}
}





















function youWin(){
    console.log("you win")
}


function markSquare(){
    let squareId = this.id
    squares[squareId].classList.add(currentPlayer)
    squares[squareId].removeEventListener("click",markSquare)
    if(squareId-7 >= 0 )
    squares[squareId-7].addEventListener("click",markSquare)
checkConnectFour(this.id)
changePlayer()
}