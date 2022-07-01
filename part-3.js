let rs = require('readline-sync');

//maybe GUI problem is that you want to find a way to make th GUI easier to read that letters go up and down and numbers go left to right

//creating the variables
let startQuestion;
let restartQuestion;
let strike;
let shipCount = 5;
let shipCoordinates;
shipCoordinates = [];
let guess = [];
let isSunk;
let hits = [];
let miss = [];


let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

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
   let grid = [];
   for (let i =0; i< size; i++) {
      grid[i] = [];
      for (let j= 0; j< size; j++) {
         //making the grid equal
         grid[i][j] = `-`;
      }
   }
   return grid
}


//this is to first initialize the ships and show the initial map
function printGrid2() {
   let newArray = [];
   for(let i =0; i< theGrid.length; i++) {
      let row = []
      for(let j =0; j< theGrid.length; j++) {
/*          if (shipCoordinates.flat().includes(convertCoordinates(`${i}${j}`))){
            // row[j] = 'S'
            row[j] = '-'
         } else {
         row[j] = '-'
         } */
         row[j] = '-'
      } 
      newArray.push(row);
   }
   // return newArray;
   console.table(newArray);
}



function convertCoordinates(val) {
   let converted = letters[val[0]] + (+val[1] + 1);
   // letters[val[0]] + (+val[1] + 1);
   // console.log(converted, 'converted');
   return converted;
}


//this function is to purposely update the 
//board as either hit or miss from the hit or miss array
function checkHitGrid2() {
   let newArray = [];
   for(let i =0; i< theGrid.length; i++) {
      let row = []
      for(let j =0; j< theGrid.length; j++) {
         if (hits.flat().includes(convertCoordinates(`${i}${j}`))){
            // console.log(`${i}${j}`, 'cc dash')
            // row[j] = '-'
            row[j] = 'O'

         } else if(miss.flat().includes(convertCoordinates(`${i}${j}`))) {
            row[j] = 'X'
         } else {
            row[j] = '-'
         }

      } 
      newArray.push(row);
   }
   // return newArray;
   console.table(newArray);
}




//these generate the ship
function generateShip(ship) {
      // this measures 0 or 1 
   let randomVertOrHorizontal= Math.floor(Math.random() * 2); 
   let shipSizes = ship.size // 
   let gridSize = theGrid.length;
   let coordsLetters = [];
   let offGrid = false;

   if (randomVertOrHorizontal === 0) {
      //vertical
      //this increases the letter count
      let newArr = letters.slice(0, -shipSizes );
      let randomLetter = newArr[Math.floor(Math.random() * newArr.length)];
      let randomLetterIndex = letters.indexOf(randomLetter) + 1;
      
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
      // console.log(shipCoordinates, 'shipcoordinates');

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
      let randomNum = Math.floor(Math.random() * newArrNum) + 1;
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
         // console.log(shipCoordinates, 'shipcoordinates');


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

//these are to locally test the different functions 
// of iterating ships and creating the grid
/* deployShips();
printGrid2(); */






//Game Logic Breakdown
function playerStrike() { 
   strike = rs.question("Enter a location to strike i.e., 'A2' from A-J and 1-10 ", 
   {
      limit: /^[a-j]([123456789]|10)$/i,
      limitMessage: "That is not a proper location. Try again.",
   }
   );
   strike = strike.toUpperCase();
   if (guess.includes(strike)) {
      console.log('You have already picked this location. Miss!');
      return playerStrike();
   } else {
      guess.push(strike);
      console.clear();
      // console.log(guess, 'guess array');
      checkForHit(strike);
      console.log('Miss!')
      miss.push(strike);
      checkHitGrid2()
      return playerStrike();
   }  
}

function checkForHit(strike) {
   let isHit = false;
   ships.map(ship => {
      if(ship.coords.flat().includes(strike)){
         isHit = true;
         // console.log(ship.coords, 'shipcoords checkForHit');
         // playerStrike();
         if (isHit = true) {
            console.log('Hit!')
            hits.push(strike);
            ship.hits++;
            checkHitGrid2()
            breakLine();

            // console.log(ship.hits, 'shiphits');
            if(ship.hits === ship.size) {
               shipCount--;
               isSunk = true
               if(isSunk = true) {
                  console.log(`You sunk a ${ship.name}. There are ${shipCount} ships left!`);
                  
                  if (shipCount === 0) {
                     gameOver();
                  } else {
                     playerStrike();
                  }
               }
            }
            playerStrike();
         } else {
            console.log('Miss!');
            miss.push(strike);
            checkHitGrid2()
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
   printGrid2();
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
   hits = [];
   miss = [];
}

function breakLine() {

   console.log('                                       ');
   console.log('---------------------------------------');
}

