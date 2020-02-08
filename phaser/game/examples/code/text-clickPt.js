
function menu() {
	
	var texto;
	var contador;
	
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
			font: "normal 16px Arial",
			fill: "#ffffff"
		};
		
		// Adiciona um texto na coordenada (0, 0) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		texto = game.add.text(0, 0, "Clique aqui!", estilo);
		
		// Habilita que o texto seja clicado.
		texto.inputEnabled = true;
		// Altera o cursor do mouse quando ele estiver sobre
		// o texto.
		texto.input.useHandCursor = true;
		// Diz qual função deve ser executada quando o texto
		// for clicado.
		texto.events.onInputDown.add(textoFoiClicado);
		
		// Nosso contador, para demonstrar a alteração do texto.
		contador = 0;
		
	};
	
	this.update = function () {
		
	};
	
	function textoFoiClicado() {
		
		// Incrementa o contador e altera o texto.
		contador = contador + 1;
		texto.setText("Cliques: " + contador);
		
	}
	
}
