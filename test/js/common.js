(function ($) {
    var timeout = 5000;//超时时间,默认5秒
    $.fn.extend();
    $.extend({
    	//手机跨域请求域名
    	domain:function(){
    		return 'http://106.14.239.55:5392/api.ashx';
    	},
        loginInfo: function (user) {
            $.ajax({
                url: $.domain(),
                data: { api: 'loginInfo' },
                async: false,
                success: function (Result) {
                    var result = JSON.parse(Result);
                    if (result.success) {
                        var oLoginInfo = result.data;
                        user.usr = oLoginInfo.usr;
                        user.pwd = oLoginInfo.pwd;
                    } else {
                        alert("登录超时");
                        window.location.href = "/login.html";
                    }
                }
            });
        },
        //针对easyuidatetimebox格式化的昨天时间，根据easyui版本不同，时间的分隔符不同
        yesterday: function (num) {
            var now = new Date();
            num = num ? num : 1;
            var yes = new Date(now.getTime() - 86400000 * num);
            return yes.toLocaleDateString().replace(/\//g, "-") + " 00:00:00"
        },
        nowday: function (isBegin) {
            var now = new Date();
            if (isBegin) {
                return now.toLocaleDateString().replace(/\//g, "-") + " 00:00:00";
            } else {
                return now.toLocaleDateString().replace(/\//g, "-") + " 23:59:59";
            }
        },
        sessionStorage:function(key,value){
        	if(value && typeof value === "object"){
        		sessionStorage.setItem(key,JSON.stringify(value));
        	}else if(value){
        		sessionStorage.setItem(key,value);
        	}else if(!value){
				return sessionStorage.getItem(key);
        	}
        },
        localStorage:function(key,value){
        	if(value && typeof value === "object"){
        		localStorage.setItem(key,JSON.stringify(value));
        	}else if(value){
        		localStorage.setItem(key,value);
        	}else if(!value){
        		return localStorage.getItem(key);
        	}
        }
    })
})(window.jQuery)