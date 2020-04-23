class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(upKey) && this.y > laneSize) {
            this.y -= game.config.height/3;
        } else if (Phaser.Input.Keyboard.JustDown(downKey) && this.y < game.config.height -  laneSize/2) { 
            this.y += game.config.height/3;
        }
    }
}