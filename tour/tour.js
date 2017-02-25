var Tour = function(element, options){
	this.element 	= element;
	this.theme 		= $(this.element).attr('class'),
	this.options 	= {
		// progress : (options.progress != undefined ? options.progress : false),
		// intelitip : (options.intelitip != undefined ? options.intelitip : false),
		tipWidth : 300,
	},
	this.currentStep = 0;

	this.init();
}

Tour.prototype.init = function(){
	var self 			= this,
		counter 		= 1,
		windowWidth 	= $(window).width(),
		windowHeight 	= $(window).height();



	$(this.element).find('li').each(function(){
		var $this 			= $(this),
			target 			= $($this.data('target')),
			targetOffset	= target.offset(),
			targetWidth 	= target.outerWidth(true),
			targetHeight 	= target.outerHeight(true);

		if (targetOffset.top < 100) {
			var tipLocation = 'top';
		} else if (targetOffset.top + targetHeight > windowHeight - 100) {
			var tipLocation = 'bottom';
		} else if (targetOffset.left > windowWidth / 2) {
			var tipLocation = 'right';
		} else {
			var tipLocation = 'left';
		}

		if (tipLocation == 'top') {
			var tip = '<div class="tour-step '+tipLocation+' '+self.theme+'" data-step="'+counter+'" style="left:'+targetOffset.left+'px; '+tipLocation+':'+((targetOffset.top + targetHeight) + 15)+'px">'
					+ 		'<div class="tour-tip"></div>'
					+		$this.html()
					+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
					+ '</div>';
		} else if (tipLocation == 'bottom') {
			var tip = '<div class="tour-step '+tipLocation+' '+self.theme+'" data-step="'+counter+'" style="left:'+targetOffset.left+'px; '+tipLocation+':'+((windowHeight - (targetOffset.top + targetHeight)) + (targetHeight + 15))+'px">'
					+ 		'<div class="tour-tip"></div>'
					+		$this.html()
					+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
					+ '</div>';
		} else if (tipLocation == 'left') {
			var tip = '<div class="tour-step '+tipLocation+' '+self.theme+'" data-step="'+counter+'" style="top:'+targetOffset.top+'px; '+tipLocation+':'+(targetOffset.left + targetWidth + 15)+'px">'
					+ 		'<div class="tour-tip"></div>'
					+		$this.html()
					+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
					+ '</div>';
		} else if (tipLocation == 'right') {
			var tip = '<div class="tour-step '+tipLocation+' '+self.theme+'" data-step="'+counter+'" style="top:'+targetOffset.top+'px; '+tipLocation+':'+((windowWidth - targetOffset.left) + 15)+'px">'
					+ 		'<div class="tour-tip"></div>'
					+		$this.html()
					+ 		'<a href="#" class="tour-button">'+$this.data('button')+'</a>'
					+ '</div>';
		}


		

		$('body').append(tip);

		counter++;
	});

	$('.tour-step[data-step="1"]').addClass('current');

	$(this.element).hide();

	this.currentStep = 1;

	$(document).on('click', '.tour-button', function(e){
		e.preventDefault();
		self.next();
	});
}

Tour.prototype.next = function(){
	$('.tour-step.current').removeClass('current');
	$('.tour-step[data-step="'+(this.currentStep + 1)+'"]').addClass('current');
	this.currentStep += 1;
}