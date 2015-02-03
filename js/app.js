require.config({
	baseUrl:'js',
	waitSeconds:15
});
require(['lib/dom','gebiete/lang','lib/loading','lib/store','lib/cookie'], function($, lang, loading, db, cookie){
	"use strict";
	var gebietSel = function(){
		var val = parseInt( $('#terrSel').val() );
		
		var cont = document.getElementById('terrCont');
		if(cont){
			cont = $(cont).clear();
		}
		console.log(val);
		if( isNaN(val) ) return;
		
		if(!cont){
			cont = $('div').attr('id', 'terrCont').appendTo('body');
		}
		
		console.log('Lade Gebiet mit id:', val);
		var streets = db.select('*').from('streets').where('territory').equals(val);
		for(var i = 0; i<streets.length;i++){
			cont.add( dispStreet( streets[i] ) );
		}
		//Zeile zum hinzufuegen einsetzen
		$('div')
			.attr('id','streeAddCont')
			.add($('input').attr('type','button').attr('value', lang['street.add.caption']).attr('title', lang['street.add.title']).bind('click', addStreet))
			.appendTo(cont);
	};
	var dispStreet = function(street){
		var d = $('div')
			.attr('class','streetCont')
			.attr('id','street_' + street.id)
			.add($('div')
					.attr('class','header')
					.add($('h3').add(street.title))
					.add($('input')
							.attr('type','button')
							.attr('value',lang['street.remove.caption'])
							.attr('title', lang['street.remove.title'])
							.bind('click', removeStreet)));
		
		//Bisherige Häuser anzeigen
		var houses = db.select('*').from('houses').where('street').equals(street.id);
		for(var i = 0; i<houses.length;i++){
			d.add(dispHouse(houses[i]));
		}
		
		//Leiste zum hinzufuegen von Hausern
		$('div')
			.attr('class','addHouseCont')
			.add($('input')
				.attr('type','button')
				.attr('value', lang['house.add.caption'])
				.attr('title', lang['house.add.title'])
				.bind('click', addHouse)
			).appendTo(d);
		return d;
	};
	var dispHouse = function(house){
		var d = $('div').attr('class','houseCont').add(
			$('div').attr('class', 'header').add(
				$('h4').add(house.title))
				.add($('input')
					.attr('type','button')
					.attr('value', lang['house.remove.caption'])
					.attr('title', lang['house.remove.title'])
					.bind('click', removeHouse)
				)
			).attr('id','house_' + house.id);
		//Einwohner hinzufuegen
		var residents = db.select('*').from('residents').where('house').equals(house.id);
		for(var i = 0;i<residents.length;i++){
			d.add(dispRes(residents[i]));
		}
		
		//Leiste zum hinzufuegen
		$('div')
			.attr('class','addResidentCont')
			.add($('input')
				.attr('type','button')
				.attr('value', lang['resident.add.caption'])
				.attr('title', lang['resident.add.title'])
				.bind('click', addResident)
			).appendTo(d);
		return d;
	};
	var dispRes = function(resident){
		var d = $('div')
			.attr('class','residentCont')
			.attr('id','resid_' + resident.id);
		
		$('div').attr('class','header')
			.add($('span').add(resident.title).attr('class', resident.status === 'ni' ? 'ni' : ''))
			.add($('input')
				.attr('type','button')
				.attr('value', lang['resident.status.ni.caption'])
				.attr('title', lang['resident.status.ni.title'])
				.bind('click', niClick))
			.add($('input')
				.attr('type','button')
				.attr('value', lang['resident.status.interest.caption'])
				.attr('title', lang['resident.status.interest.title'])
				.bind('click', wvClick))
			.add($('input')
				.attr('type','button')
				.attr('value', lang['resident.rename.caption'])
				.attr('title', lang['resident.rename.title'])
				.bind('click', resRename))
			.add($('input')
				.attr('type','button')
				.attr('value', lang['resident.remove.caption'])
				.attr('title', lang['resident.remove.title'])
				.bind('click', resRename))
			.appendTo(d);
		
		return d;
	};
	var niClick = function(){
		var nSpan = $(this.previousSibling);
		var id = parseInt( this.parentNode.parentNode.id.substr(6) );
		if(nSpan.attr('class') === 'ni'){
			db.update('residents').set('status').to(null).where('id').equals(id);
			nSpan.attr('class','');
			this.nextSibling.disabled = false;
		}else{
			db.update('residents').set('status').to('ni').where('id').equals(id);
			nSpan.attr('class','ni');
			this.nextSibling.disabled = true;
		}
		db.save();
	};
	var wvClick = function(){
		
	};
	var resRename = function(){
		
	};
	var addResident = function(){
		var resName = prompt(lang['resident.add.prompt']);
		if(!resName) return;
		
		var houseCont = this.parentNode.parentNode;
		var res = {
			title:resName,
			house: parseInt(houseCont.id.substr(6))
		};
		db.insertInto('residents').values(res).increaseKey('id');
		houseCont.insertBefore(dispRes(res).get(), houseCont.lastChild);
		db.save();
	};
	var addHouse = function(){
		var houseNum = prompt(lang['house.add.prompt']);
		if(!houseNum) return;
		
		var streetCont = this.parentNode.parentNode;
		
		var house = {
			title:houseNum,
			street : parseInt( streetCont.id.substr(7) )
		};
		db.insertInto('houses').values(house).increaseKey('id');
		streetCont.insertBefore(dispHouse(house).get(), streetCont.lastChild);
		db.save();
	};
	var removeHouse = function(){
		if(!confirm(lang['house.remove.prompt'])) return;
		
		var cont = $(this.parentNode.parentNode);
		var id = parseInt(cont.attr('id').substr(6));
		db.deleteFrom('houses').where('id').equals(id);
		cont.remove();
		db.save();
	};
	var addStreet = function(){
		var streetName = prompt(lang['street.add.prompt']);
		if(!streetName)return;
		
		var neuStrasse = {
			title : streetName,
			territory : parseInt($('#terrSel').val())
		};
		db.insertInto('streets').values(neuStrasse).increaseKey('id');
		var cont = document.getElementById('terrCont');
		cont.insertBefore(dispStreet(neuStrasse).get(), cont.lastChild);
		db.save();
	};
	var removeStreet = function(){
		if(!confirm(lang['street.remove.prompt'])) return;
		
		//TODO: Rueckbesuche retten
		var cont = $(this.parentNode.parentNode);
		var id = parseInt(cont.attr('id').substr(7));
		console.log(id);
		db.deleteFrom('streets').where('id').equals(id);
		db.deleteFrom('houses').where('street').equals(id);
		cont.remove();
		db.save();
	};
	var addGebiet = function(){
		var gebietName = prompt(lang['territories.add.prompt']);
		if(!gebietName) return;
		
		var neuGebiet = {
			title:gebietName
		};
		db.insertInto('territory').values(neuGebiet).increaseKey('id');
		$('option').attr('value', neuGebiet.id).add(neuGebiet.title).appendTo('#terrSel');
		db.save();
	};
	var removeGebiet = function(){
		if(!confirm(lang['territories.remove.prompt'])) return;
		
		console.log('Gebiet soll entfernt werden');
		
		//TODO: Rueckbesuche sammeln und sichern
		var sel = $('#terrSel');
		var idString = sel.val();
		var id = parseInt(idString);
		console.log('ID:', id);
		db.deleteFrom('territory').where('id').equals(id);
		db.deleteFrom('streets').where('territory').equals(id);
		db.save();
		
		//Aus Optionsschaltfläche entfernen
		var c = sel.get().firstChild;
		while(c){
			if(c.value === idString){
				c.parentNode.removeChild(c);
				break;
			}
			c = c.nextSibling;
		}
		//Straßen ausblenden
		$('#terrCont').remove();
	};
	var getUsername = function(){
		var uN = cookie.read('userName');
		if(uN) return uN;
		
		uN = prompt(lang['userName.prompt']);
		if(uN){
			cookie.create('userName', uN, 14);
			return uN;
		}
		if(confirm(lang['userName.noName.confirm'])){
			return null;
		}
		return getUsername();
	}
	
	//Setze Titel
	$(document.getElementsByTagName('title')[0]).clear().add(lang['application.title']);
	$('h1').add(lang['application.header']).appendTo('body');
	var cont = $('div').appendTo('body').add($('h2').add(lang['territories.header'])).attr('id','terrSelCont');
	var sel = $('select').attr('id','terrSel').add($('option').attr('value','--').add(lang['territories.select.nothingChosen'])).bind('change', gebietSel);
	var gebiete = db.select('*').from('territory');
	for(var i = 0; i<gebiete.length;i++){
		sel.add($('option').attr('value', gebiete[i].id).add(gebiete[i].title));
	}
	gebiete = null;
	sel.appendTo(cont);
	$('input').attr('type','button').attr('value', lang['territories.add.caption']).attr('title', lang['territories.add.title']).bind('click', addGebiet).appendTo(cont);
	$('input').attr('type','button').attr('value', lang['territories.remove.caption']).attr('title', lang['territories.remove.title']).bind('click', removeGebiet).appendTo(cont);
	
	if(getUsername()){
		//Ueber zwei require, da der erste mir wichtiger ist
		require(['gebiete/backendloader'], function(){
			loading.hide();
		});
		require(['gebiete/backendsaver']);
	}else{
		loading.hide();
	}
});