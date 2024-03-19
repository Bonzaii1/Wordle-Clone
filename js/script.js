var activeRow = 1;
var activeSquare = 1;
var row = null
var solved = false

var wordList = ["aisle", "mount", "panic", "weary"]
var word = "aisle"

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

function wordExists(word){
    left = 0
    right = wordList.length
    while(left < right){
        let mid = Math.floor((left + right) / 2)
        if(wordList[mid] === word){
            return true;
        }

        else if(wordList[mid] < word){
            left = mid + 1
        }else{
            right = mid - 1
        }
    }
    return false
}

function onAnimationEnd(element, anim, color){
    // Remove the class that specifies the animation properties
    element.classList.remove(anim);
    if(anim === "pop"){
        element.className = "board-square-selected"
    }else{
        element.className = "board-square-selected " + color 
    }
    

    // Remove the event listener to prevent memory leaks
    element.removeEventListener("animationend", onAnimationEnd);
}

function triggerAnimation(element, anim, color){
    
    element.classList.add(anim)
    element.addEventListener("animationend", function(){
        onAnimationEnd(element, anim, color)
    });
}





document.addEventListener("keydown", function handleKeyDown(event) {
    if (/^[a-zA-z]$/.test(event.key)) {
        let square = row.querySelector('#square-' + activeSquare)
        if (square != null && square.innerHTML == "") {
            
            
            square.innerHTML = event.key.toUpperCase()
            triggerAnimation(square)
            if (activeSquare != 6) {
                activeSquare++
            }
            
        }
    } else if (event.key == "Backspace") {
        console.log("Backspace")
        if (activeSquare != 1) {
            activeSquare--
        }
        let square = row.querySelector('#square-' + activeSquare)
        if (square != null) {
            
            square.innerHTML = ""
            square.className = "board-square"
            
            
            
        }

    } else if (event.key == 'Enter') {
        const solutionMap = new Map()
        const sol = []
        let guessArr = []
        let guess = ""

        for (let i = 0; i < 5; i++) {
            let letter = row.querySelector('#square-'+(i+1)).innerHTML.toLowerCase()
            guessArr[i] = letter
            guess = guess+letter
        } 

        const inList = wordExists(guess)
        if(activeSquare==6 && inList){
            for(letter of word){
                solutionMap.set(letter, (solutionMap.get(letter) || 0) + 1)
                sol.push(letter)
            }
              
            let correct = 0
            for (let i = 0; i < 5; i++) {
                
                let square = row.querySelector('#square-'+(i+1))
                
                if(guessArr[i] === sol[i]){
                    triggerAnimation(square, "flipGreen", "green")
                    solutionMap.set(guessArr[i], solutionMap.get(guessArr[i]) - 1)
                    correct++;
                }else if(solutionMap.has(guessArr[i])){
                    triggerAnimation(square, "flip", "yellow")
                    solutionMap.set(guessArr[i], solutionMap.get(guessArr[i]) - 1)
                }else{
                    triggerAnimation(square, "flip", "gray")
                }
                
            }

            if(correct === 5){
                console.log("You win!!")
                activeRow = 0
                activeSquare = 0
            }else if(activeRow == 6){
                console.log("You lose!!")
                activeRow = 0
                activeSquare = 0
            }else{
                activeRow++;
                activeSquare =1;
                row = document.getElementById("row-" + activeRow)
            }
            
        }else{
            if(activeRow == 7){
                console.log("You lose!!")
            }
            else if(activeSquare!= 6){
                console.log("Not enough letters")
            }else{
                console.log("Not in list")
            }
        }
        
        console.log("Enter")
    }
})

