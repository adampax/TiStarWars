var _ = require('alloy/underscore');
var Promise = require('bluebird.core.min');

/**
 * @param {Object} args
 * @param {string} args.method			HTTP method GET, POST, etc.  
 * @param {string} args.url				url to send the request
 * @param {Object} args.headers			optional object with header name/value pairs such as {'Content-Type': 'application/json}
 * @param {Object} args.data			optional data packet to be sent with POST
 * @returns {Promise} Fufilled with the xhr responseText or error
 * 
 */
exports.send = function(args) {

	return new Promise(function (resolve, reject) {
		
		var request = Titanium.Network.createHTTPClient();

		request.onload = function() {
			var response;
				try {
					response = JSON.parse(this.responseText);
				} catch(e) {
					Ti.API.warn('Unable to parse JSON for xhr(): ' + JSON.stringify(e));
				}
			
				//resolve our promise and send the response data
				resolve(response);
		};

		request.onerror = function(e) {
			Ti.API.warn('HTTP error for: ' + args.url);
				
				Ti.API.error('Xhr lib response error: ');
				Ti.API.error('status: ' + this.status);
				Ti.API.error('responseText: ' + this.responseText);
				
				//reject the promise and send the error data
				reject(e);
			
		};
		request.timeout = 30000;

		//initiate the request
		request.open(args.method || 'GET', args.url);
		
		// add any headers
		for (var header in args.headers) {
			request.setRequestHeader(header, args.headers[header]);
		}	

		//send the request with any data
		if(args.data) {
			request.send(JSON.stringify(args.data));
		} else {
			request.send();
		}
	});
};
