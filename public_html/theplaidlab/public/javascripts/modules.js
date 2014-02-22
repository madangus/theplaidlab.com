
/*
*	Well we have 1 developer right now :) Going for the nested object literal since it's good simple organization and global abatement.
*	For my own amusement, I'l probably make slideshow a jquery based plugin fairly soon. 
*/

var thePlaidLabModules = thePlaidLabModules || {};

thePlaidLabModules.slideshow = {
	init: function() {
		//console.log('lets set up the slideshow');
		var rawWidth = $('[data-module="slideshow"] [data-control="stage"]').first().width();
		this.stageWidth = parseInt(rawWidth);
		this.itemsCount = ( $('[data-module="slideshow"] [data-display-item]') ).length;
		//console.log('stage width: ' + this.stageWidth + '. Items ' + this.itemsCount);
		this.currentItem = 1;
		this.stagePos = 0;
		this.registerHandlers();
		this.setupTouchSupport();
		this.displayNav();		
	},
	displayNav: function() {
		if (this.currentItem === 1) {
			$('[data-module="slideshow"] [data-action="backward"]').addClass('hide');
		} else {
			$('[data-module="slideshow"] [data-action="backward"]').removeClass('hide');
		}

		if (this.currentItem === this.itemsCount) {
			$('[data-module="slideshow"] [data-action="forward"]').addClass('hide');
		} else {
			$('[data-module="slideshow"] [data-action="forward"]').removeClass('hide');
		}
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

		if ( $('[data-module="slideshow"] [data-control="navigate"]').length ) {
			$('[data-module="slideshow"]').on('click', '[data-control="navigate"]', function(event) {
				var dir = $(this).attr("data-action");
				if (dir && $(this).css('display') !== 'none') {
					thePlaidLabModules.slideshow.moveStage(dir);
				}
			});
		}
	},
	setupTouchSupport: function() {
		if (typeof document.querySelector === 'function' && 'ontouchmove' in document.documentElement) {
			var target = document.querySelector('[data-module="slideshow"]');
			
			// Set these working vars here so they retain values on multiple handleTouch invocations
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
		var horizontalSwipeMinimum = 50;
		var verticalSwipeMinimum = 50;
		var activeGesture = thePlaidLabModules.slideshow.activeGesture;
		var movesx = thePlaidLabModules.slideshow.movesx;
		var movesy = thePlaidLabModules.slideshow.movesy;
		var endEl = thePlaidLabModules.slideshow.endEl;

		//console.log('handleTouch fires! event.type is ' + event.type);

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
			thePlaidLabModules.slideshow.startEl = event.target;
		}
		
		if (event.type === 'touchmove') {
			if (numTouches === 1 && activeGesture) {
				if ( Math.abs(movesy[0] - y) > verticalSwipeMinimum || Math.abs(y - movesy[0]) > verticalSwipeMinimum ) {
					//console.log('swiping up or down exiting');
					thePlaidLabModules.slideshow.activeGesture = false;
				} else {
					movesx.push(x);
					movesy.push(y);					
					var moveCount = (movesx) ? (movesx.length - 1) : 0;			
					var prevx = movesx[moveCount];
					var prevy = movesy[moveCount];												
					thePlaidLabModules.slideshow.activeGesture = true;

					/*
					*	Nasty little hack follows:
					*	This is because of the following bug - http://code.google.com/p/android/issues/detail?id=19827
					*	There are a few options here...
					*	(a) Try and reproduce vertical scrolling with js - from my initial look it's very hard to reproduce the native bouncey
					*		momentum type scrolling though - so that's out
					*	(b) Just use a graphical click left/right - if this was a high volume commercial site I would probably do this
					*	(c) Browser sniff and show graphical left/right click targets just for android chrome 18
					*
					*	So this is awful, however, calling preventDefault breaks the experience on iOS and stock android browser leaving us to
					*	sniff, reproduce vertical scrolling or go with graphical clickers. Ugghhhh.
					*
					*/

					if ( navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Chrome\/18/i) ) { 
						event.preventDefault();
					}

				}
			} else {
				cleanup();
			}
		}

		if (event.type === 'touchend' && activeGesture) {
			var endMove = (movesx.length - 1);
			var endx = movesx[endMove];
			var swipeType;

			if ( (movesx[0] - endx) > horizontalSwipeMinimum ) {
				swipeType = 'left';
			} else if ( (endx - movesx[0]) > horizontalSwipeMinimum ) {
				swipeType = 'right';
			}

			switch (swipeType) {
				case 'right':
					//console.log('right');
					thePlaidLabModules.slideshow.moveStage('forward');			
					break;

				case 'left':
					//console.log('left');
					thePlaidLabModules.slideshow.moveStage('backward');			
					break;

			}

			if (thePlaidLabModules.slideshow.startEl = event.target) {
				// This was a tap, check to see if it was over the nav arrows
				//console.log(event.target);

			}


			cleanup();
		}

		if (event.type === 'touchcancel') {
			cleanup();
		}

		function cleanup() {
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
		var scrollxPx, scrollx;
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
				scrollx = 0;				
				scrollxPx = '0px';
			} else {
				scrollx = (dir === 'backward') ? this.stagePos - this.stageWidth : this.stagePos + this.stageWidth;
				scrollxPx = '-' + scrollx + 'px';
			}

			//console.log(dir + ' to ' + scrollxPx);
			var $wrapper = $('[data-control="stage"]').find('.itemsWrapper').first(); 
			$wrapper.css("margin-left",scrollxPx);
			this.stagePos = scrollx;
		}

		this.displayNav();

	}


}


