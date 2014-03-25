/**
 * Helper function for retrieving the domain of a url.
 * Created by Filip Roseen - refp
 * http://stackoverflow.com/a/8498668/1968462
 */
function urlDomain(data) {
	var a = document.createElement('a');
	a.href = data;
	return a.hostname;
}

var whitelist = [];

// We want to react before the headers are sent, so that they can be modified.
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details)
	{
		// Figure out the domain we're about to access
		var domain = urlDomain(details.url);

		// Iterate over array and check for matches with our domain
		var found = false;
		for(var i = 0; i < whitelist.length; i++)
		{
			// Check if domain is on the whitelist
			if(domain.indexOf(whitelist[i]) !== -1)
			{
				found = true;
				break;
			}
		}

		// Only change header if site not in whitelist
		if(!found)
		{
			// Otherwise find the correct header to change
			for(var i = 0; i < details.requestHeaders.length; i++)
			{
				//Set language header to something more generic
				if(details.requestHeaders[i].name === 'Accept-Language')
				{
					details.requestHeaders[i].value = "en-US,en;q=0.8";
					break;
				}
			}
		}

		return {requestHeaders: details.requestHeaders};
	},
	{
		urls: ["<all_urls>"]
	},
	["blocking", "requestHeaders"]
);

//Block specific known fingerprinting scripts
chrome.webRequest.onBeforeRequest.addListener(
	function(details)
	{
		return {cancel: true};
	},
	{
		urls: [
			"*://www.lalit.org/wordpress/wp-content/uploads/2008/05/fontdetect.js*"
			/*,"*://panopticlick.eff.org/resources/fetch_whorls.js*"*/
		]
	},
	["blocking"]
);

/**
 * Function for reloading the whitelist ever 1000 ms. Possibly inefficient (?).
 * Ideally (?) we'd have to load the whitelist on each page request, but loading
 * the whitelist is asynchronous and can't be done inside our event handler
 * (I think?). On the bright side, this is more efficient if there's a large
 * number of page requests at a time (which there often is, since every image,
 * script, etc, is a new request). As a result, I'm not sure if this is more or
 * less efficient than reloading the list for each request.
 */
setInterval(function(){
	chrome.storage.sync.get(
		'whitelist',
		function (result){
			// Get the stored whitelist array
			whitelist = result.whitelist;

			if(whitelist === undefined) whitelist = [];
		}
	);

	console.log(JSON.stringify(whitelist))
}, 1000);

/**
 * Check if the whitelist has been saved. If this is the first time the
 * extension is being used and no sites have been saved to the whitelist, then
 * it does not yet exist in local storage and actions on it will result in
 * attempting to access non-existant parameter. To prevent this, we will save
 * an empty array into the whitelist if it is empty. This only happens once,
 * when the background script is loaded for the first time (likely when the
 * browser starts).
 */
chrome.storage.sync.get(
	'whitelist',
	function(result)
	{
		var whitelist = result.whitelist;

		if(whitelist === undefined)
		{
			// Save an empty array as the whitelist
			chrome.storage.sync.set(
				{
					'whitelist': []
				},
				function()
				{
					console.log("It's a first run: setting the whitelist as empty.")
				}
			);
		}
	}
);