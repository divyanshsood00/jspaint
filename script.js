// Constants
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const sizeEl = document.getElementById("size");
const colorEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const artModeBtn = document.getElementById("artMode");
const crayonModeBtn = document.getElementById("crayonMode");
const markerModeBtn = document.getElementById("markerMode");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const eraserModeBtn = document.getElementById("eraser");
const downloadBackupBtn = document.getElementById("downloadBackup");
const restoreBackupField = document.getElementById("restoreBackup");
const screenshotBtn = document.getElementById("screenshot");

// globals
let nsize = 8;
let isPressed = false;
colorEl.value = "#ff0000";
let backgroundColor = "#ffffff";
let color = colorEl.value;
var artMode = false;
var crayonMode = false;
var eraserMode = false;
var markerMode = true;
let undosteps = 50;
let redosteps = 50;
let autoSaveInterval = 15000;
let nx;
let ny;

// classes for stacks
class Node {
  constructor(data, next = null, prev = null) {
    this.data = data;
    this.next = next;
    // this.prev = prev;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  clear() {
    this.head = null;
    this.tail = null;
  }
  insertAtBeginning(data) {
    let newNode = new Node(data);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    return this.head;
  }
  getCurrent() {
    return this.head;
  }
  // Get the next node
  getNext() {
    this.head = this.head.next;
    return this.head;
  }
  hasNext() {
    return this.head.next != null;
  }
  // Save to localStorage
  saveToLocalStorage() {
    var ll_str = JSON.stringify(this);
    console.log(ll_str);
    localStorage.setItem("DoublyLinkedList", ll_str);
  }

  // Retrieve from localStorage
  retrieveFromLocalStorage() {
    let retrievedObject = localStorage.getItem("DoublyLinkedList");
    if (retrievedObject) {
      let list = JSON.parse(retrievedObject);
      this.head = list.head;
      this.tail = list.tail;
      return true;
    }
  }

  // Save to a backup file
  getBackupFile() {
    if (this.head != null) return JSON.stringify(this);
  }

  // Retrieve from a backup file
  retrieveFromBackupFile(data) {
    let list = JSON.parse(data);
    this.head = list.head;
    this.tail = list.tail;
    console.log("Retrieved from backup file!");
  }
}

// Stack declaration
const undoStack = new DoublyLinkedList();
const didRestore = undoStack.retrieveFromLocalStorage();

// Redraw on refresh
if (didRestore) redraw();
const redoStack = new DoublyLinkedList();

// EVENTS

// for drawing with mouse
canvas.addEventListener("mousedown", (e) => {
  startDrawMouse(e);
});

canvas.addEventListener("mouseout", (e) => {
  stopDraw();
});

canvas.addEventListener("mouseup", (e) => {
  stopDraw();
});

canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;
    if (!crayonMode) {
      drawCircle(x2, y2, color, nsize);
    }
    drawLine(nx, ny, x2, y2, color, nsize);
    let obj = {
      x: nx,
      y: ny,
      x2,
      y2,
      size: nsize,
      color,
    };
    undoStack.insertAtBeginning(obj);
    if (!artMode) {
      ny = y2;
      nx = x2;
    }
  }
});

// for drawing with touch
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawTouch(e.touches[0]);
  });
  
  canvas.addEventListener("touchend", (e) => {
    stopDraw();
  });
  
  canvas.addEventListener("touchcancel", (e) => {
    stopDraw();
  });
  
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (isPressed) {
      const x2 = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      const y2 = e.touches[0].clientY - canvas.getBoundingClientRect().top;
      if (!crayonMode) {
        drawCircle(x2, y2, color, nsize);
      }
      drawLine(nx, ny, x2, y2, color, nsize);
      let obj = {
        x: nx,
        y: ny,
        x2,
        y2,
        size: nsize,
        color,
      };
      undoStack.insertAtBeginning(obj);
      if (!artMode) {
        ny = y2;
        nx = x2;
      }
    }
  });
  
  function startDrawTouch(e) {
    isPressed = true;
    nx = e.clientX - canvas.getBoundingClientRect().left;
    ny = e.clientY - canvas.getBoundingClientRect().top;
  }

// for autosave
setTimeout(function () {
  undoStack.saveToLocalStorage();
  console.log("Saved to localstorage...");
}, autoSaveInterval);

// for toggles and buttons
increaseBtn.addEventListener("click", () => {
  nsize += 2;
  if (nsize > 20) {
    nsize = 20;
  }
  updateSizeOnScreen();
});

decreaseBtn.addEventListener("click", () => {
  nsize -= 2;
  if (nsize < 2) {
    nsize = 2;
  }
  updateSizeOnScreen();
});

colorEl.addEventListener("change", (e) => (color = e.target.value));

downloadBackupBtn.addEventListener("click", function () {
  const content = undoStack.getBackupFile();
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jspaint-" + getDateString() + ".bkp";
  a.click();
});

restoreBackupField.addEventListener("change", function () {
  const file = restoreBackupField.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    console.log(text);
    undoStack.retrieveFromBackupFile(text);
    redraw();
  };
  reader.readAsText(file);
});

clearEl.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  undoStack.clear();
});

