$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();
	var map = new BMap.Map("allmap");
	/*---------------全局变量 end---------------*/
	
	//初始化
	function init(){
		$.map_init(map);
		getData();
	}
	//数据获取
	function getData(){
		var data = {
			api:"history_pos",
			usr:"UR16040002",
			pwd:"40BD001563085FC35165329EA1FF5C5ECBDBBEEF"
		};
		var track_search = 	$.sessionStorage("track_search");
		if(track_search){							//从历史轨迹搜索页进入
			var track =JSON.parse(track_search);
			data.begin_time = track.begin_time;
			data.end_time = track.end_time;
			data.car = track.car;
			sessionStorage.removeItem("track_search");
		}else{										//从车辆列表进入
			data.car = $.sessionStorage("track_car");
			data.begin_time = $.yesterday();
			data.end_time = $.nowday();
			sessionStorage.removeItem("track_car");
		}
		$.ajax({
			type:"post",
			url:domain,
			data:data,
			success:function(Result){
				if(Result){
					var result = JSON.parse(Result);
					if(result.success){
						addOverlays(result.data);
					}else{
						mui.alert(result.message);
					}
				}else{
					mui.alert("系统错误")
				}
			}
		});
	}
	//画轨迹线
	function addOverlays(data){
		var leng = data.length;
		if(leng === 0){
			mui.alert("无数据");
		}else{
			var allPoints = [];
			for (var i=0;i<leng;i++) {
				allPoints.push(new BMap.Point(data[i].lng,data[i].lat));
			}
			var polyline = new BMap.Polyline(allPoints,{strokeColor:"blue",strokeWeight:3,strokeOpacity:0.5});
			map.panTo(allPoints[0]);
			map.addOverlay(polyline);
		}
	}
	
	//绑定事件
	function bindEvent(){
		mui('nav').on('tap','.track_play',function(){
			
		});
		mui('nav').on('tap','.track_quick',function(){
		});
	}
	init();
	bindEvent();
})