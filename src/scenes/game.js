class Game extends Phaser.Scene {
    // game scene
    constructor () {
        super('gameScene');
    }

    preload () {
        // dummy asset
        this.load.image('foo', './assets/foo.png');
    }

    create () {
        //fetching image size from cache
        //credit to user rich: https://www.html5gamedevs.com/topic/36286-get-image-from-cache/
        this.playerSpriteInfo = game.textures.get('foo');
        this.playerSpriteInfo = this.playerSpriteInfo.getSourceImage();
        //Game variables
        this.gameOver = false;
        this.obstacleVelocity = -500;
        this.playerAccel = 600;
        this.bottomSpawnY = game.config.height - laneSize/2;
        this.middleSpawnY = game.config.height/2;
        this.topSpawnY = laneSize/2;
        this.scale = 1.0;
        this.scaleAdjust = 0.3;

        //difficulty adjustment
        //delayed functions calls will call whichever corresponding difficulty
        //enemy spawned is req'd.
        this.difficultyTable = {
            '1': this.generateObstacles,
        }
        this.difficultyLevel = 1; //need to add max for this value

        this.spawnGroup = { 
            '1': this.bottomSpawnY,
            '2': this.middleSpawnY,
            '3': this.topSpawnY,
        }

        // declaring controls
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // creating player object
        this.player = new Player(this, this.playerSpriteInfo.width/2, this.middleSpawnY, 'foo').setOrigin(0.5);

        //enemy spawner
        this.obstacleGroup = this.add.group({
            scene: this,
            runChildUpdate: true,
        });

        this.obstacleSpawn = this.time.addEvent({
            delay: 500,
            callback: this.difficultyTable[this.difficultyLevel],
            callbackScope: this,
            //startAt: 0,
            loop: true,
        })
    }

    update () {
        if (!this.gameOver) {
            this.player.update();
            //if player gets hit
            this.physics.world.collide(this.player, this.obstacleGroup, this.destroyPlayer, null, this);
        } else {
            if (fireKey.isDown) {
                this.scene.restart();
            }
        }
    }

    //This is will generate the code for spawning waves of obstacles
    generateObstacles() {
        let spawnY = Phaser.Math.Between(1, 3); //returns rand int between 1 and 3
        let obstacle = new Obstacle(this, this.spawnGroup[spawnY], 0).setOrigin(0.5);
        this.obstacleGroup.add(obstacle);
    }

    //called from within the obstacle class.
    destroyObstacle(damagedObstacle) {
        damagedObstacle.destroy();
        this.player.projectile.destroy();
        this.player.isFiring = false;
        console.log("boom!");
    }

    destroyPlayer() {
        this.time.removeAllEvents(); //clears the event calls
        this.obstacleGroup.runChildUpdate = false; //clear the obstacle group
        this.gameOver = true;
        console.log('hit');
    }
}