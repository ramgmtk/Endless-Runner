class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, velocity) {
        super(scene, x, y, spriteAtlasName, 'sprite8');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityX(velocity);
        this.setImmovable(true);
        this.setDepth(1);
        this.canCollide = true;

        //scale enemies to their lane
        if (this.y > centerY) {
            this.setScale(scale + scaleAdjust);
        } else if (this.y < centerY) {
            this.setScale(scale - scaleAdjust);
        } else {
            this.setScale(scale);
        }
        this.anims.play('Muda');
    }

    update () {
        if ((!this.anims.isPlaying && this.anims.getCurrentKey() == 'The World') || this.x < 0) {
            this.destroy();
        }
    }
}