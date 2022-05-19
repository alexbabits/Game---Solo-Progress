import ControlsScene from "./ControlsScene.js";
import CraftingScene from "./CraftingScene.js";
import InventoryScene from "./InventoryScene.js";
import MainScene from "./MainScene.js";
import StartScene from "./StartScene.js";

const config = {
  width:640,
  height:640,
  backgroundColor: '#70491d',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[StartScene, ControlsScene, MainScene, InventoryScene, CraftingScene],
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