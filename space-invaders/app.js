const gridDisplay = document.querySelector('.grid')
let blockWidth = 20
let blockHeight = 20
let boardWidth = 620
let boardHeight = 400
gridDisplay.style.width = boardWidth + 'px'
gridDisplay.style.height = boardHeight + 'px'

noOfRows=boardHeight/blockHeight
noOfColumns=boardWidth/blockWidth


let currentShooterIndex =  Math.floor(noOfColumns/2)+noOfColumns*(noOfRows-2)
const aliensRemoved=[]


for (let i = 0; i < noOfRows; i++) {
  for (let j = 0; j < noOfColumns; j++) {
    let block = document.createElement('div')
    block.setAttribute('id', i*noOfColumns+j)
    block.classList.add('block')
    block.style.width = blockWidth-2 + 'px'
    block.style.height = blockHeight-2 + 'px'

    gridDisplay.appendChild(block)
  }
}

let alienInvaders=[]
for (let i = 0; i < 15; i++) {
    alienInvaders.push(i)
    alienInvaders.push(i+31)
    alienInvaders.push(i+62)
    alienInvaders.push(i+93)
}
let blocks = document.querySelectorAll('.block')

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
      if(!aliensRemoved.includes(i)) {
        blocks[alienInvaders[i]].classList.add('invader')
      }
    }
  }

draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
      blocks[alienInvaders[i]].classList.remove('invader')
    }
  }



blocks[currentShooterIndex].classList.add('user')


document.addEventListener('keydown', moveShooter)
function moveShooter(e) {
switch (e.key) {
    case 'ArrowLeft':
        if (currentShooterIndex % noOfColumns !== 0) {
            blocks[currentShooterIndex].classList.remove('user')
            currentShooterIndex -= 1
            blocks[currentShooterIndex].classList.add('user')
        }
        break
    case 'ArrowRight':
        if(currentShooterIndex%noOfColumns !==noOfColumns-1){
            blocks[currentShooterIndex].classList.remove("user")
            currentShooterIndex+=1
            blocks[currentShooterIndex].classList.add("user")
        }
        break
}}


let direction = 1
let flag=0
function moveInvader(){
    flag=0
    let leftEdge = alienInvaders[0]%noOfColumns===0
    let rightEdge = (alienInvaders[alienInvaders.length-1]%noOfColumns) === (noOfColumns-1)

    if(rightEdge && direction > 0)
    {
        direction =-1
        flag=1
    }
    if(leftEdge && direction < 0)
    {
        direction=1
        flag =1
        
    }
    alienInvaders.forEach(invader =>blocks[invader].classList.remove("invader"))

    for(let i =0 ; i< alienInvaders.length ; i++)
    {
        if(flag){
            alienInvaders[i]+=direction+noOfColumns
        }
        else
        {
            alienInvaders[i]+=direction
        }
    }
    
        
        draw()
     

}

function shootLaser(e)
{
    let LaserId
    let laserCurrentIndex=currentShooterIndex
    function moveLaser(){
        if(laserCurrentIndex<=0)
        {
            clearInterval(LaserId)
            return
        }
        if(blocks[laserCurrentIndex].classList.contains("invader")){
            blocks[laserCurrentIndex].classList.remove("invader")
            blocks[laserCurrentIndex].classList.remove("laser")
            blocks[laserCurrentIndex].classList.add('boom')

            setTimeout(()=> blocks[laserCurrentIndex].classList.remove('boom'), 300)
            clearInterval(LaserId)

            const alienRemoved = alienInvaders.indexOf(laserCurrentIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)
            return
        }
        blocks[laserCurrentIndex].classList.remove("laser")
        laserCurrentIndex-=noOfColumns
        blocks[laserCurrentIndex].classList.add("laser")   
        return
    }

    switch(e.key){
        case 'ArrowUp':
            LaserId=setInterval(moveLaser,100)

    }
}
document.addEventListener("keydown", shootLaser)


setInterval(moveInvader,99)