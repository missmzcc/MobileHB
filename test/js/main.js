$(function(){
	/*---------------全局变量 start---------------*/
	var map = new BMap.Map("allmap");
	/*---------------全局变量 end---------------*/
	
	function init(){
		$.map_init(map);
	}
	var marker = new BMap.Marker(new BMap.Point(114.3162,30.581084));
	map.addOverlay(marker);
	var opts = {
	    width: 210,     // 信息窗口宽度
	    height: 130,     // 信息窗口高度
	    title: '<div><a href="javascript:void(0);">鄂A123KA</a><img src="../images/u142.png" class="main_info_img"/></div>' // 信息窗口标题
	}
	var msg = new Date().toLocaleString() + '</br>速度:0.00km/h</br>当日里程:31.7km/h';
	var custom = '<div style="text-align: center;"><ul><li class="main_info_li"><a href="track_search.html">轨迹</a></li><li><a href="cars_detail.html">详情</a></li></ul></div>';
	$.openInfoWindowCustom(map,marker,msg,opts,custom,true);
	/*---------------事件绑定 start---------------*/
	function bindEvent(){
		//搜索跳转
		mui(document).on("tap",".main_search",function(){
			window.location.href = 'cars_search.html';
		});
		//mui阻止了a的默认跳转事件,要跳转页面必须写方法
		mui("nav").on("tap","#defaultTab",function(){
			window.location.href = 'cars_status.html';
		});
		mui("nav").on("tap","#about",function(){
			window.location.href = 'setting.html';
		});
		mui('.mui-scroll').on('tap','li',function(e){
			window.location.href = this.getElementsByTagName("a")[0].href;
		});
		$(".main_change li").click(function(){
			var index = $(this).index();
			if(index === 0){
				
			}else{
				
			}
		});
	}
	/*---------------事件绑定 end---------------*/
	
	init();
	bindEvent();
})