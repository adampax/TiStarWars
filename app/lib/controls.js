/**
 * Collection of custom controls
 * @module controls
 */

//Non-controller JavaScript files are not automatically wrapped by Alloy and need to have alloy module explicitly required.
var Alloy = require('alloy');
var _ = require('alloy/underscore');

/**
 * Cross Platform Navigation controller
 * @returns a {NavigationWindow} for iOS or just the {Window} for Android
 */
exports.createNavigationWindow = function(args) {
	var win;
	var windowStack = [];
	if (OS_IOS) {
		win = Ti.UI.iOS.createNavigationWindow(args);
	} else {
		win = args.window;
	}

	//save the window to a stack in case it needs to be closed with closeAllWindows
	windowStack.push(win);

	/**
	 * handle the opening of a sub window either through the NavigationWindow (iOS) or as a regular window
	 * @param controller {string} path of the controller window to be opened, Example: 'schedule/scheduleWindow'
	 * @param args {Object} any arguments to be passed to the controller at creation
	 */
	win.openSubwindow = function(controller, args) {
		var a = _.extend(args || {}, {
			parent : win
		});

		var view = Alloy.createController(controller, a).getView();
		if (OS_IOS) {
			win.openWindow(view);
		} else {
			view.open();
			windowStack.push(view);
		}
	};

	/**
	 * close any opened windows in a navigation stack
	 * On iOS, this will just be the navigation window controller
	 * On Android, it will be any opened subwindows
	 */
	win.closeAllWindows = function() {
		windowStack.reverse().forEach(function(w) {
			w.close();
		});
	};

	return win;
};





