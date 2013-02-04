
/*
*	Well we have 1 developer right now :) Going for the nested object literal since it's good simple organization and global abatement.
*	For my own amusement, I'l probably make slideshow a jquery based plugin fairly soon. 
*/

var thePlaidLabModules = thePlaidLabModules || {};

thePlaidLabModules.slideshow = {
	init: function() {
		console.log('lets set up the slideshow');
		var rawWidth = $('*[data-module="slideshow"] *[data-control="stage"]').first().width();
		this.stageWidth = parseInt(rawWidth);
		this.itemsCount = ( $('*[data-module="slideshow"] *[data-display-item]') ).length;
		console.log('stage width: ' + this.stageWidth + '. Items ' + this.itemsCount);
		this.currentItem = 1;
		this.stagePos = 0;
		this.registerHandlers();
	},
	registerHandlers: function() {
		$(document.documentElement).keyup(function (event) {
			// If there were form elements on the page we would be more careful about this
			if (event.keyCode === 37 || event.keyCode === 66) {
				thePlaidLabModules.slideshow.moveStage('backward');
			} else if (event.keyCode === 39 || event.keyCode === 70) {
				thePlaidLabModules.slideshow.moveStage('forward');			
			}
		});

		// In case I decide to add some graphical nav elements back
		if ( $('*[data-module="slideshow"] *[data-control="navigate"]').length ) {
			$('*[data-module="slideshow"]').on('click', '*[data-control="navigate"]', function(event) {
				var dir = $(this).attr("data-action");
				if (dir) {
					thePlaidLabModules.slideshow.moveStage(dir);
				}
			});
		}

		var target = document.querySelector('*[data-module="slideshow"]');
		var activeGesture = false;
		var movesx = [];
		var movesy = [];		
		target.addEventListener('touchstart', handleTouch, false); 
		target.addEventListener('touchmove', handleTouch, false); 		
		target.addEventListener('touchcancel', handleTouch, false); 		
		target.addEventListener('touchend', handleTouch, false); 		
		
		function handleTouch(event) {
			console.log('handleTouch fires!');
			var touch = event.touches[0];
			var numTouches = event.touches.length;			
			if (touch) {
				var x = touch.screenX;
				var y = touch.screenY;	
			}

			if (event.type === 'touchstart' && numTouches === 1 && !activeGesture) {
				// Set this flag so we track all subsequent movements
				activeGesture = true;
				movesx[0] = x;
				movesy[0] = y;
				console.log('touchstart x,y ' + x + ' ' + y);
				console.log('in the move array we have ' + movesx.length);
			}
			
			if (event.type === 'touchmove') {
				// This prevents touchcancel firing prematurely which seemed to be especially frquent on android 4 chrome
				event.preventDefault();
				
				var moveCount = (movesx) ? (movesx.length - 1) : 0;
				console.log('moveCount ' + moveCount);
				var prevx = movesx[moveCount];
				var prevy = movesy[moveCount];							

				var diff = prevy - y;

				if (diff < 40 && numTouches === 1) {
					// ok, so we still seem to be fairly horizontal so add this to the moves array
					console.log('touchmove x,y ' + x + ' ' + y + '. diff is ' + diff);
					movesx.push(x);
					movesy.push(y);
				} else {
					// Must be a up or down swipe I guess, or some other gesture if there's more than 1 simple swiping finger. 
					// So we cleanup and allow any other default behavior happen
					cleanupHandleGesture();
				}

			}

			if (event.type === 'touchend') {
				// Was it a left or right swipe?
				var lastCount = (movesx.length - 1);
				var lastx = movesx[lastCount];
				console.log(movesx);
				console.log('touchend. lastCount is ' + lastCount + '. ' + 'lastx is ' + lastx);

				if ( lastx > movesx[0] ) {
					thePlaidLabModules.slideshow.moveStage('forward');			
				} else if ( lastx < movesx[0] ) {
					thePlaidLabModules.slideshow.moveStage('backward');			
				}
				cleanupHandleGesture();
			}

			if (event.type === 'touchcancel') {
				cleanupHandleGesture();
			}

			function cleanupHandleGesture() {
				activeGesture = false;
				var movesx, movesy = null;				
			}

			var debug = false;
			if (debug) {
				var numTargetTouches = event.targetTouches.length;
				var numChangedTouches = event.changedTouches.length;
				$('#touchDebug').append('<br />***<span>numTouch ' + numTouch + '. numTargetTouches ' + numTargetTouches + '. numChangedTouches ' + numChangedTouches + '</span>');
				$('#touchDebug').append('<br /><span>event type = ' + event.type + ' is event.<br />');								
				$('#touchDebug').append('<span>event type = ' + event.type + '. touch start - x: ' + x + ' y: ' + y + '.</span>');
			}

		}


	},
	moveStage: function(dir) {
		var newPosPx, newPos;
		var prevItem = this.currentItem;

		if (dir === 'backward') {
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
				newPos = (dir === 'backward') ? this.stagePos - this.stageWidth : this.stagePos + this.stageWidth;
				newPosPx = '-' + newPos + 'px';
			}

			console.log(dir + ' to ' + newPosPx);
			var $wrapper = $('*[data-control="stage"]').find('.itemsWrapper').first(); 
			$wrapper.css("margin-left",newPosPx);
			this.stagePos = newPos;
		}
	}


}


