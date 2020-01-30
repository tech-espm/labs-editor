
function menu() {
	
	var dude;
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#0066ff";
		
		// Carrega a imagem de um sprite (o primeiro par�metro � como
		// n�s iremos chamar a imagem no nosso jogo, e os dois �ltimos
		// s�o a largura e a altura de cada quadro na imagem, em pixels).
		//
		// Para entender mehor, conv�m abrir a imagem em uma aba nova:
		// http://tech-espm.github.io/labs-editor/phaser/game/examples/assets/dude.png
		game.load.spritesheet("dude", "examples/assets/dude.png", 32, 48);
		
	};
	
	this.create = function () {
		
		// Adiciona o sprite na coordenada (20, 100) da tela,
		// lembrando que (0, 0) est� no canto superior esquerdo!
		//
		// Diferen�a entre sprites e imagens no Phaser 2: imagens
		// n�o podem ter anima��o nem f�sica!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma vari�vel.
		dude = game.add.sprite(20, 100, "dude");
		
		// Habilita o motor de f�sica tradicional.
		game.physics.arcade.enable(dude);
		
		// Previne que o sprite saia da tela.
		dude.body.collideWorldBounds = true;
		// Configura a gravidade (em pixels/s�) aplicada ao sprite,
		// lembrando que valores positivos apontam para baixo!
		dude.body.gravity.y = 800;
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele ter� quando
		// colidir com algum obst�culo.
		dude.body.bounce.x = 0.5;
		dude.body.bounce.y = 0.5;
		
		// Outros atributos comuns de body:
		// dude.body.velocity.x (em pixels/s)
		// dude.body.velocity.y (em pixels/s)
		// dude.body.acceleration.x (em pixels/s�)
		// dude.body.acceleration.y (em pixels/s�)
		// dude.body.drag.x (arrasto/desacelera��o em pixels/s�)
		// dude.body.drag.y (arrasto/desacelera��o em pixels/s�)
		// dude.body.maxVelocity.x (em pixels/s)
		// dude.body.maxVelocity.y (em pixels/s)
		//
		// Mais atributos e m�todos de body (dude.body.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.Body.html
		//
		// Mais informa��es relacionados � f�sica de arcade:
		// https://phaser.io/docs/2.6.2/index#arcadephysics
		
	};
	
	this.update = function () {
		
	};
	
}
