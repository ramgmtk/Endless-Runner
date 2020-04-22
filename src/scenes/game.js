class Game extends Phaser.Scene {
    // game scene
    constructor () {
        super('gameScene');
    }

    preload () {
        // dummy asset
        this.picture = this.load.image('foo', './assets/foo.png')
    }

    create () {
        //fetching image size from cache
        //credit to user rich: https://www.html5gamedevs.com/topic/36286-get-image-from-cache/
        this.playerSpriteInfo = game.textures.get('foo');
        this.playerSpriteInfo = this.playerSpriteInfo.getSourceImage();
        //Game variables
        this.obstacleVelocity = -500;
        this.bottomSpawnY = game.config.height - laneSize/2 - this.playerSpriteInfo.height/2;
        this.middleSpawnY = game.config.height/2 - this.playerSpriteInfo.height/2;
        this.topSpawnY = laneSize/2 - this.playerSpriteInfo.height/2;

        this.spawnGroup = { 
            '1': this.bottomSpawnY,
            '2': this.middleSpawnY,
            '3': this.topSpawnY,
        }

        // declaring controls
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // creating player object
       
        this.player = new Player(this, 0, this.bottomSpawnY, 'foo').setOrigin(0);

        //temporary flag
        this.obstacleSpawn = false;
        this.tempObstacle;
    }

    update () {
        this.player.update();
        if(!this.obstacleSpawn) {
            this.obstacleSpawn = true;
            this.generateObstacles();
        }
        //temporary object and destruction
        if(this.tempObstacle.active != false) {
            this.tempObstacle.update();
        } else {
            this.obstacleSpawn = false;
        }
    }

    //This is will generate the code for spawning waves of obstacles
    generateObstacles() {
        let spawnY = Phaser.Math.Between(1, 3);
        this.tempObstacle = new Obstacle(this, this.spawnGroup[spawnY], 0, this.obstacleVelocity).setOrigin(0);
    }
}