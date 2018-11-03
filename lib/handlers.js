/** 
 * Request handlers
 * 
 */
// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
// Define handlers
var handlers = {};

// Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}
// Container for the users sub-methods
handlers._users = {}

// User - post
// Required data : firstName, lastName, phone, password, tosAgreement
// Optional data : none
handlers._users.post = function (data, callback) {
    // check that all req. fields are filled out
    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure the user doesn't already exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);
                // Create the user
                if (hashedPassword) {
                    var userObj = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    };
                    // store the user
                    _data.create('users', phone, userObj, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {
                                'Error': 'Could not create new user'
                            });
                        }
                    })
                } else {
                    callback(500, {
                        'Error': 'Could not hash password'
                    });
                }

            } else {
                // User already exists
                callback(400, {
                    'Error': 'A user with that phone number already exists'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required fields'
        })
    }
}
// User - get
handlers._users.get = function (data, callback) {

}
// User - put
handlers._users.put = function (data, callback) {

}
// User - delete
handlers._users.delete = function (data, callback) {

}
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

// Export the module
module.exports = handlers;