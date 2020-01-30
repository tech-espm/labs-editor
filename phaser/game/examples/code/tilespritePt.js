
function menu() {
	
	this.preload = function () {
		
		// Carrega imagem do fundo (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo).
		game.load.image("fundo", "examples/assets/background2.png");
		
	};
	
	this.create = function () {
		
		// Adiciona a imagem de fundo na coordenada (0, 0) da
		// tela, com 800 pixels de largura e 600 pixels de altura.
		// Contudo, se o tamanho original da imagem não for o
		// desejado, em vez de esticar a imagem, ela será repetida
		// várias vezes, lado a lado.
		game.add.tileSprite(0, 0, 800, 600, "fundo");
		
	};
	
	this.update = function () {
		
	};
	
}
