var container = $('#svg_container');
var svg_element = container[0];
svg_element.setAttribute("id", "map");		// Give an "id" attribute to the svg element - NOT what we want!!!

var bbox = svg_element.getBBox();
// w = svg_element.getBBox().width;
// h = svg_element.getBBox().height;

var width = svg_element.clientWdith;
var height = svg_element.clientHeight;

svg3 = d3.select("svg").call(d3.zoom().on("zoom", function (e, d) {
              svg3.attr("transform", e.transform);
      }))
	  .append("g");
