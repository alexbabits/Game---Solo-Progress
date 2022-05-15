/*
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    };

preload() {
//adding graphics so they can be rectangles in the future.
let progressBar = this.add.graphics();
let progressBox = this.add.graphics();
progressBox.fillStyle(0xffff00, .2);
//position x,y and width height
progressBox.fillRect(170,295,300,50);

let width = this.game.config.width;
let height = this.game.config.height;

let loadingText = this.make.text({
    x: width / 2 + 5,
    y: height / 2 - 70,
    text: 'Loading',
    style: {
        font: '48px monospace',
        fill: '#cbdbfc'
    }
});
loadingText.setOrigin(0.5, 0.5);

let percentText = this.make.text({
    x: width / 2,
    y: height / 2,
    text: '0%',
    style: {
        font: '24px monospace',
        fill: '#000000'
    }
});
percentText.setOrigin(0.5, 0.5);

let assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 50,
    text: '',
    style: {
        font: '18px monospace',
        fill: '#cbdbfc'
    }
});
assetText.setOrigin(0.5, 0.5);

this.load.on('progress', function (value) {
    percentText.setText(parseInt(value * 100) + '%');
    progressBar.clear();
    progressBar.fillStyle(0xffff00, 1);
    progressBar.fillRect(170, 295, 300 * value, 50);
});

this.load.on('fileprogress', function (file) {
    assetText.setText('Loading asset: ' + file.key);
});

this.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
    percentText.destroy();
    assetText.destroy();
});

//Just iterating the image 500 times to take time to load so loading bar has a purpose.
this.load.image('logo', 'zenvalogo.png');
for (let i = 0; i < 500; i++) {
    this.load.image('logo'+i, 'zenvalogo.png');
        }

    };
    
    create() {
        let logo = this.add.image(400, 300, 'logo');
    }

};

*/