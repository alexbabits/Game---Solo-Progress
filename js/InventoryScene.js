import items from "./Items.js";
import UIBaseScene from "./UIBaseScene.js";

export default class InventoryScene extends UIBaseScene {
    constructor(){
        super("InventoryScene");
        this.rows = 1;
        this.gridSpacing = 4;
        this.inventorySlots = [];
    }

    init(data){
        let { mainScene } = data;
        this.mainScene = mainScene;
        this.inventory = mainScene.player.inventory;
        this.maxColumns = this.inventory.maxColumns;
        this.maxRows = this.inventory.maxRows;
        this.inventory.subscribe(() => this.refresh());
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
            let x = (this.game.config.width - (this.maxColumns * (this.tileSize + this.margin))) + ((index % this.maxColumns) * (this.tileSize + this.gridSpacing));
            let y = (this.game.config.height - (this.rows * (this.tileSize + this.margin))) + (Math.floor(index/this.maxColumns) * (this.tileSize + this.gridSpacing));
            let inventorySlot = this.add.sprite(x, y, "items", 11);
            inventorySlot.setScale(this.uiScale);
            inventorySlot.depth = -1;
            inventorySlot.setInteractive();

            inventorySlot.on("pointerover", pointer => {
                //you could tint the inventory slot here I think.
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
        this.tintSelectedSlot();
    };

    tintSelectedSlot() {
        for (let index = 0; index < this.maxColumns; index++) {
            this.inventorySlots[index].tint = this.inventory.selected === index ? 0xffff00 : 0xffffff;
        }
    };

    create() {
        this.input.on("wheel", (pointer, gameObject, deltaX, deltaY, deltaZ) => {
            if(this.scene.isActive('CraftingScene')) return;
            this.inventory.selected = Math.max(0, this.inventory.selected + (deltaY > 0 ? 1 : -1)) % this.maxColumns;
            this.tintSelectedSlot();
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
