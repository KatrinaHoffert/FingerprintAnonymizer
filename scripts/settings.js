// Populate the text area with our previously saved array
chrome.storage.sync.get(
	'whitelist',
	function (result){
		// Get the stored whitelist array
		var whitelist = result.whitelist;

		// Iterate over array and populate our page
		for(var i = 0; i < whitelist.length; i++)
		{
			$('#whitelist').append(whitelist[i] + "\n");
		}
	}
);

// Run when the save button is clicked
$('#save').click(function(){
	var arrayByLine = $('#whitelist').val().split('\n');

	// Remove blanks
	// From: http://stackoverflow.com/a/2843625/1968462
	arrayByLine = $.grep(arrayByLine, function(n){
			return(n);
	});

	// Save the settings
	chrome.storage.sync.set(
		{
			'whitelist': arrayByLine
		},
		function(){
			alert("Your settings have been saved");
		}
	);
});