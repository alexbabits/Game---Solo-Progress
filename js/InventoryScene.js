//imported items.js
import items from "./Items.js";

export default class InventoryScene extends Phaser.Scene {
    constructor(){
        super("InventoryScene");
        this.rows = 1;
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
        this.inventory = mainScene.player.inventory;
        this.maxColumns = this.inventory.maxColumns;
        this.maxRows = this.inventory.maxRows;
    };

    get tileSize() {
        return this._tileSize * this.uiScale;
    };

    //method to destroy invy slot
    destroyInventorySlot(inventorySlot) {
        //if there's an item sprite, then destroy it.
        if(inventorySlot.item) inventorySlot.item.destroy();
        //if there's quantity text, then destroy it.
        if(inventorySlot.quantityText) inventorySlot.quantityText.destroy();
        //Destroy the inventory slot itself.
        inventorySlot.destroy();
    }

    refresh() {
        //Kill every inventory slot everytime we do a refresh.
        this.inventorySlots.forEach( slots => this.destroyInventorySlot(slots));
        //Make sure out inventory slots array is empty. We want to keep an array of inventory slots.
        this.inventorySlots = [];
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            let x = (640 - (this.maxColumns * (this.tileSize + this.margin))) + ((index % this.maxColumns) * (this.tileSize + this.gridSpacing));
            let y = (640 - (this.rows * (this.tileSize + this.margin))) + (Math.floor(index/this.maxColumns) * (this.tileSize + this.gridSpacing));
            let inventorySlot = this.add.sprite(x, y, "items", 11);
            inventorySlot.setScale(this.uiScale);
            //Keeps inventory tiles slots stay in the background.
            inventorySlot.depth = -1;
            //Set inventory slots interactive.
            inventorySlot.setInteractive();
            //What inventory slot index has our mouse hovered over?
            inventorySlot.on("pointerover", pointer => {
                console.log(`pointerover: ${index}`);
            //Have a hover index and set it to the particular inventory slot index that's been hovered over.
                this.hoverIndex = index;
            });

            let item = this.inventory.getItem(index);
            if(item){
                inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y - this.tileSize/12, "items", items[item.name].frame);
                inventorySlot.quantityText = this.add.text(inventorySlot.x, inventorySlot.y + this.tileSize/6, item.quantity, {
                    font: "11px Arial",
                    fill: "#111"  
                }).setOrigin(0.5, 0);
            //inside our if statement where we add the item
            //We need to tell phaser we want to handle draggable events, and we want to drag the item sprite.
                inventorySlot.item.setInteractive();
            //we also need to set it draggable and pass in the thing (our sprite) we want to drag.
                this.input.setDraggable(inventorySlot.item);
            };
            //To keep track of every inventory slot we create so we can destroy them above. 
            //This just adds the newly created inventory slot in the for loop into our inventory slots array, and allows us to destroy it on refresh.
            this.inventorySlots.push(inventorySlot);
        };
    };

    create() {
        //toggles between showing one line on inventory or all the rows.
        this.input.keyboard.on("keydown-I", ()=> {
        //if our rows = 1, then make them equal to max rows, otherwise set back to 1.
            this.rows = this.rows === 1 ? this.maxRows : 1;
            this.refresh();
        });
        //Tell phaser we are not just interested in the events on top (fixes items not snapping back to previous slots they occupied.)
        this.input.setTopOnly(false);
        //Dragging code. 'dragstart' is a specific keyword to physically start a dragging event.
        this.input.on("dragstart", () => {
            console.log("dragstart");
            //Set our start index (where we start hovering over) equal to the current hover index.
            this.startIndex = this.hoverIndex;
            //remove the text while dragging.
            this.inventorySlots[this.startIndex].quantityText.destroy();
        });
        //Handle the drag event, it will send over the game object that's getting dragged around
        //dragX and dragY are just the current mouse position. (You want the object to follow the mouse as you drag.)
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        //This gets the game object following the mouse location.
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        //Getting the item sprite to snap into an inventory slot by handling the drag end event.
        this.input.on("dragend", () => {
        //We use method moveItem in inventory.js, to move it from the start index to the current hover index.
            this.inventory.moveItem(this.startIndex, this.hoverIndex);
        //call refresh to see current state of our inventory reflected in the UI.
            this.refresh();
        });

        this.refresh();
    };

};
