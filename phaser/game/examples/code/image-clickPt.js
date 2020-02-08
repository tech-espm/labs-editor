
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
		
		// Habilita que a imagem seja clicada.
		dude.inputEnabled = true;
		// Altera o cursor do mouse quando ele estiver sobre
		// a imagem.
		dude.input.useHandCursor = true;
		// Diz qual função deve ser executada quando a imagem
		// for clicada.
		dude.events.onInputDown.add(dudeFoiClicado);
		
	};
	
	this.update = function () {
		
	};
	
	function dudeFoiClicado() {
		
		// Vamos apenas trocar o fundo do jogo quando a imagem
		// for clicada.
		game.stage.backgroundColor = "#00ff00";
		
	}
	
}
