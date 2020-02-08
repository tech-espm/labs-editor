
function menu() {
	
	var texto;
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#0066ff";
		
	};
	
	this.create = function () {
		
		// Especifica o formato básico do texto de forma similar
		// ao atributo font do CSS normal. A diferença é que a cor
		// é determinada pelo atributo fill, e não color como
		// ocorre no CSS normal.
		//
		// Mais atributos e métodos dos textos e seus estilos:
		// https://phaser.io/docs/2.6.2/Phaser.Text.html
		var estilo = {
			font: "bold 20px Arial",
			fill: "#ffffff"
		};
		
		// Adiciona um texto na coordenada (10, 10) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		texto = game.add.text(10, 10, "Exemplo de texto", estilo);
		
		// Define a sombra do texto, conforme a especificação
		// do método setShadow():
		// https://phaser.io/docs/2.6.2/Phaser.Text.html#setShadow
		//
		// O primeiro parâmetro determina o deslocamento horizontal.
		// O segundo parâmetro determina o deslocamento vertical.
		// O terceiro parâmetro determina a cor da sombra (igual ao CSS).
		// O quarto parâmetro determina a difusão da sobra (0 = nenhuma).
		texto.setShadow(0, 2, 'rgba(0, 0, 0, 0.75)', 4);
		
	};
	
	this.update = function () {
		
	};
	
}
