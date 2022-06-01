import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {

    static preload(scene){
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        scene.load.audio('bear', 'assets/audio/bear.mp3');
        scene.load.audio('wolf', 'assets/audio/wolf.mp3');
        scene.load.audio('ent', 'assets/audio/ent.mp3');
    };

    constructor(data){

        let {scene, enemy} = data;
        let drops = JSON.parse(enemy.properties.find(p => p.name== 'drops').value);
        let health = enemy.properties.find(p => p.name== 'health').value;
        let maxHealth = enemy.properties.find(p => p.name== 'maxHealth').value;
        let tintable = enemy.properties.find(p => p.name== 'tintable').value;
        let givesXP = enemy.properties.find(p => p.name== 'givesXP').value;
        let XP = enemy.properties.find(p => p.name== 'XP').value;
        super({scene, x:enemy.x, y:enemy.y, texture:'enemies', frame:`${enemy.name}_idle_1`, drops, health, maxHealth, tintable, givesXP, XP, name:enemy.name});

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        let enemyCollider = Bodies.circle(this.x,this.y,12,{isSensor:false,label:'enemyCollider'});
        let enemySensor = Bodies.circle(this.x,this.y,80, {isSensor:true, label:'enemySensor'});
        const compoundBody = Body.create({
            parts:[enemyCollider,enemySensor],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.setScale(0.75);

        this.scene.matterCollision.addOnCollideStart({
            objectA:[enemySensor],
            callback: other => {if(other.gameObjectB && other.gameObjectB.name == 'player') this.attacking = other.gameObjectB;},
            context:this.scene,
        });
    };   

    attack = (target) => {
        if(target.dead || this.dead) {
            clearInterval(this.attackTimer);
            return;
        }
        target.hit();
        target.setTint(0xff0000);
        target.changeFreezeFlag();
        setTimeout(()=> target.clearTint(), 350);
        setTimeout(()=> target.changeFreezeFlag(), 350);
    };

    update(){
        if(this.dead) return;

        if(this.attacking){
            let direction = this.attacking.position.subtract(this.position);
            if(direction.length()>24){
                let v = direction.normalize();
                this.setVelocityX(direction.x);
                this.setVelocityY(direction.y);

                if(this.attackTimer) {
                    clearInterval(this.attackTimer);
                    this.attackTimer = null;
                }

            } else {
                if(this.attackTimer == null) {
                    this.attackTimer = setInterval(this.attack, 1000, this.attacking);
                }
            }
        };

        this.setFlipX(this.velocity.x < 0);
            if(this.velocity.x !== 0 || this.velocity.y !== 0) {
                this.anims.play(`${this.name}_walk`, true);
           } else {
               this.anims.play(`${this.name}_idle`, true);
           }

    };
};