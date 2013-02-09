
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

// 13 -> [[x(13), 10], [x(13), 15]]
var make_vl = function(pts) {
    return  pts.map(function(x) { return [[x, Y0], [x, Y1]]; });
};

var origin_vl = make_vl([0]), series_vl = make_vl(series);

function ex1(sel, mode) {
    mode = mode || d3.scale.linear().domain([0,100]).range([0,width]);
    
    var line = d3.svg.line()
	.x(function(d) { return mode(d[0]) + margin.left; })
	.y(function(d) { return d[1] + margin.top; })
	.interpolate("basis");
    
    d3.select(sel).selectAll('.origin')
	.data(origin_vl)
	.enter()
	.append('svg:path')
	.attr('stroke', 'green')
	.attr('d', line);    
    d3.select(sel).selectAll('.data')
	.data(series_vl)
	.enter()
	.append('svg:path')
	.attr('stroke', 'blue')
	.transition()
	.duration(1000)
	.attr('d', line);    
    console.log('selection is ', d3.select(sel));
}

function ex2(sel) {
    console.log('ex2', sel);    
}

var examples = [ex1, ex2];
var svg = d3.select("body").selectAll("svg")
    .data(examples)
    .enter()
    .append("svg")
    .attr("class", "box")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .append("g")
    .each(function(render_fn) { console.log('renderfn is ', typeof(render_fn), render_fn); render_fn(this);  });

var ex1_log = function() {
    series_vl = make_vl(series);    
    d3.select("body").selectAll("svg")
	.data(examples)
	.each(function(render_fn) {
		render_fn(this, d3.scale.log().domain([0,100]).range([0,width]));
	    });    
};



