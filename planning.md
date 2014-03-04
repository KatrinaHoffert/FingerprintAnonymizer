#Extension functionality:

To avoid breaking websites, all potential tracking situations should create an alert box that allows the user to choose whether or not to permit the site from accessing information that could be used to track the user. If they accept, the site should be added to a whitelist (sites on the whitelist are not checked for violations).

Prevent getting array of plugins with Navigator.plugins: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins.plugins

Should probably prompt the user if they want to allow this. And also detect when a site makes multiple plugin requests (suspicious).

It looks like most font detection uses [this technique](http://www.lalit.org/lab/javascript-css-font-detect/) I think we should be able to detect when this occurs by figuring out how the script sets the font in the first place and only allow this to be done a certain number of times before prompting the user.

My HTTP headers on chrome seems to be extremely unique, while on Firefox they're pretty common. I think this is because Chrome adds `en-CA;q=0.6` to the accepted languages. It's to my understanding that this won't really do anything (or at least, I've never heard of anyone checking for the Canadian English header -- in fact, language headers don't seem to be used much at all). I've never heard of a site using the language headers before. I think we could change this header to something more common.

Checkout http://myhttp.info/ to see how this HTTP header information is organized. I'm thinking that it should be an option whether or not to use the "default" headers or our own provided, common headers. Also see [this article](http://www.newmediacampaigns.com/blog/browser-rest-http-accept-headers) for info on what the values mean.

I don't think it's necessary to change the user agent string. I'm not sure if there's anything we could change it to that would be more common, since this is dependent on the OS and browser version. Since Chrome auto-updates, it really should be mostly an indicator of the OS, which should be fairly common.

The cookies, supercookies, screensize, and timezone don't seem to be an issue for me. They all should be fairly common.

I think all checks should be options that the user can disable. The whitelist would simply check if the URL matches a list of regex strings (eg, `google\.com.*` would match any page on `google.com`). The user should be able to manually add and remove sites from the whitelist.

Note that Java, Flash, Silverlight, etc allow means of checking beyond our ability to stop. Other extensions, like Flashblock, will be necessary to prevent plugins from tracking the user.

For other features that could be used to identify browsers, see http://browserspy.dk/ (although whether anything else gets implemented would depend on time constraints).

#Implementation:

For changing HTTP headers, we'll have to use the [WebRequest API](http://developer.chrome.com/extensions/webRequest).

We need to use content scripts (injected JS) to modify methods. See [this SO post](https://stackoverflow.com/questions/5409428/how-to-override-a-javascript-function) for an example of overriding a JS function.

Regarding the "browser action" (the button in the toolbar that shows a page when clicked), I think this should be a minimum settings-like page. We could have a separate page for settings that has the full whitelist (and perhaps other options?) and the browser action page would just allow toggle the functionality on and off for the current site (ie, add and remove the site from the whitelist). Perhaps we could also show info (like what -- if anything -- is being blocked)?

For storage of settings, we'd use the [chrome.storage API](http://developer.chrome.com/extensions/storage).

##Development tools

I think we can use whatever tools we want here. Obviously we'll need the latest version of Chrome. Other than that, it's up to you. Personally, I'm using Sublime Text for most of my development. I propose that we use tabs, not spaces, for indentation. Also, using Allman style indentation, spaces between binary operators, semicolons on all lines, etc.

Sample code:

```javascript
function foo(x, y)
{
	// Use === for comparison by default -- type strict comparison
	if(x === y)
	{
		return (x + y) / 2;
	}
	else
	{
		return false;
	}
}
```