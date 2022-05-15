import Crafting from "./Crafting.js";
import Enemy from "./Enemy.js";
import Player from "./Player.js";
import Resource from "./Resource.js";

export default class SecondScene extends Phaser.Scene {
    constructor() {
        super("SecondScene");
        this.enemies = [];
    }

    preload() {
        Player.preload(this);
        Enemy.preload(this);
        Resource.preload(this);
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map','assets/images/map.json');
        this.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        this.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.image('ash', 'assets/images/ash.png');
    };

    create(){

        this.input.setDefaultCursor('url(assets/images/cursor.png), pointer')

        const map2 = this.make.tilemap({key: 'map2'});
        this.map2 = map2;
        const tileset = map2.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 2);
        const background = map2.createStaticLayer('background', tileset, 0, 2);
        background.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(background);
    
        this.map.getObjectLayer('Resources').objects.forEach(resource =>  new Resource({scene:this, resource}));
        this.map.getObjectLayer('Enemies').objects.forEach(enemy =>  this.enemies.push(new Enemy({scene:this, enemy})));

        this.player = new Player({scene:this, x:Phaser.Math.Between(150,400), y:Phaser.Math.Between(150, 350), texture:'hero', frame:'hero_idle_1'});

        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0,0,this.game.config.width,this.game.config.heigth);

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

        this.particles = this.add.particles('ash');
        this.emitter = this.particles.createEmitter({
            x: { min:0, max: 800},
            y: 0,
            lifespan: 40000,
            speedY: {min: 7, max: 23},
            speedX: {min: -12, max: 0},
            scale: 0.1,
            quantity: 1,
            maxParticles: 0,
            frequency: 450, 
            blendMode: 0
        });


    };
    
    update(){
        this.enemies.forEach(enemy => enemy.update());
        this.player.update();

        if (this.player.x < 40) {
            this.cameras.main.fade(400, 0, 0, 0, false, function(camera, progress) {
                if (progress > .99) {
                    this.scene.stop('SecondScene')
                    this.scene.start('MainScene')
                }
            });
}

        if (this.player.dead) {
            this.cameras.main.fade(400, 0, 0, 0, false, function(camera, progress) {
                if (progress > .99) {
                    this.scene.stop('MainScene')
                    this.scene.start('StartScene')
                }
            });
        }
        //Finally, we test to see if our Object in our Object Layer is interactable by changing the player's velocity when stepped on.
        //I can't figure out how to extract the object from our object layer, and use it's position to do something.
                //if (this.player.x > this.boundaries.x) {
                    //this.player.y = 200
        //}
        
    };

};