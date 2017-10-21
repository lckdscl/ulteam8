function BarChart(){
			
			var margin = {top: 20, right: 20, bottom: 30, left: 40},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var formatPercent = d3.format(".0%");

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1, 1);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(formatPercent);

			var svg = d3.select("body").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			  .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var data = Histogram(foo.data);

			  x.domain(data.map(function(d) { return d.emotion; }));
			  y.domain([0, d3.max(data, function(d) { return d.number; })]);

			  svg.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + height + ")")
				  .call(xAxis);

			  svg.append("g")
				  .attr("class", "y axis")
				  .call(yAxis)
				.append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("#");

			  svg.selectAll(".bar")
				  .data(data)
				.enter().append("rect")
				  .attr("class", "bar")
				  .attr("x", function(d) { return x(d.emotion); })
				  .attr("width", x.rangeBand())
				  .attr("y", function(d) { return y(d.number); })
				  .attr("height", function(d) { return height - y(d.number); })
				  .style("fill", function(d) { console.log(d.color); return d.color});
	  
				  
			  d3.select("input").on("change", change);

			  var sortTimeout = setTimeout(function() {
			  
				continueLooping();
			  }, 2000);

			  function continueLooping() {
				data = Histogram(foo.data);
				svg.selectAll(".bar")
				  .data(data);
				  change();
				
				setTimeout(continueLooping, 2000);
			  };
			  
			  function change() {
				clearTimeout(sortTimeout);

				console.log("test");
				y.domain([0, d3.max(data, function(d) { return d.number; })]);
				
				// Copy-on-write since tweens are evaluated after a delay.
				var x0 = x.domain(data.sort(this.checked
					? function(a, b) { return b.number - a.number; }
					: function(a, b) { return d3.ascending(a.emotion, b.emotion); })
					.map(function(d) { return d.emotion; }))
					.copy();

				//svg.selectAll(".bar")
				//	.sort(function(a, b) { return x0(a.emotion) - x0(b.emotion); });

				var transition = svg.transition().duration(750),
					delay = function(d, i) { return i * 50; };

				transition.selectAll(".bar")
					.delay(delay)
					.attr("x", function(d) { return x0(d.emotion); })
				    .attr("y", function(d) { return y(d.number); })
				    .attr("height", function(d) { return height - y(d.number); });

				transition.select(".x.axis")
					.call(xAxis)
				  .selectAll("g")
					.delay(delay);
					
				//setTimeout(function() {
				//	change();
				 // }, 2000);
			  }
			
		
		};