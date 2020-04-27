class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, spriteAtlasName, 'sprite1');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.setImmovable(true);
        this.setVelocityX(-2*obstacleVelocity);
    }

    update() {
        this.anims.play('Ora', true);
        if (this.x > game.config.width) {
            this.scene.playerCoolDown = 0;
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
        this.coolDown = false;
        this.scene = scene;
        this.projectile;
        this.setMaxVelocity(500, 0);
        this.setCollideWorldBounds(true);
        this.playerScale = scale;
        //this.setDragX(200);
    }

    update() {
        //character movement
        if (Phaser.Input.Keyboard.JustDown(keyW) && this.y > laneSize/2) {
            this.y -= laneSize;
            this.playerScale -= scaleAdjust;
            this.setScale(this.playerScale);
        } else if (Phaser.Input.Keyboard.JustDown(keyS) && this.y < game.config.height -  laneSize/2) { 
            this.y += laneSize;
            this.playerScale += scaleAdjust;
            this.setScale(this.playerScale);
        }
        if (!this.anims.isPlaying) {
            this.anims.play('Run', true);
        }

        //left right movement. First if is to prevent sliding.
        if (Phaser.Input.Keyboard.JustUp(keyA) || Phaser.Input.Keyboard.JustUp(keyD)) {
            this.setAccelerationX(0);
            this.setVelocityX(0);
        } else if (keyA.isDown) {
            this.setAccelerationX(0);
            this.setVelocityX(obstacleVelocity);
            //Credit to user Yannick:
            //https://phaser.discourse.group/t/check-if-animation-is-playing/1473
            if (this.anims.getCurrentKey() != 'Fire') {
                this.anims.play('Idle', false);
            }
        } else if (keyD.isDown) {
            this.setAccelerationX(playerAccel);
            //this.setVelocityX(-this.scene.obstacleVelocity);
        } 
        //projectile fire code
        //if projectile is firing, prevent firing of additional projectile.
        if (this.isFiring) { //redundant and should probably be added to the scene if statement
            if (this.projectile.active) {
                this.projectile.update();
            } else if (this.coolDown == true) {
                this.coolDown = false;
                this.scene.time.addEvent({
                    delay: this.scene.playerCoolDown,
                    callback: () => {
                        this.isFiring = false;
                    },
                    callbackScope: this.scene,
                });
            }
        } else {
            if (Phaser.Input.Keyboard.JustDown(keyJ)) {
                this.anims.play('Fire', true);
                this.isFiring = true;
                this.projectile = new Projectile(this.scene, this.x, this.y).setScale(this.playerScale);
                this.coolDown = true;
            }
        }
    }
}
