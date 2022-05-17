export default class PlayerHealthBar extends Phaser.Scene {
        //attempts to refer to the player's health.
    constructor(scene, x, y, health) {
        super("PlayerHealthBar");
        //creating the healthbar phaser game object
        this.bar = new Phaser.GameObjects.Graphics(scene);
        //The bar graphic follows the camera.
        this.bar.setScrollFactor(0,0);
        //sets depth of bar to front of screen always.
        this.bar.depth = 10;
        this.x = x;
        this.y = y;
        //attempts to refer to the player's health.
        this.value = health;

        //size of the health bar.
        this.size = {
            width: 77,
            height: 11
        }

        //How many pixels per health? (this.size.width / player health, hard coded for now.). Attempts to refer to the player's health.
        this.pixelPerHealth = this.size.width / this.value;

        //this actually adds the bar to the scene.
        scene.add.existing(this.bar);
        //calls the draw method we created below the constructor
        this.draw(x, y);

    }

    //Once your constructor is good, import it to your player.js

    //decrease method to decrease the amount. Draws new bar with new x and y for amount decreased.
    //Also checks if it's less than zero, then just set it to zero, else set it to normal decreased amount.
    modifyhp(amount) {
        if(amount <= 0) {
            this.value = 0;
        } else {
            this.value = amount;
        }
        this.draw(this.x, this.y);
    }

    //draw method to make the bars
    draw(x,y) {
    //clears any previous shape.
        this.bar.clear();
    //get width and height, and margin for the bars
        const { width, height } = this.size;
        const margin = 2;
        const offset = 15;
        const chamfer = 4;
    //dynamically calculates the total health width based on player health left and pixels per health.
        const healthWidth = (this.value * this.pixelPerHealth);

    //making the inner bar (background bar that stays static to reveal when the bar on top decreases).
        this.bar.fillStyle(0xFFFFFF);
    //Chamfer doesn't work properly yet.
        this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, width - margin, height - margin, chamfer);

    //if less than 25% health, show different color health bar, else show normal color.
        if(healthWidth <= this.size.width/4){
            this.bar.fillStyle(0xFF0000);
        } else {
            this.bar.fillStyle(0x00FF00);
        }
    
    //edge case if your health goes negative, sets and keeps health bar 'empty'.
        if(healthWidth > 0){
    //making the top bar that will actually move when the player is damaged. (top dynamic bar) 
    //width of the health bar is based on % health left (the dynamic variable healthWidth).
            this.bar.fillRoundedRect(x + offset + margin, y + offset + margin, healthWidth - margin, height - margin, chamfer);
        }

    };

};
