"use strict";

window.isEmpty = function (x) {
	return (x === undefined || x === null);
};
window.seal$ = function (obj) {
	if (Object.seal)
		Object.seal(obj);
	return obj;
};
window.freeze$ = function (obj) {
	if (Object.freeze)
		Object.freeze(obj);
	return obj;
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
window.parseQueryString = function () {
	var i, pair, assoc = {}, keyValues = location.search.substring(1).split("&");
	for (i in keyValues) {
		pair = keyValues[i].split("=");
		if (pair.length > 1) {
			assoc[decodeURIComponent(pair[0].replace(/\+/g, " "))] = decodeURIComponent(pair[1].replace(/\+/g, " "));
		}
	}
	window.queryString = assoc;
	return assoc;
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
		Notification.error("Infelizmente seu navegador não suporta essa funcionalidade \uD83D\uDE22", true);
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
				Notification.error("Ocorreu um erro durante o download dos dados \uD83D\uDE22", true);
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

// Query String and PWA
(function () {
	window.queryString = "";
	window.isPWA = false;

	(function () {
		var i, pair, assoc = {}, keyValues = location.search.substr(1).split("&");
		for (i = keyValues.length - 1; i >= 0; i--) {
			pair = keyValues[i].split("=");
			assoc[decodeURIComponent(pair[0].replace(/\+/g, " "))] = (pair.length === 1 ? "" : decodeURIComponent(pair[1].replace(/\+/g, " ")));
		}
		window.queryString = assoc;
		window.isPWA = ("pwa" in window.queryString);
	})();
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
		addString("PreviewPage", "Visualizar Página");
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
		addString("Name", "Nome");
		addString("Value", "Valor");
		addString("EditAttribute", "Editar Atributo");
		addString("AttributeHelp", "Ajuda do Atributo");
		addString("Move", "Mover");
		addString("Duplicate", "Duplicar");
		addString("Delete", "Excluir");
		addString("ElementName", "Nome do Elemento");
		addString("FindElement", "Localizar Elemento");
		addString("ChangeElement", "Alterar Elemento");
		addString("EditAttributes", "Editar Atributos");
		addString("Create", "Criar");
		addString("CreateElement", "Criar Elemento");
		addString("CreateRule", "Criar Regra");
		addString("CreateAttribute", "Criar Atributo");
		addString("CreateText", "Criar Texto");
		addString("CreateComment", "Criar Comentário");
		addString("LoadImage", "Carregar Imagem");
		addString("SimpleMode", "Modo Simples");
		addString("AdvancedMode", "Modo Avançado");
		addString("UseLoremIpsum", "Utilizar Parágrafo de Lorem Ipsum");
		addString("PlaceholderText", "[Digite seu texto aqui]");
		addString("ErrorBlockInsideInline", "Um elemento block não pode ser filho de um elemento inline \uD83D\uDE22");
		addString("ErrorInlineParentBlock", "Um elemento inline não pode ser pai de um elemento block \uD83D\uDE22");
		addString("ErrorNewElementMustHaveChildren", "O novo elemento também deve poder ter filhos \uD83D\uDE22");
		addString("ErrorNewElementMustNotHaveChildren", "O novo elemento também não pode ter filhos \uD83D\uDE22");
		addString("ErrorNoFile", "Seu browser não oferece suporte a acesso avançado de arquivos \uD83D\uDE22");
		addString("ErrorFileTooLarge", "Por favor, escolha uma imagem com tamanho de até 1 MiB \uD83D\uDE22");
		addString("ErrorFileLoad", "Ocorreu um erro ao ler o arquivo \uD83D\uDE22");
		addString("ErrorInvalidHTML", "O arquivo escolhido não parece ser um arquivo HTML válido \uD83D\uDE22");
		addString("ErrorInvalidChar", "Você não pode digitar os símbolos < ou > aqui. Para mais informações, por favor, veja o link \"Entidades HTML\" \uD83D\uDE22");
		addString("ConfirmQuit", "Deseja mesmo sair da página? Você perderá o documento atual.");
		addString("ConfirmClose", "Deseja mesmo continuar? Você perderá as alterações não salvas.");
		addString("MoveMessage", "Clique para onde deseja mover o elemento ou tecle Esc para cancelar");
		addString("MoveMessageCreateElement", "Clique onde deseja criar o novo elemento ou tecle Esc para cancelar");
		addString("MoveMessageCreateText", "Clique onde deseja criar o novo texto ou tecle Esc para cancelar");
		addString("MoveMessageCreateComment", "Clique onde deseja criar o novo comentário ou tecle Esc para cancelar");
		addString("MoveMessageCreateRule", "Clique onde deseja criar a nova regra ou tecle Esc para cancelar");
		addString("MoveMessageCreateAttribute", "Clique onde deseja criar o novo atributo ou tecle Esc para cancelar");
		addString("HideChildren", "Ocultar Filhos");
		addString("ShowChildren", "Mostrar Filhos");
		addString("ElementHelp", "Ajuda do Elemento");
		addString("MoreHelpLinks", "Mais Links de Ajuda");
		addString("HTMLEntities", "Entidades HTML");
		addString("PageTitle", "Título da Página");
		addString("CSSTab", "Este conteúdo está na aba CSS");
		addString("LoadExample", "Abrir Exemplo");
		addString("HTMLLink", "Elemento HTML link");
		addString("GoogleFontsExample", "Exemplo: <link href=\"...\" />");
		addString("GoogleFonts", "Google Fonts");
		addString("GoogleFontsEllipsis", "Google Fonts\u2026");
		addString("AddBootstrap", "Adicionar Bootstrap 3");
		addString("RemoveBootstrap", "Remover Bootstrap 3");
		addString("ExampleFile", "/labs-editor/examplePt.html");
		addString("ExampleFileHTML", "/labs-editor/examplePt-html.html");
		addString("Install", "Instalar Editor\u2026");
		addString("InstallHTML", "Instalar Editor (HTML)\u2026");
		addString("ShowDecoration", "Exibir HTML Completo");
		addString("HideDecoration", "Ocultar HTML Completo");
		addString("Libraries", "Bibliotecas");
		addString("LibrariesEllipsis", "Bibliotecas\u2026");
	} else {
		addString("PleaseWait", "Please wait...");
		addString("OK", "OK");
		addString("Cancel", "Cancel");
		addString("Close", "Close");
		addString("Menu", "Menu");
		addString("New", "New");
		addString("Load", "Load");
		addString("Save", "Save");
		addString("PreviewPage", "Preview Page");
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
		addString("Name", "Name");
		addString("Value", "Value");
		addString("EditAttribute", "Edit Attribute");
		addString("AttributeHelp", "Attribute Help");
		addString("Move", "Move");
		addString("Duplicate", "Duplicate");
		addString("Delete", "Delete");
		addString("ElementName", "Element Name");
		addString("FindElement", "Find Element");
		addString("ChangeElement", "Change Element");
		addString("EditAttributes", "Edit Attributes");
		addString("Create", "Create");
		addString("CreateElement", "Create Element");
		addString("CreateRule", "Create Rule");
		addString("CreateAttribute", "Create Attribute");
		addString("CreateText", "Create Text");
		addString("CreateComment", "Create Comment");
		addString("LoadImage", "Load Image");
		addString("SimpleMode", "Simple Mode");
		addString("AdvancedMode", "Advanced Mode");
		addString("UseLoremIpsum", "Use Lorem Ipsum Paragraph");
		addString("PlaceholderText", "[Enter your text here]");
		addString("ErrorBlockInsideInline", "A block element cannot be a child of an inline element \uD83D\uDE22");
		addString("ErrorInlineParentBlock", "An inline element cannot be the parent of a block element \uD83D\uDE22");
		addString("ErrorNewElementMustHaveChildren", "The new element must also be able to have children \uD83D\uDE22");
		addString("ErrorNewElementMustNotHaveChildren", "The new element must also not be able to have children \uD83D\uDE22");
		addString("ErrorNoFile", "Your browser does not support advanced file access \uD83D\uDE22");
		addString("ErrorFileTooLarge", "Please, select an image with at most 1 MiB \uD83D\uDE22");
		addString("ErrorFileLoad", "An error occurred while reading the file \uD83D\uDE22");
		addString("ErrorInvalidHTML", "The selected file does not seem to be a valid HTML file \uD83D\uDE22");
		addString("ErrorInvalidChar", "You cannot enter the symbols < or > here. For more information, please, refer to the \"HTML Entities\" link below \uD83D\uDE22");
		addString("ConfirmQuit", "Do you really want to quit? You will lose unsaved information.");
		addString("ConfirmClose", "Do you really want to continue? You will lose unsaved information.");
		addString("MoveMessage", "Click where you wish to move the element to or press Esc to cancel");
		addString("MoveMessageCreateElement", "Click where you wish to create the new element or press Esc to cancel");
		addString("MoveMessageCreateText", "Click where you wish to create the new text or press Esc to cancel");
		addString("MoveMessageCreateComment", "Click where you wish to create the new comment or press Esc to cancel");
		addString("MoveMessageCreateRule", "Click where you wish to create the new rule or press Esc to cancel");
		addString("MoveMessageCreateAttribute", "Click where you wish to create the new attribute or press Esc to cancel");
		addString("HideChildren", "Hide Children");
		addString("ShowChildren", "Show Children");
		addString("ElementHelp", "Element Help");
		addString("MoreHelpLinks", "More Help Links");
		addString("HTMLEntities", "HTML Entities");
		addString("PageTitle", "Page Title");
		addString("CSSTab", "This content is in the CSS tab");
		addString("LoadExample", "Load Example");
		addString("HTMLLink", "HTML link element");
		addString("GoogleFontsExample", "Example: <link href=\"...\" />");
		addString("GoogleFonts", "Google Fonts");
		addString("GoogleFontsEllipsis", "Google Fonts\u2026");
		addString("AddBootstrap", "Add Bootstrap 3");
		addString("RemoveBootstrap", "Remove Bootstrap 3");
		addString("ExampleFile", "/labs-editor/example.html");
		addString("ExampleFileHTML", "/labs-editor/example-html.html");
		addString("Install", "Install Editor\u2026");
		addString("InstallHTML", "Install Editor (HTML)\u2026");
		addString("ShowDecoration", "Show Full HTML");
		addString("HideDecoration", "Hide Full HTML");
		addString("Libraries", "Libraries");
		addString("LibrariesEllipsis", "Libraries\u2026");
	}

	window.translate = function (key) { return (editorStrings[key] || key); };

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

// Resize
(function () {
	var bar = _ID("bar"),
		barDrag = false,
		barDragX = 0,
		barX = (window.innerWidth >> 1);

	function resizeWindow() {
		var width = (window.innerWidth | 0);
		var editorWidth = barX, iframeWidth = width - editorWidth - 8;
		if (iframeWidth < 150) {
			iframeWidth = 150;
			editorWidth = width - iframeWidth - 8;
		}
		if (editorWidth < 230) {
			editorWidth = 230;
			iframeWidth = width - editorWidth - 8;
		}
		editorContainer.style.width = editorWidth + "px";
		bar.style.left = editorContainer.style.width;
		iframe.style.left = (width - iframeWidth) + "px";
		iframe.style.width = iframeWidth + "px";
	}

	window.onresize = resizeWindow;

	bar.onmousedown = function (e) {
		if (e.button)
			return;
		var rect = bar.getBoundingClientRect();
		barDragX = (e.clientX - rect.left) | 0;
		barDrag = true;
		document.body.style.cursor = "ew-resize";
		editorContainer.style.cursor = "ew-resize";
		iframe.style.cursor = "ew-resize";
		bar.className = "editor-bar editor-bar-drag";
		lockUI(true);
		return cancelEvent(e);
	};

	document.addEventListener("mousemove", function (e) {
		if (!barDrag)
			return;
		var x = (e.clientX - barDragX) | 0;
		if (barX !== x) {
			barX = x;
			resizeWindow();
		}
	}, true);

	document.addEventListener("mouseup", function (e) {
		if (!barDrag)
			return;
		barDrag = false;
		document.body.style.cursor = "";
		editorContainer.style.cursor = "";
		iframe.style.cursor = "";
		bar.className = "editor-bar";
		lockUI(false);
	}, true);

	resizeWindow();
	bar.style.display = "block";
})();
