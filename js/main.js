"use strict";

window.emoji = {
	happy: "\uD83D\uDE04",
	sad: "\uD83D\uDE22"
};
window.isEmpty = function (x) {
	return (x === undefined || x === null);
};
window.zeroObject = function (o) {
	var p, v;
	for (p in o) {
		switch (typeof o[p]) {
			case "function":
				break;
			case "boolean":
				o[p] = false;
				break;
			case "number":
				o[p] = 0;
				break;
			default:
				v = o[p];
				if (Array.isArray(v))
					v.fill(null);
				o[p] = null;
				break;
		}
	}
};
window._ = function (id) {
	return ((typeof id === "string") ? document.getElementById(id) : id);
};
window.cancelEvent = function (evt) {
	if (evt) {
		if ("isCancelled" in evt)
			evt.isCancelled = true;
		if ("preventDefault" in evt)
			evt.preventDefault();
		if ("stopPropagation" in evt)
			evt.stopPropagation();
	}
	return false;
};
window.encode = (function () {
	var lt = /</g, gt = />/g;
	return function (x) {
		return x.replace(lt, "&lt;").replace(gt, "&gt;");
	};
})();
window.format2 = function (x) {
	return ((x < 10) ? ("0" + x) : x);
};
window.formatPeriod = function (period) {
	return (period < 60 ? (period + " minutos") : (period == 60 ? "1 hora" : (((period / 60) | 0) + " horas")));
};
window.formatDuration = function (duration) {
	var s = ((duration / 1000) | 0), m = ((s / 60) | 0);
	s = s % 60;
	return format2(m) + ":" + format2(s);
};
window.formatSize = (function () {
	var expr = /\B(?=(\d{3})+(?!\d))/g;
	window.formatSizeLong = function (size, forceBytes) {
		if (size < 1000)
			return size + " bytes";
		else if (size < 16384 || forceBytes)
			return size.toString().replace(expr, ".") + " bytes";
		return ((size * 0.0009765625) | 0).toString().replace(expr, ".") + " KiB";
	};
	return function (size, forceBytes) {
		if (size < 1000)
			return size + " bytes";
		else if (size < 16384 || forceBytes)
			return size.toString().replace(expr, ".") + " bytes";
		return (size >>> 10).toString().replace(expr, ".") + " KiB";
	};
})();
window.formatNumber = (function () {
	var expr = /\B(?=(\d{3})+(?!\d))/g;
	return function (x) {
		return x.toString().replace(expr, ".");
	};
})();
window.formatHour = function (x) {
	return format2(x >>> 6) + ":" + format2(x & 63);
};
window.parseNoNaN = function (str) {
	var x = parseInt(trim(str));
	return (isNaN(x) ? 0 : x);
};
window.trim = (function () {
	if (window.String && window.String.prototype && window.String.prototype.trim)
		return function (str) { return str.trim(); };
	var expr = /^\s+|\s+$/g;
	return function (str) { return str.replace(expr, ""); };
})();
window.trimValue = function (input) {
	return trim(_(input).value);
};
window.Notification = {
	div: null,
	span: null,
	btn: null,
	version: 0,
	timeout: 0,
	timeoutVisible: 0,
	timeoutGone: 0,
	isVisible: false,
	wait: function (msg, basePath) {
		var div = document.createElement("div");
		div.innerHTML = "<img alt=\"Aguarde\" src=\"/labs-editor/images/loading-grey-t.gif\"> " + (msg || translate("PleaseWait"));
		return Notification.show(div, "default", -1);
	},
	success: function (message, important) {
		return Notification.show(message, "success", important ? 5000 : 2500, true);
	},
	error: function (message, important) {
		return Notification.show(message, "danger", important ? 5000 : 2500, true);
	},
	show: function (message, type, timeout, closeable) {
		if (!Notification.div) {
			Notification.div = document.createElement("div");
			Notification.div.setAttribute("role", "alert");
			Notification.div.className = "alert alert-notification";
			Notification.span = document.createElement("span");
			Notification.btn = document.createElement("button");
			Notification.btn.setAttribute("aria-label", "Fechar");
			Notification.btn.innerHTML = "&times;";
			Notification.btn.onclick = Notification.hide;
			Notification.div.appendChild(Notification.span);
			Notification.div.appendChild(Notification.btn);
			document.body.appendChild(Notification.div);
		}

		Notification.isVisible = true;
		Notification.version++;

		var version = Notification.version;

		if (Notification.timeout) {
			clearTimeout(Notification.timeout);
			Notification.timeout = 0;
		}

		if (Notification.timeoutVisible) {
			clearTimeout(Notification.timeoutVisible);
			Notification.timeoutVisible = 0;
		}

		if (Notification.timeoutGone) {
			clearTimeout(Notification.timeoutGone);
			Notification.timeoutGone = 0;
		}

		if (timeout !== -1) {
			if (isNaN(timeout) || timeout <= 0)
				closeable = true;
			else
				Notification.timeout = setTimeout(function () {
					if (Notification.version !== version)
						return;
					Notification.hide();
				}, timeout + 30);
		}

		if (type !== "success" && type !== "info" && type !== "danger" && type !== "warning")
			type = "default";

		Notification.btn.className = (closeable ? "close" : "close hidden");
		Notification.div.className = "alert alert-notification alert-" + type + (closeable ? " alert-dismissible" : "");
		Notification.timeoutVisible = setTimeout(function () {
			if (Notification.version !== version)
				return;

			if ((typeof message) === "string") {
				Notification.span.textContent = message;
			} else {
				while (Notification.span.firstChild)
					Notification.span.removeChild(Notification.span.firstChild);
				Notification.span.appendChild(message);
			}

			$(Notification.div).addClass("alert-notification-shown");
		}, 30);
	},
	hide: function () {
		if (!Notification.div || !Notification.isVisible)
			return;

		Notification.isVisible = false;
		Notification.version++;

		var version = Notification.version;

		if (Notification.timeout) {
			clearTimeout(Notification.timeout);
			Notification.timeout = 0;
		}

		if (Notification.timeoutVisible) {
			clearTimeout(Notification.timeoutVisible);
			Notification.timeoutVisible = 0;
		}

		if (Notification.timeoutGone) {
			clearTimeout(Notification.timeoutGone);
			Notification.timeoutGone = 0;
		}

		$(Notification.div).removeClass("alert-notification-shown");
		Notification.timeoutGone = setTimeout(function () {
			if (Notification.version !== version)
				return;
			$(Notification.div).addClass("alert-notification-gone");
		}, 600);
	}
};
window.BlobDownloader = {
	blobURL: null,

	saveAs: (window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || window.navigator.saveBlob || window.navigator.webkitSaveBlob || window.navigator.mozSaveBlob || window.navigator.msSaveBlob),

	supported: (("Blob" in window) && ("URL" in window) && ("createObjectURL" in window.URL) && ("revokeObjectURL" in window.URL)),

	alertNotSupported: function () {
		Notification.error(translate("BrowserNotSupported"), true);
		return false;
	},

	download: function (filename, blob) {
		if (!BlobDownloader.supported)
			return false;
		if (BlobDownloader.blobURL) {
			URL.revokeObjectURL(BlobDownloader.blobURL);
			BlobDownloader.blobURL = null;
		}

		if (BlobDownloader.saveAs) {
			try {
				BlobDownloader.saveAs.call(window.navigator, blob, filename);
				return;
			} catch (ex) {
				Notification.error(translate("ErrorDownload"), true);
			}
		}

		var a = document.createElement("a"), evt;
		BlobDownloader.blobURL = URL.createObjectURL(blob);
		a.href = BlobDownloader.blobURL;
		a.download = filename;
		if (document.createEvent && (window.MouseEvent || window.MouseEvents)) {
			try {
				evt = document.createEvent("MouseEvents");
				evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(evt);
				return;
			} catch (ex) {
			}
		}
		a.click(); // Works on Chrome but not on Firefox...
		return true;
	}
};

