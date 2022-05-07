import items from "./Items.js";

export default class Inventory {
    constructor(){
        this.maxColumns = 4;
        this.maxRows = 4;
        //this defaults selected to the zero index in our inventory.
        this.selected = 0;
        this.items = {
            0: {name: "pickaxe", quantity: 1},
            2: {name: "stone", quantity: 3}
        }
    //temporary attempt to add a few pickaxes.
        this.addItem({name: "pickaxe", quantity: 68});
    };

    addItem(item){
        let existingKey = Object.keys(this.items).find(key => this.items[key].name === item.name);
        if(existingKey) {
            this.items[existingKey].quantity += item.quantity;
        } else {
            for (let index = 0; index < this.maxColumns * this.maxRows; index++) {
                let existingItem = this.items[index];
                    if(!existingItem){
                        this.items[index] = item;
                            break;
                }
            }
        }
    };

    getItem(index) {
        return this.items[index];
    };

    moveItem(start, end){
    if(start === end || this.items[end]) return;
        this.items[end] = this.items[start];
        delete this.items[start];
        console.log(`start${start} end${end}`);
    }

    //getter to get the selected item, no use now but could be used to equip things in the future.
    get SelectedItem() {
    //this 'items' refers to everything in our inventory
        return this.items[this.selected];
    }

    //method to get the item's frame, no use now, but could be used to show the item equipped.
    getItemFrame(item) {
    //this returns the frame based on the items name.
    //this 'items' refers to ALL items that are listed in items.js
        return items[item.name].frame;
    }

};
