document.addEventListener("DOMContentLoaded", function () {
    console.log("Page loaded");

    const board = document.getElementById("board");

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "board-row";
        board.appendChild(row);
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");
            cell.className = "board-square";
            row.appendChild(cell);
        }
    }
});