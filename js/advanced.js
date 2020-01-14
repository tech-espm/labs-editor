"use strict";

// Globals
window.itemLabsEditorTheme = "labs-editor-theme";
window.itemLabsEditorFileListVisible = "labs-editor-file-list-visible";
window.itemLabsEditorConsoleVisible = "labs-editor-console-visible";
window.loading = false;
window.theme = null;
window.editorContainer = _ID("editorContainer");
window.editorNeedsResize = true;
window.editor = null;
window.editorActionFileLoad = _ID("editorActionFileLoad");
window.editorFileListBar = _ID("editorFileListBar");
window.editorFileList = _ID("editorFileList");
window.editorFileListVisible = false;
window.editorConsole = _ID("editorConsole");
window.editorConsoleVisible = false;
window.iframe = _ID("iframe");
window.currentEditorMode = null;
window.currentDocument = defaultDocument;
window.currentDocumentDiv = null;
window.documentCacheFileList = null;

// Helper Functions
function confirmClose() {
	return ((editor.session.getUndoManager().isClean() && !localStorage.getItem(itemLabsEditorHasDocument)) || confirm(translate("ConfirmClose")));
}

function resetEditorSession(fileName) {
	var mode = modeFromEditableFileName(fileName);
	if (currentEditorMode !== mode) {
		editor.session.setMode(mode);
		currentEditorMode = mode;
		editor.session.setTabSize(4);
		editor.session.setUseSoftTabs(false);
		editor.session.setUseWrapMode(false);
	}
}

function previewDocument(forceSave) {
	if (loading)
		return;

	saveCurrentDocumentToCache(forceSave, function () {
		clearLog();

		_SA(iframe, "src", documentPathPrefix);
	});
}

function iconFromFileName(fileName) {
	var i = fileName.lastIndexOf(".");
	if (i >= 0) {
		switch (fileName.substr(i + 1).toLowerCase()) {
			case "htm":
			case "html":
			case "js":
			case "json":
				return "fa fa-margin fa-code";
			case "css":
				return "fa fa-margin fa-paint-brush";
			case "md":
				return "fa fa-margin fa-file-text-o";
			case "jpeg":
			case "jpg":
			case "png":
			case "svg":
				return "fa fa-margin fa-image";
			case "aac":
			case "mp3":
			case "ogg":
				return "fa fa-margin fa-music";
			case "mp4":
				return "fa fa-margin fa-video-camera";
		}
	}

	return "fa fa-margin fa-file-o";
}

function typeFromEditableFileName(fileName) {
	var i = fileName.lastIndexOf(".");
	if (i >= 0) {
		switch (fileName.substr(i + 1).toLowerCase()) {
			case "css":
				return "text/css";
			case "htm":
			case "html":
				return "text/html";
			case "js":
				return "text/javascript";
			case "json":
				return "application/json";
			case "md":
				return "text/markdown";
		}
	}

	return "application/octet-stream";
}

function modeFromEditableFileName(fileName) {
	var i = fileName.lastIndexOf(".");
	if (i >= 0) {
		switch (fileName.substr(i + 1).toLowerCase()) {
			case "css":
				return "ace/mode/css";
			case "htm":
			case "html":
				return "ace/mode/html";
			case "js":
				return "ace/mode/javascript";
			case "json":
				return "ace/mode/json";
			case "md":
				return "ace/mode/markdown";
		}
	}

	return null;
}

function isFileNameEditable(fileName) {
	var i = fileName.lastIndexOf(".");
	if (i >= 0) {
		switch (fileName.substr(i + 1).toLowerCase()) {
			case "css":
			case "htm":
			case "html":
			case "js":
			case "json":
			case "md":
				return true;
		}
	}

	return false;
}

