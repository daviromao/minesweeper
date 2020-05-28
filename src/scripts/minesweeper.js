const height = 6;
const width = 5;
const totalMines = 10;

let grid = [];


function start(){
  createGridDataStructure();
  shuffleGrid();
  countAdjacentPlaces();
  renderGrid();
}

function createGridDataStructure(){
  grid = Array(height).fill().map(() => Array(width).fill(0));
}

function shuffleGrid(){
  let mines = 0;
  let x, y;

  while(mines < totalMines){
    generateRandomPosition()
    if(!grid[y][x]){
      grid[y][x] = -1;

      mines++;
    }
  }

  function generateRandomPosition(){
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
  }
}

function countAdjacentPlaces(){
  for(let y = 0; y < height; y++){
    for(let x = 0; x < width; x++){
      if(!isMine(x, y)) continue;
      
      count(x-1, y-1); // NW
      count(x, y-1);   //N
      count(x+1, y-1); //NE
      count(x+1, y);   //E
      count(x+1, y+1); //SE
      count(x, y+1);   //S
      count(x-1, y+1); //SW
      count(x-1, y);   //W

    }
  }

  function isValidCount(x, y){
    return ((x >= 0 && x < width) && (y >= 0 && y < height));
  }

  function isMine(x, y){
    return grid[y][x] == -1;
  }

  function count(x, y){
    if(isValidCount(x, y) && !isMine(x, y)){
      grid[y][x]++;
    }
  }

}

function renderGrid(){
  console.log(grid);
}

start();

