export default class HealthBar extends Phaser.Scene {

    constructor(scene, x, y, health, maxHealth) {
        super("HealthBar");
        //tried loading the image here
        scene.load.image('Healthbarframe', 'assets/images/Healthbarframe.png');
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.depth = 10;
        this.bar.setScrollFactor(0,0);
        this.text = new Phaser.GameObjects.Text(scene, 137, 114.75, ``, { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2});
        this.text.depth = 11;
        this.text.setScrollFactor(0,0);
        this.x = x;
        this.y = y;
        this.value = health;
        this.denominator = maxHealth;
        //tried creating the image here and setting things.
        this.image = new Phaser.GameObjects.Image(scene, 110, 102, "Healthbarframe").setOrigin(0);
        this.image.depth = 9;
        this.image.setScale(.3);
        this.image.setScrollFactor(0);
        this.size = {
            width: 77,
            height: 11
        

        }

        this.pixelPerHealth = this.size.width / this.value;

        scene.add.existing(this.bar);
        scene.add.existing(this.text);
        scene.add.existing(this.image);

        this.draw(x, y);
    };

    modifyhp(amount) {
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
        //tried actually setting the image texture so it's visible.
        this.image.setTexture(`Healthbarframe`);

        const { width, height } = this.size;
        const margin = 2;
        const offset = 15;
        const chamfer = 4;
        const healthWidth = (this.value * this.pixelPerHealth);
        
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, width - margin, height - margin, chamfer);

        if(healthWidth <= this.size.width/4){
            this.bar.fillStyle(0xFF0000);
        } else {
            this.bar.fillStyle(0x00FF00);
        }
    
        if(healthWidth > 0){
            this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, healthWidth - margin, height - margin, chamfer);
        }

    };

};
