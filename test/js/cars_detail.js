$(function(){
	/*---------------全局变量 start---------------*/
	var domain = $.domain();
	var app = "MN16040013";
	var map = new BMap.Map("allmap");
	/*---------------全局变量 end---------------*/
	
	function init(){
		$.map_init(map);
		initCar();
	}
	
	/*---------------事件绑定 start---------------*/
	function bindEvent(){
		//打电话
		mui(".mui-bar-tab").on("tap","#telphone",function(){
			if(window.plus){									//调用手机原生打电话
				plus.device.dial("10086",true);
			}else{
				mui.alert("网页不支持打电话");
			}
		});
		//发信息
		mui(".mui-bar-tab").on("tap","#message",function(){
			if(window.plus){									//调用手机原生发短信
				sendMessage();
			}else{												//调用后台接口发短信
				
			}
		});
		//上传位置
		mui('.mui-bar-tab').on('tap','#location',function(){
			if(window.plus){									//调用手机原生获取地理位置
				plus.geolocation.getCurrentPosition( function(rs){
					console.log(rs.coords.longitude + rs.coords.latitude + rs.coords.altitude);
				}, function(e){
					mui.alert(e.message);
				}, {provider:"system",geocode:false});
			}else{												//百度api获取地址
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						console.log(r.point.lng+r.point.lat);
					}else {
						mui.alert("failed:"+this.getStatus());
					}
				},{enableHighAccuracy: true});
			}
		});
	}
	/*---------------事件绑定 end---------------*/
	
	//数据获取
	function initCar(){
		var car = sessionStorage.getItem("cars_status");
		car = "鄂AP9018";
		if(!car){
			return;
		}else{
			$("#title").text(car);
		}
		$.ajax({
			type:"post",
			url:domain,
			data:{
				usr:"UR16040002",
				pwd:"40BD001563085FC35165329EA1FF5C5ECBDBBEEF",
				api:"getCarDetail",
				app:app,
				car:car
			},
			success:function(Result){
				if(Result){
					var result = JSON.parse(Result);
					if(result.success){
						var data = result.data[0];
						showData(data);
					}else{
						mui.alert(result.message);
					}
				}else{
					mui.alert("系统错误");
				}
			}
		});
	}
	//数据填充
	function showData(Data){
		$(".cars_detail_online").text(Data.online);
		$.each($(".cars_detail li"), function(index) {
			if(index === 0){
				$(this).find("a").first().text(Data.recordtime);
			}else if(index === 1){
				$(this).find("a").text(Data.speed);
			}else if(index === 2){
				$(this).find("a").text(Data.mileage);
			}else if(index === 3){
				$(this).find("a").text(Data.oil);
			}else if(index === 4){
				$(this).find("a").text(Data.statusInfo);
			}
		});
	}
	
	//打电话,未使用
	function call(){

	    // 导入Activity、Intent类
	
	    var Intent = plus.android.importClass("android.content.Intent");
	
	    var Uri = plus.android.importClass("android.net.Uri");
	
	    // 获取主Activity对象的实例
	
	    var main = plus.android.runtimeMainActivity();
	
	    // 创建Intent
	
	    var uri = Uri.parse("tel:10010"); // 这里可修改电话号码
	
	    var call = new Intent("android.intent.action.CALL",uri);
	
	    // 调用startActivity方法拨打电话
	
	    main.startActivity( call );
	
	    // ...
	
	}
	
	//手机原生发送短信
	function sendMessage(){
		var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
		msg.to = ["13476157565"];
		msg.body = "这是一个测试";
		plus.messaging.sendMessage(msg,function(){
			mui.alert("发送成功");
		},function(){
			mui.alert("发送失败");
		});
	}
	
	//初始化
	init();
	//绑定事件
	bindEvent();
})