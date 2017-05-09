(function($) {
	/*---------------全局变量 start---------------*/
	var domain = Configure.domain;
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
			sessionStorage.setItem("mileage", JSON.stringify({
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
						var data = result.data[0];
						dataShow(data);
						document.querySelector(".mileage_begin").innerText = data.begin;
						document.querySelector(".mileage_end").innerText = data.end;
						document.querySelector(".mileage_mi").innerText = data.end;
						document.querySelector(".mileage_time").innerText = data.end;
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
		if(data.length === 2){
			
		}else if(data.length === 1){
			
		}else{
			mui.alert("无数据");
		}
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
})(mui)