"use strict";

// Change this value to force the browser to install the
// service worker again, and recreate the cache (this technique
// works because the browser reinstalls the service worker
// whenever it detects a change in the source code of the
// service worker).
const CACHE_PREFIX = "labs-editor-static-cache";
const CACHE_VERSION = "-v11";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const HTML_CACHE_NAME = "labs-editor-html-cache";
const GAME_CACHE_NAME = "labs-editor-game-cache";

self.addEventListener("install", (event) => {
	// skipWaiting() will force the browser to start using
	// this version of the service worker as soon as its
	// installation finishes.
	// It does not really matter when we call skipWaiting(),
	// as long as we perform all other operations inside
	// event.waitUntil(). Calling event.waitUntil() forces
	// the installation process to be marked as finished
	// only when all promises passed to waitUntil() finish.
	//
	self.skipWaiting();

	event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
		// According to the spec, the service worker file
		// is handled differently by the browser and needs
		// not to be added to the cache. I tested it and I
		// confirm the service worker works offline even when
		// not present in the cache (despite the error message
		// displayed by the browser when trying to fetch it).
		//
		// Also, there is no need to worry about max-age and
		// other cache-control headers/settings, because the
		// CacheStorage API ignores them.
		//
		// Nevertheless, even though CacheStorage API ignores
		// them, tests showed that a in few occasions, when
		// the browser was fetching these files, the file
		// being added to the cache actually came from the
		// browser's own cache... Therefore, I switched from
		// cache.addAll() to this.
		const files = [
			"/labs-editor/",
			"/labs-editor/html/",
			"/labs-editor/phaser/",
			"/labs-editor/phaser/game/",
			"/labs-editor/empty.html",
			"/labs-editor/example.html",
			"/labs-editor/example-html.html",
			"/labs-editor/examplePt.html",
			"/labs-editor/examplePt-html.html",
			"/labs-editor/favicon.ico",
			"/labs-editor/favicon.png",
			"/labs-editor/manifest.json",
			"/labs-editor/manifest-html.json",
			"/labs-editor/manifest-phaser.json",
			"/labs-editor/favicons/favicon-512x512.png",
			"/labs-editor/images/loading-grey-t.gif",
			"/labs-editor/images/logo.png",
			"/labs-editor/images/logo-dark.png",
			"/labs-editor/lib/ace-1.4.7/ace.js",
			"/labs-editor/lib/ace-1.4.7/ext-keybinding_menu.js",
			"/labs-editor/lib/ace-1.4.7/ext-language_tools.js",
			"/labs-editor/lib/ace-1.4.7/ext-options.js",
			"/labs-editor/lib/ace-1.4.7/ext-prompt.js",
			"/labs-editor/lib/ace-1.4.7/ext-searchbox.js",
			"/labs-editor/lib/ace-1.4.7/keybinding-labs.js",
			"/labs-editor/lib/ace-1.4.7/mode-css.js",
			"/labs-editor/lib/ace-1.4.7/mode-html.js",
			"/labs-editor/lib/ace-1.4.7/mode-javascript.js",
			"/labs-editor/lib/ace-1.4.7/mode-json.js",
			"/labs-editor/lib/ace-1.4.7/mode-markdown.js",
			"/labs-editor/lib/ace-1.4.7/mode-plain_text.js",
			"/labs-editor/lib/ace-1.4.7/mode-svg.js",
			"/labs-editor/lib/ace-1.4.7/mode-text.js",
			"/labs-editor/lib/ace-1.4.7/mode-xml.js",
			"/labs-editor/lib/ace-1.4.7/theme-chrome.js",
			"/labs-editor/lib/ace-1.4.7/theme-dracula.js",
			"/labs-editor/lib/ace-1.4.7/theme-eclipse.js",
			"/labs-editor/lib/ace-1.4.7/theme-labs.js",
			"/labs-editor/lib/ace-1.4.7/theme-monokai.js",
			"/labs-editor/lib/ace-1.4.7/theme-mono_industrial.js",
			"/labs-editor/lib/ace-1.4.7/theme-sqlserver.js",
			"/labs-editor/lib/ace-1.4.7/theme-textmate.js",
			"/labs-editor/lib/ace-1.4.7/worker-css.js",
			"/labs-editor/lib/ace-1.4.7/worker-html.js",
			"/labs-editor/lib/ace-1.4.7/worker-javascript.js",
			"/labs-editor/lib/ace-1.4.7/worker-json.js",
			"/labs-editor/lib/ace-1.4.7/worker-xml.js",
			"/labs-editor/lib/ace-1.4.7/snippets/css.js",
			"/labs-editor/lib/ace-1.4.7/snippets/html.js",
			"/labs-editor/lib/ace-1.4.7/snippets/javascript.js",
			"/labs-editor/lib/bootstrap/css/bootstrap-1.0.24.min.css",
			"/labs-editor/lib/bootstrap/js/bootstrap-1.0.0.min.js",
			"/labs-editor/lib/font-awesome/css/font-awesome-1.0.2.min.css",
			"/labs-editor/lib/font-awesome/fonts/fontawesome-webfont.eot?v=4.7.0",
			"/labs-editor/lib/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0",
			"/labs-editor/lib/font-awesome/fonts/fontawesome-webfont.svg?v=4.7.0",
			"/labs-editor/lib/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0",
			"/labs-editor/lib/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0",
			"/labs-editor/lib/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0",
			"/labs-editor/lib/jquery/jquery-1.0.0.min.js",
			"/labs-editor/lib/jszip/jszip-1.0.0.min.js",
			"/labs-editor/phaser/game/phaser-2.6.2.min.js",
			// Since these files' contents always change, but their names do not, I
			// added a version number in order to try to avoid browsers' own cache
			"/labs-editor/css/style.css?v=1.0.4",
			"/labs-editor/css/style-dark.css?v=1.0.2",
			"/labs-editor/js/advanced.js?v=1.0.5",
			"/labs-editor/js/advanced-ui.js?v=1.0.2",
			"/labs-editor/js/main.js?v=1.0.7"
		];
		const promises = new Array(files.length);
		for (let i = files.length - 1; i >= 0; i--)
			promises.push(cache.add(new Request(files[i], { cache: "no-store" })));
		return Promise.all(promises);
	}));
});

