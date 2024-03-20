//GLOBAL VARIABLES - Current Row, Current State, Row object, If puzzle is solved (Not used yet)
var activeRow = 1;
var activeSquare = 1;
var row = null
var solved = false

//Word list and word to guess. !!WILL NOT BE USED IN ACTUAL SERVER IMPLEMENTATION!!
var wordList = ["adopt",
    "ahead",
    "bacon",
    "beach",
    "blank",
    "charm",
    "drink",
    "eagle",
    "fairy",
    "ghost"]
var word = "charm"

//Method to programatically create my game grid
function onStart() {
    console.log("run")
    //grab board container
    const board = document.getElementById("board");

    //row loop
    for (let i = 0; i < 6; i++) {
        //row creation and appendage
        const row = document.createElement("div");
        row.className = "board-row";
        row.id = "row-" + (i + 1)
        board.appendChild(row);

        //tile loop
        for (let j = 0; j < 5; j++) {
            //tile creation and appendage
            const cell = document.createElement("div");
            cell.className = "board-square";
            cell.id = "square-" + (j + 1)
            row.appendChild(cell);
        }
    }


    row = document.getElementById("row-1")
}
//Run onStart when page loads
window.onload = onStart


//Function to check if word exists in list. !!O(logn) COMPLEXITY THANKS TO BINARY SEARCH!!
function wordExists(word) {
    console.log(wordList.length)
    //setup left and right pointers
    left = 0
    right = wordList.length
    while (left < right) {
        //define midpoint
        let mid = Math.floor((left + right) / 2)
        //check if word lives in midpoint
        console.log(wordList[mid])
        console.log(word)
        if (wordList[mid] == word) {
            //return true when word is located
            return true;
        }
        //adjust based if left or right
        else if (wordList[mid] < word) {
            left = mid
        } else {
            right = mid
        }

        //repeat
    }

    //return false if never found
    return false
}


function onAnimationEnd(element) {
    // Remove the class that specifies the animation properties
    element.classList.remove("pop");

    element.className = "board-square-selected"


    // Remove the event listener to prevent memory leaks
    element.removeEventListener("animationend", onAnimationEnd);
}

function triggerAnimation(element) {

    element.classList.add("pop")
    element.addEventListener("animationend", function () {
        onAnimationEnd(element)
    });
}

function onFlipEnd(element, color) {
    element.classList.remove("flip-" + color);

    element.classList.add(color)
    element.removeEventListener("animationend", onAnimationEnd);
}

function triggerFlip(element, color, i, delay) {
    setTimeout(() => {
        element.classList.add("flip-" + color)
        element.style.animatonDelay = `${i * 100}ms`;
        element.addEventListener("animationend", function () {
            onFlipEnd(element, color)
        });
    }, delay);
}





//KEYDOWN LISTENERS
document.addEventListener("keydown", function handleKeyDown(event) {
    //alphabet keydown listener (should move to seperate function in webapp implementation)
    if (/^[a-zA-z]$/.test(event.key)) {
        let square = row.querySelector('#square-' + activeSquare)
        if (square != null && square.innerHTML == "") {

            //set square content to pressed letter
            square.innerHTML = event.key.toUpperCase()
            //animation trigger
            triggerAnimation(square, "pop")

            //right limit check
            if (activeSquare != 6) {
                activeSquare++
            }

        }
        //backspace function (should move to seperate function in webapp implementation)
    } else if (event.key == "Backspace") {
        //left limit check
        if (activeSquare != 1) {
            activeSquare--
        }

        let square = row.querySelector('#square-' + activeSquare)
        if (square != null) {
            //reset square content if square is not null
            square.innerHTML = ""
            square.className = "board-square"



        }
        //the main check
    } else if (event.key == 'Enter') {
        //Variable creation, Map for effeciency, 
        const solutionMap = new Map()
        const sol = []
        let guessArr = []
        let guess = ""

        for (let i = 0; i < 5; i++) {
            let letter = row.querySelector('#square-' + (i + 1)).innerHTML.toLowerCase()
            guessArr[i] = letter
            guess = guess + letter
        }
        const inList = wordExists(guess)
        if (activeSquare == 6 && inList) {
            for (letter of word) {
                solutionMap.set(letter, (solutionMap.get(letter) || 0) + 1)
                sol.push(letter)
            }
            let delay = 0
            let correct = 0
            for (let i = 0; i < 5; i++) {

                let square = row.querySelector('#square-' + (i + 1))

                if (guessArr[i] === sol[i]) {
                    triggerFlip(square, "green", i, delay)
                    solutionMap.set(guessArr[i], solutionMap.get(guessArr[i]) - 1)
                    correct++;
                } else if (solutionMap.has(guessArr[i])) {
                    triggerFlip(square, "yellow", i, delay)
                    solutionMap.set(guessArr[i], solutionMap.get(guessArr[i]) - 1)
                } else {
                    triggerFlip(square, "gray", i, delay)
                }
                delay += 300
            }

            if (correct === 5) {
                console.log("You win!!")
                activeRow = 0
                activeSquare = 0
            } else if (activeRow == 6) {
                console.log("You lose!!")
                activeRow = 0
                activeSquare = 0
            } else {
                activeRow++;
                activeSquare = 1;
                row = document.getElementById("row-" + activeRow)
            }

        } else {
            if (activeRow == 7) {
                console.log("You lose!!")
            }
            else if (activeSquare != 6) {
                console.log("Not enough letters")
            } else {
                console.log("Not in list")
            }
        }

        console.log("Enter")
    }
})