// Cache Functions
function loadDocumentFromCache(fileName, showNotification) {
	if (loading)
		return;

	loading = true;
	Notification.wait();

	function loadError(reason) {
		loading = false;
		Notification.error(translate("ErrorFileLoad"));
	}

	function finishLoading(value) {
		loading = false;
		if (showNotification && documentRequiresReminderNotification)
			Notification.success(translate("RememberToAddFileToMenu"), true);
		else
			Notification.hide();

		resetEditorSession(fileName);

		if (currentDocumentDiv)
			currentDocumentDiv.className = "editor-html-file-list-item";
		currentDocumentDiv = _ID("documentDiv" + fileName);
		currentDocumentDiv.className = "editor-html-file-list-item current";
		currentDocument = fileName;
		editor.session.setValue(value);
		editor.session.getUndoManager().reset();
		editor.focus();
	}

	caches.open(documentCacheName).then(function (cache) {
		cache.match(documentPathPrefix + fileName).then(function (response) {
			if (!response)
				finishLoading("");
			else
				response.text().then(finishLoading).catch(loadError);
		}).catch(loadError);
	}).catch(loadError);
}

function deleteFileFromCache(fileName, callback) {
	loading = true;
	Notification.wait();

	caches.open(documentCacheName).then(function (cache) {
		cache.delete(documentPathPrefix + fileName).then(function () {
			loading = false;
			Notification.hide();

			if (callback)
				callback();
		}).catch(function (reason) {
			console.error(reason);

			loading = false;
			Notification.hide();

			if (callback)
				callback();
		});
	});
}

function saveFileToCache(blob, fileName, newFile, controlLoading, callback) {
	if (controlLoading) {
		loading = true;
		Notification.wait();
	}

	caches.open(documentCacheName).then(function (cache) {
		var lcase = fileName.toLowerCase(), actualFileName = fileName;
		if (newFile && (lcase in documentCacheFileList))
			actualFileName = documentCacheFileList[lcase];

		// The spec says there is no need to worry about max-age
		// and other cache-control headers/settings, because the
		// CacheStorage API ignores them... But... Just in case...
		var request = new Request(documentPathPrefix + actualFileName, { cache: "no-store" });

		var headers = new Headers();
		headers.append("Cache-Control", "private, no-store");
		var response = new Response(blob, { headers: headers });

		cache.put(request, response).then(function () {
			if (controlLoading) {
				loading = false;
				Notification.hide();
			}

			if (newFile) {
				documentCacheFileList[lcase] = actualFileName;
				saveDocumentCacheFileList();
			}

			if (callback)
				callback();
		}).catch(function (reason) {
			console.error(reason);

			if (controlLoading) {
				loading = false;
				Notification.hide();
			}

			if (callback)
				callback();
		});
	});
}

function saveFilesToCache(e, files) {
	loading = true;
	Notification.wait();

	var i = -1, file, dt = (e ? e.dataTransfer : null);

	if (dt) {
		files = [];

		if (dt.items) {
			for (i = 0; i < dt.items.length; i++) {
				file = dt.items[i];
				if (file && file.kind === "file")
					files.push(file.getAsFile());
			}
		} else {
			for (i = 0; i < dt.files.length; i++) {
				file = dt.files[i];
				if (file)
					files.push(file);
			}
		}

		i = -1;
	}

	function finishLoading(error) {
		loading = false;
		if (error)
			Notification.error(error, true)
		else
			Notification.hide();
		if (files)
			editorActionFileLoad.value = "";
	}

	function saveNextFile() {
		i++;

		var j, file, fileName;

		if (i >= files.length) {
			finishLoading(null);
			return;
		}
		file = files[i];
		if (!file) {
			saveNextFile();
			return;
		}

		if (file.size > (2 << 20)) {
			finishLoading(translate("ErrorAdvancedFileTooLarge"));
			return;
		}

		j = (fileName = file.name).lastIndexOf("/");
		if (j >= 0) {
			fileName = fileName.substr(j + 1);
		} else {
			j = fileName.lastIndexOf("\\");
			if (j >= 0)
				fileName = fileName.substr(j + 1);
		}
		j = fileName.lastIndexOf(".");
		if (j >= 0)
			fileName = fileName.substr(0, j) + fileName.substr(j).toLowerCase();

		saveFileToCache(file, fileName, true, false, saveNextFile);
	}

	saveNextFile();

	return cancelEvent(e);
}

