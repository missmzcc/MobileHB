$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();
	var map = new BMap.Map("allmap");
	var track_search = 	JSON.parse($.sessionStorage("track_search"));
	/*---------------全局变量 end---------------*/
	
	//初始化
	function init(){
		$.map_init(map);
	}
	//数据获取
	function getData(){
		$.ajax({
			type:"post",
			url:domain,
			data:{usr:usr,pwd:pwd,car:car,begin_time:beginTime,end_time:endTime},
			success:function(Result){
				
			}
		});
	}
	
	function bindEvent(){
		mui('nav').on('tap','.track_play',function(){
		});
		mui('nav').on('tap','.track_quick',function(){
		});
	}
	init();
	bindEvent();
})