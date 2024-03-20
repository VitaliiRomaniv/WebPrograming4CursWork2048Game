var board;
var score = 0;
var rows = 4;
var columns = 4;
var colorScheme = 'default';

let milestone500Reached = false;
let milestone1000Reached = false;
let milestone1500Reached = false;
let milestone2000Reached = false;

window.onload = function() {
    changeColorScheme();
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

}

function displayCongratulations(container, message) {
    // Create a new paragraph element for the message
    let congratsMessage = document.createElement("p");
    congratsMessage.textContent = message;

    // Add the message to the container
    container.appendChild(congratsMessage);

    // Automatically remove the message after a certain time (e.g., 5 seconds)
    setTimeout(() => {
        container.removeChild(congratsMessage);
    }, 5000); // 5000 milliseconds = 5 seconds
}

function checkScoreMilestone(score) {
    let congratulationsContainer = document.getElementById("congratulationsContainer");

    if (score >= 500 && score < 1000 && !milestone500Reached) {
        milestone500Reached = true;
        displayCongratulations(congratulationsContainer, "Congratulations! You've reached a score of 500.");
    } else if (score >= 1000 && score < 1500 && !milestone1000Reached) {
        milestone1000Reached = true;
        displayCongratulations(congratulationsContainer, "Congratulations! You've reached a score of 1000.");
    } else if (score >= 1500 && score < 2000 && !milestone1500Reached) {
        milestone1500Reached = true;
        displayCongratulations(congratulationsContainer, "Congratulations! You've reached a score of 1500.");
    } else if (score >= 2000 && !milestone2000Reached) {
        milestone2000Reached = true;
        displayCongratulations(congratulationsContainer, "Congratulations! You've reached a score of 2000.");
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();

    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
    checkGameLost();
    checkScoreMilestone(score);
    checkGameWon();
})

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row)
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

function changeColorScheme() {
    var selectBox = document.getElementById("colorScheme");
    colorScheme = selectBox.options[selectBox.selectedIndex].value;
    document.body.className = colorScheme;
    updateTileColors();
}

function updateTileColors() {
    var tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        updateTile(tile, parseInt(tile.innerText));
    });
}

function isMovable() {
    // Check if there are adjacent cells with the same value
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (r + 1 < rows && board[r][c] === board[r + 1][c]) {
                return true;
            }
            if (c + 1 < columns && board[r][c] === board[r][c + 1]) {
                return true;
            }
        }
    }
    return false;
}

function resetGame() {
    window.location.reload();
}

function checkGameLost() {
    if (!hasEmptyTile() && !isMovable()) {
        // Display notification and ask for restart
        if (confirm("Game Over! You Lost. Do you want to restart?")) {
            // If user confirms restart, reset the game
            resetGame();
        }
    }
}

function checkGameWon() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 2048) {
                // Display fireworks and any other victory animations
                showVictoryOverlay();
                return true; // Game is won
            }
        }
    }
    return false; // Game is not won
}

function showVictoryOverlay() {
    const overlay = document.getElementById('victoryOverlay');
    overlay.style.display = 'flex';
}
