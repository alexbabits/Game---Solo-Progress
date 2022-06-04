export default class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    static preload(scene){
        scene.load.image('MenuBackground', 'assets/images/MenuBackground.png');    
        scene.load.image('OptionButton', 'assets/images/OptionButton.png'); 
        scene.load.image('ResumeButton', 'assets/images/ResumeButton.png'); 
        scene.load.image('SaveButton', 'assets/images/SaveButton.png'); 
        scene.load.image('LoadButton', 'assets/images/LoadButton.png');  
        scene.load.image('QuitButton', 'assets/images/QuitButton.png');  
        scene.load.audio('MenuSong', 'assets/audio/MenuSong.mp3');
        scene.load.atlas('loading_sprite', 'assets/images/loading_sprite.png', 'assets/images/loading_sprite_atlas.json');
        scene.load.animation('loading_sprite_anim', 'assets/images/loading_sprite_anim.json');
    }

    create(){

        this.menuSong = this.sound.add('MenuSong', {volume: 0.2}, {loop: true});
        this.menuSong.play();

        let MenuBackground = this.add.image(240, 240, 'MenuBackground').setOrigin(0); 
        MenuBackground.depth = 1;
        MenuBackground.setScrollFactor(0);

        let ResumeButton = this.add.image(290, 260, 'ResumeButton').setOrigin(0); 
        ResumeButton.depth = 2;
        ResumeButton.setScrollFactor(0);

        let OptionButton = this.add.image(290, 380, 'OptionButton').setOrigin(0); 
        OptionButton.depth = 2;
        OptionButton.setScrollFactor(0);

        let SaveButton = this.add.image(290, 340, 'SaveButton').setOrigin(0); 
        SaveButton.depth = 2;
        SaveButton.setScrollFactor(0);

        let LoadButton = this.add.image(290, 300, 'LoadButton').setOrigin(0); 
        LoadButton.depth = 2;
        LoadButton.setScrollFactor(0);

        let QuitButton = this.add.image(290, 420, 'QuitButton').setOrigin(0); 
        QuitButton.depth = 2;
        QuitButton.setScrollFactor(0);

        let hoverSprite = this.add.sprite(270,352, "loading_sprite")
        hoverSprite.setScale(.75);
        hoverSprite.setVisible(false);
        hoverSprite.setDepth(20);
        hoverSprite.setScrollFactor(0);

        let hoverSprite2 = this.add.sprite(270,312, "loading_sprite")
        hoverSprite2.setScale(.75);
        hoverSprite2.setVisible(false);
        hoverSprite2.setDepth(20);
        hoverSprite2.setScrollFactor(0);

        let hoverSprite3 = this.add.sprite(270,432, "loading_sprite")
        hoverSprite3.setScale(.75);
        hoverSprite3.setVisible(false);
        hoverSprite3.setDepth(20);
        hoverSprite3.setScrollFactor(0);

        let hoverSprite4 = this.add.sprite(270,272, "loading_sprite")
        hoverSprite4.setScale(.75);
        hoverSprite4.setVisible(false);
        hoverSprite4.setDepth(20);
        hoverSprite4.setScrollFactor(0);

        let hoverSprite5 = this.add.sprite(270,392, "loading_sprite")
        hoverSprite5.setScale(.75);
        hoverSprite5.setVisible(false);
        hoverSprite5.setDepth(20);
        hoverSprite5.setScrollFactor(0);

        SaveButton.setInteractive();
        OptionButton.setInteractive();
        ResumeButton.setInteractive();
        QuitButton.setInteractive();
        LoadButton.setInteractive();


        SaveButton.on('pointerover',() => {
            SaveButton.setTint(0x999999);
            hoverSprite.setVisible(true);
            hoverSprite.play('loading');
            console.log(`hovering over save button`);
        })
        SaveButton.on('pointerout',() => {
            SaveButton.setTint(0xFFFFFF);
            hoverSprite.setVisible(false);
            console.log(`not hovering over save button`);
        })
        SaveButton.on('pointerup',() => {
            console.log(`Game Saved! (Not yet available)`);
        })

        LoadButton.on('pointerover',() => {
            LoadButton.setTint(0x999999);
            hoverSprite2.setVisible(true);
            hoverSprite2.play('loading');
            console.log(`hovering over Load button`);
        })
        LoadButton.on('pointerout',() => {
            hoverSprite2.setVisible(false);
            LoadButton.setTint(0xFFFFFF);
            console.log(`not hovering over load button`);
        })
        LoadButton.on('pointerup',() => {
            console.log(`Game Loaded! (Not yet available)`);
        })

        QuitButton.on('pointerover',() => {
            QuitButton.setTint(0x999999);
            hoverSprite3.setVisible(true);
            hoverSprite3.play('loading');
            console.log(`hovering over Quit button`);
        })
        QuitButton.on('pointerout',() => {
            hoverSprite3.setVisible(false);
            QuitButton.setTint(0xFFFFFF);
            console.log(`not hovering over quit button`);
        })
        QuitButton.on('pointerup',() => {
            this.scene.start('StartScene');
            console.log(`Quitting the Game. (Not yet available)`);
        })


        ResumeButton.on('pointerover',() => {
            ResumeButton.setTint(0x999999);
            hoverSprite4.setVisible(true);
            hoverSprite4.play('loading');
            console.log(`hovering over resume button`);
        })
        ResumeButton.on('pointerout',() => {
            hoverSprite4.setVisible(false);
            ResumeButton.setTint(0xFFFFFF);
            console.log(`not hovering over resume button`);
        })
        ResumeButton.on('pointerup',() => {
            this.scene.resume('MainScene');
            this.scene.stop('Menu');
            this.menuSong.stop();
            console.log(`Resumes Game. (Not yet available)`);
        })


        OptionButton.on('pointerover',() => {
            OptionButton.setTint(0x999999);
            hoverSprite5.setVisible(true);
            hoverSprite5.play('loading');
            console.log(`hovering over option button`);
        })
        OptionButton.on('pointerout',() => {
            hoverSprite5.setVisible(false);
            OptionButton.setTint(0xFFFFFF);
            console.log(`not hovering over option button`);
        })
        OptionButton.on('pointerup',() => {
            this.scene.start('ControlsScene');
            console.log(`Brings up options. (Not yet available)`);
        })

        //keeps sound playing when clicked off browser. Probably need something like this for the storm interval timer, to pause it, otherwise it's always ticking.
        this.sound.pauseOnBlur = true;
        
    }

}


