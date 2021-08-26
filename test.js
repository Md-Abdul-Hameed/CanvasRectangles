const canvas = document.getElementById("canvas");
const clearAll = document.getElementsByTagName("button");
const deleteOne = document.querySelector("#deleteOne");
const rectangles = document.querySelectorAll(".rectangle");
const beginner = document.querySelector(".beginner");

var mouse = {
  x: 0,
  y: 0,
  startX: 0,
  startY: 0,
};

var element = null;
var draggableRectangle = null

beginner.addEventListener("click",()=>{
  beginner.remove()
})

deleteOne.addEventListener("mouseover", () => {
  let dialog = document.getElementById("detail");
  dialog.open = true;
});
deleteOne.addEventListener("mouseout", () => {
  let dialog = document.getElementById("detail");
  dialog.open = false;
});

let deleteOneBtnClicked = false;

deleteOne.addEventListener("click", () => {
  beginner.remove()
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



clearAll[0].addEventListener("click", () => {
  canvas.innerHTML = null;
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setMousePosition(e) {
  var ev = e || window.event; //Moz || IE
  if (ev.pageX) {
    //Moz
    mouse.x = ev.pageX + window.pageXOffset;
    mouse.y = ev.pageY + window.pageYOffset;
  } else if (ev.clientX) {
    //IE
    mouse.x = ev.clientX + document.body.scrollLeft;
    mouse.y = ev.clientY + document.body.scrollTop;
  }
}

canvas.onmousemove = function (e) {
  beginner.remove()
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
    // console.log(height,heightInPx)
    // console.log(width,widthInPx)
    width = Number(width)
    height = Number(height)

   draggableRectangle.style.left = mouse.x - width + "px" 
   draggableRectangle.style.top = mouse.y - height + "px"
  }
};

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
  beginner.remove();
  if (element !== null) {
    element = null;
    canvas.style.cursor = "default";
  }
});

canvas.addEventListener("mousedown", function (e) {
  if (deleteOneBtnClicked) {
    return;
  }
  if (element !== null) {
    element = null;
    canvas.style.cursor = "default";
  } 
  else if(e.target.className=="rectangle"){
    dragRectangle(e.target)
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
          element.remove();
      }.bind(null, element)
    );
  }
});

function dragRectangle(rectangle){
  draggableRectangle = rectangle 
}