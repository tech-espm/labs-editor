
function menu() {
	
	var tecla;
	var horaParaAProximaAcao;
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
		
		// Cria um objeto para tratar a barra de espaços, mas
		// *não* atribui uma função para ser executada quando a
		// tecla for pressionada (diferente do exemplo anterior).
		//
		// Mais atributos e métodos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais teclas disponíveis:
		// https://phaser.io/docs/2.6.2/Phaser.KeyCode.html
		//
		// Mais atributos e métodos do teclado (game.input.keyboard.xxx):
		// http://phaser.io/docs/2.6.2/Phaser.Keyboard.html
		//
		// Mais atributos e métodos das teclas (tecla.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Key.html
		tecla = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		
		// Adiciona o sprite na coordenada (20, 100) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Diferença entre sprites e imagens no Phaser 2: imagens
		// não podem ter animação nem física!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		dude = game.add.sprite(20, 100, "dude");
		
		// Para que a ação não ocorra apenas no momento em que a
		// tecla foi pressionada, mas também não aconteça em todos
		// os quadros, vamos utilizar o horário do jogo, dado em
		// milissegundos, como cadenciador. Muito útil em jogos
		// que têm tiros ou outros eventos espaçados por tempo.
		horaParaAProximaAcao = game.time.now;
		
	};
	
	this.update = function () {
		
		var agora = game.time.now;
		
		// Neste exemplo, a ação será executada sempre que a tecla
		// estiver pressionada, mas apenas se já tiver passado o
		// intervalo de tempo desejado. No nosso caso, a ação deve
		// ser executada a cada 300 milissegundos.
		if (tecla.isDown && agora >= horaParaAProximaAcao) {
			dude.angle = dude.angle + 20;
			
			horaParaAProximaAcao = agora + 300;
		}
		
	};
	
}
