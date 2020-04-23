class Game extends Phaser.Scene {
    // game scene
    constructor () {
        super('gameScene');
    }

    preload () {
        // dummy asset
        this.load.image('foo', './assets/foo.png')
    }

    create () {
        //fetching image size from cache
        //credit to user rich: https://www.html5gamedevs.com/topic/36286-get-image-from-cache/
        this.playerSpriteInfo = game.textures.get('foo');
        this.playerSpriteInfo = this.playerSpriteInfo.getSourceImage();
        //Game variables
        this.obstacleVelocity = -500;
        this.bottomSpawnY = game.config.height - laneSize/2;
        this.middleSpawnY = game.config.height/2;
        this.topSpawnY = laneSize/2;
        this.difficultyTable = {
            '1': this.generateObstacles,
        }
        this.difficultyLevel = 1;

        this.spawnGroup = { 
            '1': this.bottomSpawnY,
            '2': this.middleSpawnY,
            '3': this.topSpawnY,
        }

        // declaring controls
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // creating player object
        this.player = new Player(this, this.playerSpriteInfo.width/2, this.bottomSpawnY, 'foo').setOrigin(0.5);

        //enemy spawner
        this.obstacleGroup = this.add.group({
            scene: this,
            runChildUpdate: true,
        });

        this.obstacleSpawn = this.time.addEvent({
            delay: 1000,
            callback: this.difficultyTable[this.difficultyLevel],
            callbackScope: this,
            startAt: 0,
            loop: true,
        })
    }

    update () {
        this.player.update();
        /*if (Math.floor(game.getTime()) % 71 == 0) {
            this.generateObstacles();
        }*/
    }

    //This is will generate the code for spawning waves of obstacles
    generateObstacles() {
        let spawnY = Phaser.Math.Between(1, 3);
        let obstacle = new Obstacle(this, this.spawnGroup[spawnY], 0, this.obstacleVelocity).setOrigin(0.5);
        this.obstacleGroup.add(obstacle);
    }
}