(function($) {
	/*---------------全局变量 start---------------*/
	var domain = Configure.domain;
	var geoc = new BMap.Geocoder();
	var convertor = new BMap.Convertor();
	/*---------------全局变量 end---------------*/

	function init() {
		initTime();
		getData();
	}

	/*---------------事件绑定 start---------------*/
	function bindEvent() {
		//mui阻止了a的默认跳转事件,要跳转页面必须写方法
		//弹出时间选择
		mui("header").on('tap', '.mui-pull-right', function(e) {
			var day = document.querySelector(".mui-pull-right");
			var picker = new mui.DtPicker({
				type: "date"
			});
			picker.show(function(rs) {
				day.innerHTML = rs.text;
			});
		});
		//跳转轨迹回放
		mui('.mui-content').on('tap', '.mileage_play', function() {
			var time = document.querySelector(".mui-pull-right").innerText;
			sessionStorage.setItem("track_search", JSON.stringify({
				car: document.querySelector(".mui-title").innerText,
				begin_time : time + " 00:00:00",
				end_time : time + " 23:59:59"
			}));
			window.location.href = "track_play.html";
		});
	}
	/*---------------事件绑定 end---------------*/

	//初始化右上角为当天
	function initTime() {
		var time = new Date();
		var month = time.getMonth() < 9 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
		var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
		document.querySelector(".mui-pull-right").innerText = time.getFullYear() + "-" + month + "-" + day;
	}

	//数据获取
	function getData() {
		var car = document.querySelector(".mui-title").innerText;
		var day = document.querySelector(".mui-pull-right").innerText;
		$.ajax({
			type: "post",
			url: domain,
			data: {
				api:"getMileageDetail",
				usr:"UR16040002",
				car: car,
				beginTime: day + " 00:00:00",
				endTime: day + " 23:59:59"
			},
			success: function(Result) {
				if(Result) {
					var result = JSON.parse(Result);
					if(result.success) {
						var data = result.data;
						dataShow(data);
					} else {
						mui.alert(result.message);
					}
				} else {
					mui.alert("系统错误");
				}
			}
		});
	}

	//数据展示
	function dataShow(data){
		if(2 === data.length){
			var mileage = parseFloat(data[0].mileage - data[1].mileage).toFixed(3);
			var time = parseInt((new Date(data[0].recordtime).getTime() - new Date(data[1].recordtime).getTime())/60000);
			var point = new BMap.Point(data[0].lng,data[0].lat);
			var point1 = new BMap.Point(data[1].lng,data[1].lat);
	        convertor.translate([point,point1],1,5,function(rs){
	          	geoc.getLocation(rs.points[0], function (result) {
	          	    document.querySelector(".mileage_end").querySelector("a").innerText = result.address;
	          	});
	          	geoc.getLocation(rs.points[1], function (Result) {
	          	    document.querySelector(".mileage_begin").querySelector("a").innerText = Result.address;
	          	});
	        });
			document.querySelector(".mileage_mi").querySelector("h5").querySelector("a").innerText = mileage;
			document.querySelector(".mileage_time").querySelector("h5").querySelector("a").innerText = time;
		}else if(1 === data.length){
			document.querySelector(".mileage_begin").querySelector("h5").innerText = data.begin;
			document.querySelector(".mileage_end").querySelector("h5").innerText = data.end;
			document.querySelector(".mileage_mi").querySelector("h5").innerText = 0;
			document.querySelector(".mileage_time").querySelector("h5").innerText = 0;
		}else{
			mui.alert("无数据");
		}
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
})(mui)