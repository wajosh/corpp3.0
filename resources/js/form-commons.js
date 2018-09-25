/**
 * Global js variables here related to form-commons.
 */
var skipLoadingScreen = false;
var unsavedDataWarningMsgFormFlag = null; // flag for unsaved data warning message.
var unsavedDataWarningMsgTargetEvent = null; // holds the target event. target even can be a javascript function of url.
var unsavedDataWarningMsgProceedFlag = false; // flag that will determine if allowed to proceed to target event.

$(document).ready(function() {
	showLoadingScreen(); // this function MUST come first
	initReadOnlyForm();
	
	// any link with mailto href, do not show loading screen
	$("a[href^=mailto]").on("click",function() {
		skipLoadingScreen = true;
	})
});

/**
 * Ajax start global handler.
 */
$(document).ajaxStart(function(e) {
	showLoadingScreen();
});

/**
 * Ajax complete global handler.
 */
$(document).ajaxComplete(function(e) {
	hideLoadingScreen();
});

/**
 * Ajax before send global handler.
 */
$(document).ajaxSend(function(event, request, settings) {
	if (settings.type == 'POST') {
		var attrName = $("input[name^='CSRFToken']").attr("name");
		var val = $("input[name^='CSRFToken']").val();
		var typeOf = typeof settings.data;
		if (typeOf == "object") {
			settings.data.append(attrName, val);
		} else if (typeOf == "string") {
			if (settings.data.indexOf(attrName) == -1) {
				settings.data += "&" + attrName + "=" + val;
			}
		}
	}
});

/**
 * Window load global handler.
 */
$(window).load(function() {
	CPUnsavedDataWarningMsg.clearReferenceData();
	hideLoadingScreen();
});

/**
 * Window before unload global handler.
 */
$(window).on("beforeunload", function() {
	if (!skipLoadingScreen) {
		showLoadingScreen();
	}
	skipLoadingScreen = false; // set to default value
});
/*******************************************************************************
 * Loading Screen Start
 ******************************************************************************/
/**
 * Handler for showing the loading screen.
 */
function showLoadingScreen(delay) {
	if (delay === undefined || delay === "")
		$("#loadingScreenWrapper").fadeIn();
	else
		$("#loadingScreenWrapper").fadeIn(delay);
}

/**
 * Handler for hiding the loading screen.
 */
function hideLoadingScreen(delay) {
	if (delay === undefined || delay === "")
		$("#loadingScreenWrapper").fadeOut(1000);
	else
		$("#loadingScreenWrapper").fadeOut(delay);
}
/*******************************************************************************
 * Loading Screen End
 ******************************************************************************/

/*******************************************************************************
 * Common Navigation Start
 ******************************************************************************/
/**
 * Method that will redirect the page to EAI Homepage.
 */
function toHomePage() {
	window.location = eaiHomePage;
}

function toSingpassLogoutPage() {
	window.location = singpassLogoutPage;
}
/**
 * Method that will redirect the page to CorpPass Profile Landing Page.
 */
function toCorppassProfileLandingPage() {
	window.location = corppassProfileLandingPage;
}

/**
 * Method that will redirect the current page to a target url.
 * 
 * @param targetUrl
 */
function redirectToTargetUrl(targetUrl) {
	window.location = targetUrl;
}

/**
 * Method that will send a POST request with parameters to the server.
 * 
 * @param action
 * @param params
 */
function doPostRequest(action, params) {
	var form = $("<form/>", {method: "POST", action: action});
	// populate the params
	for (var key in params) {
		if (params.hasOwnProperty(key)) {
			var hiddenField = $("<input/>", {type: "hidden", name: key, value: params[key]});
			form.append(hiddenField);
			var attrName = $("input[name^='CSRFToken']").attr("name");
			var val = $("input[name^='CSRFToken']").val();
			var hiddenField = $("<input/>", {type: "hidden", name: attrName, value: val});
			form.append(hiddenField);
		}
	}
	// append form in document body
	$(document.body).append(form);
	form.submit();
}
/*******************************************************************************
 * Common Navigation End
 ******************************************************************************/


/*******************************************************************************
 * Unsaved Data Warning Message Functionality Start
 ******************************************************************************/
