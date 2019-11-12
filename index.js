
'use strict';
var _ = require('mix-dash'),
    pkg = require('./package.json');


exports.plugin = {
    name: pkg.name,
    version: pkg.version,
    pkg: pkg,
    register: function (server, options) {

        var conf = Object.assign({}, {
            enabled: true, view: 'index.html', data: {},
            excludes: [
                /upload\/.*?/ig,
                /www\/.*?/ig,
                /\.(js|css|gif|jpg|jpeg|tiff|png|svg|woff|woff2|ttf|xml|less|doc|txt|docx|ico|zip|rar|mp3|exe|avi|mp4|mpg|mpeg|psd|ai|xsl|m4a|wmv|rss|ppt|flv|swf|dat|dmg|iso|m4v|torrent)$/ig
            ]
        }, options || {});
        server.ext('onPreHandler', function (request, h) {

            conf = Object.assign({}, conf, request.route.settings.plugins.seo || {});
            if ((conf.enabled && request.method === 'get' && _.isCrawl(request.headers['user-agent'])) || conf.excludes.some(function (regex) { return regex.test(request.url.pathname); })) {
                return h.continue;
            }
            else {
                return h.view(conf.view, conf.data).takeover();
            }
        });


    }
}