'use strict';
var _ = require('mix-utils');

/**
 * register the plug-in with the Hapi framework
 *
 * @param  {Object} server
 * @param  {Object} options
 * @param  {Function} next
 */
var register = function (server, options, next) {
    var conf = Object.assign({}, { enabled: true }, options || {});
    server.ext('onRequest', function (request, reply) {        
        conf = Object.assign({}, conf, request.route.settings.plugins.seo || {});
        if (conf.enabled && request.method === 'get' && _.isCrawl(request.headers['user-agent']))
            reply.continue();
        else
            reply();
    });

    next();
}

register.attributes = { pkg: require('./package.json') };

exports.register = register;