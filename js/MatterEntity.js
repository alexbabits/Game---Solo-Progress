import DropItem from "./DropItem.js";
import items from "./Items.js";

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {name, scene, x, y, health, maxHealth, stamina, maxStamina, mana, maxMana, experience, maxExperience, level, drops, tintable, givesXP, XP, texture, frame, depth} = data;
        super(scene.matter.world, x, y, texture, frame);
        this.x += this.width/2;
        this.y -= this.height/2;
        this.depth = depth || 1;
        this.name = name;
        this.health = health;
        this.maxHealth = maxHealth;
        this.stamina = stamina;
        this.maxStamina = maxStamina;
        this.mana = mana;
        this.maxMana = maxMana;
        this.experience = experience;
        this.maxExperience = maxExperience;
        this.drops = drops;
        this.tintable = tintable;
        this.givesXP = givesXP;
        this.XP = XP;
        this.level = level;
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

    specialHit = () => {
        if(this.sound) this.sound.play();
        this.health -= 2;
        if (this.hp != null) {
            this.hp.modifyhp(this.health);
        }
        console.log(`Special Attack on: ${this.name} Health: ${this.health}`);

        if(this.dead){
            //If I find a way to create enemies inside the onDeath method in Enemy.js, then I'm all set.
            this.onDeath();
            this.drops.forEach(drop => {
                const name = Object.keys(items).find(item => items[item].frame == drop);
                return new DropItem({ scene: this.scene, x: this.x, y: this.y, frame: drop, name: name })
            });
        }
    };

    changeFreezeFlag = () => {
        this.freezeFlag = !this.freezeFlag;
    }

};

