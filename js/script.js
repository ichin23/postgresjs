
const main = document.querySelector("main")
const listagemSec = document.getElementById("listagem")
const adicionarSec = document.getElementById("adicionar")
const resizeBar = document.querySelector(".resizeBar")

let sizeMain = parseInt(document.defaultView.getComputedStyle(main).height)
let styleBar = document.defaultView.getComputedStyle(resizeBar)
let barSize = parseInt(styleBar.height) + parseInt(styleBar.marginTop) + parseInt(styleBar.marginBottom)
console.log(barSize)
console.log(sizeMain*0.7)
listagemSec.style.maxHeight = sizeMain*0.6+"px"
adicionarSec.style.maxHeight = sizeMain*0.6+"px"
listagemSec.style.minHeight = sizeMain*0.35+"px"
adicionarSec.style.minHeight = sizeMain*0.35+"px"

let isResizing = false;
let startY = 0;
let startHeightListagem = 0;
let startHeightAdicionar = 0;

resizeBar.addEventListener("mousedown", (e)=>{
    isResizing = true;
    startY = e.clientY;
    startHeightListagem = parseInt(document.defaultView.getComputedStyle(listagemSec).height);
    startHeightAdicionar = parseInt(document.defaultView.getComputedStyle(adicionarSec).height);
    console.log(startHeightListagem)
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
    
    // Add active drag listeners to the whole document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
})

function handleMouseMove(e) {
  if (!isResizing) return;

  const dy = e.clientY - startY;

  console.log(sizeMain)
  adicionarSec.style.height = `${sizeMain - barSize - (startHeightListagem+dy)}px`;
  listagemSec.style.height =  `${startHeightListagem + dy}px`;
}

function stopResize() {
  isResizing = false;
  document.body.style.userSelect = ''; // Restore text selection
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResize);
}

