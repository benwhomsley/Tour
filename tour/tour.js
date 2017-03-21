// TO DO LIST
// - Need to check if the tip is still on the screen and if not scale and possibly re-position it - inside positionTips method.
// - Optimize code (ongoing)



var Tour = function(element, options){
	if ($('.tour-step.current').length != 0) {
		return false;
	}
	this.element 		= element;
	this.currentStep 	= 0,
	this.lastStep	 	= 0,
	this.bodyWidth 		= $('body').width(),
	this.bodyHeight 	= $('body').height(),

	// Default options
	this.defaults 		= {
		theme 			: 'light',
		progress 		: false,
		intelitip 		: false,
		tipWidth 		: 300,
		expose 			: false,
	};

	// Override default settings with user defined
	this.settings = $.extend(this.defaults, options);

	this.init();

	// Hide the original tour
	$(this.element).hide();
};

// Method triggered when the tour is created to build the tour tips
Tour.prototype.init = function(){
	var self 	= this,
		counter = 1;

	// Bind the update function to the browser resize
	$(window).on('resize', function(){
		self.update();
	});

	$(this.element).find('li').each(function(){
		var $this 	= $(this),
			target 	= $this.data('target');

		if ($(target).length != 0) {
			var targetOffset 	= $(target).offset(),
				targetWidth		= $(target).outerWidth(true),
				targetHeight 	= $(target).outerHeight(true),
				progress 		= (self.settings.progress ? '<div class="tour-progress"><span class="current">'+counter+'</span> of <span class="total"></span></div>' : '');

			if (targetOffset.top < 100) {
				var tipLocation = 'top';
			} else if (targetOffset.top + targetHeight > self.bodyHeight - 100) {
				var tipLocation = 'bottom';
			} else if (targetOffset.left > self.bodyWidth / 2) {
				var tipLocation = 'right';
			} else {
				var tipLocation = 'left';
			}

			if (tipLocation == 'top') {
				var tip = '<div class="tour-step '+tipLocation+' '+self.settings.theme+'" data-target="'+target+'" data-step="'+counter+'" style="left:'+targetOffset.left+'px; '+tipLocation+':'+((targetOffset.top + targetHeight) + 15)+'px">'
						+ 		'<div class="tour-tip"></div>'
						+		$this.html()
						+		progress
						+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
						+ '</div>';
			} else if (tipLocation == 'bottom') {
				var tip = '<div class="tour-step '+tipLocation+' '+self.settings.theme+'" data-target="'+target+'" data-step="'+counter+'" style="left:'+targetOffset.left+'px; '+tipLocation+':'+((self.bodyHeight - (targetOffset.top + targetHeight)) + (targetHeight + 15))+'px">'
						+ 		'<div class="tour-tip"></div>'
						+		$this.html()
						+		progress
						+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
						+ '</div>';
			} else if (tipLocation == 'left') {
				var tip = '<div class="tour-step '+tipLocation+' '+self.settings.theme+'" data-target="'+target+'" data-step="'+counter+'" style="top:'+targetOffset.top+'px; '+tipLocation+':'+(targetOffset.left + targetWidth + 15)+'px">'
						+ 		'<div class="tour-tip"></div>'
						+		$this.html()
						+		progress
						+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
						+ '</div>';
			} else if (tipLocation == 'right') {
				var tip = '<div class="tour-step '+tipLocation+' '+self.settings.theme+'" data-target="'+target+'" data-step="'+counter+'" style="top:'+targetOffset.top+'px; '+tipLocation+':'+((self.bodyWidth - targetOffset.left) + 15)+'px">'
						+ 		'<div class="tour-tip"></div>'
						+		$this.html()
						+		progress
						+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
						+ '</div>';
			}

			$('body').append(tip);
			counter++;
		};

		// Update the last step attribute
		self.lastStep = counter-1;

		// Set the total number of steps after all steps have been built
		$('.tour-progress .total').html(counter-1);

	});

	if (self.settings.expose == true) {
		$('body').append('<div class="tour-expose '+self.settings.theme+'"></div>');
		$($('.tour-step[data-step="1"]').attr('data-target')).addClass('tip-expose');
	};

	// Set the current step
	$('.tour-step[data-step="1"]').addClass('current');

	$('html, body').animate({scrollTop:$('.tour-step[data-step="1"]').offset().top - 100}, 400);

	// Set the current step
	self.currentStep = 1;

	// Bind events
	$(document).on('click', '.tour-button', function(e){
		e.preventDefault();
		self.next();
	}).on('keydown', function(e){
		var key = e.which || e.keyCode || 0;
		switch(key){
			case 13 :
				e.preventDefault();
				self.next();
				break;
			case 27 :
				e.preventDefault();
				self.destroy();
				break;
			default :
				break;
		}
	});
};

// Method for repositioning the tour tips when the DOM elements change e.g browser resize
Tour.prototype.positionTips = function(){
	var self 	= this,
		counter = 1;

	$('.tour-step').each(function(){
		var $this 			= $(this),
			target 			= $this.data('target');
			targetOffset	= $(target).offset(),
			targetWidth 	= $(target).outerWidth(true),
			targetHeight 	= $(target).outerHeight(true);

		if (targetOffset.top < 100) {
			var tipLocation = 'top';
		} else if (targetOffset.top + targetHeight > self.bodyHeight - 100) {
			var tipLocation = 'bottom';
		} else if (targetOffset.left > self.bodyWidth / 2) {
			var tipLocation = 'right';
		} else {
			var tipLocation = 'left';
		}

		if (tipLocation == 'top') {
			$this.css({left:targetOffset.left,tipLocation:((targetOffset.top + targetHeight) + 15)});
		} else if (tipLocation == 'bottom') {
			$this.css({left:targetOffset.left,tipLocation:((self.bodyHeight - (targetOffset.top + targetHeight)) + (targetHeight + 15))});
		} else if (tipLocation == 'left') {
			$this.css({top:targetOffset.top,tipLocation:(targetOffset.left + targetWidth + 15)});
		} else if (tipLocation == 'right') {
			$this.css({top:targetOffset.top,tipLocation:((self.bodyWidth - targetOffset.left) + 15)});
		}

		counter++;
	});	
};

// Method for updating the attributes and managing methods needed to be called when something changes e.g. browser resize
Tour.prototype.update = function(){
	this.bodyWidth 		= $('body').width(),
	this.bodyHeight 	= $('body').height();

	this.positionTips();
};

// Method for showing the next tip
Tour.prototype.next = function(){
	var currentPost = $('.tour-step.current');
	$(currentPost.attr('data-target')).removeClass('tip-expose');

	if (this.currentStep == this.lastStep) {
		this.destroy();
	} else {
		var nextPost = $('.tour-step[data-step="'+(this.currentStep + 1)+'"]');

		currentPost.removeClass('current');
		nextPost.addClass('current');
		if (this.settings.expose == true) {
			$(nextPost.attr('data-target')).addClass('tip-expose');
		}
		this.currentStep += 1;
    	$('html, body').animate({scrollTop:nextPost.offset().top - 100}, 400);
	}

};

// Method to destroy the current tour, also called when you've finished the tour
Tour.prototype.destroy = function(){
	// Unbind events
	$(document).off('click', '.tour-button');
	$(document).off('keydown');
	// Remove tour elements
	$('.tour-step, .tour-expose').remove();
};