self.addEventListener("activate", (event) => {
	// claim() is used to ask the browser to use this instance
	// of the service worker with all possible clients, including
	// any pages that might have been opened before this service
	// worker was downloaded/activated.

	self.clients.claim();

	event.waitUntil(
		// List all cache storages in our domain.
		caches.keys().then(function (keyList) {
			// Create one Promise for deleting each cache storage that is not
			// our current cache storage, taking care not to delete other
			// cache storages from the domain by checking the key prefix (we
			// are not using map() to avoid inserting undefined into the array).
			const oldCachesPromises = [];

			for (let i = keyList.length - 1; i >= 0; i--) {
				const key = keyList[i];
				if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
					oldCachesPromises.push(caches.delete(key));
			}

			return Promise.all(oldCachesPromises);
		})
	);
});

function fixResponseHeaders(response) {
	if (!response)
		return;
	let headers = response.headers;
	if (!headers) {
		headers = new Headers();
		response.headers = headers;
	}
	headers.set("Cache-Control", "private, no-store");
}

function injectConsole(response) {
	return response && response.arrayBuffer().then((arrayBuffer) => {
		const search = [0x3c, 0x68, 0x65, 0x61, 0x64]; // <head
		const a = new Uint8Array(arrayBuffer);
		let state = 0, injectPos = -1;
		for (let i = 0; i < a.length; i++) {
			if (a[i] === search[state]) {
				state++;
				if (state >= 5) {
					// We found "<head"! Now, look for ">"
					for (; i < a.length; i++) {
						if (a[i] === 0x3e) {
							injectPos = i + 1;
							break;
						}
					}
					break;
				}
			} else if (state) {
				i--;
				state = 0;
			}
		}
		const headers = new Headers();
		headers.append("Cache-Control", "private, no-store");
		const response = new Response(new Blob((injectPos < 0) ? [a] : [
			a.slice(0, injectPos),
			'<script type="text/javascript">if (window.parent && window.parent.consoleProxy) { console = window.parent.consoleProxy; window.onerror = function (msg, url, line, col, error) { window.parent.consoleProxy.errorHandler(msg, url, line, col, error); return true; } } else if (window.opener && window.opener.consoleProxy) { console = window.opener.consoleProxy; window.onerror = function (msg, url, line, col, error) { window.opener.consoleProxy.errorHandler(msg, url, line, col, error); return true; } }\u003c/script\u003e',
			a.slice(injectPos)
		], { type: "text/html" }), { headers: headers });
		return response;
	});
}

function cacheMatchAndFixResponse(url, cache) {
	return cache.match(url).then((response) => {
		if (url.endsWith(".html") || url.endsWith(".htm")) {
			// Try to inject the console redirection into every HTML file
			return injectConsole(response);
		} else {
			fixResponseHeaders(response);
			return response;
		}
	});
}

function cacheMatch(url) {
	return caches.open(CACHE_NAME).then((cache) => {
		return cache.match(url);
	});
}

