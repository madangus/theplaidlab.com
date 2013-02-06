
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
		this.setupTouchSupport();
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
	},
	setupTouchSupport: function() {
		if (typeof document.querySelector === 'function') {
			var target = document.querySelector('*[data-module="slideshow"]');
			this.activeGesture = null;
			this.movesx = [];
			this.movesy = [];
			target.addEventListener('touchstart', thePlaidLabModules.slideshow.handleTouch, false); 
			target.addEventListener('touchmove', thePlaidLabModules.slideshow.handleTouch, false); 		
			target.addEventListener('touchcancel', thePlaidLabModules.slideshow.handleTouch, false); 		
			target.addEventListener('touchend', thePlaidLabModules.slideshow.handleTouch, false); 
		} 
	},	
	handleTouch: function() {
		var activeGesture = thePlaidLabModules.slideshow.activeGesture;
		var movesx = thePlaidLabModules.slideshow.movesx;
		var movesy = thePlaidLabModules.slideshow.movesy;

		console.log('handleTouch fires!');

		var touch = event.touches[0];
		var numTouches = event.touches.length;			
		if (touch) {
			var x = touch.screenX;
			var y = touch.screenY;	
		}

		if (event.type === 'touchstart' && numTouches === 1 && !activeGesture) {
			// Explicitly set the active flag, since it's a primitive type and our make-life-easier local assignment made a *copy* not reference
			thePlaidLabModules.slideshow.activeGesture = true;
			// Since it's an array we are dealing with here, the local assignment is just a reference so don't have to worry about
			// explcitly setting the object level original. Same treatment in touchmove etc...  
			movesx[0] = x;
			movesy[0] = y;
			console.log('touchstart x,y ' + x + ' ' + y);
			console.log('in the move array we have ' + movesx.length);
		}
		
		if (event.type === 'touchmove') {
			if (numTouches === 1 && activeGesture) {
				// This prevents touchcancel firing prematurely which seemed to be especially frequent on android 4 chrome
				event.preventDefault();

				var moveCount = (movesx) ? (movesx.length - 1) : 0;
				console.log('activeGesture is : ' + activeGesture + '. moveCount ' + moveCount + ' movesx.length ' + movesx.length);
				var prevx = movesx[moveCount];
				var prevy = movesy[moveCount];							

				console.log('touchmove x,y ' + x + ' ' + y);
				movesx.push(x);
				movesy.push(y);
				thePlaidLabModules.slideshow.activeGesture = true;
			} else {
				cleanupHandleGesture();
			}
		}

		if (event.type === 'touchend' && activeGesture) {
			// Was it a left or right swipe?
			var lastCount = (movesx.length - 1);
			var lastx = movesx[lastCount];
			var lasty = movesy[lastCount];
			console.log(movesx);
			console.log(movesy);			
			console.log('touchend. lastCount is ' + lastCount + '. ' + 'lastx is ' + lastx);

			// Since we prevented the default behavior for touchmove earlier
			// we need to either implement the left/right swipe OR handle up/down swipes

			var swipeType;
			if ( (lastx - movesx[0]) > 75 ) {
				swipeType = 'right';
			} else if ( (movesx[0] - lastx) > 75 ) {
				swipeType = 'left';
			} else if ( (movesy[0] - lasty) > 75 ) {
				swipeType = 'down';
			} else if (lasty - movesy[0] > 75) {
				swipeType = 'up';
			}
			
			switch (swipeType) {
				case 'right':
					thePlaidLabModules.slideshow.moveStage('forward');			
					break;

				case 'left':
					thePlaidLabModules.slideshow.moveStage('backward');			
					break;

				case 'down':
					console.log('down');
					break;

				case 'up':
					console.log('up');
					break;	

			}


			cleanupHandleGesture();
		}

		if (event.type === 'touchcancel') {
			cleanupHandleGesture();
		}

		function cleanupHandleGesture() {
			thePlaidLabModules.slideshow.activeGesture = false;
			thePlaidLabModules.slideshow.movesx = [];
			thePlaidLabModules.slideshow.movesy = [];				
		}

		var debug = false;
		if (debug) {
			var numTargetTouches = event.targetTouches.length;
			var numChangedTouches = event.changedTouches.length;
			$('#touchDebug').append('<br />***<span>numTouch ' + numTouch + '. numTargetTouches ' + numTargetTouches + '. numChangedTouches ' + numChangedTouches + '</span>');
			$('#touchDebug').append('<br /><span>event type = ' + event.type + ' is event.<br />');								
			$('#touchDebug').append('<span>event type = ' + event.type + '. touch start - x: ' + x + ' y: ' + y + '.</span>');
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
				newPosPx = '0px';
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


