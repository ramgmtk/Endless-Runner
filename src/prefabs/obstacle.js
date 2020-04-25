class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, frame = 0) {
        super(scene, x, y, spriteAtlasName, 'sprite8');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityX(obstacleVelocity);
        this.setImmovable(true);

        //scale enemies to their lane
        if (this.y > game.config.height / 2) {
            this.setScale(scale + scaleAdjust);
        } else if (this.y < game.config.height / 2) {
            this.setScale(scale - scaleAdjust);
        }
    }

    update () {
        if (this.x < 0) {
            this.destroy();
        } 
    }
}