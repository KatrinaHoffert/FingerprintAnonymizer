//We want to react before the headers are sent, so that they can be modified.
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details)
	{
		for(var i = 0; i < details.requestHeaders.length; ++i)
		{
			//Set language header to something more generic
			// Accepts US English, or any other English
			if(details.requestHeaders[i].name === 'Accept-Language')
			{
				details.requestHeaders[i].value = "en-US,en;q=0.8";
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