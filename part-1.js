let rs = require('readline-sync');

//variables
let strike;
let hits = [];
let isSunk = false;
let restartQuestion;
let startQuestion;
let misses = [];
let ships = []
let guess = []
let totalShips = 2;

//there is a bug that makes the same coordinate. Fix that.
//current thought is to either duplication the function below
//and push the tto function into the ships array
//or create a new function that iterates through these ships like in part 2 and create a randomized ship iteration for less than two ships
function placeShips() {

   let possibleLet = ['A', 'B', 'C']
   let randomLetter = possibleLet[Math.floor(Math.random() * possibleLet.length)];
   // console.log(randomLetter, 'randomLetter');
   let randomLetterIndex = possibleLet.indexOf(randomLetter) + 1;
   // console.log(randomLetterIndex, 'randomLetterIndex');

   // temporaryShips.push(randomLetter + randomLetterIndex);
   // console.log(temporaryShips);

   if (ships.flat().includes(randomLetter + randomLetterIndex)) {
      return placeShips();
   } else {
      ships.push(randomLetter + randomLetterIndex);
      console.log(ships, 'ships array');
   }

   
};

function deployShips(){
   for(let i =0; i < totalShips; i++) {
      placeShips();
   }
}


function startGame() {
   startQuestion = rs.keyIn('Press any key to start the game ');
   deployShips();
   // console.log(ships);
}

//spawn the grid size, it's a multi dimensional array
let grid = [];
let alphabet = 'abc'.toUpperCase();

function createGrid(size) {
   let i;
   let j = 0;
   for (i =0; i< size; i++) {
      grid[i] = [];
      for (j= 0; j< size; j++) {
         //making the grid equal
         grid[i][j] = `${alphabet[i]}${j+1}`;
      }
   }
   return grid
}


function promptStrike() {
   strike = rs.question("Enter a location to strike i.e., 'A2' from A-C and 1-3 ", 
   {
      limit: /^[abc][123]$/i,
      limitMessage: "That is not a proper location. Try again.",
   }
   );
   strike = strike.toUpperCase();
   if (guess.includes(strike)) {
      console.log('You have already picked this location. Miss!');
      return promptStrike();
   } else {
      guess.push(strike);
      createHit();
   }
}

//function for creating a hit
function createHit() {
   if (strike === ships[0] || strike === ships[1]) {
      console.log('Hit!');
      hits.push(strike);
      checkForHit()
   } else {
      console.log('miss!');
      misses.push(strike);
      promptStrike();
   }
}

function checkForHit() {
   if (hits.length === 1) {
      console.log('Ship sunk!');
      promptStrike();
      checkIfSunk();
   } 
}

function checkIfSunk() {
   if (hits.length === 2) {
      isSunk === true;
      console.log('Game Over!')
      restartGame();
   }
}

//game logic for the game
function gameBattleShip() {
   startGame();
   while (isSunk === false) {
      promptStrike();  
      // createHit();
   }
}
gameBattleShip();


//restart game 
function restartGame() {
   strike;
   hits = [];
   isSunk = false;
   restartQuestion;
   startQuestion;
   misses = [];
   ships = [];
   guess = [];
   restartQuestion = rs.question('You destroyed all battleships, Would you like to play again? Y/N ');
   if (restartQuestion === 'Y' || restartQuestion === 'y') {
      gameBattleShip();
   } else {
      process.exit();
   }
}