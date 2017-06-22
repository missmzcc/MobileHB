$(function(){
	/*---------------全局变量 start---------------*/
	/*---------------全局变量 end---------------*/
	
	/*---------------mui模块 start---------------*/
	mui.init({
		swipeBack:true //启用右滑关闭功能
	});
	//初始化单页面
	var viewApi = mui('#app').view({
		defaultPage: '#setting'
	});
	//初始化单页的区域滚动
	mui('.mui-scroll-wrapper').scroll();
	//返回上级页面
	var view = viewApi.view;
	mui.ready(function(){
		//处理view的后退与webview后退
		var oldBack = mui.back;
		mui.back = function() {
			if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
				viewApi.back();
			} else { //执行webview后退
				oldBack();
			}
		};
		//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
		//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
		view.addEventListener('pageBeforeShow', function(e) {
			//				console.log(e.detail.page.id + ' beforeShow');
		});
		view.addEventListener('pageShow', function(e) {
			//				console.log(e.detail.page.id + ' show');
		});
		view.addEventListener('pageBeforeBack', function(e) {
			//				console.log(e.detail.page.id + ' beforeBack');
		});
		view.addEventListener('pageBack', function(e) {
			//				console.log(e.detail.page.id + ' back');
		});
	})
	/*---------------mui模块 end---------------*/
	
	//初始化
	function init() {
		
	}

	/*---------------事件绑定 start---------------*/
	function bindEvent() {
		//更换头像
		$("#head-img").click(function(){
			changeImg();
		})
		
		//检查更新
		document.getElementById("update").addEventListener('tap', update);
		
		mui("#warn").on("tap",".mui-switch",function(){
			if($(this).hasClass("mui-active")){
				warn($(this).attr("data-order"));
			}
		});
		//退出
		mui('#setting').on('tap','#logout',function(){
			mui.confirm("是否确认退出","提示",["是","否"],function(e){
				if(0 === e.index){
					window.location.href="login.html";
				}
			})
		})
	}
	/*---------------事件绑定 end---------------*/

	//更换头像
	function changeImg(){
		if(window.plus){							//h5+环境
			plus.ready(function(){
				
			});
		}else{
			
		}
	}
	
	//报警设置
	function warn(type){
		$.ajax({
			type:"post",
			url:"",
			data:{
				
			},
			success:function(Result){
                if(Result){
                    var result = JSON.parse(Result);
                    if(result.success){
                        mui.alert("报警设置成功");
                    }else{
                        mui.alert(result.message);
                    }
                }else{
                    mui.alert("系统错误");
                }
            }
		});
	}

	//检查更新
	function update(){
		var server = "http://www.dcloud.io/check/update"; //获取升级描述文件服务器地址
		mui.getJSON(server, {
			"appid": plus.runtime.appid,
			"version": plus.runtime.version,
			"imei": plus.device.imei
		}, function(data) {
			if (data.status) {
				plus.ui.confirm(data.note, function(i) {
					if (0 == i) {
						plus.runtime.openURL(data.url);
					}
				}, data.title, ["立即更新", "取　　消"]);
			} else {
				mui.toast('Hello MUI 已是最新版本~')
			}
		});
	}

	//初始化
	init();
	//绑定事件
	bindEvent();
});
