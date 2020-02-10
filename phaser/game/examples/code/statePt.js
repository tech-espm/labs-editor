//******************************************************
//
// Não podemos nos esquecer de especifica as telas do
// jogo no cabeçalho do arquivo menu.js!!!
//
//******************************************************
var telas = ["menu", "tela1", "gameover"];
var larguraJogo = 800;
var alturaJogo = 600;

//******************************************************
//
// As variáveis criadas aqui em cima, fora das funções,
// podem ser acessadas de qualquer função/arquivo!
//
//******************************************************

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
			font: "normal 16px Arial",
			fill: "#ffffff"
		};
		
		// Adiciona um texto na coordenada (0, 0) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		texto = game.add.text(0, 0, "Clique aqui para iniciar!", estilo);
		
		// Habilita que o texto seja clicado.
		texto.inputEnabled = true;
		// Altera o cursor do mouse quando ele estiver sobre
		// o texto.
		texto.input.useHandCursor = true;
		// Diz qual função deve ser executada quando o texto
		// for clicado.
		texto.events.onInputDown.add(textoFoiClicado);
		
	};
	
	this.update = function () {
		
	};
	
	function textoFoiClicado() {
		
		// Apenas inicia a primeira tela do jogo.
		game.state.start("tela1");
		
	}
	
}

//******************************************************
//
// A função tela1() deve ficar em um arquivo separado,
// chamado tela1.js
//
//******************************************************

function tela1() {
	
	var texto;
	
	this.preload = function () {
		
		// Define a cor do fundo para laranja.
		game.stage.backgroundColor = "#ff6600";
		
	};
	
	this.create = function () {
		
		var estilo = {
			font: "normal 16px Arial",
			fill: "#000000"
		};
		
		texto = game.add.text(0, 0, "Clique aqui para terminar o jogo!", estilo);
		
		texto.inputEnabled = true;
		texto.input.useHandCursor = true;
		texto.events.onInputDown.add(textoFoiClicado);
		
	};
	
	this.update = function () {
		
	};
	
	function textoFoiClicado() {
		
		game.state.start("gameover");
		
	}
	
}

//******************************************************
//
// A função gameover() deve ficar em um arquivo separado,
// chamado gameover.js
//
//******************************************************

function gameover() {
	
	var texto;
	
	this.preload = function () {
		
		// Define a cor do fundo para cinza escuro.
		game.stage.backgroundColor = "#444444";
		
	};
	
	this.create = function () {
		
		var estilo = {
			font: "normal 16px Arial",
			fill: "#ffffff"
		};
		
		texto = game.add.text(0, 0, "Game Over! Clique aqui para voltar para o menu", estilo);
		
		texto.inputEnabled = true;
		texto.input.useHandCursor = true;
		texto.events.onInputDown.add(textoFoiClicado);
		
	};
	
	this.update = function () {
		
	};
	
	function textoFoiClicado() {
		
		game.state.start("menu");
		
	}
	
}
