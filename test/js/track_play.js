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
	
	//绑定事件
	function bindEvent(){
		mui('nav').on('tap','.track_play',function(){
			
		});
		mui('nav').on('tap','.track_quick',function(){
			
		});
	}
	
	//数据获取
	function getData(){
		var data = {
			api:"history_pos",
			usr:"UR16040002",
			pwd:"40BD001563085FC35165329EA1FF5C5ECBDBBEEF"
		};
		var trackCondition = {};
		var track_search = 	$.sessionStorage("track_search");
		if(track_search){							//从历史轨迹搜索页进入
			trackCondition =JSON.parse(track_search);
			sessionStorage.removeItem("track_search");
		}else{										//从里程列表进入
			trackCondition =JSON.parse($.sessionStorage("mileage"));
			sessionStorage.removeItem("mileage");
		}
		data.car = trackCondition.car;
		data.begin_time = trackCondition.begin_time;
		data.end_time = trackCondition.end_time;
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
			map.setZoom(18);
			map.addOverlay(polyline);
		}
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
})