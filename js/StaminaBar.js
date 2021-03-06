export default class StaminaBar extends Phaser.Scene {
    constructor(scene, x, y, stamina, maxStamina) {
        super("StaminaBar");

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 10;
        this.bar.setScrollFactor(0,0);
        this.text = new Phaser.GameObjects.Text(scene, 130, 136, ``, { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2});
        this.text.depth = 11;
        this.text.setScrollFactor(0,0);
        this.x = x;
        this.y = y;
        this.staminaValue = stamina;
        this.staminaDenominator = maxStamina;
        this.size = {
            width: 77,
            height: 10
        }
        this.pixelPerStamina = this.size.width/this.staminaDenominator;

        scene.add.existing(this.bar);
        scene.add.existing(this.text);

        this.draw(x, y);
    };

    modifyStamina(amount) {
        if(amount <= 0) {
            this.staminaValue = 0;
        } else {
            this.staminaValue = amount;
        }
        this.draw(this.x, this.y);

    }

    draw(x,y) {

        this.bar.clear();
        this.text.setText(`${this.staminaValue}/${this.staminaDenominator}`);

        const { width, height } = this.size;
        const chamfer = 4;
        const staminaWidth = this.staminaValue * this.pixelPerStamina;
        
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRoundedRect(x, y, width, height, 0);
        this.bar.fillStyle(0xe6e600);

        if(this.staminaValue > 0){
            this.bar.fillRoundedRect(x, y, staminaWidth, height, 0);
        }

    };

};
