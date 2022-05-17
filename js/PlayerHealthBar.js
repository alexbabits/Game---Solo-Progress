export default class PlayerHealthBar extends Phaser.Scene {
        //attempts to refer to the player's health.
    constructor(scene, x, y, health) {
        super("PlayerHealthBar");
        //creating the healthbar phaser game object
        this.bar = new Phaser.GameObjects.Graphics(scene);
        //object follows the camera.
        this.bar.setScrollFactor(0,0);

        this.x = x;
        this.y = y;
        //attempts to refer to the player's health.
        this.health = health;

        //size of the health bar.
        this.size = {
            width: 50,
            height: 10
        }

        //How many pixels per health? (this.size.width / player health, hard coded for now.). Attempts to refer to the player's health.
        this.pixelPerHealth = this.size.width / this.health;

        //this actually adds the bar to the scene.
        scene.add.existing(this.bar);
        //calls the draw method we created below the constructor
        this.draw(x, y);

    }
    //Once your constructor is good, import it to your player.js

    //decrease method to decrease the amount. Draws new bar with new x and y for amount decreased.
    //Also checks if it's less than zero, then just set it to zero, else set it to normal decreased amount.
    decrease(amount) {
        if(amount <= 0) {
            this.health = 0;
        } else {
            this.health = amount;
        }
        this.draw(this.x, this.y);
    }

    //draw rectangle
    draw(x,y) {
    //clears any previous shape.
        this.bar.clear();
    //get width and height, and margin for the bars
        const { width, height } = this.size;
        const margin = 2;
        const healthWidth = Math.floor(this.health * this.pixelPerHealth);

    //color, shape, position, fill, size
        this.bar.fillStyle(0xFF0000);
        this.bar.fillRect(x, y, width + margin, height + margin);

    //making another inner bar (background inner)
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(x + margin, y + margin, width - margin, height - margin);

    //making a 3rd bar that will actually move when the player is damaged. (inner dynamic bar) 
    //width based on % health.
        this.bar.fillStyle(0x00FF00);
        this.bar.fillRect(x + margin, y + margin, healthWidth - margin, height - margin);

    //edge case if your health goes negative, sets and keeps health bar 'empty'.
        if(healthWidth > 0){
            this.bar.fillRect(x + margin, y + margin, healthWidth - margin, height - margin);
        }
    //if less than 20% health, show different color health bar.
        if(healthWidth <= this.size.width/5){
            this.bar.fillStyle(0xFFFF00);
        } else {
            this.bar.fillStyle(0x00FF00);
        }

    }

}

