const height = 11;
const width = 7;
const totalMines = 10;

let grid = [];
let initialized = false;

function startGame(safeX, safeY){
  createGridDataStructure();
  shuffleGrid(safeX, safeY);
  countAdjacentPlaces();

  console.log(grid);

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
    safe = ![x, x-1, x+1].includes(safeX) || ![y, y-1, y+1].includes(safeY);
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
      html += `<td id="${String(column)+String(row)}" onClick="clickedCell(this)"/>`;
    }
    html +='</tr>';
  }

  html +='</table>';

  document.querySelector('div.fireCanvas').innerHTML = html;
}

function clickedCell(thisCell){
  const x = parseInt(thisCell.id[0]);
  const y = parseInt(thisCell.id[1])

  if(!initialized) startGame(x, y);

  thisCell.className = 'clicked';
  thisCell.innerHTML = grid[y][x];

  initialized = true;
}

renderGrid();
