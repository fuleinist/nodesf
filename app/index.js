var express = require('express'),
	oauth2 = require('salesforce-oauth2'),
	morgan = require('morgan');

var callbackUrl = "http://localhost:3030/auth/callback",
	consumerKey = "consumerKey",
	consumerSecret = "consumerSecret";

var app = express();

app.use(morgan('tiny'));

app.get("/", function(request, response) {
	var uri = oauth2.getAuthorizationUrl({
		redirect_uri: callbackUrl,
		client_id: consumerKey,
		scope: 'api', // 'id api web refresh_token'
		// You can change loginUrl to connect to sandbox or prerelease env.
		base_url: 'https://login.salesforce.com'
	});
	return response.redirect(uri);
});

app.get('/auth/callback', function(request, response) {
	console.log(request.query)
	var authorizationCode = request.query.code;
	oauth2.authenticate({
		redirect_uri: callbackUrl,
		client_id: consumerKey,
		client_secret: consumerSecret,
		code: authorizationCode,
		// You can change loginUrl to connect to sandbox or prerelease env.
		base_url: 'https://login.salesforce.com'
	}, function(error, payload) {
		if(error) return response.send((JSON.stringify(error)));
		if(payload) return response.send((JSON.stringify(payload)));
		/*

		The payload should contain the following fields:
		
		id 				A URL, representing the authenticated user,
						which can be used to access the Identity Service.
		
		issued_at		The time of token issue, represented as the 
						number of seconds since the Unix epoch
						(00:00:00 UTC on 1 January 1970).
		
		refresh_token	A long-lived token that may be used to obtain
						a fresh access token on expiry of the access 
						token in this response. 

		instance_url	Identifies the Salesforce instance to which API
						calls should be sent.
		
		access_token	The short-lived access token.


		The signature field will be verified automatically and can be ignored.

		At this point, the client application can use the access token to authorize requests 
		against the resource server (the Force.com instance specified by the instance URL) 
		via the REST APIs, providing the access token as an HTTP header in 
		each request:

		Authorization: OAuth 00D50000000IZ3Z!AQ0AQDpEDKYsn7ioKug2aSmgCjgrPjG...
		*/
	});	
});

app.listen(3030, function() {
	console.log("Listening on 3030");
});