class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, y, frame = 0) {
        super(scene, game.config.width, y, 'foo', frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityX(scene.obstacleVelocity);
        this.setImmovable(true);

        //scale enemies to their lane
        if (this.y > game.config.height / 2) {
            this.setScale(scene.scale + scene.scaleAdjust);
        } else if (this.y < game.config.height / 2) {
            this.setScale(scene.scale - scene.scaleAdjust);
        }
    }

    update () {
        if (this.x < 0) {
            this.destroy();
        }
    }
}