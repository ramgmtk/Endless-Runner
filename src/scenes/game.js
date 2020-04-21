class Game extends Phaser.Scene {
    constructor () {
        super('gameScene');
    }

    create () {
        this.add.rectangle(5, 5, 600, 100, 0x0f0f0f).setOrigin(0);
    }
}