import DropItem from "./DropItem.js";
import items from "./Items.js";

export default class Crafting {
    //passed in CraftingScene.
    constructor(CraftingScene, data) {
        let { mainScene } = data;
        this.mainScene = mainScene;
    //Let CraftingScene be this.
        this.CraftingScene = CraftingScene;
        this.inventory = mainScene.player.inventory;
        this.player = mainScene.player;
        this.selected = 0;
        this.items = [];
    }

    craft(){
        let currentItem = this.items[this.selected];
        //needed this null check here.
        if(currentItem == null) return;
        if(currentItem.canCraft) {
            new DropItem({ name:currentItem.name, scene:this.mainScene, x:this.player.x + 32, y:this.player.y, frame:currentItem.frame});
            currentItem.matDetails.forEach(matDetail => this.inventory.removeItem(matDetail.name));
            //execute the method which plays the crafting sound here, where an item is made.
            this.CraftingScene.playCraftingSound();
        }
    }

    updateItems(){
        this.items = [];
        //set it to null anytime the crafting scene made/updated itself.
        this.selected = null;
        let craftables = Object.keys(items).filter(i => items[i].mats);

        for (let index = 0; index < craftables.length; index++){
            const itemName = craftables[index];
            const mats = items[itemName].mats;
            let lastMat = "";
            let matDetails = [];
            let canCraft = true;
            let qty = 0;
            mats.forEach( mat => {
                qty = (lastMat === mat) ? qty-1 : this.inventory.getItemQuantity(mat);
                let available = (qty > 0);
                matDetails.push({name:mat, frame:items[mat].frame, available});
                lastMat = mat;
                if(!available) canCraft = false;
            });
            this.items.push({name:itemName, frame:items[itemName].frame, matDetails, canCraft});
        }
        console.log(this.items);
    }
}