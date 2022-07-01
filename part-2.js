let rs = require('readline-sync');

//creating the variables

let startQuestion;
let restartQuestion;
let strike;
let shipCount = 5;
let shipCoordinates;
let guess = [];
let isSunk;



let ships =  [
   { name: 'Carrier', size: 5, hits: 0, coords: []},
   { name: 'BattleShip', size: 4, hits: 0, coords: []},
   { name: 'Submarine', size: 3, hits: 0, coords: []},
   { name: 'Cruiser', size: 3, hits: 0, coords: []},
   { name: 'Lifeboat', size: 2, hits: 0, coords: []},
];

//create grid
//this is to create the letters each array
let theGrid = [];
theGrid = createGrid(10);
function createGrid(size) {
   let alphabet = 'abcdefghij'.toUpperCase();
   let grid = [];
   for (let i =0; i< size; i++) {
      grid[i] = [];
      for (let j= 0; j< size; j++) {
         //making the grid equal
         grid[i][j] = `${alphabet[i]}${j+1}`;
      }
   }
   return grid
}

let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

shipCoordinates = [];
//these generate the ship
function generateShip(ship) {
   // console.log(ship.size, 'ship');
   let randomVertOrHorizontal= Math.floor(Math.random() * 2); // this measures 0 or 1 
   let shipSizes = ship.size // 
   let gridSize = theGrid.length;
   let coordsLetters = [];
   let offGrid = false;


   if (randomVertOrHorizontal === 0) {
      //vertical
      //this increases the letter count
      let newArr = letters.slice(0, -shipSizes );
      let randomLetter = newArr[Math.floor(Math.random() * newArr.length)];
      let randomLetterIndex = letters.indexOf(randomLetter);

      for (let i = 0; i<shipSizes; i++) {
         if (shipCoordinates.flat().includes(letters[randomLetterIndex + i] + randomLetterIndex)){
            return generateShip(ship);
         } 
         else
         {
            coordsLetters.push(letters[randomLetterIndex + i] + randomLetterIndex);
         }
      }

      shipCoordinates.push(coordsLetters);
      console.log(shipCoordinates, 'shipcoordinates');

      //this maps through the ships and pushes the coordinates from the local variable to the global 
      //which will then be used later to compare coordinates for checking the hit function
      ships.map(item => {
         if (ship.name === item.name) {
          item.coords.push(coordsLetters);

         }
      });
      // console.log(ship);
   } 
   else {
   // horizontal
      let newArrNum = gridSize - shipSizes;
      let randomNum = Math.floor(Math.random() * newArrNum);
      //this will be the random letter to be added when pushed
      let randomLetter = letters[Math.floor(Math.random() * gridSize)];

      for (let i = 0; i< shipSizes; i++) {
         if (shipCoordinates.flat().includes(randomLetter + [randomNum + i])){
            return generateShip(ship);
         } 
         else
         {
         coordsLetters.push(randomLetter + [randomNum + i]);
         }
      }
         // console.log(coordsLetters,'horizon');
         shipCoordinates.push(coordsLetters);
         console.log(shipCoordinates, 'shipcoordinates');


         //this maps through the ships and pushes the coordinates from the local variable to the global 
         //which will then be used later to compare coordinates for checking the hit function
         ships.map(item => {
            if (ship.name === item.name) {
             item.coords.push(coordsLetters) 
            }
         });
         // console.log(ship);
   }
}
//invoke this function to get the ships to deploy
function deployShips() {
   for(let i = 0; i< ships.length; i++) {
      generateShip(ships[i]);
   }
}
// deployShips();

//Game Logic Breakdown

function playerStrike() { 
   strike = rs.question("Enter a location to strike i.e., 'A2' from A-J and 0-9 ", 
   {
      limit: /^[abcdefghij][0123456789]$/i,
      limitMessage: "That is not a proper location. Try again.",
   }
   );
   strike = strike.toUpperCase();
   if (guess.includes(strike)) {
      console.log('You have already picked this location. Miss!');
      return playerStrike();
   } else {
      guess.push(strike);
      // console.log(guess, 'guess array');
      checkForHit(strike);
      console.log('Miss!')
      return playerStrike();
   }  
}

function checkForHit(strike) {
// what i learned: map the objects and specify what to do add within the objects
   let isHit = false;
   ships.map(ship => {
      if(ship.coords.flat().includes(strike)){
         isHit = true;
         // console.log(ship.coords, 'shipcoords checkForHit');
         if (isHit = true) {
            console.log('Hit!')
            ship.hits++;
            // console.log(ship.hits, 'shiphits');
            if(ship.hits === ship.size) {
               shipCount--;
               isSunk = true
               console.log(`You sunk a ${ship.name}. There are ${shipCount} ships left!`);

               if (shipCount === 0) {
                  gameOver();
               } else {
                  playerStrike();
               }
            }
            playerStrike();
         } else {
            isHit = false;
            console.log('Miss!');
            playerStrike();
         }
      } 
   })
} 



function gameOver() {
   console.log('You have destroyed all battleships')
   restartQuestion = rs.question('You destroyed all battleships, Would you like to play again? Y/N ');
   if (restartQuestion === 'Y' || restartQuestion === 'y') {
      startGame();
   } else {
      process.exit();
   }
}

function startGame() {
   startQuestion = rs.keyIn('Press any key to start the game ');
   cleanBeforeGame();
   deployShips();
   playerStrike();
}
startGame();

function cleanBeforeGame() {
   console.clear();
   startQuestion;
   restartQuestion;
   strike;
   shipCount = 5;
   shipCoordinates = [];
   isSunk;
   guess = [];
}