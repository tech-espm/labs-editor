"use strict";
"use strict";

// Globals
window.maximumFileLength = (2 << 20);
window.itemLabsEditorTheme = "labs-editor-theme";
window.itemLabsEditorPopupPreview = "labs-editor-popup-preview";
window.itemLabsEditorFileListVisible = "labs-editor-file-list-visible";
window.itemLabsEditorConsoleVisible = "labs-editor-console-visible";
window.loading = false;
window.theme = null;
window.editorPopupWindowName = "labs-editor-popup-window";
window.editorContainer = _ID("editorContainer");
window.editorNeedsResize = true;
window.editor = null;
window.editorActionFileLoad = _ID("editorActionFileLoad");
window.editorActionZipLoad = _ID("editorActionZipLoad");
window.editorFileListBar = _ID("editorFileListBar");
window.editorFileList = _ID("editorFileList");
window.editorFileListVisible = false;
window.editorConsole = _ID("editorConsole");
window.editorConsoleVisible = false;
window.editorPopupPreview = false;
window.editorPopupWindow = null;
window.iframe = _ID("iframe");
window.currentDocument = defaultDocument;
window.currentDocumentDiv = null;
window.documentCacheFileList = null;

// Helper Functions
function confirmClose() {
	return ((editor.session.getUndoManager().isClean() && !localStorage.getItem(itemLabsEditorHasDocument)) || confirm(translate("ConfirmClose")));
}

function previewDocument(forceSave, fileName) {
	if (loading)
		return;

	saveCurrentDocumentToCache(forceSave, true, function () {
		clearLog();

		var url = ((fileName && fileName !== defaultDocument) ? (documentPathPrefix + fileName) : documentPathPrefix);

		if (editorPopupPreview) {
			editorPopupWindow = window.open(url, editorPopupWindowName);
		} else {
			if (!documentHasBackground)
				iframe.style.backgroundColor = "#fff";
			_SA(iframe, "src", url);
		}
	});
}

function closePreview() {
	if (editorPopupPreview) {
		try {
			if (editorPopupWindow)
				editorPopupWindow.close();
		} catch (ex) {
			// Just ignore...
		} finally {
			editorPopupWindow = null;
		}
	} else {
		_SA(iframe, "src", "about:blank");
		if (!documentHasBackground)
			iframe.style.backgroundColor = "";
	}
}

function fixDarkTheme() {
	var bgColor = null, style = _ID("style-dark-mode");

	switch (theme) {
		case "ace/theme/dracula":
			bgColor = "#282a36";
			break;
		case "ace/theme/mono_industrial":
			bgColor = "#222c28";
			break;
		case "ace/theme/monokai":
			bgColor = "#272822";
			break;
	}

	if (bgColor) {
		_SA(_ID("editorImgLogo"), "src", "../images/logo-dark.png");
		document.body.style.backgroundColor = bgColor;
		if (!style)
			_SA(_SA(_SA(_CE("link", null, document.head), "id", "style-dark-mode"), "rel", "stylesheet"), "href", "../css/style-dark.css?v=1.0.1")
	} else {
		_SA(_ID("editorImgLogo"), "src", "../images/logo.png");
		document.body.style.backgroundColor = "";
		if (style)
			document.head.removeChild(style);
	}
}

