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

		// There's nothing actually here because none of our injected changes
		// worked! The rest of this is proof of concept.
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