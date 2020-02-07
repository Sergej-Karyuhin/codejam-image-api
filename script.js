let canvas = document.getElementById('cs');
let ctx = canvas.getContext('2d');

let tools = ['bucket', 'choose', 'pencil'];
let tool_flag = 'pencil';
let allow_flag = false;
let color_flag;

let color_pick = document.getElementById('color-pick');
let current = document.getElementById('currentC');
let prev = document.getElementById('prevC');

let matrixStep = 4;
let matrixSize = 128;
let matrix = new Array(matrixSize).fill().map(() => new Array(matrixSize).fill());

let imageURL;

let loadButton = document.getElementById('loadButton');

let matrixSize1 = document.getElementById('128x128');
let matrixSize2 = document.getElementById('256x256');
let matrixSize3 = document.getElementById('512x512');

let sizeButton = document.querySelectorAll('.canvas-current');

let townName = 'Minsk';
let townButton = document.getElementById('townButton');





function drawMatrix() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      ctx.fillStyle = matrix[i][j];
      ctx.fillRect( (i * matrixStep), (j * matrixStep), matrixStep, matrixStep );
    }
  }
}

function changeTool(tool) {
  for (i of tools) {
    let tmp = document.getElementById(i);
    if (tmp.id == tool.id) {
      continue;
    }
    else {
      tmp.style.backgroundColor = '#ffffff';
    }
  }
  tool.style.backgroundColor = '#ad1fa6';
  tool_flag = tool.id;
}

function btnPrev() {
  let tmp = current.style.backgroundColor;
  color_flag = prev.style.backgroundColor;
  current.style.backgroundColor = prev.style.backgroundColor;
  prev.style.backgroundColor = tmp;
}

function btnRed() {
  prev.style.backgroundColor = current.style.backgroundColor;
  current.style.backgroundColor = 'red';
  color_flag = 'red';
}

function btnBlue() {
  prev.style.backgroundColor = current.style.backgroundColor;
  current.style.backgroundColor = 'blue';
  color_flag = 'blue';
}

function currentClick() {
  color_pick.click();
}

function getCoords(event) {
    let target;
    let canv_x = event.offsetX;
    let canv_y = event.offsetY;
    let counterX = 0;
    let counterY = 0;
    let flag = false;

    if (tool_flag == 'pencil') {
      return
    }

    for (let i = 0; i < 512; i += matrixStep) {
      if (canv_y >= i && canv_y <= i + matrixStep) {
        for (let j = 0; j < 512; j += matrixStep) {
          if (canv_x >= j && canv_x <= j + matrixStep) {
            target = matrix[counterX][counterY];
            flag = true;
            break;
          }
            counterY += 1;
        }
      }
      if (flag == true) {
        break;
      }
      counterX += 1;
    }

    switch (tool_flag) {
      case 'bucket':
        let countY = 0;
        let countX = 0;
        bucket_flag = true;
        ctx.fillStyle = color_flag;
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 512; i += matrixStep) {
          for (let j = 0; j < 512; j += matrixStep) {
            matrix[countY][countX] = color_flag;
            countY += 1;
          }
          countY = 0;
          countX += 1;
        }
        break;
      case 'choose':
        prev.style.backgroundColor = color_flag;
        color_flag = target;
        current.style.backgroundColor = target;
        break;
    }
}

function pencilCore() {
  let flag = false;
  let counterY = 0;
  let counterX = 0;

  canv_x = event.offsetX;
  canv_y = event.offsetY;
  ctx.fillStyle = color_flag;

  if (tool_flag != 'pencil') {
    return;
  }

  for (let i = 0; i < 512; i += matrixStep) {
    if ( (canv_y >= i) && (canv_y <= (i + matrixStep)) ) {
        for (let j = 0; j < 512; j += matrixStep) {
            if ( (canv_x >= j) && (canv_x <= (j + matrixStep)) ) {
              matrix[counterY][counterX] = color_flag;
              ctx.fillRect( (matrixStep * counterX), (matrixStep * counterY), matrixStep, matrixStep);
              flag = true;
              break;
            }
            counterX += 1;
        }
    }
    if (flag == true) {
      break;
    }
    counterY += 1;
  }
}

