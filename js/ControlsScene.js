export default class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
    };

    preload() {
        this.load.image('controls', 'assets/images/controls.png');
    };

    create() {
        const screen = this.add.image(0, 0, 'controls').setOrigin(0);
        this.input.keyboard.on('keydown', () => {
            this.scene.stop('ControlsScene')
            this.scene.start('MainScene')
        })

        screen.depth = 100;
    };

};