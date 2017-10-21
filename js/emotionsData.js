function EmotionsData(){
	this.data = [];
	this.lastTimeStamp = Date.now()-5000;
	this.currentTimeStamp = Date.now()-5000;
	emotions = this;

	this.retrieveData = function(){
		emotions.lastTimeStamp = emotions.currentTimeStamp;
		emotions.currentTimeStamp = Date.now()-5000;
		setTimeout(function(){ 
			var req = new XMLHttpRequest();
			var query = "{$and:[{ \"Time\": { $gt: "+emotions.lastTimeStamp+" } },{ \"Time\": { $lt: "+emotions.currentTimeStamp+" } }]}";
			var useurl = "https://api.mlab.com/api/1/databases/ulteam8/collections/emotions?q="+ query +"&apiKey=JwVaYcrf_BrvZ-n6UwurNFq4_PfP7q5G";
			//console.log(useurl);
			req.open("GET", useurl, true);
			req.setRequestHeader("Content-Type", "application/json"); 
			req.addEventListener("load", function() {
			  //console.log(req.response);
			  emotions.data = emotions.data.concat(JSON.parse(req.response));
			  //console.log(emotions.data);
			});
			req.send(null);
			setTimeout(emotions.retrieveData, 1000);
		}, 1000);
	};
	
	this.retrieveData();
};