var CPUnsavedDataWarningMsg = (function() {
	/**
	 * Constructor.
	 */
	function CPUnsavedDataWarningMsg() {}
	/**
	 * Method that will initialize the warning message if there are unsaved data on
	 * the form.
	 * 
	 * @param formId -
	 *            the id of the form (required).
	 * @param processHasSteps -
	 *            is an indicator that process has steps. Value for this param must
	 *            be true or false (optional).
	 * @param step -
	 *            is an indicator of the current step. Process must start with
	 *            value 'first' and must end with value 'last'. Any step excluding
	 *            'first' and 'last' can have any value as long as its unique
	 *            (required if param processHasSteps is provided).
	 */
	CPUnsavedDataWarningMsg.prototype.initialize = function(formId, processHasSteps, step) {
		var form = $("#"+formId);
		var formData = getUnsavedFormData(form);

		if (processHasSteps === undefined || 
				processHasSteps === false || 
					(processHasSteps === true && step === "first")) {
			var temp = JSON.parse(sessionStorage.getItem("unsavedDataWarningMsgObj"));
			if (temp != null && 
					temp.doClearData === false &&
						(document.referrer.endsWith(window.location.pathname) || 
							document.referrer.endsWith(temp.previousPage))) {
				temp.step = step;
				sessionStorage.setItem("unsavedDataWarningMsgObj", JSON.stringify(temp));
				unsavedDataWarningMsgFormFlag = temp.formData;
			} else {
				// start of the process, initialize values
				temp = {formData: formData, previousPage: window.location.pathname, step: step, doClearData: false};
				sessionStorage.setItem("unsavedDataWarningMsgObj", JSON.stringify(temp));
				unsavedDataWarningMsgFormFlag = formData;
			}
		} else {
			var temp = JSON.parse(sessionStorage.getItem("unsavedDataWarningMsgObj"));
			if (temp != null) {
				temp.step = step;
				temp.previousPage = window.location.pathname;
				sessionStorage.setItem("unsavedDataWarningMsgObj", JSON.stringify(temp));
			}
		}

		$("a").on("click", function(e) {
			var linkHref = $(this).attr("href");
			if (e.target.tagName.toLowerCase() !== "a") {
				// check if target tagname is not an anchor
				return true;
			} else if (typeof e.target.href === "undefined" || linkHref === "" || linkHref.startsWith("#")) {
				return false;
			} else if (unsavedDataWarningMsgProceedFlag || ($("#selectedIndexes").length != 0 && $("#selectedIndexes").val() === "")) {
				unsavedDataWarningMsgProceedFlag = false; // reset the value to null and proceed to target event
			} else {
				if ((unsavedDataWarningMsgFormFlag != null && 
						unsavedDataWarningMsgFormFlag != getUnsavedFormData(form)) 
							|| (processHasSteps === true && step !== "first")) {
					if (e.preventDefault)
						e.preventDefault();
					
					if ($(this).attr("href") != "")
						unsavedDataWarningMsgTargetEvent = $(this);
					else
						return false;
					
					var formId = form.attr("id");
					var errorWrapperDiv = $("<div/>", {class: "page-error-notification-wrapper"});
					var warningIconDiv = $("<div/>", {class: "icon-img-error hidden-xs"});
					var clearFixDiv = $("<div/>", {class: "clearfix"});
					var warningTitle = $("<div/>", {text: "Are you sure you want to navigate away from this page?", class: "common-error-page-title"});
					var warningMsg = $("<div/>", {text: "Changes will not be saved. Proceed to leave this page?", class: "common-error-page-title-description"});
					var goLink = $("<a/>", {href: "javascript:CPUnsavedDataWarningMsg.navigateToTargetUrl()", text: "Yes", class: "link-label-normal"});
					var stayLink = $("<a/>", {href: "javascript:CPUnsavedDataWarningMsg.clearWarningMsg('" + formId + "')", text: "No", class: "link-label-normal"});
					
					warningMsg.append("&nbsp;");
					warningMsg.append(goLink);
					warningMsg.append("&nbsp;&#47;&nbsp;");
					warningMsg.append(stayLink);
					
					errorWrapperDiv.append(warningIconDiv);
					errorWrapperDiv.append(warningTitle);
					errorWrapperDiv.append(warningMsg);
					errorWrapperDiv.append(clearFixDiv);

					showUnsavedDataWarningMsg(formId, errorWrapperDiv);
				} else {
					// no data changed, can clear the data
					var temp = JSON.parse(sessionStorage.getItem("unsavedDataWarningMsgObj"));
					temp.doClearData = true;
					sessionStorage.setItem("unsavedDataWarningMsgObj", JSON.stringify(temp));
				}
			}
		});
		
		form.on("submit", function(e) {
			unsavedDataWarningMsgFormFlag = null; // reset the value to null
			unsavedDataWarningMsgTargetEvent = null; // reset the value to null
			unsavedDataWarningMsgProceedFlag = false; // reset the value to null
		});
	};
	/**
	 * Method that will navigate to target url.
	 */
	CPUnsavedDataWarningMsg.prototype.navigateToTargetUrl = function() {
		sessionStorage.removeItem("unsavedDataWarningMsgObj");
		unsavedDataWarningMsgFormFlag = null; // reset the value to null
		unsavedDataWarningMsgProceedFlag = true;
		unsavedDataWarningMsgTargetEvent[0].click();
	};
	/**
	 * Method that will clear the warning message.
	 */
	CPUnsavedDataWarningMsg.prototype.clearWarningMsg = function(formId) {
		// clear error/warning notification
		if ($("#" + formId + " > #unsavedDataWarningMsgDiv").length) {
			$("#" + formId + " > #unsavedDataWarningMsgDiv").empty();
			$("#" + formId + " > #unsavedDataWarningMsgDiv").hide();
		}
	};
	/**
	 * Method that will clear data reference for unsaved data warning msg.
	 */
	CPUnsavedDataWarningMsg.prototype.clearReferenceData = function() {
		var tempObj = JSON.parse(sessionStorage.getItem("unsavedDataWarningMsgObj"));
		if (tempObj != null) {
			if (tempObj.step === "first" && tempObj.doClearData) {
				// when user did not start the process and navigate away
				sessionStorage.removeItem("unsavedDataWarningMsgObj");
			} else if (tempObj.step === "last" && window.location.pathname !== tempObj.previousPage) {
				// when user finished the process
				sessionStorage.removeItem("unsavedDataWarningMsgObj");
			}
		}
	};
	/**
	 * Helper method that get the form data.
	 */
	getUnsavedFormData = function(form) {
		var formData = form.serialize();
		if (formData.indexOf("&CSRFToken") == -1) {
			return formData;
		} else {
			return formData.substring(0, formData.indexOf("&CSRFToken"));
		}
	};
	/**
	 * Method that will show the warning message.
	 */
	showUnsavedDataWarningMsg = function(formId, errorWrapperDiv){
		if ($("#" + formId + " > #unsavedDataWarningMsgDiv").length) {
			$("#" + formId + " > #unsavedDataWarningMsgDiv").empty();
			$("#" + formId + " > #unsavedDataWarningMsgDiv").append(errorWrapperDiv);
			$("#" + formId + " > #unsavedDataWarningMsgDiv").show();
			$("body, html").scrollTop($("#" + formId + " > #unsavedDataWarningMsgDiv").offset().top);
		} else {
			var parentDiv = $("<div/>", {id: "unsavedDataWarningMsgDiv"});
			parentDiv.append(errorWrapperDiv);
			$("#" + formId).prepend(parentDiv);
		}
	};
	
	return new CPUnsavedDataWarningMsg();
}());
/*******************************************************************************
 * Unsaved Data Warning Message Functionality End
 ******************************************************************************/


