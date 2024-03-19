var activeRow = 1;
var activeSquare = 1;
var row = null
function onStart() {
    console.log("run")
    const board = document.getElementById("board");

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "board-row";
        row.id = "row-" + (i + 1)
        board.appendChild(row);
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");
            cell.className = "board-square";
            cell.id = "square-" + (j + 1)
            row.appendChild(cell);
        }
    }


    row = document.getElementById("row-1")
}
window.onload = onStart



document.addEventListener("keydown", function handleKeyDown(event) {
    if (/^[a-zA-z]$/.test(event.key)) {
        let square = row.querySelector('#square-' + activeSquare)
        if (square != null && square.innerHTML == "") {
            console.log("in")
            square.innerHTML = event.key.toUpperCase()
            if (activeSquare != 5) {
                activeSquare++
            }

        }
    } else if (event.key == "Backspace") {
        console.log("Backspace")
        let square = row.querySelector('#square-' + activeSquare)
        if (square != null) {
            square.innerHTML = ""
            if (activeSquare != 1) {
                activeSquare--
            }

        }

    } else if (event.key == 'Enter') {
        console.log("Enter")
    }
})

