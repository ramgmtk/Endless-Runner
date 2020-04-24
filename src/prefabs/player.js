class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);
        this.setVelocityX(-1*scene.obstacleVelocity);
    }

    update() {
        if (this.x > game.config.width) {
            this.destroy();
        }
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);
        this.isFiring = false;
        this.scene = scene;
        this.projectile;
    }

    update() {
        //character movement
        if (Phaser.Input.Keyboard.JustDown(upKey) && this.y > laneSize) {
            this.y -= game.config.height/3;
            this.setScale(this.scene.scale - this.scene.scaleAdjust);
        } else if (Phaser.Input.Keyboard.JustDown(downKey) && this.y < game.config.height -  laneSize/2) { 
            this.y += game.config.height/3;
            this.setScale(this.scene.scale + this.scene.scaleAdjust);
        }
        //projectile fire code
        //if projectile is firing, prevent firing of additional projectile.
        if (this.isFiring) {
            if (this.projectile.active) {
                this.projectile.update();
            } else {
                this.isFiring = false;
            }
        } else {
            if (Phaser.Input.Keyboard.JustDown(fireKey)) {
                this.isFiring = true;
                this.projectile = new Projectile(this.scene, this.x, this.y, 'foo');
            }
        }
    }
}
