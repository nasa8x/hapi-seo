Hapi SEO plugin for Single Page Application (SPA)

By defining the same route as the SPA application (Angular, React, Vue, Ember, Aurelia, Backbone ...) The plugin will detect the crawler when the request arrives and return html data.

Install via NPM

```js
npm install hapi-seo --save
```

```js
var Hapi = require('hapi'),
    Mustache = require('mustache'),
    vision = require('vision'),
    seo = require('hapi-seo'),

var server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

server.register([vision, seo], function (err) {

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
server.route({
        method: 'GET',
        path: '/category/{id}',
        config: {           
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
        }
    },
    {
        method: 'GET',
        path: '/detail/{id}',
        config: {           
            handler: function (request, reply) {
                 Post.findOne({ sid: _id }, (err, doc) => {
                    if (doc) {
                        reply.view('detail.html', doc);
                    }else{                    
                        reply.view('404.html');
                    }
                 });
                
            }
        }
    },
    // main SPA application
    {
        method: 'GET',
        path: '/{path*}',
        config: {
            plugins: {
                seo: { enabled: false }
            },
            handler: function (request, reply) {
                reply.view('main.html', {});
            }

        }

    });
```