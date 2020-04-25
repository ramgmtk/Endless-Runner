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
        this.defaultCoolDown = 1500;
        this.playerCoolDown = this.defaultCooldown;
        this.bottomSpawnY = game.config.height - laneSize/2; //only three spawn variables for 3 lanes, does not translate well to increase in lane size
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
        this.difficultyLevel = 0; //need to add max for this value

        this.spawnGroup = [ 
            this.bottomSpawnY,
            this.middleSpawnY,
            this.topSpawnY,
        ]
        this.spawnNumbers = new Set(); //used by medium spawner

        // declaring controls
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
            delay: 1000,
            callback: this.generateObstacles, //this does not work, not always calling right function, therefore all coding bust be in the same function
            callbackScope: this,
            //startAt: 0,
            loop: true,
        })
        // this increments the """score""" or time alive and increases it by 1 each second
        // the function lifeTimer is at the bottom of this file
        let lifeCounter = this.time.addEvent({ delay: 1000, callback: lifeTimer, callbackScope: this, loop: true });

        //difficulty
        let difficultyBump = this.time.addEvent({
            delay: 10000,
            callback : () => {
                this.difficultyLevel++;
                console.log("Difficulty increased");
            },
            callbackScope: this,
        })
    }

    update () {
        if (!this.gameOver) {
            //update playerobject
            this.player.update();

            //if player gets hit
            this.physics.world.collide(this.player, this.obstacleGroup, this.destroyPlayer, null, this);
            //if the player fired
            if (this.player.isFiring) {
                this.physics.world.collide(this.player.projectile, this.obstacleGroup, this.destroyObstacle, null, this);
            }
        } else {
            this.add.text(game.config.width / 2 , game.config.height / 2 , 'GAME OVER' , scoreConfig).setOrigin(.5);
            this.add.text(game.config.width / 2 , game.config.height / 2 + 64 , '(J) to Restart' , scoreConfig).setOrigin(.5);
            if (keyJ.isDown) {
                this.scene.restart();
            }
        }

        //update high score
        if(this.timeAlive > highScore) {
            highScore = this.timeAlive;
            this.timerCenterTopScore.text = `Longest Time Alive: ${highScore}`;
        }
    }

    //This is will generate the code for spawning waves of obstacles
    generateObstacles() {
        if (this.difficultyLevel == 0) {
            let spawnY = Phaser.Math.Between(0, 2); //returns rand int between 0 and 2
            let obstacle = new Obstacle(this, game.config.width, this.spawnGroup[spawnY], 0).setOrigin(0.5);
            this.obstacleGroup.add(obstacle);
        } else {
            let offset = 0;
            let obstacle_1 = new Obstacle(this, game.config.width - offset, this.spawnGroup[0], 0).setOrigin(0.5);
            let obstacle_2 = new Obstacle(this, game.config.width - offset, this.spawnGroup[1], 0).setOrigin(0.5);
            let obstacle_3 = new Obstacle(this, game.config.width - offset, this.spawnGroup[2], 0).setOrigin(0.5);
            this.obstacleGroup.addMultiple([obstacle_1, obstacle_2, obstacle_3]);
        }
    }

    //object1 and object2 passed from phaser collision handler
    destroyObstacle(object1, object2) {
        this.playerCoolDown = this.defaultCoolDown;
        object1.destroy();
        object2.destroy();
        console.log("boom!");
    }

    //currently on game over, obstacles off infinitely off screen
    //should delete objects from obstacle group
    destroyPlayer() {
        this.time.removeAllEvents(); //clears the event calls
        this.obstacleGroup.runChildUpdate = false; //clear the obstacle group
        this.obstacleGroup.clear(true, true);
        this.gameOver = true;
        console.log('hit');
    }
}

function lifeTimer() {
    ++this.timeAlive;
    this.timerCenter.text = this.timeAlive;
}