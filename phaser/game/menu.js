var levels = ["menu"];
var gameWidth = 800;
var gameHeight = 600;

function menu() {
	var jogador;
	var plataformas;
	var setas;
	var botaoPulo;

	this.preload = function () {

		game.stage.backgroundColor = '#85b5e1';

		game.load.baseURL = 'http://examples.phaser.io/assets/';
		game.load.crossOrigin = 'anonymous';

		game.load.image('jogador', 'sprites/phaser-dude.png');
		game.load.image('plataforma', 'sprites/platform.png');
	}

	this.create = function () {

		jogador = game.add.sprite(100, 200, "jogador");

		game.physics.arcade.enable(jogador);

		jogador.body.collideWorldBounds = true;
		jogador.body.gravity.y = 500;

		plataformas = game.add.physicsGroup();

		plataformas.create(500, 150, "plataforma");
		plataformas.create(-200, 300, "plataforma");
		plataformas.create(400, 450, "plataforma");

		plataformas.setAll("body.immovable", true);

		setas = game.input.keyboard.createCursorKeys();
		botaoPulo = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	}

	this.update = function () {

		game.physics.arcade.collide(jogador, plataformas);

		jogador.body.velocity.x = 0;

		if (setas.left.isDown) {
			jogador.body.velocity.x = -250;
		} else if (setas.right.isDown) {
			jogador.body.velocity.x = 250;
		}

		if (botaoPulo.isDown && (jogador.body.onFloor() || jogador.body.touching.down)) {
			jogador.body.velocity.y = -400;
		}

	}
}