function saveCurrentDocumentToCache(forceSave, callback) {
	if (loading)
		return;

	if (forceSave || !editor.session.getUndoManager().isClean()) {
		saveFileToCache(new Blob([
			new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
			editor.session.getValue()
		], { type: typeFromEditableFileName(currentDocument) }), currentDocument, false, true, function () {
			editor.session.getUndoManager().markClean();

			if (callback)
				callback();
		});
	} else if (callback) {
		callback();
	}
}

function updateDocumentCacheFileList() {
	var i, fileName, div, button, fileList = [];
	for (fileName in documentCacheFileList)
		fileList.push(documentCacheFileList[fileName]);

	fileList.sort(function (a, b) {
		var adef = a.endsWith(defaultDocumentExtension);
		if (adef === b.endsWith(defaultDocumentExtension))
			return (a < b ? -1 : 1);
		return (adef ? -1 : 1);
	});

	while (editorFileList.firstChild)
		editorFileList.removeChild(editorFileList.firstChild);

	function loadFileFromDiv() {
		if (loading)
			return;

		var fileName = _GA(this, "data-name");
		if (!fileName)
			return;

		if (isFileNameEditable(fileName)) {
			if (fileName !== currentDocument)
				saveCurrentDocumentToCache(false, function () { loadDocumentFromCache(fileName, false); });
		} else {
			window.open(documentPathPrefix + fileName);
		}
	}

	function deleteFileFromDiv(e) {
		if (loading)
			return cancelEvent(e);

		var fileName = _GA(this, "data-name");

		if (!fileName || fileName === defaultDocument)
			return cancelEvent(e);

		_ID("modalDeleteFileLabel").textContent = translate("ConfirmDelete") + fileName + "?";

		_SA(modalDeleteFileOk, "data-name", fileName);

		$("#modalDeleteFile").modal({
			keyboard: true,
			backdrop: true
		});

		return cancelEvent(e);
	}

	for (i = 0; i < fileList.length; i++) {
		fileName = fileList[i];
		if (currentDocument === fileName) {
			div = _CE("div", "editor-html-file-list-item current");
			currentDocumentDiv = div;
		} else {
			div = _CE("div", "editor-html-file-list-item");
		}
		_SA(_SA(_SA(div, "id", "documentDiv" + fileName), "title", fileName), "data-name", fileName);
		div.onclick = loadFileFromDiv;
		_CE("i", iconFromFileName(fileName), div);
		_TXT(fileName, div);
		if (fileName === defaultDocument) {
			button = _CE("button", "btn btn-outline btn-success btn-xs editor-html-file-list-item-button", div);
			button.onclick = function () {
				previewDocument(false);
			};
			_SA(button, "data-name", fileName);
			_SA(button, "title", translate("PreviewPage"));
			_CE("i", "fa fa-play", button);
		} else {
			button = _CE("button", "btn btn-outline btn-danger btn-xs editor-html-file-list-item-button", div);
			button.onclick = deleteFileFromDiv;
			_SA(button, "data-name", fileName);
			_SA(button, "title", translate("Delete"));
			_CE("i", "fa fa-times", button);
		}
		_AC(editorFileList, div);
	}
}

function loadDocumentCacheFileList() {
	documentCacheFileList = null;

	try {
		documentCacheFileList = JSON.parse(localStorage.getItem(itemLabsEditorDocumentFileList));
	} catch (ex) {
		// Just ignore...
	}

	if (!documentCacheFileList || !(defaultDocument in documentCacheFileList)) {
		documentCacheFileList = {};
		documentCacheFileList[defaultDocument] = defaultDocument;
	}

	updateDocumentCacheFileList();
}

function saveDocumentCacheFileList() {
	localStorage.setItem(itemLabsEditorDocumentFileList, JSON.stringify(documentCacheFileList));

	updateDocumentCacheFileList();
}

function loadFilesFromCache() {
	// We must use a separate list (documentCacheFileList) because,
	// in our case, all the responses returned by cache.matchAll()
	// come with their url = "".

	loadDocumentCacheFileList();

	loadDocumentFromCache(defaultDocument, false);
}

