/**
 * Ein Observer für Aenderungen an der Datenbank.
 * Lädt diese dann wenn möglich hoch
 */
define(['lib/store', 'lib/ajax'], function(db, ajax){
	var toSave = db.select('*').from('toSave'); //Tabellen, welche noch gespeichert werden müssen, da offline
	
	//Falls Verbindung zwischendurch weg ist, muss ich mich ja schonmal vorbereiten wenn sie wiederkommt
	document.addEventListener('online', function(){
		var tableToSave = toSave.pop();
		while(tableToSave){
			saveDB(tableToSave);
			tableToSave = toSave.pop();
		}
	});
	window.addEventListener('unload', function(){
		//Fuer das nächste mal Änderungen sichern
		db.deleteFrom('toSave');
		for(var i = toSave.length-1;i>=0;i--){
			db.insertInto('toSave').values(toSave[i]);
		}
		db.save();
	});
	
	// Sendet den lokalen Inhalt der Tabelle zum Server
	var saveDB = function(tb){
		ajax.post('../db/' + tb, JSON.stringify(db.select('*').from(tb)));
	};
	db.addObserver(function(tablename){
		if(navigator.onLine === true){
			saveDB(tablename);
		}else{
			toSave.push(tablename); //Wird dann gespeichert, wenn wieder online gehe
		}
	});
});