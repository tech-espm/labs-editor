
function menu() {
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#0066ff";
		
		// Carrega uma imagem (o primeiro par�metro � como
		// n�s iremos chamar a imagem no nosso jogo).
		game.load.image("phaser-dude", "examples/assets/phaser-dude.png");
		
	};
	
	this.create = function () {
		
		// Adiciona a imagem na coordenada (20, 100) da tela,
		// lembrando que (0, 0) est� no canto superior esquerdo!
		game.add.image(20, 100, "phaser-dude");
		
	};
	
	this.update = function () {
		
	};
	
}
