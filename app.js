const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const updateBoard = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, updateBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return currentPlayer.name;
            }
        }
        return board.includes("") ? null : "Tie";
    };

    const playTurn = (index) => {
        if (!gameOver && Gameboard.updateBoard(index, currentPlayer.marker)) {
            const winner = checkWin();
            if (winner) {
                gameOver = true;
                DisplayController.showResult(winner);
            } else {
                switchPlayer();
                DisplayController.updateStatus(`${currentPlayer.name}'s Turn`);
            }
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        DisplayController.render();
        DisplayController.updateStatus(`${currentPlayer.name}'s Turn`);
    };

    return { playTurn, resetGame };
})();

const DisplayController = (() => {
    const boardElement = document.getElementById("gameboard");
    const statusElement = document.getElementById("game-status");
    const restartButton = document.getElementById("restart");

    const render = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            if (cell !== "") {
                cellElement.classList.add("taken");
                cellElement.textContent = cell;
            }
            cellElement.addEventListener("click", () => GameController.playTurn(index));
            boardElement.appendChild(cellElement);
        });
    };

    const updateStatus = (message) => {
        statusElement.textContent = message;
    };

    const showResult = (winner) => {
        if (winner === "Tie") {
            updateStatus("It's a Tie!");
        } else {
            updateStatus(`${winner} Wins!`);
        }
    };

    restartButton.addEventListener("click", GameController.resetGame);

    return { render, updateStatus, showResult };
})();

DisplayController.render();
DisplayController.updateStatus("Player 1's Turn");
