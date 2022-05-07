export default class Inventory {
    constructor(){
        this.maxColumns = 4;
        this.maxRows = 4;
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

    //method to move a clicked item's index.
    moveItem(start, end){
    //We just want to handle the case where our start and end are equal, or drag into a slot that already has an item.
    //In both cases, we don't want to do anything, just return
    if(start === end || this.items[end]) return;
    //simply assigning the item's end index to the items start.
        this.items[end] = this.items[start];
    //and make sure we delete the item at the start so only the end remains.
    delete this.items[start];

    //console log the start and end to see what's going on.
    console.log(`start${start} end${end}`);
    }

};
