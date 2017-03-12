// TO DO LIST
// - Add expose layer and possibly an extra option on the tip to remove the next button to force people to click the target element

// - Optimize code (ongoing)



var Tour = function(element, options){
	if ($('.tour-step.current').length != 0) {
		return false;
	}
	this.element 		= element;
	this.currentStep 	= 0,
	this.lastStep	 	= 0,
	this.windowWidth 	= $(window).width(),
	this.windowHeight 	= $(window).height(),

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
			} else if (targetOffset.top + targetHeight > self.windowHeight - 100) {
				var tipLocation = 'bottom';
			} else if (targetOffset.left > self.windowWidth / 2) {
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
				var tip = '<div class="tour-step '+tipLocation+' '+self.settings.theme+'" data-target="'+target+'" data-step="'+counter+'" style="left:'+targetOffset.left+'px; '+tipLocation+':'+((self.windowHeight - (targetOffset.top + targetHeight)) + (targetHeight + 15))+'px">'
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
				var tip = '<div class="tour-step '+tipLocation+' '+self.settings.theme+'" data-target="'+target+'" data-step="'+counter+'" style="top:'+targetOffset.top+'px; '+tipLocation+':'+((self.windowWidth - targetOffset.left) + 15)+'px">'
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
	};

	// Set the current step
	$('.tour-step[data-step="1"]').addClass('current');

	// Set the current step
	this.currentStep = 1;

	// Remove any previous click binding on the tour buttons to avoid calling the click event multiple times
	$(document).off('click', '.tour-button');
	$(document).on('click', '.tour-button', function(e){
		e.preventDefault();
		self.next();
	});
};

// Method for repositioning the tour tips when the DOM elements change e.g browser resize
Tour.prototype.positionTips = function(){
	var self 	= this,
		counter = 1;

	// TODO - Need to check if the tip is still on the screen and if not scale and possibly re-position it.

	$('.tour-step').each(function(){
		var $this 			= $(this),
			target 			= $this.data('target');
			targetOffset	= $(target).offset(),
			targetWidth 	= $(target).outerWidth(true),
			targetHeight 	= $(target).outerHeight(true);

		if (targetOffset.top < 100) {
			var tipLocation = 'top';
		} else if (targetOffset.top + targetHeight > self.windowHeight - 100) {
			var tipLocation = 'bottom';
		} else if (targetOffset.left > self.windowWidth / 2) {
			var tipLocation = 'right';
		} else {
			var tipLocation = 'left';
		};

		if (tipLocation == 'top') {
			$this.css({left:targetOffset.left,tipLocation:((targetOffset.top + targetHeight) + 15)});
		} else if (tipLocation == 'bottom') {
			$this.css({left:targetOffset.left,tipLocation:((self.windowHeight - (targetOffset.top + targetHeight)) + (targetHeight + 15))});
		} else if (tipLocation == 'left') {
			$this.css({top:targetOffset.top,tipLocation:(targetOffset.left + targetWidth + 15)});
		} else if (tipLocation == 'right') {
			$this.css({top:targetOffset.top,tipLocation:((self.windowWidth - targetOffset.left) + 15)});
		};

		counter++;
	});	
};

// Method for updating the attributes and managing methods needed to be called when something changes e.g. browser resize
Tour.prototype.update = function(){
	this.windowWidth 	= $(window).width(),
	this.windowHeight 	= $(window).height();

	this.positionTips();
};

// Method for showing the next tip
Tour.prototype.next = function(){
	if (this.currentStep == this.lastStep) {
		this.destroy();
	} else {
		$('.tour-step.current').removeClass('current');
		$('.tour-step[data-step="'+(this.currentStep + 1)+'"]').addClass('current');
		this.currentStep += 1;
	};
};

// Method to destroy the current tour, also called when you've finished the tour
Tour.prototype.destroy = function(){
	$('.tour-step, .tour-expose').remove();
};