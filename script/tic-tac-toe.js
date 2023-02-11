const statusDisplay = document.querySelector('.status');
const scoreDisplay = document.querySelector('.score'); //creating new variable for HTML score element, to update score later on

let gameActive = true;
let currentPlayer = handleStartingMove();
let gameState = ["", "", "", "", "", "", "", "", ""];
let xWins = 0;
let oWins = 0;
let ties = 0;

function winningMessage(){
    if(currentPlayer === "X"){
        return `You beat an AI, congrats!`;    //new custom winning messages
    }else{
        return `You let a bot beat you...`;
    }
} 
const drawMessage = () => `Game ended in a draw!`;
function currentPlayerTurn(){
    if(currentPlayer === "X"){
        return `It's your turn!`;    //new custom turn messages
    }else{
        return `The computer is playing!`;
    }
}
const scoreboard = () => `Player wins: ${xWins} | Computer wins: ${oWins} | Ties: ${ties}`; //scoreboard HTML element to dynamically change scoreboard when fctn called.

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

if(currentPlayer === "O"){ //computer should auto start turn when its turn at start of app
    handleCellClick();
}

function handleCellPlayed(clickedCellIndex, clickedCell) {
    gameState[clickedCellIndex] = currentPlayer;
    if(currentPlayer === "X"){
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add("xTile");  
        console.log("You went on tile "+clickedCellIndex);
    }else{
        $(`.cell[data-cell-index="${clickedCellIndex}"]`).html(currentPlayer);  //update tile with 'O' for computer random index instead of clickedCell.
        $(`.cell[data-cell-index="${clickedCellIndex}"]`).addClass("oTile");
        console.log("Computer went on tile "+clickedCellIndex);
    }
    
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    if(currentPlayer === "O"){
        handleCellClick();
    }else{
        console.log("It's your turn!");
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
            statusDisplay.setAttribute("role", "alert"); //if player win, set alert classes for bootstrap success alert
            statusDisplay.classList.add("alert");
            statusDisplay.classList.add("alert-success");
            statusDisplay.innerHTML = winningMessage();
            console.log("You beat the bot!");
        }else{
            oWins++;
            statusDisplay.style.color = "rgb(251,100,204)";
            statusDisplay.setAttribute("role", "alert"); //if computer wins, set alert for bootstrap danger alert
            statusDisplay.classList.add("alert");
            statusDisplay.classList.add("alert-danger");
            statusDisplay.innerHTML = winningMessage();
            console.log("The bot beat you...");
        }
        for(let i = 0; i <= 2; i++){
            $(`.cell[data-cell-index="${winCondition[i]}"]`).addClass("wonTile");  //iterate the win conditon cells to highlight them
        }
        scoreDisplay.innerHTML = scoreboard();
        gameActive = false;
        console.log("New Score:\nPlayer wins: "+xWins+"\nComputer wins: "+oWins+"\nTies: "+ties);
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        ties++;
        statusDisplay.innerHTML = drawMessage();
        scoreDisplay.innerHTML = scoreboard();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        console.log("Game ended in a draw!");
        console.log("New Score:\nPlayer wins: "+xWins+"\nComputer wins: "+oWins+"\nTies: "+ties);
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
        setTimeout(bufferAImove(), 2000);
        clickedCellIndex = handleAIMove(); //if computers move, call AI move to calc the move.
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
        handleCellPlayed(clickedCellIndex);
    }

    handleResultValidation();
}

function bufferAImove(){ //buffer function for AI move timeout
    console.log("Calculated computer move.");
}

function handleRestartGame() {
    console.log("Starting new game...");
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.style.color = "rgb(170, 100, 200)";
    statusDisplay.innerHTML = currentPlayerTurn();
    statusDisplay.classList.remove("alert");
    statusDisplay.classList.remove("alert-success"); //resets alert classes from bootstrap
    statusDisplay.classList.remove("alert-danger");
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove("wonTile")); //remove highlight from tiles
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove("xTile"));
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove("oTile"));
    currentPlayer = handleStartingMove();
    if(currentPlayer === "O"){ //if next is computers turn, go right away.
        handleCellClick();
    }
}

function handleAIMove () {
    do{
        var move = Math.floor(Math.random() * 9); //for AI move, generate rand nums from 0-8 until one of them is available.
    }while(gameState[move] !== "");
    return move;
}

function handleStartingMove(){
    start = Math.floor(Math.random() * 2);
    if(start == 0){
        console.log("You are starting!");
        return "X";
    }else{
        console.log("The computer started!");
        return "O";
    }
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.restart').addEventListener('click', handleRestartGame);