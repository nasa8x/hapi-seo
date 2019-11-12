
var Hapi = require("@hapi/hapi"),
    Mustache = require('mustache');


const server = Hapi.server({ host: 'localhost', port: 8080 });

(async () => {

    await server.register([
        { plugin: require('@hapi/vision') },
        { plugin: require('@hapi/crumb'), options: { restful: true } },
        { plugin: require('./index') },
    ]);

    server.views({
        engines: {
            html: {

                compile: (template) => {
                    Mustache.parse(template);
                    return (context) => {
                        console.log(context);
                        return Mustache.render(template, context);
                    };
                }
            }
        },
        //compileMode: 'async', // global setting
        // relativeTo: __dirname,
        path: './views'
    });


    await server.route([

        {
            method: "GET",
            path: "/info",
            handler: async (request, h) => {

                return h.view('info.html');

            }
        },
        {
            method: "GET",
            path: "/{p*}",
            options: {
                auth: false,
                plugins: {
                    seo: { enabled: false }
                }
            },
            handler: (request, h) => {

                return h.view('index.html', { name: 'Nasa' });

            }
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

})();

