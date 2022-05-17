export default class PlayerHealthBar extends Phaser.Scene {
        //attempts to refer to the player's health.
    constructor(scene, x, y, health) {
        super("PlayerHealthBar");
        //creating the healthbar phaser game object
        this.bar = new Phaser.GameObjects.Graphics(scene);
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

    //draw rectangle
    draw(x,y) {
    //clears any previous shape.
        this.bar.clear();
    //get width and height.
        const { width, height } = this.size;
    //color, shape, position, fill, size
        this.bar.fillStyle(0x9B00FF);
        this.bar.fillRect(x, y, width, height);

    }

}

