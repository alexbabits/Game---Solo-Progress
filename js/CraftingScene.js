import UIBaseScene from "./UIBaseScene.js";

export default class CraftingScene extends UIBaseScene {
    constructor(){
        super("CraftingScene");
        this.craftingSlots = [];
        this.uiScale = 1.0;
    }

    init(data){
        let { mainScene } = data;
        this.mainScene = mainScene;
        this.crafting = mainScene.crafting;
        this.crafting.inventory.subscribe( () => this.updateCraftableSlots() );
    }

    destroyCraftingSlot(craftingSlot) {
        craftingSlot.matItems.forEach(m => m.destroy());
        craftingSlot.item.destroy();
        craftingSlot.destroy();
    }

    updateCraftableSlots(){
        this.crafting.updateItems();
        for (let index = 0; index < this.crafting.items.length; index++) {
            if(this.craftingSlots[index]) this.destroyCraftingSlot(this.craftingSlots[index]);
            const craftableItem = this.crafting.items[index];
            let x = this.margin + this.tileSize / 2;
            let y = this.game.config.height - this.tileSize + this.margin - (index * this.tileSize) ;

            this.craftingSlots[index] = this.add.sprite(x,y,"items",11);
            //added set interactive:
            this.craftingSlots[index].setInteractive();
            //Add this for the hover over index:
            this.craftingSlots[index].on("pointerover", pointer => {
                this.hoverIndex = index;
                //console.log(this.hoverIndex);
            });

            this.craftingSlots[index].item = this.add.sprite(x, y, "items", craftableItem.frame);
            this.craftingSlots[index].item.tint = craftableItem.canCraft ? 0xffffff : 0x555555;
            this.craftingSlots[index].matItems = [];

        for (let matIndex = 0; matIndex < craftableItem.matDetails.length; matIndex++) {
            let scale = 0.75;
            const matItem = craftableItem.matDetails[matIndex];
            this.craftingSlots[index].matItems[matIndex] = this.add.sprite(x + this.tileSize + matIndex * this.tileSize * scale, y, "items", matItem.frame);
            this.craftingSlots[index].matItems[matIndex].setScale(scale);
            this.craftingSlots[index].matItems[matIndex].tint = matItem.available ? 0xffffff : 0x555555;

            }
            
        } 

    }

    tintSelectedSlot(){
        for (let index = 0; index < this.crafting.items.length; index++){
            this.craftingSlots[index].tint = this.crafting.selected === index ? 0xffff00 : 0xffffff;
        }
    }

    create() {
        this.updateCraftableSlots();
        this.input.on("pointerover", () => {
            this.crafting.selected = this.hoverIndex;
            this.tintSelectedSlot();
        });
        /*
        //for some reason this bugs it out:
        this.input.on("pointerout", () => {
            this.crafting.selected = null;
            this.tintSelectedSlot();
        });
        */
        /*
        this.input.on("pointerup", () => {
            this.crafting.craft();
        });
        */

        this.input.keyboard.on('keydown-E', () => {
            this.crafting.craft();
        });
    }

};