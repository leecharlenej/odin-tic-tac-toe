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
        log(`dropToken running - ${player}`);
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
        log('printNewRound running');
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        log(`playRound running - ${getActivePlayer().token}`);
        console.log(`Filling in ${getActivePlayer().name}'s token into cell (${row}, ${column}).`);
        board.dropToken(row, column, getActivePlayer().token);

         /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {playRound, getActivePlayer};
}

const game = GameController();