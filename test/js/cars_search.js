$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();									//请求地址
	var carsHisSearch = $.localStorage("carsHisSearch");		//获取搜索记录
	var carsList = {};											//搜索记录数组
	var app = "MN16040013";										//搜索车辆详情需要的appid
	/*---------------全局变量 end---------------*/
	
	function init(){
		if(carsHisSearch){
			carsList = JSON.parse(carsHisSearch) ? JSON.parse(carsHisSearch) : "";
			if(!carsList){
				return;
			}
			var html = "";
			for(var key in carsList){
				html+='<li class="mui-table-view-cell">'+carsList[key]+'</li>';
			}
//			for (var i = 0; i < leng; i++) {
//				html+='<li class="mui-table-view-cell">'+carsList[i]+'</li>';
//			}
			$(".mui-table-view").html(html);
		}
	}
	
	function bindEvent(){
		//模糊搜索
		$("input").on("keyup",function(){
			carKeyup($(this).val());
		});
		//清除按钮
		mui(".mui-content").on("tap",".mui-icon-clear",function(e){
			$(".mui-table-view").show().next(".cars_search_rs").hide();
		});
		//查找
		mui('.mui-content').on('tap','#search',function(){
			search($("input").val());
		});
		//清空历史记录
		mui('.cars_search_latest').on('tap','#clearHistory',function(){
			localStorage.removeItem("carsHisSearch");
			$(".mui-table-view").html("");
			mui.alert("已清空记录");
		});
		//点击历史记录填充到搜索框
		mui(".mui-table-view").on("tap","li",function(){
			$("input").val($(this).html());
		});
	}
	//车牌号模糊查找
	function carKeyup(key){
		$.ajax({
			type:"post",
			url:domain,
			data:{
				api:"getVehicleInfo",
				q:key
			},
			success:function(Result){
                if(Result){
                    var result = JSON.parse(Result);
                    var html = "";
                    for (var i=0;i<result.length;i++) {
                    	html+='<li class="mui-table-view-cell">'+result[i].VehicleId+'</li>';
                    }
                    $(".cars_search_rs").html(html);
                }else{
                    $(".cars_search_rs").html("");
                }
                $(".mui-table-view").hide().next(".cars_search_rs").show();
                mui('.cars_search_rs').on('tap','li',function(){
                	$("input").val($(this).text());
                	$(".mui-table-view").show().next(".cars_search_rs").hide();
                }) 
        	}
		});
	}
	//点击搜索按钮的结果
	function search(car){
		if(!car){
			mui.alert("车牌号不能为空!");
			return;
		}
		carsList[car] = car;
//		carsList.push(car);
		sessionStorage.setItem("detail_car_no",car);			//详情页需要的carno
		sessionStorage.setItem("track_car_no",car);				//轨迹回放需要的carno
		$.localStorage("carsHisSearch",carsList);
		$.ajax({
			type:"post",
			url:domain,
			async:true,
			data:{
				usr:"UR16040002",
				pwd:"40BD001563085FC35165329EA1FF5C5ECBDBBEEF",
				api:"getCarDetail",
				car:car,
				app:app
			},
			success:function(Result){
				if(Result){
					var result = JSON.parse(Result);
					if (result.success) {
						var data = result.data[0];
						sessionStorage.setItem("main_cardata",JSON.stringify(data));
						window.location.href = "main.html";
					} else{
						mui.alert(result.message);
					}
				}else{
					mui.alert("无数据");
				}
			}
		});
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
});