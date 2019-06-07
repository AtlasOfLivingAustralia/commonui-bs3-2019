var static = require('node-static'),
    http = require('http'),
    addressCORS = "*",
    port = 8099;

/**
 * Files in build directory can be accessed from this server.
 * Example http://localhost:8099/css/jquery-ui.css
 *
 * Run server using the command -
 * node server.js
 */

var file = new(static.Server)('./build', {cache: false, headers: {"Access-Control-Allow-Origin": addressCORS}});
http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(port);