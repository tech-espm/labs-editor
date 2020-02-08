
function menu() {
	
	var texto;
	var horaAnterior;
	var milissegundosRestantes;
	
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
		texto = game.add.text(0, 0, "", estilo);
		
		// Nosso contador, para demonstrar a alteração do texto.
		horaAnterior = game.time.now;
		milissegundosRestantes = 60000;
		
	};
	
	this.update = function () {
		
		// Atualiza quanto tempo se passou desde a última vez.
		var horaAtual = game.time.now;
		var delta = horaAtual - horaAnterior;
		horaAnterior = horaAtual;
		
		milissegundosRestantes = milissegundosRestantes - delta;
		
		// O | 0 é para truncar o valor (remover a parte fracionária).
		texto.setText((milissegundosRestantes / 1000) | 0);
		
	};
	
}
