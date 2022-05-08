import UIBaseScene from "./UIBaseScene.js";

export default class CraftingScene extends UIBaseScene {
    constructor(){
        //call super with crafting scene which will call constructor of ui base scene, then pass it again to phaser.scene.
        super("CraftingScene");
        this.craftingSlots = [];
        this.uiScale = 1.0;
    }

    init(data){
        //let { mainScene } = data;
        //this.mainScene = mainScene;
        //this.crafting will be our crafting.js model.
        //this.crafting = mainScene.crafting;
        //subscribing crafting model to inventory, which then calls a method we created called updateCraftableSlots.
        //this.crafting.inventory.subscribe( () => this.updateCraftableSlots() );
    }

    create() {
        this.updateCraftableSlots();
    }

    //method to destroy crafting slot when needed.
    destroyCraftingSlot(craftingSlot) {
    //Go through our crafting slot mats and for each mat, destroy all sprites.
        craftingSlot.matItems.forEach(m => m.destroy());
    //destroy the item sprite
        craftingSlot.item.destroy();
    //destroy the crafting slot itself.
        craftingSlot.destroy();
    }

    //method to update the crafting slots.
    updateCraftableSlots(){
        for (let index = 0; index < 3; index++) {
    //call the destroy method. If there's an existing slot at this index, then destroy it.
    if(this.craftingSlots[index]) this.destroyCraftingSlot(this.craftingSlots[index]);
    //crafting slots iterated position.
            let x = this.margin + this.tileSize / 2;
            let y = index * this.tileSize + this.game.config.height / 2;
    //We could push them on array like with inventoryScene, or we could do it like this:
            this.craftingSlots[index] = this.add.sprite(x,y,"items",11);
    //Show the craftable item inside the slot. Taking the item property which will be the item sprite
            this.craftingSlots[index].item = this.add.sprite(x, y, "items", 162);
    //Created an array of mats.
            this.craftingSlots[index].matItems = [];
    //Materials shown next to craftable items (items needed to craft the item shown above).
        for (let matIndex = 0; matIndex < 4; matIndex++) {
    //local scale variable to scale sprite.
            let scale = 0.75;
    //We have an array of mat items, assigning it a sprite to the right of our craftable item. The position gets it to march to the right.
            this.craftingSlots[index].matItems[matIndex] = this.add.sprite(x + this.tileSize + matIndex * this.tileSize * scale, y, "items", 69);
    //sets local scale of our sprite.
            this.craftingSlots[index].matItems[matIndex].setScale(scale);
            }
            
        }

    }

};