let grid;
let w = 7;
let cols, rows;
let height;
let changed;
let mainstack;
let size = 15;
let density = 50;
document.addEventListener("DOMContentLoaded", function() {
  let buttonContainerHeight = document.getElementById("favcolor").offsetHeight;
  let sliderContainerHeight = document.querySelector(".slider_container").offsetHeight;
  height = window.innerHeight - buttonContainerHeight - sliderContainerHeight;
});
let width = window.innerWidth;
let colorPicker = "orange";


function Make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      arr[i][j] = ""; 
    }
  }
  return arr;
}

function setup() {
 // window.alert("Salut! Mersi ca ai intrat pe proiectul meu 😘");
  frameRate(45);
  createCanvas(width, height).center('horizontal');
  mainstack = new Stack();
  auxstack = new Stack();
  changed = false;  

  cols = ceil(width / w);
  rows = ceil(height / w);

  grid = Make2DArray(cols, rows);
}

function withinCols(i) {
  return i >= 0 && i < cols; // Adjusted the condition to include the last column
}

function withinRows(j) {
  return j >= 0 && j < rows; // Adjusted the condition to include the last row
}

function MouseIsPressed() {
  let mouseCol = floor(mouseX / w);
  let mouseRow = floor(mouseY / w);

  if (withinCols(mouseCol) && withinRows(mouseRow)) {
    let sqr = floor(size / 2);

     for (let i = -sqr; i <= sqr; i++){
      for (let j = -sqr; j <= sqr; j++){
        if (i*i + j*j <= sqr*sqr){
          let mouseColaux = mouseCol + i;
          let mouseRowaux = mouseRow + j;
          if (withinCols(mouseColaux) && withinRows(mouseRowaux)) {
            if (random(100) < density ) {
              if (grid[mouseColaux][mouseRowaux] === ""){
                grid[mouseColaux][mouseRowaux]= colorPicker;
                let value = [mouseColaux, mouseRowaux, colorPicker];
                mainstack.push(value);
              }
            }
          }
        }
      }
    }
  }
}

function draw_grid() {
  for (let i = 0; i < cols; i++) {
    for (let j = rows-1; j >= 0; j--) {
      noStroke();
      if (grid[i][j] !== "") { 
        fill(grid[i][j]);
        let x = i * w ;
        let y = j * w ;
        square(x, y, w );
      }
    }
  }
}

function change_direction(){
  while (!mainstack.isEmpty()) {
    let val = mainstack.pop();

    let i = val[0];
    let j = val[1];
    let state = val[2];
    if (state !== "") { // Check if the cell is not empty
      let below = grid[i][j + 1];
      if (withinRows(j + 1) && below === "") {
        auxgrid[i][j + 1] = state;
        let value = [i, j+1, state];
        auxstack.push(value);
      } else {
        let below = "!";
        let belowA = "!";
        let belowB = "!";
        let direction = random(1);
        if (withinCols(i)) below = grid[i][j + 1];
        if (withinCols(i + 1)) belowA = grid[i + 1][j + 1];
        if (withinCols(i - 1)) belowB = grid[i - 1][j + 1];

        if (below === "" && withinRows(j + 1)) {
          auxgrid[i][j + 1] = state;
          let value = [i, j+1, state];
          auxstack.push(value);
        } else if (belowA === "" && (direction < 0.5 || belowB === "!")) {
          auxgrid[i + 1][j + 1] = state;
          let value = [i+1, j+1, state];
          auxstack.push(value);
        } else if (belowB === "" && (direction >= 0.5 || belowA === "!")) {
          auxgrid[i - 1][j + 1] = state;
          let value = [i-1, j+1, state];
          auxstack.push(value);
        } else {
          auxgrid[i][j] = state;
          let value = [i, j, state];
          auxstack.push(value);
        }
      }
    } else {
      auxgrid[i][j] = "";
    }
  }
  
  
  /*for (let j = rows - 1; j >= 0; j--) {
    for (let i = cols - 1; i >= 0; i--) {
      let state = grid[i][j];
      if (state !== "") { // Check if the cell is not empty
        let below = grid[i][j + 1];

        if (withinRows(j + 1) && below === "") {
          auxgrid[i][j + 1] = state;
        } else {
          let below = "!";
          let belowA = "!";
          let belowB = "!";
          let direction = random(1);
          if (withinCols(i)) below = grid[i][j + 1];
          if (withinCols(i + 1)) belowA = grid[i + 1][j + 1];
          if (withinCols(i - 1)) belowB = grid[i - 1][j + 1];

          if (below === "" && withinRows(j + 1)) {
            auxgrid[i][j + 1] = state;
          } else if (belowA === "" && (direction < 0.5 || belowB === "!")) {
            auxgrid[i + 1][j + 1] = state;
          } else if (belowB === "" && (direction >= 0.5 || belowA === "!")) {
            auxgrid[i - 1][j + 1] = state;
          } else {
            auxgrid[i][j] = state;
          }
        }
      } else {
        auxgrid[i][j] = "";
      }
    }
  }*/
}


function draw() {
  if (mouseIsPressed || !mainstack.isEmpty() || !auxstack.isEmpty()){
  let background_color = getComputedStyle(document.querySelector("html")).backgroundColor;
  
  background(background_color);

  if (mouseIsPressed) MouseIsPressed();

  while (!auxstack.isEmpty()){
    let x = auxstack.pop();
    mainstack.push(x);
  }

  draw_grid();

  let colorButtons = document.querySelectorAll('.color_picker_button');
  // Add event listeners to each color button
  colorButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Get the color class of the clicked button
      let background = getComputedStyle(button);

        // Set the colorPicker variable to the background color
      colorPicker = background.backgroundColor;
    });
  });

  let color_chart  = document.getElementById('favcolor');

  //use input = color 
  color_chart.addEventListener('input', function(event) {
    const selectedColor = event.target.value;
    changed = true;
    if (selectedColor != colorPicker){
      colorPicker = selectedColor;
    }
  })
  //change the buttons background colors
      if (mouseIsPressed && changed == true) {
        let color1 = colorPicker;
        changed = false;
        for (let buttonIndex = colorButtons.length - 1; buttonIndex >= 0 ; --buttonIndex){
            let background = getComputedStyle(colorButtons[buttonIndex]);
            if (background.display != 'none'){
              color2 = background.backgroundColor;

              colorButtons[buttonIndex].setAttribute('style', `background-color: ${color1};`);
   
              color1 = color2; 
            }                 
        }
      }
      
  let sizeListener = document.getElementById("SizeSlider");
  sizeListener.oninput = function(){
    size = sizeListener.value;
  }

  let densityListener = document.getElementById("DensitySlider");
  densityListener.oninput = function(){
    density = densityListener.value;
  }
  auxgrid = Make2DArray(cols, rows);

  change_direction();

  grid = auxgrid;
    }
}
