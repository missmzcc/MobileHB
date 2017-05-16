$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();						//请求地址url
	var page=0;										//分页当前页
	var pageSize=10;								//每页条数
	/*---------------全局变量 end---------------*/
	
	function init(){
		mui.init({
			swipeBack: false,
		});
		getData(1,10);
		getInitData();
	}
	
	/*---------------事件绑定 start---------------*/
	function bindEvent(){
		$(".mui-table .cars_status_img").click(function(){
			var $this = $(this);
			gotoDetail($this);
		});
	}
	/*---------------事件绑定 end---------------*/
	
	function getData(that){
		$.ajax({
			type:"post",
			url:domain,
			data:{
				api:"getCarsInnerTree",
				usr:"UR16040002",
				q:"",
				page:page,
				pageSize:pageSize
			},
			success:function(Result){
				if(Result){
					var result = JSON.parse(Result);
					if(result.success){
						var data = JSON.parse(result.data);
						var html="",htmlAll = "",htmlRun="",htmlOffline ="",htmlWarn="";
						for (var i = 0; i < data.length; i++) {
							var ths = data[i];
							html += '<li class="mui-table-view-cell"><div class="mui-table">
							html += '<div class="mui-table-cell mui-col-xs-3"><img class="cars_img" src="../images/u142.png">';
							html += '<h4 class="mui-ellipsis"><a href="javascript:void(0);">'+ths.vehicleId+'</a>';
							html += '<span class="cars_speed">'+ths.speed+'km/h</span></h4>';
							html += '<h5 class="mui-ellipsis">武汉市硚口区建设大道附近</h5>';
							html += '<p class="mui-h6 mui-ellipsis">'+ths.statuInfo+'</p></div>';
							html += '<div class="mui-table-cell mui-col-xs-2 mui-text-right cars_status_img">';
							html += '<span>'+ths.recordtime+'</span><img src="../images/u132.png"/>';
							html += '</div></div></li>';
							if(0 == ths.type){
								htmlAll+=html;
							}else if(1 == ths.type){
								htmlRun+=html;
							}else if(2 == ths.type){
								htmlOffline+=html;
							}else if(3 == ths.type){
								htmlWarn+=html;
							}
						}
						$.each($(".mui-slider-group .mui-scroll"),function(index){
							if(0 === index){
								$(this).find(".mui-table-view").append(htmlRun);
							}else if(1 === index){
								$(this).find(".mui-table-view").append(htmlOffline);
							}else if(2 === index){
								$(this).find(".mui-table-view").append(htmlWarn);
							}else if(3 === index){
								$(this).find(".mui-table-view").append(htmlAll);
							}
						})
					}else{
						mui.alert(result.mesasge);
					}
				}else{
					mui.alert("系统异常!");
				}
			}
		});
	}
	
	function getInitData(){
		//阻尼系数
		var deceleration = mui.os.ios?0.003:0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration:deceleration
		});
		mui.ready(function() {
			//循环初始化所有下拉刷新，上拉加载。
			mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				mui(pullRefreshEl).pullToRefresh({
					up: {
						callback: function() {
							var self = this;
							setTimeout(function() {
								getData();
								self.endPullUpToRefresh();
								page++;
							}, 1000);
						}
					}
				});
			});
		});
	}
	
	//跳转到详情页
	function gotoDetail(ths){
		var car = ths.siblings("div").find("h4 a").html();
		sessionStorage.setItem("detail_car_no",car);
		window.location.href = "cars_detail.html";
	}
	
	init();
	bindEvent();
});