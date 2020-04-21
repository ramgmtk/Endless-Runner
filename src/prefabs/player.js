class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(upKey) && this.y > game.config.height/3 - this.height) {
            this.y -= game.config.height/3;
        } else if (Phaser.Input.Keyboard.JustDown(downKey) && this.y < game.config.height - this.height) {
            this.y += game.config.height/3;
        }
    }
}