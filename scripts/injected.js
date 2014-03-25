// Boolean variable for toggling output of additional information to the
// console. Should be false for production use.
var DEBUG = true;

/**
 * Checks if the given domain is in our whitelist. Will call run with parameter
 * true (if the site is in the whitelist) or false (if the site is not in the
 * whitelist). The reason a function must be called when this is completed is
 * because the function used to get data from the whitelist are asychronous.
 *
 * This is an anonymous function call -- it will run immediately.
 */
(function(){
	// A deferred promise -- lets us make this asychronous method work like
	// a sychronous one
	var dfd = new jQuery.Deferred();

	// Fetch the whitelist from extension storage
	chrome.storage.sync.get(
		'whitelist',
		function (result){
			// Get the stored whitelist array
			var whitelist = result.whitelist;

			// Iterate over array and check for matches with our domain
			var found = false;
			for(var i = 0; i < whitelist.length; i++)
			{
				// Check if domain is on the whitelist
				if(document.domain.indexOf(whitelist[i]) !== -1)
				{
					found = true;
					break;
				}
			}

			// Let our deferred object know that we're done here
			dfd.resolve(found);
		}
	);

	// Runs after the deferred object is notified. The value that was resolved
	// with dfd (found) will be passed as a parameter to run().
	$.when(dfd).then(run);
})();

/**
 * This function will be run after the whitelist status is determined. If the
 * site is on the whitelist, listedStatus will be true. Otherwise, listedStatus
 * will be false.
 */
function run(listedStatus)
{
	if(!listedStatus)
	{
		// Site is NOT on the whitelist
		if(DEBUG)
		{
			console.log("Site not on whitelist. Location is: " +
				window.location.href);
		}

		//  The code to inject
		var injectedCode = [
			"// Backup selected navigator properties",
			"var backup = {",
			"  'appCodeName': window.navigator.appCodeName,",
			"  'appName': window.navigator.appName,",
			"  'appVersion': window.navigator.appVersion,",
			"  'battery': window.navigator.battery,",
			"  'connection': window.navigator.connection,",
			"  'geolocation': window.navigator.geolocation,",
			"  'javaEnabled': window.navigator.javaEnabled,",
			"  'language': window.navigator.language,",
			"  'mimeTypes': window.navigator.mimeTypes,",
			"  'onLine': window.navigator.onLine,",
			"  'oscpu': window.navigator.oscpu,",
			"  'platform': window.navigator.platform,",
			"  'product': window.navigator.product,",
			"  'userAgent': window.navigator.userAgent,",
			"  'buildID': window.navigator.buildID,",
			"  'cookieEnabled': window.navigator.cookieEnabled,",
			"  'id': window.navigator.id,",
			"  'doNotTrack': window.navigator.doNotTrack,",
			"  'productSub': window.navigator.productSub,",
			"  'vendor': window.navigator.vendor,",
			"  'vendorSub': window.navigator.vendorSub,",
			"  'webkitPointer': window.navigator.webkitPointer,",
			"  'registerContentHandler': window.navigator.registerContentHandler,",
			"  'registerProtocolHandler': window.navigator.registerProtocolHandler,",
			"  'vibrate': window.navigator.vibrate,",
			"  'requestWakeLock': window.navigator.requestWakeLock,",
			"  'webkitPersistentStorage': window.navigator.webkitPersistentStorage,",
			"  'webkitTemporaryStorage': window.navigator.webkitTemporaryStorage,",
			"  'getStorageUpdates': window.navigator.getStorageUpdates,",
			"  'webkitGetGamepads': window.navigator.webkitGetGamepads,",
			"  'webkitGetUserMedia': window.navigator.webkitGetUserMedia,",
			"}",
			"// And reset the navigator to the backup",
			"window.navigator = backup;"
		].join('\n');

		// Create a script tag with the injected code
		var script = document.createElement('script');
		script.textContent = injectedCode;
		(document.head||document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);
	}
	else
	{
		// Otherwise the site is on the whitelist
		if(DEBUG)
		{
			console.log("Site is on whitelist. Location is: " +
				window.location.href);
		}
	}
}