// Helper functions
function _ID(id) { return document.getElementById(id); }
function _SA(parent, name, value) { parent.setAttribute(name, value); return parent; }
function _GA(parent, name) { return (parent.getAttribute(name) || ""); }
function _RA(parent, name) { parent.removeAttribute(name); return parent; }
function _CE(tagName, className, parent) { var e = document.createElement(tagName); if (className) e.className = className; if (parent) _AC(parent, e); return e; }
function _ICE(tagName, className, parent) { var e = iframeDocument.createElement(tagName); if (className) e.className = className; if (parent) _AC(parent, e); return e; }
function _TXT(text, parent) { var e = document.createTextNode(text); if (parent) _AC(parent, e); return e; }
function _ITXT(text, parent) { var e = iframeDocument.createTextNode(text); if (parent) _AC(parent, e); return e; }
function _ICMT(text, parent) { var e = iframeDocument.createComment(text); if (parent) _AC(parent, e); return e; }
function _AC(parent, newChild) { parent.appendChild(newChild); return parent; }
function _IB(parent, newChild, refChild) { parent.insertBefore(newChild, refChild); return parent; }
function _BTN(className, icon, title, parent, clickHandler) { var btn = _CE("button", className, parent); _CE("i", "fa fa-nomargin " + icon, btn); _SA(btn, "type", "button"); btn.onclick = clickHandler; if (title) _SA(btn, "title", title); return btn; }
function _RC(parent, oldChild) { parent.removeChild(oldChild); return parent; }

function loadFileDataURL(file, callback) {
	if (loading) {
		callback(null);
		return;
	}

	if (!("FileReader" in window)) {
		Notification.error(translate("ErrorNoFile"), true);
		callback(null);
		return;
	}

	loading = true;
	Notification.wait();

	var reader = new FileReader();
	reader.onload = function () {
		loading = false;
		Notification.hide();
		callback(reader.result);
	};
	reader.onerror = function () {
		loading = false;
		Notification.error(translate("ErrorFileLoad"), true);
		callback(null);
	};
	reader.readAsDataURL(file);
}

function lockUI(lock) {
	if (lock) {
		editorContainer.style.pointerEvents = "none";
		iframe.style.pointerEvents = "none";
		bar.style.pointerEvents = "none";
	} else {
		editorContainer.style.pointerEvents = "";
		iframe.style.pointerEvents = "";
		bar.style.pointerEvents = "";
	}
}

