import Crafting from "./Crafting.js";
import Enemy from "./Enemy.js";
import Player from "./Player.js";
import Resource from "./Resource.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.enemies = [];
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
        this.load.image('lightning', 'assets/images/lightning.png');
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
        
        this.rainSound = this.sound.add('rain', {volume: 0.2})
        this.lightningSound = this.sound.add('lightning', {volume: 0.2})

        this.particles = this.add.particles('rain');
        this.emitter = this.particles.createEmitter({
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

        this.particles2 = this.add.particles('lightning');
        this.emitter2 = this.particles2.createEmitter({
            x: { min:0, max: 640},
            y: 0,
            lifespan: 100,
            speedY: {min: 0, max: 0},
            speedX: {min: 0, max: 0},
            scale: 2,
            quantity: 1,
            maxParticles: 0,
            frequency: Phaser.Math.Between(6000,30000), //or you could do Math.Max((6000,(Math.random()*30000)))
            blendMode: 0
        });

        function lightningSound() {
            this.lightningSound.play()
          }

        this.emitter2.onParticleEmit(lightningSound, this);
        
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

    };

    update(){
        this.enemies.forEach(enemy => enemy.update());
        this.player.update();
    };

};