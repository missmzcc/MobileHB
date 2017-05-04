$(function(){
	var carsHisSearch = $.localStorage("carsHisSearch");
	var carsList = [];
	
	function init(){
		if(carsHisSearch){
			carsList = JSON.parse(carsHisSearch) ? JSON.parse(carsHisSearch) : [];
			var leng = carsList.length;
			var html = "";
			for (var i = 0; i < leng; i++) {
				html+='<li class="mui-table-view-cell">'+carsList[i]+'</li>';
			}
			$(".mui-table-view").append(html);
		}
	}
	
	function search(){
		var car = $("input[type='search']").html();
		console.log(car);
		carsList.push(car);
		$.localStorage("carsHisSearch",carsList);
	}
	
	function bindEvent(){
//		mui(document).on("tap",".mui-search",function(){
//			search();	
//		});
		mui('.cars_latest').on('tap','#clearHis',function(){
			localStorage.removeItem("carsHisSearch");
		}) 
	}
	
	init();
	bindEvent();
});