// Polyfills
(function () {
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (_this) {
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Description
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
			var originalFunction = this, slice, originalExtraArguments;
			if (arguments.length <= 1)
				return function () {
					return originalFunction.apply(_this, arguments);
				};
			slice = Array.prototype.slice;
			originalExtraArguments = slice.call(arguments, 1);
			return function () {
				return originalFunction.apply(_this, originalExtraArguments.concat(slice.call(arguments)));
			};
		};
	}

	if (!Array.prototype.fill) {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
		Array.prototype.fill = function (value, start, end) {
			var i, length = this.length | 0;
			start |= 0;
			end = ((end === undefined) ? length : (end | 0));
			end = ((end < 0) ? Math.max(length + end, 0) : Math.min(end, length));
			i = ((start < 0) ? Math.max(length + start, 0) : Math.min(start, length));
			while (i < end)
				this[i++] = value;
			return this;
		};
	}

	if (!String.prototype.trim) {
		String.prototype.trim = (function () {
			var expr = /^\s+|\s+$/g;
			return function () { return this.replace(expr, ""); };
		})();
	}

	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function (start, position) {
			// Try to simulate the actual behavior of startsWith()
			if (this === "")
				return (start === "");
			if (!this)
				return false;
			if (start === "")
				return true;
			if (position === undefined || position < 0)
				position = 0;
			if (!start || (start.length + position) > this.length)
				return false;
			var i = this.indexOf(start, position);
			return (i);
		};
	}

	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function (end, desiredLength) {
			// Try to simulate the actual behavior of endsWith()
			if (this === "")
				return (end === "");
			if (!this)
				return false;
			if (end === "")
				return true;
			if (desiredLength === undefined || desiredLength > this.length)
				desiredLength = this.length;
			if (!end || end.length > desiredLength)
				return false;
			var i = this.lastIndexOf(end, desiredLength);
			return (i >= 0 && i === (desiredLength - end.length));
		};
	}

	if (!Date.now) {
		Date.now = function () {
			return (new Date()).getTime();
		};
	}

	if (!window.performance || !window.performance.now) {
		(function () {
			var initialNow = Date.now();
			if (!window.performance)
				window.performance = {};
			window.performance.now = function () {
				return Date.now() - initialNow;
			};
		});
	}

	if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
		(function () {
			// Modified version of https://gist.github.com/desandro/1866474
			var lastTime = 0, prefixes = "webkit moz ms o".split(" "),
				requestAnimationFrame = window.requestAnimationFrame,
				cancelAnimationFrame = window.cancelAnimationFrame,
				prefix, i;

			for (i = 0; i < prefixes.length; i++) {
				if (requestAnimationFrame && cancelAnimationFrame)
					break;
				prefix = prefixes[i];
				if (!requestAnimationFrame)
					requestAnimationFrame = window[prefix + "RequestAnimationFrame"];
				if (!cancelAnimationFrame)
					cancelAnimationFrame = window[prefix + "CancelAnimationFrame"] || window[prefix + "CancelRequestAnimationFrame"];
			}

			if (!requestAnimationFrame || !cancelAnimationFrame) {
				requestAnimationFrame = function (callback) {
					return window.setTimeout(function() {
						lastTime = performance.now();
						callback(lastTime);
					}, Math.max(0, 16 - (performance.now() - lastTime)));
				};

				cancelAnimationFrame = window.clearTimeout;
			}

			window.requestAnimationFrame = requestAnimationFrame;
			window.cancelAnimationFrame = cancelAnimationFrame;
		})();
	}
})();

// Service Worker
(function () {
	var installationPrompt = null;

	if (("serviceWorker" in navigator)) {
		window.addEventListener("beforeinstallprompt", function (e) {
			if (("preventDefault" in e))
				e.preventDefault();
			installationPrompt = e;
			_ID("editorActionInstallSeparator").style.display = "";
			_ID("editorActionInstallItem").style.display = "";
		});

		_ID("editorActionInstall").onclick = function (e) {
			$("#editorMenuDropdown").dropdown("toggle");

			_ID("editorActionInstallSeparator").style.display = "none";
			_ID("editorActionInstallItem").style.display = "none";

			if (installationPrompt) {
				installationPrompt.prompt();
				installationPrompt = null;
			}

			return cancelEvent(e);
		};

		navigator.serviceWorker.register("/labs-editor/sw.js");
	}
})();

