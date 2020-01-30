
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
		
	};
	
	this.update = function () {
		
		// Altera o �ngulo da imagem a todo quadro.
		dude.angle = dude.angle + 1;
		
		// Outros atributos comuns:
		// dude.alpha (de 0 a 1)
		// dude.x (em pixels)
		// dude.y (em pixels)
		// dude.anchor.x (de 0 a 1, onde 0 � esquerda e 1 � direita)
		// dude.anchor.y (de 0 a 1, onde 0 � cima e 1 � baixo)
		// dude.scale.x (qualquer valor, onde 1 = 100% e negativo espelha)
		// dude.scale.y (qualquer valor, onde 1 = 100% e negativo espelha)
		
		// Mais atributos de sprites:
		// https://phaser.io/docs/2.6.2/Phaser.Sprite.html
		
	};
	
}
