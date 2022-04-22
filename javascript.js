
var addingLines = false

function AddingLineState(){
    addingLines =! addingLines

    let button = document.querySelector('#addline-button')

    if(addingLines == true){
        button.style.backgroundColor = 'red'

        verticalGuideLine.setAttribute('style', 'display: block;')
        horizontalGuideLine.setAttribute('style', 'display: block;')
    }else{
        button.style.backgroundColor = 'black'

        verticalGuideLine.setAttribute('style', 'display: none;')
        horizontalGuideLine.setAttribute('style', 'display: none;')
    }
}



var valueRef = 0

document.querySelector('#inputRef').addEventListener('change', (e)=>{
    valueRef = document.querySelector('#inputRef').value
    updateTexts()
})



document.querySelector('#inputOpacity').addEventListener('change', (e)=>{
    let bodyElementsOpacity = document.body.children
    
    for (let i = 0; i < bodyElementsOpacity.length; i++){
        if(bodyElementsOpacity[i].id != 'menu' && bodyElementsOpacity[i].id != 'div-lines' && bodyElementsOpacity[i].id != 'guide-lines' ){
            bodyElementsOpacity[i].style.opacity = (document.querySelector('#inputOpacity').value * 0.1)
        }
    }
})



var posX1, posY1, posX2, posY2 = 0

var counterLines = 0

var mouseDown = false

document.addEventListener('mousedown', (e)=>{
    posX1 = e.layerX
    posY1 = e.layerY

    
    if(e.target.id == 'div-lines' && addingLines){
        mouseDown = true  
    }
})
document.addEventListener('mouseup', (e)=>{
    posX2 = e.layerX
    posY2 = e.layerY

    if(e.target.id == 'div-lines' && mouseDown && addingLines){
        addLine()
        updateTexts()
    }

    mouseDown = false
})



const verticalGuideLine = document.querySelector('#verticalGuideLine')
const horizontalGuideLine = document.querySelector('#horizontalGuideLine')

document.addEventListener('mousemove', (e)=>{
    verticalGuideLine.setAttribute('x1',  e.layerX)
    verticalGuideLine.setAttribute('x2',  e.layerX)
    horizontalGuideLine.setAttribute('y1',  e.layerY)
    horizontalGuideLine.setAttribute('y2',  e.layerY)
})



const divLines = document.getElementById('div-lines')

function addLine(){
    let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    newLine.setAttribute('id', ('line'+counterLines))
    newLine.setAttribute('class', 'line')
    newLine.setAttribute('x1', posX1);
    newLine.setAttribute('y1', posY1);
    newLine.setAttribute('x2', posX2);
    newLine.setAttribute('y2', posY2);
    newLine.setAttribute("stroke", "black")
    newLine.setAttribute("stroke-width", "3")
    divLines.append(newLine);

    let midPointX = ((posX1 + posX2) / 2)
    let midPointY = ((posY1 + posY2) / 2)

    let textLine = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textLine.setAttribute('id', 'text'+ counterLines)
    textLine.setAttribute('class', 'text-line')
    textLine.setAttribute('x', midPointX);
    textLine.setAttribute('y', midPointY);
    textLine.textContent = 'null';
    divLines.append(textLine);

    counterLines ++
}



function removeLine(){
    if(divLines.children.length != 0){
        divLines.lastChild.remove()
        divLines.lastChild.remove()

        counterLines --
    }
}



function updateTexts(){
    let arrayTexts = document.querySelectorAll('.text-line')

    let arrayLines = document.querySelectorAll('.line')

    for (let i = 0; i < arrayTexts.length; i++) {
        let arrLength = (lineDistance(arrayLines[i].getAttribute('x1'), arrayLines[i].getAttribute('y1'), arrayLines[i].getAttribute('x2'),arrayLines[i].getAttribute('y2'))).toFixed(2)

        arrayTexts[i].textContent = calcValueRef(arrLength).toFixed(1)

        //arrayTexts[i].textContent = (lineDistance(arrayLines[i].getAttribute('x1'), arrayLines[i].getAttribute('y1'), arrayLines[i].getAttribute('x2'),arrayLines[i].getAttribute('y2'))).toFixed(2)        
    }
}



function lineDistance(x1, y1, x2, y2) {
    let xValue = 0;
    let yValue = 0;
    xValue = x2 - x1;
    xValue = xValue * xValue;
    yValue = y2 - y1;
    yValue = yValue * yValue;

    return Math.sqrt(xValue + yValue);
}



function calcValueRef(lineLenght) {
    let refLine = document.querySelector('#line0')

    let lineRef = lineDistance(refLine.getAttribute('x1'), refLine.getAttribute('y1'), refLine.getAttribute('x2'), refLine.getAttribute('y2'))

    let result = valueRef * lineLenght / lineRef

    return result
}



const inputImage = document.querySelector('#input-image')
const previewImage = document.querySelector('#preview-image')

var uploadedImage = ''

inputImage.addEventListener('change', function(){
    const reader = new FileReader()

    reader.addEventListener('load', () => {
        uploadedImage = reader.result
        previewImage.setAttribute('src', uploadedImage)
    })
    reader.readAsDataURL(this.files[0])

    setTimeout(function () {
        updateSizes()
    }, 1000)
})



function updateSizes(){
    divLines.style.height = document.querySelector('#div-preview').clientHeight
    
    document.querySelector('#guide-lines').style.height = document.querySelector('#div-preview').clientHeight
    verticalGuideLine.setAttribute('y2', '100%')
}