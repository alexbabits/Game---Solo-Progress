import Inventory from "./Inventory.js";
import MatterEntity from "./MatterEntity.js";
import HealthBar from "./HealthBar.js";
import StaminaBar from "./StaminaBar.js";
import ManaBar from "./ManaBar.js";
import ExperienceBar from "./ExperienceBar.js"

export default class Player extends MatterEntity {
    constructor(data){
        let {scene, x , y, texture, frame} = data;
        super({...data, health: 2, maxHealth: 20, stamina: 100, maxStamina: 100, mana: 10, maxMana: 10, experience: 0, maxExperience: 10, level: 1, drops:[], name:'player'});
        this.touching = [];
        this.inventory = new Inventory();
        //x and y position based on game configs and adjusted for zoom: EX: ((height - (height/zoom))/2. ((640 - (640/1.4))/2 = 91.43 becomes the new (0,0).
        this.hp = new HealthBar(this.scene, 112, 110, this.health, this.maxHealth);
        this.energy = new StaminaBar(this.scene, 112, 138, this.stamina, this.maxStamina);
        this.magic = new ManaBar(this.scene, 112, 124, this.mana, this.maxMana);
        this.xp = new ExperienceBar(this.scene, 210, 110, this.experience, this.maxExperience);
        //adding text:
        this.text = new Phaser.GameObjects.Text(scene, 430, 110, ``, { fontFamily: 'Courier', fontSize: '11px', fill: '#FFFFF0', resolution: 2});
        this.text.depth = 20;
        this.text.setScrollFactor(0,0);
        scene.add.existing(this.text);

        this.attackFlag = false;
        this.critFlag = false;
        this.walkingSwitch = false;
        this.freezeFlag = false;
        this.healthPotionUsable = true;

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        this.playerCollider = Bodies.rectangle(this.x, this.y, 22, 32, {chamfer: {radius: 10}, isSensor:false, label:'playerCollider'});
        this.playerSensor = {
            right: Bodies.rectangle(this.x + 15, this.y, 20, 8, {isSensor: true}, {label:'right'}),
            left: Bodies.rectangle(this.x - 15, this.y, 20, 8, {isSensor: true}, {label:'left'})
        };
        this.compoundBody = Body.create({
            parts:[this.playerCollider, this.playerSensor.right, this.playerSensor.left],
            frictionAir: .4,
        });

        this.setExistingBody(this.compoundBody);
        this.setFixedRotation();
        this.heroTouchingTriggerRight(this.playerSensor.right);
        this.heroTouchingTriggerLeft(this.playerSensor.left);
        this.createPickupCollisions(this.playerCollider);

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

    healthPotionSwitch = () => {
        this.healthPotionUsable = !this.healthPotionUsable;
    }
  
    useHealthPotion(){
        let currentItem = this.inventory.items[this.inventory.selected];
        if(currentItem == null) return;
        if(currentItem.name === 'health_potion' && this.health < this.maxHealth){
            this.inventory.removeItem('health_potion');
            this.health += 5;
            if(this.health >= this.maxHealth) this.health = this.maxHealth;
            this.hp.modifyhp(this.health);  
            console.log(`current player health after potion use: ${this.health}`);
            //play sound
        }
    }
   
    runningStaminaDecrement = () => {
        this.stamina--;
        this.energy.modifyStamina(this.stamina);
        //console.log(`You should be running. Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    };

    idleStaminaIncrement = () => {
        this.stamina += 2;
        if(this.stamina >= this.maxStamina) {
            this.stamina = this.maxStamina 
        }
        this.energy.modifyStamina(this.stamina);
        //console.log(`You should be Idling. Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    }

    manaIncrement = () => {
        this.mana++;
        if(this.mana >= this.maxMana) {
            this.mana = this.maxMana 
        }
        this.magic.modifyMana(this.mana);
        //console.log(`You should be regaining mana: ${this.mana} maxMana: ${this.maxMana}`); 
    }

    walkingStaminaIncrement = () => {
        this.stamina++;
        if(this.stamina >= this.maxStamina) {
            this.stamina = this.maxStamina 
        }
        this.energy.modifyStamina(this.stamina);
        //console.log(`You should be Walking. Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    }

    hittingStaminaDecrement = () => {
        this.stamina -= 10;
        this.energy.modifyStamina(this.stamina);
        //console.log(`You should be doing hit(). Current Stamina: ${this.stamina} maxStamina: ${this.maxStamina}`); 
    }

    specialAttackDecrement = () => {
        this.stamina -= 20;
        this.mana -= 2;
        this.energy.modifyStamina(this.stamina);
        this.magic.modifyMana(this.mana);
        //console.log(`You should be doing special attack. Current Stamina: ${this.stamina}, maxStamina: ${this.maxStamina}, Current Mana: ${this.mana}, maxMana: ${this.maxMana},`); 
    }

    
    levelUP = () => {
        if(this.experience >= this.maxExperience) {
            this.experience = 0
            this.maxExperience *= 1.5;           
            this.level++
            this.xp.modifyXp(this.experience, this.maxExperience);
            //play level up sound
            console.log(`level: ${this.level}, Current Experience: ${this.experience}, maxExperience: ${this.maxExperience}`);
        }
    }

    update(){
        if(this.dead) return;

        this.text.setText(`PLAYER LEVEL:${this.level}`);

        this.levelUP();

        const runningSpeed = 4;
        const walkingSpeed = 2;
        let playerVelocity = new Phaser.Math.Vector2();
        
        
        if(Phaser.Input.Keyboard.JustDown(this.inputKeys.ctrl)){
            this.walkingSwitch = !this.walkingSwitch
        }

        //running controls
        if(this.walkingSwitch === false) {
            if (this.freezeFlag === true){
                playerVelocity.x = 0;
                playerVelocity.y = 0;
            } else if(this.inputKeys.left.isDown) {
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
            if (this.freezeFlag === true){
                playerVelocity.x = 0;
                playerVelocity.y = 0;
            } else if(this.inputKeys.left.isDown) {
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


             if (Math.abs(playerVelocity.x) === runningSpeed || Math.abs(playerVelocity.y) === runningSpeed) {
                this.anims.play('hero_run', true);

                if(this.stamina <= 0) this.walkingSwitch = true;

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

           } else if (Math.abs(playerVelocity.x) === walkingSpeed || Math.abs(playerVelocity.y) === walkingSpeed) {
                this.anims.play('hero_walk', true);

                if(this.WSIT == null){
                    this.WSIT = setInterval(this.walkingStaminaIncrement, 500);
                };
                if(this.RSDT){
                    clearInterval(this.RSDT);
                    this.RSDT = null;
                };
                if(this.ISIT){
                    clearInterval(this.ISIT);
                    this.ISIT = null;
                };
            //Had to have it below movement and above attacking, so the anim stops when he moves. Still allows him to move while hit, but stops animation when he moves. Good for now.
           } else if(this.sound.isPlaying === true){
                this.anims.play('hero_damage', true);
            //had to add the special attack here, above the normal attack, and below the 'damage' and movement.
           }  else if(this.inputKeys.space.isDown && this.inputKeys.shift.isDown && playerVelocity.x === 0 && playerVelocity.y === 0 && this.stamina >= 20 && this.mana >= 2) {
                this.anims.play('hero_crit', true);
                this.specialAttack();
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
                if(this.MIT){
                    clearInterval(this.MIT);
                    this.MIT = null;
                };
            } else if(this.inputKeys.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0 && this.stamina >= 10) {
                this.anims.play('hero_attack', true);
                this.whackStuff();
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
                if(this.MIT){
                    clearInterval(this.MIT);
                    this.MIT = null;
                };
           } else {
            this.anims.play('hero_idle', true);

            if(this.RSDT){
                clearInterval(this.RSDT);
                this.RSDT = null;
            };
            if(this.ISIT == null){
                this.ISIT = setInterval(this.idleStaminaIncrement, 200);
            }; 
            if(this.MIT == null){
                this.MIT = setInterval(this.manaIncrement, 2000);
            }; 
            if(this.WSIT){
                clearInterval(this.WSIT);
                this.WSIT = null;
            };

        }

        if(this.inputKeys.space.isDown === false) {
            this.attackFlag = false
        }

    };

    heroTouchingTriggerRight(playerSensor){
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return;
                    this.touching.push(other.gameObjectB)
                    console.log(this.touching.length, other.gameObjectB.name);
                },
            context: this.scene, 
        });

        this.scene.matterCollision.addOnCollideActive({
            objectA:[playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return;
                if(this.flipX === false && this.touching.includes(other.gameObjectB) === false){
                    this.touching.push(other.gameObjectB)
                }
                if(this.flipX === true && this.touching.includes(other.gameObjectB) === true){
                    this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                }
                //console.log(this.touching.length);         
                },
            context: this.scene,
        });

        this.scene.matterCollision.addOnCollideEnd({
            objectA:[playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return;
                        this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                        console.log(this.touching.length);
                },
            context: this.scene,
        });
    }


    heroTouchingTriggerLeft(playerSensor){
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return;
                    this.touching.push(other.gameObjectB);
                    console.log(this.touching.length, other.gameObjectB.name);
                },
            context: this.scene, 
        });

        this.scene.matterCollision.addOnCollideActive({
            objectA:[playerSensor],
            callback: other => {
                if(other.bodyB.isSensor) return;
                if(this.flipX === true && this.touching.includes(other.gameObjectB) === false){
                    this.touching.push(other.gameObjectB)
                }
                if(this.flipX === false && this.touching.includes(other.gameObjectB) === true){
                    this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
                }
                //console.log(this.touching.length);         
                },
            context: this.scene,
        });

        this.scene.matterCollision.addOnCollideEnd({
            objectA:[playerSensor],
            callback: other => {  
                if(other.bodyB.isSensor) return;
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
            if(this.anims.currentFrame.textureFrame === 'hero_attack_5'  && this.attackFlag === false && this.touching.length === 0) {
                this.attackFlag = true;
                this.hittingStaminaDecrement();
            } else if (this.anims.currentFrame.textureFrame !== 'hero_attack_5') {
                this.attackFlag = false
            }

            this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
            this.touching.forEach(gameObject =>{
                if (this.anims.currentFrame.textureFrame === 'hero_attack_5'  && this.attackFlag === false) {
                    this.attackFlag = true;
                    gameObject.hit();
                    this.hittingStaminaDecrement();
                    if(gameObject.tintable === true){
                        gameObject.setTint(0xff0000);
                        setTimeout(()=> gameObject.clearTint(), 200);
                    };
            } else if (this.anims.currentFrame.textureFrame !== 'hero_attack_5') {
                this.attackFlag = false
            };        
                if(gameObject.dead) {
                    gameObject.destroy();
                    if(gameObject.givesXP === true){
                        this.experience += gameObject.XP
                        this.xp.modifyXp(this.experience, this.maxExperience);
                        console.log(`You should have gained some experience! Current experience: ${this.experience}, maxExperience: ${this.maxExperience}`); 
                    }   
                }
        });
        //console.log(this.anims)
      };
      
      specialAttack(){
        if(this.anims.currentFrame.textureFrame === 'hero_crit_4'  && this.critFlag === false && this.touching.length === 0) {
            this.critFlag = true;
            this.specialAttackDecrement();
        } else if (this.anims.currentFrame.textureFrame !== 'hero_crit_4') {
            this.critFlag = false
        }

            this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
            this.touching.forEach(gameObject =>{
                if (this.anims.currentFrame.textureFrame === 'hero_crit_4'  && this.critFlag === false) {
                    this.critFlag = true;
                    gameObject.specialHit();
                    this.specialAttackDecrement();
                    if(gameObject.tintable === true){
                        gameObject.setTint(0xff0000);
                        setTimeout(()=> gameObject.clearTint(), 200);
                    };
            } else if (this.anims.currentFrame.textureFrame !== 'hero_crit_4') {
                this.critFlag = false
            };        
                if(gameObject.dead) {
                    gameObject.destroy();
                    if(gameObject.givesXP === true){
                        this.experience += gameObject.XP
                        this.xp.modifyXp(this.experience, this.maxExperience);
                        console.log(`You should have gained some experience! Current experience: ${this.experience}, maxExperience: ${this.maxExperience}`); 
                    }   
                }
        });
    }

};
