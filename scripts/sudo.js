// Possible starting options
let startOptions = [
    [
        3, 4, 7, 5, -1, -1, -1, -1, -1,
        -1, -1, 6, -1, -1, -1, -1, -1, 1,
        -1, 8, -1, -1, -1, -1, 3, -1, -1,
        -1, -1, -1, -1, -1, 3, -1, 1, 7,
        -1, -1, 3, 1, 2, 9, 8, -1, -1,
        2, 5, -1, 8, -1, -1, -1, -1, -1,
        -1, -1, 2, -1, -1, -1, -1, 4, -1,
        8, -1, -1, -1, -1, -1, 9, -1, -1,
        -1, -1, -1, -1, -1, 4, 1, 3, 8
    ],
    [
        8, -1, 4, 5, -1, 6, -1, -1, -1,
        -1, 3, -1, -1, -1, -1, 8, 6, -1,
        2, -1, -1, 8, -1, -1, -1, -1, -1,
        -1, 5, -1, 9, -1, 7, -1, 1, -1,
        -1, -1, 9, -1, -1, -1, 3, -1, -1,
        -1, 1, -1, 2, -1, 5, -1, 9, -1,
        -1, -1, -1, -1, -1, 1, -1, -1, 6,
        -1, 7, 2, -1, -1, -1, -1, 5, -1,
        -1, -1, -1, 3, -1, 2, 9, -1, 1
    ],
    [
        -1, -1, -1, 9, 7, -1, -1, -1, -1,
        8, 7, -1, -1, -1, -1, 4, -1, -1,
        -1, 5, -1, 4, -1, -1, 7, 9, 6,
        -1, 6, 8, 7, -1, -1, -1, -1, -1,
        9, -1, -1, -1, -1, -1, -1, -1, 5,
        -1, -1, -1, -1, -1, 1, 9, 6, -1,
        6, 9, 2, -1, -1, 5, -1, 8, -1,
        -1, -1, 7, -1, -1, -1, -1, 4, 3,
        -1, -1, -1, -1, 1, 7, -1, -1, -1
    ]
    
];

var chosenOption; // The chosen puzzle (updates with player input)
var startingPositions; // The chosen puzzle (original values)

let activeNumber = -1; // The player's current number (what they selected (0-9 or blank))

let lastPosition = [] // For undo purposes
let lastValue = [];

let possiblechoices = [1,2,3,4,5,6,7,8,9]; // Possible choices for possible (hint)
let indexFind = -1; // Placeholder (used for possible function)

// Changes the players activeNumber (-1 = blank)
function activate(n){
    activeNumber = n;
    if(n==-1){
        for(let i = 1; i<=9; i++){
            document.getElementById('s' + String(i)).style.backgroundColor = "#000000";
        }
        document.getElementById('blank').style.backgroundColor = "#8f8936";
    }else{
        for(let i = 1; i<=9; i++){
            document.getElementById('s' + String(i)).style.backgroundColor = "#000000";
        }
        document.getElementById('s' + String(n)).style.backgroundColor = "#8f8936";
        document.getElementById('blank').style.backgroundColor = "#000000";
    }
}

// Undo the previous move
function undo(){
    if((lastPosition.length > 0) && (lastValue.length > 0) &&(lastPosition.length == lastValue.length)){
        var lastPos = lastPosition.pop(); // Temporary values
        var lastVal = lastValue.pop();
        chosenOption[lastPos-1] = lastVal;

        if(lastVal != -1){
            document.getElementById('tile' + String(lastPos)).innerHTML = lastVal;
        }else{
            document.getElementById('tile' + String(lastPos)).innerHTML = "";
        }
        checkErrors();
    }else{
        alert("You either have not made any moves yet or an error has occured and undo will no longer be possible this game.")
    }
}

// Check if two tiles belong to the the same column
function sameCol(pos1, pos2){

    let col1 = Math.floor(pos1/9);
    let row1 = pos1 - (col1*9)

    let col2 = Math.floor(pos2/9);
    let row2 = pos2 - (col2*9)

    if(col1==col2){
        return true;
    }else{
        return false;
    }
}

// Check if two tiles belong to the same row
function sameRow(pos1, pos2){
    let col1 = Math.floor(pos1/9);
    let row1 = pos1 - (col1*9)

    let col2 = Math.floor(pos2/9);
    let row2 = pos2 - (col2*9)

    if(row1==row2){
        return true;
    }else{
        return false;
    }
}

