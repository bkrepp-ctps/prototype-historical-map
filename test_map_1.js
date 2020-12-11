/*
	This demo is based on 
	1. the noUI slider control:
		https://refreshless.com/nouislider/
	2. the GitHub repository for this:
		https://github.com/leongersen/noUiSlider

	-- B. Krepp, attending metaphysician
	   10, 11 December 2020
*/

var verticalSlider = document.getElementById('slider-vertical');
var all_layers = []			// All layers in SVG map, includes "base layers"
    toggleable_layers = [];	// Toggle-able layers in SVG map
	
function sliderHandler(values, handle, unencoded, tap, positions, noUiSlider) {
    // values: Current slider values (array);
    // handle: Handle that caused the event (number);
    // unencoded: Slider values without formatting (array);
    // tap: Event was caused by the user tapping the slider (boolean);
    // positions: Left offset of the handles (array);
    // noUiSlider: slider public Api (noUiSlider);
	// 
	// Per the documentation:
	//     "values" is an array containing the current slider values, with formatting applied. 
	//     "handle" is the index of the handle that caused the event, starting at zero. 
	//     "values[handle]" gives the value for the handle that triggered the event.
	var _DEBUG_HOOK = 0;
	var year_str = values[handle];
	var year = +values[handle];
	console.log(year);
} // sliderHandler()

function initialize() {
	// 'to' and 'from' formatter functions, needed by noUiSlider control.
	//
	// 'to' formatter function: receives a number.
	function to_formatter(value) {
		// console.log('to formater: value = ' + value);
		// $('#year').val(value.toFixed(0));
		return value.toFixed(0);
	} 
	// 'from' the formatted value: receives a string, returns a number.	
	function from_formatter(value) {
		return Number(value);
	}
	
	// Create vertical slider control.
	noUiSlider.create(verticalSlider, {
		start: 1800,
		orientation: 'vertical',
		range: {
			'min': 1800,
			'max': 2021
		},
		format: {	to: to_formatter,
					from: from_formatter
		},
		tooltips: [ { to: to_formatter, from: from_formatter } ],
		pips: {
			mode: 'values',
			values: [1800, 1820, 1840, 1860, 1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020]
		}
	});
	
	// Bind event handler for 'end' [slide] event from noUiSlider control
	verticalSlider.noUiSlider.on('end', sliderHandler);
	
	d3.csv("csv/feature_timeline.csv", function(d) {
	  return {
		layer_name:	d.layer_name,
		start_year: +d.start_year,
		end_year: 	+d.end_year,
		type:		d.type
	  };
	}).then(function(data) {
		all_layers = data;
		toggle_layers = _.filter(data, function(rec) { return rec.type !== 'z'; });
		var _DEBUG_HOOK = 0;
	});
	
} // initialize()

$(document).ready(function() {
	initialize();
});