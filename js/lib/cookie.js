/**
 * Cookie Library.
 * Code von http://www.quirksmode.org/js/cookies.html angepasst damit es eine require.js Bibliothek sein kann
 */
 define(function(){
	var createFunc = function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	};
	return{
		create:createFunc,
		read:function(name){
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		erase:function(name){
			createFunc(name,"",-1);
		}
	};	
 });