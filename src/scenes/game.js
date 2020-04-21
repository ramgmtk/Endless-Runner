class Game extends Phaser.Scene {
    // game scene
    constructor () {
        super('gameScene');
    }

    preload () {
        // dummy asset
        this.load.image('foo', './assets/foo.png')
    }

    create () {
        // declaring controls
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // creating player object
        this.player = new Player(this, 0, game.config.height - game.config.height/6 - 16, 'foo').setOrigin(0);
    }

    update () {
        this.player.update();
    }
}