self.addEventListener("fetch", (event) => {

	const url = event.request.url;

	// Refer to the comments inside the cache to understand this condition!
	if (url.indexOf("/labs-editor/") < 0 ||
		// Do not cache the examples!
		url.indexOf("/examples/") >= 0)
		return fetch(event.request);

	// Try to always use a fresh copy of the main pages
	if (url.endsWith("/labs-editor/") ||
		url.endsWith("/phaser/") ||
		url.endsWith("/html/")) {
		event.respondWith(fetch(event.request).then((response) => {
			return response || cacheMatch(url);
		}, () => {
			return cacheMatch(url);
		}));
		return;
	}

	// @@@ debug only
	if (url.endsWith("/keybinding-labs.js") ||
		url.endsWith("/theme-labs.js") ||
		url.endsWith("/style.css?v=1.0.4") ||
		url.endsWith("/style-dark.css?v=1.0.2") ||
		url.endsWith("/main.js?v=1.0.7") ||
		url.endsWith("/advanced.js?v=1.0.5") ||
		url.endsWith("/advanced-ui.js?v=1.0.2")) {
		event.respondWith(fetch(event.request));
		return;
	} else if (url.endsWith("/phaser/game/")) {
		event.respondWith(fetch(event.request).then(injectConsole));
		return;
	}

	if (url.indexOf("/labs-editor/html/site/") >= 0) {
		// Look for the resource in the html cache, not in our cache.
		event.respondWith(caches.open(HTML_CACHE_NAME).then((cache) => {
			return cacheMatchAndFixResponse(url.endsWith("/site/") ? "/labs-editor/html/site/index.html" : url, cache);
		}));
		return;
	}

	if (url.indexOf("/labs-editor/phaser/game/") >= 0 &&
		!url.endsWith("/game/") &&
		!url.endsWith("/phaser-2.6.2.min.js")) {
		// Look for the resource in the game cache, not in our cache.
		event.respondWith(caches.open(GAME_CACHE_NAME).then((cache) => {
			return cacheMatchAndFixResponse(url, cache);
		}));
		return;
	}

	// This will speed up the loading time after the first
	// time the user loads the game. The downside of this
	// technique is that we will work with an outdated
	// version of the resource if it has been changed at
	// the server, but has not yet been updated in our
	// local cache (which, right now, will only happen
	// when the service worker is reinstalled).

	event.respondWith(caches.open(CACHE_NAME).then((cache) => {
		return cache.match(event.request).then((response) => {
			// Return the resource if it has been found.
			if (response)
				return (url.endsWith("/game/") ? injectConsole(response) : response);

			// When the resource was not found in the cache,
			// try to fetch it from the network. We are cloning the
			// request because requests are streams, and fetch will
			// consume this stream, rendering event.request unusable
			// (but we will need a usable request later, for cache.put)
			//
			// IMPORTANT: Unlike a regular app, where we know all the
			// requests that can be made, we cannot cache any external
			// requests here, regardless of the referrer. Because if
			// the user adds a CSS file pointing to a external font,
			// for example, the referrer will be *the* CSS file, and
			// not the page, like /html/site/. Unfortunately, that
			// prevents us from caching the Google Font we use in our
			// UI... :(
			//
			// For that reason, this if was moved outside the cache,
			// to improve performance.
			//if (event.request.url.indexOf("/labs-editor/") < 0) {
			//	if (!event.request.referrer ||
			//		(event.request.referrer &&
			//			(event.request.referrer.endsWith("/html/site/") ||
			//			event.request.referrer.endsWith("/phaser/game/") ||
			//			event.request.referrer.endsWith("/labs-editor/empty.html"))))
			//	return fetch(event.request);
			//}

			return fetch(event.request.clone()).then((response) => {
				// If this fetch succeeds, store it in the cache for
				// later! (This means we probably forgot to add a file
				// to the cache during the installation phase)

				// We are fetching the request from the cache because
				// we cannot change the headers in a response returned
				// by fetch().
				return ((response && response.status === 200) ? cache.put(event.request, response).then(() => {
					return cacheMatchAndFixResponse(url, cache);
				}) : response);
			}, () => {
				// The request was neither in our cache nor was it
				// available from the network (maybe we are offline).
				// Therefore, try to fulfill requests for favicons with
				// the largest favicon we have available in our cache.
				if (url.indexOf("favicon") >= 0)
					return cache.match("/labs-editor/favicons/favicon-512x512.png");

				// The resource was not in our cache, was not available
				// from the network and was also not a favicon...
				// Unfortunately, there is nothing else we can do :(
				return null;
			});
		});
	}));

});

// References:
// https://developers.google.com/web/fundamentals/primers/service-workers/?hl=en-us
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle?hl=en-us
// https://developers.google.com/web/fundamentals/codelabs/offline/?hl=en-us
// https://web.dev/service-workers-cache-storage
