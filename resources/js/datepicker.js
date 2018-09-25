$( document ).ready(function() {
	// datePicker
	$(".datePickerNoLateThan15start").datepicker({
		showOn : "both",
		//buttonImage : "../resources/assets/img/calendar.png",
		buttonImageOnly : true,
		maxDate : new Date(),
		minDate : new Date(new Date().setMonth(new Date().getMonth() - 15)),
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true
	});
	
	$(".datePickerNoLateThan15end").datepicker({
		showOn : "both",
		//buttonImage : "../resources/assets/img/calendar.png",
		buttonImageOnly : true,
		maxDate : new Date(),
		minDate : new Date(new Date().setMonth(new Date().getMonth() - 15)),
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true
	});
	
	$(".datePickerNoFuture").datepicker({
		showOn : "button",
		buttonImageOnly : true,
		maxDate : new Date(),
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true,
		yearRange : "1900:" + new Date().getFullYear()
	});
	
	$(".datePickerFutureDate").datepicker({
		showOn : "button",
		//buttonImage : "../resources/assets/img/calendar.png",
		buttonImageOnly : true,
		minDate : new Date(),
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true
	});
	
	$(".datePicker").datepicker({
		showOn : "both",
		//buttonImage : "../resources/assets/img/calendar.png",
		buttonImageOnly : true,
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true,
		yearRange : "1900:" + new Date().getFullYear()
	});
	
	$(".datePickerPairStart").datepicker({
		showOn : "both",
		//buttonImage : "../resources/assets/img/calendar.png",
		buttonImageOnly : true,
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true,
		minDate : new Date(),
		onSelect : function(selected) {
			$('.datePickerPairEnd').datepicker("option", "minDate", selected);
		}
	});
	
	$(".datePickerPairEnd").datepicker({
		showOn : "both",
		//buttonImage : "../resources/assets/img/calendar.png",
		buttonImageOnly : true,
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true,
		minDate : new Date()
	});
	
	$(".datePicker.pastDatesAndToday" ).datepicker( 'option', 'maxDate', new Date() );

});