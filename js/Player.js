import Inventory from "./Inventory.js";
import MatterEntity from "./MatterEntity.js";
import HealthBar from "./HealthBar.js";
import StaminaBar from "./StaminaBar.js";

export default class Player extends MatterEntity {
    constructor(data){
        let {scene, x , y, texture, frame} = data;
        super({...data, health: 10, maxHealth: 10, stamina: 100, maxStamina: 100, drops:[], name:'player'});
        this.touching = [];
        this.inventory = new Inventory();
        //x and y position based on game configs and adjusted for zoom: EX: ((height - (height/zoom))/2. ((640 - (640/1.4))/2 = 91.43 becomes the new (0,0).
        this.hp = new HealthBar(this.scene, 100, 100, this.health, this.maxHealth);
        //atempt to add in the stamina bar.
        this.energy = new StaminaBar(this.scene, 218, 100, this.stamina, this.maxStamina);

        this.attackFlag = false;
        this.walkingSwitch = false;

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

    runningStaminaDecrement = () => {
        this.stamina--;
        this.energy.modifyStamina(this.stamina);
        console.log(`You should be running. Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    };

    idleStaminaIncrement = () => {
        this.stamina += 2;
        this.energy.modifyStamina(this.stamina);
        console.log(`You should be Idling. Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    }

    walkingStaminaIncrement = () => {
        this.stamina++;
        this.energy.modifyStamina(this.stamina);
        console.log(`You should be Walking. Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    }

    hittingStaminaDecrement = () => {
        this.stamina -= 10;
        this.energy.modifyStamina(this.stamina);
        console.log(`You should be doing hit(). Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    }


    update(){
        if(this.dead) return;

        const runningSpeed = 4;
        const walkingSpeed = 2;
        let playerVelocity = new Phaser.Math.Vector2();
        

        if(Phaser.Input.Keyboard.JustDown(this.inputKeys.shift)){
            this.walkingSwitch = !this.walkingSwitch
        }

        //running controls
        if(this.walkingSwitch === false) {
            if(this.inputKeys.left.isDown) {
                this.flipX = true;
                playerVelocity.x = -runningSpeed;
            } else if (this.inputKeys.right.isDown) {
                this.flipX = false;
                playerVelocity.x = runningSpeed;
            } else if (this.inputKeys.up.isDown) {
                playerVelocity.y = -runningSpeed;
            } else if (this.inputKeys.down.isDown) {
                playerVelocity.y = runningSpeed;
            } 
        }

        //walking controls
        if(this.walkingSwitch === true){
            if(this.inputKeys.left.isDown) {
                this.flipX = true;
                playerVelocity.x = -walkingSpeed;
            } else if (this.inputKeys.right.isDown) {
                this.flipX = false;
                playerVelocity.x = walkingSpeed;
            } else if (this.inputKeys.up.isDown) {
                playerVelocity.y = -walkingSpeed;
            } else if (this.inputKeys.down.isDown) {
                playerVelocity.y = walkingSpeed;
            }
        }
    

        this.setVelocity(playerVelocity.x, playerVelocity.y);
        //"playerVelocity.normalize();" normalize makes diagonals same speed if I decide to allow diagonal movement. 

        if(this.inputKeys.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
            this.anims.play('hero_attack', true);
            this.whackStuff();
            if(this.HSDT == null){
                this.HSDT = setInterval(this.hittingStaminaDecrement, 600);
            };
            if(this.RSDT){
                clearInterval(this.RSDT);
                this.RSDT = null;
            };
            if(this.ISIT){
                clearInterval(this.ISIT);
                this.ISIT = null;
            };
            if(this.WSIT){
                clearInterval(this.WSIT);
                this.WSIT = null;
            };
           } else if (Math.abs(playerVelocity.x) === runningSpeed || Math.abs(playerVelocity.y) === runningSpeed) {
                this.anims.play('hero_run', true)
                if(this.RSDT == null){
                    this.RSDT = setInterval(this.runningStaminaDecrement, 200);
                };
                if(this.ISIT){
                    clearInterval(this.ISIT);
                    this.ISIT = null;
                };
                if(this.WSIT){
                    clearInterval(this.WSIT);
                    this.WSIT = null;
                };
                if(this.HSDT){
                    clearInterval(this.HSDT);
                    this.HSDT = null;
                };
           } else if (Math.abs(playerVelocity.x) === walkingSpeed || Math.abs(playerVelocity.y) === walkingSpeed) {
                this.anims.play('hero_walk', true);
                if(this.WSIT == null){
                    this.WSIT = setInterval(this.walkingStaminaIncrement, 2000);
                };
                if(this.RSDT){
                    clearInterval(this.RSDT);
                    this.RSDT = null;
                };
                if(this.ISIT){
                    clearInterval(this.ISIT);
                    this.ISIT = null;
                };
                if(this.HSDT){
                    clearInterval(this.HSDT);
                    this.HSDT = null;
                };
           } else {
            this.anims.play('hero_idle', true);
            if(this.RSDT){
                clearInterval(this.RSDT);
                this.RSDT = null;
            };
            if(this.ISIT == null){
                this.ISIT = setInterval(this.idleStaminaIncrement, 1000);
            }; 
            if(this.WSIT){
                clearInterval(this.WSIT);
                this.WSIT = null;
            };
            if(this.HSDT){
                clearInterval(this.HSDT);
                this.HSDT = null;
            };

        }
        
        
        if(this.inputKeys.space.isDown === false) {
            this.attackFlag = false
        }

        //fix not quite right, sits at -1 because it overlaps one time on the decrement.
        if(this.stamina <= 0){
            this.stamina = 0
        }

        //fix not quite right, sits at 101 because it overlaps one time on the increment.
        if(this.stamina >= this.maxStamina) {
            this.stamina = this.maxStamina
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

         whackStuff(){
            this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
            this.touching.forEach(gameObject =>{
                if (this.anims.currentFrame.textureFrame === 'hero_attack_5'  && this.attackFlag === false) {
                    this.attackFlag = true
                    gameObject.hit()
                    if(gameObject.tintable === true){
                        gameObject.setTint(0xff0000);
                        setTimeout(()=> gameObject.clearTint(), 200);
                    }
            } else if (this.anims.currentFrame.textureFrame === 'hero_attack_6') {
                this.attackFlag = false
            }         
                if(gameObject.dead) gameObject.destroy();
        });
        //console.log(this.anims) to see what's going on with all things related to our animation state.
        /*The only problem now: When the player goes to attack a resource after attacking one previously, the first hit doesn't register.*/   
      }; 

};
