const cardArray =[
    {
        name : 'cheeseburger',
        img: '.images/cheeseburger.png',
    },
    {
        name : 'fries',
        img: '.images/fries.png',
    },
    {
        name : 'hotdog',
        img: '.images/hotdog.png',
    },
    {
        name : 'ice-cream',
        img: '.images/ice-cream.png',
    },
    {
        name : 'milkshake',
        img: '.images/milkshake.png',
    },
    {
        name : 'pizza',
        img: '.images/pizza.png',
    },
    {
        name : 'cheeseburger',
        img: '.images/cheeseburger.png',
    },
    {
        name : 'fries',
        img: '.images/fries.png',
    },
    {
        name : 'hotdog',
        img: '.images/hotdog.png',
    },
    {
        name : 'ice-cream',
        img: '.images/ice-cream.png',
    },
    {
        name : 'milkshake',
        img: '.images/milkshake.png',
    },
    {
        name : 'pizza',
        img: '.images/pizza.png',
    },   
]

for (let index = 0; index < 5; index++) {
    cardArray.sort(()=> Math.random() - 0.5)
}

console.log(cardArray)

const gridDisplay = document.querySelector('#grid')



function createBoard(){
    for( let i = 0; i< cardArray.length ; i++)
    {
        const card = document.createElement('img')
        card.setAttribute("src","images/blank.png")
        card.setAttribute("id","i")
        console.log(card)
        gridDisplay.appendChild(card)
    
    }
}
createBoard()