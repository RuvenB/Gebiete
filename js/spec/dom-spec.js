define(['lib/dom'], function(dom){
	"use strict";
	describe('dom', function(){
		it('should empty element', function(){
			var d = document.createElement('h1');
			d.appendChild(document.createTextNode('TestText'));
			var l = document.createElement('a');
			l.href='http://www.google.com';
			l.appendChild(document.createTextNode('google'));
			d.appendChild(l);
			
			var o = dom(d);
			expect(o).toBeDefined();
			expect(o.clear()).toBe(o);
			expect(d.firstChild).toBeNull();
		});
		it('should remove element', function(){
			var d = document.createElement('div');
			d.id="testElem";
			d.appendChild(document.createTextNode("Test"));
			document.body.appendChild(d);
			
			var dd = dom('#testElem');
			dd.remove();
			expect(document.getElementById('testElem')).toBeNull();
		});
		it('inserts text', function(){
			var d = document.createElement('div');
			d.id = 'test';
			document.body.appendChild(d);
			var dd = dom(d);
			dd.add('Test');
			expect(d.firstChild).toBeDefined();
			expect(d.firstChild.nodeType).toEqual(3);
			expect(d.firstChild.nodeValue).toEqual('Test');
			dd.remove();
		});
		it('sets attribute', function(){
			var d = dom('div').add('Test').appendTo(document.body).attr('id', 'test');
			expect(d.get().getAttribute('id')).toEqual('test');
			d.remove();
		});
		it('appends to other dom obj', function(){
			var d = document.createElement('div');
			var domD = dom(d);
			dom('h2').add('Test').appendTo(domD);
			
			expect(d.firstChild).not.toBeNull();
		});
		it('gets value', function(){
			var d = document.createElement('input');
			d.value = 'Test';
			expect(dom(d).val()).toEqual('Test');
		});
		it('sets value', function(){
			var d = document.createElement('input');
			dom(d).val('T');
			expect(d.value).toEqual('T');
		});
	});
});