// Translation
(function () {
	if (!window.editorStrings || (typeof window.editorStrings !== "object")) window.editorStrings = {};

	function addString(key, value) { if (!window.editorStrings[key]) window.editorStrings[key] = value; }

	window.language = (navigator.userLanguage || navigator.language);
	if (!window.language)
		window.language = "pt-br";
	if (window.language.indexOf("pt") === 0) {
		addString("PleaseWait", "Por favor, aguarde...");
		addString("OK", "OK");
		addString("Cancel", "Cancelar");
		addString("Close", "Fechar");
		addString("Menu", "Menu");
		addString("New", "Novo");
		addString("Load", "Abrir");
		addString("Save", "Salvar");
		addString("Options", "Opções");
		addString("UndoDelete", "Desfazer Exclusão");
		addString("PreviewPage", "Visualizar Página");
		addString("StopPreview", "Parar Visualização");
		addString("FileName", "Nome do Arquivo");
		addString("LoadEllipsis", "Abrir\u2026");
		addString("SaveEllipsis", "Salvar\u2026");
		addString("ExportHTML", "Exportar HTML\u2026");
		addString("EditText", "Editar Texto");
		addString("Text", "Texto");
		addString("EditComment", "Editar Comentário");
		addString("Comment", "Comentário");
		addString("EditSelector", "Editar Seletor");
		addString("Selector", "Seletor");
		addString("Element", "Elemento");
		addString("Rule", "Regra");
		addString("Attribute", "Propriedade");
		addString("Document", "Documento");
		addString("Name", "Nome");
		addString("Value", "Valor");
		addString("EditAttribute", "Editar Propriedade");
		addString("AttributeHelp", "Ajuda da Propriedade");
		addString("Move", "Mover");
		addString("Duplicate", "Duplicar");
		addString("Rename", "Renomear");
		addString("RenameEllipsis", "Renomear\u2026");
		addString("Delete", "Excluir");
		addString("ElementName", "Nome do Elemento");
		addString("FindElement", "Localizar Elemento");
		addString("ChangeElement", "Alterar Elemento");
		addString("EditAttributes", "Editar Atributos");
		addString("Create", "Criar");
		addString("CreateElement", "Criar Elemento");
		addString("CreateRule", "Criar Regra");
		addString("CreateAttribute", "Criar Propriedade");
		addString("CreateText", "Criar Texto");
		addString("CreateComment", "Criar Comentário");
		addString("CreateDocument", "Criar Documento");
		addString("CreateAbove", "<i class=\"fa fa-arrow-up\"></i> Criar Acima");
		addString("CreateBelow", "<i class=\"fa fa-arrow-down\"></i> Criar Abaixo");
		addString("CreateInside", "<i class=\"fa fa-indent\"></i> Criar Dentro");
		addString("DeleteFile", "Excluir Arquivo");
		addString("UploadFiles", "Enviar Arquivos");
		addString("LoadImage", "Carregar Imagem");
		addString("SimpleMode", "Modo Simples");
		addString("AdvancedMode", "Modo Avançado");
		addString("Copied", "Copiado! " + emoji.happy);
		addString("UseLoremIpsum", "Utilizar Parágrafo de Lorem Ipsum");
		addString("PlaceholderText", "[Digite seu texto aqui]");
		addString("ErrorBlockInsideInline", "Um elemento block não pode ser filho de um elemento inline " + emoji.sad);
		addString("ErrorInlineParentBlock", "Um elemento inline não pode ser pai de um elemento block " + emoji.sad);
		addString("ErrorNewElementMustHaveChildren", "O novo elemento também deve poder ter filhos " + emoji.sad);
		addString("ErrorNewElementMustNotHaveChildren", "O novo elemento também não pode ter filhos " + emoji.sad);
		addString("ErrorNoFile", "Seu browser não oferece suporte a acesso avançado de arquivos " + emoji.sad);
		addString("ErrorFileTooLarge", "Por favor, escolha uma imagem com tamanho de até 1 MiB " + emoji.sad);
		addString("ErrorAdvancedFileTooLarge", "Por favor, escolha um arquivo com tamanho de até 5 MiB " + emoji.sad);
		addString("ErrorZipContainsFileTooLarge", "Um ou mais arquivos não foram carregados porque o tamanho deles excede 5 MiB " + emoji.sad);
		addString("ErrorFileLoad", "Ocorreu um erro ao ler o arquivo " + emoji.sad);
		addString("ErrorFileSave", "Ocorreu um erro ao gravar o arquivo " + emoji.sad);
		addString("ErrorFileDelete", "Ocorreu um erro ao excluir o arquivo " + emoji.sad);
		addString("ErrorDownload", "Ocorreu um erro durante o download dos dados " + emoji.sad);
		addString("ErrorInvalidFileName", "Nome de arquivo inválido " + emoji.sad);
		addString("ErrorFileAlreadyExists", "Já existe um arquivo com o mesmo nome " + emoji.sad);
		addString("ErrorInvalidHTML", "O arquivo escolhido não parece ser um arquivo HTML válido " + emoji.sad);
		addString("ErrorInvalidChar", "Você não pode digitar os símbolos < ou > aqui. Para mais informações, por favor, veja o link \"Entidades HTML\" " + emoji.sad);
		addString("ConfirmQuit", "Deseja mesmo sair da página? Você perderá o documento atual.");
		addString("ConfirmClose", "Deseja mesmo continuar? Você perderá as alterações não salvas.");
		addString("ConfirmDelete", "Deseja mesmo excluir o arquivo ");
		addString("MoveMessage", "Clique para onde deseja mover o elemento ou tecle Esc para cancelar");
		addString("MoveMessageCreateElement", "Clique onde deseja criar o novo elemento ou tecle Esc para cancelar");
		addString("MoveMessageCreateText", "Clique onde deseja criar o novo texto ou tecle Esc para cancelar");
		addString("MoveMessageCreateComment", "Clique onde deseja criar o novo comentário ou tecle Esc para cancelar");
		addString("MoveMessageCreateRule", "Clique onde deseja criar a nova regra ou tecle Esc para cancelar");
		addString("MoveMessageCreateAttribute", "Clique onde deseja criar a nova propriedade ou tecle Esc para cancelar");
		addString("HideChildren", "Ocultar Filhos");
		addString("ShowChildren", "Mostrar Filhos");
		addString("ElementHelp", "Ajuda do Elemento");
		addString("MoreHelpLinks", "Mais Links de Ajuda");
		addString("HTMLEntities", "Entidades HTML");
		addString("PageTitle", "Título da Página");
		addString("CSSTab", "Este conteúdo está na aba CSS");
		addString("LoadExample", "Abrir Exemplo");
		addString("Examples", "Exemplos");
		addString("ExamplesEllipsis", "Exemplos\u2026");
		addString("HTMLLink", "Elemento HTML link");
		addString("GoogleFontsExample", "Exemplo: <link href=\"...\" />");
		addString("GoogleFonts", "Google Fonts");
		addString("GoogleFontsEllipsis", "Google Fonts\u2026");
		addString("AddBootstrap", "Adicionar Bootstrap 3");
		addString("RemoveBootstrap", "Remover Bootstrap 3");
		addString("ExampleFileSuffix", "Pt");
		addString("ExampleFile", "/labs-editor/examplePt.html");
		addString("ExampleFileHTML", "/labs-editor/examplePt-html.html");
		addString("Install", "Instalar Editor\u2026");
		addString("InstallHTML", "Instalar Editor (HTML)\u2026");
		addString("InstallPhaser", "Instalar Editor (Phaser)\u2026");
		addString("ShowDecoration", "Exibir HTML Completo");
		addString("HideDecoration", "Ocultar HTML Completo");
		addString("ShowFileList", "Exibir Arquivos");
		addString("HideFileList", "Ocultar Arquivos");
		addString("ShowConsole", "Exibir Console");
		addString("HideConsole", "Ocultar Console");
		addString("ClearConsole", "Limpar Console");
		addString("WrapMode", "Quebra de Linha");
		addString("PreviewInAnotherWindow", "Visualizar em Outra Janela");
		addString("PreviewInTheSameWindow", "Visualizar na Mesma Janela");
		addString("Libraries", "Bibliotecas");
		addString("LibrariesEllipsis", "Bibliotecas\u2026");
		addString("Theme", "Tema");
		addString("ThemeEllipsis", "Tema\u2026");
		addString("BrowserNotSupported", "Infelizmente seu navegador não suporta essa funcionalidade " + emoji.sad);
		addString("RememberToAddFileToMenu", "Por favor, lembre-se de adicionar o nome do arquivo à lista em menu.js " + emoji.happy);
		addString("DragMessage", "Solte os arquivos para enviá-los");
		addString("levels", "telas");
		addString("gameWidth", "larguraJogo");
		addString("gameHeight", "alturaJogo");
	} else {
		addString("PleaseWait", "Please wait...");
		addString("OK", "OK");
		addString("Cancel", "Cancel");
		addString("Close", "Close");
		addString("Menu", "Menu");
		addString("New", "New");
		addString("Load", "Load");
		addString("Save", "Save");
		addString("Options", "Options");
		addString("UndoDelete", "Undo Delete");
		addString("PreviewPage", "Preview Page");
		addString("StopPreview", "Stop Preview");
		addString("FileName", "File Name");
		addString("LoadEllipsis", "Load\u2026");
		addString("SaveEllipsis", "Save\u2026");
		addString("ExportHTML", "Export HTML\u2026");
		addString("EditText", "Edit Text");
		addString("Text", "Text");
		addString("EditComment", "Edit Comment");
		addString("Comment", "Comment");
		addString("EditSelector", "Edit Selector");
		addString("Selector", "Selector");
		addString("Element", "Element");
		addString("Rule", "Rule");
		addString("Attribute", "Property");
		addString("Document", "Document");
		addString("Name", "Name");
		addString("Value", "Value");
		addString("EditAttribute", "Edit Property");
		addString("AttributeHelp", "Property Help");
		addString("Move", "Move");
		addString("Duplicate", "Duplicate");
		addString("Rename", "Rename");
		addString("RenameEllipsis", "Rename\u2026");
		addString("Delete", "Delete");
		addString("ElementName", "Element Name");
		addString("FindElement", "Find Element");
		addString("ChangeElement", "Change Element");
		addString("EditAttributes", "Edit Attributes");
		addString("Create", "Create");
		addString("CreateElement", "Create Element");
		addString("CreateRule", "Create Rule");
		addString("CreateAttribute", "Create Property");
		addString("CreateText", "Create Text");
		addString("CreateComment", "Create Comment");
		addString("CreateDocument", "Create Document");
		addString("CreateAbove", "<i class=\"fa fa-arrow-up\"></i> Create Above");
		addString("CreateBelow", "<i class=\"fa fa-arrow-down\"></i> Create Below");
		addString("CreateInside", "<i class=\"fa fa-indent\"></i> Create Inside");
		addString("DeleteFile", "Delete File");
		addString("UploadFiles", "Upload Files");
		addString("LoadImage", "Load Image");
		addString("SimpleMode", "Simple Mode");
		addString("AdvancedMode", "Advanced Mode");
		addString("Copied", "Copied! " + emoji.happy);
		addString("UseLoremIpsum", "Use Lorem Ipsum Paragraph");
		addString("PlaceholderText", "[Enter your text here]");
		addString("ErrorBlockInsideInline", "A block element cannot be a child of an inline element " + emoji.sad);
		addString("ErrorInlineParentBlock", "An inline element cannot be the parent of a block element " + emoji.sad);
		addString("ErrorNewElementMustHaveChildren", "The new element must also be able to have children " + emoji.sad);
		addString("ErrorNewElementMustNotHaveChildren", "The new element must also not be able to have children " + emoji.sad);
		addString("ErrorNoFile", "Your browser does not support advanced file access " + emoji.sad);
		addString("ErrorFileTooLarge", "Please, select an image with at most 1 MiB " + emoji.sad);
		addString("ErrorAdvancedFileTooLarge", "Please, select an image with at most 5 MiB " + emoji.sad);
		addString("ErrorZipContainsFileTooLarge", "One or more files were not loaded because their size is larger than 5 MiB " + emoji.sad);
		addString("ErrorFileLoad", "An error occurred while reading the file " + emoji.sad);
		addString("ErrorFileSave", "An error occurred while saving the file " + emoji.sad);
		addString("ErrorFileDelete", "An error occurred while deleting the file " + emoji.sad);
		addString("ErrorDownload", "An error occurred while downloading data " + emoji.sad);
		addString("ErrorInvalidFileName", "Invalid file name " + emoji.sad);
		addString("ErrorFileAlreadyExists", "There is already a file with that same name " + emoji.sad);
		addString("ErrorInvalidHTML", "The selected file does not seem to be a valid HTML file " + emoji.sad);
		addString("ErrorInvalidChar", "You cannot enter the symbols < or > here. For more information, please, refer to the \"HTML Entities\" link below " + emoji.sad);
		addString("ConfirmQuit", "Do you really want to quit? You will lose unsaved information.");
		addString("ConfirmClose", "Do you really want to continue? You will lose unsaved information.");
		addString("ConfirmDelete", "Do you really want to delete the file ");
		addString("MoveMessage", "Click where you wish to move the element to or press Esc to cancel");
		addString("MoveMessageCreateElement", "Click where you wish to create the new element or press Esc to cancel");
		addString("MoveMessageCreateText", "Click where you wish to create the new text or press Esc to cancel");
		addString("MoveMessageCreateComment", "Click where you wish to create the new comment or press Esc to cancel");
		addString("MoveMessageCreateRule", "Click where you wish to create the new rule or press Esc to cancel");
		addString("MoveMessageCreateAttribute", "Click where you wish to create the new property or press Esc to cancel");
		addString("HideChildren", "Hide Children");
		addString("ShowChildren", "Show Children");
		addString("ElementHelp", "Element Help");
		addString("MoreHelpLinks", "More Help Links");
		addString("HTMLEntities", "HTML Entities");
		addString("PageTitle", "Page Title");
		addString("CSSTab", "This content is in the CSS tab");
		addString("LoadExample", "Load Example");
		addString("Examples", "Examples");
		addString("ExamplesEllipsis", "Examples\u2026");
		addString("HTMLLink", "HTML link element");
		addString("GoogleFontsExample", "Example: <link href=\"...\" />");
		addString("GoogleFonts", "Google Fonts");
		addString("GoogleFontsEllipsis", "Google Fonts\u2026");
		addString("AddBootstrap", "Add Bootstrap 3");
		addString("RemoveBootstrap", "Remove Bootstrap 3");
		addString("ExampleFileSuffix", "Pt"); // temporarily
		addString("ExampleFile", "/labs-editor/example.html");
		addString("ExampleFileHTML", "/labs-editor/example-html.html");
		addString("Install", "Install Editor\u2026");
		addString("InstallHTML", "Install Editor (HTML)\u2026");
		addString("InstallPhaser", "Install Editor (Phaser)\u2026");
		addString("ShowDecoration", "Show Full HTML");
		addString("HideDecoration", "Hide Full HTML");
		addString("ShowFileList", "Show Files");
		addString("HideFileList", "Hide Files");
		addString("ShowConsole", "Show Console");
		addString("HideConsole", "Hide Console");
		addString("ClearConsole", "Clear Console");
		addString("WrapMode", "Line Wrap");
		addString("PreviewInAnotherWindow", "Preview in Another Window");
		addString("PreviewInTheSameWindow", "Preview in This Widow");
		addString("Libraries", "Libraries");
		addString("LibrariesEllipsis", "Libraries\u2026");
		addString("Theme", "Theme");
		addString("ThemeEllipsis", "Theme\u2026");
		addString("BrowserNotSupported", "Unfortunately, your browser does not support this feature " + emoji.sad);
		addString("RememberToAddFileToMenu", "Please, remember to add the file name to the list in menu.js " + emoji.happy);
		addString("DragMessage", "Drop the files to send them");
		addString("levels", "levels");
		addString("gameWidth", "gameWidth");
		addString("gameHeight", "gameHeight");
	}

	window.translate = function (key) {
		var v = editorStrings[key];
		return (v !== undefined ? v : key);
	};

	window.placeholderText = translate("PlaceholderText");

	function translateChildren(childNodes) {
		var i, c, d, idx, attr, key;
		for (i = childNodes.length - 1; i >= 0; i--) {
			c = childNodes[i];
			if (!c.tagName)
				continue;
			if (c.childNodes && c.childNodes.length)
				translateChildren(c.childNodes);
			if (!(d = c.getAttribute("data-string")) || (idx = d.indexOf("|")) <= 0)
				continue;
			attr = d.substr(0, idx);
			key = d.substr(idx + 1);
			if (attr === "text")
				_TXT(translate(key), c);
			else
				_SA(c, attr, translate(key));
		}
	}

	translateChildren(document.body.childNodes);
})();

