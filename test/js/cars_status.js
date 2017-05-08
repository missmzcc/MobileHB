$(function(){
	/*---------------全局变量 start---------------*/
	/*---------------全局变量 end---------------*/
	
	function init(){
		getData();
	}
	
	/*---------------事件绑定 start---------------*/
	function bindEvent(){
		$(".mui-table .cars_status_img").click(function(){
			var $this = $(this);
			gotoDetail($this);
		});
	}
	/*---------------事件绑定 end---------------*/
	
	function getData(){
		$.ajax({
			type:"post",
			url:$.domain(),
			data:{
				api:"getCarsInnerTree",
				usr:"UR16040002",
				q:""
			},
			async:true,
			success:function(Result){
				if(Result){
					var result = JSON.parse(Result);
					if(result.success){
						var data = JSON.parse(result.data);
						console.log(data);
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
//					down: {
//						callback: function() {
//							var self = this;
//							setTimeout(function() {
//								var ul = self.element.querySelector('.mui-table-view');
//								ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
//								self.endPullDownToRefresh();
//							}, 1000);
//						}
//					}
					up: {
						callback: function() {
							var self = this;
							setTimeout(function() {
								var ul = self.element.querySelector('.mui-table-view');
								ul.appendChild(createFragment(ul, index, 5));
								self.endPullUpToRefresh();
							}, 1000);
						}
					}
				});
			});
			var createFragment = function(ul, index, count, reverse) {
				var length = ul.querySelectorAll('li').length;
				var fragment = document.createDocumentFragment();
				var li;
				for (var i = 0; i < count; i++) {
					li = document.createElement('li');
					li.className = 'mui-table-view-cell';
					li.innerHTML = '第' + (index + 1) + '个选项卡子项-' + (length + (reverse ? (count - i) : (i + 1)));
					fragment.appendChild(li);
				}
				return fragment;
			};
		});
	}
	
	//跳转到详情页
	function gotoDetail(ths){
		var car = ths.siblings("div").find("h4 a").html();
		sessionStorage.setItem("cars_staus",car);
		window.location.href = "cars_detail.html";
	}
	
	init();
	bindEvent();
})