/** 
 * Primary file for the API
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const strDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// Instantiate the HTTP sever
var httpServer = http.createServer(function (request, response) {
    unifiedServer(request, response);
});
// start the HTTP server, and dynamically set the port
httpServer.listen(config.httpPort, function () {
    console.log('The server is listening on port '+ config.httpPort);
});

// Instantiate the HTTPs sever
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions,function (request, response) {
    unifiedServer(request, response);
});
// start the HTTPS server, and dynamically set the port
httpsServer.listen(config.httpsPort, function () {
    console.log('The server is listening on port '+ config.httpsPort);
});
// All the server logic for both http and https server
var unifiedServer = function( request, response){
    // Get the url and parse it
    var parsedUrl = url.parse(request.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStrObj = parsedUrl.query;

    // Get the HTTP Method
    var method = request.method.toLowerCase();

    // Get the headers as an object
    var headers = request.headers;

    // Get the payload, if any
    var decoder = new strDecoder('utf-8');
    var buffer = '';
    request.on('data', function (data) {
        buffer += decoder.write(data);
    });
    request.on('end', function () {
        buffer += decoder.end();
        // Chose the handler this request should go to. If one is not found route to not found
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStrObj': queryStrObj,
            'method': method,
            'headers': headers,
            'payload': buffer
        };
        // Route the request to the handler specified in the router

        chosenHandler(data, function (statusCode, payload) {
            // Use the status code called by the hander, or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            // Use the payload called back by the handler, or default to an empty obj
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadStr = JSON.stringify(payload);

            // Return the response
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(statusCode);
            response.end(payloadStr);
            // Log the request path
            console.log('Returning this response: ', statusCode, payloadStr);
        });
    });
}
// Define handlers
var handlers = {};

// Ping handler
handlers.ping = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(200, {
        'name': 'ping handler'
    });
}

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
}

// Define a request router
var router = {
    'ping': handlers.ping
};