console.log("Injected script is definitely running! The page is " +
	window.location.href);

// Prevent access to plugin info
// TODO: Backup window.navigator
window.navigator = null;
window.navigator = {};
// TODO: Recreate window.navigator