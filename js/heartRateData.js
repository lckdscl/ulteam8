function HeartRateData(){
	this.data = [{
		timestamp: 0,
		heartrate: 0		
	}];
	var excellentTime = 0;
	var difference = Date.now()/1000-excellentTime;
	this.lastTimeStamp = Date.now()/1000 - difference;
	this.currentTimeStamp = Date.now()/1000 - difference;
	
	heartRateData = this;

	this.retrieveData = function(){
		heartRateData.lastTimeStamp = heartRateData.currentTimeStamp;
		heartRateData.currentTimeStamp = Date.now()/1000 - difference;
		if(heartRateData.currentTimeStamp>471)
			difference = Date.now()/1000-excellentTime;
		setTimeout(function(){ 
			var req = new XMLHttpRequest();
			var query = "{$and:[{ \"timestamp\": { $gt: "+heartRateData.lastTimeStamp+" } },{ \"timestamp\": { $lt: "+heartRateData.currentTimeStamp+" } }]}";
			var useurl = "https://api.mlab.com/api/1/databases/ulteam8/collections/heartdata?q="+ query +"&apiKey=JwVaYcrf_BrvZ-n6UwurNFq4_PfP7q5G";
			//console.log(useurl);
			req.open("GET", useurl, true);
			req.setRequestHeader("Content-Type", "application/json"); 
			req.addEventListener("load", function() {
			  //console.log(req.response);
			  var jsonData = JSON.parse(req.response)
			  if(jsonData.length > 0){
				heartRateData.data = heartRateData.data.concat(JSON.parse(req.response));
			  }
			  //console.log(wifidata.data);
			  //console.log(emotions.data);
			});
			req.send(null);
			setTimeout(heartRateData.retrieveData, 1000);
		}, 1000);
	};
	
	this.retrieveData();
};