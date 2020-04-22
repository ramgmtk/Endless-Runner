class Game extends Phaser.Scene {
    // game scene
    constructor () {
        super('gameScene');
    }

    preload () {
        // dummy asset
        this.picture = this.load.image('foo', './assets/foo.png')
    }

    create () {
        // declaring controls
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // creating player object
        //fetching image size from cache
        //credit to user rich: https://www.html5gamedevs.com/topic/36286-get-image-from-cache/
        this.playerSpriteInfo = game.textures.get('foo');
        this.playerSpriteInfo = this.playerSpriteInfo.getSourceImage();
        console.log(this.playerSpriteInfo.height);
        this.player = new Player(this, 0, game.config.height - laneSize/2 - this.playerSpriteInfo.height/2, 'foo').setOrigin(0);
    }

    update () {
        this.player.update();
    }
}