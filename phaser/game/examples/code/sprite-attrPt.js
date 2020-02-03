
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
		
	};
	
	this.update = function () {
		
		// Altera o ângulo da imagem a todo quadro.
		dude.angle = dude.angle + 1;
		
		// Outros atributos comuns:
		// dude.alpha (de 0 a 1)
		// dude.x (em pixels)
		// dude.y (em pixels)
		// dude.anchor.x (de 0 a 1, onde 0 é esquerda e 1 é direita)
		// dude.anchor.y (de 0 a 1, onde 0 é cima e 1 é baixo)
		// dude.scale.x (qualquer valor, onde 1 = 100% e negativo espelha)
		// dude.scale.y (qualquer valor, onde 1 = 100% e negativo espelha)
		
		// Mais atributos de sprites:
		// https://phaser.io/docs/2.6.2/Phaser.Sprite.html
		
	};
	
}