// File List Functions
// typeFromLCaseExtension
(function () {
	var mapping = {
		".3g2": "audio/3gpp2",
		".3gp": "audio/3gpp",
		".7z": "application/x-7z-compressed",
		".aac": "audio/aac",
		".abw": "application/x-abiword",
		".arc": "application/x-freearc",
		".avi": "video/x-msvideo",
		".azw": "application/vnd.amazon.ebook",
		".bin": "application/octet-stream",
		".bmp": "image/bmp",
		".bz": "application/x-bzip",
		".bz2": "application/x-bzip2",
		".csh": "application/x-csh",
		".css": "text/css",
		".csv": "text/csv",
		".doc": "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".eot": "application/vnd.ms-fontobject",
		".epub": "application/epub+zip",
		".gif": "image/gif",
		".gz": "application/gzip",
		".htm": "text/html",
		".html": "text/html",
		".ico": "image/vnd.microsoft.icon",
		".ics": "text/calendar",
		".jar": "application/java-archive",
		".jpeg": "image/jpeg",
		".jpg": "image/jpeg",
		".js": "text/javascript",
		".json": "application/json",
		".jsonld": "application/ld+json",
		".markdown": "text/markdown",
		".md": "text/markdown",
		".mid": "audio/midi",
		".midi": "audio/midi",
		".mjs": "text/javascript",
		".mp3": "audio/mpeg",
		".mp4": "video/mp4",
		".mpeg": "video/mpeg",
		".mpkg": "application/vnd.apple.installer+xml",
		".odp": "application/vnd.oasis.opendocument.presentation",
		".ods": "application/vnd.oasis.opendocument.spreadsheet",
		".odt": "application/vnd.oasis.opendocument.text",
		".oga": "audio/ogg",
		".ogg": "audio/ogg",
		".ogv": "video/ogg",
		".ogx": "application/ogg",
		".opus": "audio/opus",
		".otf": "font/otf",
		".pdf": "application/pdf",
		".php": "application/php",
		".png": "image/png",
		".ppt": "application/vnd.ms-powerpoint",
		".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		".rar": "application/x-rar-compressed",
		".rtf": "application/rtf",
		".sh": "application/x-sh",
		".svg": "image/svg+xml",
		".swf": "application/x-shockwave-flash",
		".tar": "application/x-tar",
		".tif": "image/tiff",
		".tiff": "image/tiff",
		".ts": "video/mp2t",
		".ttf": "font/ttf",
		".txt": "text/plain",
		".vsd": "application/vnd.visio",
		".wav": "audio/wav",
		".weba": "audio/webm",
		".webm": "video/webm",
		".webp": "image/webp",
		".woff": "font/woff",
		".woff2": "font/woff2",
		".xhtml": "application/xhtml+xml",
		".xls": "application/vnd.ms-excel",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		".xml": "text/xml",
		".xul": "application/vnd.mozilla.xul+xml",
		".zip": "application/zip"
	};
	window.typeFromLCaseExtension = function (ext) {
		return (mapping[ext] || "application/octet-stream");
	};
})();

function iconFromFileName(fileName) {
	var i = fileName.lastIndexOf(".");
	if (i >= 0) {
		var ext = fileName.substr(i).toLowerCase();
		switch (ext) {
			case ".htm":
			case ".html":
			case ".js":
			case ".json":
			case ".xml":
				return "fa fa-margin fa-code";
			case ".css":
				return "fa fa-margin fa-paint-brush";
			case ".markdown":
			case ".md":
			case ".txt":
				return "fa fa-margin fa-file-text-o";
			default:
				ext = typeFromLCaseExtension(ext);
				if (ext.startsWith("image"))
					return "fa fa-margin fa-image";
				if (ext.startsWith("audio"))
					return "fa fa-margin fa-music";
				if (ext.startsWith("video"))
					return "fa fa-margin fa-video-camera";
				break;
		}
	}

	return "fa fa-margin fa-file-o";
}

function typeFromLCaseFileName(lcase) {
	var i = lcase.lastIndexOf(".");
	return typeFromLCaseExtension((i >= 0) ? lcase.substr(i) : null);
}

function modeFromEditableFileName(fileName) {
	var i = fileName.lastIndexOf(".");
	if (i >= 0) {
		switch (fileName.substr(i).toLowerCase()) {
			case ".css":
				return "ace/mode/css";
			case ".htm":
			case ".html":
				return "ace/mode/html";
			case ".js":
				return "ace/mode/javascript";
			case ".json":
				return "ace/mode/json";
			case ".markdown":
			case ".md":
				return "ace/mode/markdown";
			case ".svg":
				return "ace/mode/svg";
			case ".txt":
				return "ace/mode/plain_text";
			case ".xml":
				return "ace/mode/xml";
		}
	}

	return null;
}

