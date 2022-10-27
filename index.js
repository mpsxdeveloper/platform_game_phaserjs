class MenuScene extends Phaser.Scene {

    constructor() {
        super("menu");        
    }

    preload() {
        this.load.image('screen', 'assets/background.png');
        this.load.image('robot', 'assets/character_robot_idle.png');
        this.load.image('crate42', 'assets/crate_42.png');
        this.load.image('crate44', 'assets/crate_44.png');
        this.load.image('start', 'assets/flatDark41.png');
        this.load.image('spark', 'assets/spark.png');
    }

    create() {
        this.add.image(400, 300, 'screen');
        var robot = this.physics.add.sprite(750, -1000, 'robot');        
        var crate42 = this.physics.add.sprite(750, 400, 'crate42');        
        crate42.body.setAllowGravity(false);
        crate42.setImmovable(true);
        this.physics.add.collider(robot, crate42, this.moveRobot);
        this.add.sprite(74, 400, 'crate44');
        this.add.sprite(74, 336, 'crate44');
        this.add.sprite(74, 272, 'crate44');
        this.add.sprite(138, 400, 'crate44');
        this.add.sprite(138, 336, 'crate44');
        this.add.sprite(138, 272, 'crate44');
        this.add.sprite(202, 400, 'crate44');
        this.add.sprite(202, 336, 'crate44');
        this.add.sprite(202, 272, 'crate44');
        const button = this.add.sprite(400, 500, 'start')
            .setInteractive()
            .on('pointerdown', function() {
                this.scene.switch('Level1', Level1Scene, true, { x: 400, y: 200 });}, this)
            .on('pointerup', () => button.setScale( 1 ));
            var text = this.add.text(400, 100, "Platform 2D Game", {fontSize: 52,color: "#000000",fontStyle: "bold"}).setOrigin(0.5);
    
         var particles = this.add.particles('spark');
        
        this.tweens.add({
            targets: crate42,
            delay: 1000,
            x: 268,
            ease: 'Power1',
            duration: 3000,
            onComplete: this.onCompleteHandler,
            onCompleteParams: [crate42, particles]
        });
    
    }
    
    onCompleteHandler (tween, targets, crate, p) {
        crate.destroy();        
        var emitter = p.createEmitter();
        emitter.setPosition(268, 400);
        emitter.setSpeed(200);
        //emitter.setBlendMode(Phaser.BlendModes.ADD);
    }
    
    moveRobot(robot, crate) {
        robot.x = crate.x;
    }

}

class Level1Scene extends Phaser.Scene {
    
    constructor() {
        super("Level1");
    }
    
    preload() {
        this.load.image('dlgbox', 'assets/platformIndustrial_111.png');
        this.load.image('instructor', 'assets/headFocus.png');
        this.load.image('robot', 'assets/head.png');
        this.load.image('ground', 'assets/platformerPack_industrial_tilesheet.png');
        this.load.image('background', 'assets/platformerPack_industrial_tilesheet.png');
        this.load.image('door', 'assets/platformerPack_industrial_tilesheet.png');
        this.load.image('mycoins', 'assets/coin.png');
        // Coins
        this.load.spritesheet('coin', 'assets/coin.png', { frameWidth: 32, frameHeight: 32 });
        // Enemies
        this.load.spritesheet('enemies', 'assets/enemies_spritesheet.png', {frameWidth: 128, frameHeight: 128});
        // Map and player
        this.load.tilemapTiledJSON('map', 'assets/mapa.json');
        this.load.spritesheet('player', 'assets/character_robot_sheet.png', {frameWidth: 96, frameHeight: 128});
    }
    
    create() {
        
        map = this.add.tilemap('map');

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var groundTiles = map.addTilesetImage('ground_tileset', 'ground');
        var backgroundTiles = map.addTilesetImage('ground_tileset', 'background');
        var doorTiles = map.addTilesetImage('ground_tileset', 'door');

        // You can load a layer from the map using the layer name from Tiled ('Ground' in this case), or
        // by using the layer index. Since we are going to be manipulating the map, this needs to be a
        // dynamic tilemap layer, not a static one.
        var ground = map.createDynamicLayer('ground_layer', groundTiles, 0, 0).setDepth(5);
        var background = map.createDynamicLayer('background_layer', backgroundTiles, 0, 0);
        var door = map.createStaticLayer('door_layer', doorTiles, 0, 0);
        
        /*
        
        var mushroomsArray = map.createFromObjects('coins_layer', 9, {key: 'coins'});
        console.log(mushroomsArray.length);
        for (var i = 0; i < mushroomsArray.length; i++)
        {       
            mushroomsGroup.add(mushroomsArray[i]);
            mushroomsArray[i].body.collideWorldBounds=true;    
        }
        */
       
    this.moedas = this.physics.add.group();   
    this.moedas.addMultiple(
        map.createFromObjects('layer_coins', 'moedinhas', { key: 'coin' })
    );
    this.physics.world.enable(this.moedas);
    this.moedas.getChildren().forEach(function(child) {
        //child.setFrame(1);
        //child.setOrigin(0,0);
        child.body.setAllowGravity(false);
    }, this);
    
    this.barnacles = this.physics.add.group();   
    this.barnacles.addMultiple(
        map.createFromObjects('enemies_layer', 'barnacle', { key: 'enemies' })
    );
    
    this.slimes = this.physics.add.group();   
    this.slimes.addMultiple(
        map.createFromObjects('enemies_layer', 'slime', { key: 'enemies' })
    );
    
    // this.physics.world.enable(this.barnacles);
    
    this.barnacles.getChildren().forEach(function(barnacle) {
        barnacle.setFrame(1);
        barnacle.setOrigin(1.5,0);
        barnacle.setScale(.5);
        barnacle.body.setAllowGravity(false);
    }, this);
    
    this.slimes.getChildren().forEach(function(slime) {
        slime.setFrame(9);
        slime.setOrigin(1.5,0);
        slime.setScale(.5);
        slime.body.setAllowGravity(true);
    }, this);
        

        ground.setCollisionByProperty({'collides': true});
        door.setDepth(10);

        const spawnPoint = map.findObject(
            'player',
            objects => objects.name === 'player' 
        );

        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        // player.setCollideWorldBounds(true);
        player.setFrame(2);
        //player.setOrigin(0.5, 0.5);
        player.setSizeToFrame(2);

        this.physics.add.collider(player, ground, this.collideCheck);
        this.physics.add.collider(player, coins, this.collideCheck);
        this.physics.add.collider(this.slimes, ground, null);

        const anims = this.anims;

        // anim
        anims.create({
            key: "left",
            frameRate: 10,
            frames: this.anims.generateFrameNames("player", { start: 4, end: 11 }),
            repeat: -1
        });
        anims.create({
            key: "right",
            frameRate: 10,
            frames: this.anims.generateFrameNames("player", { start: 4, end: 11 }),
            repeat: -1
        });
        anims.create({
            key: "jump",
            frameRate: 8,
            frames: this.anims.generateFrameNames("player", { start: 3, end:  3}),
            repeat: 0
        });

        const camera = this.cameras.main;
        camera.startFollow(player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.time.addEvent({delay: 100, callback: this.delayDone, callbackScope: this, loop: false});
        
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 16,
            repeat: -1
        });
        
