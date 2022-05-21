import DropItem from "./DropItem.js";
import items from "./Items.js";

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        //added in maxHealth property.
        let {name, scene, x, y, health, maxHealth, drops, tintable, texture, frame, depth} = data;
        super(scene.matter.world, x, y, texture, frame);
        this.x += this.width/2;
        this.y -= this.height/2;
        this.depth = depth || 1;
        this.name = name;
        this.health = health;
        //added in maxHealth property.
        this.maxHealth = maxHealth;
        this.drops = drops;
        this.tintable = tintable;
        this._position = new Phaser.Math.Vector2(this.x, this.y);

        if(this.name) this.sound = this.scene.sound.add(this.name, {volume: .3});
        this.scene.add.existing(this);
    };

    get position() {
        this._position.set(this.x, this.y);
        return this._position;
    }

    get velocity() {
        return this.body.velocity;
    }

    get dead() {
        return this.health <=0;
    }

    onDeath = () => {};

    hit = () => {
        if(this.sound) this.sound.play();
        this.health--;
        if (this.hp != null) {
            this.hp.modifyhp(this.health);
        }
        console.log(`Hitting: ${this.name} Health: ${this.health}`);

        if(this.dead){
            this.onDeath();
            this.drops.forEach(drop => {
                const name = Object.keys(items).find(item => items[item].frame == drop);
                return new DropItem({ scene: this.scene, x: this.x, y: this.y, frame: drop, name: name })
            });
        }
    };
}