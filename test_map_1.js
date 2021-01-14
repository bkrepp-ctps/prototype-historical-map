/*
	This demo is based on 
	1. the noUI slider control:
		https://refreshless.com/nouislider/
	2. the GitHub repository for this:
		https://github.com/leongersen/noUiSlider

	-- B. Krepp, attending metaphysician
	   10, 11, 14-17, 29-31 December 2020
*/

var verticalSlider = document.getElementById('slider-vertical');
var all_records = [],			// All records in CSV file
	all_milestones = [],		// All milestones in CSV file (base layers are not milestones);
                                // includees milestones w/o a layer, "base layers", and toggleable layers
    all_layers = [],			// All layers in SVG file, includes "base layers" and toggleable layers
	toggleable_layers = [];		// Toggle-able layers in SVG map
	
var debugFlag = false;
	
// Event handler for slider 'update' event
function sliderHandler(values, handle, unencoded, tap, positions, noUiSlider) {
    // values: Current slider values (array);
    // handle: Handle that caused the event (number);
    // unencoded: Slider values without formatting (array);
    // tap: Event was caused by the user tapping the slider (boolean);
    // positions: Left offset of the handles (array);
    // noUiSlider: slider public Api (noUiSlider);
	// 
	// Per the noUiSilder documentation:
	//     "values" is an array containing the current slider values, with formatting applied. 
	//     "handle" is the index of the handle that caused the event, starting at zero. 
	//     "values[handle]" gives the value for the handle that triggered the event.
	
	var current_year_str = values[handle];
	var current_year = +values[handle];
	if (debugFlag) { console.log('curent_year: ' + current_year); }
	
	// Turn on all toggleable layers whose 
	// start_year is <= current year AND whose end_year is > current_year.
	var to_show = _.filter(toggleable_layers, 
	                       function(rec) { 
						       //console.log('rec.layer_name ' + rec.start_year + ' ' + rec.end_year);
						       return rec.start_year <= current_year && rec.end_year > current_year; });
	to_show.forEach(function(layer) {
		var query_str  = '#' + layer.layer_name;
		if (debugFlag) { console.log('Show ' + layer.layer_name); }
		$(query_str).show();
		// var txt = layer.desc;
		// $('#output').html(txt);
	});
	
	// Turn off all toggleable layers whose 
	// start_year is > current_year OR whose end_year <= current_year.
	var to_hide = _.filter(toggleable_layers, function(rec) { 
													return rec.start_year > current_year || rec.end_year <= current_year; });
	to_hide.forEach(function(layer) { 
		var query_str = '#' + layer.layer_name;
		if (debugFlag) { console.log('Hiding ' + layer.layer_name); }
		$(query_str).hide();
	});
	
	// Clear the output area, and display the descriptive text for this year's milestones.
	$('#output').html('');
	var opened_this_year = _.filter(all_milestones, function(rec) { return rec.start_year === current_year; });
	var closed_this_year = _.filter(all_milestones, function(rec) { return rec.end_year === current_year; });
	var desc_text = '';
	if (opened_this_year.length !== 0 || closed_this_year.length !== 0) {
		desc_text += '<ul>';
		opened_this_year.forEach(function(rec) {
			// console.log('open: ' + rec.milestone);
			if (rec.type == 'l') {
				desc_text += '<li class="milestone_legislative">';
			} else {
				desc_text += '<li class="milestone_opened">';
			}
			desc_text += rec.milestone + '</li>';
		});
		closed_this_year.forEach(function(rec) {
			// console.log('closed: ' + rec.milestone);
			desc_text += '<li class="milestone_closed">' + rec.milestone +  '</li>';
		});
		desc_text += '</ul>';
	}
	var prefix = '<div class="year_header">' + current_year + '</div>';
	$('#output').html(prefix + desc_text);
} // sliderHandler()

function initialize() {
	// Enable slider control
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
		step: 1,
		keyboardSupport: true,
		keyboardDefaultStep: 1,
		keyboardPageMultiplier: 10,
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
	
	var csv_fn = 'csv/feature_timeline.csv';
	// var csv_fn = 'csv/orange_line_timeline.csv';
	d3.csv(csv_fn, function(d) {
	  return {
		layer_name:	d.layer_name.replace('"',''),
		start_year: +d.start_year,
		end_year: 	+d.end_year,
		type:		d.type,
		milestone:	d.milestone
	  };
	}).then(function(data) {
		all_records = data;	// Temp, for debuggin
		all_milestones = _.filter(data, function(rec) { return rec.type !== 'z'; });
		all_layers = _.filter(data, function(rec) { return rec.layer_name !== 'NULL'; });
		toggleable_layers = _.filter(all_layers, function(rec) { return rec.type !== 'z'; });
		// Hide all toggleable layers at initialization
		toggleable_layers.forEach(function(layer) { 
			var query_str = '#' + layer.layer_name;
			$(query_str).hide();
		});
	});
} // initialize()

$(document).ready(function() {
	initialize();
});