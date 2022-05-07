export default class Inventory {
    constructor(){
        this.maxColumns = 4;
        this.maxRows = 4;
    //could make this type of inventory an array, but making it object based via key-value pairs is fine.
    //An object that maps inventory slots to items and the quantity of items in that slot.
        this.items = {
    //example key:value pairs, where the number is the slot index, and the value is the name from items.js and the quantity.
            0: {name: "pickaxe", quantity: 1},
            2: {name: "stone", quantity: 3}
        }
    //temporary attempt to add a few pickaxes.
        this.addItem({name: "pickaxe", quantity: 68});
    };

    //addItem method will: We want to be able to add items to our inventory rather than just spawning them in at the start.
    //First we add the case where there's already an existing object, and we are just adding more
    //Then we add the case if the item doesn't exist, then put it in the first available slot.

    addItem(item){
    //We use object.keys to take a look at all the key-value pairs in our constructor.
    //For the object which is 'this.items', and we want to find the key such that the item name matches.
        let existingKey = Object.keys(this.items).find(key => this.items[key].name === item.name);
    //If it successfully found the key for the object,
        if(existingKey) {
    //then add that existing key and it's quantity of the items we are trying to add.
            this.items[existingKey].quantity += item.quantity;
    //If it did not successfully find the key (no current pickaxe or whatever item found)
        } else {
    //then for each index, find the first available slot in our inventory, and stick the item in there.
            for (let index = 0; index < this.maxColumns * this.maxRows; index++) {
    //If there's an existing item in each of the inventory slots,
                let existingItem = this.items[index];
    //The first slot that doesn't have an existing item,
                if(!existingItem){
    //Then put an item in that slot, and immediately jump out of the loop with break;
                    this.items[index] = item;
                    break;
                }
            }
        }
    };

    //Get item method that takes the index (slot number of inventory) and returns the item.
    //EX: For index 0, return pickaxe.
    getItem(index) {
        return this.items[index];
    };

};
