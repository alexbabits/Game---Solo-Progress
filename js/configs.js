import CraftingScene from "./CraftingScene.js";
import InventoryScene from "./InventoryScene.js";
import MainScene from "./MainScene.js";
import map2 from "./map2.js";
import StartScene from "./StartScene.js";

const config = {
  width:640,
  height:640,
  backgroundColor: '#999999',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[StartScene, MainScene, map2, InventoryScene, CraftingScene],
  scale: {
    zoom:1.4,
  },
  physics: {
    default: 'matter',
    matter: {
      debug:true,
      gravity:{y:0},
    }
  },
  plugins: {
    scene:[
      {
        plugin: PhaserMatterCollisionPlugin.default,
        key: 'matterCollision',
        mapping: 'matterCollision'
      }
    ]
  }
}

new Phaser.Game(config);