// Pointer Handler

//
// MIT License
//
// Copyright (c) 2020 Carlos Rafael Gimenes das Neves
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// https://github.com/carlosrafaelgn/pixel
//
function PointerHandler(element, downCallback, moveCallback, upCallback, lazy, outsidePointerHandler) {
	this.documentTarget = (document.documentElement || document.body);
	this.element = element;

	this.downCallback = downCallback;
	this.moveCallback = moveCallback;
	this.upCallback = upCallback;

	this.boundExtraTouchStart = null;

	if ("onpointerdown" in element) {
		this.documentDownEvent = "pointerdown";
		this.documentMoveEvent = "pointermove";
		this.documentUpEvent = "pointerup";
		this.documentCancelEvent = "pointercancel";

		this.boundDocumentDown = this.pointerDown.bind(this);
		this.boundDocumentUp = this.pointerUp.bind(this);
		this.boundDocumentMove = this.pointerMove.bind(this);

		// Firefox mobile and a few iOS devices cause a buggy behavior if trying to handle
		// pointerdown/move/up but not touchstart/end/cancel...
		if ("ontouchstart" in element)
			this.boundExtraTouchStart = this.extraTouchStart.bind(this);
	} else if ("ontouchstart" in element) {
		this.documentDownEvent = "touchstart";
		this.documentMoveEvent = "touchmove";
		this.documentUpEvent = "touchend";
		this.documentCancelEvent = "touchcancel";

		this.boundDocumentDown = this.touchStart.bind(this);
		this.boundDocumentUp = this.touchEnd.bind(this);
		this.boundDocumentMove = this.touchMove.bind(this);
	} else {
		this.documentDownEvent = "mousedown";
		this.documentMoveEvent = "mousemove";
		this.documentUpEvent = "mouseup";
		this.documentCancelEvent = null;

		this.boundDocumentDown = this.mouseDown.bind(this);
		this.boundDocumentUp = this.mouseUp.bind(this);
		this.boundDocumentMove = this.mouseMove.bind(this);
	}

	this.lazy = lazy;

	this.outsidePointerHandler = outsidePointerHandler;

	if (this.boundExtraTouchStart)
		element.addEventListener("touchstart", this.boundExtraTouchStart);
	element.addEventListener(this.documentDownEvent, this.boundDocumentDown);

	if (!lazy)
		this.addSecondaryHandlers();

	this._captured = false;
	this.pointerId = -1;
}
PointerHandler.prototype = {
	destroy: function () {
		if (this.element) {
			if (this.boundExtraTouchStart)
				this.element.removeEventListener("touchstart", this.boundExtraTouchStart);
			if (this.boundDocumentDown)
				this.element.removeEventListener(this.documentDownEvent, this.boundDocumentDown);
		}

		this.removeSecondaryHandlers();

		this.mouseUp({});

		zeroObject(this);
	},

	captured: function () {
		return this._captured;
	},

	addSecondaryHandlers: function () {
		if (!this.documentTarget)
			return;

		// Firefox mobile and a few iOS devices treat a few events on the root element as passive by default
		// https://stackoverflow.com/a/49853392/3569421
		// https://stackoverflow.com/a/57076149/3569421
		this.documentTarget.addEventListener(this.documentMoveEvent, this.boundDocumentMove, { capture: true, passive: false });
		this.documentTarget.addEventListener(this.documentUpEvent, this.boundDocumentUp, true);
		if (this.documentCancelEvent)
			this.documentTarget.addEventListener(this.documentCancelEvent, this.boundDocumentUp, true);
	},

	removeSecondaryHandlers: function () {
		if (!this.documentTarget)
			return;

		if (this.boundDocumentUp) {
			this.documentTarget.removeEventListener(this.documentUpEvent, this.boundDocumentUp, true);
			if (this.documentCancelEvent)
				this.documentTarget.removeEventListener(this.documentCancelEvent, this.boundDocumentUp, true);
		}

		if (this.boundDocumentMove)
			this.documentTarget.removeEventListener(this.documentMoveEvent, this.boundDocumentMove, true);
	},

	extraTouchStart: function (e) {
		if (e.target === this.element || (this.outsidePointerHandler && this.outsidePointerHandler(e)))
			return cancelEvent(e);
	},

	pointerDown: function (e) {
		if (this.pointerId >= 0 && e.pointerType !== "mouse")
			return cancelEvent(e);

		var ret = this.mouseDown(e);

		if (this._captured)
			this.pointerId = e.pointerId;

		return ret;
	},

	pointerMove: function (e) {
		if (!this._captured || e.pointerId !== this.pointerId)
			return;

		return this.mouseMove(e);
	},

	pointerUp: function (e) {
		if (!this._captured || e.pointerId !== this.pointerId)
			return;

		this.pointerId = -1;

		return this.mouseUp(e);
	},

	touchStart: function (e) {
		if (e.touches.length > 1)
			return;

		if (this.pointerId >= 0)
			this.touchEnd(e);

		this.pointerId = 1;

		e.clientX = e.touches[0].clientX;
		e.clientY = e.touches[0].clientY;

		var ret = this.mouseDown(e);
		if (ret === undefined)
			this.pointerId = -1;

		return ret;
	},

	touchMove: function (e) {
		if (!this._captured || e.touches.length > 1)
			return;

		e.clientX = e.touches[0].clientX;
		e.clientY = e.touches[0].clientY;

		return this.mouseMove(e);
	},

	touchEnd: function (e) {
		if (!this._captured || this.pointerId < 0)
			return;

		this.pointerId = -1;

		return this.mouseUp(e);
	},

	mouseDown: function (e) {
		this.mouseUp(e);

		if (e.button || (e.target && e.target !== this.element && (!this.outsidePointerHandler || !this.outsidePointerHandler(e))))
			return;

		if (this.downCallback && !this.downCallback(e))
			return cancelEvent(e);

		this._captured = true;
		if (this.lazy)
			this.addSecondaryHandlers();

		return cancelEvent(e);
	},

	mouseMove: function (e) {
		if (!this._captured)
			return;

		if (this.moveCallback)
			this.moveCallback(e);

		return cancelEvent(e);
	},

	mouseUp: function (e) {
		if (!this._captured)
			return;

		this._captured = false;
		if (this.lazy)
			this.removeSecondaryHandlers();

		if (this.upCallback)
			this.upCallback(e);

		return cancelEvent(e);
	}
};

