export default class HealthBar extends Phaser.Scene {
    constructor(scene, x, y, health, maxHealth) {
        super("HealthBar");

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 10;
        this.bar.setScrollFactor(0,0);
        this.text = new Phaser.GameObjects.Text(scene, 135, 108, ``, { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2});
        this.text.depth = 11;
        this.text.setScrollFactor(0,0);
        this.x = x;
        this.y = y;
        this.healthValue = health;
        this.healthDenominator = maxHealth;
        this.size = {
            width: 77,
            height: 10
        }
        this.pixelPerHealth = this.size.width / this.healthDenominator;

        scene.add.existing(this.bar);
        scene.add.existing(this.text);

        this.draw(x, y);
    };

    modifyhp(amount) {
        if(amount <= 0) {
            this.healthValue = 0;
        //makes it so bar doesn't draw above max health.
        } else if(amount >= this.healthDenominator){
            this.healthValue = this.healthDenominator
        } else {
            this.healthValue = amount;
        }
        this.draw(this.x, this.y);

    }

    draw(x,y) {

        this.bar.clear();
        this.text.setText(`${this.healthValue}/${this.healthDenominator}`);

        const { width, height } = this.size;
        const chamfer = 4;
        const healthWidth = (this.healthValue * this.pixelPerHealth);
        
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRoundedRect(x, y, width, height, 0);

        if(healthWidth <= this.size.width/4){
            this.bar.fillStyle(0xFF0000);
        } else {
            this.bar.fillStyle(0x73e600);
        }
    
        if(healthWidth > 0){
            this.bar.fillRoundedRect(x, y, healthWidth, height, 0);
        }

    };

};
