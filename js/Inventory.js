export default class Inventory {
    constructor(){
        this.maxColumns = 4;
        this.maxRows = 4;
        this.selected = 0;
        this.observers = [];
        this.items = {
            0: {name: "pickaxe", quantity: 1},
            2: {name: "stone", quantity: 1}
        }

        this.addItem({name: "pickaxe", quantity: 1});
        this.addItem({name: "wood", quantity: 1});
    };

    subscribe(fn) {
        this.observers.push(fn);
    }
    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn);
    }

    broadcast() {
        this.observers.forEach(subscriber => subscriber());
    }

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
        this.broadcast();
    };

    removeItem(itemName){
        let existingKey = Object.keys(this.items).find(key => this.items[key].name === itemName);
        if(existingKey){
            this.items[existingKey].quantity--;
            if(this.items[existingKey].quantity <= 0) delete this.items[existingKey];
        }
        this.broadcast();
    };

    getItem(index) {
        return this.items[index];
    };

    moveItem(start, end){
    console.log(`start: ${start} end: ${end}`);
        if(start === end || this.items[end]) return;
        this.items[end] = this.items[start];
        delete this.items[start];
        this.broadcast();
    };

    getItemQuantity(itemName) {
        return Object.values(this.items).filter(i => i.name === itemName).map(i => i.quantity).reduce((accumulater, currentValue) => accumulater + currentValue, 0);
    };

        /*
    //selectedItem and getItemFrame have no use now, but could be used in the future for equipping items and getting their sprite.

    get selectedItem() {
    //This 'items' is the object in our constructor in Inventory.js (all our current items)
        return this.items[this.selected];
    }
    //pass it in the item, does a look up in items, looks up the name and returns the frame.
    //This 'items' is ALL the items found in items.js
    //If using this method, will need to import items.js!
    getItemFrame(item) {
        return items[item.name].frame;
    }
    */
   
};
