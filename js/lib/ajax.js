/**
 * Einfacher Möglichkeit AJAX Aufrufe abzusetzen
 */
define({
	get:function(url, onSuccess, onError){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState !== 4) return;
			 
			if(xmlHttp.status == 200){
				onSuccess(response);
				return;
			}
			onError(xmlHttp.status);
		}
		xmlHttp.open('GET', url, true);
		xmlHttp.send(null);
	},
	post:function(url, body, onSuccess, onError){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState !== 4) return;
			 
			if(xmlHttp.status == 200){
				onSuccess(response);
				return;
			}
			onError(xmlHttp.status);
		 }
		xmlHttp.open('POST', url, true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", body.length);
		xmlHttp.setRequestHeader("Connection", "close");
		xmlHttp.send(null);
	}
});