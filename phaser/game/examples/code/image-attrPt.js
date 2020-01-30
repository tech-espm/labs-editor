
function menu() {
	
	var dude;
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#0066ff";
		
		// Carrega uma imagem (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo).
		game.load.image("phaser-dude", "examples/assets/phaser-dude.png");
		
	};
	
	this.create = function () {
		
		// Adiciona a imagem na coordenada (20, 100) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Como iremos trabalhar com a imagem depois, precisamos
		// armazenar em uma variável.
		dude = game.add.image(20, 100, "phaser-dude");
		
	};
	
	this.update = function () {
		
		// Altera o ângulo da imagem a todo quadro.
		dude.angle = dude.angle + 1;
		
		// Outros atributos comuns:
		// dude.alpha (de 0 a 1)
		// dude.x (em pixels)
		// dude.y (em pixels)
		// dude.anchor.x (de 0 a 1, onde 0 é esquerda e 1 é direita)
		// dude.anchor.y (de 0 a 1, onde 0 é cima e 1 é baixo)
		// dude.scale.x (qualquer valor, onde 1 = 100% e negativo espelha)
		// dude.scale.y (qualquer valor, onde 1 = 100% e negativo espelha)
		
		// Mais atributos de imagens:
		// https://phaser.io/docs/2.6.2/Phaser.Image.html
		
	};
	
}
