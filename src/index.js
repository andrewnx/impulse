import Phaser from "phaser";
import logoImg from "./assets/logo.png";

// Define the preload function
function preload() {
  this.load.spritesheet("dragon", "assets/dragon.png", {
    frameWidth: 72,
    frameHeight: 72,
  });
  this.load.spritesheet("bat", "assets/bat.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
}

// Define the create function
function create() {
  this.add.image(400, 300, "background");

  const logo = this.add.image(400, 150, "logo");

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1,
  });

  let dragon = this.physics.add.sprite(400, 300, "dragon");
  let bat = this.physics.add.sprite(200, 200, "bat");
}

// Define the update function
function update() {
  // Create and play a flying animation for the dragon sprite
  this.anims.create({
    key: "dragon-fly",
    frames: this.anims.generateFrameNumbers("dragon", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  dragon.play("dragon-fly");

  // Create and play a flying animation for the bat sprite
  this.anims.create({
    key: "bat-fly",
    frames: this.anims.generateFrameNumbers("bat", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  bat.play("bat-fly");
}

// Create the config object
const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [preload, create, update], // Modify the scene property to include the update function
};

// Create the game instance
const game = new Phaser.Game(config);
