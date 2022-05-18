import Crafting from "./Crafting.js";
import Enemy from "./Enemy.js";
import Player from "./Player.js";
//import PreloadScene from "./PreloadScene.js";
import Resource from "./Resource.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.enemies = [];
    }

    preload() {
        Player.preload(this);
        Enemy.preload(this);
        Resource.preload(this);
        //Loads in the preloadScene
        //PreloadScene.preload(this);

        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map','assets/images/map.json');
        this.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        this.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        this.load.image('rain', 'assets/images/rain.png');
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.image('lightning', 'assets/images/lightning.png');
        //load in the lightning and rain sounds
        this.load.audio('lightning', 'assets/audio/lightning.mp3');
        this.load.audio('rain', 'assets/audio/rain.mp3');
        //preloading in the health bar frame image.
        this.load.image('Healthbarframe', 'assets/images/Healthbarframe.png');

         //adding graphics so they can be rectangles in the future.
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0xffff00, .2);
        //position x,y and width height
        progressBox.fillRect(170,295,300,50);

        let width = this.game.config.width;
        let height = this.game.config.height;

        let loadingText = this.make.text({
            x: width / 2 + 5,
            y: height / 2 - 70,
            text: 'Loading',
            style: {
                font: '48px monospace',
                fill: '#cbdbfc'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '24px monospace',
                fill: '#000000'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#cbdbfc'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffff00, 1);
            progressBar.fillRect(170, 295, 300 * value, 50);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        //Just iterating the image 500 times to take time to load so loading bar has a purpose. zenvalogo doesn't exist but it doesn't matter it seems.
        this.load.image('logo', 'zenvalogo.png');
        for (let i = 0; i < 10; i++) {
            this.load.image('logo'+i, 'zenvalogo.png');
                }   
                
    };



    create(){
        //logo for loading bar?
        let logo = this.add.image(400, 300, 'logo');
        this.input.setDefaultCursor('url(assets/images/cursor.png), pointer')

        const map = this.make.tilemap({key: 'map'});
        this.map = map;
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 2);
        const background = map.createStaticLayer('background', tileset, 0, 2);
        background.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(background);
    
        this.map.getObjectLayer('Resources').objects.forEach(resource =>  new Resource({scene:this, resource}));
        this.map.getObjectLayer('Enemies').objects.forEach(enemy =>  this.enemies.push(new Enemy({scene:this, enemy})));

        //loading in the health bar frame
        const Healthbarframelogo = this.add.image(110, 102, 'Healthbarframe').setOrigin(0); 
        Healthbarframelogo.depth = 9;
        Healthbarframelogo.setScale(.3);
        Healthbarframelogo.setScrollFactor(0);

        /*
        //This loads the object layer, and you get access to all the objects in that layer.
        const boundaryLayer = map.getObjectLayer('Boundary');
        //If it exists, and it has objects:  
        if (boundaryLayer && boundaryLayer.objects){
        //for each object in that object layer:
            boundaryLayer.objects.forEach(
        //Go through the objects and do this function:
                (object) => {
        //Make an invisible rectangle at each objects position. (Right now we just have the one rectangle object we made with that layer).
        //(Our one rectangle spans the entire 'y' of the game, and is on the far right of the screen at x=620 on the right side of the dirt.)
                    let boundaries = this.add.rectangle((object.x+(object.width/2)), (object.y+(object.height/2)), object.width, object.height);
        //Grab any properties associated with the object and sum/get them all via reduce method.
        //Lastly, we use the assign method on the Object to assign all those properties we created for our object we created in our Tiled object layer.
                    boundaries.properties = object.properties.reduce(
                        (obj, item) => Object.assign(obj, {[item.name]: item.value}), {}
                    );
        //We could have also done something like this maybe to extract the properties of the object onto the object we created:
        //let nameOfBoundary = JSON.parse(boundaries.properties.find(p => p.name== 'boundarytest').value);

        //Lastly, Here, we are supposed to make the invisible rectangle interactable. Unsure if I need to do this even???


                }
            );
        }
        */

        /*
        These are notes for me previously trying to implement object layers and their objects+properties.

        Goal: Import and use our rectangle object we call 'boundarytest' made in our 'Boundary' object layer in Tiled.
        Use it as a zone where when stepped on by the player, takes the player to a new scene.

        Process: Get/import our Object Layer called 'Boundary' with Phaser. 
        Get/Import our rectangular object we made called 'boundarytest' with Phaser. We gave it a custom property 'name' with a string of 'boundarytest'.
        Make a new rectangle be the same coordinates as the rectangle object we made in Tiled? 
        Once properly imported, then say 'if the player steps on this invisible rectangle object, change his velocity/position.'
        Eventually want to be able to change scenes if the invisible object is walked on.
        
        Some attempts at the syntax to import and use the object:
        this.map.getObjectLayer('Boundary');
        let rectCoord = this.map.objects['Boundary']['boundarytest'];
        Or try this: let rectCoord = map.createFromObjects('Boundary','boundarytest');
        Or try this: const boundaryLayer = map.createObjectLayer('Boundary', tileset?, 'boundarytest?');
        Or try this: const boundarything = map.findObject("Boundary", obj => obj.name === "boundarytest");
        if using rectCoord way: this.sceneChange = new Phaser.Rectangle(rectCoord.x, rectCoord.y, rectCoord.width, rectCoord.height);
        if using boundarything way: this.sceneChange = new Phaser.Rectangle(boundarything.x, boundarything.y, boundarything.width, boundarything.height);
        
        or try this: 
        map.getObjectLayer('Boundary').objects.forEach((test) => {
            const xyz = this.???.create(test.x, test.y, 'boundarytest');
        });

        Finally, with something like this in update:
                if (this.sceneChange.contains(this.player.x)) {
            (change the players velocity to test at first). (Or transition scenes like below:)
            this.scene.stop(this);
            this.scene.start('map2');
        }
        */
        
        //creating our sound objects, rain and lightning:
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

        Adding rain and lightning together and condensing could look like this (btw: emitter refers to rain, emitter2 refers to lightning):
        (We don't need to play lightningSound or stop lightningSound here, because it only plays when a lightning particle is emitted anyway.
         It's sound is taken care of via the 'onParticleEmit' method)

        if(stormStartFlag === true){
            this.emitter.start()
            this.emitter2.start()
            this.rainSound.play()
        } else return

        if(stormStopFlag === true){
            this.emitter.stop()
            this.emitter2.stop()
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

            /* Attempt to make a storm handler

                //This function starts a storm. Both emitters have to be 'on: false' initially.
                function stormStart(){
                    this.emitter.start()
                    this.emitter2.start()
                    this.rainSound.play()
                    setTimeout( () => this.stormStop(), Phaser.Math.Between(10000,60000) );
            }
        
                //This function stops a storm. Both emitters have to be 'on: true'. 
                function stormStop(){
                    this.emitter.stop()
                    this.emitter2.stop()
                    this.rainSound.stop()
                    setTimeout( () => this.stormStart(), Phaser.Math.Between(10000,60000) );
            }
            */
                

        //function that plays the lightning sound.
        function lightningSound() {
            this.lightningSound.play()
          }

        //when a lightning particle is emitted, plays the lightning sound function which plays the lightning sound.
        this.emitter2.onParticleEmit(lightningSound, this);
        

        /*
        const villainGroup = this.add.group({ key: 'hero', frame:'hero_idle_5', frameQuantity: 4 });
        const villainSpawnArea = new Phaser.Geom.Rectangle(300, 300, 300, 300);
        Phaser.Actions.RandomRectangle(villainGroup.getChildren(), villainSpawnArea);
        */

        /*
        //Attempt to make multiple fully functional player objects - testing for spawning future enemy object groups...
        let a;
        for (a=0;a<5;a++) {
        */
        this.player = new Player({scene:this, x:Phaser.Math.Between(150,400), y:Phaser.Math.Between(150, 350), texture:'hero', frame:'hero_idle_1'});
        //}

        /*
        // Display player's health
        let playerHealthText = this.add.text(300, 300, `${this.health}/10`, { fontSize: '16px', fill: '#000' });
        // Sets health text depth
        playerHealthText.depth = 11;
        // Updates player's health text
        playerHealthText.setText(`${this.health}/10`);
        console.log(this);
        */

        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player);
        camera.setLerp(0.1,0.1);
        //fixed camera bounds
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
        this.dragon = new Phaser.Physics.Matter.Sprite(this.matter.world, Phaser.Math.Between(320,540), Phaser.Math.Between(40, 160), 'enemies', 'dragon_idle_1');
        this.add.existing(this.dragon);
        this.dragon.setFixedRotation();
        this.dragon.setStatic(true);
        */
    };

    
    update(){
        this.enemies.forEach(enemy => enemy.update());
        this.player.update();

        //Finally, we test to see if our Object in our Object Layer is interactable by changing the player's velocity when stepped on.
        //I can't figure out how to extract the object from our object layer, and use it's position to do something.
        
        //Can walk to second scene now (lots of bugs and fixes needed, but works kinda).
        if (this.player.x > 600) {
            this.cameras.main.fade(400, 0, 0, 0, false, function(camera, progress) {
                if (progress > .99) {
                     this.scene.stop('MainScene')
                    this.scene.start('SecondScene')
                }
            });

        }

        //Doesn't fully allow for a restart, inventory is still there, can't play again.
        if (this.player.dead) {
            this.cameras.main.fade(400, 0, 0, 0, false, function(camera, progress) {
                if (progress > .99) {
                    this.scene.stop('SecondScene')
                    this.scene.start('StartScene')
                }
            });
        }
        
    };

};