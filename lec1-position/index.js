
var N = 100;
var data = [];
for (var i = 0; i < 100; i++) { data.push( 100*Math.random() ); }

var examples = ['one', 'two'];

var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 500 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var chart = function(bloop, x) {
    console.log('bloop ', bloop, x);
};

console.log('examples', examples);

var svg = d3.select("body").selectAll("svg")
    .data(examples)
    .enter()
    .append("svg")
    .attr("class", "box")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(chart);






