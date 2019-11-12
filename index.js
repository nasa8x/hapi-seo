
'use strict';
var _ = require('mix-dash'),
    pkg = require('../package.json');


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
                /\.(js|css|xml|less|doc|txt|docx|ico|zip|rar|mp3|exe|avi|mp4|mpg|mpeg|psd|ai|xsl|m4a|wmv|rss|ppt|flv|swf|dat|dmg|iso|m4v|torrent|gif|jpg|jpeg|tiff|png)$/ig
            ]
        }, options || {});
        server.ext('onRequest', function (request, h) {
            conf = Object.assign({}, conf, request.route.settings.plugins.seo || {});
            if ((conf.enabled && request.method === 'get' && _.isCrawl(request.headers['user-agent'])) || conf.excludes.some(function (regex) { return regex.test(request.url.pathname); })) {
                h.continue();
            }
            else
                h.view(conf.view, conf.data);
        });

    }
}