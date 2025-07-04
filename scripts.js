class Gameboard {
    constructor() {
        this.board = [
                [-1,-1,-1],
                [-1,-1,-1],
                [-1,-1,-1]
        ];
    }
}

class Player {
    constructor(name, playerNumber) {
        this.name = name;
        this.playerNumber = playerNumber;
    }
}

class Game {
    constructor() {
        this.round = 1;
        this.gameboard = new Gameboard;
        this.boardPlacements = {
                    "X": 0,
                    "O": 1,
        };
        this.player1 = new Player("Player 1", 0);
        this.player2 = new Player("Player 2", 1);
    }

    addRound() { 
        return this.round++ 
    };
    getRound() {
        return this.round
    };


    checkWinner() {
        const X_ROW_WINNER = [this.boardPlacements.X, this.boardPlacements.X, this.boardPlacements.X]
        const O_ROW_WINNER = [this.boardPlacements.O, this.boardPlacements.O, this.boardPlacements.O]
        const board = this.gameboard.board.slice();

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
        for (const row of concatBoard) {
            if (checkRow(row, X_ROW_WINNER)) {
                return true
            }
            if (checkRow(row, O_ROW_WINNER)) {
                return true
            }
        }
            
            // if no winner return false
            return false;
    };

    //make a move
    makeMove(player, x, y) {
        this.gameboard.board[x][y] = player.playerNumber;
    }
}

class GameProgress {

    constructor() {
        this.newGame = new Game();
        this.currentPlayer = this.newGame.player1;
        this.gameMarkings = {
            0: "X",
            1: "O"
        };
        this.gameCompleted = false;

        document.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = new FormData(event.target);

            if (form.get("player1Name") !== "") {
                this.newGame.player1.name = form.get("player1Name");
            }
            if (form.get("player2Name") !== "") {
                this.newGame.player2.name = form.get("player2Name");
            }
            this.setCurrentPlayer()
        });
        //setup event listeners for grid cells
        document.querySelectorAll(".gridCell").forEach((el) => {
            el.addEventListener("click", (e) => {
                if (!this.gameCompleted) {
                    this.gameTurn(e.target.dataset.x, e.target.dataset.y)
                }
                
            })
        });

        this.setCurrentPlayer();
        this.displayBoard();  
    }

    displayBoard() {
        for (let x = 0; x < this.newGame.gameboard.board.length; x++) {
            for (let y = 0; y < this.newGame.gameboard.board.length; y++) {
                const gridCell = document.getElementById(`${x}-${y}`);
                if (this.newGame.gameboard.board[x][y] !== -1) {
                    gridCell.innerText = this.gameMarkings[this.newGame.gameboard.board[x][y]];
                } else {
                    gridCell.innerText = "";
                }
                
            }
        }
    }

    setCurrentPlayer() {
        document.querySelector("#currentPlayer").innerText = `${this.currentPlayer.name}'s Turn (${this.gameMarkings[this.currentPlayer.playerNumber]})`;
    }

    getCurrentPlayer() {
        currentPlayer
    }

    updatePlayer = () => {
        if (this.currentPlayer.playerNumber === this.newGame.player1.playerNumber) {
            this.currentPlayer = this.newGame.player2;
        } else {
            this.currentPlayer = this.newGame.player1;
        }
    }

    endGame(draw) {
        this.gameCompleted = true;
        if (!draw) {
            document.querySelector("#currentPlayer").innerText = `${this.currentPlayer.name} wins!`
            return
        }
        document.querySelector("#currentPlayer").innerText = `draw!`      
    }

    gameTurn(x, y) {
        if (this.newGame.gameboard.board[parseInt(x)][parseInt(y)] !==  -1) {
            return
        };

        this.newGame.makeMove(this.currentPlayer, parseInt(x), parseInt(y))
        this.displayBoard()
        if (this.newGame.checkWinner()) {
            this.endGame(false);
        } else {
            if (this.newGame.getRound() === 9) {
                this.endGame(true);
            } else {
                this.updatePlayer();
                this.setCurrentPlayer();
                this.newGame.addRound()
            }   
        }
    }
}

document.querySelector("#startGame").addEventListener("click", () => {
    new GameProgress()
})

