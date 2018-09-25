$(document).ready(function() {

	initializeCustomInputTag();
	initializeCustomCaptchaTag();
	initializeCustomCalendarTag();
	initializeCustomPasswordTag();
	initializeCustomTagTooltip();
});

/**
 * initialize the tooltip for the custom tags.
 */
function initializeCustomTagTooltip() {
	$('.custom-tag-tooltip').popover({
		html: true,
		placement: 'top',
		content: function() {
			return $(this).next('.custom-tag-popover-content').html();
		}
	});
	
	// show 1 popover and hide the rest
	$('.custom-tag-tooltip').on('click', function (e) {
		e.preventDefault(); // to stop the jump when clicking
		$('.custom-tag-tooltip').not(this).popover('hide');
	});
	
	// hide popover when user click anywhere
	$('body').on('click', function (e) {
		$('.custom-tag-tooltip').each(function () {
			//the 'is' for buttons that trigger popups
			//the 'has' for icons within a button that triggers a popup
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				$(this).popover('hide');
			}
		});
	});
}

/**
 * initialize input tag.
 */
function initializeCustomInputTag() {
	// customg tag handler for CAPS config
	$(".custom-tag-to-uppercase").on("change", function (e) {
		$(this).val($(this).val().toUpperCase());
	});
	
	// customg tag handler for numeric fields
	$(".custom-tag-numeric-field").on("keydown", function(e) {
		var charCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (charCode === 37 || charCode === 38 || charCode === 39 || charCode === 40 || charCode === 46 || e.ctrlKey) {
			return true; // for arrow keys, delete key and cntrl key
		} else if (e.shiftKey) {
			return false; // user pressed the shift key
		} else if (charCode <= 31 || (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)) {
			return true; // for numeric character and ascii char from 1 to 31
		} else {
			return false; 
		}
	});
}

/**
 * initialize captcha tag.
 */
function initializeCustomCaptchaTag() {
	// custom tag handler for generating captcha string.
	$(".custom-tag-captcha-btn").on("click", function (e) {
		var captchaStrImgElmt = $(this).prev(".custom-tag-captcha-str");
		captchaStrImgElmt.attr("src", $(this).attr("captcha-src-url") + "?rnd=" + Math.random());
	});
}

/**
 * initialize calendar tag.
 */
function initializeCustomCalendarTag() {
	$(".custom-tag-datePickerNormalDate").datepicker({
		showOn : "button",
		buttonImageOnly : true,
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true,
		yearRange : "1900:" + new Date().getFullYear()
	});
	
	$(".custom-tag-datePickerPastDate").datepicker({
		showOn : "button",
		buttonImageOnly : true,
		maxDate : new Date(),
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true,
		yearRange : "1900:" + new Date().getFullYear()
	});
	
	$(".custom-tag-datePickerFutureDate").datepicker({
		showOn : "button",
		buttonImageOnly : true,
		minDate : new Date(),
		buttonText : "",
		"dateFormat" : "dd/mm/yy",
		changeMonth : true,
		changeYear : true
	});

	// IE UI fix
	$("input[class*='custom-tag-datePicker']").next().addClass("hide");

	// custom tag handler for date picker
	$(".custom-tag-cal-btn").on("click", function (e) {
		var calInput = $(this).prevAll(".custom-tag-cal-field").first();
		if (calInput.datepicker("widget" ).is(":visible"))
			calInput.datepicker("hide");
		else
			calInput.datepicker("show");
	});
}

/**
 * initialize password tag.
 */
function initializeCustomPasswordTag() {
	// init password field
	$('.custom-tag-pwd-complexity-checker').each(function () {
		var passwordField = $(this);
		var baseElmnt = passwordField.siblings('.password-complexity-checker');
		if (baseElmnt.length) {
			var validationElmnt = baseElmnt.children('.password-info');
			var pswdValidationCriteria = {
				length: {
					$el: validationElmnt.find('#password-length'),
					validate: function(value) {
						return value.length >= 8;
					}
				},
				aplhabets: {
					$el: validationElmnt.find('#password-alphabet'),
					validate: function(value) {
						return value.match(/[a-zA-Z]/);
					}
				},
				numeric: {
					$el: validationElmnt.find('#password-number'),
					validate: function(value) {
						return value.match(/[\d]/);
					}
				},
				specialChars: {
					$el: validationElmnt.find('#password-special'),
					validate: function(value) {
						return value.match(/[!@#$&%=_?]/);
					}
				}
			};

			$(this).keyup(function(e) {
				var pswdComplex = $(this).val();
				var valCriteria = null;
				var criteria = null;
				var isValid = true;

				if (e.which !== 9) {
					for (criteria in pswdValidationCriteria) {
						if (pswdValidationCriteria.hasOwnProperty(criteria)) {
							valCriteria = pswdValidationCriteria[criteria];
							if (valCriteria.validate(pswdComplex)) {
								valCriteria.$el.removeClass('t-form-error').addClass('t-form-success');
							} else {
								valCriteria.$el.removeClass('t-form-success').addClass('t-form-error');
								if (criteria != 'specialChars') {
									isValid = false;
								}
							}
						}
					}

					if (isValid) {
						validationElmnt.addClass('is-hidden');
						passwordField.removeClass('password-error');
					} else {
						validationElmnt.removeClass('is-hidden');
						passwordField.addClass('password-error');
					}
				}
			});
			
			$(this).on("focus", function(e) {
				e.preventDefault();
				validationElmnt.removeClass('is-hidden');
			});

			$(this).on("blur", function(e) {
				e.preventDefault();
				validationElmnt.addClass('is-hidden');
			});
		}
	});
}