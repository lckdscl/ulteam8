function WalkingData(){
	this.data = [{
		Time:0,
		Steps: 0
		
		
	},{
		Time:0,
		Steps: 0
		
		
	}
	];
	
	
	this.lastTimeStamp = Date.now()-5000;
	this.currentTimeStamp = Date.now()-5000;
	walkingData = this;

	this.retrieveData = function(){
		walkingData.lastTimeStamp = walkingData.currentTimeStamp;
		walkingData.currentTimeStamp = Date.now()-5000;

		setTimeout(function(){ 
			var req = new XMLHttpRequest();
			var query = "{$and:[{ \"Time\": { $gt: "+walkingData.lastTimeStamp+" } },{ \"Time\": { $lt: "+walkingData.currentTimeStamp+" } }]}";
			var useurl = "https://api.mlab.com/api/1/databases/ulteam8/collections/PedoData?q="+ query +"&apiKey=JwVaYcrf_BrvZ-n6UwurNFq4_PfP7q5G";
			console.log(useurl);
			req.open("GET", useurl, true);
			req.setRequestHeader("Content-Type", "application/json"); 
			req.addEventListener("load", function() {
			  console.log(req.response);
			  var jsonData = JSON.parse(req.response)
			  if(jsonData.length > 0){
				walkingData.data = walkingData.data.concat(JSON.parse(req.response));
			  }
			  //console.log(wifidata.data);
			  //console.log(emotions.data);
			});
			req.send(null);
			setTimeout(walkingData.retrieveData, 10000);
		}, 10000);
	};
	
	this.retrieveData();
};