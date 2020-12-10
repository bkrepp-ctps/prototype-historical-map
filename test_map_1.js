/*
	This demo is based on 
	1. the noUI slider control:
		https://refreshless.com/nouislider/
	2. the GitHub repository for this:
		https://github.com/leongersen/noUiSlider

	-- B. Krepp, attending metaphysician
	   10 December 2020
*/

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

var verticalSlider = document.getElementById('slider-vertical');
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