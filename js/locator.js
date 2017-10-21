function Locator(){

var width = 600,
    height = 300,
    radius = Math.min(width, height) / 1.9,
    spacing = .19;

var color = d3.scale.linear()
    .range(["hsl(189, 93.4%, 20%)", "hsl(189, 93.4%, 52.7%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });

var arcBody = d3.svg.arc()
    .startAngle(-0.2*Math.PI)
    .endAngle(0.2*Math.PI)
    .innerRadius(function(d) { return d.index * radius; })
    .outerRadius(function(d) { return (d.index + spacing) * radius; })
    .cornerRadius(6);

var arcCenter = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
    .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });

var svg = d3.select(".locator").append("svg")
    .attr("width", width)
    .attr("height", height)
	.attr("id", "locator")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height + ")scale(2)");

var field = svg.selectAll("g")
    .data(bar.data)
  .enter().append("g");

field.append("path")
    .attr("class", "arc-body");

field.append("path")
    .attr("id", function(d, i) { return "arc-center-" + i; })
    .attr("class", "arc-center");

tick();

d3.select(self.frameElement).style("height", height + "px");

function tick() {
	console.log(bar.data);
  if (!document.hidden) field
      .each(function(d) { this._value = d.value; })
      .data(bar.data)
      .each(function(d) { d.previousValue = this._value; })
    .transition()
      .ease("elastic")
      .duration(500)
      .each(fieldTransition);

  setTimeout(tick, 1000);
}

function fieldTransition() {
  var field = d3.select(this).transition();

  field.select(".arc-body")
      .attrTween("d", arcTween(arcBody))
      .style("fill", function(d) { return color(d.value); });
}

function arcTween(arc) {
  return function(d) {
    var i = d3.interpolateNumber(d.previousValue, d.value);
    return function(t) {
      d.value = i(t);
      return arc(d);
    };
  };
}

function fields() {
  var now = new Date;
  return [
    {index: .2, value: now.getSeconds() / 60},
    {index: .4, value: now.getMinutes() / 60},
    {index: .6, value: now.getHours() / 24},
  ];
}


};