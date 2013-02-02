
/*
*	Well we have 1 developer right now :) Going for the nested object literal since it's good simple organization and global abatement.
*	For my own amusement, I'l probably make carousel a jquery based plugin fairly soon. 
*/

var thePlaidLabModules = thePlaidLabModules || {};

thePlaidLabModules.carousel = {
	init: function() {
		console.log('lets set up the carousel');
		var rawWidth = $('*[data-module="carousel"] *[data-control="stage"]').first().width();
		this.stageWidth = parseInt(rawWidth);
		this.itemsCount = ( $('*[data-module="carousel"] *[data-display-item]') ).length;
		console.log('stage width: ' + this.stageWidth + '. Items ' + this.itemsCount);
		this.currentItem = 1;
		this.stagePos = 0;
		this.registerHandlers();
	},
	registerHandlers: function() {
		$('*[data-module="carousel"]').on('click', '*[data-control="navigate"]', function(event) {
			var dir = $(this).attr("data-action");
			if (dir) {
				thePlaidLabModules.carousel.moveStage(dir);
			}
		});
	},
	moveStage: function(dir) {
		var newPosPx, newPos;
		var prevItem = this.currentItem;

		if (dir === 'back') {
			var newCurr = this.currentItem - 1;
			this.currentItem = (newCurr) ? newCurr : 1;
		} else {
			var newCurr = this.currentItem + 1;
			this.currentItem = (newCurr <= this.itemsCount) ? newCurr : this.itemsCount;
		}

		if (prevItem !== this.currentItem) {
			if (this.currentItem === 1) {
				newPos = 0;				
				newPosPx = "0px"
			} else {
				newPos =  (dir === 'back') ? this.stagePos - this.stageWidth : this.stagePos + this.stageWidth;
				newPosPx = '-' + newPos + 'px';
			}

			console.log(dir + ' to ' + newPosPx);
			var $wrapper = $('*[data-control="stage"]').find('.itemsWrapper').first(); 
			$wrapper.css("margin-left",newPosPx);
			this.stagePos = newPos;
		}
	}


}


