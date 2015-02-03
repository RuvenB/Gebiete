define(['lib/store'], function(db){
	describe('store', function(){
		afterEach(function(){
			db.clearCache();
			localStorage.clear();
		});
		it('Loads All Values', function(){
			localStorage.setItem('gebiete', '["test","test2","randersacker"]');
			var d = db.select('*').from('gebiete');
			expect(d).not.toBeNull();
			expect(d.length).toEqual(3);
		});
		it('filters Values', function(){
			var o = [
				{"name":"da", id:1},
				{"name":"hier", id:2},
				{"name":"Test2", id:3},
				{"name":"Test", id:4}
			];
			localStorage.setItem('t2', JSON.stringify(o));
			var d = db
				.select('name')
				.from('t2')
				.where('id')
				.equals(2);
			expect(d).not.toBeNull();
			expect(d.length).toEqual(1);
			expect(d[0]).toEqual('hier');
		});
		it('inserts data in new table', function(){
			var o = {
				name:'ich',
				street:'here'
			};
			db.insertInto('adress').values(o);
			var dbVal = db.select('*').from('adress');
			expect(dbVal.length).toEqual(1);
			expect(dbVal[0]).toEqual(o);
		});
		it('inserts data and increases key', function(){
			var o = [
				{"name":"da", id:1},
				{"name":"hier", id:2},
				{"name":"Test2", id:3},
				{"name":"Test", id:4}
			];
			localStorage.setItem('t3', JSON.stringify(o));
			//ID soll berechnet werden
			var nd = {
				'name':'ich'
			};
			db.insertInto('t3').values(nd).increaseKey('id');
			var dbVal = db.select('id').from('t3').where('name').equals('ich');
			expect(dbVal.length).toEqual(1);
			expect(dbVal[0]).toEqual(5);
		});
		it('saves data to localStorage', function(){
			db.insertInto('t4').values({'name':'du','street':'here'}).increaseKey('id');
			db.save();
			var l = localStorage.getItem('t4');
			expect(l).toBeDefined();
			expect(l).not.toBeNull();
			expect(l).toEqual('[{"name":"du","street":"here","id":1}]');
		});
		it('drops table', function(){
			localStorage.setItem('t5', JSON.stringify([{name:'test',id:1}]));
			localStorage.setItem('t6', JSON.stringify([{name:'test2',id:1}]));
			expect(db.select('name').from('t5').length).toEqual(1);
			expect(db.select('name').from('t6').length).toEqual(1);
			db.dropTable('t5');
			expect(db.select('name').from('t6').length).toEqual(1);
			db.save();
			expect(db.select('name').from('t6').length).toEqual(1);
			expect(localStorage.getItem('t5')).toBeNull();
			expect(localStorage.getItem('t6')).not.toBeNull();
		});
		it('deletes data', function(){
			var o = [
				{"name":"da", id:1},
				{"name":"hier", id:2},
				{"name":"Test2", id:3},
				{"name":"Test", id:4}
			];
			localStorage.setItem('t7', JSON.stringify(o));
			db.deleteFrom('t7')
				.where('id')
				.equals(2);
			expect( db.select('*').from('t7').length).toEqual(3);
		});
		it('updates data', function(){
			var o = [
				{"name":"da", id:1},
				{"name":"hier", id:2},
				{"name":"Test2", id:3},
				{"name":"Test", id:4}
			];
			localStorage.setItem('t8', JSON.stringify(o));
			expect(db.select('name').from('t8').where('name').equals('hier').length).toEqual(1);
			db.update('t8').set('name').to('Schmidt').where('id').equals(2);
			expect(db.select('name').from('t8').where('name').equals('hier').length).toEqual(0);
			var arr = db.select('id').from('t8').where('name').equals('Schmidt');
			expect(arr.length).toEqual(1);
			expect(arr[0]).toEqual(2);
		});
	});
});