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
		this.add = function(elemOrText, attribs){
			if(elemOrText.constructor === this.constructor){
				element.appendChild(elemOrText.get());
			}else if(isString(elemOrText)){
				if(attribs){
					var e = document.createElement(elemOrText);
					for(var prop in attribs){
						if(attribs.hasOwnProperty(prop)){
							e[prop] = attribs[prop];
						}
					}
					element.appendChild(e);
				}else{
					element.appendChild( document.createTextNode(elemOrText) );	
				}
			}else if(typeof elemOrText === 'number' ){
				//Eine Zahl soll eingesetzt werden
	 			element.appendChild( document.createTextNode( elemOrText.toString() ) );
			}else if(elemOrText.constructor === Array){
				//Ein Array. Fuege jedes Element hinzu
				for(var i = 0; i<elemOrText.length;i++){
					self.add(elemOrText[i]);
				}
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
			}else if(elemOrText.charAt(0) === '#'){
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
	 * Wenn ein String uebergeben wird,
	 * und dieser mit '#' beginnt wird ein Element mit der ID gesucht,
	 * ansonsten wird ein Element mit dem Tag erzeugt.
	 * Wenn ein Element per Tagname erzeugt wird, kann man als nächsten Parameter Attribute mitgeben.
	 * Dabei ist zu berücksichtigen, dass man statt 'class' 'className' und statt 'for' (bei label) 'htmlFor' nehmen muss.
	 * 
	 * Wenn der erste Parameter kein String ist wird dieser als Element genommen.
	 */
	return function(sel, options){
		if(isString(sel)){
			if(sel.charAt(0) === '#'){
				return new con(document.getElementById(sel.substr(1)));
			}
			var el = document.createElement(sel);
			if(options){
				for(var prop in options){
					if(options.hasOwnProperty(prop)){
						el[prop] = options[prop];
					}
				}
			}
			return new con(el);
		}
		return new con(sel);
	};
 });
