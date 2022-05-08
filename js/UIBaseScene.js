export default class UIBaseScene extends Phaser.Scene {
    constructor(name){
        super(name);
        //commonalities between crafting and inventory
        this.margin = 2;
        this.uiScale = 1.5;
        this._tileSize = 32;
    }
        //getter for tile scale/size
    get tileSize() {
        return this._tileSize * this.uiScale;
    }
}