export default class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    static preload(scene){
        scene.load.image('MenuBackground', 'assets/images/MenuBackground.png');    
        scene.load.image('OptionButton', 'assets/images/OptionButton.png'); 
        scene.load.image('ResumeButton', 'assets/images/ResumeButton.png'); 
        scene.load.image('SaveButton', 'assets/images/SaveButton.png'); 
        scene.load.audio('IntroSong', 'assets/audio/IntroSong.mp3');
        scene.load.atlas('loading_sprite', 'assets/images/loading_sprite.png', 'assets/images/loading_sprite_atlas.json');
        scene.load.animation('loading_sprite_anim', 'assets/images/loading_sprite_anim.json');
    }

    create(){

        let MenuBackground = this.add.image(240, 240, 'MenuBackground').setOrigin(0); 
        MenuBackground.depth = 10;
        MenuBackground.setScrollFactor(0);

        let ResumeButton = this.add.image(260, 260, 'ResumeButton').setOrigin(0); 
        ResumeButton.depth = 20;
        ResumeButton.setScrollFactor(0);

        let OptionButton = this.add.image(260, 300, 'OptionButton').setOrigin(0); 
        OptionButton.depth = 20;
        OptionButton.setScrollFactor(0);

        let SaveButton = this.add.image(260, 340, 'SaveButton').setOrigin(0); 
        SaveButton.depth = 20;
        SaveButton.setScrollFactor(0);

        let hoverSprite = this.add.sprite(250,350, "loading_sprite")
        hoverSprite.setScale(0.5);
        hoverSprite.setVisible(false);
        hoverSprite.setDepth(20);
        hoverSprite.setScrollFactor(0);

        SaveButton.setInteractive();
        OptionButton.setInteractive();
        ResumeButton.setInteractive();


        SaveButton.on('pointerover',() => {
            hoverSprite.setVisible(true);
            hoverSprite.play('loading');
            console.log(`hovering over save button`);
        })
        SaveButton.on('pointerout',() => {
            hoverSprite.setVisible(false);
            console.log(`not hovering over save button`);
        })
        SaveButton.on('pointerup',() => {
            console.log(`Game Saved! (Not yet available)`);
        })


        ResumeButton.on('pointerover',() => {
            console.log(`hovering over resume button`);
        })
        ResumeButton.on('pointerout',() => {
            console.log(`not hovering over resume button`);
        })
        ResumeButton.on('pointerup',() => {
            console.log(`Resumes Game. (Not yet available)`);
        })


        OptionButton.on('pointerover',() => {
            console.log(`hovering over option button`);
        })
        OptionButton.on('pointerout',() => {
            console.log(`not hovering over option button`);
        })
        OptionButton.on('pointerup',() => {
            console.log(`Brings up options. (Not yet available)`);
        })

        this.sound.pauseOnBlur = true;
        this.sound.play('IntroSong', {volume: 0.0}, {loop: true});
    }

}


