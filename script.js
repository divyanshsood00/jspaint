const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const supermodeBtn = document.getElementById('supermode')

const ctx = canvas.getContext('2d');

let size = 6
let isPressed = false
colorEl.value = '#ff0000'
let color = colorEl.value
let supermode = true
let x
let y


canvas.addEventListener('mousedown',(e) => {
    isPressed=true
    x=e.offsetX
    y=e.offsetY

})

canvas.addEventListener('mouseup',(e) => {
    isPressed=false
    x=undefined
    y=undefined
    
})

canvas.addEventListener('mousemove',(e) => {
    if(isPressed){
        const x2 = e.offsetX
        const y2 = e.offsetY

        drawCircle(x2,y2)
        drawLine(x,y,x2,y2)
        if(!supermode){
            y= y2
            x= x2
        }
    }
})


 function drawCircle(x,y) {
    ctx.beginPath()
    ctx.arc(x,y,size,0,Math.PI*2)
    ctx.fillStyle = color
    ctx.fill()
}

function drawLine(x1,y1,x2,y2){
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    if (!supermode){
    ctx.strokeStyle = color
    }else{
        ctx.strokeStyle = 'black'
    }
    if (supermode){
    ctx.lineWidth = size
    }else{
        ctx.lineWidth = size *2
    }
    ctx.stroke()
}

function updateSizeOnScreen() {
    sizeEL.innerText = size
}

increaseBtn.addEventListener('click', () => {
    size += 2

    if(size > 20) {
        size = 20
    }

    updateSizeOnScreen()
})

decreaseBtn.addEventListener('click', () => {
    size -= 2

    if(size < 2) {
        size = 2
    }

    updateSizeOnScreen()
})

colorEl.addEventListener('change', (e) => color = e.target.value)

clearEl.addEventListener('click', () => ctx.clearRect(0,0, canvas.width, canvas.height))

supermodeBtn.addEventListener('click',(e) => {
    supermodeBtn.classList.toggle('pink')
    if (supermode){
        supermode =false
    }else{
        supermode =true

    }
})