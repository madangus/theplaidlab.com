var thePlaidLab = (function() {
	function debugBreakpoints() {
		var lWidth = document.documentElement.clientWidth;
		var vWidth = $('body').width();
		$('#debugStockViewport').empty().append('<p>Before the meta device-width reset, the layout viewport was reported as ' + window.domsNastyGlobalOriginalLayoutViewport + 'px.</p>');
		$('#debugCurrentViewport').empty().append('<p>After the meta viewport device-width applied, Layout width is reported as: ' + lWidth + 'px. Visual viewport size is currently: ' + vWidth + 'px</p>');

	}

	function registerHandlers() {
		//console.log('registering handlers');

		$(window).resize(function() {
			//debugBreakpoints();
		});

	}

	return {
		init: function() {
			//console.log('theplaidlab init');
			//debugBreakpoints();
			registerHandlers();
			thePlaidLabModules.slideshow.init();
		}
	};
}());


(function plaidMasterInit() {
	//console.log('plaidMasterInit runs');
	// Check to see if jquery and all our custom stuff is ready
	// NOTE: Fairly soon I'll be switching js delivery over to require.js or similar, so this cheap and cheerful dependency mgmt will then be gone
	if (typeof $ !== 'undefined' && typeof thePlaidLab !== 'undefined' && typeof thePlaidLabModules !== 'undefined') {
		$(document).ready(function() {
			thePlaidLab.init();
		});						
	} else {
		//console.log('All scripts not loaded.');
		window.setTimeout(plaidMasterInit, 10);					
	}	
					
}());	// plaidMasterInit


