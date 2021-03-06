export default class ExperienceBar extends Phaser.Scene {
    constructor(scene, x, y, experience, maxExperience) {
        super("ExperienceBar");

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 10;
        this.bar.setScrollFactor(0,0);
        this.text = new Phaser.GameObjects.Text(scene, 290, 108, ``, { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2});
        this.text.depth = 11;
        this.text.setScrollFactor(0,0);
        this.x = x;
        this.y = y;
        this.experienceValue = experience;
        this.experienceDenominator = maxExperience;
        this.size = {
            width: 200,
            height: 9
        }

        scene.add.existing(this.bar);
        scene.add.existing(this.text);

        this.draw(x, y);
    };

    modifyXp(currentAmount, maxAmount) {
        if(currentAmount <= 0) {
            this.experienceValue = 0;
        } else {
            this.experienceValue = currentAmount;
        }

        if(currentAmount >= maxAmount){
            this.experienceDenominator = this.experienceDenominator *= 1.5
        } else {
            this.experienceDenominator = maxAmount;
        }
        this.draw(this.x, this.y);

    }

    draw(x,y) {

        this.bar.clear();
        this.text.setText(`${this.experienceValue}/${this.experienceDenominator} EXP`);

        const { width, height } = this.size;
        const chamfer = 4;
        const experienceWidth = (this.experienceValue * (this.size.width/this.experienceDenominator));
        
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRoundedRect(x, y, width, height, 0);

        this.bar.fillStyle(0x7300e6);
        if(experienceWidth >= 0){
            this.bar.fillRoundedRect(x, y, experienceWidth, height, 0);
        }

    };

};