// Initial
(function () {
	if (!("CacheStorage" in window) || !("caches" in window) || !("localStorage" in window) || !BlobDownloader.supported)
		alert(translate("BrowserNotSupported"));

	window.onbeforeunload = function () {
		return (!editor.session.getUndoManager().isClean() ? translate("ConfirmQuit") : null);
	};

	theme = localStorage.getItem(itemLabsEditorTheme);
	if (!theme)
		theme = "ace/theme/labs";

	editor = ace.edit("editor");
	editor.setOptions({
		selectionStyle: "text",
		highlightActiveLine: true,
		highlightSelectedWord: true,
		readOnly: false,
		cursorStyle: "ace",
		mergeUndoDeltas: true,
		behavioursEnabled: false,
		wrapBehavioursEnabled: false,
		autoScrollEditorIntoView: false,
		copyWithEmptySelection: false,
		useSoftTabs: false,
		navigateWithinSoftTabs: false,
		enableMultiselect: true,
		hScrollBarAlwaysVisible: false,
		vScrollBarAlwaysVisible: false,
		highlightGutterLine: true,
		animatedScroll: false,
		showInvisibles: false,
		showPrintMargin: false,
		fadeFoldWidgets: false,
		showFoldWidgets: true,
		showLineNumbers: true,
		showGutter: true,
		displayIndentGuides: false,
		scrollPastEnd: false,
		fixedWidthGutter: false,
		theme: theme,
		enableLiveAutocompletion: true,
		keyboardHandler: "ace/keyboard/labs"
	});

	window.resizeWindow();

	setTimeout(function () {
		document.body.style.visibility = "";

		editor.focus();

		editor.resize();
	}, 250);
})();

// Console
(function () {
	if (!editorConsole)
		return;

	window.clearLog = function () {
		while (editorConsole.firstChild)
			editorConsole.removeChild(editorConsole.firstChild);
	}

	function log(msg, error) {
		var div = _CE("div", "editor-html-console-message monospace" + (error ? " editor-html-console-message-error" : ""));
		_TXT(msg, div);
		_IB(editorConsole, div, editorConsole.firstChild);
	}

	window.consoleProxy = {
		clear: window.clearLog,
		info: function (msg) { log(msg, false) },
		warn: function (msg) { log(msg, false) },
		error: function (msg) { log(msg, true) },
		log: function (msg) { log(msg, false) },
		debug: function (msg) { log(msg, false) },
		exception: function (msg) { log(msg, true) },
		trace: function (msg) { log() },
		errorHandler: function (msg, url, line, col, error) { log("Ln " + line + ": " + msg, true); }
	};
})();

