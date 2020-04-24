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
        this.setMaxVelocity(500, 0);
        this.setCollideWorldBounds(true);
        this.playerScale = scene.scale;
    }

    update() {
        //character movement
        if ((Phaser.Input.Keyboard.JustDown(upKey) || Phaser.Input.Keyboard.JustDown(keyW))
                                                                                && this.y > laneSize) {
            this.y -= game.config.height/3;
            this.playerScale -= this.scene.scaleAdjust;
            this.setScale(this.playerScale);
        } else if ((Phaser.Input.Keyboard.JustDown(downKey) || Phaser.Input.Keyboard.JustDown(keyS))
                                                        && this.y < game.config.height -  laneSize/2) { 
            this.y += game.config.height/3;
            this.playerScale += this.scene.scaleAdjust;
            this.setScale(this.playerScale);
        }

        //left right movement. First if is to prevent sliding.
        if (Phaser.Input.Keyboard.JustUp(leftKey) || Phaser.Input.Keyboard.JustUp(rightKey)
                || Phaser.Input.Keyboard.JustUp(keyA) || Phaser.Input.Keyboard.JustUp(keyD)) {
            this.setAccelerationX(0);
            this.setVelocityX(0);
        } else if (leftKey.isDown || keyA.isDown) {
            this.setAccelerationX(0);
            this.setVelocityX(-500);
        } else if (rightKey.isDown || keyD.isDown) {
            this.setAccelerationX(this.scene.playerAccel);
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
            if (Phaser.Input.Keyboard.JustDown(fireKey) || Phaser.Input.Keyboard.JustDown(keyJ)) {
                this.isFiring = true;
                this.projectile = new Projectile(this.scene, this.x, this.y, 'foo');
            }
        }
    }
}
