
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
		
		// Atribui uma fun��o para ser executada quando o bot�o
		// esquerdo do mouse for pressionado.
		//
		// Mais atributos e m�todos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais atributos e m�todos do mouse (game.input.mousePointer.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Pointer.html
		game.input.mousePointer.leftButton.onDown.add(acao);
		
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
		
		// Independente de ter clicado ou n�o, vamos deixar o sprite
		// sempre na posi��o do mouse, para demonstrar outros atributos.
		dude.x = game.input.mousePointer.x;
		dude.y = game.input.mousePointer.y;
		
	};
	
	function acao() {
		
		// Apenas altera o �ngulo do sprite quando o bot�o for
		// pressionado. Repare que manter o bot�o pressionado
		// n�o tem efeito (compare com o pr�ximo exemplo).
		dude.angle = dude.angle + 20;
		
	}
	
}
