export default class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    };

    preload() {
        this.load.image('userLogin', 'assets/images/userLogin.png');
    };

    create() {
        const screen = this.add.image(0, 0, 'userLogin').setOrigin(0).setScale(1);
        this.input.keyboard.on('keydown', () => {
            this.scene.stop('StartScene')
            this.scene.start('MainScene')
        })

        screen.depth = 500;
    };

};