function allowed_pencil() {
  if (!(allow_flag)) {
    return;
  }
  pencilCore();
}

function init_pencil() {
  allow_flag = true;
  pencilCore();
}

function close_pencil() {
  allow_flag = false;
}

function drawImageActualSize() {
  canvas.width = 512;
  canvas.height = 512;
  ctx.drawImage(this, 0, 0);
}



async function getLinkToImage() {
  imageURL = 'https://api.unsplash.com/photos/random/?query=town,'
             + townName +
             '&w=512&client_id=321dcdac4fb60fe899926e683d9c06f77e05446c388cc42b3c53caf63226b692';
  let response = await fetch(imageURL);
  let data = await response.json();
  imageURL = data.urls.small;
}

function showImage() {
  let img = new Image(512, 512);
  img.src = imageURL;
  img.onload = drawImageActualSize;
  img.crossOrigin = 'Anonymous';
}

function changeTown() {
  let townInput = document.getElementById('townInput').value;
  townName = townInput;
  getLinkToImage();
}

function B$W() {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = localStorage.getItem('canvasImage');
  img.onload = function() {
    draw(this);
  };

  function draw(img) {
    ctx.drawImage(img, 0, 0);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var grayscale = function() {
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      ctx.putImageData(imageData, 0, 0);
    };

    var grayscalebtn = document.getElementById('blackAndWhite');
    grayscalebtn.addEventListener('click', grayscale);
  }
}


// localStorage.clear();


canvas.width = 512;
canvas.height = 512;

document.getElementById('pencil').style.backgroundColor = '#ad1fa6';

color_pick.addEventListener('input', function() {
  color_flag = color_pick.value;
  prev.style.backgroundColor = current.style.backgroundColor;
  current.style.backgroundColor = color_flag;
});

document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyB') {
    changeTool(bucket);
  }
  if (event.code == 'KeyC') {
    changeTool(choose);
  }
  if (event.code == 'KeyP') {
    changeTool(pencil);
  }
});

window.onload = function() {
  let url = localStorage.getItem('canvasImage');
  let img = new Image(512, 512);
  img.src = url;
  img.onload = drawImageActualSize;
  img.crossOrigin = 'Anonymous';
  loadButton.addEventListener('click', function() {
    getLinkToImage();
    setTimeout(() => showImage(), 300);
  });
  tool_flag = localStorage.getItem('tool');
  changeTool(document.getElementById(tool_flag));
  color_flag = localStorage.getItem('colorFlag');
  prev.style.backgroundColor = localStorage.getItem('prevColor');
  current.style.backgroundColor = localStorage.getItem('currentColor');
}

window.onbeforeunload = function() {
  localStorage.setItem('canvasImage', canvas.toDataURL());
  localStorage.setItem('tool', tool_flag);
  localStorage.setItem('prevColor', prev.style.backgroundColor);
  localStorage.setItem('currentColor', current.style.backgroundColor);
  localStorage.setItem('colorFlag', color_flag);
};

matrixSize1.addEventListener('click', function() {
  sizeButton.forEach(item => item.classList.remove('active'));
  sizeButton[0].classList.add('active');
  matrixStep = 4;
  matrixSize = 128;
  matrix = new Array(matrixSize).fill().map(() => new Array(matrixSize).fill());
});
matrixSize2.addEventListener('click', function() {
  sizeButton.forEach(item => item.classList.remove('active'));
  sizeButton[1].classList.add('active');
  matrixStep = 2;
  matrixSize = 256;
  matrix = new Array(matrixSize).fill().map(() => new Array(matrixSize).fill());
});
matrixSize3.addEventListener('click', function() {
  sizeButton.forEach(item => item.classList.remove('active'));
  sizeButton[2].classList.add('active');
  matrixStep = 1;
  matrixSize = 512;
  matrix = new Array(matrixSize).fill().map(() => new Array(matrixSize).fill());
});

townButton.addEventListener('click', changeTown);
B$W();
