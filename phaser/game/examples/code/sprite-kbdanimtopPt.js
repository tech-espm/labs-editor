
function menu() {
	
	var setas;
	var dude;
	var ultimaDirecao;
	
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
		
		// Cria um objeto para tratar as teclas direcionais
		// do teclado (cima, baixo, esquerda, direita).
		//
		// Mais atributos e métodos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais atributos e métodos do teclado (game.input.keyboard.xxx):
		// http://phaser.io/docs/2.6.2/Phaser.Keyboard.html
		setas = game.input.keyboard.createCursorKeys();
		
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
		
		// Cria três animações chamadas "esquerda", "parado" e "direita"
		// para o sprite, com seus respectivos quadros, a uma velocidade
		// de 8 quadros por segundo, repetindo para sempre.
		dude.animations.add("esquerda", [0, 1, 2, 3], 8, true);
		dude.animations.add("parado", [4], 1, true);
		dude.animations.add("direita", [5, 6, 7, 8], 8, true);
		// Inicia a animação "parado".
		dude.animations.play("parado");
		
		// Previne que o sprite saia da tela.
		dude.body.collideWorldBounds = true;
		// Muito importante! Como aqui estamos falando de um jogo
		// "visto por cima", não faz sentido ter gravidade como nos
		// outros exemplos, que são "vistos pelo lado"!
		//dude.body.gravity.y = 800;
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele terá quando
		// colidir com algum obstáculo.
		dude.body.bounce.x = 0.5;
		dude.body.bounce.y = 0.5;
		// Configura a velocidade máxima do sprite, porque agora
		// iremos trabalhar com a aceleração do sprite, sem alterar
		// sua velocidade diretamente.
		dude.body.maxVelocity.x = 500;
		dude.body.maxVelocity.y = 500;
		// Configura o arrasto/desaceleração do sprite.
		dude.body.drag.x = 2000;
		dude.body.drag.y = 2000;
		// É comum assumir que as coordenadas x e y de um personagem
		// se refiram ao ponto inferior/central em jogos de plataforma,
		// o que pode facilitar os cálculos em alguns momentos.
		dude.anchor.x = 0.5;
		dude.anchor.y = 1;
		
		// Outros atributos comuns de body:
		// dude.body.velocity.x (em pixels/s)
		// dude.body.velocity.y (em pixels/s)
		// dude.body.acceleration.x (em pixels/s²)
		// dude.body.acceleration.y (em pixels/s²)
		// dude.body.drag.y (arrasto/desaceleração em pixels/s²)
		// dude.body.maxVelocity.y (em pixels/s)
		//
		// Mais atributos e métodos de body (dude.body.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.Body.html
		//
		// Mais informações relacionados à física de arcade:
		// https://phaser.io/docs/2.6.2/index#arcadephysics
		
		// Inicia com o personagem olhando para a direita.
		// Dê uma olhada na função update() para entender :)
		ultimaDirecao = 1;
		
	};
	
	this.update = function () {
		
		// Controle de movimentos simples. Se a seta esquerda estiver
		// pressionada, aplica uma aceleração negativa (esquerda) ao
		// o sprite. Se a seta direita estiver pressionada, aplica uma
		// aceleração positiva (direita) ao sprite. Se nenhuma tecla
		// estiver pressionada, remove a aceleração do sprite, deixando
		// que o arrasto/desaceleração (drag) pare o sprite.
		//
		// Além disso, define a animação correta do sprite dependendo
		// da seta que estiver pressionada.
		if (setas.up.isDown) {
			dude.body.acceleration.y = -3000;
		} else {
			if (setas.down.isDown) {
				dude.body.acceleration.y = 3000;
			} else {
				dude.body.acceleration.y = 0;
			}
		}

		if (setas.left.isDown) {
			// Muda ultimaDirecao para indicar que o personagem deverá
			// continuar atirando para a esquerda, mesmo se ficar parado
			// no futuro.
			ultimaDirecao = -1;
			dude.body.acceleration.x = -3000;
			dude.animations.play("esquerda");
		} else {
			if (setas.right.isDown) {
				// Muda ultimaDirecao para indicar que o personagem deverá
				// continuar atirando para a direita, mesmo se ficar parado
				// no futuro.
				ultimaDirecao = 1;
				dude.body.acceleration.x = 3000;
				dude.animations.play("direita");
			} else {
				// Não vamos alterar o valor de ultimaDirecao aqui, para
				// que o personagem continue atirando na direção para onde
				// ele estava andando anteriormente.
				dude.body.acceleration.x = 0;
				// Apenas para ter uma animação quando estiver andando
				// puramente para cima ou para baixo.
				if (setas.up.isDown || setas.down.isDown) {
					if (ultimaDirecao > 0) {
						dude.animations.play("direita");
					} else {
						dude.animations.play("esquerda");
					}
				} else {
					dude.animations.play("parado");
				}
			}
		}
		
		// Poderíamos também alterar a animação do sprite não apenas com
		// base no teclado, mas com base em sua velocidade, ou uma combinação
		// de ambos! :)
		
	};
	
}
