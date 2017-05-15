$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();
	var map = new BMap.Map("allmap");
	var Data = [];									//历史轨迹数据
	var status = 0;									//播放状态,0起始,1播放,2暂停,3停止
	var thsPointIndex = 0;							//当前播放点下标
	var playInterval;								//播放轨迹定时任务标识
	var playSpeed = 50;								//播放速度,初始为500毫秒
	var beginMarker,endMarker;						//起始标点,结束标点
	/*---------------全局变量 end---------------*/
	
	//初始化
	function init(){
		mui.init();
		$.map_init(map);
		getData();
	}
	
	//绑定事件
	function bindEvent(){
		//播放
		mui('nav').on('tap','.track_play',function(){
			play();
		});
		//快进
		mui('nav').on('tap','.track_quick',function(){
			
		});
		//停止,暂未使用
		mui('nav').on('tap','.track_end',function(){
			StopTrackBack();
		});
	}
	
	//数据获取
	function getData(){
		var data = {
			api:"history_pos",
			usr:"UR16040002",
			pwd:"3B68A4799460162AA62973FC9377C182086954B6"
		};
		var trackCondition = {};
		var track_search = 	$.sessionStorage("track_search");
		if(track_search){
			trackCondition =JSON.parse(track_search);
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
						if(result.data.length === 0){
							mui.alert("无数据");
							return;
						}else{
							Data = result.data;
							addOverlays(result.data);
						}
					}else{
						mui.alert(result.message);
					}
				}else{
					mui.alert("系统错误")
				}
			}
		});
	}
	
	//初始化画轨迹线
	function addOverlays(data){
		var leng = data.length;
		var allPoints = [];
		for (var i=0;i<leng;i++) {
			allPoints.push(new BMap.Point(data[i].lng,data[i].lat));
		}
		map.panTo(allPoints[0]);
		beginMarker = new BMap.Marker(allPoints[0],{icon:new BMap.Icon("../images/u653.png",new BMap.Size(29,40))});			//起点
		endMarker = new BMap.Marker(allPoints[leng-1],{icon:new BMap.Icon("../images/u655.png",new BMap.Size(29,40))});		//终点
		var polyline = new BMap.Polyline(allPoints,{strokeColor:"blue",strokeWeight:5,strokeOpacity:0.5});
		map.addOverlay(beginMarker);
		map.addOverlay(endMarker);
		map.addOverlay(polyline);
		map.setZoom(12);
		//设置range的值
		$("#block-range").prop("max",leng);
		var range = document.getElementById("block-range");
		range.addEventListener("input",function(e){
			clearInterval(playInterval);
			dragTrack(this.value);
		});
	}
	
	//拖动进度条
	function dragTrack(theIndex){
		//$("#block-range").val(thsPointIndex).css('background', 'linear-gradient(to right, #059CFA, white ' + parseInt(thsPointIndex) + ', green)');
		//若是没有播放过,直接拖放
		if(thsPointIndex === 0){
			map.addOverlay(beginMarker);
		}
	}
	
	/*设置移动标注*/
	function SetMoveMarker() {
	    if (backMoveMarker != null) {
	        //移除上一个标注点
	        map.removeOverlay(backMoveMarker);
	    }
	    //添加当前标注点到地图并地图中心移动到该标注点
	    var leng = backMarkers.length;
	    if (leng !== 0) {
	        backMoveMarker = backMarkers[backCurIndex];
	        map.addOverlay(backMoveMarker);
	        map.panTo(backMoveMarker.getPosition());
	    } else {
	        map.panTo(backPoints[0]);
	    }
	
	    //if (backCurIndex != 0) {
	    //    /*边移动边画轨迹*/
	    //    var points = new Array();
	    //    points.push(backPoints[backCurIndex - 1]);
	    //    points.push(backPoints[backCurIndex]);
	    //    var polyline = new BMap.Polyline(points, { strokeColor: "#5b849e", strokeWeight: 5, strokeStyle: "solid" });
	    //    map.addOverlay(polyline);
	    //}
	
	    backCurIndex++;
	    if ((leng > 0 && backCurIndex == backMarkers.length) || (backCurIndex == historyData.length)) {//播放结束
	        StopTrackBack();
	        mui.alert("历史轨迹播放结束");
	    }
	}
	
	//停止播放,暂未使用
	function StopTrackBack() {
	    status = 3;
	    if (backMoveMarker != null) {
	        //移除上一个标注点
	        map.removeOverlay(backMoveMarker);
	    }
	    backMoveMarker = null;
	    backMoveInfoWindow = null;
	    clearInterval(playInterval);
	    backCurIndex = 0;
	    map.setCenter(backPoints[0]);
	    $.each(".track_detail_all li",function(index){
	    	if(0 === index){
	    		$(this).text(Data[thsPointIndex].recordtime);
	    	}else if(1 === index){
	    		$(this).find("a").text(Data[thsPointIndex].speed);
	    	}
	    });
	    $(".track_play").attr("src","../images/u659.png");
	}
	
	//播放轨迹
	function paintTrackLine(){
		var leng = Data.length;
		var points = [];
		if(0 === thsPointIndex){
			map.clearOverlays();
			map.addOverlay(beginMarker);
		}
		thsPointIndex = parseInt(thsPointIndex);
		if(leng > (thsPointIndex+1)){
			points.push(new BMap.Point(Data[thsPointIndex].lng,Data[thsPointIndex].lat));
			points.push(new BMap.Point(Data[thsPointIndex+1].lng,Data[thsPointIndex+1].lat));
			var polyline = new BMap.Polyline(points,{strokeColor:"blue",strokeWeight:5,strokeOpacity:0.5});
			map.setZoom(16);
			map.panTo(new BMap.Point(Data[thsPointIndex+1].lng,Data[thsPointIndex+1].lat));
			map.addOverlay(polyline);
			$("#block-range").val(thsPointIndex).css('background', 'linear-gradient(to right, #059CFA, white ' + thsPointIndex + '%, white)');
			thsPointIndex++;
		}else{
			status = 0;									//停止状态
			$(".track_play").attr("src","../images/u659.png");
			clearInterval(playInterval);
			mui.alert("播放结束!");
		}
	}
	
	
	//播放,暂停
	function play(){
		var leng = Data.length;
		if(leng === 0){
			return;
		}
        if (status === 0) {								//第一次点击播放按钮
            status = 1;
            $(".track_play").attr("src","../images/u698.png");
            playInterval = setInterval(paintTrackLine, playSpeed);
        }else if(status === 1){							//播放状态,点击后变成播放按钮,暂停播放
        	status = 2;
            $(".track_play").attr("src","../images/u659.png");
            clearInterval(playInterval);
        }else if(status ===2 ){							//暂停状态,点击后变成暂停按钮,播放轨迹
        	status = 1;
        	$(".track_play").attr("src","../images/u698.png");
            playInterval = setInterval(paintTrackLine, playSpeed);
    	}
	}
	
	//暂停
	function pause(){
		
	}
	
	//快进
	function quick(){
		
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
})