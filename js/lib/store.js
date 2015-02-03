/**
 * Soll den Zugriff auf die in storage abgelegten Daten verbessern.
 * 
 * Über select erhält man Teile der Daten
 * Über save() werden die geänderten Daten gesichert
 */
define(function(){
	//Lokale cache der Daten
	var data = {};
	var changes = []; //Enthaelt Namen der geaenderten Tabellen
	
	//Queue with actions to perform before saving or an select
	var actions = [];
	var runActions = function(){
		var action = actions.pop();
		while(action){
			action();
			action = actions.pop();
		}
	};
	
	//Werden bei Änderungen benachrichtigt, welche Tabelle geaendert wurde
	var observer = [function(tableName){
		//Zunächst vermerke ich fuer die Speicherfunktion die Änderungen
		if(changes.indexOf(tableName) < 0) changes.push(tableName);
	}];
	
	/**
	 * Wenn Tabelle schon im Cache ist wird sie zurueckgegeben.
	 * Wenn in localStorage vorhanden wird sie in Cache gelegt,
	 * ansonsten leer angelegt
	 */
	var loadDataInCache = function(tableName){
		var t = data[tableName];
		if(t) return t;
		
		t = localStorage.getItem(tableName);
		if(t){
			t = JSON.parse(t);
		}else{
			t = [];
		}
		data[tableName] = t;
		return t;
	};
	var markChanged = function(tableName){
		for(var i = observer.length-1;i>=0;i--){
			observer[i](tableName);
		}
	};
	var extendArr = function(array, selector){
		var ret;
		if(selector === '*'){
			ret = array;
		}else{
			//Nur ein Teil der Felder wird direkt gebraucht
			ret = [];
			for(var i = 0;i<array.length;i++){
				ret.push(array[i][selector]);
			}
			ret.orig = array;
		}
		ret.where = function(key){
			return filter(array, key, selector);
		};
		ret.and = function(key){
			return filter(array, key, selector);
		};
		return ret;		
	}
	var f = function(arr, key, selector, funct){
		var r = [];
		var array = arr.orig ? arr.orig : arr;
		for(var i=0;i<array.length;i++){
			if(funct(array[i][key])) r.push(array[i]);
		}
		return extendArr(r, selector);
	};
	var isNullFilter = function(v){return v === null;};
	var isNotNullFilter = function(v){return v !== null};
	var filter = function(arr, key, selector){
		return{
			isNull:function(){
				return f(arr, key, selector, isNullFilter);
			},
			isNotNull:function(){
				return f(arr, key, selector, isNotNullFilter);
			},
			equals:function(val){
				return f(arr, key, selector, function(v){
					return v === val
				});
			},
			isLowerThan:function(val){
				return f(arr, key, selector, function(v){return v < val});
			},
			filter:function(func){
				return f(arr, key, selector, func);
			}
		};
	}
	var selCon = function(selector){
		return{
			from:function(table){
				return extendArr(loadDataInCache(table), selector);
			}
		}
	};
	var saveFunc = function(){
		runActions();
		var value;
		for(var i = changes.length-1;i>=0;i--){
			value = data[changes[i]]
			if(value){
				window.localStorage.setItem(changes[i], JSON.stringify(value));	
			}else{
				window.localStorage.removeItem(changes[i]);
			}
		}
		change = [];
	};
	/**
	 * wird von der aufgerufen Funktion z.B. isNull() im deleteFrom aufgerufen
	 */
	var filterDelete = function(tableName, fieldName, toDeleteRows, funct){
		//Filtere und entferne solche die Filter nicht entsprechen aus Liste
		for(var i=toDeleteRows.length-1; i >= 0; i--){
			if(!funct(toDeleteRows[i][fieldName])){
				toDeleteRows.splice(i,1); //Zeile entfernen
			}
		}
		
		//Nun Funktionen zur Weiterverarbeitung zurueckgeben
		return{
			and:function(field){
				return deleteFilter(tableName, field, notYetReinserted);
			}
		};
	}
	var deleteFilter = function(tableName, fieldName, toDeleteRows){
		return{
			isNull:function(){
				return filterDelete(tableName, fieldName, toDeleteRows, isNullFilter);
			},
			isNotNull:function(){
				return filterDelete(tableName, fieldName, toDeleteRows, isNotNullFilter);
			},
			equals:function(val){
				return filterDelete(tableName, fieldName, toDeleteRows, function(v){
					console.log('Vergleiche ', v, 'mit',val,'Ergebnis:', v === val );
					return v === val;
				});
			},
			isLowerThan:function(val){
				return filterDelete(tableName, fieldName, toDeleteRows, function(v){return v < val});
			},
			filter:function(func){
				return filterDelete(tableName, fieldName, toDeleteRows, func);
			}
		};
	};
	return{
		select:function(selector){
			runActions();
			return new selCon(selector);
		},
		insertInto:function(tableName){
			return{
				values:function(vals){
					var table = loadDataInCache(tableName);
					actions.push(function(){
						table.push(vals);
						markChanged(tableName);
					});
					return {
						increaseKey:function(keyName){
							runActions(); //Damit ich auf aktuellste Daten zugriff habe
							var max = 0;
							for(var i = table.length-1;i>=0;i--){
								if(table[i][keyName] > max){
									max = table[i][keyName];
								}
							}
							vals[keyName] = max+1;
						}
					}
				}
			}
		},
		/**
		 * removes an entire table
		 */
		dropTable : function(tableName){
			delete data[tableName];
			markChanged(tableName);
		},
		/**
		 * Speichert die geanderten Tabellen
		 */
		save:saveFunc,
		deleteFrom:function(tableName){
			var toDelete = loadDataInCache(tableName).slice(0);
			actions.push(function(){
				//Löscht alle in toDelete aus der Tabelle
				var d = data[tableName];
				var change = false;
				for(var i = d.length-1;i>=0;i--){
					if(toDelete.indexOf(d[i]) >=0){
						d.splice(i,1);
						change = true;
					}
				}
				if(change){
					markChanged(tableName);	
				}
			});
			return{
				where:function(fieldName){
					return deleteFilter(tableName, fieldName, toDelete);
				}
			}
		},
		update:function(tableName){
			return{
				set:function(fieldName){
					return{
						to:function(newVal){
							var toUpdate = loadDataInCache(tableName).slice(0);
							console.log('Alle Zeilen:', toUpdate);
							actions.push(function(){
								//Aendere die nach (evtl.) Filter verbleibenden Zeilen
								console.log('Aendere folgende Zeilen:', toUpdate);
								for(var i = toUpdate.length-1; i>= 0;i--){
									toUpdate[i][fieldName] = newVal;
								}
							});
							return{
								where:function(filterField){
									return deleteFilter(tableName, filterField, toUpdate);
								}
							}
						}
					};
				}
			};
		},
		/**
		 * Saves Changes to disk and clears the cache
		 */
		clearCache : function(){
			saveFunc();
			data = {};
		},
		/**
		 * Fügt eine Funktion hinzu, welche aufgerufen wird, wenn es Änderungen an eine der Tabellen gibt
		 */
		addObserver : function(o){
			observer.push(o);
		}
	}
});