screenshotBtn.addEventListener("click", (e) => screenshot());
artModeBtn.addEventListener("click", (e) => {
  turnOffAllModes();

  toggleArtMode();
  hideUndoRedo();
});

markerModeBtn.addEventListener("click", (e) => {
  turnOffAllModes();

  toggleMarkerMode();
  showUndoRedo();
});

crayonModeBtn.addEventListener("click", (e) => {
  turnOffAllModes();

  toggleCrayonMode();
  showUndoRedo();
});

eraserModeBtn.addEventListener("click", (e) => {
  turnOffAllModes();

  toggleEraserMode();
  hideUndoRedo();
});

undoBtn.addEventListener("click", (e) => undo());
redoBtn.addEventListener("click", (e) => redo());


// Drawing method declarations
function screenshot() {
  var dataURL = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  let date = new Date();
  link.download = "jscanvas-" + getDateString() + ".png";
  link.href = dataURL;
  link.click();
}
function undo() {
  if (undoStack.getCurrent == null) return;
  let i = 0;
  eraseStroke(undoStack.getCurrent());
  redoStack.insertAtBeginning(undoStack.getCurrent());
  while (i < undosteps && undoStack.hasNext()) {
    const laststroke = undoStack.getNext();
    redoStack.insertAtBeginning(laststroke.data);
    eraseStroke(laststroke);
    i++;
  }
}
function redo() {
  if (redoStack.getCurrent == null) return;
  let i = 0;
  restoreStroke(redoStack.getCurrent());
  undoStack.insertAtBeginning(redoStack.getCurrent());

  while (i < redosteps && redoStack.hasNext()) {
    const laststroke = redoStack.getNext();
    undoStack.insertAtBeginning(laststroke.data);
    restoreStroke(laststroke);
    i++;
  }
}

function redraw() {
  let head = undoStack.head;
  while (head != null) {
    restoreStroke(head);
    head = head.next;
  }
}

function eraseStroke(laststroke) {
  const data = laststroke.data;
  const extraWidthMarks = 0.4;
  drawCircle(data.x2, data.y2, backgroundColor, data.size + extraWidthMarks);
  drawLine(
    data.x,
    data.y,
    data.x2,
    data.y2,
    backgroundColor,
    data.size + extraWidthMarks
  );
}

function restoreStroke(laststroke) {
  const data = laststroke.data;
  drawCircle(data.x2, data.y2, data.color, data.size);
  drawLine(data.x, data.y, data.x2, data.y2, data.color, data.size);
}

function startDrawMouse(e) {
  isPressed = true;
  nx = e.offsetX;
  ny = e.offsetY;
}

function stopDraw() {
  isPressed = false;
  nx = undefined;
  ny = undefined;
}

function drawCircle(ex, ey, ecolor, esize) {
  ctx.beginPath();
  ctx.arc(ex, ey, esize, 0, Math.PI * 2);
  // ctx.
  if (!eraserMode) {
    ctx.arc(ex, ey, esize, 0, Math.PI * 2);
    ctx.fillStyle = ecolor;
  } else {
    ctx.arc(ex, ey, esize * 2, 0, Math.PI * 2);
    ctx.fillStyle = "white";
  }
  ctx.fill();
}

function drawLine(ex1, ey1, ex2, ey2, ecolor, esize) {
  ctx.beginPath();
  ctx.moveTo(ex1, ey1);
  ctx.lineTo(ex2, ey2);
  if (!artMode && !eraserMode) {
    ctx.strokeStyle = ecolor;
  } else if (!eraserMode) {
    ctx.strokeStyle = "black";
  } else {
    ctx.strokeStyle = "white";
  }
  if (artMode) {
    ctx.lineWidth = esize;
  } else if (!eraserMode) {
    ctx.lineWidth = esize * 2;
  } else {
    ctx.lineWidth = esize * 4;
  }
  ctx.stroke();
}

function updateSizeOnScreen() {
  sizeEl.innerText = nsize;
}

// Button Toggle methods
function hideUndoRedo() {
  undoBtn.classList.add("hide");
  redoBtn.classList.add("hide");
}

function showUndoRedo() {
  undoBtn.classList.remove("hide");
  redoBtn.classList.remove("hide");
}

function turnOffAllModes() {
  if (artMode) toggleArtMode();
  if (markerMode) toggleMarkerMode();
  if (crayonMode) toggleCrayonMode();
  if (eraserMode) toggleEraserMode();
}

function toggleEraserMode() {
  eraserMode = !eraserMode;
  eraserModeBtn.classList.toggle("pink");
}

function toggleMarkerMode() {
  markerMode = !markerMode;
  markerModeBtn.classList.toggle("pink");
}

function toggleCrayonMode() {
  crayonMode = !crayonMode;
  crayonModeBtn.classList.toggle("pink");
}

function toggleArtMode() {
  artMode = !artMode;
  artModeBtn.classList.toggle("pink");
}

// Additional method Declarations
function getDateString(a) {
    const date = new Date();
    return (
      date.getMinutes() +
      "-" +
      date.getHours() +
      "_" +
      date.getDay() +
      "-" +
      date.getMonth() +
      "-" +
      date.getFullYear()
    );
  }