// Check if two tiles belong to the same 3x3 square
function sameSquare(pos1, pos2){
    let col1 = Math.floor(pos1/9);
    let row1 = pos1 - (col1*9)

    let col2 = Math.floor(pos2/9);
    let row2 = pos2 - (col2*9)

    let subRow1 = Math.floor(row1/3)
    let subCol1 = Math.floor(col1/3)

    let subRow2 = Math.floor(row2/3)
    let subCol2 = Math.floor(col2/3)

    if((subRow1 == subRow2) && (subCol1 == subCol2)){
        return true;
    }else{
        return false;
    }
}

// Determine all the possible choices for each tile and display to the user
function possibility(){
    let hintFound = false;
    for(let i=0; i<=80; i++){
        if(chosenOption[i] == -1){
            possiblechoices = [1,2,3,4,5,6,7,8,9]
            for(let x=0; x<=80; x++){
                if((i!=x) && (chosenOption[x] != -1) && ((sameCol(x,i) || sameRow(x,i) || sameSquare(x,i)))){
                    indexFind = possiblechoices.indexOf(chosenOption[x])
                    if(indexFind != -1){
                        possiblechoices.splice(indexFind,1);
                    }
                }
            }
            document.getElementById('tile' + String(i+1)).style.backgroundColor = "#e6b147";
            document.getElementById('tile' + String(i+1)).innerHTML = String(possiblechoices);
            document.getElementById('tile' + String(i+1)).style.fontSize = "small"
        }
    }
}

// Checks for errors
function checkErrors(){
    let emptys = false; // Checks to see if any empty tiles are left
    for(let i = 0; i<=80; i++){
        let ierrorFound = false;
        if(chosenOption[i] == -1){
            emptys = true;
            document.getElementById('tile' + String(i+1)).style.backgroundColor = "#000000";
            document.getElementById('tile' + String(i+1)).innerText = ""
            if(window.innerWidth < 500){
                document.getElementById('tile' + String(i+1)).style.fontSize = "large"
            }else{
                document.getElementById('tile' + String(i+1)).style.fontSize = "xx-large"
            }
        }else{
            for(let x = 0; x<=80; x++){
                if(chosenOption[x] != -1){
                    if((sameRow(i,x) || sameCol(i,x) || sameSquare(i,x)) && (i!=x) && (chosenOption[x] == chosenOption[i])){
                        document.getElementById('tile' + String(x+1)).style.backgroundColor = "#b80000";
                        document.getElementById('tile' + String(i+1)).style.backgroundColor = "#b80000";
                        ierrorFound = true;
                    }
                }else{
                    if(startingPositions[x] == -1){
                        document.getElementById('tile' + String(x+1)).style.backgroundColor = "#000000";
                    }else{
                        document.getElementById('tile' + String(x+1)).style.backgroundColor = "#2e2e2e";
                    }
                }
            }
        }
        if(!ierrorFound){
            if(startingPositions[i] == -1){
                document.getElementById('tile' + String(i+1)).style.backgroundColor = "#000000";
            }else{
                document.getElementById('tile' + String(i+1)).style.backgroundColor = "#2e2e2e";
            }
        }
    }
    if(emptys==false){ // Check if any errors exist, if not grant win.
        let anyErrors = false;
        for (let y=0; y<=80; y++){
            if(document.getElementById('tile' + String(y+1)).style.backgroundColor == "#b80000"){
                anyErrors = true;
            }
        }
        if(anyErrors==false){
            for (let z=0; z<=80; z++){
                document.getElementById('tile' + String(z+1)).style.backgroundColor = "#25a12d";
            }
            document.getElementById('titleS').innerText = "Square Digits - YOU WIN!"
        }
    }
}

// When the user clicks a tile, place whatever number they selected
function boxClick(n){
    if((chosenOption[n-1] != activeNumber) && (startingPositions[n-1] == -1)){
        lastPosition.push(n);
        lastValue.push(chosenOption[n-1]);
        if(activeNumber == -1){
            document.getElementById('tile' + String(n)).innerHTML = "";
        }else{
            document.getElementById('tile' + String(n)).innerHTML = activeNumber;
        }
        if(window.innerWidth < 500){
            document.getElementById('tile' + String(n)).style.fontSize = "large"
        }else{
            document.getElementById('tile' + String(n)).style.fontSize = "xx-large"
        }
        chosenOption[n-1] = activeNumber;
        checkErrors();
    }
}

// Pick a random starting board
startingPositions = startOptions[Math.floor(Math.random()*startOptions.length)];
chosenOption = startingPositions.slice();
for(let i = 0; i<=80; i++){
    if(startingPositions[i] != -1){
    document.getElementById('tile' + String(i+1)).innerHTML = startingPositions[i];
    document.getElementById('tile' + String(i+1)).style.backgroundColor = "#2e2e2e";
    }else{
        document.getElementById('tile' + String(i+1)).innerHTML = "";
    }
}