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
    scene: [Game],
}

let upKey, downKey, fireKey;

let laneSize = config.height/3;

let game = new Phaser.Game(config);