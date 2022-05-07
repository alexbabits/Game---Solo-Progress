import items from "./Items.js";

export default class Inventory {
    constructor(){
        this.maxColumns = 4;
        this.maxRows = 4;
        this.selected = 0;
        //create our observers array
        this.observers = [];
        this.items = {
            0: {name: "pickaxe", quantity: 1},
            2: {name: "stone", quantity: 3}
        }
    //temporary attempt to add a few pickaxes.
        this.addItem({name: "pickaxe", quantity: 68});
    };

    /* We use an observer pattern, which allows other parts of our code to subscribe to our inventory.js model.
    I want to observe the inventory and if things get added/removed to the inventory, I want to know about it.
    So we will be able to refresh the UI! */

    subscribe(fn) {
    /* We call the subscribers observers, and keep a simple array of observers.
    Anything that wants to subscribe to the inventory will pass in a function, 
    and any function that is in our observer array will get run - anytime the inventory is updated.*/
        this.observers.push(fn);
    }
    unsubscribe(fn) {
    //This will remove the specified function from the observer list.
        this.observers = this.observers.filter(subscriber => subscriber !== fn);
    }

    //This method will run all the functions in our list of observers.
    //We will call this method (broadcast) to any other method that changes our inventory.
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
        //calling broadcast because this changes our inventory.
        this.broadcast();
    }

    getItem(index) {
        return this.items[index];
    };

    moveItem(start, end){
    console.log(`start${start} end${end}`);
        if(start === end || this.items[end]) return;
        this.items[end] = this.items[start];
        delete this.items[start];
        //calling broadcast because this changes our inventory.
        this.broadcast();
    }

    /*
    get SelectedItem() {
        return this.items[this.selected];
    }

    getItemFrame(item) {
        return items[item.name].frame;
    }
    */

};
