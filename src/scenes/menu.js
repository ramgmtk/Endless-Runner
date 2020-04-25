class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        //example below of how to load audio
        // this.load.audio('sfx_select', './assets/blip_select12.wav');
    }

    create(){
        // example of how to format text and give it many different things
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        // center X and center Y are the two centers of the screen, call these instead of game.config.width / 2
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        // let textSpacer = 64;

        // this is how you add static text that won't change at all
        this.add.text(centerX , centerY, 'FANTASY RUNNER' , menuConfig).setOrigin(.5);
        // menuConfig.backgroundColor = '#00FF00';
        // menuConfig.color = '#000';
        // this is how you make a text variable that can change!
        // will need this is there are different difficulties or different modes
        // this.rocketControlText = this.add.text(centerX , centerY + textSpacer*3.5 , 'OFF' , menuConfig).setOrigin(.5);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyJ)) {
            // example of how to play a sound once
            // this.sound.play('sfx_select');
            // launches the next scene
            this.scene.start("gameScene");
        }
    }
}