/*******************************************************************************
 * Tooltip Start
 ******************************************************************************/
/**
 * Method that will initialize the tooltips.
 */
function initTooltips() {
	$('.pop').popover({
		html: true,
		placement: 'top'
	});
	// show 1 popover and hide the rest
	$('.pop').on('click', function (e) {
		e.preventDefault(); // to stop the jump when clicking
		$('.pop').not(this).popover('hide');
	});
	// hide popover when user click anywhere
	$('body').on('click', function (e) {
		$('.pop').each(function () {
			//the 'is' for buttons that trigger popups
			//the 'has' for icons within a button that triggers a popup
			if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
				$(this).popover('hide');
			}
		});
	});
}
/*******************************************************************************
 * Tooltip End
 ******************************************************************************/


/*******************************************************************************
 * Disable Form Elements Start
 ******************************************************************************/
/**
 * Method that will disable the form fields depending on the logged-in user type.
 */
function initReadOnlyForm() {
	// check first if loggedInUserType is valid
	if (loggedInUserType !== "") {
		var key = "'"+loggedInUserType+"'";
		$("form [data-readonly-users]").each(function() {
			var attributeVal = $(this).attr("data-readonly-users");
			if (attributeVal.indexOf(key) != -1) {
				if ($(this).is("a")) {
					$(this).addClass("link-disabled");
					$(this)[0].onclick = null;
				} else if($(this).is("button")) {
					$(this).hide(); // if button, hide it instead of disabling
				} else {
					$(this).prop("disabled", true);
				}
			}
		});
	}
}
/*******************************************************************************
 * Disable Form Elements End
 ******************************************************************************/

/*******************************************************************************
 * Data Downloader Start
 ******************************************************************************/
/**
 * Object for downloading data.
 */
var CPDataDownloader = (function() {
	/**
	 * Constructor.
	 */
	function CPDataDownloader() {}
	/**
	 * Method that will handle data download.
	 * 
	 * @param downloadUrl
	 */
	CPDataDownloader.prototype.doDownload = function(downloadUrl) {
		skipLoadingScreen = true;
		window.location = downloadUrl;
	};
	
	return new CPDataDownloader();
}());
/*******************************************************************************
 * Data Downloader End
 ******************************************************************************/


/*******************************************************************************
 * Announcement Start
 ******************************************************************************/
/**
 * Method that will close the announcements.
 */
function closeAnnouncement(controllerurl) {
	$(".announcement-stripe-wrapper").hide();
	$.ajax({
		type: "GET",
		url: controllerurl,
		success: function(data) {}
	});
 }
/*******************************************************************************
 * Announcement End
 ******************************************************************************/


/*******************************************************************************
 *  Toggel Selecetd User Div Start
 ******************************************************************************/
function initAccordion() {
	var iconOpen = 'fa fa-minus', iconClose = 'fa fa-plus';
	$(document).on('show.bs.collapse hide.bs.collapse', '.accordion', function(e) {
		var $target = $(e.target);
		$target.siblings('.accordion-heading').find('em').toggleClass(iconOpen + ' ' + iconClose);
		if (e.type == 'show')
			$target.prev('.accordion-heading').find('.accordion-toggle').addClass('active');
		if (e.type == 'hide')
			$(this).find('.accordion-toggle').not($target).removeClass('active');
	});
}
/*******************************************************************************
 *  Toggel Selecetd User Div End
 ******************************************************************************/