// Common Actions
(function () {
	var editorActionToggleFileListLabel = _ID("editorActionToggleFileListLabel"),
		editorActionToggleConsoleLabel = _ID("editorActionToggleConsoleLabel"),
		modalSaveFileName = _ID("modalSaveFileName"),
		modalSaveOk = _ID("modalSaveOk"),
		modalDeleteFileOk = _ID("modalDeleteFileOk"),
		modalCreateDocumentFileName = _ID("modalCreateDocumentFileName"),
		modalCreateDocumentOk = _ID("modalCreateDocumentOk"),
		modalThemeSelect = _ID("modalThemeSelect"),
		modalThemeOk = _ID("modalThemeOk");

	$("#modalSave").on("shown.bs.modal", function () {
		modalSaveFileName.focus();
	});

	$("#modalCreateDocument").on("shown.bs.modal", function () {
		modalCreateDocumentFileName.focus();
	});

	$("#modalTheme").on("shown.bs.modal", function () {
		modalThemeSelect.focus();
	});

	modalSaveFileName.onkeydown = function (e) {
		if (e.key === "Enter" || e.keyCode === 13)
			modalSaveOk.click();
	};

	modalCreateDocumentFileName.onkeydown = function (e) {
		if (e.key === "Enter" || e.keyCode === 13)
			modalCreateDocumentOk.click();
	};

	function newDocument() {
		resetEditorSession(defaultDocument);

		editor.session.setValue(documentNewContent());

		currentDocument = defaultDocument;
		documentCacheFileList = {};
		documentCacheFileList[defaultDocument] = defaultDocument;
		saveDocumentCacheFileList();
		currentDocumentDiv = _ID("documentDiv" + defaultDocument);
		window.clearLog();
		editor.session.getUndoManager().reset();

		_SA(iframe, "src", "about:blank");

		function finished() {
			loading = false;
			Notification.hide();

			saveCurrentDocumentToCache(true);
		}

		loading = true;
		Notification.wait();

		caches.delete(documentCacheName).then(finished).catch(finished);
	}

	_ID("editorPlay").onclick = function () {
		if (loading)
			return;

		window.clearLog();

		if (!localStorage.getItem(itemLabsEditorHasDocument))
			localStorage.setItem(itemLabsEditorHasDocument, "1");

		previewDocument(false);
	};

	_ID("editorActionNew").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		if (!confirmClose())
			return cancelEvent(e);

		newDocument();

		return cancelEvent(e);
	};

	_ID("editorActionLoad").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		//if (!confirmClose())
		//	return cancelEvent(e);

		//editorActionFileLoad.click();

		return cancelEvent(e);
	};

	_ID("editorActionSave").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		//$("#modalSave").modal({
		//	keyboard: true,
		//	backdrop: true
		//});

		return cancelEvent(e);
	};

	function toggleFileList() {
		editorFileListVisible = !editorFileListVisible;
		if (editorFileListVisible) {
			editorActionToggleFileListLabel.textContent = translate("HideFileList");
			_ID("editor").style.left = "200px";
			editorFileListBar.style.display = "block";
			editorFileList.style.display = "block";
		} else {
			editorActionToggleFileListLabel.textContent = translate("ShowFileList");
			_ID("editor").style.left = "";
			editorFileListBar.style.display = "none";
			editorFileList.style.display = "none";
		}
		editor.resize();
	}

	_ID("editorActionToggleFileList").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		toggleFileList();

		if (editorFileListVisible)
			localStorage.setItem(itemLabsEditorFileListVisible, "1");
		else
			localStorage.removeItem(itemLabsEditorFileListVisible);

		return cancelEvent(e);
	};

	function toggleConsole() {
		editorConsoleVisible = !editorConsoleVisible;
		if (editorConsoleVisible) {
			editorActionToggleConsoleLabel.textContent = translate("HideConsole");
			editorFileList.style.bottom = "200px";
			_ID("editor").style.bottom = "200px";
			editorConsole.style.display = "block";
		} else {
			editorActionToggleConsoleLabel.textContent = translate("ShowConsole");
			editorFileList.style.bottom = "";
			_ID("editor").style.bottom = "";
			editorConsole.style.display = "none";
		}
		editor.resize();
	}

	_ID("editorActionToggleConsole").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		toggleConsole();

		if (editorConsoleVisible)
			localStorage.setItem(itemLabsEditorConsoleVisible, "1");
		else
			localStorage.removeItem(itemLabsEditorConsoleVisible);

		return cancelEvent(e);
	};

	_ID("editorActionClearConsole").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		window.clearLog();

		return cancelEvent(e);
	};

	_ID("editorActionTheme").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		modalThemeSelect.value = theme;

		$("#modalTheme").modal({
			keyboard: true,
			backdrop: true
		});

		return cancelEvent(e);
	};

	_ID("btnEditorFileListBarCreateDocument").onclick = function () {
		if (loading)
			return;

		$("#modalCreateDocument").modal({
			keyboard: true,
			backdrop: true
		});
	};

	_ID("btnEditorFileListBarUploadFiles").onclick = function () {
		if (loading)
			return;

		editorActionFileLoad.click();
	};

	editorActionFileLoad.onchange = function () {
		if (loading) {
			editorActionFileLoad.value = "";
			return;
		}

		if (!("files" in editorActionFileLoad)) {
			editorActionFileLoad.value = "";
			Notification.error(translate("ErrorNoFile"), true);
			return;
		}

		if (!editorActionFileLoad.files.length || !editorActionFileLoad.files[0])
			return;

		saveFilesToCache(null, editorActionFileLoad.files);
	};

	modalSaveOk.onclick = function () {
		var fileName = trim(modalSaveFileName.value);
		if (!fileName)
			return;

		if (!BlobDownloader.supported) {
			Notification.error(translate("ErrorNoFile"), true);
			return;
		}

		if (fileName.toLowerCase().indexOf(".htm") < 0)
			fileName += ".html";

		$("#modalSave").modal("hide");

		BlobDownloader.download(fileName, new Blob([
			new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
			editor.session.getValue()
		], { type: "text/html;charset=utf-8" }));

		editor.session.getUndoManager().markClean();
	};

	modalDeleteFileOk.onclick = function () {
		if (loading)
			return;

		var fileName = _GA(modalDeleteFileOk, "data-name");
		if (!fileName)
			return;

		$("#modalDeleteFile").modal("hide");

		deleteFileFromCache(fileName, function () {
			delete documentCacheFileList[fileName.toLowerCase()];
			saveDocumentCacheFileList();

			loadDocumentFromCache(defaultDocument, false);
		});
	};

	modalCreateDocumentOk.onclick = function () {
		if (loading)
			return;

		var fileName = trim(modalCreateDocumentFileName.value);
		if (!fileName)
			return;

		// Force lower case extensions
		var lcase = fileName.toLowerCase(), i = lcase.lastIndexOf("."), ext, fileNameNoExtension, defaultType = false;
		if (i < 0) {
			fileNameNoExtension = fileName;
			fileName += defaultDocumentExtension;
			lcase += defaultDocumentExtension;
			defaultType = true;
		} else {
			ext = lcase.substr(i);
			fileNameNoExtension = fileName.substr(0, i);
			fileName = fileNameNoExtension + ext;
			defaultType = (ext === defaultDocumentExtension);
		}

		if (/\W/.test(fileNameNoExtension) || !modeFromEditableFileName(fileName)) {
			Notification.error(translate("ErrorInvalidFileName"), true);
			return;
		}

		if ((lcase in documentCacheFileList)) {
			Notification.error(translate("ErrorFileAlreadyExists"), true);
			return;
		}

		saveFileToCache(new Blob([
			new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
			(defaultType ? documentNewDocumentContent(fileNameNoExtension) : "\n")
		], { type: typeFromEditableFileName(fileName) }), fileName, true, true, function () {
			$("#modalCreateDocument").modal("hide");

			loadDocumentFromCache(fileName, true);
		});
	};

	modalThemeOk.onclick = function () {
		theme = modalThemeSelect.value;

		localStorage.setItem(itemLabsEditorTheme, theme);

		editor.setTheme(theme);

		$("#modalTheme").modal("hide");
	};

	if (localStorage.getItem(itemLabsEditorHasDocument))
		loadFilesFromCache();
	else
		newDocument();

	if (localStorage.getItem(itemLabsEditorFileListVisible))
		toggleFileList();

	if (localStorage.getItem(itemLabsEditorConsoleVisible))
		toggleConsole();
})();

// Drag and drop
(function () {
	var messageVisible = false, dragTimeout = 0;

	window.addEventListener("dragover", function (e) {
		if (!loading) {
			if (dragTimeout) {
				clearTimeout(dragTimeout);
				dragTimeout = 0;
			}
			if (!messageVisible) {
				messageVisible = true;
				Notification.show(translate("DragMessage"), "info", -1);
			}
		}
		return cancelEvent(e);
	}, true);

	window.addEventListener("dragleave", function (e) {
		if (messageVisible) {
			if (dragTimeout)
				clearTimeout(dragTimeout);
			dragTimeout = setTimeout(function () {
				messageVisible = false;
				dragTimeout = 0;
				Notification.hide();
			}, 500);
		}
		return cancelEvent(e);
	}, true);

	window.addEventListener("drop", function (e) {
		if (dragTimeout) {
			clearTimeout(dragTimeout);
			dragTimeout = 0;
		}
		if (messageVisible) {
			messageVisible = false;
			Notification.hide();
		}

		if (loading)
			return cancelEvent(e);

		return saveFilesToCache(e, null);
	}, true);
})();
