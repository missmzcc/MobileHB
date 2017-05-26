$(function() {
	/*---------------全局变量 start---------------*/
	var domain = Configure.domain;
	/*---------------全局变量 end---------------*/

	//初始化
	function init() {
		
	}

	/*---------------事件绑定 start---------------*/
	function bindEvent() {
		$(".login").click(function(){
			login();
		});
	}
	/*---------------事件绑定 end---------------*/

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
	        	if ("UN17030003" === data.approve) {
	               	sessionStorage.setItem("approve","crd");//业务员
	            } else if ("UN17030004" === data.approve) {
	                sessionStorage.setItem("approve", "srd");//审核员
	            } else if ("UN17030005" === data.approve) {
	                sessionStorage.setItem("approve", "ct");//车队
	            } else if ("UN17030006" === data.approve) {
	                sessionStorage.setItem("approve", "ch");//调度
	            } else {
	                sessionStorage.setItem("approve", "test");
	            }
	            window.location.href = "main.html";
	        } else {
	            alert("登录名或密码错误");
	        }
	    });
	}

	//初始化
	init();
	//绑定事件
	bindEvent();
})