class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame = 0) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.setImmovable(true);
        this.setVelocityX(-2*scene.obstacleVelocity);
    }

    update() {
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
        this.playerScale = scene.scale;
        //this.setDragX(200);
    }

    update() {
        //character movement
        if (Phaser.Input.Keyboard.JustDown(keyW) && this.y > laneSize) {
            this.y -= game.config.height/3;
            this.playerScale -= this.scene.scaleAdjust;
            this.setScale(this.playerScale);
        } else if (Phaser.Input.Keyboard.JustDown(keyS) && this.y < game.config.height -  laneSize/2) { 
            this.y += game.config.height/3;
            this.playerScale += this.scene.scaleAdjust;
            this.setScale(this.playerScale);
        }

        //left right movement. First if is to prevent sliding.
        if (Phaser.Input.Keyboard.JustUp(keyA) || Phaser.Input.Keyboard.JustUp(keyD)) {
            this.setAccelerationX(0);
            this.setVelocityX(0);
        } else if (keyA.isDown) {
            this.setAccelerationX(0);
            this.setVelocityX(this.scene.obstacleVelocity);
        } else if (keyD.isDown) {
            this.setAccelerationX(this.scene.playerAccel);
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
                        console.log("event triggered");
                        this.isFiring = false;
                    },
                    callbackScope: this.scene,
                });
            }
        } else {
            if (Phaser.Input.Keyboard.JustDown(keyJ)) {
                this.isFiring = true;
                this.projectile = new Projectile(this.scene, this.x, this.y, 'foo').setScale(this.playerScale);
                this.coolDown = true;
            }
        }
    }
}
