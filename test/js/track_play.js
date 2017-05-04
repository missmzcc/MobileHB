$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();
	var map = new BMap.Map("allmap");
	var track_search = 	JSON.parse($.sessionStorage("track_search"));
	/*---------------全局变量 end---------------*/
	
	//初始化
	function init(){
		$.map_init(map);
		getData();
	}
	//数据获取
	function getData(){
		var usr = "UR16040002";
		var pwd = "40BD001563085FC35165329EA1FF5C5ECBDBBEEF";
		var car = "鄂AP9018";
		var beginTime = "2017-05-01 00:00:00";
		var endTime = "2017-05-04 23:59:59";
		$.ajax({
			type:"post",
			url:domain,
			data:{api:"history_pos",usr:usr,pwd:pwd,car:car,begin_time:beginTime,end_time:endTime},
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
	//画线
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