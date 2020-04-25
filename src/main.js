let config = {
    type: Phaser.CANVAS,
    width: 1080,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                debug: true,
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

// used to keep track of high scores between plays
let highScore = 0;
//variables for lanes, can be changes later should more need to be added.
let laneNumber = 3
let laneSize = config.height/laneNumber;

function factorial(n) {
    let k = n;
    while (k > 1) {
        n = n * (n - 1);
        k = k - 1;
    }
    return k;
}

let game = new Phaser.Game(config);