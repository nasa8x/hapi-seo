# Hapi SEO plugin for Single Page Application (SPA)

By defining the same route as the SPA application (Angular, React, Vue, Ember, Aurelia, Backbone ...) The plugin will detect the crawler when the request arrives and return html data.

### If you don't know Node.js 

[Node.js Tutorial for Beginners in 2020](https://morioh.com/p/0907cef2141c)

[How To Build a Blog with Nest.js, MongoDB, and Vue.js](https://morioh.com/p/74ffc8a798bb)

[Node.js, ExpressJs, MongoDB and Vue.js (MEVN Stack) Application Tutorial](https://morioh.com/p/5f231039687e)

### Install

```js
npm install hapi-seo --save
```
```js 
yarn install hapi-seo --save
```

```js
var Hapi = require('@hapi/hapi'),    
    vision = require('@hapi/vision'),
    Mustache = require('mustache'),
    seo = require('hapi-seo'),

var server = Hapi.server({ host: 'localhost', port: 8080 });

server.register([
    {
        register: vision,
        options:{}
    }, 
    {
        register: seo,
        options:{
            enabled: true, // default handler all routes 
            view: 'index.html', // return default view when detect not a crawler 
            data: {}, // default data view 
            excludes: [ // excludes path or file ext
                /upload\/.*?/ig,
                /www\/.*?/ig,
                /\.(js|css|xml|less|doc|txt|docx|ico|zip|rar|mp3|exe|avi|mp4|mpg|mpeg|psd|ai|xsl|m4a|wmv|rss|ppt|flv|swf|dat|dmg|iso|m4v|torrent|gif|jpg|jpeg|tiff|png)$/ig
            ]
        }
    }], function (err) {

       // Register Mustache Templates rendering 
        server.views({
            engines: {
                html: {
                    compile: function (template) {
                        Mustache.parse(template);
                        return function (context) {
                            return Mustache.render(template, context);
                        };
                    }
                }
            },
            //relativeTo: __dirname,
            path: './views'
        });
});

```

Config route return content when detect crawler 

```js
server.route([
    {
        method: 'GET',
        path: '/category/{id}',
       handler: function (request, reply) {
            var _id = request.params.id;
            var _page = parseInt(request.query.page) || 1;
            Post.paginate({ _cid: _id }, {                        
                page: _page,
                limit: 18,
                sort: {crt: -1}
            }, (err, result) => {
                if (result) {
                    reply.view('list.html', result);
                }else{                    
                    reply.view('404.html');
                }
            });
            
        }
    },
    {
        method: 'GET',
        path: '/detail/{id}',
        handler: function (request, reply) {
                Post.findOne({ sid: _id }, (err, doc) => {
                if (doc) {
                    reply.view('detail.html', doc);
                }else{                    
                    reply.view('404.html');
                }
            });
                
        }
    },
    // main SPA application
    {
        method: 'GET',
        path: '/{path*}',
        options: {
            plugins: {
                seo: { enabled: false }
            }          

        },

        handler: function (request, reply) {
            reply.view('index.html', {});
        }

    }
    ]);
```