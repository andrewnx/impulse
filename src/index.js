import Phaser from "phaser";

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
  this.load.image("background", "assets/background.png");
  this.load.image("point", "assets/point.png");
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

  // Create the dragon, the bats, and the points
  var dragon = this.matter.add.sprite(400, 300, "dragon");
  var bats = this.matter.add.group();
  var points = this.matter.add.group();

  // Set the collision categories for the game objects
  var dragonCategory = this.matter.world.nextCategory();
  var batCategory = this.matter.world.nextCategory();
  var pointCategory = this.matter.world.nextCategory();
  var wallCategory = this.matter.world.nextCategory();

  // Set the collision masks for the game objects
  dragon.setCollisionCategory(dragonCategory);
  dragon.setCollidesWith([wallCategory, pointCategory]);
  bats.setCollisionCategory(batCategory);
  bats.setCollidesWith([wallCategory, batCategory]);
  points.setCollisionCategory(pointCategory);
  points.setCollidesWith([wallCategory, dragonCategory]);

  // Create the walls and set their collision category
  var walls = this.matter.add.rectangle(400, 300, 800, 600, { isStatic: true });
  walls.setCollisionCategory(wallCategory);

  // Set the friction and air resistance for the dragon
  dragon.setFriction(0.05);
  dragon.setFrictionAir(0.01);

  // Create a text object to display the score
  var scoreText = this.add.text(400, 50, "Score: 0", {
    fontSize: "32px",
    fill: "#ffffff",
  });
  scoreText.setOrigin(0.5, 0.5);

  // Initialize the score variable
  var score = 0;

  // Add a pointerdown event listener to apply an impulse to the dragon
  this.input.on("pointerdown", function (pointer) {
    // Calculate the angle and distance between the pointer and the dragon
    var angle = Phaser.Math.Angle.Between(
      pointer.x,
      pointer.y,
      dragon.x,
      dragon.y
    );
    var distance = Phaser.Math.Distance.Between(
      pointer.x,
      pointer.y,
      dragon.x,
      dragon.y
    );

    // Calculate the force vector based on the angle and distance
    var force = Phaser.Math.Clamp(distance / 100, 0.1, 0.5);
    var forceX = Math.cos(angle) * force;
    var forceY = Math.sin(angle) * force;

    // Apply the force to the dragon
    dragon.applyForce({ x: forceX, y: forceY });
  });

  // Add a collisionStart event listener to handle the collisions
  this.matter.world.on(
    "collisionStart",
    function (event) {
      // Loop through the pairs of colliding bodies
      for (var i = 0; i < event.pairs.length; i++) {
        var bodyA = event.pairs[i].bodyA;
        var bodyB = event.pairs[i].bodyB;

        // Check if the dragon collides with a point
        if (
          (bodyA === dragon.body && bodyB.parent === points) ||
          (bodyA.parent === points && bodyB === dragon.body)
        ) {
          // Increase the score by one
          score++;

          // Update the score text
          scoreText.setText("Score: " + score);

          // Destroy the point
          if (bodyA === dragon.body) {
            bodyB.gameObject.destroy();
          } else {
            bodyA.gameObject.destroy();
          }
        }

        // Check if the dragon collides with a bat
        if (
          (bodyA === dragon.body && bodyB.parent === bats) ||
          (bodyA.parent === bats && bodyB === dragon.body)
        ) {
          // End the game
          this.scene.start("GameOverScene", { score: score });
        }
      }
    },
    this
  );
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
