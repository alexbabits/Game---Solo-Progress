export default class ManaBar extends Phaser.Scene {
    constructor(scene, x, y, mana, maxMana) {
        super("ManaBar");

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 10;
        this.bar.setScrollFactor(0,0);
        this.text = new Phaser.GameObjects.Text(scene, 135, 122, ``, { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2});
        this.text.depth = 11;
        this.text.setScrollFactor(0,0);
        this.x = x;
        this.y = y;
        this.manaValue = mana;
        this.manaDenominator = maxMana;
        this.size = {
            width: 77,
            height: 10
        }
        this.pixelPerMana = this.size.width/this.manaDenominator;

        scene.add.existing(this.bar);
        scene.add.existing(this.text);

        this.draw(x, y);
    };

    modifyMana(amount) {
        if(amount <= 0) {
            this.manaValue = 0;
        } else {
            this.manaValue = amount;
        }
        this.draw(this.x, this.y);

    }

    draw(x,y) {

        this.bar.clear();
        this.text.setText(`${this.manaValue}/${this.manaDenominator}`);

        const { width, height } = this.size;
        const chamfer = 4;
        const manaWidth = this.manaValue * this.pixelPerMana;

        //white background bar
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRoundedRect(x, y, width, height, chamfer);

        //blue bar
        this.bar.fillStyle(0x008cff);

        if(manaWidth > 0){
            this.bar.fillRoundedRect(x, y, manaWidth, height, chamfer);
        }

    };

};
