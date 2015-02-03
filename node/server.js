var http = require('http');
var url = require('url');
var staticHandler = require('./handlestatic');
var dbBackend = require('./db-backend.js');
var gebietRegexp = /^\/Gebiete\/(.+)?$/;

function onRequest(req, resp){	
	var reqUrl = url.parse(req.url);
	console.log('reqUrl', reqUrl);
	
	var p = gebietRegexp.exec(reqUrl.pathname);
	if(p){
		console.log('Gehe nach Gebiete');
		var path = p[1];
		if(path){
			if(path.indexOf('..') > -1){
				//Hier versucht jemand zu schummeln
				resp.writeHead(404);
				resp.end();
				return;
			}
		}else{
			path = 'index.html';
		}
		staticHandler.handleStatic('../' + path, resp);
		return;
	}
	if(reqUrl.pathname.indexOf('/db/') === 0){
		//Gehe zu db backend
		dbBackend.handleRequest(req, resp);
		return;
	}
	console.log('Gehe woanders hin:', reqUrl);
	resp.writeHead(200, {'Content-Type':'text/html'});
	resp.write('Hello World');
	resp.end();
}
http.createServer(onRequest).listen(8888);
console.log('Server has started');