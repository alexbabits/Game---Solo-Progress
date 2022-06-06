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

    craft(){
        let currentItem = this.items[this.selected];
        //needed this null check here.
        if(currentItem == null) return;
        if(currentItem.canCraft) {
            new DropItem({ name:currentItem.name, scene:this.mainScene, x:this.player.x + 32, y:this.player.y, frame:currentItem.frame});
            currentItem.matDetails.forEach(matDetail => this.inventory.removeItem(matDetail.name));
          //this.craftingSound.play();
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
                //Or maybe put the 'can't play sound' here, since it's not available.
            });
            this.items.push({name:itemName, frame:items[itemName].frame, matDetails, canCraft});
        }
        console.log(this.items);
    }
}