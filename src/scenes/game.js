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
        // set up how to draw timer
        this.timeAlive = 0;
        this.timerCenter = this.add.text(game.config.width / 2 , 88 , this.timeAlive , scoreConfig).setOrigin(.5);
        this.timerCenterTopScore = this.add.text(game.config.width / 2 , 20 , `Longest Time Alive: ${highScore}` , scoreConfig).setOrigin(.5);

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
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

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
        // this increments the """score""" or time alive and increases it by 1 each second
        // the function lifeTimer is at the bottom of this file
        let lifeCounter = this.time.addEvent({ delay: 1000, callback: lifeTimer, callbackScope: this, loop: true });
    }

    update () {
        if (!this.gameOver) {
            this.player.update();
            //if player gets hit
            this.physics.world.collide(this.player, this.obstacleGroup, this.destroyPlayer, null, this);
        } else {
            this.add.text(game.config.width / 2 , game.config.height / 2 , 'GAME OVER' , scoreConfig).setOrigin(.5);
            this.add.text(game.config.width / 2 , game.config.height / 2 + 64 , '(J) to Restart' , scoreConfig).setOrigin(.5);
            if (fireKey.isDown || keyJ.isDown) {
                this.scene.restart();
            }
        }

        if(this.timeAlive > highScore) {
            highScore = this.timeAlive;
            this.timerCenterTopScore.text = `Longest Time Alive: ${highScore}`;
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

function lifeTimer() {
    ++this.timeAlive;
    this.timerCenter.text = this.timeAlive;
}