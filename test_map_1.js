/*
	This demo is based on 
	1. the noUI slider control:
		https://refreshless.com/nouislider/
	2. the GitHub repository for this:
		https://github.com/leongersen/noUiSlider

	-- B. Krepp, attending metaphysician
	   10, 11, 14 December 2020
*/

var verticalSlider = document.getElementById('slider-vertical');
var all_layers = []			// All layers in SVG map, includes "base layers"
    toggleable_layers = [];	// Toggle-able layers in SVG map
	
var debugFlag = false;
	
// Event handler for slider 'update event
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
	var current_year_str = values[handle];
	var current_year = +values[handle];
	
	if (true) { console.log('curent_year: ' + current_year); }
	
	// Turn on all toggleable layers whose 
	// start_year is <= current year AND whose end_year is > current_year.
	var to_show = _.filter(toggleable_layers, 
	                       function(rec) { 
						       //console.log('rec.layer_name ' + rec.start_year + ' ' + rec.end_year);
						       return rec.start_year <= current_year && rec.end_year > current_year; });
	to_show.forEach(function(layer) {
		var query  = '#' + layer.layer_name;
		if (true) { console.log('Show ' + layer.layer_name); }
		$(query).show();
	});
	
	// Turn off all toggleable layers whose 
	// start_year is > current_year OR whose end_year <= current_year.
	var to_hide = _.filter(toggleable_layers, function(rec) { 
													return rec.start_year > current_year || rec.end_year <= current_year; });
	to_hide.forEach(function(layer) { 
		var query = '#' + layer.layer_name;
		if (debugFlag) { console.log('Hiding ' + layer.layer_name); }
		$(query).hide();
	});
} // sliderHandler()

function initialize() {
	// 'to' and 'from' formatter functions, *both* of which are required 
	//  by the noUiSlider control, even if only one is used.
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
	
	// Bind event handler for 'update' [slide] event from noUiSlider control
	verticalSlider.noUiSlider.on('update', sliderHandler);
	
	d3.csv("csv/orange_line_timeline.csv", function(d) {
	  return {
		layer_name:	d.layer_name.replace('"',''),
		start_year: +d.start_year,
		end_year: 	+d.end_year,
		type:		d.type
	  };
	}).then(function(data) {
		all_layers = data;
		toggleable_layers = _.filter(data, function(rec) { return rec.type !== 'z'; });
		var _DEBUG_HOOK = 0;
		// Hide all toggleable layers at initialization
		toggleable_layers.forEach(function(layer) { 
			var query = '#' + layer.layer_name;
			// console.log('Hiding ' + layer.layer_name);
			$(query).hide();
		});
	});
	
} // initialize()

$(document).ready(function() {
	initialize();
});