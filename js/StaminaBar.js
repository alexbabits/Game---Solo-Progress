export default class StaminaBar extends Phaser.Scene {
    constructor(scene, x, y, stamina, maxStamina) {
        super("StaminaBar");

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 10;
        this.bar.setScrollFactor(0,0);
        this.text = new Phaser.GameObjects.Text(scene, 320, 114.25, ``, { fontFamily: 'Courier', fontSize: '12px', fill: '#000', resolution: 2});
        this.text.depth = 11;
        this.text.setScrollFactor(0,0);
        this.x = x;
        this.y = y;
        this.value = stamina;
        this.denominator = maxStamina;
        this.size = {
            width: 200,
            height: 11
        }
        this.pixelPerStamina = this.size.width / this.value;

        scene.add.existing(this.bar);
        scene.add.existing(this.text);

        this.draw(x, y);
    };

    modifyStamina(amount) {
        if(amount <= 0) {
            this.value = 0;
        } else {
            this.value = amount;
        }
        this.draw(this.x, this.y);

    }

    draw(x,y) {

        this.bar.clear();
        this.text.setText(`${this.value}/${this.denominator}`);

        const { width, height } = this.size;
        const margin = 2;
        const offset = 15;
        const chamfer = 4;
        const staminaWidth = (this.value * this.pixelPerStamina);
        
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, width - margin, height - margin, chamfer);

        if(staminaWidth <= this.size.width/4){
            this.bar.fillStyle(0xFF0000);
        } else {
            this.bar.fillStyle(0xe6e600);
        }
    
        if(staminaWidth > 0){
            this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, staminaWidth - margin, height - margin, chamfer);
        }

    };

};