function isFileNameEditable(fileName) {
	var i = fileName.lastIndexOf(".");
	if (i >= 0) {
		switch (fileName.substr(i).toLowerCase()) {
			case ".css":
			case ".htm":
			case ".html":
			case ".js":
			case ".json":
			case ".markdown":
			case ".md":
			case ".svg":
			case ".txt":
			case ".xml":
				return true;
		}
	}

	return false;
}

// Session + File Functions
function activateSession(lcase, fileName) {
	var file, session;
	if (!(file = documentCacheFileList[lcase]) || !(session = file.session))
		return;
	currentDocument = fileName;
	editor.setSession(session);
	editor.focus();
}

function createSession(lcase, contents) {
	var file, session, mode = modeFromEditableFileName(lcase);
	if (!mode)
		return;
	if (!(file = documentCacheFileList[lcase]))
		return;
	session = ace.createEditSession(contents);
	session.setMode(mode);
	session.setTabSize(4);
	session.setUseSoftTabs(false);
	session.setUseWrapMode(false);
	session.getUndoManager().reset();
	file.session = session;
}

function cleanupEditorFiles() {
	if (documentCacheFileList) {
		var i, file;
		for (i in documentCacheFileList) {
			if (!(file = documentCacheFileList[i]) || !file.session)
				continue;
			file.session = null;
		}
	}
	documentCacheFileList = {};
}

function addEditorFile(lcase, fileName) {
	if (!(lcase in documentCacheFileList))
		documentCacheFileList[lcase] = {
			fileName: fileName,
			session: null
		};
}

function getEditorFileName(lcase) {
	var file;
	return ((file = documentCacheFileList[lcase]) && file.fileName);
}

function getEditorSession(lcase) {
	var file;
	return ((file = documentCacheFileList[lcase]) && file.session);
}

function deleteEditorFile(lcase) {
	var file;
	if (!(file = documentCacheFileList[lcase]))
		return;
	file.session = null;
	delete documentCacheFileList[lcase];
}

function resetEditorFiles(controlLoading, initialContents, callback) {
	if (controlLoading) {
		loading = true;
		Notification.wait();
	}

	closePreview();

	cleanupEditorFiles();
	addEditorFile(defaultDocument, defaultDocument);
	createSession(defaultDocument, initialContents || documentNewContent());
	activateSession(defaultDocument, defaultDocument);
	saveDocumentCacheFileList();
	currentDocumentDiv = _ID("documentDiv" + defaultDocument);
	window.clearLog();

	function finished() {
		saveCurrentDocumentToCache(true, false, function () {
			if (controlLoading) {
				loading = false;
				Notification.hide();
			}

			editor.focus();

			if (callback)
				callback();
		});
	}

	caches.delete(documentCacheName).then(finished, finished);
}

// Cache Functions
function loadDocumentFromCache(fileName, showNotification, controlLoading, ignoreSession, callback) {
	if (controlLoading) {
		if (loading)
			return;

		loading = true;
		Notification.wait();
	}

	var lcase = fileName.toLowerCase(), session = (ignoreSession ? null : getEditorSession(lcase));

	function loadError(reason) {
		if (controlLoading)
			loading = false;

		Notification.error(translate("ErrorFileLoad"));

		if (callback)
			callback();
	}

	function finishLoading(value) {
		if (controlLoading)
			loading = false;

		if (showNotification && documentRequiresReminderNotification && fileName.endsWith(defaultDocumentExtension))
			Notification.success(translate("RememberToAddFileToMenu"), true);
		else
			Notification.hide();

		if (currentDocumentDiv)
			currentDocumentDiv.className = "editor-html-file-list-item";
		currentDocumentDiv = _ID("documentDiv" + fileName);
		currentDocumentDiv.className = "editor-html-file-list-item current";

		if (!session)
			createSession(lcase, value);

		activateSession(lcase, fileName);

		if (callback)
			callback();
	}

	if (session) {
		finishLoading(null);
	} else {
		caches.open(documentCacheName).then(function (cache) {
			cache.match(documentPathPrefix + fileName).then(function (response) {
				if (!response)
					finishLoading("");
				else
					response.text().then(finishLoading, loadError);
			}, loadError);
		}, loadError);
	}
}

