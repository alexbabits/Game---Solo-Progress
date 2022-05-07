//imported items.js
import items from "./Items.js";

export default class InventoryScene extends Phaser.Scene {
    constructor(){
        super("InventoryScene");
        //moved max columns and rows to inventory.js
        this.rows = 4;
        this.uiScale = 1.5;
        this.gridSpacing = 4;
        this.margin = 2;
        this._tileSize = 32;
        this.inventorySlots = [];
    }

    //this method allows us to send the scene some data. We send it the MainScene's data.
    init(data){
        let { mainScene } = data;
        this.mainScene = mainScene;
        //below allows for easy access to the player's inventory
        this.inventory = mainScene.player.inventory;
        //pop the max columns and rows here instead, since they are now listed in inventory.js
        this.maxColumns = this.inventory.maxColumns;
        this.maxRows = this.inventory.maxRows;
    };

    get tileSize() {
        return this._tileSize * this.uiScale;
    };

    /*This method actually shows our UI.
        (FOR THE FUTURE WHEN WE HAVE TOGGLE)
        - When the inventory is closed, we just show X many rows of the columns (maxColumns * rows).
        - But if it's opened, we'll show the max number of rows = (maxColumns * maxRows).
    */

    refresh() {
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            let x = (640 - (this.maxColumns * (this.tileSize + this.margin))) + ((index % this.maxColumns) * (this.tileSize + this.gridSpacing));
            let y = (640 - (this.rows * (this.tileSize + this.margin))) + (Math.floor(index/this.maxColumns) * (this.tileSize + this.gridSpacing));
            let inventorySlot = this.add.sprite(x, y, "items", 11);
            inventorySlot.setScale(this.uiScale);
            //Display our inventory.js information via inventoryscene's "UI" here.
            //We call the getItem method on inventory, with the inventory slot index as the parameter.
            let item = this.inventory.getItem(index);
            //Next, if we find an item in our inventory slot, 
            if(item){
            //show it in the corresponding UI slot. Notice we put the item at it's x and y value of the inventory slot.
            //We pass in the items spritesheet and the items.js, the item name and it's frame on the spritesheet.
                inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y - this.tileSize/12, "items", items[item.name].frame);
            //We show the quantity of the items, tweaked position, and above, tweaked item's position in proportion to the tilesize.
                inventorySlot.quantityText = this.add.text(inventorySlot.x, inventorySlot.y + this.tileSize/6, item.quantity, {
                    font: "11px Arial",
                    fill: "#111"  
                }).setOrigin(0.5, 0);
            //We set origin of X to be the center of the tile slot, and left the Y value unchanged.
            };
        };
    };

    create() {
        this.refresh();
    };

};
