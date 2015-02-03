define(['lib/dom'], function(d){
	var el = d('#loading');
	return{
		show:function(){
			el.show();
		},
		hide:function(){
			el.hide();
		}
	}
});