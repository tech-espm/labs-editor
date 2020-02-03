
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
		
		// Atribui uma função para ser executada quando o botão
		// esquerdo do mouse for pressionado.
		//
		// Mais atributos e métodos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais atributos e métodos do mouse (game.input.mousePointer.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Pointer.html
		game.input.mousePointer.leftButton.onDown.add(acao);
		
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
		
		// Independente de ter clicado ou não, vamos deixar o sprite
		// sempre na posição do mouse, para demonstrar outros atributos.
		dude.x = game.input.mousePointer.x;
		dude.y = game.input.mousePointer.y;
		
	};
	
	function acao() {
		
		// Apenas altera o ângulo do sprite quando o botão for
		// pressionado. Repare que manter o botão pressionado
		// não tem efeito (compare com o próximo exemplo).
		dude.angle = dude.angle + 20;
		
	}
	
}
