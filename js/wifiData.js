function WifiData(){
	this.data = [
		{index: .2, value: 0},
		{index: .4, value: 0},
		{index: .6, value: 0},
	  ];
	var excellentTime = 0;
	var difference = Date.now()-excellentTime;
	console.log(difference);
	this.currentTimeStamp = Date.now() - difference;
	wifidata = this;

	this.retrieveData = function(){
		wifidata.currentTimeStamp = Date.now() - difference;
		if(wifidata.currentTimeStamp>370000688)
			difference = Date.now()-excellentTime;
		setTimeout(function(){ 
			var req = new XMLHttpRequest();
			var query = "{$and:[{ \"timestamp\": { $gt: "+(wifidata.currentTimeStamp-10000)+" } },{ \"timestamp\": { $lt: "+wifidata.currentTimeStamp+" } }]}";
			var useurl = "https://api.mlab.com/api/1/databases/ulteam8/collections/wifidata?q="+ query +"&s={\"timestamp\":-1}&apiKey=JwVaYcrf_BrvZ-n6UwurNFq4_PfP7q5G";
			console.log(useurl);
			req.open("GET", useurl, true);
			req.setRequestHeader("Content-Type", "application/json"); 
			req.addEventListener("load", function() {
			  //console.log(req.response);
			  var jsonData = JSON.parse(req.response)
			  if(jsonData.length > 0){
				var sum = jsonData[0].people_near + jsonData[0].people_mid+ jsonData[0].people_far;
				wifidata.data[0].value = jsonData[0].people_near/sum;
				wifidata.data[1].value = jsonData[0].people_mid/sum;
				wifidata.data[2].value = jsonData[0].people_far/sum;
			  }
			  //console.log(wifidata.data);
			  //console.log(emotions.data);
			});
			req.send(null);
			setTimeout(wifidata.retrieveData, 1000);
		}, 1000);
	};
	
	this.retrieveData();
};