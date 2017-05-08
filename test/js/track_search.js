(function($) {
	var beginBtn = document.getElementById("beginTime");
	var endBtn = document.getElementById("endTime");
	var time = new Date();
	var month = time.getMonth()< 9 ? "0" + (time.getMonth()+1) : time.getMonth() +1;
	var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
	beginBtn.innerText = time.getFullYear() + "-" + month + "-" + day + " 00:00";
	endBtn.innerText = time.getFullYear() + "-" + month + "-" + day + " 23:59";
	mui(document).on('tap','.mui-content-padded',function(e){
		var target = e.target;
		if(target.id === "beginTime"){
			var picker = new $.DtPicker();
			picker.show(function(rs){
				beginBtn.innerHTML = rs.text;
			});
		}else if(target.id === "endTime"){
			var picker = new $.DtPicker();
			picker.show(function(rs){
				endBtn.innerHTML = rs.text;
			});
		}
	});
	var serach = document.getElementById("searchBtn");
	serach.addEventListener('tap',function(){
		var vehicleId = document.getElementById("vehicleId").innerText;
		var beginTime = document.getElementById("beginTime").innerText;
		var endTime = document.getElementById("endTime").innerText;
		var checkboxs = document.getElementsByTagName('input');
		for (var i = 0; i < checkboxs.length; i++) {
			var check = checkboxs[i];
			if(check.checked){
				if("zero" === check.name){
					
				}else if("filter" === check.name){
					
				}
			}
		}
		sessionStorage.setItem("track_search",JSON.stringify( {
			car:vehicleId,
			begin_time:beginTime+":00",
			end_time:endTime+":59"
		}));
		mui.openWindow({
			url:"track_play.html",
			id:"track_play"
		});
	});
})(mui);