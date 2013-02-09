/*global $,_,document,window,console,escape,Backbone,exports */
/*jslint vars:true, todo:true, sloppy:true */

var N = 100;
var Y0 = 0, Y1 = 20;
var log = function() { console.log.apply(console,arguments); };
var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 500 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;
var gen_random = function() {
    var data = [];
    for (var i = 0; i < N; i++) {
		data.push( 100*Math.random() + 1 );
    }
    return data;
};
var series = gen_random(N);
var make_vl = function(pts, arr) {
    arr = arr || [];
    pts.map(function(x,i) {  arr[i] = [[x, Y0], [x, Y1]];	});
    return arr;
};
var origin_vl = make_vl([0]), series_vl = make_vl(series);
var linscale = d3.scale.linear().domain([1,100]).range([0,width]); 
var logscale = d3.scale.log().domain([1,100]).range([0,width]);

var linefn = function(mode) {
	return line = d3.svg.line()
		.x(function(d) { return mode(d[0]) + margin.left; })
		.y(function(d) { return d[1] + margin.top; })
		.interpolate("basis");
	
};

function ex1(sel) {
    d3.select(sel).selectAll('path.origin').data(origin_vl)
		.enter().append('svg:path')
		.attr('class', 'origin')
		.attr('stroke', 'green')
		.attr('d', linefn(linscale));
	
    d3.select(sel).selectAll('path.data').data(series_vl)
		.enter().append('svg:path')
		.attr('class', 'data')
		.attr('stroke', 'blue')	
		.attr('d', linefn(linscale));    
}

var ex1_log = function() {
	d3.select('svg.ex1').selectAll('path.data')
		.transition().duration(1000)
		.attr('d', linefn(logscale));
};
var ex1_lin = function() {
	d3.select('svg.ex1').selectAll('path.data')
		.transition().duration(1000)
		.attr('d', linefn(linscale));	
};
var ex1_round = function() {
	d3.select('svg.ex1').selectAll('path.data')
		.transition().duration(1000)
		.attr('d', linefn(function(t) {
			return linscale(Math.round(t/10)*10);
		}));
};

// initialise the examples
var examples = [ex1];
var svg = d3.select("body").selectAll("svg")
    .data(examples)
    .enter()
    .append("svg")
    .attr("class", "box ex1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .append("g")
    .each(function(render_fn) {
		render_fn(this);
	});



// let's make some buttons! 
d3.select('body').selectAll('div.btn')
	.data(['log', 'linear', 'round'])
    .enter().append('div')
	.attr('class', function(d) { return 'btn ex1_' + d; })
    .on('click', function(d) {
	    if (d === 'log') { log('ex1 -> log'); return ex1_log(); }
	    if (d === 'linear') { log('ex1 -> lin'); return ex1_lin(); }
	    if (d === 'round') { log('ex1 -> rnd'); return ex1_round(); }	    
	})
    .text(function(d) { return d; });




