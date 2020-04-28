let config = {
    type: Phaser.CANVAS,
    width: 1080,
    height: 720,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0,
            }
        }
    },
    scene: [ Menu, Game ],
}

// place holder text config, we can change this but i'm using it for score lol
let scoreConfig = {
    fontFamily: 'Courier' ,
    fontSize: '28px' ,
    backgroundColor: '#F3B141' ,
    color: '#843605' ,
    align: 'right' ,
    padding: {
        top: 5 ,
        botom: 5 ,
    },
    fixedWidth: 0
}

let keyW , keyA , keyS , keyD , keyJ;
// center X and center Y are the two centers of the screen, call these instead of game.config.width / 2
let uiSizeY = 80;
let centerX = config.width / 2;
let centerY = ((config.height - uiSizeY) / 2) + uiSizeY;
// used to keep track of high scores between plays
let highScore = 0;
//variables for lanes, can be changes later should more need to be added.
let numOfLanes = 3
let laneSize = (config.height - uiSizeY)/numOfLanes;
//some gamevariables
let obstacleVelocity = -500;
let dVelocity = 200;
let playerAccel = 600;
let defaultCoolDown = 1000;
let scale = 1.5;
let scaleAdjust = 0.5;
let spriteAtlasName = 'prototype_atlas';

function factorial(n) {
    let k = n;
    while (k > 1) {
        n = n * (n - 1);
        k = k - 1;
    }
    return k;
}

let game = new Phaser.Game(config);