// PLANNING:
// In order for this script to be aware of the current page, you'll have to
// have the content script save the current page into chrome.storage.local
// This script could then load that value from chrome.storage.local (there's
// no other way to communicate between the browser action and the current page).
// Just the domain of the current page has to be saved.
//
// Then this script would check that domain against all domains in the whitelist
// (using regex similar to that used in the injected script). If there's a
// match, then modify the HTML to reflect this (eg, disable button and change
// the text).
//
// If there is no match, nothing needs to be done (default look of the HTML).
//
// Also have to provide a method to add the current domain to the whitelist.

$('#add').click(function(){
	alert("I haven't been implemented yet!");
});