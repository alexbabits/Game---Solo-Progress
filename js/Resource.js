import MatterEntity from "./MatterEntity.js";

export default class Resource extends MatterEntity {

    static preload(scene){
        scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
        scene.load.audio('tree', 'assets/audio/tree.mp3');
        scene.load.audio('rock', 'assets/audio/rock.mp3');
        scene.load.audio('bush', 'assets/audio/bush.mp3');
        scene.load.audio('pickup', 'assets/audio/pickup.mp3');
        //preload our craftingsound in Resource.js
        scene.load.audio('craftingsound', 'assets/audio/craftingsound.mp3');
    }

    constructor(data){
        let {scene, resource} = data;

        let drops = JSON.parse(resource.properties.find(p => p.name== 'drops').value);
        let depth = resource.properties.find(p => p.name== 'depth').value;
        let tintable = resource.properties.find(p => p.name== 'tintable').value;
        let givesXP = resource.properties.find(p => p.name== 'givesXP').value;
        super({scene, x:resource.x, y:resource.y, texture: 'resources', frame:resource.type, drops, depth, health:5, maxHealth: 5, tintable, givesXP, name:resource.type});
        let yOrigin = resource.properties.find(p=>p.name =='yOrigin').value;

        this.y = this.y + this.height * (yOrigin - 0.5);

        const {Bodies} = Phaser.Physics.Matter.Matter;
        let circleCollider = Bodies.circle(this.x, this.y, 12, {isSensor:false, label:'circledCollider'});

        this.setExistingBody(circleCollider);
        this.setOrigin(0.5, yOrigin);
        this.setStatic(true);
    }

};