/*百度地图工具类，需先加载jquery以及百度地图api*/
(function ($) {
    $.extend({
        map_init: function (map,param) {
            var defaultParam = {
                point:{
                    lng:114.3162,
                    lat:30.581084
                },                      //中心点，默认武汉
                zoom:11,                //地图级别
                city:"武汉",            //中心城市   
                isScroll:true           //是否开启鼠标滚动缩放
            }
            var params = $.extend(defaultParam,param);
            map.centerAndZoom(new BMap.Point(params.point.lng, params.point.lat), params.zoom);
            map.addControl(new BMap.MapTypeControl());
            map.setCurrentCity(params.city);
            map.enableScrollWheelZoom(params.isScroll);
        },
        //百度地图信息弹窗map实例，标注点或其他对象，显示的样式内容，显示的样式
        openInfoWindow:function(map,markers,message,opts,geo){
            markers.addEventListener("click", function (e) {
                var point = new BMap.Point(e.target.getPosition().lng, e.target.getPosition().lat);
                if (geo) {
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(point, function (result) {
                        message += '<br>位置:' + result.address;
                        map.openInfoWindow(new BMap.InfoWindow(message, opts), point);
                    });
                } else {
                    map.openInfoWindow(new BMap.InfoWindow(message, opts), point);
                }
            });
        },
        //百度自定义信息窗口
        openInfoWindowCustom:function(map,markers,message,opts,custom,geo){
        	markers.addEventListener("click", function (e) {
                var point = new BMap.Point(e.target.getPosition().lng, e.target.getPosition().lat);
                if (geo) {
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(point, function (result) {
                        message += ('<br><a style="white-space: nowrap;text-overflow: ellipsis;color:#000;">位置:' + result.address + '</a>' + custom);
                        map.openInfoWindow(new BMap.InfoWindow(message, opts), point);
                    });
                } else {
                    map.openInfoWindow(new BMap.InfoWindow(message, opts), point);
                }
            });
        },
        //根据方向角度获得中文方法
        direction: function (param) {
            if (param > 22.5 && param < 90 - 22.5) {
                return "东北";
            }else if (param >= 90 - 22.5 && param <= 90 + 22.5) {
                return "正东";
            }else if (param > 90 + 22.5 && param < 180 - 22.5) {
                return "东南";
            }else if (param >= 180 - 22.5 && param <= 180 + 22.5) {
                return "正南";
            }else if (param > 180 + 22.5 && param < 270 - 22.5) {
                return "西南";
            }else if (param >= 270 - 22.5 && param <= 270 + 22.5) {
                return "正西";
            }else if (param > 270 + 22.5 && param < 360 - 22.5) {
                return "西北";
            }else {
                return "正北";
            }
        },
        //百度逆地址解析
        geocoder: function (lng, lat, callback) {
            var geoc = new BMap.Geocoder();
            geoc.getLocation(point, function (result) {
                callback(result);
            });
        }
    })
})(window.jQuery)