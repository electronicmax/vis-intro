/*global $,_,document,window,console,escape,Backbone,exports */
/*jslint vars:true, todo:true, sloppy:true */

var mklinefn = function(canvas, data) {
    return function(mode) {
		var xmin = d3.min(data.map(function(d) { return d.x; })),
		    xmax = d3.max(data.map(function(d) { return d.x; })),
		    ymin = d3.min(data.map(function(d) { return d.y; })),
		    ymax = d3.max(data.map(function(d) { return d.y; })),
		    xscale = d3.scale.linear().domain([xmin,xmax]).range([10, $(canvas).width() - 10]),
		    yscale = d3.scale.linear().domain([ymin,ymax]).range([10, $(canvas).height() - 10]);
		return d3.svg.line()
			.x(function(d) { return xscale(d.x); })
			.y(function(d) { return yscale(d.y); })		
			.interpolate('basis');
	};
};

var make_el = function(make_el, cls, parent) {
	var s = "<"+make_el+">" + "</"+make_el+">";
	return $(s).appendTo(parent || $('body')).addClass(cls||'');
};

var drawPlot = function(canvas, cls, data_array) {
	return d3.select(canvas)
		.selectAll('path.'+cls)
		.data(data_array)
		.enter()
		.append('path')
		.attr('class', cls)
		.attr('d', mklinefn(canvas, data_array))
		.attr('fill', 'blue')
		.attr('stroke','black');
};

var transition_data = function(canvas, cls, new_data) {
	return d3.select(canvas)
		.selectAll('path.'+cls)
		.data(new_data)
		.transition()
		.duration(1000)
		.attr('d', mklinefn(canvas, new_data));
};

$(document).ready(function() {
	var data = [
		{ x: 0, y: 1, category: 'male' },
		{ x: 1, y: 4, category: 'female' },
		{ x: 2, y: 5, category: 'male' },
		{ x: 3, y: 4, category: 'male' },
		{ x: 4, y: 3, category: 'female' },
		{ x: 5, y: 5, category: 'male' },
		{ x: 6, y: 1, category: 'female' },
		{ x: 7, y: 6, category: 'female' }
	];	
	var canvas = make_el('svg', 'box')[0];
	window.canvas = canvas;
	console.log('daaaaaaaaaata', canvas);	
	// draw ourselves the path
	var path = drawPlot(canvas, 'plot', data);
	console.log('dlkfjdaaaaaaaaaata', canvas);	
	var categories = _.uniq(data.map(function(x) { return x.category; }));
	var button_group = make_el('div','btn-group').attr('data-toggle','buttons-radio');
	console.log('categories ', categories);
	categories.concat(['all']).map(function(c) {
		make_el('div', 'btn', button_group)
			.html(c)
			.on('click', function() {
				return transition_data(canvas, 'plot', data.filter(function(dx) {
					return c === 'all' || dx.category === c;
				}));
			});
	});
});
