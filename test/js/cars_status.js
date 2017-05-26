$(function() {
	/*---------------全局变量 start---------------*/
	var domain = $.domain(); //请求地址url
	var pageAll = 1; //全部分页页数
	var pageOnline = 1; //在线分页页数
	var pageOffline = 1; //离线分页页数
	var pageWarn = 1; //报警分页页数
	var pageSize = 10; //每页条数
	/*---------------全局变量 end---------------*/

	function init() {
		mui.init({
			swipeBack: false,
		});
		getInitData();
		setTimeout(getData(0, true), 300);
		setTimeout(getData(1, true), 400);
		setTimeout(getData(2, true), 500);
		setTimeout(getData(3, true), 500);
	}

	/*---------------事件绑定 start---------------*/
	function bindEvent() {
		$(".mui-table .cars_status_img").click(function() {
			var $this = $(this);
			gotoDetail($this);
		});
	}
	/*---------------事件绑定 end---------------*/

	//下拉事件
	function getInitData() {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		mui.ready(function() {
			//循环初始化所有下拉刷新，上拉加载。
			mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				mui(pullRefreshEl).pullToRefresh({
					up: {
						callback: function() {
							var self = this;
							setTimeout(function() {
								getData(index, false);
								self.endPullUpToRefresh();
							}, 1000);
						}
					}
				});
			});
		});
	}

	//数据获取
	function getData(Index, isFirst) {
		var page = 1;
		if(Index == undefined) {
			Index = 0;
		}
		var status = "1";
		if(Index === 0) {
			status = 1;
			page = pageOnline;
		} else if(Index === 1) {
			status = 2;
			page = pageOffline;
		} else if(Index === 2) {
			status = 3;
			page = pageWarn;
		} else if(Index === 3) {
			status = 4;
			page = pageAll;
		}
		$.ajax({
			type: "post",
			url: domain,
			data: {
				api: "getCarsInnerTree",
				usr: "UR16040002",
				q: "",
				page: page,
				rows: pageSize,
				status: status
			},
			success: function(Result) {
				if(Result) {
					var result = JSON.parse(Result);
					if(result.success) {
						showData(result.data.rows, Index);
						if(0 === Index) {
							pageOnline++;
						} else if(1 === Index) {
							pageOffline++;
						} else if(2 === Index) {
							pageWarn++;
						} else if(3 === Index) {
							pageAll++;
						}
						$("#sliderSegmentedControl").find("a").eq(Index).find("span").text(result.data.total);
					} else {
						if(isFirst) {
							if("无数据" !== result.message) {
								mui.alert(result.message);
							} else {
								$("#sliderSegmentedControl").find("a").eq(Index).find("span").text(0);
							}
						} else {
							mui.alert(result.message);
						}
					}
				} else {
					mui.alert("系统异常!");
				}
			}
		});
	}

	//数据展示
	function showData(data, _index) {
		if(data.length === 0) {
			return;
		}
		var html = "";
		for(var i = 0; i < data.length; i++) {
			var ths = data[i];
			html += '<li class="mui-table-view-cell"><div class="mui-table">';
			html += '<div class="mui-table-cell mui-col-xs-3"><img class="cars_img" src="../images/u142.png">';
			html += '<h4 class="mui-ellipsis"><a href="javascript:void(0);">' + ths.VehicleId1 + '</a>';
			html += '<span class="cars_speed">' + ths.Speed + 'km/h</span></h4>';
			html += '<h5 class="mui-ellipsis">武汉市硚口区建设大道附近</h5>';
			html += '<p class="mui-h6 mui-ellipsis">' + $.statusInfo(ths.StatusInfo) + '</p></div>';
			html += '<div class="mui-table-cell mui-col-xs-2 mui-text-right cars_status_img">';
			html += '<span>' + ths.RecordTime.substring(11) + '</span><img src="../images/u132.png"/>';
			html += '</div></div></li>';
		}
		$.each($(".mui-slider-group .mui-scroll"), function(index) {
			if(_index === index) {
				var that = $(this);
				that.find(".mui-table-view").append(html);
				//              数据绑定.未使用
				//              $.each(that.find(".mui-table-view"), function (index) {
				//                  $(this).data($(this).find("li").eq(0).find("a").eq(0).text(), data[index]);
				//              });
			}
		});
	}

	//跳转到详情页
	function gotoDetail(ths) {
		var car = ths.siblings("div").find("h4 a").html();
		sessionStorage.setItem("detail_car_no", car);
		window.location.href = "cars_detail.html";
	}

	init();
	bindEvent();
});