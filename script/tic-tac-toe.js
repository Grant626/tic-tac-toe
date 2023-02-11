const statusDisplay = document.querySelector('.status');
const scoreDisplay = document.querySelector('.score');

let gameActive = true;
let currentPlayer = handleStartingMove();
let gameState = ["", "", "", "", "", "", "", "", ""];
let xWins = 0;
let oWins = 0;
let ties = 0;

function winningMessage(){
    if(currentPlayer === "X"){
        return `You beat an AI, congrats!`;    
    }else{
        return `You let a bot beat you...`;
    }
} 
const drawMessage = () => `Game ended in a draw!`;
function currentPlayerTurn(){
    if(currentPlayer === "X"){
        return `It's your turn!`;    
    }else{
        return `The computer is playing!`;
    }
}
const scoreboard = () => `Player wins: ${xWins} | Computer wins: ${oWins} | Ties: ${ties}`;

statusDisplay.innerHTML = currentPlayerTurn();
scoreDisplay.innerHTML = scoreboard();

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

if(currentPlayer === "O"){
    handleCellClick();
}

function handleCellPlayed(clickedCellIndex, clickedCell) {
    gameState[clickedCellIndex] = currentPlayer;
    if(currentPlayer === "X"){
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add("xTile");  
    }else{
        $(`.cell[data-cell-index="${clickedCellIndex}"]`).html(currentPlayer);
        $(`.cell[data-cell-index="${clickedCellIndex}"]`).addClass("oTile");
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
        winCondition = winningConditions[i];
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
        if(currentPlayer === "X"){
            xWins++;
            statusDisplay.style.color = "rgb(50,200,50)";
        }else{
            oWins++;
            statusDisplay.style.color = "rgb(251,100,204)";
        }
        for(let i = 0; i <= 2; i++){
            $(`.cell[data-cell-index="${winCondition[i]}"]`).addClass("wonTile");  
            console.log(winCondition[i]);
        }
        statusDisplay.innerHTML = winningMessage();
        scoreDisplay.innerHTML = scoreboard();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        ties++;
        statusDisplay.innerHTML = drawMessage();
        scoreDisplay.innerHTML = scoreboard();
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
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
        handleCellPlayed(clickedCellIndex);
    }

    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.style.color = "rgb(170, 100, 200)";
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove("wonTile"));
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove("xTile"));
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove("oTile"));
    currentPlayer = handleStartingMove();
    if(currentPlayer === "O"){
        handleCellClick();
    }
}

function handleAIMove () {
    //const time = setTimeout(console.log("AI Moving..."), 2000);
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