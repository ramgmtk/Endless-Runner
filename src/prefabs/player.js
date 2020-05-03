class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x, y, spriteAtlasName, 'sprite1');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.fired = false;
        this.scene = scene;
        this.player = player;
        this.setImmovable(true);
    }

    update() {
        if(this.fired == true) {
            this.anims.play('Ora', true);
            this.setVelocityX(-2*obstacleVelocity);
            if (this.x > game.config.width) {
                this.scene.playerCoolDown = 0;
                this.resetProjectile();
            }
        } else {
            //if cooldown animation is not playing play:
            if (this.anims.getCurrentKey() != 'stand_cooldown' || !this.anims.isPlaying) {
                this.anims.play('stand_idle', false);
            }
            this.y = this.player.y - this.scene.playerSpriteInfo.height/3;
        }
    }

    resetProjectile() {
        this.x = this.player.x - (this.scene.playerSpriteInfo.width / 2)
        this.fired = false;
        this.setVelocityX(0);
        this.scene.time.addEvent({
            delay: this.scene.playerCoolDown,
            callback: () => {
                this.player.isFiring = false;
                //console.log('executed firing callback');
            },
            callbackScope: this.scene,
        });
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
        this.projectile = new Projectile(scene, x, y - this.scene.playerSpriteInfo.height/3, this).setScale(scale).setDepth(1);
        this.setMaxVelocity(500, 0);
        this.setCollideWorldBounds(true);
        this.playerScale = scale;
        //this.setDragX(200);
    }

    update() {
        this.projectile.update();
        //character movement
        if (Phaser.Input.Keyboard.JustDown(keyW) && this.y > this.scene.topSpawnY) {
            this.y -= laneSize;
            this.playerScale -= scaleAdjust;
            this.setScale(this.playerScale);
            this.projectile.setScale(this.playerScale);
        } else if (Phaser.Input.Keyboard.JustDown(keyS) && this.y < game.config.height -  laneSize/2) { 
            this.y += laneSize;
            this.playerScale += scaleAdjust;
            this.setScale(this.playerScale);
            this.projectile.setScale(this.playerScale);
        }
        if (!this.anims.isPlaying) {
            this.anims.play('Run', true);
        }

        //left right movement. First if is to prevent sliding. SHOULD FIX LOOK INTO DRAG
        /*if (Phaser.Input.Keyboard.JustUp(keyA) || Phaser.Input.Keyboard.JustUp(keyD)) {
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
        }*/ 
        //projectile fire code
        //if projectile is firing, prevent firing of additional projectile.
        /*if (this.isFiring) { //redundant and should probably be added to the scene if statement
            if (!this.projectile.fired) {
                this.scene.time.addEvent({
                    delay: this.scene.playerCoolDown,
                    callback: () => {
                        this.isFiring = false;
                        console.log('executed firing callback');
                    },
                    callbackScope: this,
                });
            }
        }*/
        if (Phaser.Input.Keyboard.JustDown(keyJ) && !this.isFiring) {
            this.anims.play('Fire', true);
            this.isFiring = true;
            this.projectile.fired = true;
        }
    }
}
