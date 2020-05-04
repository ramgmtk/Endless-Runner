/*
Creative Tilt:
Programming:
    The enemy spawn system is a modified version of what Professor Nathan uses
    in paddle parkour. The tweaks I made where that this delayed event call is 
    called every 'n' seconds, where the event calls a function. That function then 
    selects an enemy spawn pattern to bring into the game based off of the current 
    dicciulty level. The difficulty level is adjusted by another event timer that goes 
    off every 10 seconds 'k' times. In tandem these two timers work together to dynamically 
    spawn enemies to the screen for players to avoid during gameplay. The code is not 
    optimized efficiently, but I thought the approach was modular and interesting.
    This can be found in game.js under the create() method: the timed events are this.obstacleSpawn,
    and this.difficultyBump. The enemy spawner function that gets called is generateObstacles().

    An additional note I found cool is how we used a sprite to represent a timer. Phasers 
    anims class allows the use of setting the duration of a sprite animation. One of the 
    sprite animations we use represents the cooldown of the players projectile. The cooldown 
    for that projectile goes down with increases in difficulty. The cool part is that this 
    gets reflected in the sprites animation as it gets sped up the faster the cooldown is.
    The code for the animation can be found in game.js under the create() method: 
    this.anims.create: key 'stand_cooldown'. This may be a brute force method of implementing this
    feature but I think it worked out fine.

Art: 
    Our ending screen is reminiscent of snes game over screens. We destroyed all objects on 
    screen with the exception of the player. The background cuts to black and as they are brought 
    to the center, then a spotlight shines on them. The game over text then fades in followed by an 
    ominous background. The cherry on top is a bit cruched sound byte of one of our groupmates taunting 
    the player. The background art was also drawn by one of our groupmates and greatly adds impact 
    to the death screen.

*/



let config = {
    type: Phaser.CANVAS,
    width: 1080,
    height: 720,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0,
            }
        }
    },
    scene: [ Menu, Game ],
}

// place holder text config, we can change this but i'm using it for score lol
let scoreConfig = {
    fontFamily: 'Arial' ,
    fontSize: '28px' ,
    // backgroundColor: '#c70000' ,
    color: '#c70000' ,
    align: 'right' ,
    padding: {
        top: 5 ,
        botom: 5 ,
    },
    fixedWidth: 0
}

let scoreConfigOuter = {
    fontFamily: 'Arial' ,
    fontSize: '32px' ,
    // backgroundColor: '#c70000' ,
    color: '#ffffff' ,
    align: 'right' ,
    padding: {
        top: 5 ,
        botom: 5 ,
    },
    fixedWidth: 0
}

let scoreConfigOuterOuter = {
    fontFamily: 'Arial' ,
    fontSize: '37px' ,
    // backgroundColor: '#c70000' ,
    color: '#c70000' ,
    align: 'right' ,
    padding: {
        top: 5 ,
        botom: 5 ,
    },
    fixedWidth: 0
}

let keyW , keyA , keyS , keyD , keyJ;
// center X and center Y are the two centers of the screen, call these instead of game.config.width / 2
let uiSizeY = 80;
let centerX = config.width / 2;
let centerY = ((config.height - uiSizeY) / 2) + uiSizeY;
// used to keep track of high scores between plays
let highScore = 0;
//variables for lanes, can be changes later should more need to be added.
let numOfLanes = 3
let laneSize = (config.height - uiSizeY)/numOfLanes;
//some gamevariables
let obstacleVelocity = -500;
let dVelocity = 200;
let playerAccel = 600;
let defaultCoolDown = 1000;
let scale = 1.5;
let scaleAdjust = 0.5;
let spriteAtlasName = 'prototype_atlas';
let mainAtlas = 'sprite_atlas';

function factorial(n) {
    let k = n;
    while (k > 1) {
        n = n * (n - 1);
        k = k - 1;
    }
    return k;
}

let game = new Phaser.Game(config);