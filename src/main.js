let config = {
    type: Phaser.CANVAS,
    width: 1080,
    height: 720,
    scene: [Game],
}

let upKey, downKey;

let game = new Phaser.Game(config);