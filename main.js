"use strict";

const startButton = document.querySelector('#startButton');
const stopButton = document.querySelector('#stopButton');
const score = document.querySelector('#score');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

//Sizes of a square (or parallelogram)
const squareWidth = 30;
const squareHeight = 30;

let createNewSquareInterval; 
let createNewModifiedSquareInterval;
let renderInterval;
let count = 0;

startButton.addEventListener('click', startNewGame);
stopButton.addEventListener('click', stopGame);

function startNewGame() {
  stopGame();
  requestAnimationFrame(animate);
  count = 0;
  updateScore(count);
}

function stopGame() {
  clearInterval(createNewSquareInterval);
  clearInterval(createNewModifiedSquareInterval);
  clearInterval(renderInterval);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function updateScore(count) {
  score.innerHTML = count;
}

function animate() {  

  let squaresArr = [];
  let modifiedSquaresArr = [];

  class Square {
    constructor(width, heigth) {
      this.x = Math.random() * (canvasWidth - squareWidth);
      this.y = 0;
      this.width = width;
      this.heigth = heigth;
      this.fillColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      this.changeY = Math.random() * 2;
    }

    draw() {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(this.x, this.y, this.width, this.heigth);
      this.y += this.changeY;
    }

    static isClickInSquare(x, y, square, offsetX = 0, offsetY = 0) {
      return     x > (square.x + offsetX)
              && x < (square.x + square.width + offsetX)
              && y > (square.y + offsetY)
              && y < (square.y + square.heigth + offsetY); 
    }
  }

  class ModifiedSquare extends Square {

    draw() {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(this.x, this.y, this.width, this.heigth);
      ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.heigth - 10);
      ctx.strokeStyle = `#ffffff`;
      this.y += this.changeY;
    }
  }

  createNewSquareInterval = setInterval(function() {
    squaresArr.push(new Square(squareWidth, squareHeight))
  }, Math.random() * 3000);

  createNewModifiedSquareInterval = setInterval(function() {
    modifiedSquaresArr.push(new ModifiedSquare(squareWidth, squareHeight))
  }, Math.random() * 5000);

  renderInterval = setInterval(drawCanvas, 20);
   
  // 'offsetLeft' and 'offsetTop' return the offset relative to the parent 
  // element ('body' in this case). 
  // If there is more nesting, it is necessary to use 'getClientRects()' and scroll.
  canvas.addEventListener('click', (e) => {

    for (let i = 0; i < squaresArr.length; i++) {
      if (Square.isClickInSquare(e.clientX, 
                                 e.clientY, 
                                 squaresArr[i], 
                                 canvas.offsetLeft, 
                                 canvas.offsetTop)) { 
        delete squaresArr.splice(i, 1);
        updateScore(++count);
        break;
      }
    }

    for (let i = 0; i < modifiedSquaresArr.length; i++) {
      if (ModifiedSquare.isClickInSquare(e.clientX, 
                                         e.clientY, 
                                         modifiedSquaresArr[i], 
                                         canvas.offsetLeft, 
                                         canvas.offsetTop)) { 
        delete modifiedSquaresArr.splice(i, 1);
        updateScore(count += 2);
        break;
      }
    }
  });

  function drawCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    squaresArr.forEach((square, i, squaresArr) => {
      square.draw();
    });
    modifiedSquaresArr.forEach((square, i, modifiedSquaresArr) => {
      square.draw();
    });
  }

}
