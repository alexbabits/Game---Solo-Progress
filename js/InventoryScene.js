import items from "./Items.js";
import UIBaseScene from "./UIBaseScene.js";

export default class InventoryScene extends UIBaseScene {
    constructor(){
        super("InventoryScene");
        this.rows = 0;
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
        this.updateSelected();
    };

    updateSelected() {
        //had to multiply by this.rows to tint them all, instead of just the first row like before.
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            this.inventorySlots[index].tint = this.inventory.selected === index ? 0xffff00 : 0xffffff;
        }
    };

    create() {
        this.input.on("pointerover", () => {
            //deleted the wheel stuff and instead just did this for pointerover.
            this.inventory.selected = this.hoverIndex;
            this.updateSelected();
        });
        this.input.keyboard.on("keydown-I", ()=> {
            this.rows = this.rows === 0 ? this.maxRows : 0;
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

        
        //double clicking:
        let lastTime = 0;
        if("The pointer is hovering over the slot index which contained the pickaxe the whole time during both clicks"){
            this.input.on("pointerdown", () => {
                let clickDelay = this.time.now - lastTime;
                lastTime = this.time.now;
                if(clickDelay < 250) {
                        this.inventory.removeItem('pickaxe'); //(removeItem() decrements quantity, deletes item from inventory if zero quantity, and broadcasts this). Does work atm.
                        this.health -= 5; //(remove 5 health from player to check functionality). Does not work atm. Gives 'NaN'.
                        //play potion drinking sound
                        console.log(this.health);
                     
                }  
            });
        }



        this.refresh();
    };

};
