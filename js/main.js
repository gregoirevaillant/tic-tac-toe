const gameBoard = (() => {
    const playerFactory = (name, symbol, turn) => {
        return { name, symbol, turn };
    };

    const player1 = playerFactory("Player 1", "X", true);
    const player2 = playerFactory("Player 2", "O", false);

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let winner = null;
    let turns = 0;
    let board = [];
    let winnerCombo = [];

    const playerTurn = (function () {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
            cell.addEventListener("click", (e) => {
                if (
                    player1.turn == true &&
                    gameBoard.winner == null &&
                    e.target.textContent == ""
                ) {
                    cell.innerHTML = player1.symbol;
                    board[e.target.id] = player1.symbol;
                    cell.style.color = "purple";
                    player1.turn = false;
                    player2.turn = true;
                } else if (
                    player2.turn == true &&
                    gameBoard.winner == null &&
                    e.target.innerHTML == ""
                ) {
                    cell.innerHTML = player2.symbol;
                    board[e.target.id] = player2.symbol;
                    cell.style.color = "pink";
                    player1.turn = true;
                    player2.turn = false;
                } else {
                    return;
                }
                winCheck();
                cell.style.opacity = "1";
            });
        });
        return { cells };
    })();

    winCheck = () => {
        turns++;
        let Xplays = board.reduce(
            (a, e, i) => (e === "X" ? a.concat(i) : a),
            []
        );
        let Oplays = board.reduce(
            (a, e, i) => (e === "O" ? a.concat(i) : a),
            []
        );
        for (let [index, combo] of winningCombinations.entries()) {
            if (combo.every((elem) => Xplays.indexOf(elem) > -1)) {
                gameBoard.winner = "p1";
                gameBoard.winnerCombo = combo;
            } else if (combo.every((elem) => Oplays.indexOf(elem) > -1)) {
                gameBoard.winner = "p2";
                gameBoard.winnerCombo = combo;
            } else if (
                turns == 9 &&
                gameBoard.winner == null &&
                gameBoard.winnerCombo == null
            ) {
                gameBoard.winner = "tie";
                gameBoard.winnerCombo = combo;
            }
        }
        winDisplay();
        return winnerCombo;
    };
    gameReset = () => {
        gameBoard.winner = null;
        gameBoard.winnerCombo = undefined;
        player1.turn = true;
        player2.turn = false;
        turns = 0;
        board.splice(0, board.length);
    };
    return {
        winCheck,
        gameReset,
        playerTurn,
        board,
        player2,
        winnerCombo,
    };
})();

const displayController = (() => {
    winDisplay = () => {
        displayCombination = () => {
            for (let i = 0; i < gameBoard.winnerCombo.length; i++) {
                document.getElementById(
                    gameBoard.winnerCombo[i]
                ).style.backgroundColor = "#33333320";
            }
        };
        if (gameBoard.winner === "p1") {
            winnerDisplay.textContent = `X wins the round!`;
            displayCombination();
        } else if (gameBoard.winner === "p2") {
            winnerDisplay.textContent = `O wins the round!`;
            displayCombination();
        } else if (gameBoard.winner === "tie") {
            winnerDisplay.textContent = `It's a tie!`;
        } else {
            return;
        }
        startingSection.style.display = "none";
        gameSection.style.display = "flex";
        endingSection.style.display = "flex";
    };

    gamePlay = () => {
        startingSection.style.display = "none";
        gameSection.style.display = "flex";
        endingSection.style.display = "none";
    };

    restartgame = () => {
        cells.forEach((cell) => {
            cell.style.pointerEvents = "auto";
            cell.innerHTML = "";
            gameBoard.board[cell.id] = "";
        });
        startingSection.style.display = "none";
        gameSection.style.display = "flex";
        endingSection.style.display = "none";
        for (let i = 0; i < gameBoard.winnerCombo.length; i++) {
            document.getElementById(
                gameBoard.winnerCombo[i]
            ).style.backgroundColor = "#f5f5f5";
        }
        gameBoard.gameReset();
    };

    mainPage = () => {
        startButton.addEventListener("click", startGame);
        startingSection.style.display = "flex";
        gameSection.style.display = "none";
        endingSection.style.display = "none";
        restartGame();
    };
    const cellsContainer = document.querySelector(".cellsContainer");
    const cells = document.querySelectorAll(".cell");
    const winnerDisplay = document.querySelector(".winnerDisplay");

    const startingSection = document.querySelector(".startingSection");
    const gameSection = document.querySelector(".gameSection");
    const endingSection = document.querySelector(".endingSection");

    const startButton = document.querySelector(".start");
    startButton.addEventListener("click", gamePlay);

    const restartButton = document.querySelector(".restart");
    restartButton.addEventListener("click", restartgame);

    return { winDisplay, gamePlay };
})();
