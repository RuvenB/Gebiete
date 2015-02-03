/**
 * Quasi jQuery xtra-lite
 */
 define(function(){
	/**
	 * Der verwendte Constructor
	 */
	var con = function(element){
		var self = this;
		
		/**
		 * Entfernt alle Kindelemente
		 */
		this.clear = function(){
			var c = element.firstChild, old;
			while(c){
				old = c;
				c = c.nextSibling;
				element.removeChild(old);
			}
			
			return self;
		};
		/**
		 * Wenn es ein String ist wird dieser als Text hinzugefügt,
		 * ansonsten das element selbst
		 */
		this.add = function(elemOrText){
			if(elemOrText.constructor === this.constructor){
				element.appendChild(elemOrText.get());
			}else if(isString(elemOrText)){
				element.appendChild( document.createTextNode(elemOrText) );
			}else{
				element.appendChild(elemOrText);
			}
			return self;
		};
		/**
		 * Fuegt das Element einem dom Knoten hinzu
		 * Wenn ein string uebergeben wird, wird geprüft, ob er mit "#" beginnt.
		 * in diesem Fall wird dem Knoten mit der ID das Element angehaengt
		 * ansonsten dem ersten Element mit dem Tagnamen.
		 * Wenn Parameter kein String ist wird Element dem Parameter angehaengt.
		 */
		this.appendTo = function(elemOrText){
			if(elemOrText.constructor === this.constructor){
				//Auch ein Objekt des DOM Helpers
				elemOrText.add(this);
			}else if(!isString(elemOrText)){
				elemOrText.appendChild(element);
			}else if(elemOrText.indexOf('#') === 0){
				document.getElementById(elemOrText.substr(1)).appendChild(element);
			}else{
				document.getElementsByTagName(elemOrText)[0].appendChild(element);
			}
			return self;
		};
		this.get = function(){
			return element;
		};
		/**
		 * Entferne das Element. Gibt nichts zurueck, wozu auch?
		 */
		this.remove = function(){
			element.parentNode.removeChild(element);
		};
		/**
		 * Versteckt das Element
		 */
		this.hide = function(){
			element.style.display = 'none';
			return self;
		};
		/**
		 * Setzt diesply auf block
		 */
		this.show = function(){
			element.style.display = 'block';
			return self;
		};
		/**
		 * Gibt den Attributswert zurueck oder setzt ihn
		 */
		this.attr = function(name, value){
			if(value === undefined){
				return element.getAttribute(name);
			}
			element.setAttribute(name, value);
			return self;
		};
		/**
		 * Setzt einen Event Handler
		 */
		this.bind = function(event, handler){
			element.addEventListener(event, handler);
			return self;
		};
		/**
		 * Gibt das value Attribut zurueck oder setzt es
		 */
		this.val = function(valToSet){
			if(valToSet === undefined){
				return element.value;
			}
			element.value = valToSet;
			return self;
		};
	};
	var isString = function(t){
		return typeof t === 'string';
	};
	/**
	 * Wenn ein String übergeben wird,
	 * und dieser mit '#' beginnt wird ein Element mit der ID gesucht.
	 * ansonsten wird ein Element mit dem Tag erzeugt
	 * 
	 * ansonsten wird dieser DOM Knoten umschlossen
	 */
	return function(sel){
		if(isString(sel)){
			if(sel.indexOf('#') === 0){
				return new con(document.getElementById(sel.substr(1)));
			}
			return new con(document.createElement(sel));
		}
		return new con(sel);
	};
 });