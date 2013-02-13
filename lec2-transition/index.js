/*global $,_,document,window,console,escape,Backbone,exports */
/*jslint vars:true, todo:true, sloppy:true */

var width = 800, height = 400, margin=20;

var makets = function(canvas, data) {
    var xmin = d3.min(data.map(function(d) { return d.x; })),
      xmax = d3.max(data.map(function(d) { return d.x; })),
      ymin = d3.min(data.map(function(d) { return d.y; })),
      ymax = d3.max(data.map(function(d) { return d.y; })),
      xscale = d3.scale.linear().domain([xmin,xmax]).range([margin, width - 2*margin]),
      yscale = d3.scale.linear().domain([ymin,ymax]).range([margin, height - 2*margin]);
    return {
	xt : function(d) { return xscale(d.x); },
	yt: function(d) { return height-yscale(d.y); }	    
    };
};

var mklinefn = function(canvas,data) {
    var ts = makets(canvas,data);
    return d3.svg.line().x(ts.xt).y(ts.yt).interpolate('linear');
};
var mksymbolfn = function() {
    return d3.svg.symbol().type('circle').size(10);
};
var make_el = function(make_el, cls, parent) {
    var s = "<"+make_el+">" + "</"+make_el+">";
    return $(s).appendTo(parent || $('body')).addClass(cls||'');
};

var drawPlot = function(canvas, datacls, data_array) {
     d3.select(canvas)
      .selectAll('path.'+datacls)
      .data([data_array])
      .enter()
      .append('path')
      .attr('class', datacls)
      .attr('d', mklinefn(canvas, data_array))
      .attr('fill','none')
      .attr('stroke','black');
};

var update_markers = function(canvas, data_array) {
    var ts = makets(canvas,data_array);
    var sel = d3.select(canvas).selectAll('path.symbol').data(data_array);

    sel.enter().append('path')
       .attr('class','symbol')
       .attr('d', mksymbolfn(canvas,data_array))
       .attr('fill', 'black')
       .attr("transform", function(d) { return "translate(" + ts.xt(d) + "," + ts.yt(d) + ")"; });

    sel.transition()
      .duration(1000)
      .attr("transform", function(d) { return "translate(" + ts.xt(d) + "," + ts.yt(d) + ")"; })
      .attr('stroke', function(d) { if (d.category == 'male') return "blue"; return "red"; })
    
    sel.exit().remove();
};

var transition_data = function(canvas, cls, new_data) {
    return d3.select(canvas).selectAll('path.'+cls)
          .data([new_data])
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

	
	var canvas = d3.select('body').selectAll('svg.box').data([0])
	    .enter().append('svg').attr('class', 'box').attr('height',height).attr('width',width);
	canvas = d3.selectAll('svg.box')[0][0]; 
	console.log('daaaaaaaaaata', canvas); 
	// draw ourselves the path
	drawPlot(canvas, 'plot', data);
	update_markers(canvas, data);
	console.log('dlkfjdaaaaaaaaaata', canvas);	
	var categories = _.uniq(data.map(function(x) { return x.category; }));
	var button_group = make_el('div','btn-group').attr('data-toggle','buttons-radio');
	console.log('categories ', categories);
	categories.concat(['all']).map(function(c) {
		make_el('div', 'btn', button_group)
			.html(c)
			.on('click', function() {
				var filtered_data = data.filter(function(dx) { return c === 'all' || dx.category === c; });
				update_markers(canvas, filtered_data);				
				return transition_data(canvas, 'plot', filtered_data);
			});
	});
});
