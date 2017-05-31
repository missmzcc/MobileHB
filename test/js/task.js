$(function(){
	//mui 初始化
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});
	//选择时间
	(function($) {
		//获取下单时间
		var beginBtn = document.getElementById("beginTime");
		var endBtn = document.getElementById("endTime");
		mui(document).on('tap','.time_choose',function(e){
			var target = e.target;
			if(target.id === "beginTime"){
				var picker = new $.DtPicker();
				picker.show(function(rs){
					beginBtn.placeholder = rs.text;
				});
			}else if(target.id === "endTime"){
				var picker = new $.DtPicker();
				picker.show(function(rs){
					endBtn.placeholder = rs.text;
				});
			}
		});
		//获取派单时间
		var beginBtn2 = document.getElementById("beginTime2");
		var endBtn2 = document.getElementById("endTime2");
		mui(document).on('tap','.time_choose',function(e){
			var target = e.target;
			if(target.id === "beginTime2"){
				var picker = new $.DtPicker();
				picker.show(function(rs){
					beginBtn2.placeholder = rs.text;
				});
			}else if(target.id === "endTime2"){
				var picker = new $.DtPicker();
				picker.show(function(rs){
					endBtn2.placeholder = rs.text;
				});
			}
		});
		//打开新增窗口 mui阻止了a连接跳转 需要重写
		
		mui('body').on('tap','#add_task',
			function(){document.location.href=this.href;
		});
		mui('body').on('tap','#task_back',
			function(){document.location.href=this.href;
		});
	})(mui);
	//派单查询按钮和新增按钮样式切换
	$("#dispatch_btn").find(".mui-btn").click(function(){
		$(this).addClass("mui-btn-primary").siblings().removeClass("mui-btn-primary");
	});
	
	//点击下单模糊查询
	function quaryLike(){
		$.ajax({
			type:"post",
			url:$.domain(),
			async:true,
			data:{
				api:'getFilterTaskId'
			},
			success:function(Result){
				var data=JSON.parse(Result)
				$("#task_number").val(data[0].Id)
			}
		});
	}
	
	$("#task_number").click(function(){
		quaryLike();
	})



	//下单查询
	function quaryTask(){
		var taskId=$("#task_number").val();
		var beginTime=$("#beginTime").val();
		var endTime=$("#endTime").val();
		$.ajax({
			type:'post',
			dataType:'json',
			//向服务器请求的url
			url:'',
			async:true,
			//发送到服务器的数据
			data:{
				api:"",//请求的api接口
				usr:"", 
				pwd:"",
				id:taskId,
				beginTime:beginTime,
				endTime:endTime
			},
			//查询成功后返回的回调函数
			success:function(Result){
				if(Result){
					var result=JSON.parse(Result);
					if(result.success){
						var data=result.data
					}else{
						mui.alert("数据有误")
					}
				}else{
					mui.alert("数据有误")
				}
			}
		});
	};
	//点击下单按钮查询
	$("#search_order").click(function(){
		quaryTask();
	})
	
})
