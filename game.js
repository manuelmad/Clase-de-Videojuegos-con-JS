// Variables para acceder a los elementos del DOM
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

let btnUp = document.querySelector('#up');
let btnLeft = document.querySelector('#left');
let btnRight = document.querySelector('#right');
let btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const delete_record_button = document.querySelector('#delete_record');
const reset_button = document.querySelector('#reset_button');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;

let timeInterval;

let moves = 0;

const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

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

    startGame();
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'right';
    
    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart && moves != 0) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');

    const mapRowsCols = mapRows.map(row => row.trim().split(''));

    showLives();

    game.clearRect(0, 0, canvasSize, canvasSize);
    enemiesPositions = [];

    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
            game.fillText(emoji, posX, posY);
            
            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                   playerPosition.x = posX;
                   playerPosition.y = posY;
                }
            }
            else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            }
            else if (col == 'X') {
            enemiesPositions.push({
                x: posX,
                y: posY,
                });
            }
        });
    });

    // const player_img = new Image();
    // player_img.src = './player.png';
    // player_img.setAttribute('width', elementsSize);
    // player_img.setAttribute('height', elementsSize);
    
    // game.drawImage(player_img, playerPosition.x, playerPosition.y);

    movePlayer();
}

let ultima_x;
let ultima_y;
let canvasSize1;

function movePlayer() {
    if(playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3) && playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3)) {
        levelWin();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);


    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
      });
      
      if (enemyCollision) {
        console.log('Chocaste contra un enemigo :(');
        if(lives > 1) {
            game.clearRect(0, 0, canvasSize, canvasSize);
            game.fillText(emojis['BOMB_COLLISION'], playerPosition.x, playerPosition.y);
            setTimeout(showCollision, 1000);
            setTimeout(levelLost, 3000);
        }
        else {
            showDeath();
            clearInterval(timeInterval);
            spanTime.innerHTML = '';
            setTimeout(levelLost, 3000);
        }
      }
    
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
    if(canvasSize < 300) {
        game.font = '8px Verdana';
    } else {
        game.font = '15px Verdana';
    }
    game.textAlign = 'center';
    game.fillText('PERDISTE UNA VIDA, VUELVE A INTENTARLO', canvasSize/2, canvasSize/2);
}

function showDeath() {
    game.clearRect(0, 0, canvasSize, canvasSize);
    if(canvasSize < 300) {
        game.font = '8px Verdana';
    } else {
        game.font = '15px Verdana';
    }
    game.textAlign = 'center';
    game.fillText('PERDISTE TODAS LAS VIDAS, VUELVE AL INICIO', canvasSize/2, canvasSize/2);
}

function levelWin() {
    console.log("Pasaste de nivel!!!");
    level = level + 1;
    startGame();
}

function gameWin() {
    console.log("Terminaste el juego!!!");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = ((Date.now() - timeStart)/1000).toFixed(3);
    if(recordTime) {
        if(recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            console.log('Superaste el record!');
            pResult.innerHTML = `¡Felicidades, has superado el juego y además superaste el record de ${recordTime} segundos! Tu nuevo record es de ${playerTime} segundos`;
        }
        else {
            pResult.innerHTML = `¡Felicidades! Has superado el juego, pero no superaste el record, vuelve a intentarlo`;
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

    spanLives.innerHTML = "";

    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    if(timeStart) {
        spanTime.innerHTML = ((Date.now() - timeStart)/1000).toFixed(1);
    } else {
        spanTime.innerHTML = '';
    }
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
        moves = 0;
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

function moveUp() {
    if(playerPosition.y - elementsSize > elementsSize-10) {
        playerPosition.y = playerPosition.y - elementsSize;
        moves++;
        console.log(moves);
        startGame();
    }
    console.log("arriba");
    console.log(playerPosition.x, playerPosition.y);
}

function moveLeft() {
    if(playerPosition.x - elementsSize > elementsSize-10) {
        playerPosition.x = playerPosition.x - elementsSize;
        moves++;
        console.log(moves);
        startGame();
    }
    console.log("izquierda");
}

function moveRight() {
    if(playerPosition.x + elementsSize <= canvasSize) {
        playerPosition.x = playerPosition.x + elementsSize;
        moves++;
        console.log(moves);
        startGame();
    }
    console.log("derecha");
}

function moveDown() {
    if(playerPosition.y + elementsSize <= canvasSize) {
        playerPosition.y = playerPosition.y + elementsSize;
        moves++;
        console.log(moves);
        startGame();
    }
    console.log("abajo");
}


// Evento para reiniciar el juego desde el primer nivel
reset_button.addEventListener('click', resetGame);

function resetGame() {
    location.reload();
}

// Evento para borrar el record del localStorage y reiniciar el juego
delete_record_button.addEventListener('click', deleteRecord);

function deleteRecord() {
    localStorage.removeItem('record_time');
    resetGame();
}