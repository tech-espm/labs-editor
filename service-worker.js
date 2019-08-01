"use strict";

// Change this value to force the browser to install the
// service worker again, and recreate the cache (this technique
// works because the browser reinstalls the service worker
// whenever it detects a change in the source code of the
// service worker).
const CACHE_VERSION = 1;

const CACHE_NAME = "labs-editor-static-cache";

self.addEventListener("install", (event) => {
	// skipWaiting() will force the browser to start using
	// this version of the service worker as soon as its
	// installation finishes.
	// It does not really matter when we call skipWaiting(),
	// as long as we perform all other operations inside
	// event.waitUntil(). Calling event.waitUntil() forces
	// the installation process to be marked as finished
	// only when all promises passed to waitUntil() finish.

	self.skipWaiting();

	// Delete the cache in case it already exists (we could
	// delete only a few files instead, and let addAll()
	// add/update the missing files...).
	event.waitUntil(caches.delete(CACHE_NAME).then(() => {
		return caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
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
				"/labs-editor/",
				"/labs-editor/?pwa",
				"/labs-editor/empty.html",
				"/labs-editor/favicon.ico",
				"/labs-editor/favicon.png",
				"/labs-editor/favicons/favicon-512x512.png",
				"/labs-editor/manifest.json",
				"/labs-editor/images/loading-grey-t.gif",
				"/labs-editor/images/logo.png",
			]);
		});
	}));
});

self.addEventListener("activate", (event) => {
	// claim() is used to ask the browser to use this instance
	// of the service worker with all possible clients, including
	// any pages that might have been opened before this service
	// worker was downloaded/activated.
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Request
	// mode is navigate only for the document itself (/neon/ or
	// index.html), whereas for all other requests, mode is cors,
	// no-cors and so on. So, in order to make the entire game
	// work offline we must handle all kinds of requests!

	if (event.request.mode === "navigate") {
		// When mode is "navigate", we first try to fetch the
		// resource (which is likely to be a page) from the network.
		// Only if the network fails, we return whatever was stored
		// in our cache.

		event.respondWith(fetch(event.request)
		// Instead of simply fetching and returning the page, we could
		// use this opportunity to update the cache, like the code below:
		//event.respondWith(fetch(event.request.clone()).then((response) => {
		//	// If everything goes according planned, store the response
		//	// in cache, replacing the existing cached version, because
		//	// the page could have been updated. We are cloning the
		//	// request because requests are streams, and fetch will
		//	// consume this stream, rendering event.request unusable
		//	// (but we will need a usable request later, for cache.put)
		//	//
		//	// Just as requests, responses are streams and we will
		//	// need two usable streams: one to be used by the cache
		//	// and one to be returned to the browser! So, we send a
		//	// clone of the response to the cache.
		//	let responseClone = response.clone();
		//
		//	caches.open(CACHE_NAME).then((cache) => {
		//		cache.put(event.request, responseClone);
		//	});
		//
		//	return response;
		//})
		.catch(() => {
			// Network failed. Offline? Poor connection?
			// Anyway, try to return the resource from the cache.
			return caches.open(CACHE_NAME).then((cache) => {
				return cache.match(event.request);
				// We could also handle cache misses, if desired...
				//return cache.match(event.request).then((response) => {
				//	if (!response) {
				//		cache miss!!!
				//	}
				//	return response;
				//});
			});
		}));
	} else {
		// Since mode was not "navigate", this is probably
		// a request for resources like images or scripts.
		// This will speed up the loading time after the first
		// time the user loads the game. The downside of this
		// technique is that we will have to delete

		event.respondWith(caches.open(CACHE_NAME).then((cache) => {
			return cache.match(event.request).then((response) => {
				// Return the resource if it has been found.
				if (response)
					return response;

				// When the resource was not found in the cache,
				// try to fetch it from the network. We are cloning the
				// request because requests are streams, and fetch will
				// consume this stream, rendering event.request unusable
				// (but we will need a usable request later, for cache.put)
				return fetch(event.request.clone()).then((response) => {
					// If this fetch succeeds, store it in the cache for
					// later! (This means we probably forgot to add a file
					// in cache.addAll() during the installation phase)

					// Just as requests, responses are streams and we will
					// need two usable streams: one to be used by the cache
					// and one to be returned to the browser! So, we send a
					// clone of the response to the cache.
					cache.put(event.request, response.clone());
					return response;
				}).catch(() => {
					// The request was neither in our cache nor was it
					// available from the network (maybe we are offline).
					// Therefoe, try to fulfill requests for favicons with
					// the largest favicon we have available in our cache.
					if (event.request.url.toString().indexOf("favicon") >= 0)
						return cache.match("/labs-editor/favicons/favicon-512x512.png");

					// The resource was not in our cache, was not available
					// from the network and was also not a favicon...
					// Unfortunately, there is nothing else we can do :(
					return null;
				});
			});
		}));
	}

});

// References:
// https://developers.google.com/web/fundamentals/primers/service-workers/?hl=en-us
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle?hl=en-us
// https://developers.google.com/web/fundamentals/codelabs/offline/?hl=en-us
// https://web.dev/service-workers-cache-storage
