
function menu() {
	
	var setas;
	var teclaPulo;
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
		
		// Cria um objeto para tratar as teclas direcionais
		// do teclado (cima, baixo, esquerda, direita).
		//
		// Mais atributos e m�todos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais atributos e m�todos do teclado (game.input.keyboard.xxx):
		// http://phaser.io/docs/2.6.2/Phaser.Keyboard.html
		setas = game.input.keyboard.createCursorKeys();
		
		// Cria um objeto para tratar a barra de espa�os, e
		// atribui uma fun��o para ser executada quando a
		// tecla for pressionada.
		//
		// Mais teclas dispon�veis:
		// https://phaser.io/docs/2.6.2/Phaser.KeyCode.html
		//
		// Mais atributos e m�todos das teclas (tecla.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Key.html
		teclaPulo = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		teclaPulo.onDown.add(pular);
		
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
		
		// Cria tr�s anima��es chamadas "esquerda", "parado" e "direita"
		// para o sprite, com seus respectivos quadros, a uma velocidade
		// de 8 quadros por segundo, repetindo para sempre.
		dude.animations.add("esquerda", [0, 1, 2, 3], 8, true);
		dude.animations.add("parado", [4], 1, true);
		dude.animations.add("direita", [5, 6, 7, 8], 8, true);
		// Inicia a anima��o "parado".
		dude.animations.play("parado");
		
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
		// Configura a velocidade horizontal m�xima do sprite,
		// porque agora iremos trabalhar com a acelera��o do
		// sprite, sem alterar sua velocidade diretamente.
		dude.body.maxVelocity.x = 1000;
		// Configura o arrasto/desacelera��o horizontal do sprite.
		dude.body.drag.x = 2000;
		
		// Outros atributos comuns de body:
		// dude.body.velocity.x (em pixels/s)
		// dude.body.velocity.y (em pixels/s)
		// dude.body.acceleration.x (em pixels/s�)
		// dude.body.acceleration.y (em pixels/s�)
		// dude.body.drag.y (arrasto/desacelera��o em pixels/s�)
		// dude.body.maxVelocity.y (em pixels/s)
		//
		// Mais atributos e m�todos de body (dude.body.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.Body.html
		//
		// Mais informa��es relacionados � f�sica de arcade:
		// https://phaser.io/docs/2.6.2/index#arcadephysics
		
	};
	
	this.update = function () {
		
		// Controle de movimentos simples. Se a seta esquerda estiver
		// pressionada, aplica uma acelera��o negativa (esquerda) ao
		// o sprite. Se a seta direita estiver pressionada, aplica uma
		// acelera��o positiva (direita) ao sprite. Se nenhuma tecla
		// estiver pressionada, remove a acelera��o do sprite, deixando
		// que o arrasto/desacelera��o (drag) pare o sprite.
		//
		// Al�m disso, define a anima��o correta do sprite dependendo
		// da seta que estiver pressionada.
		if (setas.left.isDown) {
			dude.body.acceleration.x = -3000;
			dude.animations.play("esquerda");
		} else {
			if (setas.right.isDown) {
				dude.body.acceleration.x = 3000;
				dude.animations.play("direita");
			} else {
				dude.body.acceleration.x = 0;
				dude.animations.play("parado");
			}
		}
		
		// Poder�amos tamb�m alterar a anima��o do sprite n�o apenas com
		// base no teclado, mas com base em sua velocidade, ou uma combina��o
		// de ambos! :)
		
	};
	
	function pular() {
		// Pular significa aplicar a um sprite uma velocidade para cima
		// (negativa). Contudo, s� podemos deixar que o jogador pule se
		// o sprite estiver sobre o ch�o. Se bem que... alguns jogos
		// deixam que o jogador pule mesmo no ar... ;)
		if (dude.body.onFloor() || dude.body.touching.down) {
			dude.body.velocity.y = -500;
		}
	}
	
}
