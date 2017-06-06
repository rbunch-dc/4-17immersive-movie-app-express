$(document).ready(function(){
	var tallestPoster = 0;
	$('.movies .col-sm-3').each(function(){
		var curElement = $(this);
		if(curElement.height() > tallestPoster){
			tallestPoster = curElement.height();
		}
	});
	$('.movies .col-sm-3').css({
		'height': tallestPoster
	});

});
