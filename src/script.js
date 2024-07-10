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
        } else {
            console.log(game.getActivePlayer().name + message);
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

function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
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
        console.log(
            `Placing ${getActivePlayer().name}'s token in row ${row}, column ${col}...`
        );
        board.placeToken(row, col, getActivePlayer().token);
        
        // stop condition
        let message = board.checkWin();
        if (message) {
            board.printBoard();
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        switchPlayerTurn
    };
}

const game = gameController();
