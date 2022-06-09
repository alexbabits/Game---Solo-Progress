import MatterEntity from "./MatterEntity.js";

export default class Resource extends MatterEntity {

    static preload(scene){
        scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json');
        scene.load.audio('tree', 'assets/audio/tree.mp3');
        scene.load.audio('rock', 'assets/audio/rock.mp3');
        scene.load.audio('bush', 'assets/audio/bush.mp3');
        scene.load.audio('pickup', 'assets/audio/pickup.mp3');
    }

    constructor(data){
        let {scene, resource} = data;

        let drops = JSON.parse(resource.properties.find(p => p.name== 'drops').value);
        let depth = resource.properties.find(p => p.name== 'depth').value;
        let tintable = resource.properties.find(p => p.name== 'tintable').value;
        let givesXP = resource.properties.find(p => p.name== 'givesXP').value;
        let health = resource.properties.find(p => p.name== 'health').value;
        let maxHealth = resource.properties.find(p => p.name== 'maxHealth').value;

        let yOrigin = resource.properties.find(p=>p.name =='yOrigin').value;
        let xOrigin = resource.properties.find(p=>p.name =='xOrigin').value;
        let WidthAdj = resource.properties.find(p=>p.name =='WidthAdj').value;
        let HeightAdj = resource.properties.find(p=>p.name =='HeightAdj').value;
        let ChamTL = resource.properties.find(p=>p.name =='ChamTL').value;
        let ChamTR = resource.properties.find(p=>p.name =='ChamTR').value;

        super({scene, x:resource.x, y:resource.y, texture: 'resources', frame:resource.type, drops, depth, health, maxHealth, tintable, givesXP, name:resource.type});
        this.y = this.y + this.height * (yOrigin - 0.5);
        this.x = this.x + this.width * (xOrigin - 0.5);

        const {Bodies} = Phaser.Physics.Matter.Matter;
        let customCollider = Bodies.rectangle(this.x, this.y, WidthAdj*14, HeightAdj*21, {chamfer: { radius: [ChamTL*6, ChamTR*6, 6, 6] }, isSensor:false, label:'customCollider'});

        this.setExistingBody(customCollider);
        this.setOrigin(xOrigin, yOrigin);
        this.setStatic(true);
    }

};