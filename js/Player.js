import Inventory from "./Inventory.js";
import MatterEntity from "./MatterEntity.js";
import HealthBar from "./HealthBar.js";

export default class Player extends MatterEntity {
    constructor(data){
        let {scene, x , y, texture, frame} = data;
        //added maxHealth property.
        super({...data, health: 10, maxHealth: 10, drops:[], name:'player'});
        this.touching = [];
        this.inventory = new Inventory();
        //x and y position based on game configs and adjusted for zoom: EX: ((height - (height/zoom))/2. ((640 - (640/1.4))/2 = 91.43 becomes the new (0,0).
        //Adding in this.maxHealth property to HealthBar instance.
        this.hp = new HealthBar(this.scene, 100, 100, this.health, this.maxHealth);
        this.attack_frame = false;
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.rectangle(this.x, this.y, 22, 32, {chamfer: {radius: 10}, isSensor:false, label:'playerCollider'});
        let playerSensor = Bodies.rectangle(this.x, this.y, 46, 8, {isSensor:true, label: 'playerSensor'});
        const compoundBody = Body.create({
            parts:[playerCollider, playerSensor],
            frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.heroTouchingTrigger(playerSensor);
        this.createPickupCollisions(playerCollider);

    };

    static preload(scene){
        scene.load.atlas('hero', 'assets/images/hero.png', 'assets/images/hero_atlas.json');
        scene.load.animation('hero_anims', 'assets/images/hero_anims.json');
        scene.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        scene.load.audio('player', 'assets/audio/player.mp3');
    }

    onDeath = () => {
        this.anims.stop();
        this.setTexture('items', 0 );
        this.setOrigin(0.5);
    }

    update(){
        if(this.dead) return;

        let speed = 4;
        let playerVelocity = new Phaser.Math.Vector2();
        if(this.inputKeys.left.isDown) {
            this.flipX = true;
            playerVelocity.x = -1;
        } else if (this.inputKeys.right.isDown) {
            this.flipX = false;
            playerVelocity.x = 1;
        } else if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        } 
        //normalize makes diagonals same speed if needed, if I decide to allow diagonal movement. "playerVelocity.normalize();"

        playerVelocity.scale(speed);

        this.setVelocity(playerVelocity.x,playerVelocity.y);

        if(this.inputKeys.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
            this.anims.play('hero_attack', true);
            this.whackStuff();
           } else if (playerVelocity.x !== 0 || playerVelocity.y !== 0) {
                this.anims.play('hero_run', true);
           } else {
               this.anims.play('hero_idle', true);
           }

        if(this.inputKeys.space.isDown === false) {
            this.attack_frame = false
        }
    };

        heroTouchingTrigger(playerSensor){

        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return;
                this.touching.push(other.gameObjectB);
                    console.log(this.touching.length, other.gameObjectB.name);
                },
            context: this.scene, 
        });

        this.scene.matterCollision.addOnCollideEnd({
            objectA:[playerSensor],
            callback: other => {  
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                    console.log(this.touching.length);
                },
            context: this.scene,
        });

    };

        createPickupCollisions(playerCollider){

        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerCollider],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.pickup) 
                    if(other.gameObjectB.pickup()) this.inventory.addItem({name:other.gameObjectB.name, quantity: 1});
                },
            context: this.scene, 
        });

        this.scene.matterCollision.addOnCollideActive({
            objectA:[playerCollider],
            callback: other => {  
                if(other.gameObjectB && other.gameObjectB.pickup) 
                    if(other.gameObjectB.pickup()) this.inventory.addItem({name:other.gameObjectB.name, quantity: 1});
                },
            context: this.scene,
        });

    };

        setBackToNormalColor(gameObject){
            gameObject.setTint(0xffffff);
        };

         whackStuff(){
            this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
            this.touching.forEach(gameObject =>{
                if (this.anims.currentFrame.textureFrame === 'hero_attack_5'  && this.attack_frame === false) {
                    this.attack_frame = true
                    gameObject.hit()
                    if(gameObject.tintable === true){
                        gameObject.setTint(0xff0000);
                        setTimeout(()=> this.setBackToNormalColor(gameObject), 200);
                    }
            } else if (this.anims.currentFrame.textureFrame === 'hero_attack_6') {
                this.attack_frame = false
            }         
                if(gameObject.dead) gameObject.destroy();
        });
        //console.log(this.anims) to see what's going on with all things related to our animation state.
        /*The only problem now: When the player goes to attack a resource after attacking one previously, the first hit doesn't register.*/   
      }; 

};

