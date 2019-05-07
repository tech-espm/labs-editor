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
		div.innerHTML = "<img alt=\"Aguarde\" src=\"" + (basePath || "") + "images/loading-grey-t.gif\"> " + (msg || "Por favor, aguarde...");
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
