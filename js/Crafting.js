import DropItem from "./DropItem.js";
import items from "./Items.js";

export default class Crafting {
    constructor(data) {
        let { mainScene } = data;
        this.mainScene = mainScene;
        this.inventory = mainScene.player.inventory;
    this.player = mainScene.player;
    this.selected = 0;
    this.items = [];
    }
    //craft method to actually craft items.
    craft(){
    //we want to craft the currently selected item, so let's find the selected item first.
        let item = this.items[this.selected];
    //for the item, only craft items that we can craft. 
        if(item.canCraft) {
    //If we craft it, drop it on the floor infront of player.
            new DropItem({ name:item.name, scene:this.mainScene, x:this.player.x + 32, y:this.player.y, frame:item.frame});
    //Now to actually remove mats when you craft an item.
    //Go through them and use removeItem method we made in inventory.js to remove the mat from our inventory.
            item.matDetails.forEach(matDetail => this.inventory.removeItem(matDetail.name));
        }
    }

    updateItems(){
        this.items = [];
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