function deleteFileFromCache(fileName, controlLoading, callback) {
	if (controlLoading) {
		loading = true;
		Notification.wait();
	}

	caches.open(documentCacheName).then(function (cache) {
		cache.delete(documentPathPrefix + fileName).then(function () {
			if (controlLoading) {
				loading = false;
				Notification.hide();
			}

			if (callback)
				callback();
		}, function (reason) {
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

function saveFileToCache(blob, fileName, newFile, controlLoading, callback) {
	if (controlLoading) {
		loading = true;
		Notification.wait();
	}

	caches.open(documentCacheName).then(function (cache) {
		var actualFileName = fileName.trim(), lcase = actualFileName.toLowerCase();
		if (newFile && (lcase in documentCacheFileList))
			actualFileName = getEditorFileName(lcase);

		// The spec says there is no need to worry about max-age
		// and other cache-control headers/settings, because the
		// CacheStorage API ignores them... But... Just in case...
		var request = new Request(documentPathPrefix + actualFileName, { cache: "no-store" });

		var headers = new Headers();
		headers.append("Cache-Control", "private, no-store");
		var response = new Response((!blob.type || blob.type === "text/html" || blob.type === "application/octet-stream") ? blob.slice(0, blob.size, typeFromLCaseFileName(lcase)) : blob, { headers: headers });

		cache.put(request, response).then(function () {
			if (controlLoading) {
				loading = false;
				Notification.hide();
			}

			if (newFile) {
				addEditorFile(lcase, actualFileName);
				saveDocumentCacheFileList();
			}

			if (callback)
				callback();
		}, function (reason) {
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

	function finishSaving(error) {
		loading = false;
		if (error)
			Notification.error(error, true);
		else
			Notification.hide();
		if (files)
			editorActionFileLoad.value = "";
	}

	function saveNextFile() {
		i++;

		var j, file, fileName;

		if (i >= files.length) {
			finishSaving(null);
			return;
		}
		file = files[i];
		if (!file) {
			saveNextFile();
			return;
		}

		if (file.size > maximumFileLength) {
			finishSaving(translate("ErrorAdvancedFileTooLarge"));
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

function saveCurrentDocumentToCache(forceSave, controlLoading, callback) {
	if (forceSave || !editor.session.getUndoManager().isClean()) {
		saveFileToCache(new Blob([
			new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
			editor.session.getValue()
		], { type: typeFromLCaseFileName(currentDocument) }), currentDocument, false, controlLoading, function () {
			editor.session.getUndoManager().markClean();

			if (callback)
				callback();
		});
	} else if (callback) {
		callback();
	}
}

function updateDocumentCacheFileList() {
	var i, isDefault = false, hasPlayButton = false, hasTwoButtons = false, fileName, div, button, fileList = [];
	for (fileName in documentCacheFileList)
		fileList.push({
			lcase: fileName,
			fileName: getEditorFileName(fileName)
		});

	fileList.sort(function (a, b) {
		var adef = a.lcase.endsWith(defaultDocumentExtension);
		if (adef === b.lcase.endsWith(defaultDocumentExtension))
			return (a.lcase < b.lcase ? -1 : 1);
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
				saveCurrentDocumentToCache(false, true, function () { loadDocumentFromCache(fileName, false, true, false, null); });
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

	function preview() {
		previewDocument(false, _GA(this, "data-name"));
	}

	for (i = 0; i < fileList.length; i++) {
		fileName = fileList[i].fileName;
		isDefault = (fileName === defaultDocument);
		hasPlayButton = (fileName === defaultDocument || (documentCanPreviewAllDefaultFiles && fileName.endsWith(defaultDocumentExtension)) || fileName.endsWith(".svg"));
		hasTwoButtons = (!isDefault && hasPlayButton);
		if (currentDocument === fileName) {
			div = _CE("div", "editor-html-file-list-item current" + (hasTwoButtons ? " editor-html-file-list-item-two-buttons" : ""));
			currentDocumentDiv = div;
		} else {
			div = _CE("div", "editor-html-file-list-item" + (hasTwoButtons ? " editor-html-file-list-item-two-buttons" : ""));
		}
		_SA(_SA(_SA(div, "id", "documentDiv" + fileName), "title", fileName), "data-name", fileName);
		div.onclick = loadFileFromDiv;
		_CE("i", iconFromFileName(fileName), div);
		_TXT(fileName, div);
		if (!isDefault) {
			button = _CE("button", "btn btn-outline btn-danger btn-xs " + (hasTwoButtons ? "editor-html-file-list-item-button-2" : "editor-html-file-list-item-button"), div);
			button.onclick = deleteFileFromDiv;
			_SA(button, "data-name", fileName);
			_SA(button, "title", translate("Delete"));
			_CE("i", "fa fa-times", button);
		}
		if (hasPlayButton) {
			button = _CE("button", "btn btn-outline btn-success btn-xs editor-html-file-list-item-button", div);
			button.onclick = preview;
			_SA(button, "data-name", fileName);
			_SA(button, "title", translate("PreviewPage"));
			_CE("i", "fa fa-play", button);
		}
		_AC(editorFileList, div);
	}
}

function loadDocumentCacheFileList() {
	var i, array;

	try {
		array = JSON.parse(localStorage.getItem(itemLabsEditorDocumentFileList));
	} catch (ex) {
		// Just ignore...
	}

	cleanupEditorFiles();

	if (array) {
		for (i = array.length - 1; i >= 0; i--)
			addEditorFile(array[i].toLowerCase(), array[i]);
	}

	if (!(defaultDocument in documentCacheFileList))
		addEditorFile(defaultDocument, defaultDocument);

	updateDocumentCacheFileList();
}

function saveDocumentCacheFileList() {
	var i, array = [];

	for (i in documentCacheFileList)
		array.push(documentCacheFileList[i].fileName);

	if (!localStorage.getItem(itemLabsEditorHasDocument))
		localStorage.setItem(itemLabsEditorHasDocument, "1");
	localStorage.setItem(itemLabsEditorDocumentFileList, JSON.stringify(array));

	updateDocumentCacheFileList();
}

function loadFilesFromCache() {
	// We must use a separate list (documentCacheFileList) because,
	// in our case, all the responses returned by cache.matchAll()
	// come with their url = "".

	loadDocumentCacheFileList();

	loadDocumentFromCache(defaultDocument, false, true, true, null);
}

function loadFilesFromZip(zipFile) {
	loading = true;
	Notification.wait();

	function finishLoading(error) {
		loadDocumentFromCache(defaultDocument, false, false, true, function () {
			loading = false;
			if (error)
				Notification.error(error, true);
			else
				Notification.hide();
			editorActionZipLoad.value = "";
		});
	}

	function loadError(reason) {
		finishSaving(translate("ErrorFileSave"));
	}

	JSZip.loadAsync(zipFile).then(function (zip) {
		resetEditorFiles(false, null, function () {
			var i = -1, lengthError = false, zipEntries = [];

			zip.forEach(function (relativePath, zipEntry) {
				if (documentExtraZipFiles && documentExtraZipFiles.length) {
					var j, lcase = zipEntry.name.toLowerCase();
					for (j = documentExtraZipFiles.length - 1; j >= 0; j--) {
						if (lcase === documentExtraZipFiles[j].nameInZip)
							return;
					}
				}
				if (zipEntry._data.uncompressedSize > maximumFileLength)
					lengthError = true;
				else
					zipEntries.push(zipEntry);
			});

			function loadNextZipEntry() {
				i++;

				if (i >= zipEntries.length) {
					finishLoading(lengthError ? translate("ErrorZipContainsFileTooLarge") : null);
					return;
				}

				zipEntries[i].async("blob").then(function (blob) {
					saveFileToCache(blob, zipEntries[i].name, true, false, loadNextZipEntry);
				}, loadError);
			}

			loadNextZipEntry();
		});
	}, loadError);
}

function saveFilesToZip(zipFileName) {
	loading = true;
	Notification.wait();

	saveCurrentDocumentToCache(false, false, function () {
		var i, files = [], zip = new JSZip();

		if (documentExtraZipFiles && documentExtraZipFiles.length)
			files.push.apply(files, documentExtraZipFiles)

		for (i in documentCacheFileList) {
			files.push({
				path: null, // Load from cache
				nameInZip: getEditorFileName(i)
			});
		}

		function finishSaving(error) {
			loading = false;
			if (error)
				Notification.error(error, true);
			else
				Notification.hide();
		}

		function saveError(reason) {
			finishSaving(translate("ErrorFileSave"));
		}

		i = -1;

		function saveNextFile() {
			i++;

			var file, fileName;

			function saveResponse(response) {
				if (!response)
					saveNextFile();
				else
					response.blob().then(function (blob) {
						zip.file(fileName, blob, { binary: true });
						saveNextFile();
					}, saveError);
			}

			if (i >= files.length) {
				zip.generateAsync({ type: "blob" }).then(function (content) {
					BlobDownloader.download(zipFileName, content);
					finishSaving(null);
				}, saveError);
				return;
			}
			file = files[i];
			fileName = file.nameInZip;

			if (!file.path) {
				// Load from cache
				caches.open(documentCacheName).then(function (cache) {
					cache.match(documentPathPrefix + fileName).then(saveResponse, saveError);
				}, saveError);
			} else {
				// Load from request
				fetch(new Request(file.path, { cache: "no-store" })).then(saveResponse, saveError);
			}
		}

		saveNextFile();
	});
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

	fixDarkTheme();

	window.resizeWindow();

	setTimeout(function () {
		document.body.style.visibility = "";

		editor.focus();

		// Workaround to remove a 1-pixel flick in the
		// first time the window is actually resized...

		var w = editorContainer.style.width;

		editor.resize();

		if (w === "100%") {
			editorContainer.style.width = "99%";
			editor.resize();
		} else {
			editorContainer.style.width = (parseInt(w) - 1) + "px";
			editor.resize();
		}

		editorContainer.style.width = w;
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
	var editorTogglePopupPreview = _ID("editorTogglePopupPreview"),
		editorActionToggleFileListLabel = _ID("editorActionToggleFileListLabel"),
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

	function newWorkspace() {
		resetEditorFiles(true, null, null);
	}

	_ID("editorPlay").onclick = function () {
		if (loading)
			return;

		window.clearLog();

		previewDocument(false, null);
	};

	_ID("editorStop").onclick = closePreview;

	function togglePopupPreview() {
		closePreview();

		editorPopupPreview = !editorPopupPreview;

		setBarVisibility(!editorPopupPreview);

		if (editorPopupPreview)
			_SA(editorTogglePopupPreview, "title", translate("PreviewInAnotherWindow")).innerHTML = '<span class="fa fa-window-restore"></span>';
		else
			_SA(editorTogglePopupPreview, "title", translate("PreviewInTheSameWindow")).innerHTML = '<span class="fa fa-window-maximize"></span>';
	}

	editorTogglePopupPreview.onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		togglePopupPreview();

		if (editorPopupPreview)
			localStorage.setItem(itemLabsEditorPopupPreview, "1");
		else
			localStorage.removeItem(itemLabsEditorPopupPreview);

		return cancelEvent(e);
	};

	_ID("editorActionNew").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		if (!confirmClose())
			return cancelEvent(e);

		newWorkspace();

		return cancelEvent(e);
	};

	_ID("editorActionLoad").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		if (!confirmClose())
			return cancelEvent(e);

		editorActionZipLoad.click();

		return cancelEvent(e);
	};

	_ID("editorActionSave").onclick = function (e) {
		if (loading)
			return cancelEvent(e);

		$("#editorMenuDropdown").dropdown("toggle");

		$("#modalSave").modal({
			keyboard: true,
			backdrop: true
		});

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

		if (!editorActionFileLoad.files.length || !editorActionFileLoad.files[0]) {
			editorActionFileLoad.value = "";
			return;
		}

		saveFilesToCache(null, editorActionFileLoad.files);
	};

	editorActionZipLoad.onchange = function () {
		if (loading) {
			editorActionZipLoad.value = "";
			return;
		}

		if (!("files" in editorActionZipLoad)) {
			editorActionZipLoad.value = "";
			Notification.error(translate("ErrorNoFile"), true);
			return;
		}

		var zipFile;

		if (!editorActionZipLoad.files.length || !(zipFile = editorActionZipLoad.files[0])) {
			editorActionZipLoad.value = "";
			return;
		}

		if (!zipFile.name.toLowerCase().endsWith(".zip")) {
			editorActionZipLoad.value = "";
			Notification.error(translate("ErrorInvalidFileName"), true);
			return;
		}

		loadFilesFromZip(zipFile);
	};

	modalSaveOk.onclick = function () {
		if (loading)
			return;

		var fileName = trim(modalSaveFileName.value);
		if (!fileName)
			return;

		if (fileName.toLowerCase().indexOf(".zip") < 0)
			fileName += ".zip";

		$("#modalSave").modal("hide");

		saveFilesToZip(fileName);
	};

	modalDeleteFileOk.onclick = function () {
		if (loading)
			return;

		var fileName = _GA(modalDeleteFileOk, "data-name");
		if (!fileName)
			return;

		$("#modalDeleteFile").modal("hide");

		loading = true;
		Notification.wait();

		saveCurrentDocumentToCache(false, false, function () {
			deleteFileFromCache(fileName, false, function () {
				deleteEditorFile(fileName.toLowerCase());
				saveDocumentCacheFileList();

				if (fileName === currentDocument) {
					loadDocumentFromCache(defaultDocument, false, false, false, function () {
						loading = false;
						Notification.hide();
					});
				} else {
					loading = false;
					Notification.hide();

					editor.focus();
				}
			});
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
			ext = defaultDocumentExtension;
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

		loading = true;
		Notification.wait();

		saveCurrentDocumentToCache(false, false, function () {
			saveFileToCache(new Blob([
				new Uint8Array([0xEF, 0xBB, 0xBF]), // UTF-8 BOM
				(defaultType ? documentNewDocumentContent(fileNameNoExtension) : "\n")
			], { type: typeFromLCaseExtension(ext) }), fileName, true, false, function () {
				$("#modalCreateDocument").modal("hide");

				loadDocumentFromCache(fileName, true, false, true, function () {
					loading = false;
					Notification.hide();
				});
			});
		});
	};

	modalThemeOk.onclick = function () {
		theme = modalThemeSelect.value;

		localStorage.setItem(itemLabsEditorTheme, theme);

		editor.setTheme(theme);

		fixDarkTheme();

		$("#modalTheme").modal("hide");
	};

	if (localStorage.getItem(itemLabsEditorHasDocument))
		loadFilesFromCache();
	else
		newWorkspace();

	if (localStorage.getItem(itemLabsEditorPopupPreview))
		togglePopupPreview();

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
