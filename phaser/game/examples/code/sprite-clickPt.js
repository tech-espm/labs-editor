
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
		
		// Habilita que o sprite seja clicado.
		dude.inputEnabled = true;
		// Altera o cursor do mouse quando ele estiver sobre
		// o sprite.
		dude.input.useHandCursor = true;
		// Diz qual função deve ser executada quando o sprite
		// for clicado.
		dude.events.onInputDown.add(dudeFoiClicado);
		
	};
	
	this.update = function () {
		
	};
	
	function dudeFoiClicado() {
		
		// Vamos apenas trocar o fundo do jogo quando o sprite
		// for clicado.
		game.stage.backgroundColor = "#00ff00";
		
	}
	
}
