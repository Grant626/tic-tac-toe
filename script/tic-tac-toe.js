const statusDisplay = document.querySelector('.status');

let gameActive = true;
let currentPlayer = handleStartingMove();
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCellIndex, clickedCell) {
    gameState[clickedCellIndex] = currentPlayer;
    if(currentPlayer === "X"){
        clickedCell.innerHTML = currentPlayer;    
    }else{
        $(`.cell[data-cell-index="${clickedCellIndex}"]`).html(currentPlayer);
    }
    
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    if(currentPlayer === "O"){
        handleCellClick();
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent = 0) {
    if(currentPlayer === "X"){
        clickedCell = clickedCellEvent.target;
        clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
        handleCellPlayed(clickedCellIndex, clickedCell);
    }else{
        clickedCellIndex = handleAIMove();
        console.log("cci is: "+clickedCellIndex);
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
        handleCellPlayed(clickedCellIndex);
    }

    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = handleStartingMove();
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.style.color = "rgb(65, 65, 65)";
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function handleAIMove () {
    do{
        var move = Math.floor(Math.random() * 9);
    }while(gameState[move] !== "");
    return move;
}

function handleStartingMove(){
    start = Math.floor(Math.random() * 2);
    if(start == 0){
        return "X";
    }else{
        return "O";
    }
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.restart').addEventListener('click', handleRestartGame);

if(currentPlayer === "O"){

}