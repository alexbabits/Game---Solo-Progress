import Crafting from "./Crafting.js";
import Enemy from "./Enemy.js";
import Player from "./Player.js";
import Resource from "./Resource.js";
import Menu from "./Menu.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.enemies = [];
    };

    preload() {
        Player.preload(this);
        Enemy.preload(this);
        Resource.preload(this);
        Menu.preload(this);

        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map','assets/images/map.json');
        this.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        this.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        this.load.image('rain', 'assets/images/rain.png');
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.atlas('lightning', 'assets/images/lightning.png', 'assets/images/lightning_atlas.json');
        this.load.audio('lightning', 'assets/audio/lightning.mp3');
        this.load.audio('rain', 'assets/audio/rain.mp3');
        this.load.image('barFrame', 'assets/images/barFrame.png');
        this.load.image('expBarFrame', 'assets/images/expBarFrame.png');    
    };

    create(){
        this.player = new Player({scene:this, x:Phaser.Math.Between(300,400), y:Phaser.Math.Between(150, 350), texture:'hero', frame:'hero_idle_1'});

        this.input.keyboard.on('keydown-ESC', () => {
            if(this.scene.isActive("Menu")){
                this.scene.stop('Menu')
            } else {
                this.scene.launch('Menu', {mainScene:this});
                this.scene.pause("MainScene");
            }
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            if(this.scene.isActive("Menu")){
                this.scene.stop('Menu')
            } else {
                this.scene.launch('Menu', {mainScene:this});
                this.scene.pause("MainScene");
            }
        });
        
        this.scene.launch('InventoryScene', {mainScene:this});

        this.crafting = new Crafting({ mainScene:this});

        this.input.keyboard.on('keydown-C', () => {
            if(this.scene.isActive("CraftingScene")){
                this.scene.stop('CraftingScene')
            } else {
                this.scene.launch('CraftingScene', {mainScene:this});
            }
        });

        this.input.setDefaultCursor('url(assets/images/cursor.png), pointer')

        const map = this.make.tilemap({key: 'map'});
        this.map = map;
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 2);
        const background = map.createStaticLayer('background', tileset, 0, 2);
        background.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(background);
    
        this.map.getObjectLayer('Resources').objects.forEach(resource =>  new Resource({scene:this, resource}));

        this.map.getObjectLayer('Enemies').objects.forEach(enemy =>  this.enemies.push(new Enemy({scene:this, enemy})));
    
        const respawnAllEnemies = () => {
        //If I can say that the enemy died here, then I'm all set.
        //Tried this.enemy.dead, enemy.dead, this.dead, this.scene.enemy.dead none worked.  
            if("enemy is dead"){
                 this.map.getObjectLayer('Enemies').objects.forEach(enemy =>  this.enemies.push(new Enemy({scene:this, enemy})));
             }
         }      
         setTimeout(respawnAllEnemies, 1000); 

         //If you can get this to change from false to true inside create, that's good. Then work on it with all elements in enemies array, then specific enemy in enemies array.
         console.log(`is the player dead? ${this.player.dead}`);


         /* //or something like this
                 const respawnAllEnemies = () => {
                 this.map.getObjectLayer('Enemies').objects.forEach(enemy => {
                    if(enemy.dead){
                        this.enemies.push(new Enemy({scene:this, enemy}))
                    }
                });
        }   
        */

        const barFrame = this.add.image(100, 100, 'barFrame').setOrigin(0); 
        barFrame.depth = 9;
        barFrame.setScrollFactor(0);

        const expBarFrame = this.add.image(205, 100, 'expBarFrame').setOrigin(0); 
        expBarFrame.depth = 9;
        expBarFrame.setScrollFactor(0);

        const PlayerLevelFrame = this.add.image(423, 108, 'expBarFrame').setOrigin(0).setScale(0.5); 
        PlayerLevelFrame.depth = 9;
        PlayerLevelFrame.setScrollFactor(0);


        this.rainSound = this.sound.add('rain', {volume: 0.2}, {loop: true})
        //try to base pan and volume off location of particle relative to the player.
        this.lightningSound = this.sound.add('lightning', {volume: 0.2}, {pan: 0})

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
            on: false
        });   

        this.lightningParticles = this.add.particles('lightning');
        this.lightningEmitter = this.lightningParticles.createEmitter({
            frame: [ 'lightning1', 'lightning2'],
            x: { min:0, max: this.game.config.width},
            y: { min:-this.game.config.height/1.5, max: this.game.config.height*1.5},
            lifespan: 75,
            scaleX: 1,
            scaleY: 1,
            alpha: {start: 1, end: 0},
            quantity: 1,
            frequency: 60000,
            blendMode: 0,
            on: false
        });

        this.lightningEmitter.onParticleEmit(() => {
            this.lightningSound.play()
            this.lightningEmitter.setLifespan(Phaser.Math.Between(10, 150))
            this.lightningEmitter.setScaleX(Phaser.Math.Between(1, 1.2))
            this.lightningEmitter.setScaleY(Phaser.Math.Between(1, 2))
            this.lightningEmitter.setQuantity(Phaser.Math.Between(1, 5))
            this.lightningEmitter.setFrequency(Phaser.Math.Between(6000, 20000))
            this.lightningStrikes++
            //set scene tint brighter due to lightning strike this.setTint = Bright
            console.log(`number of lightning strikes this storm: ${this.lightningStrikes}`)
            if(this.lightningStrikes >= Phaser.Math.Between(10, 20)){
                this.player.clearTint()
                this.enemies.forEach(enemy => enemy.clearTint())
                this.rainEmitter.stop()
                this.lightningEmitter.stop()
                this.rainSound.stop()
                this.lightningStrikes = 0
                //set scene tint back to normal because the storm stopped: this.setTint = Normal
                console.log(`rain turned on?: ${this.rainEmitter.on}`)   
                console.log(`lightning turned on?: ${this.lightningEmitter.on}`)   
                console.log(`The weather should be calm.`)   
                console.log(`number of lightning strikes should be reset to zero: ${this.lightningStrikes}`)
            }
        });
            this.lightningStrikes = 0;
            
            const stormStart = () => {
                if(this.rainEmitter.on === false && this.lightningEmitter.on === false){
                    this.rainEmitter.start()
                    this.lightningEmitter.start()
                    this.rainSound.play()  
                    this.player.setTint(0xa0a0a0)
                    this.enemies.forEach(enemy => enemy.setTint(0xa0a0a0))
                    console.log(`rain turned on?: ${this.rainEmitter.on}`)   
                    console.log(`lightning turned on?: ${this.lightningEmitter.on}`)   
                    console.log(`A storm should be raging.`)   
                }
            }       
            setInterval(stormStart, Phaser.Math.Between(30000,60000));
            

        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0,2,this.game.config.width,this.game.config.height);


        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            ctrl: Phaser.Input.Keyboard.KeyCodes.CTRL,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        });

    };

    update(){
        this.enemies.forEach(enemy => enemy.update());
        this.player.update();

        /*
        This works, when player dies, 60 enemies spawn per second. 
        const respawnAllEnemies = () => {
            if(this.player.dead){
                 this.map.getObjectLayer('Enemies').objects.forEach(enemy =>  this.enemies.push(new Enemy({scene:this, enemy})));
             }
         }      
         setTimeout(respawnAllEnemies(), 1000); 
         */


         /*
         Now, how do I get the enemy property? something like that? 
         const respawnAllEnemies = () => {
            if(this.enemies.enemy.dead){
                 this.map.getObjectLayer('Enemies').objects.forEach(enemy =>  this.enemies.push(new Enemy({scene:this, enemy})));
             }
         }      
         setTimeout(respawnAllEnemies(), 1000); 
        */

    };

};