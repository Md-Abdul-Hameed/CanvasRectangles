const canvas = document.getElementById("canvas");
const clearAll = document.getElementById("button");
const deleteOne = document.querySelector("#deleteOne");
const rectangles = document.querySelectorAll(".rectangle");
const beginner = document.querySelector(".beginner");
const undo = document.getElementById("undo")
const close = document.getElementById("close")
const help = document.querySelector(".help")
const helpIcon = document.querySelector("#question");


var mouse = {
  x: 0,
  y: 0, 
  startX: 0,
  startY: 0,
};

var element = null;
var draggableRectangle = null
var deleteOneBtnClicked = false;
var cache = []

function setMousePosition(e) {
  var ev = e || window.event; 
  if (ev.pageX) {
    mouse.x = ev.pageX + window.pageXOffset;
    mouse.y = ev.pageY + window.pageYOffset;
  } else if (ev.clientX) {
    mouse.x = ev.clientX + document.body.scrollLeft;
    mouse.y = ev.clientY + document.body.scrollTop;
  }
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

deleteOne.addEventListener("mouseover", () => {
  let dialog = document.querySelector(".del");
  dialog.open = true;
});

close.addEventListener('click',()=>{
 help.style.display = "none"
})

helpIcon.addEventListener('click',()=>{
  help.style.display = "flex"
})

deleteOne.addEventListener("mouseout", () => {
  let dialog = document.querySelector(".del");
  dialog.open = false;
});

deleteOne.addEventListener("click", () => {
  let warningDialog = document.getElementsByClassName("dialog");
  if (deleteOneBtnClicked) {
    deleteOne.parentNode.className = "";
    canvas.style.cursor = "default";
  } else {
    deleteOne.parentNode.className = "active";
    canvas.style.cursor =
      'url("https://img.icons8.com/ios-glyphs/30/000000/eraser.png"),auto';
  }
  warningDialog[0].open = !warningDialog[0].open;
  deleteOneBtnClicked = !deleteOneBtnClicked;
});

clearAll.addEventListener("click", () => {
  let arr = []
 let children = canvas.children;
 let length = children.length
  for(let i = 0; i < length ;i++){
    arr.push(children[i])
  }
  canvas.innerHTML = null
  cache.push(arr);
});

canvas.addEventListener("mousemove",(e)=>{
  setMousePosition(e);
  if (element !== null) {
    
    element.style.width = Math.abs(mouse.x - mouse.startX) + "px";
    element.style.height = Math.abs(mouse.y - mouse.startY) + "px";
    element.style.left =
      mouse.x - mouse.startX < 0 ? mouse.x + "px" : mouse.startX + "px";
    element.style.top =
      mouse.y - mouse.startY < 0 ? mouse.y + "px" : mouse.startY + "px";
  }else if(draggableRectangle !== null){
    let widthInPx = draggableRectangle.style.width;
    let heightInPx = draggableRectangle.style.height;
    let width = ""
    for(let i = widthInPx.length-3; i>=0;i--){
      width = widthInPx[i] + width;
    }
    let height = ""
    for(let i = heightInPx.length-3; i >= 0; i--){
      height = heightInPx[i] + height
    }
    width = Number(width)
    height = Number(height)

   draggableRectangle.style.left = mouse.x - width + "px" 
   draggableRectangle.style.top = mouse.y - height + "px"
  }
}) 

canvas.addEventListener("mouseup", () => {
  if (element !== null) {
    let children = canvas.children;
    if (children.length > 0) {
      let lastChild = children[children.length - 1];
      if (lastChild.style.width == "" && lastChild.style.height == "") {
        lastChild.remove();
      }
    }
  }else if(draggableRectangle !== null){
    draggableRectangle = null;
  }

});

canvas.addEventListener("click", () => {
  
  if (element !== null) {
    element = null;
    canvas.style.cursor = "default";
  }else if(draggableRectangle!==null){
    draggableRectangle = null;
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (deleteOneBtnClicked) {
    return;
  }
  if (element !== null) {
    element = null;
    canvas.style.cursor = "default";
  } 
  else if(e.target.className=="rectangle"){
    draggableRectangle = e.target;
  }
  else {
    mouse.startX = mouse.x;
    mouse.startY = mouse.y;
    element = document.createElement("div");
    element.className = "rectangle";
    element.style.left = mouse.x + "px";
    element.style.top = mouse.y + "px";
    element.style.backgroundColor = getRandomColor();
    canvas.appendChild(element);
    canvas.style.cursor = "crosshair";
    element.addEventListener(
      "click",
      function (element) {
        if (deleteOneBtnClicked) {
          element.remove();
        }
      }.bind(null, element)
    );
    element.addEventListener(
      "dblclick",
      function (element) {
        cache.push(element);
          element.remove();
      }.bind(null, element)
    );
  }
});

undo.addEventListener('click',()=>{
  if(cache.length>0){
    let elementToPush = cache[cache.length-1]
    if(Array.isArray(elementToPush)){
      elementToPush.forEach(element => {
        canvas.appendChild(element)
      });
    }else{
      canvas.appendChild(elementToPush)
    }
    cache.pop()
  }
})

undo.addEventListener('mouseover',()=>{
  let dialog = document.querySelector(".undo");
  dialog.open = true;
})

undo.addEventListener('mouseout',()=>{
  let dialog = document.querySelector(".undo");
  dialog.open = false;
})