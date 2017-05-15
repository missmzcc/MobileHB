$(function() {
	/*---------------全局变量 start---------------*/
	var map = new BMap.Map("allmap");
	/*---------------全局变量 end---------------*/

	//初始化
	function init() {
		$.map_init(map);
		initCar();
	}

	/*---------------事件绑定 start---------------*/
	function bindEvent() {
		//搜索跳转
		mui(document).on("tap", ".main_search", function() {
			window.location.href = 'cars_search.html';
		});
		//mui阻止了a的默认跳转事件,要跳转页面必须写方法
		mui("nav").on("tap", "#defaultTab", function() {
			window.location.href = 'cars_status.html';
		});
		mui("nav").on("tap", "#about", function() {
			window.location.href = 'setting.html';
		});
		mui('#productLists').on('tap', 'li', function(e) {
			window.location.href = this.getElementsByTagName("a")[0].href;
		});
		//人机切换
		$(".main_change li").click(function() {
			var index = $(this).index();
			if(index === 0) { //人
				map.clearOverlays();
				if(window.plus) { //如果是app中
					mui.plusReady(function() {
						plus.geolocation.getCurrentPosition(translatePoint, function(e) {
							mui.toast("异常:" + e.message);
						});
					});
				} else { //如果是在web网页中
					translateWeb();
				}
			} else { //车
				if(window.plus) {

				} else {

				}
			}
		});
	}
	/*---------------事件绑定 end---------------*/

	//检测缓存中是否有需要搜索的car
	function initCar() {
		var sessionData = sessionStorage.getItem("main_cardata");
		var carNo = sessionStorage.getItem("detail_car_no");
		if(sessionData) {
			var carData = JSON.parse(sessionData);
			var point = new BMap.Point(carData.lng, carData.lat);
			var convertor = new BMap.Convertor();
			convertor.translate([point],1,5,function(rs){
				if(rs.status === 0){
					var marker = new BMap.Marker(rs.points[0]);
					map.panTo(rs.points[0]);
					map.addOverlay(marker);
					var opts = {
						width: 210, // 信息窗口宽度
						height: 130, // 信息窗口高度
						title: '<div><a href="javascript:void(0);">' + carNo + '</a><img src="../images/u142.png" class="main_info_img"/></div>' // 信息窗口标题
					}
					var msg = carData.recordtime + '</br>速度:' + carData.speed + 'km/h</br>里程:' + carData.mileage + 'km';
					var custom = '<div style="text-align: center;"><ul><li class="main_info_li"><a href="track_search.html">轨迹</a></li><li><a href="cars_detail.html">详情</a></li></ul></div>';
					$.openInfoWindowCustom(map, marker, msg, opts, custom, true);
				}else{
					mui.alert("百度地图调用错误,请刷新页面!");
				}
	        });
		}
	}

	//在app环境中检测用户当前位置
	function translatePoint(position) {
		var currentLon = position.coords.longitude;
		var currentLat = position.coords.latitude;
		var gpsPoint = new BMap.Point(currentLon, currentLat);
		map.Convertor.translate(gpsPoint, 2, function() {
			map.addControl(new BMap.NavigationControl());
			map.addControl(new BMap.ScaleControl());
			map.addControl(new BMap.OverviewMapControl());
			map.centerAndZoom(point, 16);
			map.addOverlay(new BMap.Marker(point));
		});
	}

	//在浏览器环境中检测用户当前位置
	function translateWeb() {
		var mask = mui.createMask().show();
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r) {
			if(this.getStatus() == BMAP_STATUS_SUCCESS) {
				mask.close();
				var marker = new BMap.Marker(r.point);
				map.addOverlay(marker);
				map.panTo(r.point);
				map.addControl(new BMap.NavigationControl());
				map.addControl(new BMap.ScaleControl());
				map.addControl(new BMap.OverviewMapControl());
			} else {
				mui.alert("failed:" + this.getStatus());
			}
		}, {
			enableHighAccuracy: true
		});
	}

	//初始化
	init();
	//绑定事件
	bindEvent();
})