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
        this.playerSpriteInfo = game.textures.getFrame(spriteAtlasName, 'sprite8'); //NEEDS TO BE FIXED

        //Game variables
        this.gameOver = false;
        this.playerCoolDown = defaultCoolDown;
        this.bottomSpawnY = game.config.height - laneSize/2; //only three spawn variables for 3 lanes, does not translate well to increase in lane size
        this.middleSpawnY = centerY;
        this.topSpawnY = laneSize/2;

        // set up how to draw timer
        this.timeAlive = 0;
        this.timerCenter = this.add.text(centerX , 88 , this.timeAlive , scoreConfig).setOrigin(.5).setDepth(1);
        this.timerCenterTopScore = this.add.text(centerX, 20 , `Longest Time Alive: ${highScore}` , scoreConfig).setOrigin(.5).setDepth(1);

        //difficulty adjustment
        //delayed functions calls will call whichever corresponding difficulty
        //enemy spawned is req'd.
        this.difficultyLevel = 0; //need to add max for this value

        this.spawnGroup = [ 
            this.bottomSpawnY,
            this.middleSpawnY,
            this.topSpawnY,
        ]

        // declaring controls
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

        // creating player object
        this.player = new Player(this, this.playerSpriteInfo.width/2, this.middleSpawnY, spriteAtlasName, 'sprite5').setScale(scale).setOrigin(0.5).setDepth(1);
        //create background
        this.background = this.add.tileSprite(0, 0, 1080, 720, 'ER_FantasyRugby_Background').setOrigin(0).setDepth(0);

        //enemy spawner
        this.obstacleGroup = this.add.group({
            scene: this,
            runChildUpdate: true,
        });

        this.obstacleSpawn = this.time.addEvent({
            delay: 2500,
            callback: this.generateObstacles, //this does not work, not always calling right function, therefore all coding bust be in the same function
            callbackScope: this,
            //startAt: 0,
            loop: true,
        });
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
            repeat: 1,
        });

        //animation create
        this.anims.create({
            key: 'Ora',
            defaultTextureKey: spriteAtlasName,
            frames: [
                {frame: 'sprite1'},
                {frame: 'sprite7'}
            ],
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'Fire',
            defaultTextureKey: spriteAtlasName,
            frames: [{frame: 'sprite3'}],
            frameRate: 24,
            repeat: 12,
        })

        this.anims.create({
            key: 'Run',
            defaultTextureKey: spriteAtlasName,
            frames: [{frame: 'sprite5'}],
            repeat: -1.
        })

        this.anims.create({
            key: 'Idle',
            defaultTextureKey: spriteAtlasName,
            frames: [{frame: 'sprite2'}],
        })
    }

    update () {
        if (!this.gameOver) {
            this.background.tilePositionX += 8;
            //update playerobject
            this.player.update();

            //if player gets hit
            this.physics.world.collide(this.player, this.obstacleGroup, this.destroyPlayer, null, this);
            //if the player fired
            if (this.player.isFiring) {
                this.physics.world.collide(this.player.projectile, this.obstacleGroup, this.destroyObstacle, null, this);
            }
        } else {
            this.add.text(centerX , centerY , 'GAME OVER' , scoreConfig).setOrigin(.5);
            this.add.text(centerX , centerY + 64 , '(J) to Restart' , scoreConfig).setOrigin(.5);
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
            let obstacle = new Obstacle(this, game.config.width, this.spawnGroup[spawnY], obstacleVelocity).setOrigin(0.5);
            this.obstacleGroup.add(obstacle);
        } else if (this.difficultyLevel == 1) {
            let obstacle_1 = new Obstacle(this, game.config.width, this.spawnGroup[0], obstacleVelocity).setOrigin(0.5);
            let obstacle_2 = new Obstacle(this, game.config.width, this.spawnGroup[1], obstacleVelocity).setOrigin(0.5);
            let obstacle_3 = new Obstacle(this, game.config.width, this.spawnGroup[2], obstacleVelocity).setOrigin(0.5);
            this.obstacleGroup.addMultiple([obstacle_1, obstacle_2, obstacle_3]);
        } else if (this.difficultyLevel == 2) {
            //Credit to aardvarkk for providing logic to creating semi randomized selection
            //https://stackoverflow.com/questions/6625551/math-random-number-without-repeating-a-previous-number
            let numArray = [1, 2, 3];//SHOULD BE FIXED HARDCODED
            let obstacleArray = [];
            let spawnNum = Phaser.Math.Between(0, numArray.length - 1);
            for (let i = 0; i < numOfLanes; i++) {
                for (let j = 0; j < numArray[spawnNum]; j++) {
                    obstacleArray.push(new Obstacle(this, game.config.width + (this.playerSpriteInfo.width*j), this.spawnGroup[i], obstacleVelocity - 200).setOrigin(0.5))
                }
                numArray.splice(spawnNum, 1);
                spawnNum = Phaser.Math.Between(0, numArray.length - 1);
            }
            this.obstacleGroup.addMultiple(obstacleArray);
        }
    }

    //object1 and object2 passed from phaser collision handler
    destroyObstacle(object1, object2) {
        this.playerCoolDown = defaultCoolDown;
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