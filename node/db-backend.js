var path = require('path'),
	fs = require('fs');

function handleRequest(request, response){
	console.log('DB-backend aufgerufen');
	var cookie = request.headers.Cookie;
	if(!cookie || cookie.length < 10){
		console.log('Cookie nicht gesetzt');
		response.writeHead(400, {'Content-Type': 'text/html'});
		response.end();
		return;
	}
	var user = cookie.substr(10);
	var userDir = path.join(process.cwd(), 'db/' + user);
	console.log('UserName aus cookie: ', user, 'Verzeichnis fuer Nutzer:', userDir);
	
	if(request.method === 'GET'){
		path.exists(userDir, function(exists){
			if(!exists){
				//Kann dann darunter auch keine Tabelle geben: alles 404...
				console.log("not exists: " + filename);
				response.writeHead(404, {'Content-Type': 'text/html'});
				response.write('404 Not Found\n');
				response.end();
				return;
			}
		}))
	}
	
}
exports.handleRequest = handleRequest;