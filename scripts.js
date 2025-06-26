

function game() {

    const boardPlacements = {
        "X": 0,
        "O": 1,
    }

    // gameboard object
    const gameboard = (function() {
        return {
            board: [
                [-1,-1,-1],
                [-1,-1,-1],
                [-1,-1,-1]
            ]
        }
    })()

    // Rounds
    let round = 1
    const addRound = () => round++;
    const getRound = () => round;


    //player object
    function player(name, playerNumber) {
    return {
        name,
        playerNumber
    }
}   

    const checkWinner = () => {
        const X_ROW_WINNER = [boardPlacements.X, boardPlacements.X, boardPlacements.X]
        const O_ROW_WINNER = [boardPlacements.O, boardPlacements.O, boardPlacements.O]
        const board = gameboard.board.slice();
        console.log(board);

        const cols = [
            [board[0][0], board[1][0], board[2][0]], 
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]]
        ]

        //create Diags array
        const diags = [
            [board[0][0], board[1][1], board[2][2]], 
            [board[0][2], board[1][1], board[2][0]]
        ]

        //append diags and cols to board
        //concat adds arrays onto the main array
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
        const concatBoard = board.concat(diags, cols);

        //function to compare rows
        const checkRow = (row, checkingRow) => {
            if (row.every((element, index) => element === checkingRow[index])) {
                return true;
            }
            return false;
        }

        
        //check row
        for (row of concatBoard) {
            if (checkRow(row, X_ROW_WINNER)) {
                return true
            }
            if (checkRow(row, O_ROW_WINNER)) {
                return true
            }
        }
            
            // if no winner return false
            return false;
    }

    //make a move
    const makeMove = (player, x, y) => {
        gameboard.board[x][y] = player.playerNumber;
    }
    
    return {
        player1: player("player1", 0),
        player2: player("player2", 1),
        gameboard,
        getRound,
        addRound,
        makeMove,
        checkWinner,
        boardPlacements
    }
}

function gameProgress() {

    let gameCompleted = false;

    const gameMarkings = {
        0: "X",
        1: "O"
    }

    const newGame = game();

    const displayBoard = () => {
        for (let x = 0; x < newGame.gameboard.board.length; x++) {
            for (let y = 0; y < newGame.gameboard.board.length; y++) {
                const gridCell = document.getElementById(`${x}-${y}`);
                if (newGame.gameboard.board[x][y] !== -1) {
                    gridCell.innerText = gameMarkings[newGame.gameboard.board[x][y]];
                } else {
                    gridCell.innerText = "";
                }
                
            }
        }
    };

    let currentPlayer = newGame.player1;

    const setCurrentPlayer = () => {
        document.querySelector("#currentPlayer").innerText = currentPlayer.name;
    };

    const updatePlayer = () => {
        if (currentPlayer.playerNumber === newGame.player1.playerNumber) {
            currentPlayer = newGame.player2;
        } else {
            currentPlayer = newGame.player1;
        }
    }

    const endGame = (draw) => {
        gameCompleted = true;
        if (!draw) {
            document.querySelector("#currentPlayer").innerText = `${currentPlayer.name} wins!`
            return
        }
        document.querySelector("#currentPlayer").innerText = `draw!`      
    };

    const gameTurn = (x, y) => {
        newGame.makeMove(currentPlayer, parseInt(x), parseInt(y))
        displayBoard()
        if (newGame.checkWinner()) {
            endGame(draw=false)
        } else {
            if (newGame.getRound() === 9) {
                endGame(draw=true)
            } else {
                updatePlayer();
                setCurrentPlayer();
                newGame.addRound()
            }   
        }
    }

    //setup event listeners for grid cells
    document.querySelectorAll(".gridCell").forEach((el) => {
        el.addEventListener("click", (e) => {
            if (!gameCompleted) {
                gameTurn(e.target.dataset.x, e.target.dataset.y)
            }
            
        })
    });

    setCurrentPlayer()
    displayBoard()

    return {
        newGame,
        currentPlayer,
        round: newGame.getRound(),
        displayBoard,
        setCurrentPlayer,
    }
}

document.querySelector("#startGame").addEventListener("click", () => {
    gameProgress()
})