        this.anims.play('spin', this.moedas.getChildren());
        this.physics.add.overlap(player, this.moedas, this.coletarMoedas, null, this);
        
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('enemies', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'slimewalk',
            frames: this.anims.generateFrameNumbers('enemies', { frames: [9,12] }),
            frameRate: 4,
            repeat: -1
        });
        
        this.anims.play('walk', this.barnacles.getChildren());
        
        this.anims.play('slimewalk', this.slimes.getChildren());
        
        this.barnacles.getChildren().forEach(function(barnacle) {
            this.tweens.add({
                targets: barnacle,
                y: 360,
                duration: 1500,
                ease: 'Power2',
                repeat: 30,
                delay: 500,
                yoyo: true
            });
        }, this);
        
        
        
        scoreText = this.add.text(600, 10, 'Score: 0', { fontSize: '28px bold', fill: '#000' });
        scoreText.scrollFactorX = 0;
        scoreText.scrollFactorY = 0;
        
        // Dlg
        this.r2 = this.add.rectangle(4, 4, 793, 70, 0x9966ff).setOrigin(0);
        this.r2.setStrokeStyle(7, 0xefc53f);
        this.r2.scrollFactorX = 0;
        this.instrutor = this.add.sprite(10, 10, 'instructor').setOrigin(0);
        this.instrutor.scrollFactorX = 0;
        this.line1 = this.add.text(110, 12, 'Some text here', { fontSize: '22px bold Arial', fill: '#fff' });
        this.line1.scrollFactorX = 0;
        this.r2.visible = true;
        
        var timedEvent = this.time.delayedCall(7000, this.onDialogEvent, [], this);
        
    }
    
        update() {    

            const prevVelocity = player.body.velocity.clone();
            player.body.setVelocity(0);
            cursors = this.input.keyboard.createCursorKeys();
            if(cursors.left.isDown) {       
                player.setVelocityX(-120);      
            }
            else if(cursors.right.isDown) {
                player.setVelocityX(120);
            }
            if(cursors.up.isDown) {                
                if(!isJumping) {
                    isJumping = true;
                    player.setVelocityY(-5000);                    
                }
            }
            else if(cursors.down.isDown) {
                //player.setVelocityY(100);
            }

            if(cursors.left.isDown) {
                if(!wasFlipped) {
                    wasFlipped = true;
                    player.toggleFlipX();
                }                
                player.anims.play('left', true);
            }
            else if(cursors.right.isDown) {
                if(wasFlipped) {
                    wasFlipped = false;
                    player.toggleFlipX();
                }
                player.anims.play('right', true);
            }
            else if(cursors.up.isDown || isJumping) {
                player.anims.play('jump', true);
            }
            else {
                player.anims.stop();
                player.setFrame(2);
                if(prevVelocity.x < 0) {
                    //player.setTexture("player", "left");
                    //scoreText.x = player.x - 10;
                }
                else if(prevVelocity.x > 0) {
                    //player.setTexture("player", "right");
                    //scoreText.x = player.x + 10;
                }
            }
            
    }
    
    delayDone() {
        //player.setOrigin(1, 1);
        // player.setGravity(0, 700);
        player.body.setSize(player.width - 30, player.height, true);
    }
    
    collideCheck() {
        isJumping = false;
    }
    
    enemyCollideCheck() {
        if(bright) {
            bright = false;
        }
        else {
            bright = true;
        }
    }
    
    coletarMoedas(player, moeda) {
        moeda.destroy();
        score += 100;
        scoreText.setText('Score: ' + score);
    }
    
    onDialogEvent() {
        this.r2.destroy();
        this.line1.destroy();
        this.instrutor.destroy();
    }
    
}

var config = {
    type: Phaser.AUTO,
    parent: "main",
    width: 800,
    height: 560,
    backgroundColor: '#F2E7D4',
    scene: [MenuScene, Level1Scene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 4000
            },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
var map;
var player;
var barnacles;
var bright = true;
var cursors;
var wasFlipped = false;
var isJumping = false;
var coins;
var score = 0;
var scoreText;
