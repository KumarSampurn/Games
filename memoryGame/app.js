let chosenCardArray=[]
let chosenCardIdArray=[]

const cardArray =[
    {
        name : 'cheeseburger',
        img: 'images/cheeseburger.png',
    },
    {
        name : 'fries',
        img: 'images/fries.png',
    },
    {
        name : 'hotdog',
        img: 'images/hotdog.png',
    },
    {
        name : 'ice-cream',
        img: 'images/ice-cream.png',
    },
    {
        name : 'milkshake',
        img: 'images/milkshake.png',
    },
    {
        name : 'pizza',
        img: 'images/pizza.png',
    },
    {
        name : 'cheeseburger',
        img: 'images/cheeseburger.png',
    },
    {
        name : 'fries',
        img: 'images/fries.png',
    },
    {
        name : 'hotdog',
        img: 'images/hotdog.png',
    },
    {
        name : 'ice-cream',
        img: 'images/ice-cream.png',
    },
    {
        name : 'milkshake',
        img: 'images/milkshake.png',
    },
    {
        name : 'pizza',
        img: 'images/pizza.png',
    },   
]

let heading = document.getElementById("result")
let allImages= document.getElementsByTagName("img")
const gridDisplay = document.querySelector('#grid')
document.addEventListener("click", displayScore)
let result=150


for (let index = 0; index < 5; index++) {
    cardArray.sort(()=> Math.random() - 0.5)
}

function createBoard(){
    for( let i = 0; i< cardArray.length ; i++)
    {
        const card = document.createElement('img')
        card.setAttribute("src","images/blank.png")
        card.setAttribute("id",i)
        card.setAttribute("class", "cardStyles")
        card.addEventListener("click",flipCard)
        gridDisplay.appendChild(card)
    }
}

function checkMatch(){
    
    let card1Id =chosenCardIdArray[chosenCardIdArray.length-1]
    let card2Id =chosenCardIdArray[chosenCardIdArray.length-2]

    let card1=document.getElementById(card1Id)
    let card2=document.getElementById(card2Id)
    
    if((chosenCardArray[0]===chosenCardArray[1]) && (card1Id != card2Id) )
    {
        card1.setAttribute("src", "images/white.png")
        card2.setAttribute("src", "images/white.png")
        card1.removeEventListener("click",flipCard)
        card2.removeEventListener("click",flipCard)
        displayScore()
        checkAllWhites()  
    }
    else
    {
        card1.setAttribute("src", "images/blank.png")
        card2.setAttribute("src", "images/blank.png")   
        result= result -10;
        displayScore()
        if(result<=0)
            youLose()      
    }
    chosenCardArray.pop()
    chosenCardArray.pop()
}

function flipCard(){
    const cardId =this.getAttribute("id")
    let chosenCard = cardArray[cardId].name
    
    chosenCardIdArray.push(cardId)
    chosenCardArray.push(chosenCard)
    
    this.setAttribute("src",cardArray[cardId].img)

    if (chosenCardArray.length >1 ) {
        setTimeout(checkMatch,400)
    }
    
}


function displayScore(){
    heading.innerHTML="Score :"+ result;
    document.removeEventListener("click", displayScore)
}

function checkAllWhites(){
    for( let i =0 ; i< allImages.length; i++)
    {
        if(allImages[i].getAttribute("src") !== 'images/white.png')
        {
            return
        }
    }
    youWon()
}

function youWon(){
    let parent = document.getElementById("grid")
    parent.innerHTML= "<br><br><h3> Your Score is : "+ result + "</h3>"+"<br><h6> Refresh To play again</h6>"
    
    heading.innerHTML="You Won!!!";
}
function youLose(){
    let parent = document.getElementById("grid")
    parent.innerHTML= "<br><br><br><br><h3> Lmao Noob</h3>"+"<br><br><br><br><br><br><h6> Refresh To play again</h6>"
    heading.innerHTML="You Lost!!!";
}
createBoard()