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

    destroyInventorySlot(inventorySlot) {
        if(inventorySlot.item) inventorySlot.item.destroy();
        if(inventorySlot.quantityText) inventorySlot.quantityText.destroy();
        inventorySlot.destroy();
    }

    refresh() {
        this.inventorySlots.forEach( slots => this.destroyInventorySlot(slots));
        this.inventorySlots = [];
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            let x = (640 - (this.maxColumns * (this.tileSize + this.margin))) + ((index % this.maxColumns) * (this.tileSize + this.gridSpacing));
            let y = (640 - (this.rows * (this.tileSize + this.margin))) + (Math.floor(index/this.maxColumns) * (this.tileSize + this.gridSpacing));
            let inventorySlot = this.add.sprite(x, y, "items", 11);
            inventorySlot.setScale(this.uiScale);
            inventorySlot.depth = -1;
            inventorySlot.setInteractive();

            inventorySlot.on("pointerover", pointer => {
                console.log(`pointerover: ${index}`);
                this.hoverIndex = index;
            });

            let item = this.inventory.getItem(index);
            if(item){
                inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y - this.tileSize/12, "items", items[item.name].frame);
                inventorySlot.quantityText = this.add.text(inventorySlot.x, inventorySlot.y + this.tileSize/6, item.quantity, {
                    font: "11px Arial",
                    fill: "#111"  
                }).setOrigin(0.5, 0);
                inventorySlot.item.setInteractive();
                this.input.setDraggable(inventorySlot.item);
            };
            this.inventorySlots.push(inventorySlot);
        };
        //calls update selected to make sure we are doing an initial highlight of selected item.
        this.updateSelected();
    };

    //method to update (tint) the selected slot.
    updateSelected() {
    //go through each slot
        for (let index = 0; index < this.maxColumns; index++) {
    //tint unselected white, tint selected yellow.
            this.inventorySlots[index].tint = this.inventory.selected === index ? 0xffff00 : 0xffffff;
        }
    };

    create() {

        //Ability to select items
        this.input.on("wheel", (pointer, gameObject, deltaX, deltaY, deltaZ) => {
        //constrain it to between zero and maximum number of columns
        //inside inventory, we created 'selected' in our inventory.js model, which is just the index of our selected item.
        //And we want that at most to be the maximum columns.
        //If we are scrolling up (deltaY is positive) then we want to add 1, and if we scroll down, remove 1.
        //But we can't just keep adding 1 forever, so again we use modulus as a repeating limiter so it never goes above max columns. 
            this.inventory.selected = Math.max(0, this.inventory.selected + (deltaY > 0 ? 1 : -1)) % this.maxColumns;
        //We call update selected to tint the slot index we currently have selected.
        this.updateSelected();
        });

        this.input.keyboard.on("keydown-I", ()=> {
            this.rows = this.rows === 1 ? this.maxRows : 1;
            this.refresh();
        });

        this.input.setTopOnly(false);

        this.input.on("dragstart", () => {
            console.log("dragstart");
            this.startIndex = this.hoverIndex;
            this.inventorySlots[this.startIndex].quantityText.destroy();
        });

        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on("dragend", () => {
            this.inventory.moveItem(this.startIndex, this.hoverIndex);
            this.refresh();
        });

        this.refresh();
    };

};
