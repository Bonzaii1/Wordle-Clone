//GLOBAL VARIABLES - Current Row, Current State, Row object, If puzzle is solved (Not used yet)
var activeRow = 1;
var activeSquare = 1;
var row = null
var solved = false
var edit = true



//Word list and word to guess. !!WILL NOT BE USED IN ACTUAL SERVER IMPLEMENTATION!!
var wordList
var word
const solutionMap = new Map()



//Method to programatically create my game grid
function onStart() {

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

    fetch("../assets/wordListEsOrdered.txt")
        .then((res) => res.text())
        .then((text) => {
            wordList = text.split(",")
            let choice = Math.floor(Math.random() * wordList.length);
            word = wordList[choice]

            for (letter of word) {
                solutionMap.set(letter, (solutionMap.get(letter) || 0) + 1)

            }
            console.log(word)
        })
        .catch((e) => console.error(e));


    row = document.getElementById("row-1")
}
//Run onStart when page loads
window.onload = onStart

function closeModal() {
    const container = document.querySelector(".modal-container")
    const modal = document.querySelector(".modal")
    modal.classList.remove("enter")
    container.classList.remove("fade-in")


    modal.classList.add("exit")
    container.classList.add("fade")

    container.addEventListener("animationend", function () {
        container.remove()
        container.removeEventListener("animationend", this)
    })

}

function showAlert(message, check) {
    if (document.querySelector(".alert-container") == null) {
        const alertContainer = document.createElement("div")
        const row = document.getElementById("row-" + activeRow)
        alertContainer.className = "alert-container"
        alertContainer.innerHTML = `<div class="alert">
            <h4 class="alert-title">${message}</h4>
        </div>`

        document.body.appendChild(alertContainer)

        if (!check) {
            row.classList.add("shake")
            alertContainer.addEventListener("animationend", function () {
                row.classList.remove("shake")
                alertContainer.removeEventListener("animationend", this)
            });
            setTimeout(() => {
                hideAlert()
            }, 1000);
        }




    }

}

function hideAlert() {
    const alertContainer = document.querySelector(".alert-container")
    alertContainer.classList.add("fade")

    alertContainer.addEventListener("animationend", function () {
        alertContainer.remove()
        alertContainer.removeEventListener("animationend", this)
    });

}



//Function to check if word exists in list. !!O(logn) COMPLEXITY THANKS TO BINARY SEARCH!!
function wordExists(word) {
    //setup left and right pointers
    left = 0
    right = wordList.length
    while (left < right) {
        //define midpoint
        let mid = Math.floor((left + right) / 2)
        //check if word lives in midpoint
        if (wordList[mid] == word) {
            //return true when word is located
            return true;
        }
        //adjust based if left or right
        else if (wordList[mid] < word) {
            left = mid + 1
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

function onFlipEnd(element, color, i) {
    element.classList.remove("flip-" + color);
    element.classList.add(color)
    if (i === 4) edit = true;
    element.removeEventListener("animationend", onAnimationEnd);
}

function triggerFlip(element, color, i, delay) {
    setTimeout(() => {
        element.classList.add("flip-" + color)
        element.style.animatonDelay = `${i * 100}ms`;
        element.addEventListener("animationend", function () {
            onFlipEnd(element, color, i)
        });
    }, delay);
}


function onKeyPress(key) {
    if (edit) {
        let square = row.querySelector('#square-' + activeSquare)
        if (square != null && square.innerHTML == "") {

            //set square content to pressed letter
            square.innerHTML = key.toUpperCase()
            //animation trigger
            triggerAnimation(square, "pop")

            //right limit check
            if (activeSquare != 6) {
                activeSquare++
            }

        }
    }

}

function onBackspace() {
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
}

function onEnter() {
    //Variable creation, Map for effeciency, 

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
            sol.push(letter)
        }
        let delay = 0
        let correct = 0

        for (let i = 0; i < 5; i++) {
            edit = false
            let square = row.querySelector('#square-' + (i + 1))
            let check = false
            for (let j = i + 1; j < 5; j++) {
                if (guessArr[i] == sol[j]) check = true;
            }
            if (guessArr[i] === sol[i]) {
                triggerFlip(square, "green", i, delay)
                solutionMap.set(guessArr[i], solutionMap.get(guessArr[i]) - 1)
                correct++;
            } else if (solutionMap.has(guessArr[i]) && solutionMap.get(guessArr[i]) != 0 && !check) {

                triggerFlip(square, "yellow", i, delay)
                solutionMap.set(guessArr[i], solutionMap.get(guessArr[i]) - 1)

            } else {
                triggerFlip(square, "gray", i, delay)
                const key = document.getElementById(guessArr[i].toUpperCase())
                key.style.backgroundColor = "#333333"
            }
            delay += 300

        }

        if (correct === 5) {
            setTimeout(() => {
                showAlert("Well done!", true)
            }, 2000);

            activeRow = 0
            activeSquare = 0
        } else if (activeRow == 6) {
            setTimeout(() => {
                showAlert(word.toUpperCase(), true)
            }, 2000);
            activeRow = 0
            activeSquare = 0
        } else {
            activeRow++;
            activeSquare = 1;
            row = document.getElementById("row-" + activeRow)
        }

    } else {
        if (activeRow == 7) {
            showAlert(word.toUpperCase(), true)
        }
        else if (activeSquare != 6) {
            showAlert("Not enough Letters", false)
        } else {
            showAlert("Word not in List", false)
        }
    }

}




//KEYDOWN LISTENERS
document.addEventListener("keydown", function handleKeyDown(event) {
    //alphabet keydown listener (should move to seperate function in webapp implementation)
    if (/^[a-zA-z]$/.test(event.key)) {
        onKeyPress(event.key)


        //backspace function (should move to seperate function in webapp implementation)
    } else if (event.key == "Backspace") {
        onBackspace()

        //the main check
    } else if (event.key == 'Enter') {
        onEnter()
    }
})