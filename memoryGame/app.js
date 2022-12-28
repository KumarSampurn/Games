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

for (let index = 0; index < 5; index++) {
    cardArray.sort(()=> Math.random() - 0.5)
}

console.log(cardArray)

const gridDisplay = document.querySelector('#grid')

let chosenCardArray=[]
let chosenCardIdArray=[]

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
createBoard()


function checkMatch(){
    
    let card1Id =chosenCardIdArray[chosenCardIdArray.length-1]
    let card2Id =chosenCardIdArray[chosenCardIdArray.length-2]

    let card1=document.getElementById(card1Id)
    let card2=document.getElementById(card2Id)
    
    if(chosenCardArray[0]===chosenCardArray[1])
    {
        card1.setAttribute("src", "images/white.png")
        card2.setAttribute("src", "images/white.png")
        card1.removeEventListener("click",flipCard)
        card2.removeEventListener("click",flipCard)
    }
    else
    {
        card1.setAttribute("src", "images/blank.png")
        card2.setAttribute("src", "images/blank.png")   
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
        setTimeout(checkMatch,500)
    }
    
}