var thePlaidLab = (function() {
	function registerHandlers() {
		console.log('registering handlers');
	}

	return {
		init: function() {
			console.log('theplaidlab init');
			registerHandlers();

		}
	};
}());


(function masterInit($) {
	// Check to see if jquery is ready
	if (window.$) {
		$(document).ready(function() {			
			thePlaidLab.init();
		});	// Document is ready						
	} else {
		console.log('no jquery yet');
		window.setTimeout(masterInit, 20);					
	}	
					
}(jQuery));	// masterInit


