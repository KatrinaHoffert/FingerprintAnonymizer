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

			chrome.storage.local.set({'current_page': document.URL}, function(){
				console.log('Saved current site.');
			});

			// Iterate over array and check for matches with our domain
			var found = false;
			for(var i = 0; i < whitelist; i++)
			{
				// Check if a given regex matches the domain
				if((new RegExp(whitelist[i])).exec(document.domain))
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

		// *******************************************************************
		// ************* TODO: All disabling code goes here ******************
		// *******************************************************************

		// Prevent access to plugin info
		// TODO: Backup window.navigator
		window.navigator = null;
		window.navigator = {};
		// TODO: Recreate window.navigator
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