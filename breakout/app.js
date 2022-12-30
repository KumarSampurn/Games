const gridDisplay = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const resultBox= document.querySelector("#result")
const blockWidth = 150
const blockHeight = 30
const ballDiameter =20
const boardWidth=770
const boardHeight=400

let speed = 2
let userSpeed =12
let ballSpeed =10

let xDirection = Math.random() > 0.5 ? speed : speed*(-1)
let yDirection =speed

let noOfRows=4
let noOfColumns=5

const startPosition =[310,10]
let userCurrentPosition=startPosition

const ballStartPosition =[385,40]
let ballCurrentPosition=ballStartPosition

let timerId
let score = 0

//my block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

//all my blocks
const blocks= []
for(let i =0 ;i < noOfRows ; i ++)
{
    for( let j =0 ; j<noOfColumns ; j++)
    {
        blocks.push( new Block(10+j*blockWidth, boardHeight - (30+ i*blockHeight)))
    }
}

//draw my blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'  
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
    gridDisplay.appendChild(block)
    console.log(blocks[i].bottomLeft)
  }
}
addBlocks()

//add user
const user = document.createElement('div')
user.classList.add('user')
gridDisplay.appendChild(user)
drawUser()

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
gridDisplay.appendChild(ball)
drawBall()

//move user
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (userCurrentPosition[0] > 0) {
        userCurrentPosition[0] -= userSpeed    
      }
      break
    case 'ArrowRight':
      if (userCurrentPosition[0] < (boardWidth - blockWidth)) {
        userCurrentPosition[0] += userSpeed       
      }
      break
  }
  drawUser()
}
document.addEventListener('keydown', moveUser)

//draw User
function drawUser() {
  user.style.left = userCurrentPosition[0] + 'px'
  user.style.bottom = userCurrentPosition[1] + 'px'
}

//draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

//move ball
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    timerId = setInterval(moveBall, ballSpeed)
    resultBox.innerHTML = ""
  }
});


//check for collisions
function checkForCollisions() {
  //check for block collision
  for (let i = 0; i < blocks.length; i++){
    if
    (
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
    )
      {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocks.splice(i,1)
      changeDirection()   
      score++
      scoreDisplay.innerHTML = "Score : " +score
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
    }
  }
  // check for wall hits
  if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0 || ballCurrentPosition[1] >= (boardHeight - ballDiameter))
  {
    changeDirection()
  }

  //check for user collision
  if
  (
    (ballCurrentPosition[0] > userCurrentPosition[0] && ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > userCurrentPosition[1] && ballCurrentPosition[1] < userCurrentPosition[1] + blockHeight ) 
  )
  {
    changeDirection()
  }

  //game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML="<h1>You lose !!</h1>"
    resultBox.innerHTML = '<h6> Score : '+ score+"<h6>"
    document.removeEventListener('keydown', moveUser)
  }
}


function changeDirection(){
  if(xDirection > 0 && yDirection > 0)
  {
      yDirection = speed* (-1)
      return
  }
  if( xDirection > 0 && yDirection <0)
  {
      xDirection = speed* (-1)
      return
  }
  if( xDirection <0 && yDirection >0)
  {
      xDirection = speed
      return
  }
  if( xDirection <0 && yDirection < 0)
  {
      yDirection = speed
      return
  }
}