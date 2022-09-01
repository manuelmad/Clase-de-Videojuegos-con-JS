//console.log(maps);

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

var btnUp = document.querySelector('#up');
var btnLeft = document.querySelector('#left');
var btnRight = document.querySelector('#right');
var btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
//const new_record = document.querySelector('#new_record');
const reset_button = document.querySelector('#reset_button');

//localStorage.removeItem('record_time');
let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
// let puntuacion;
let timeInterval;


const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

//var bombas = [];

let enemiesPositions = [];


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    }
    else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize/10;
    
    if(canvasSize == canvasSize1) {
        playerPosition.x = ultima_x;
        playerPosition.y = ultima_y;
    }
    else {
        playerPosition.x = ultima_x*(canvasSize/canvasSize1);
        playerPosition.y = ultima_y*(canvasSize/canvasSize1);
    }
    // playerPosition.x = undefined;
    // playerPosition.y = undefined;


    startGame();
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'right';
    
    const map = maps[level];
    //console.log(map);

    if(!map) {
        gameWin();
        // timePlayer = Number(spanTime.innerHTML);
        // puntuacion = Number(localStorage.getItem('Record'));
        // if(!puntuacion) {
        //     localStorage.setItem('Record', timePlayer);
        // }
        // else {
        //     if(timePlayer < puntuacion) {
        //         new_record.innerHTML = 'Has conseguido un nuevo record!!!';
        //         localStorage.setItem('Record', timePlayer);
        //     }
        // }
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    //console.log(mapRows);

    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    //console.log(mapRowsCols);

    //console.log(mapRowsCols[0][0]);
    showLives();

    game.clearRect(0, 0, canvasSize, canvasSize);
    enemiesPositions = [];

    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            game.fillText(emoji, posX, posY);
            //console.log({row, col, rowI, colI});
            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                   playerPosition.x = posX;
                   playerPosition.y = posY;
                   //console.log(playerPosition.x, playerPosition.y);
                }
            }
            else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            }
            // else if (col == 'X') {
            //     bombas.push(posX, posY);
            // }
            else if (col == 'X') {
            enemiesPositions.push({
                x: posX,
                y: posY,
                });
            }
        });
    });


    movePlayer();

    
    
    
    // for(j=1; j<=10; j++) {
    //     for(i=1; i <= 10; i++) {
    //         game.fillText(emojis[mapRowsCols[j-1][i-1]], elementsSize*i, elementsSize*j);
    //     }
    // }
}

let ultima_x;
let ultima_y;
let canvasSize1;

function movePlayer() {
    if(playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3) && playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3)) {
        //console.log("Pasaste de nivel!!!");
        levelWin();
    }
    // for(i=0; i < bombas.length; i=i+2) {
    //     if(bombas[i].toFixed(3) == playerPosition.x.toFixed(3) && bombas[i+1].toFixed(3) == playerPosition.y.toFixed(3)) {
    //         console.log("Explosión!!!");
    //     }
    // }
    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
      });
      
      if (enemyCollision) {
        console.log('Chocaste contra un enemigo :(');
        if(lives > 0) {
            showCollision();
            setTimeout(levelLost, 3000);
        }
        else {
            showDeath();
        }
        
        //levelLost();
      }
   
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    
    ultima_x = playerPosition.x;
    ultima_y = playerPosition.y;

    if(window.innerHeight > window.innerWidth) {
        canvasSize1 = window.innerWidth * 0.7;
    }
    else {
        canvasSize1 = window.innerHeight * 0.7;
    }
}

function showCollision() {
    game.clearRect(0, 0, canvasSize, canvasSize);
    game.font = '5px';
    game.textAlign = 'center';
    game.fillText('PERDISTE UNA VIDA, VUELVE A INTENTARLO', canvasSize/2, canvasSize/2);
}

function showDeath() {
    game.clearRect(0, 0, canvasSize, canvasSize);
    game.font = '5px';
    game.textAlign = 'center';
    game.fillText('PERDISTE TODAS LAS VIDAS, VUELVE AL INICIO', canvasSize/2, canvasSize/2);
}

function levelWin() {
    console.log("Pasaste de nivel!!!");
    level = level + 1;
    startGame();
}

//localStorage.setItem('Record' + j, 7);
//localStorage.removeItem('Record0');

function gameWin() {
    console.log("Terminaste el juego!!!");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    if(recordTime) {
        if(recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            console.log('Superaste el record!');
            pResult.innerHTML = 'Superaste el record!';
        }
        else {
            console.log('Lo siento, no superaste el record! :(');
        }
    }
    else {
        localStorage.setItem('record_time', playerTime);
        console.log('Es tu primera partida. Ahora intenta superar tu tiempo.');
        pResult.innerHTML = 'Es tu primera partida. Ahora intenta superar tu tiempo.';
    }

    console.log(recordTime, playerTime);
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['PLAYER']);
    console.log(heartsArray);

    spanLives.innerHTML = "";

    // var i = lives;
    // while(i>0) {
    //     spanLives.append(heartsArray[i-1]);
    //     i--;
    // }

    // for(i=lives; i > 0; i--) {
    //     spanLives.append(heartsArray[i-1]);
    // }
    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

function levelLost() {
    lives--;

    console.log(lives);

    if(lives <= 0) {
        lives = 3;
        level = 0;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);


function moveByKeys(event) {
    if(event.key == 'ArrowUp') {
        moveUp();
    }
    else if(event.key == 'ArrowLeft') {
        moveLeft();
    }
    else if(event.key == 'ArrowRight') {
        moveRight();
    }
    else if(event.key == 'ArrowDown') {
        moveDown();
    }
}

reset_button.addEventListener('click', resetGame);

function resetGame() {
    location.reload();
}


function moveUp() {
    if(playerPosition.y - elementsSize > elementsSize) {
        playerPosition.y = playerPosition.y - elementsSize;
        startGame();
    }
    console.log("arriba");
    console.log(playerPosition.x, playerPosition.y);
}

function moveLeft() {
    if(playerPosition.x - elementsSize > elementsSize) {
        playerPosition.x = playerPosition.x - elementsSize;
        startGame();
    }
    console.log("izquierda");
}

function moveRight() {
    if(playerPosition.x + elementsSize <= canvasSize) {
        playerPosition.x = playerPosition.x + elementsSize;
        startGame();
    }
    console.log("derecha");
}

function moveDown() {
    if(playerPosition.y + elementsSize <= canvasSize) {
        playerPosition.y = playerPosition.y + elementsSize;
        startGame();
    }

    console.log("abajo");
}