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
        this.playerSlope; //used for vectoring player back to the center for the death animation.
        this.alphaValue = 0.00;
        //this.gameOverFlag = false;
        this.playerCoolDown = defaultCoolDown;
        this.bottomSpawnY = game.config.height - laneSize/2; //only three spawn variables for 3 lanes, does not translate well to increase in lane size
        this.middleSpawnY = centerY;
        this.topSpawnY = centerY - laneSize;

        // set up how to draw timer
        this.timeAlive = 0;
        this.timerCenter = this.add.text(240 , 40 , `Home: ${this.timeAlive}` , scoreConfig).setOrigin(.5).setDepth(1);
        this.timerCenterTopScore = this.add.text(game.config.width - 240, 40 , `Away: ${highScore}` , scoreConfig).setOrigin(.5).setDepth(1);

        //difficulty adjustment
        //delayed functions calls will call whichever corresponding difficulty
        //enemy spawned is req'd.
        this.difficultyLevel = 0; //need to add max for this value
        this.difficultyMax = 3;

        this.spawnGroup = [ 
            this.bottomSpawnY,
            this.middleSpawnY,
            this.topSpawnY,
        ];

        // declaring controls
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        //keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        //keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

        // creating player object
        this.player = new Player(this, this.playerSpriteInfo.width, this.middleSpawnY, spriteAtlasName, 'sprite5').setScale(scale).setOrigin(0.5).setDepth(2);
        //create background
        this.background = this.add.tileSprite(0, uiSizeY, 1080, 720, 'ER_FantasyRugby_Background_v2').setOrigin(0).setDepth(0);
        this.add.tileSprite(0, 0, 270, 20, 'scoreboard').setOrigin(0).setDepth(0).setScale(4);

        //sound stuff
        this.bgm = this.sound.add('crowd', {
            mute: false,
            volume: 0.75,
            rate: 1.0,
            loop: true,

        });

        this.hitEffect = this.sound.add('cheer', {
            mute: false,
            volume: 0.50,
            rate: 1.0,
            loop: false,
        });

        this.bgm.play();

        //enemy spawner
        this.obstacleGroup = this.add.group({
            scene: this,
            runChildUpdate: true,
        });

        this.obstacleSpawn = this.time.addEvent({
            delay: 2500,
            callback: this.generateObstacles,
            callbackScope: this,
            //startAt: 0,
            loop: true,
        });

        // this increments the """score""" or time alive and increases it by 1 each second
        // the function lifeTimer is at the bottom of this file
        let lifeCounter = this.time.addEvent({ delay: 1000, callback: lifeTimer, callbackScope: this, loop: true });

        //difficulty //dont necessarily need a pointer to it SHOULD FIX
        let difficultyBump = this.time.addEvent({
            delay: 10000,
            callback : () => {
                this.difficultyLevel++;
                console.log("Difficulty increased");
                this.playerCoolDown -= 50;
                this.obstacleSpawn.delay -= 150;
            },
            callbackScope: this,
            repeat: this.difficultyMax + 5,
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
        });

        this.anims.create({
            key: 'Run',
            defaultTextureKey: mainAtlas,
            frames: [
                {frame: 'JojoRun1'},
                {frame: 'JojoRun2'},
                {frame: 'JojoRun3'},
                {frame: 'JojoRun4'},
                {frame: 'JojoRun5'},
                {frame: 'JojoRun6'},
            ],
            frameRate: 12,
            repeat: -1.
        });

        this.anims.create({
            key: 'stand_cooldown',
            defaultTextureKey: mainAtlas,
            frames: [
                {frame: 'StandRech1'},
                {frame: 'StandRech2'},
                {frame: 'StandRech3'},
            ],
            duration: this.playerCoolDown,
        })

        this.anims.create({
            key: 'Idle',
            defaultTextureKey: spriteAtlasName,
            frames: [{frame: 'sprite2'}],
        });

        this.anims.create({
            key: 'stand_idle',
            defaultTextureKey: mainAtlas,
            frames: [{frame: 'StandRech3'}]
        });

        this.anims.create({
            key: 'Muda',
            defaultTextureKey: mainAtlas,
            frames: [
                {frame: 'DioWalk1'},
                {frame: 'DioWalk2'},
                {frame: 'DioWalk3'},
                {frame: 'DioWalk4'},
                {frame: 'DioWalk5'},
                {frame: 'DioWalk6'},
                {frame: 'DioWalk7'},
            ],
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'The World',
            defaultTextureKey: mainAtlas,
            frames: [
                {frame: 'DioDeath1'},
                {frame: 'DioDeath2'},
                {frame: 'DioDeath3'},
                {frame: 'DioDeath4'},
                {frame: 'DioDeath5'},
                {frame: 'DioDeath6'},
                {frame: 'DioDeath7'},
                {frame: 'DioDeath8'},
            ],
            frameRate: 12,
        });

        this.anims.create({
            key: 'OH NO',
            defaultTextureKey: mainAtlas,
            frames: [
                {frame: 'JojoDie1'},
                {frame: 'JojoDie2'},
                {frame: 'JojoDie3'},
                {frame: 'JojoDie4'},
                {frame: 'JojoDie5'},
                {frame: 'JojoDie6'},
                {frame: 'JojoDie7'},
                {frame: 'JojoDie8'},
            ],
            frameRate: 4,
        });

        //changes that happen on death do not need to be updated often
        if (this.gameOver && (this.player.x > centerX + 4 || this.player.x < centerX - 4)) {
            this.background = this.add.tileSprite(0, uiSizeY, 1080, 720, 'foo').setOrigin(0, 0);
        }
    }

    update () {
        if (!this.gameOver) {
            this.background.tilePositionX += 8.0;
            //update playerobject
            this.player.update();
            //if player gets hit
            this.physics.world.collide(this.player, this.obstacleGroup, this.destroyPlayer, (object1, object2) => {
                return object2.canCollide;
            }, this);
            //if the player fired
            if (this.player.projectile.fired == true) {
                this.physics.world.collide(this.player.projectile, this.obstacleGroup, this.destroyObstacle, null, this);
            }
        } else {
            //SHOULD FIX, THAT SUCH THAT EVEN IF THE TRAVEL TO CENTER FAILS, INITIATE GAME-OVER SCREEN
            //This is code sends player to the center of the screen. The code is inefficient, not clean, and possibly prone to errors.
            if (this.player.x > centerX + 4 || this.player.x < centerX - 4) { //NOTE THE SCALAR MUST BE LESS THAN 2*MARGIN OF ERROR TO PREVENT INFINITE SLIDE
                this.player.x += 7*this.playerSlope.x;
            }
            if (this.player.y < game.config.height - (this.playerSpriteInfo.height * 2) - 4 || this.player.y > game.config.height - (this.playerSpriteInfo.height * 2) + 4) {
                this.player.y += 7*this.playerSlope.y;
            } else if (this.player.x <= centerX + 4 && this.player.x >= centerX - 4){
                if (!this.player.anims.isPlaying) {
                    this.background.setAlpha(1.0); //spotlight call
                    if (this.alphaValue < 0.15) {
                        this.alphaValue += 0.001;
                        this.restartGame();
                    }
                    if (keyJ.isDown) { //consider taking this outide of the else if chain so the user can skip the death screen.
                        this.scene.restart();
                    }
                }
            }
        }

        //update high score
        if(this.timeAlive > highScore) {
            highScore = this.timeAlive;
            this.timerCenterTopScore.text = `Away: ${highScore}`;
        }
    }

    //This is will generate the code for spawning waves of obstacles
    generateObstacles() {
        let level, velocityIncrease, spawnY, spawnNum;
        let obstacleArray = [];
        let numArray = [1, 2, 3];
        //at max difficulty cycle between the various difficulties
        if (this.difficultyLevel > this.difficultyMax) {
            level = Phaser.Math.Between(0, this.difficultyMax);
            velocityIncrease = dVelocity;
        }
        else {
            level = this.difficultyLevel;
            velocityIncrease = 0;
        }


        if (level == 0) {
            spawnY = Phaser.Math.Between(0, 2); //returns rand int between 0 and 2
            let obstacle = new Obstacle(this, game.config.width, this.spawnGroup[spawnY], obstacleVelocity - (3 * velocityIncrease)).setOrigin(0.5);
            this.obstacleGroup.add(obstacle);
        } else if (level == 1) {
            for (let i = 0; i < numOfLanes; i++) {
                obstacleArray.push(new Obstacle(this, game.config.width, this.spawnGroup[i], 
                    obstacleVelocity - (3 * velocityIncrease)).setOrigin(0.5));
            }
            this.obstacleGroup.addMultiple(obstacleArray);
        } else if (level == 2) {
            //Credit to aardvarkk for providing logic to creating semi randomized selection
            //https://stackoverflow.com/questions/6625551/math-random-number-without-repeating-a-previous-number
            let laneArray = [0, 1, 2];//SHOULD BE FIXED HARDCODED
            let laneNum = Phaser.Math.Between(0, laneArray.length - 1);
            spawnNum = Phaser.Math.Between(0, numArray.length - 1);
            for (let i = 0; i < numOfLanes - 1; i++) {
                for (let j = 0; j < numArray[spawnNum]; j++) {
                    obstacleArray.push(new Obstacle(this, game.config.width + (this.playerSpriteInfo.width*j), 
                        this.spawnGroup[laneArray[laneNum]], obstacleVelocity - (3 * velocityIncrease)).setOrigin(0.5))
                }
                numArray.splice(spawnNum, 1);
                laneArray.splice(laneNum, 1);
                laneNum = Phaser.Math.Between(0, laneArray.length - 1); 
                spawnNum = Phaser.Math.Between(0, numArray.length - 1);
                
            }
            this.obstacleGroup.addMultiple(obstacleArray);
        } else if (level == 3) {
            //Credit to aardvarkk for providing logic to creating semi randomized selection
            //https://stackoverflow.com/questions/6625551/math-random-number-without-repeating-a-previous-number
            spawnNum = Phaser.Math.Between(0, numArray.length - 1);
            for (let i = 0; i < numOfLanes; i++) {
                for (let j = 0; j < numArray[spawnNum]; j++) {
                    obstacleArray.push(new Obstacle(this, game.config.width + (this.playerSpriteInfo.width*j), 
                        this.spawnGroup[i], obstacleVelocity - (2 * velocityIncrease)).setOrigin(0.5))
                }
                numArray.splice(spawnNum, 1);
                spawnNum = Phaser.Math.Between(0, numArray.length - 1);
            }
            this.obstacleGroup.addMultiple(obstacleArray);
        }
    }

    //object1 and object2 passed from phaser collision handler
    destroyObstacle(object1, object2) {
        this.hitEffect.play();
        //object2.disableBody();
        object2.canCollide = false;
        object2.anims.play('The World');
        this.playerCoolDown = defaultCoolDown;
        object1.anims.play('stand_cooldown');
        object1.resetProjectile();
    }

    //currently on game over, obstacles off infinitely off screen
    //should delete objects from obstacle group
    destroyPlayer() {
        this.gameOver = true;
        this.player.projectile.destroy();
        this.bgm.mute = true;
        this.hitEffect.mute = true;
        this.time.removeAllEvents(); //clears the event calls
        this.obstacleGroup.runChildUpdate = false; //clear the obstacle group
        this.obstacleGroup.clear(true, true);
        this.background.destroy();
        this.background = this.add.tileSprite(0, uiSizeY, 1080, 720, 'Spotlight').setOrigin(0, 0).setAlpha(0.0).setDepth(0);
        this.player.setScale(scale + 0.5);

        //calculating slope of line to center for game over.
        this.playerSlope = {
            x: centerX - this.player.x,
            y: game.config.height  - (this.playerSpriteInfo.height * 2) - this.player.y,
        };
        let magnitude = Math.sqrt((this.playerSlope.x * this.playerSlope.x) + 
            (this.playerSlope.y * this.playerSlope.y));
        this.playerSlope.x = this.playerSlope.x / magnitude;
        this.playerSlope.y = this.playerSlope.y / magnitude;
        this.player.anims.play('OH NO')
    }

    restartGame() {
        this.add.text(centerX , centerY - 100 , 'GAME OVER' , scoreConfig).setOrigin(.5).setDepth(2).setAlpha(this.alphaValue);
        this.add.text(centerX , centerY - 36 , '(J) to Restart' , scoreConfig).setOrigin(.5).setDepth(2).setAlpha(this.alphaValue);
        this.add.tileSprite(0, uiSizeY, 1080, 720, 'dio').setOrigin(0).setAlpha(this.alphaValue/50).setDepth(1);
    }
}

function lifeTimer() {
    ++this.timeAlive;
    this.timerCenter.text = `Home: ${this.timeAlive}`;
}