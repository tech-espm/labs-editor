
function menu() {
	
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
		game.add.sprite(20, 100, "dude");
		
	};
	
	this.update = function () {
		
	};
	
}
