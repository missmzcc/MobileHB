$(function() {
	/*---------------全局变量 start---------------*/
	var domain = $.domain(); //请求地址
	var app = "MN16040013"; //搜索车辆详情需要的appid
	/*------------	全局变量 end------------------*/

	//事件绑定
	function bindEvent() {
		//按键后模糊搜素
		$("input").on("keyup", function() {
			queryLike($(this).val());
		});
		//点击查询
		$("#realtime-search").click(function() {
			qry_car();
		})
	}

	//模糊查询
	function queryLike(key) {
		$.ajax({
			type: "post",
			url: domain,
			async: true,
			data: {
				api: "getVehicleInfo",
				q: key
			},
			success: function(Result) {
				if(Result) {
					var resault = JSON.parse(Result);
					var html = "";
					for(var i = 0; i < resault.length; i++) {
						html += '<li class="mui-table-view-cell">' + resault[i].VehicleId + '</li>'
					}
					$(".cars_search_rs").html(html);
					$(".cars_search_rs").show()
				} else {
					$(".cars_search_rs").html("");
				}
				//点击模糊搜索中的一个
				mui(".cars_search_rs").on('tap', 'li', function() {
					$("input").val($(this).text());
					$(".cars_search_rs").hide();
				})
			}
		});
	}

	//换车查询
	function qry_car() {
		//清空坐标集合
		window.points = [];
		qry_pos();
	}

	//车辆信息查询
	function qry_pos() {
		car = $("input").val();
		if(!car) {
			alert("车牌号为空！");
			return;
		};
		sessionStorage.setItem("realtime",car);
		$.ajax({
			type: "post",
			url: domain,
			async: true,
			data: {
				usr: "UR16040002",
				pwd: "40BD001563085FC35165329EA1FF5C5ECBDBBEEF",
				api: "realtime_pos",
				car: car,
				app: app
			},
			success: function(Result) {
				if(Result) {
					var result = JSON.parse(Result);
					if(result.success) {
						var data = result.data[0];
						//存储数据
						sessionStorage.setItem("realtime_data",JSON.stringify(data))
						window.location.href = "realtimeSearch.html";
					} else {
						mui.alert(result.message);
					}
				} else {
					mui.alert("无数据");
				}
			}
		});
	}
	//加载绑定事件
	bindEvent();
})