
var N = 100;
var Y0 = 0, Y1 = 10;
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
    pts.map(function(x,i) {
	    arr[i] = [[x, Y0, Math.random()], [x, Y1, Math.random()]];
	});
    return arr;
};

var origin_vl = make_vl([0]), series_vl = make_vl(series);
var linscale = d3.scale.linear().domain([1,100]).range([0,width]); 
var logscale = d3.scale.log().domain([1,100]).range([0,width]);

function ex1(sel, passed_mode) {
    var mode = passed_mode || linscale;

    var line = d3.svg.line()
	.x(function(d) { return mode(d[0]) + margin.left; })
	.y(function(d) { return d[1] + margin.top; })
	.interpolate("basis");

    // draw the origin
    d3.select(sel).selectAll('.origin').data(origin_vl).enter()
	.append('svg:path').attr('class', 'origin').attr('stroke', 'green')
	.attr('d', line);

    d3.select(sel).selectAll('.data')
	.data(series_vl)
	.enter()
	.append('svg:path')
	.attr('class', 'data')
	.attr('stroke', 'blue')
	.transition()
	.duration(1000)
	.attr('d', line);
    
    /*
    if (!passed_mode) {
	console.log('not mode');
	d3.select(sel).selectAll('.data').data(series_vl)
	    .enter().append('svg:path')
	    .attr('class', 'data')
	    .attr('stroke', 'blue')
	    .attr('d', line);
    } else {
	d3.select(sel).selectAll('.data')
	    .data(series_vl)
	    .transition()
	    .duration(1000)
	    .attr('d', line);	
    }
    */
}


var examples = [ex1];
var svg = d3.select("body").selectAll("svg")
    .data(examples)
    .enter()
    .append("svg")
    .attr("class", "box")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .append("g")
    .each(function(render_fn) {
		render_fn(this);
	});

var ex1_log = function() {
    // clear_vl(series_vl);
    series_vl = make_vl(series, series_vl);    
    d3.select("body").selectAll("svg")
	.data(examples)
    .each(function(render_fn) { render_fn(this, logscale); });
};
var ex1_lin = function() {
    // clear_vl(series_vl);    
    series_vl = make_vl(series, series_vl);    
    d3.select("body").selectAll("svg")
	.data(examples)
	.each(function(render_fn) { render_fn(this, linscale); });    
};


// let's make some buttons! 
d3.select('body').selectAll('button').data(['log', 'linear'])
    .enter().append('div')
    .attr('class', function(d) { return 'button ex1_' + d; })
    .on('click', function(d) {
	    if (d === 'log') { return ex1_log(); }
	    if (d === 'linear') { return ex1_lin(); }	    
	})
    .text(function(d) { return d; });




