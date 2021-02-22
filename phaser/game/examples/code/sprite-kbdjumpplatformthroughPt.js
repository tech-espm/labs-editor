
function menu() {
	
	var setas;
	var plataformas;
	var dude;
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#0066ff";
		
		// Carrega a imagem de uma plataforma.
		game.load.image("plataforma", "examples/assets/platform.png");
		
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
		
		// Atribui uma função para ser executada quando a
		// seta para cima for pressionada.
		//
		// Mais atributos e métodos das teclas (tecla.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Key.html
		setas.up.onDown.add(pular);
		
		// Vamos criar todas as plataformas em um único grupo
		// para facilitar o tratamento das colisões no futuro.
		//
		// Como todos os objetos do grupo devem ter física,
		// usamos game.add.physicsGroup() em vez de game.add.group().
		// https://phaser.io/docs/2.6.2/Phaser.GameObjectFactory.html#physicsGroup
		plataformas = game.add.physicsGroup();
		plataformas.create(100, 550, "plataforma");
		plataformas.create(150, 450, "plataforma");
		plataformas.create(200, 350, "plataforma");
		plataformas.create(250, 250, "plataforma");
		// As plataformas não devem se mover quando forem acertadas
		// pelo jogador, diferente de uma bola de bilhar, que
		// deve ser movida quando for acertada por outra bola.
		plataformas.setAll("body.immovable", true);
		// O personagem pode "atravessar" a plataforma se colidir
		// na parte inferior dela.
		plataformas.setAll("body.checkCollision.down", false);
		// Reduz um pouco o tamanho de todas as plataformas.
		plataformas.setAll("scale.x", 0.25);
		plataformas.setAll("scale.y", 0.25);
		
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
		// Configura a gravidade (em pixels/s²) aplicada ao sprite,
		// lembrando que valores positivos apontam para baixo!
		dude.body.gravity.y = 800;
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele terá quando
		// colidir com algum obstáculo.
		dude.body.bounce.x = 0.5;
		dude.body.bounce.y = 0;
		// Configura a velocidade horizontal máxima do sprite,
		// porque agora iremos trabalhar com a aceleração do
		// sprite, sem alterar sua velocidade diretamente.
		dude.body.maxVelocity.x = 500;
		// Configura o arrasto/desaceleração horizontal do sprite.
		dude.body.drag.x = 2000;
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
		
	};
	
	this.update = function () {
		
		// Usamos collide() para que o Phaser trate a colisão do personagem
		// com todas as plataformas de uma só vez.
		//
		// Mais informações:
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#collide
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#overlap
		game.physics.arcade.collide(dude, plataformas);
		
		// Controle de movimentos simples. Se a seta esquerda estiver
		// pressionada, aplica uma aceleração negativa (esquerda) ao
		// o sprite. Se a seta direita estiver pressionada, aplica uma
		// aceleração positiva (direita) ao sprite. Se nenhuma tecla
		// estiver pressionada, remove a aceleração do sprite, deixando
		// que o arrasto/desaceleração (drag) pare o sprite.
		//
		// Além disso, define a animação correta do sprite dependendo
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
		
		// Poderíamos também alterar a animação do sprite não apenas com
		// base no teclado, mas com base em sua velocidade, ou uma combinação
		// de ambos! :)
		
	};
	
	function pular() {
		
		// Pular significa aplicar a um sprite uma velocidade para cima
		// (negativa). Contudo, só podemos deixar que o jogador pule se
		// o sprite estiver sobre o chão. Se bem que... alguns jogos
		// deixam que o jogador pule mesmo no ar... ;)
		if (dude.body.onFloor() || dude.body.touching.down) {
			dude.body.velocity.y = -500;
		}
		
	}
	
}
