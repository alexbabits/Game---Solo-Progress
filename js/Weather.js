export default class Weather {
    constructor(scene) {
        this.scene = scene;
        scene.load.image('rain', 'assets/images/rain.png');
        scene.load.atlas('lightning', 'assets/images/lightning.png', 'assets/images/lightning_atlas.json');
        scene.load.audio('lightning', 'assets/audio/lightning.mp3');
        scene.load.audio('rain', 'assets/audio/rain.mp3');
    }

    create() {
        this.rainSound = this.scene.sound.add('rain', {volume: 0.2}, {loop: true})
        //try to base pan and volume off location of particle relative to the player.
        this.lightningSound = this.scene.sound.add('lightning', {volume: 0.2}, {pan: 0})

        this.rainParticles = this.scene.add.particles('rain');
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

        this.lightningParticles = this.scene.add.particles('lightning');
        this.lightningEmitter = this.lightningParticles.createEmitter({
            frame: [ 'lightning1', 'lightning2'],
            x: { min:0, max: this.scene.game.config.width},
            y: { min:-this.scene.game.config.height/1.5, max: this.scene.game.config.height*1.5},
            lifespan: 75,
            scaleX: 1,
            scaleY: 1,
            alpha: {start: 1, end: 0},
            quantity: 1,
            frequency: 60000,
            blendMode: 0,
            on: false
        });

        //set everything here with methods.
        this.lightningEmitter.onParticleEmit(() => {
            this.lightningSound.play()
            this.lightningEmitter.setLifespan(Phaser.Math.Between(10, 150))
            this.lightningEmitter.setScaleX(Phaser.Math.Between(1, 1.2))
            this.lightningEmitter.setScaleY(Phaser.Math.Between(1, 2))
            this.lightningEmitter.setQuantity(Phaser.Math.Between(1, 5))
            this.lightningEmitter.setFrequency(Phaser.Math.Between(3000, 6000))
            this.lightningStrikes++
            //set scene tint brighter due to lightning strike this.setTint = Bright
            console.log(`number of lightning strikes this storm: ${this.lightningStrikes}`)
            if(this.lightningStrikes >= Phaser.Math.Between(20, 40)){
                this.scene.player.clearTint()
                this.scene.enemies.forEach(enemy => enemy.clearTint())
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
                    this.scene.player.setTint(0xa0a0a0)
                    this.scene.enemies.forEach(enemy => enemy.setTint(0xa0a0a0))
                    console.log(`rain turned on?: ${this.rainEmitter.on}`)   
                    console.log(`lightning turned on?: ${this.lightningEmitter.on}`)   
                    console.log(`A storm should be raging.`)   
                }
            }       
            setInterval(stormStart, Phaser.Math.Between(3000, 6000));
    }

}

