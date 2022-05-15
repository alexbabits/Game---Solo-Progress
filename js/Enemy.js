import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {

    static preload(scene){
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        scene.load.audio('bear', 'assets/audio/bear.mp3');
        scene.load.audio('wolf', 'assets/audio/wolf.mp3');
        scene.load.audio('ent', 'assets/audio/ent.mp3');
    }


    constructor(data){
        let {scene, enemy} = data;
        let drops = JSON.parse(enemy.properties.find(p => p.name== 'drops').value);
        let health = enemy.properties.find(p => p.name== 'health').value;
        super({scene, x:enemy.x, y:enemy.y, texture:'enemies', frame:`${enemy.name}_idle_1`, drops, health, name:enemy.name});
        //create colliders/sensors for enemy. Very similar to player.
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
        //when the player is close, go and attack it.
        this.scene.matterCollision.addOnCollideStart({
        //enemy sensor as the first object,
        objectA:[enemySensor],
        //specify the callback with an other arrow function. If other.gameObjectB is not null (it exists) and it's the player,
        //then do the attacking to gameObjectB which is the player.
        callback: other => {if(other.gameObjectB && other.gameObjectB.name == 'player') this.attacking = other.gameObjectB;},
        //Need to pass in the context of this scene.
        context:this.scene,
        });
    }   

    //the 'target' is 'this.attacking', which refers to gameObjectB, which is the player.
    attack = (target) => {
    //if either the player or enemy is dead,
        if(target.dead || this.dead) {
    //clear the attack timer and do nothing.
            clearInterval(this.attackTimer);
            return;
        }
    //otherwise, hit our player with the 'hit' method in MatterEntity.js
        target.hit();
    }

    update(){
        //check if dead, if true, do nothing.
        if(this.dead) return;
        //check if attacking, if true,
        if(this.attacking){
        //get players position which is this.attacking.position
        //go towards the player, by subtracting vectors.
            let direction = this.attacking.position.subtract(this.position);
        //if we are running towards player, but not close enough to hit, then continue to run towards player.
        //if we are close enough to the player, start attacking at a regular interval.
        //hard coded attack distance of 24. If it's greater than that, then run towards the player.
            if(direction.length()>24){
        //this gets a unit vector out of our direction for the shortest path.
                let v = direction.normalize();
        //so we can set the velocity on that path.
                this.setVelocityX(direction.x);
                this.setVelocityY(direction.y);
        //if the player runs away, and not in range anymore, and so we can't attack him, so clear that attack timer here.
        //basically makes it so the enemy stops attacking when out of range.
                if(this.attackTimer) {
                    clearInterval(this.attackTimer);
                    this.attackTimer = null;
                }
        //or if we are close enough, then attack.
            } else {
        //we'll have an attack timer, if it's null, set interval for the 'attack' method every 500 ms, 
        //and send it in 'this.attacking' parameter.
                if(this.attackTimer == null) {
                    this.attackTimer = setInterval(this.attack, 1000, this.attacking);
                }
            }
        }
        //under the if(this.attacking) statement block, fix flipping.
        this.setFlipX(this.velocity.x < 0);
        if(this.velocity.x !== 0 || this.velocity.y !== 0) {
                this.anims.play(`${this.name}_walk`, true);
           } else {
               this.anims.play(`${this.name}_idle`, true);
           }
    }
}