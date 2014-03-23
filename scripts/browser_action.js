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

/**
 * Check if the page is already on the whitelist and modify the page if it is.
 * Nothing will happen if the page is not on the whitelist.
 */
chrome.storage.sync.get(
	'whitelist',
	function(result)
	{
		var whitelist = result.whitelist;

		// Get the current tab
		chrome.tabs.query(
			{
				currentWindow: true,
				active: true
			},
			function (tabs)
			{
				var currentPage = urlDomain(tabs[0].url);

				// Set the current domain text
				$('#currentDomain').html(currentPage);

				// Iterate over array and check for matches with our domain
				for(var i = 0; i < whitelist.length; i++)
				{
					// Check if domain is on the whitelist and change the
					// page style if it is
					if(currentPage.indexOf(whitelist[i]) !== -1)
					{
						$('#add').html('&#10004; Added to whitelist');
						$('#add').prop('disabled', true);
						$('#add').css('color', 'green');
					}
				}
			}
		);
	}
);

/**
 * Event handler for when the add button is clicked. The page will be added
 * to the whitelist.
 */
$('#add').click(function(){
	// Get the whitelist
	chrome.storage.sync.get(
		'whitelist',
		function(result)
		{
			var whitelist = result.whitelist;

			// Get the current tab
			chrome.tabs.query(
				{
					currentWindow: true,
					active: true
				},
				function (tabs)
				{
					var currentPage = urlDomain(tabs[0].url);

					// Push the new page to the whitelist array
					whitelist.push(currentPage);

					// Save the modified whitelist
					chrome.storage.sync.set(
						{
							'whitelist': whitelist
						},
						function()
						{
							$('#add').html('&#10004; Added to whitelist');
							$('#add').prop('disabled', true);
							$('#add').css('color', 'green');
						}
					);
				}
			);
		}
	);
});