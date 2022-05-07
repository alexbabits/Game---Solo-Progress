export default class InventoryScene extends Phaser.Scene {
    constructor(){
        super("InventoryScene");
        this.maxColumns = 4;
        this.maxRows = 10;
        //Starts off showing X rows.
        this.rows = 4;
        this.uiScale = 1.2;
        this.gridSpacing = 4;
        this.margin = 2;
        this._tileSize = 32;
        //An empty array of inventory slots so we can access the inventory slots we are creating
        this.inventorySlots = [];
    }

    //this method allows us to send the scene some data. We send it the MainScene's data.
    init(data){
        let { mainScene } = data;
        //this.mainScene = mainScene;
        //(below allows for easy access to the player's inventory.)
        //this.inventory = mainScene.player.inventory;
    };
    //We created this getter for our tile size, which takes into account our scale (properties assigned in the constructor).
    get tileSize() {
        return this._tileSize * this.uiScale;
    };

    /*This method actually shows our UI.
        (FOR THE FUTURE WHEN WE HAVE TOGGLE)
        - When the inventory is closed, we just show X many rows of the columns (maxColumns * rows).
        - But if it's opened, we'll show the max number of rows = (maxColumns * maxRows).
    */

    refresh() {
        for (let index = 0; index < this.maxColumns * this.rows; index++) {
            /*  -For example, we offset our x by 640 (config width) minus the number of columns, times their tile size with margin.
                -Then, to have the tiles not all spawn on the same place we have to add the following:
                -(index * (this.tileSize + this.gridSpacing));
                -Then, to get them to wrap around, we want that index to go from 0 to 8 (maxColumns) and then back to 0 again.
                -We use the modulus (%) to do this, returning the remainder via (index % this.maxColumns)
                -Index is going from 0 to (max columns * rows). So (index % this.maxColumns) really means ((max columns * rows) % max columns) 
                -However, this isn't exactly wrapping them vertically down, it's just re-iterating over the first 8 tiles though now.
                -The y coordinate will help actually move them down vertically as they are iterated.
            */
            let x = (640 - (this.maxColumns * (this.tileSize + this.margin))) + ((index % this.maxColumns) * (this.tileSize + this.gridSpacing));

            /*
                -We offset our y by 640 (config height) minus the number of rows, times their tile size with margin.
                -Our y wants to increase from 0 to 2 (1-3), so we can do Math.floor(index/this.maxColumns);
                -This is brilliant because in our for loop, index is essentially 'max columns' * 'rows'. 
                -So when we do the floor of 'index/max columns' it's really just starting at zero, then ending up towards the number of 'rows'
                -(max columns * rows / max columns) = rows.
                -Then we multiply the same thing (this.tileSize + this.gridSpacing)
            */
            let y = (640 - (this.rows * (this.tileSize + this.margin))) + (Math.floor(index/this.maxColumns) * (this.tileSize + this.gridSpacing));

            //This adds our inventory square sprite ("items" is the spritesheet we added in Player.js, x, y are shown above, 11 is it's position in the spritesheet).
            let inventorySlot = this.add.sprite(x, y, "items", 11);
            //Scale up our inventory slot
            inventorySlot.setScale(this.uiScale);
        }
    };

    //Simply calling our refresh method we made for the inventory in our create method.
    create() {
        this.refresh();
    };

};


//this.margin + this.tileSize / 2