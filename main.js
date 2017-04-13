'use strict';
var _ = require('mix-utils');
var _ext = (/\.(js|css|xml|less|doc|txt|docx|ico|zip|rar|mp3|exe|avi|mp4|mpg|mpeg|psd|ai|xsl|m4a|wmv|rss|ppt|flv|swf|dat|dmg|iso|m4v|torrent|gif|jpg|jpeg|tiff|png)$/i);

/**
 * register the plug-in with the Hapi framework
 *
 * @param  {Object} server
 * @param  {Object} options
 * @param  {Function} next
 */
var register = function (server, options, next) {
    var conf = Object.assign({}, { enabled: true, view: 'index.html', data:{} }, options || {});
    server.ext('onRequest', function (request, reply) {        
        conf = Object.assign({}, conf, request.route.settings.plugins.seo || {});
        if (conf.enabled && request.method === 'get' && _.isCrawl(request.headers['user-agent']) && !_ext.test(request.url))
            reply.continue();
        else
            reply.view(conf.view, conf.data);
    });

    next();
}

register.attributes = { pkg: require('./package.json') };

exports.register = register;