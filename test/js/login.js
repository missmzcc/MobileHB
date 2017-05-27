$(function() {
	/*---------------全局变量 start---------------*/
	var domain = Configure.domain;
	/*---------------全局变量 end---------------*/

	//初始化
	function init() {
		//检查记住密码
		checkRememberLog();
	}

	/*---------------事件绑定 start---------------*/
	function bindEvent() {
		$(".login").click(function(){
			login();
		});
		//帐号切换
		$("#change").click(function(){
			change();
		});
	}
	/*---------------事件绑定 end---------------*/
	
	//检查记住密码
	function checkRememberLog(){
		var rememberLog = $.cookie("rememberLog");
		if(rememberLog){
			var rememberInfo = JSON.parse(rememberLog);
			if(rememberInfo.auto){
				$('#usr').val(rememberInfo.usr);
				$('#pwd').val(rememberInfo.pwd);
				$("#remember").prop("checked",true);
			}
		}
	}

	//登录
	function login(){
		var usr = $('#usr').val();
		var pwd = $('#pwd').val();
		if(!usr || !pwd ){
	        mui.alert("登录名或密码不能为空");
	        return;
	    }
	    $.post(domain,{ api:'login',usr: usr, pwd: pwd },
	    function (Result) {
	        var result = JSON.parse(Result);
	        if (result.success) {
	        	var data = result.data;
	        	if(data && data.approve){
	        		sessionStorage.setItem("approve",Configure.approve[data.approve]);
	        	}
	        	rememberLog(usr,pwd);
	            window.location.href = "main.html";
	        } else {
	            alert("登录名或密码错误");
	        }
	    });
	}

	//记住密码
	function rememberLog(usr,pwd){
		if($("#remember").prop("checked")){
			var rememberLog = {
				auto:true,
				usr:usr,
				pwd:pwd
			};
			$.cookie("rememberLog",JSON.stringify(rememberLog),{expires:7});
		}else{
			$.cookie("rememberLog","");
		}
	}

	//帐号切换,需接入等三方登录
	function change(){
		$("#usr").val("");
		$("#pwd").val("");
		$("#remember").prop("checked",false);
	}

	//初始化
	init();
	//绑定事件
	bindEvent();
})