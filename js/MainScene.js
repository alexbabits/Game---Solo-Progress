import Crafting from "./Crafting.js";
import Enemy from "./Enemy.js";
import Player from "./Player.js";
import Resource from "./Resource.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.enemies = [];
        //this.randomLightningQuantity = Phaser.Math.Between(1,3);
        //this.randomLightningFrequency = Phaser.Math.Between(500,3000);
    };

    preload() {
        Player.preload(this);
        Enemy.preload(this);
        Resource.preload(this);

        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map','assets/images/map.json');
        this.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        this.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        this.load.image('rain', 'assets/images/rain.png');
        this.load.image('cursor', 'assets/images/cursor.png');
        //loaded in lightning as an atlas since it has multiple frames to choose from.
        this.load.atlas('lightning', 'assets/images/lightning.png', 'assets/images/lightning_atlas.json');
        this.load.audio('lightning', 'assets/audio/lightning.mp3');
        this.load.audio('rain', 'assets/audio/rain.mp3');
        this.load.image('Healthbarframe', 'assets/images/Healthbarframe.png');


                
    };

    create(){
        this.input.setDefaultCursor('url(assets/images/cursor.png), pointer')

        const map = this.make.tilemap({key: 'map'});
        this.map = map;
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 2);
        const background = map.createStaticLayer('background', tileset, 0, 2);
        background.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(background);
    
        this.map.getObjectLayer('Resources').objects.forEach(resource =>  new Resource({scene:this, resource}));
        this.map.getObjectLayer('Enemies').objects.forEach(enemy =>  this.enemies.push(new Enemy({scene:this, enemy})));

        const Healthbarframelogo = this.add.image(110, 102, 'Healthbarframe').setOrigin(0); 
        Healthbarframelogo.depth = 9;
        Healthbarframelogo.setScale(.3);
        Healthbarframelogo.setScrollFactor(0);

/*
        function generateBoomStick() {
            Phaser.Math.Between(1,3);
        }

        function generateBoomStickFrequency() {
            Phaser.Math.Between(1000,10000);
        }
*/

        this.rainSound = this.sound.add('rain', {volume: 0.2})
        this.lightningSound = this.sound.add('lightning', {volume: 0.2})

        this.rainParticles = this.add.particles('rain');
        this.rainEmitter = this.rainParticles.createEmitter({
            x: { min:0, max: 800},
            y: 0,
            lifespan: 5000,
            speedY: {min: 150, max: 200},
            speedX: {min: -50, max: -30},
            scale: 0.14,
            quantity: 5,
            maxParticles: 0,
            frequency: 0, 
            blendMode: 0,
            on: true
        });         

        //added rainsound, plays 24/7 for now.
        this.rainSound.play()

        this.lightningParticles = this.add.particles('lightning');
        this.lightningEmitter = this.lightningParticles.createEmitter({
            //added in frames since 'lightning' png is an atlas with multiple frames.
            frame: [ 'lightning1', 'lightning2'],
            x: { min:250, max: 350},
            y: { min:0, max: this.game.config.width/4},
            lifespan: 100,
            scale: 1.5,
            alpha: {start: 1, end: 0},
            quantity: Math.floor(Math.random() * 10) + 1,
            frequency: Phaser.Math.Between(1000,10000), //or you could do Math.Max((6000,(Math.random()*30000)))
            blendMode: 0,
            on: true
        });

        function lightningSound() {
            this.lightningSound.play()
          }

        this.lightningEmitter.onParticleEmit(lightningSound, this);
        
        this.player = new Player({scene:this, x:Phaser.Math.Between(150,400), y:Phaser.Math.Between(150, 350), texture:'hero', frame:'hero_idle_1'});
        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0,2,this.game.config.width,this.game.config.height);

        this.scene.launch('InventoryScene', {mainScene:this});
        this.crafting = new Crafting({ mainScene:this});

        this.input.keyboard.on('keydown-C', () => {
            if(this.scene.isActive("CraftingScene")){
                this.scene.stop('CraftingScene')
            } else {
                this.scene.launch('CraftingScene', {mainScene:this});
            }
        });

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
        });

        /*

        'this.emitter.start()' turns it's 'on' property to true. Rain will be emitted.
        'this.emitter.stop()' turns it's 'on' property to false. Rain will not be emitted.

        So we could say something like:

        if(rainStartFlag is triggered){
            this.emitter.start()
        }
        
        if(this.emitter.on === true){
            this.rainSound.play()
        }

        if(rainStopFlag is triggered){
            this.emitter.stop()
        }

        if(this.emitter.on === false){
            this.rainSound.stop()
        }

        We could also default lightning emitter to 'on: false' and then switch it true whenever rain is on, so lightning also starts striking when rainfall begins.

        Adding rain and lightning together and condensing could look like this (btw: emitter refers to rain, lightningEmitter refers to lightning):
        (We don't need to play lightningSound or stop lightningSound here, because it only plays when a lightning particle is emitted anyway.
         It's sound is taken care of via the 'onParticleEmit' method)

        if(stormStartFlag === true){
            this.emitter.start()
            this.lightningEmitter.start()
            this.rainSound.play()
        } else return

        if(stormStopFlag === true){
            this.emitter.stop()
            this.lightningEmitter.stop()
            this.rainSound.stop()
        } else return

        (where the flags will oppose eachother, being true/false or false/true)

        default stormStartFlag to false, and stormStopFlag to true in the constructor.

        if(stormStartTimer === 12345){
            stormStartFlag = true
        } else {
            stormStartFlag = false
        }

        if(stormStopTimer === 12345){
            stormStopFlag = true
        } else {
            stormStopFlag = false
        }

        Say, if every 1 second we have a function that spits out a number from 1 to 100
        and we have our flag change if that number is 69. Then on average, every 100 seconds our flag will be triggered.
        Or, start the timer, and anytime it gets above a minimum value, but below a maximum value, randomly from those min to max, trigger the storm flag.

        */


        /* Attempt to make a storm handler

                //This function starts a storm. Both emitters have to be 'on: false' initially.
                function stormStart(){
                    this.emitter.start()
                    this.lightningEmitter.start()
                    this.rainSound.play()
                    setTimeout( () => this.stormStop(), Phaser.Math.Between(10000,60000) );
            }
        
                //This function stops a storm. Both emitters have to be 'on: true'. 
                function stormStop(){
                    this.emitter.stop()
                    this.lightningEmitter.stop()
                    this.rainSound.stop()
                    setTimeout( () => this.stormStart(), Phaser.Math.Between(10000,60000) );
            }
            */

    };

    update(){
        this.enemies.forEach(enemy => enemy.update());
        this.player.update();
    };

};