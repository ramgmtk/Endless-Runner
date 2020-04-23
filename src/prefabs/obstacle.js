class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, y, frame = 0) {
        super(scene, game.config.width, y, 'foo', frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityX(scene.obstacleVelocity);
        this.setImmovable(true);
    }

    update () {
        if (this.x < 0) {
            this.destroy();
        }
    }
}