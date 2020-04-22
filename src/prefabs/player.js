class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(upKey) && this.y > laneSize - this.height) {
            this.y -= game.config.height/3;
        } else if (Phaser.Input.Keyboard.JustDown(downKey) && this.y < game.config.height -  laneSize/2 - this.scene.playerSpriteInfo.height/2) { 
            this.y += game.config.height/3;
        }
    }
}