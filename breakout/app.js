const gridDisplay = document.querySelector(".grid")
const blockWidth = 145
const blockHeight = 20

const startPosition =[385-145/2,10]
let userCurrentPosition=startPosition

// create block 
class Block {
    constructor(xAxis,yAxis){
        this.bottomLeft=[xAxis,yAxis]
    }
}

const blocks= []
for(let i =0 ;i < 4 ; i ++)
{
    for( let j =0 ; j<5 ; j++)
    {
        newBLock = new Block(10+j*150, 10 + i*30)
        blocks.push(newBLock)
    }
}

// draw block
function addBlock(){
    for( let i =0 ; i< blocks.length ; i++){

        const block = document.createElement('div')
        block.classList.add("block")
        block.style.left=blocks[i].bottomLeft[0]+ "px"
        block.style.top=blocks[i].bottomLeft[1]+"px"
        gridDisplay.appendChild(block)
    }
}
addBlock()

user = document.createElement("div")
user.classList.add("block")
user.style.backgroundColor="black"
gridDisplay.appendChild(user)


function drawUser(){
    user.style.left=userCurrentPosition[0]+"px"
    user.style.bottom=userCurrentPosition[1]+"px"
}
drawUser()

document.addEventListener("keydown",moveUser)
function moveUser(e){
    switch (e.key) {
        case "ArrowLeft":
            if(userCurrentPosition[0]>=0)
            userCurrentPosition[0]-=10
            break;
        case "ArrowRight":
            if(userCurrentPosition[0]<=(770-145))
            userCurrentPosition[0]+=10
            break;
        
            
            default:
                break;
            }
drawUser()        
}




