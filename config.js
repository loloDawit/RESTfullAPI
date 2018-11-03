/*
 * Create and export configuration variables
 *
 */

// Container for all the environment
var environments = {};

// Staging environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort':3001,
    'envName': 'staging', 
    'hashingSecret':'someSecret'
};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret':'someSecret'
};

// Determine which environment was passed as a command-line arg
var curEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment above, if not, default staging
var envToExport = typeof(environments[curEnvironment])== 'object'?environments[curEnvironment]:environments.staging;

// Export the module
module.exports = envToExport;