// Resize
(function () {
	var bar = _ID("bar"),
		barVisible = true,
		barDrag = false,
		barDragX = 0,
		toolbarLabelsHidden = false,
		barX = (window.innerWidth >> 1),
		downCallback = function (e) {
			var rect = bar.getBoundingClientRect();
			barDragX = (e.clientX - rect.left) | 0;
			barDrag = true;
			document.body.style.cursor = "ew-resize";
			editorContainer.style.cursor = "ew-resize";
			iframe.style.cursor = "ew-resize";
			bar.className = "editor-bar editor-bar-drag";
			lockUI(true);
			return true;
		},
		moveCallback = function (e) {
			if (!barDrag)
				return;
			var x = (e.clientX - barDragX) | 0;
			if (barX !== x) {
				barX = x;
				window.resizeWindow();
			}
		},
		upCallback = function (e) {
			if (!barDrag)
				return;
			barDrag = false;
			document.body.style.cursor = "";
			editorContainer.style.cursor = "";
			iframe.style.cursor = "";
			bar.className = "editor-bar";
			lockUI(false);
		},
		pointerHandler = new PointerHandler(bar, downCallback, moveCallback, upCallback, false);

	window.setBarVisibility = function (visible) {
		barVisible = visible;
		if (visible) {
			bar.style.display = "block";
			iframe.style.display = "";
			resizeWindow();
		} else {
			bar.style.display = "none";
			iframe.style.display = "none";
			editorContainer.style.width = "100%";
			if (editorNeedsResize)
				editor.resize();
		}
	};

	window.resizeWindow = function () {
		if (!barVisible)
			return;
		var width = (window.innerWidth | 0);
		var editorWidth = barX, iframeWidth = width - editorWidth - 8;
		if (iframeWidth < 150) {
			iframeWidth = 150;
			editorWidth = width - iframeWidth - 8;
		}
		if (editorWidth < 330) {
			editorWidth = 330;
			iframeWidth = width - editorWidth - 8;
		}
		if (window.toolbar) {
			if (editorWidth < 490) {
				if (!toolbarLabelsHidden) {
					toolbarLabelsHidden = true;
					toolbar.className = "editor-toolbar hidden-labels";
				}
			} else {
				if (toolbarLabelsHidden) {
					toolbarLabelsHidden = false;
					toolbar.className = "editor-toolbar";
				}
			}
		}
		editorContainer.style.width = editorWidth + "px";
		bar.style.left = editorContainer.style.width;
		iframe.style.left = (width - iframeWidth) + "px";
		iframe.style.width = iframeWidth + "px";
		if (editorNeedsResize)
			editor.resize();
	}

	window.onresize = window.resizeWindow;

	bar.style.display = "block";
})();
