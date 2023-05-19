const height = 11;
const width = 7;
const totalMines = 10;

let grid = [];
let initialized = false;
let gameOver = false;
let countOfRevealedCells = 0;

function startGame(safeX, safeY){
  createGridDataStructure();
  shuffleGrid(safeX, safeY);
  countAdjacentPlaces();
}

function createGridDataStructure(){
  grid = Array(height).fill().map(() => Array(width).fill(0));
}

function shuffleGrid(safeX, safeY){
  let mines = 0;
  let x, y;

  while(mines < totalMines){
    generateRandomPosition()

    if(!grid[y][x] && isSafe()){
      grid[y][x] = -1;

      mines++;
    }
  }

  function generateRandomPosition(){
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
  }

  function isSafe(){
    const safe = ![x, x-1, x+1].includes(safeX) || ![y, y-1, y+1].includes(safeY)
    return safe;
  }

}

function countAdjacentPlaces(){
  for(let row = 0; row < height; row++){
    for(let column = 0; column < width; column++){
      if(!isMine(column, row)) continue;
      
      count(column-1, row-1); // NW
      count(column, row-1);   //N
      count(column+1, row-1); //NE
      count(column+1, row);   //E
      count(column+1, row+1); //SE
      count(column, row+1);   //S
      count(column-1, row+1); //SW
      count(column-1, row);   //W

    }
  }

  function isMine(x, y){
    return grid[y][x] == -1;
  }

  function isValidCount(x, y){
    return ((x >= 0 && x < width) && (y >= 0 && y < height));
  }

  function count(x, y){
    if(isValidCount(x, y) && !isMine(x, y)){
      grid[y][x]++;
    }
  }

}

function renderGrid(){
  let html = '<table cellpadding=0 cellspacing=0>';

  for(let row = 0; row < height; row++){
    html +='<tr>';

    for(let column = 0; column < width; column++){
      html +=
      `<td id="cell${String(column)}-${String(row)}"" 
        onClick="clickedCell(this)"
      />`;
    }
    html +='</tr>';
  }
  html +='</table>';

  initialized = false;
  gameOver = false;
  countOfRevealedCells = 0;

  document.querySelector('div.fireCanvas').innerHTML = html;
  document.querySelector('h1').innerHTML = "💣 Minesweeper 💣";
}

function clickedCell(cell){
  const coords = cell.id.slice(4).split('-')
  const x = parseInt(coords[0]);
  const y = parseInt(coords[1]);

  if(!initialized) startGame(x, y);

  floodFill(cell, x, y) ;
  revealCell(cell, x, y);

  if(grid[y][x] == -1){
    gameOver = true;
    revealAll();
    document.querySelector('h1').innerHTML = "💣 Gameover 💣";
  } else if(countOfRevealedCells == (width * height) - totalMines){
    gameOver = true;
    document.querySelector('h1').innerHTML = "🎉 You won! 🎉";
  }

  gameOver = false;
  initialized = true;
}

function floodFill(cell, x, y){
  if (grid[y][x] == 0 && !cell.className){
    revealCell(cell, x, y);

    if(x > 0){
      let nextCell = document.querySelector(`#cell${x-1}-${y}`);
      floodFill(nextCell, x-1, y);
    }

    if(x < width - 1 ){
      let nextCell = document.querySelector(`#cell${x+1}-${y}`);
      floodFill(nextCell, x+1, y);
    }

    if(y > 0){
      let nextCell = document.querySelector(`#cell${x}-${y-1}`);
      floodFill(nextCell, x, y-1);
    }

    if(y < height - 1 ){
      let nextCell = document.querySelector(`#cell${x}-${y+1}`);
      floodFill(nextCell, x, y+1);
    }
  }else if(grid[y][x] > 0){
    revealCell(cell, x, y);
  }

}

function revealCell(cell, x, y){
  if(cell.className) return;
  cell.className = 'clicked';

  if(grid[y][x] == -1){
    cell.innerHTML = '💣';
  }else if(grid[y][x] > 0){
    cell.innerHTML = grid[y][x];
  }

  countOfRevealedCells++;
}

function revealAll(){
  for(let row = 0; row < height; row++){
    for(let column = 0; column < width; column++){
      let cell = document.querySelector(`#cell${column}-${row}`);
      if(grid[row][column] == -1){
        revealCell(cell, column, row);
      }
    }
  }
}

renderGrid();
