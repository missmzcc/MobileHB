$(function(){
	var domain = $.domain();
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
			$(".mui-table-view").html(html);
		}
	}
	
	function bindEvent(){
		//点击搜索
		$(".mui-content").on("click",".mui-search",function(e){
			if($(this).hasClass("mui-active")){
				var Car = $(this).find("input").val();
				if(Car){
					search(Car);
				}else{
					mui.alert("请输入车牌号");
				}
			}
		});
		//清空历史记录
		mui('.cars_latest').on('tap','#clearHistory',function(){
			localStorage.removeItem("carsHisSearch");
			$(".mui-table-view").html("");
			mui.alert("已清空记录");
		});
		//点击历史记录填充到搜索框
		$(".mui-table-view").on("click","li",function(){
			$("input").val($(this).html());
		});
	}
	
	function search(car){
		carsList.push(car);
		$.localStorage("carsHisSearch",carsList);
		$(".mui-table-view").append('<li class="mui-table-view-cell">'+car+'</li>');
		$.ajax({
			type:"post",
			url:domain,
			async:true,
			data:{
				usr:"UR16040002",
				pwd:"40BD001563085FC35165329EA1FF5C5ECBDBBEEF",
				api:"realtime_pos",
				car:"鄂AP9018",
				app:"MN16040013"
			},
			success:function(Result){
				if(Result){
					var result = JSON.parse(Result);
					if (result.success) {
						var data = result.data[0];
						console.log(data);
						sessionStorage.setItem("main_cardata",JSON.stringify(data));
						window.location.href = "main.html";
					} else{
						mui.alert(result.message);
					}
				}else{
					mui.alert("系统错误");
				}
			}
		});
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
});