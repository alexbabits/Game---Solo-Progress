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

    create() {
        this.updateCraftableSlots();
    //mousewheel functionality to select craftable items, and tinting. Very similiar to inventory scrolling.
        this.input.on("wheel",(pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.crafting.selected = Math.max(0, this.crafting.selected+ (deltaY > 0 ? 1 : -1)) % this.crafting.items.length;
            this.updateSelected();
        });
    //handles the key 'E' to craft an item.
        this.input.keyboard.on('keydown-E', () => {
    //calls the craft method we made in crafting.js
            this.crafting.craft();
        });
    }

    //creating the updateSelected method for our mousewheel.
        updateSelected(){
    //go through all our craftable items, and tint the slot.
            for (let index = 0; index < this.crafting.items.length; index++){
    // if the selected matches the index, tint gold, otherwise no tint (white).
                this.craftingSlots[index].tint = this.crafting.selected === index ? 0xffff00 : 0xffffff;
            }
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
            let y = index * this.tileSize + this.game.config.height / 2;

            this.craftingSlots[index] = this.add.sprite(x,y,"items",11);
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

};