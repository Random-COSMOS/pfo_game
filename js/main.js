playState = {};

function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 0.5)
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
}

Hero.prototype.constructor = Hero;

playState.init = function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT
    })
}

playState.preload = function () {
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('hero', 'images/hero_stopped.png')
    this.game.load.json('level:1', 'data/level02.json');
}

playState.create = function () {
    this.game.add.image(0, 0, 'background');
    this._loadlevel(this.game.cache.getJSON('level:1'));
}

playState._loadlevel = function (data) {
    data.platforms.forEach(this._spawnPlatform, this)
    this._spawnCharacters({
        hero: data.hero
    });
}

playState._spawnPlatform = function (platform) {
    this.game.add.sprite(platform.x, platform.y, platform.image);
};

playState._spawnCharacters = function (data) {
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

playState._handelInput = function () {
    if (this.keys.left.isDown) {
        this.hero.move(-1);
    } else if (this.keys.right.isDown) {
        this.hero.move(1);
    }else {
        this.hero.move(0);
    }
}

playState.update = function () {
    this._handelInput();
}

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', playState);
    game.state.start('play');
};