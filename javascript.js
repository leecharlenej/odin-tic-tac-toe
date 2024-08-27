console.log('test');

let logMessage = true;

function log(message) {
    if (logMessage) {
        console.log(`----- [LOG_MSG] ${message}`);
    }
}

/****************************************************
- Gameboard object: gameboard array
- Players stored in objects.
- Want object to control flow of game.
*****************************************************/

function Gameboard() {
    const size = 3;
    const board = [];

    for(let i=0; i<size; i++){
        board[i] = [];
        for (let j=0; j<size;j++) {
            board[i].push(Cell());
        }
    };

    const getBoard = () => board;

    const dropToken = (row, column, player) => {
        // log(`dropToken running - ${player}`);
        const chosenCell = board[row][column].getValue();
        if (chosenCell !== "_") {
            console.log(`ERROR: Cell has been chosen already - ${chosenCell}`)
            return;
        };
        board[row][column].addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return { getBoard, dropToken, printBoard };

}

function Cell() {
    let value = "_";

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addToken, getValue};
}

function GameController (
    playerOne = "X",
    playerTwo = "O"
) {
    const board = Gameboard();
    const players = [
        {name: playerOne, token: "X"},
        {name: playerTwo, token: "O"}
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1]: players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        // log('printNewRound running');
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        // log(`playRound running - ${getActivePlayer().token}`);
        console.log(`Filling in ${getActivePlayer().name}'s token into cell (${row}, ${column}).`);
        board.dropToken(row, column, getActivePlayer().token);

         /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
        let winner = checkForWinner(board, getActivePlayer().token);

        if(!winner) {
            log("Continue game");
            switchPlayerTurn();
            printNewRound();
        } else {
            console.log(`${winner} wins the game!`);
        };
    }

    printNewRound();

    return {playRound, getActivePlayer};
}

function checkForWinner(board, token) {
    log('checkForWinner running');
    let boardCells = board.getBoard();

    // Check rows
    for (let i=0; i < 3; i++) {
        let colOne = boardCells[i][0].getValue();
        let colTwo = boardCells[i][1].getValue();
        let colThree = boardCells[i][2].getValue();
        // log(`[For row ${i}] colOne: ${colOne}, colTwo:${colTwo}, colThree: ${colThree}`);
        
        if((colOne === token) &&(colOne === colTwo && colTwo === colThree)) {
            return colOne;
        }
    }

    // Check columns
    for (let j=0; j < 3; j++) {
        let rowOne = boardCells[0][j].getValue();
        let rowTwo = boardCells[1][j].getValue();
        let rowThree = boardCells[2][j].getValue();
        log(`[For col ${j}] rowOne: ${rowOne}, rowTwo: ${rowTwo}, rowThree: ${rowThree}`);
        log(rowOne === rowTwo === rowThree);
            
        if((rowOne === token) && (rowOne === rowTwo && rowTwo === rowThree)) {
            return rowOne;
        }
    }

    // Check diagonals
    let leftTop = boardCells[0][0].getValue();
    let middle = boardCells[1][1].getValue();
    let leftBottom = boardCells[2][2].getValue();

    let rightTop = boardCells[0][2].getValue();
    let rightBottom = boardCells[2][0].getValue();

    if ((middle === token) &&((leftTop === middle && middle === leftBottom) || (rightTop === middle && middle === rightBottom))){
        return middle;
    }

    return false;
}
    

// const game = GameController();

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
  
      // Render board squares
      board.forEach(row => {
        row.forEach((cell, index) => {
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.column = index
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        })
      })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column;
      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn) return;
      
      game.playRound(selectedColumn);
      updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
  
  ScreenController();