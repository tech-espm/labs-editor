
function menu() {
	
	var dude;
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#0066ff";
		
		// Carrega a imagem de um sprite (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo, e os dois últimos
		// são a largura e a altura de cada quadro na imagem, em pixels).
		//
		// Para entender mehor, convém abrir a imagem em uma aba nova:
		// http://tech-espm.github.io/labs-editor/phaser/game/examples/assets/dude.png
		game.load.spritesheet("dude", "examples/assets/dude.png", 32, 48);
		
	};
	
	this.create = function () {
		
		// Adiciona o sprite na coordenada (20, 100) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Diferença entre sprites e imagens no Phaser 2: imagens
		// não podem ter animação nem física!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		dude = game.add.sprite(20, 100, "dude");
		
		// Habilita o motor de física tradicional.
		game.physics.arcade.enable(dude);
		
		// Previne que o sprite saia da tela.
		dude.body.collideWorldBounds = true;
		// Configura a gravidade (em pixels/s²) aplicada ao sprite,
		// lembrando que valores positivos apontam para baixo!
		dude.body.gravity.y = 800;
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele terá quando
		// colidir com algum obstáculo.
		dude.body.bounce.x = 0.5;
		dude.body.bounce.y = 0;
		
		// Outros atributos comuns de body:
		// dude.body.velocity.x (em pixels/s)
		// dude.body.velocity.y (em pixels/s)
		// dude.body.acceleration.x (em pixels/s²)
		// dude.body.acceleration.y (em pixels/s²)
		// dude.body.drag.x (arrasto/desaceleração em pixels/s²)
		// dude.body.drag.y (arrasto/desaceleração em pixels/s²)
		// dude.body.maxVelocity.x (em pixels/s)
		// dude.body.maxVelocity.y (em pixels/s)
		//
		// Mais atributos e métodos de body (dude.body.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.Body.html
		//
		// Mais informações relacionados à física de arcade:
		// https://phaser.io/docs/2.6.2/index#arcadephysics
		
	};
	
	this.update = function () {
		
	};
	
}
