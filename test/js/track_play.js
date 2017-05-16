$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();
	var map = new BMap.Map("allmap");
	var Data = [];									//历史轨迹数据
	var Points = [];								//历史轨迹经纬度数组
	var status = 0;									//播放状态,0起始,1播放,2暂停,3停止
	var thsPointIndex = 0;							//当前播放点下标
	var playInterval;								//播放轨迹定时任务标识
	var playSpeed = 1000;							//播放速度,初始为500毫秒
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
			if(playSpeed>500){
				playSpeed-=500;
			}
		});
		//慢放
		mui('nav').on('tap','.track_slow',function(){
			playSpeed+=500;
		});
		//停止
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
		}else{
			mui.alert("请求参数错误");
			return;
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
		for (var i=0;i<leng;i++) {
			Points.push(new BMap.Point(data[i].lng,data[i].lat));
		}
		map.panTo(Points[0]);
		beginMarker = new BMap.Marker(Points[0],{icon:new BMap.Icon("../images/u653.png",new BMap.Size(29,40))});			//起点
		endMarker = new BMap.Marker(Points[leng-1],{icon:new BMap.Icon("../images/u655.png",new BMap.Size(29,40))});		//终点
		var polyline = new BMap.Polyline(Points,{strokeColor:"blue",strokeWeight:5,strokeOpacity:0.5});
		map.addOverlay(beginMarker);
		map.addOverlay(endMarker);
		map.addOverlay(polyline);
		map.setZoom(12);
		//设置range的值
		$("#block-range").prop("max",leng);
		var range = document.getElementById("block-range");
		range.addEventListener("input",function(e){
			dragTrack(parseInt(this.value));
		});
	}
	
	//拖动进度条
	function dragTrack(theIndex){
		//$("#block-range").val(thsPointIndex).css('background', 'linear-gradient(to right, #059CFA, white ' + parseInt(thsPointIndex) + ', green)');
		map.clearOverlays();
		console.log(1111);
		map.addOverlay(beginMarker);
		var pointDrag = Points.slice(0,theIndex+1);
		var polyDrag = new BMap.Polyline(pointDrag,{strokeColor:"blue",strokeWeight:5,strokeOpacity:0.5});
		map.addOverlay(polyDrag);
		thsPointIndex = theIndex;
		$.each($(".track_detail_all li"),function(index){
	    	if(0 === index){
	    		$(this).text(Data[thsPointIndex].recordtime);
	    	}else if(1 === index){
	    		$(this).find("a").text(Data[thsPointIndex].speed);
	    	}
	    });
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
			points.push(Points[thsPointIndex]);
			points.push(Points[thsPointIndex+1]);
			var polyline = new BMap.Polyline(points,{strokeColor:"blue",strokeWeight:5,strokeOpacity:0.5});
			map.setZoom(16);
			map.panTo(Points[thsPointIndex+1]);
			map.addOverlay(polyline);
//			$("#block-range").val(thsPointIndex).css('background', 'linear-gradient(to right, #059CFA, white ' + thsPointIndex + '%, white)');
			$("#block-range").val(thsPointIndex);
			thsPointIndex++;
			//数据展示
			$.each($(".track_detail_all li"),function(index){
		    	if(0 === index){
		    		$(this).text(Data[thsPointIndex].recordtime);
		    	}else if(1 === index){
		    		$(this).find("a").text(Data[thsPointIndex].speed);
		    	}
		    });
		}else{
			status = 0;									//停止状态
			$(".track_play").attr("src","../images/u659.png");
			clearInterval(playInterval);
			mui.alert("播放结束!");
		}
	}
	
	//停止播放
	function StopTrackBack() {
	    status = 0;
	    thsPointIndex=0;
	    clearInterval(playInterval);
	    map.panTo(Points[0]);
	    map.clearOverlays();
	    map.addOverlay(beginMarker);
	    $("#block-range").val(0);
	    $.each($(".track_detail_all li"),function(index){
	    	if(0 === index){
	    		$(this).text(Data[0].recordtime);
	    	}else if(1 === index){
	    		$(this).find("a").text(Data[0].speed);
	    	}
	    });
	    $(".track_play").attr("src","../images/u659.png");
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
});