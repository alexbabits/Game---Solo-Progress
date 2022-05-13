import MatterEntity from "./MatterEntity.js";

export default class Enemy extends MatterEntity {

    static preload(scene){
    //preload in the atlas sheet, anims, and audio for the enemies.
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        scene.load.audio('bear', 'assets/audio/bear.mp3');
        scene.load.audio('wolf', 'assets/audio/wolf.mp3');
        scene.load.audio('ent', 'assets/audio/ent.mp3');
    }


    constructor(data){
        //pass in our scene and enemy object from Tiled.
        let {scene, enemy} = data;
        //Copied from Resource.Json since drops are the same.
        let drops = JSON.parse(enemy.properties.find(p => p.name== 'drops').value);
        let health = enemy.properties.find(p => p.name== 'health').value;
        //pass in scene, x, y, texture, frame associated with enemy, and miscellaneous properties such as drops, health, and name.
        super({scene, x:enemy.x, y:enemy.y, texture:'enemies', frame:`${enemy.name}_idle_1`, drops, health, name:enemy.name});
    }   
    //create update() method in Enemy.js and console log a string just to make sure things exist for now.
    //Created 'Enemies' Object Layer in Tiled.
    //NOTE: We use a signpost sprite for all our enemies. Under the Tiled Property 'name' we name the signs
    //Whatever we want the enemy to be "bear" or "wolf" or whatever.
    //Add custom property 'drops' string which is an array of numbers corresponding to the items spritesheet.
    //Add custom property 'health' which is integer, int, number like 5.
    update(){
        //console.log('enemy update');
    }
}