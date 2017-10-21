function LineChart(){
			
	var limit = 60 * 1,
		duration = 6000,
		now = new Date(Date.now() - duration),
		start = Date.now();

	var width = document.documentElement.clientWidth-40-40,
		height = 300

	var groups = {
		heartrate: {
			value: 0,
			color: 'pink',
			data: d3.range(limit).map(function() {
				return 0
			})
		},
		emotion: {
			value: 0,
			color: 'yellow',
			data: d3.range(limit).map(function() {
				return 0
			})
		},
		output: {
			value: 0,
			color: 'yellow',
			data: d3.range(limit).map(function() {
				return 0
			})
		}
	}

	var x = d3.time.scale()
		.domain([now - (limit - 2) * duration, now - duration])
		.range([0, width])
	var y = d3.scale.linear()
		.domain([0, 4])
		.range([height, 0])

	var line = d3.svg.line()
		.interpolate('basis')
		.x(function(d, i) {
			return x(now - (limit - 1 - i) * duration)
		})
		.y(function(d) {
			return y(d)
		})

	var svg = d3.select('.graph').append('svg')
		.attr('class', 'chart')
		.attr('width', width)
		.attr('height', height + 50)

	var axis = svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

	var paths = svg.append('g')

	for (var name in groups) {
		var group = groups[name]
		group.path = paths.append('path')
			.data([group.data])
			.attr('class', name + ' group')
			.style('stroke', group.color)
	}

	function tick() {
	now = new Date()

		// Add new values
		for (var name in groups) {
			var group = groups[name]
			//group.data.push(group.value) // Real values arrive at irregular intervals
			switch(name) {
				case 'heartrate':
					console.log(boo.data[boo.data.length-1].heartrate/180*3);
					group.data.push(boo.data[boo.data.length-1].heartrate/180*3);
					break;
				case 'emotion':
					group.data.push(RollingAverage(foo.data));
					break;
				default:
					group.data.push(RollingAverage(foo.data));
			} 
			group.path.attr('d', line)
		}

		// Shift domain
		x.domain([now - (limit - 2) * duration, now - duration])
		//x.domain([start, now - duration])

		// Slide x-axis left
		axis.transition()
			.duration(duration)
			.ease('linear')
			.call(x.axis)

		// Slide paths left
		paths.attr('transform', null)
			.transition()
			.duration(duration)
			.ease('linear')
			.attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
			//.attr('transform', 'scale(' + x(now - (limit - 1) * duration) + ')')
			.each('end', tick)

		// Remove oldest data point from each group
		for (var name in groups) {
			var group = groups[name]
			group.data.shift()
		}
	}

	tick();
};