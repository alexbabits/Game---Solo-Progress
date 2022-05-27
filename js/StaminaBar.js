export default class StaminaBar extends Phaser.Scene {
    constructor(scene, x, y, stamina, maxStamina) {
        super("StaminaBar");

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 10;
        this.bar.setScrollFactor(0,0);
        this.text = new Phaser.GameObjects.Text(scene, 311, 114.25, ``, { fontFamily: 'Courier', fontSize: '12px', fill: '#000', resolution: 2});
        this.text.depth = 11;
        this.text.setScrollFactor(0,0);
        this.x = x;
        this.y = y;
        this.staminaValue = stamina;
        this.staminaDenominator = maxStamina;
        this.size = {
            width: 200,
            height: 11
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
        const margin = 2;
        const offset = 15;
        const chamfer = 4;
        const staminaWidth = (this.staminaValue * this.pixelPerStamina);
        
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, width - margin, height - margin, chamfer);

        if(this.size.width <= this.pixelPerStamina * this.staminaValue){
            this.size.width = 200
        }

        if(staminaWidth <= this.size.width && staminaWidth > this.size.width/1.333){
            this.bar.fillStyle(0x00b300);
        } else if (staminaWidth <= this.size.width/1.333 && staminaWidth > this.size.width/2) {
            this.bar.fillStyle(0xe6e600);
        } else if (staminaWidth <= this.size.width/2 && staminaWidth >= this.size.width/4) {
            this.bar.fillStyle(0xff9000);
        } else if(staminaWidth <= 0){ //fixes the problem with numbers near zero not filling correctly.
            this.bar.fillStyle(0xFFFFFF);
            this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, 0, height - margin, chamfer);
        } else {
            this.bar.fillStyle(0xFF0000);
        }

        //almost fixed graphics for now, think it has to do with stamina going above max or below min.
            if(this.staminaValue >= this.staminaDenominator){
                this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, staminaWidth - margin, height - margin, chamfer);
            } else {
                this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, staminaWidth + margin, height - margin, chamfer);
            }

        //if the physical length of the bar exceeds 200, then set it back to 200.

    };

};
