const gridDisplay = document.querySelector(".grid")
const blockWidth = 140
const blockHeight = 20

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
