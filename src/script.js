function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, col, player) => {
        if (row >= 3 || col >= 3 || board[row][col].getToken() !== '') {
            return;
        }

        board[row][col].addToken(player);

    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getToken()));
        console.log(boardWithCellValues);
    }

    const checkWin = () => {
        let message = '';
        let token = '';
        let isFull = true;

        
        // check if rows win
        board.forEach((row) => {
            token = row[0].getToken();

            if (token == row[1].getToken() && token == row[2].getToken() && token !== '' ) {
                message = ` wins!`;
            }
        });

        // check if cols win
        for (let col = 0; col < board.length; col++) {
            const token = board[0][col].getToken();
            if (token == board[1][col].getToken() && token == board[2][col].getToken() && token !== '') {
                message =  ` wins!`;
            }
            
        }
        token = board[0][0].getToken();
        if (token == board[1][0].getToken() && token == board[2][0].getToken() && token !== '') {
            message =  ` wins!`;
        }

        //check if diagonals win
        token = board[0][0].getToken();
        if (token == board[1][1].getToken() && token == board[2][2].getToken() && token !== '') {
            message =  ` wins!`;
        }

        token = board[0][2].getToken();
        if (token == board[1][1].getToken() && token == board[2][0].getToken() && token !== '') {
            message = ` wins!`;
        }

        // check if board full
        board.forEach((row) => {
            row.forEach(cell => {
                if (cell.getToken() === '') isFull = false;
            });
        });
        
        if (!message && isFull) message = "Tie!";

        if(message == 'Tie!') {
            console.log(message);
        } else if (message) {
            // console.log(game.getActivePlayer().name + message);
            console.log("the message is " + message);
        }

        return message;

    }



    return {
        getBoard,
        placeToken,
        printBoard,
        checkWin
    };

}

function Cell() {
    let value = '';

    const addToken = (player) => {
        value = player;
    };

    const getToken = () => value;

    return {
        addToken,
        getToken
    }
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {
            name:playerOneName,
            token: "x"
        },
        {
            name: playerTwoName,
            token: 'o'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, col) => {
        if (board.getBoard()[row][col].getToken() !== '') return;

        console.log(
            `Placing ${getActivePlayer().name}'s token in row ${row}, column ${col}...`
        );
        board.placeToken(row, col, getActivePlayer().token);
        
        // stop condition
        let message = board.checkWin();
        if (message) {
            board.printBoard();
            console.log("playround message" + message)
            return message;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}


function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, rowIndex) => {
            row.forEach( (cell,colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = colIndex;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = cell.getToken();

                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn || !selectedRow) return;

        let message = game.playRound(selectedRow, selectedColumn);

        // check win
        let playerWinDiv = document.querySelector(".turn");
        if (message) {
            if(message == 'Tie!') {
                playerWinDiv.textContent = message;
                boardDiv.removeEventListener("click", clickHandlerBoard);
            } else {
                playerWinDiv.textContent = `${game.getActivePlayer().name} Wins!`;
                boardDiv.removeEventListener("click", clickHandlerBoard);
            }

            boardDiv.textContent = '';
            const board = game.getBoard();
            board.forEach((row, rowIndex) => {
                row.forEach( (cell,colIndex) => {
                    const cellButton = document.createElement("button");
                    cellButton.classList.add("cell");
    
                    cellButton.dataset.column = colIndex;
                    cellButton.dataset.row = rowIndex;
                    cellButton.textContent = cell.getToken();
    
                    boardDiv.appendChild(cellButton);
                })
            })


        } else {

            updateScreen();
        }

    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();


}



ScreenController();


