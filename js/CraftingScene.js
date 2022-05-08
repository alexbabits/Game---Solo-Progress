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
        //this.crafting will be our crafting.js model.
        this.crafting = mainScene.crafting;
        //subscribing crafting model to inventory, which then calls a method we created called updateCraftableSlots.
        this.crafting.inventory.subscribe( () => this.updateCraftableSlots() );
    }

    create() {
        this.updateCraftableSlots();
    }

    destroyCraftingSlot(craftingSlot) {
        craftingSlot.matItems.forEach(m => m.destroy());
        craftingSlot.item.destroy();
        craftingSlot.destroy();
    }

    updateCraftableSlots(){
        //We need to call the updateItems method here.
        this.crafting.updateItems();
        //we changed the hardcoded index < 3 to be versatile, instead getting the maximum iterations for the crafting slots from the crafting model.
        for (let index = 0; index < this.crafting.items.length; index++) {
            if(this.craftingSlots[index]) this.destroyCraftingSlot(this.craftingSlots[index]);
        //assign the current craftable item we are iterating over. (Looking into our model and looking at the index).
            const craftableItem = this.crafting.items[index];
            let x = this.margin + this.tileSize / 2;
            let y = index * this.tileSize + this.game.config.height / 2;

            this.craftingSlots[index] = this.add.sprite(x,y,"items",11);
        //instead of hard coding a frame number, we can just use the craftable items frame.
            this.craftingSlots[index].item = this.add.sprite(x, y, "items", craftableItem.frame);
        //tint craftable item sprite based on canCraft boolean we setup in crafting model. (sprite is: this.craftingSlots[index].item)
            this.craftingSlots[index].item.tint = craftableItem.canCraft ? 0xffffff : 0x555555;

            this.craftingSlots[index].matItems = [];
        //get rid of the hardcoded 4, and instead going through the mats of the craftable item to see how many iterations need to be done.
        //Which is found in the matDetails array.
        for (let matIndex = 0; matIndex < craftableItem.matDetails.length; matIndex++) {
            let scale = 0.75;
        //get our mat from the array.
            const matItem = craftableItem.matDetails[matIndex];
        //at the end, instead of hardcoding a frame, we want to show the correct mat frame.
            this.craftingSlots[index].matItems[matIndex] = this.add.sprite(x + this.tileSize + matIndex * this.tileSize * scale, y, "items", matItem.frame);
            this.craftingSlots[index].matItems[matIndex].setScale(scale);
        //tinting the mat sprite if available or not using available boolean we setup in crafting model. (sprite is: this.craftingSlots[index].matItems[matIndex]).
            this.craftingSlots[index].matItems[matIndex].tint = matItem.available ? 0xffffff : 0x555555;

            }
            
        }

    }

};