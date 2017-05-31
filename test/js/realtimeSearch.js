$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();									//请求地址
	/*------------	全局变量 end------------------*/
	
	//事件绑定
	function bindEvent (){
		//按键后模糊搜素
		$("input").on("keyup",function(){
			queryLike($(this).val());
		});
	}
	
	//模糊查询
	function queryLike(key){
		$.ajax({
			type:"post",
			url:domain,
			async:true,
			data:{
				api:"getVehicleInfo",
				q:key
			},
			success:function(Result){
				if(Result){
					var resault=JSON.parse(Result);
					var html="";
					for(var i=0;i<resault.length;i++){
						html+='<li class="mui-table-view-cell">'+resault[i].VehicleId+'</li>'
					}
					$(".cars_search_rs").html(html);
				}else{
					$(".cars_search_rs").html("");
				}
				//点击模糊搜索中的一个
				mui(".cars_search_rs").on('tap','li',function(){
					$("input").val($(this).text());
					$(".cars_search_rs").hide();
				})
			}
		});
	}


//加载绑定事件
bindEvent();

})



