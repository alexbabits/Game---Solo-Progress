import items from "./Items.js";

export default class Crafting {
    constructor(data) {
        let { mainScene } = data;
        this.mainScene = mainScene;
    //access to our inventory.
        this.inventory = mainScene.player.inventory;
    //when we craft an item, drop it near the player, need easy access to player.
    this.player = mainScene.player;
    //similar to inventory, want selected index, so we can select the item we want to craft
    this.selected = 0;
    this.items = [];
    }

    //method for keeping model up to date - all the craftable items available to us, and availability of their materials.
    updateItems(){
        //start with an empty array, and build it up every time updateItem is called.
        this.items = [];
        //know all the items we can craft (all the items in the item object in items.js that have mats defined.)
        //This will only return true if mats are defined, otherwise false (for filter).
        let craftables = Object.keys(items).filter(i => items[i].mats);
        // this checks to see what items are considered craftable: console.log(craftables);
        //Now let's check through these items and check that we have the mats to craft the craftable items.
        for (let index = 0; index < craftables.length; index++){
            //Let's pull out our item name.
            const itemName = craftables[index];
            //Get the mats for this particular item. This reaches into items, finds the item name (pickaxe for example), and gets the mats.
            const mats = items[itemName].mats;
            //Now check to see if we have enough mats.
            //We'll go through the mats array in items.js, see that we need wood, wood, stone.
            //We'll look through inventory, if we have 1 wood, if so, minus our inventory quantity by 1,
            //So then do we still have enough wood for the 2nd wood? Then look for the stone.
            //So lastMat is a blank string name that will be used to check for materials matching in the inventory.
            let lastMat = "";
            //For each mat, we'll want to be able to tell if that mat is available or not, so thats what matDetails does.
            let matDetails = [];
            //First we assume that we can craft. If we come accross unavailable mat, then it will be set to false.
            let canCraft = true;
            //Keep track of quantity of mats.
            let qty = 0;
            //Go through each mat
            mats.forEach( mat => {
            //if our last mat is equal to the mat we are currently processing, then take away 1 quantity
            //otherwise, look into invy and get the current item quantity of this particular mat.
                qty = (lastMat === mat) ? qty-1 : this.inventory.getItemQuantity(mat);
            //saying that a mat is available if quantity > 0.
                let available = (qty > 0);
            //push this info onto the matDetails array. Push the name,frame, and availability of the mat.
                matDetails.push({name:mat, frame:items[mat].frame, available});
            //track last mat
            lastMat = mat;
            //if ever the last mat is not available, then we can't craft.
            if(!available) canCraft = false;
            });
            //This is pushing all this information onto our list of craftable items.
            //Ex: pickaxe, frame needed to draw the pickaxe, all the mat details for the pickaxe, and the canCraft boolean.
            this.items.push({name:itemName, frame:items[itemName].frame, matDetails, canCraft});
        }
        console.log(this.items);
    }
}