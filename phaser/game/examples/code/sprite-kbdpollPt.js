
function menu() {
	
	var tecla;
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
		
		// Cria um objeto para tratar a barra de espa�os, mas
		// *n�o* atribui uma fun��o para ser executada quando a
		// tecla for pressionada (diferente do exemplo anterior).
		//
		// Mais atributos e m�todos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais teclas dispon�veis:
		// https://phaser.io/docs/2.6.2/Phaser.KeyCode.html
		//
		// Mais atributos e m�todos do teclado (game.input.keyboard.xxx):
		// http://phaser.io/docs/2.6.2/Phaser.Keyboard.html
		//
		// Mais atributos e m�todos das teclas (tecla.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Key.html
		tecla = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		
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
		
		// Neste exemplo, a a��o ser� executada sempre que a tecla
		// estiver pressionada, e n�o apenas no momento em que ela
		// for pressionada, como no exemplo anterior.
		if (tecla.isDown) {
			dude.angle = dude.angle + 20;
		}
		
	};
	
}
