$(document).ready(function() {
	var page = $('#pageNumber').val();
	if(page == '1'){
		$('#email').bind("cut copy paste", function(e) {
			e.preventDefault();
		});
		$('#confirmEmail').bind("cut copy paste", function(e) {
			e.preventDefault();
		});
		
		$('#password').bind("cut copy paste", function(e) {
	  		e.preventDefault();
		});
		$('#confirmPassword').bind("cut copy paste", function(e) {
	  		e.preventDefault();
		});
		
		// init regnum field for UEN registration
		initializeRegistrationNumField();
		
		$("input[name=methodOfApproval]").on("change", function() {
			displayROAuthorizationOption($(this).val());
		});
		if(!isUENRegistration) {
			$("select[name=countryOfIncorporation]").on("change", function() {
				displayAddress();
			});
		}
	}
});

function displayAddress(){
	var country = $('option:selected', $('#countryOfIncorporation')).text()
	if (country == 'Singapore') {
		$('#option-local-wrapper').show();
		$('#option-foreign-wrapper').hide();
	} else {
		$('#option-local-wrapper').hide();
		$('#option-foreign-wrapper').show();
	}
}

/**
 * Check necessary data before submitting the form.
 */
function formSubmit(actionRegistration) {
	var nric = $("#cpaIdentityNumber").val();
	var cpId = $("#corppassId").val();
	var passwordInputVal = $("#password").val();
	var confirmPasswordInputVal = $('#confirmPassword').val();
	var errorObj = validatePasswordVal(passwordInputVal, confirmPasswordInputVal, nric, cpId, blackListedHashedPassword);

	if (errorObj.passwordErrorCode == null && errorObj.confirmPasswordErrorCode == null) {
		var exponent = "10001";
		var rsaBlock = encryptSetPwdNoVerifyNoUserRSABlock512(exponent, publicKey, passwordInputVal, randomNumber1);
		$("#rsaBlock").val(rsaBlock);
		$("#passwordErrorCode").val("");
		$("#confirmPasswordErrorCode").val("");
	} else {
		$("#passwordErrorCode").val(errorObj.passwordErrorCode);
		$("#confirmPasswordErrorCode").val(errorObj.confirmPasswordErrorCode);
	}
	$("#password").val(""); // set to empty for security purposes
	$('#confirmPassword').val(""); // set to empty for security purposes
	if (!(actionRegistration === '' || typeof actionRegistration === 'undefined')){
		$("#registrationForm").action = actionRegistration;
	}
	$("#registrationForm").submit();
}

function clickBack(action){
	var form = $("#registrationForm");
	form.attr("action",action);
	$('#backPage').val(true);
	$('#pageError').val(false);
	form.submit();
}

/**
 * Method that will initialize the Registration Number field for UEN registration.
 */
function initializeRegistrationNumField() {
	
	if (isUENRegistration) {
		// set the autocomplete source of RO registration number
		var uenSource = $("#uniqueEntityNumber").attr("autocomplete-data");
		if (uenSource) {
			$("#uniqueEntityNumber").autocomplete({
				source : JSON.parse(uenSource),
				minLength : 0
			}).focus(function() {
				$(this).autocomplete('search', $(this).val())
			});
			
			// initialize
			if (uenSource.indexOf($("#uniqueEntityNumber").val()) == -1) {
				$("#ro-authorization-wrapper").show();
				$("#isUserRo").val(false);
			} else {
				$("#ro-authorization-wrapper").hide();
				$("#isUserRo").val(true);
			}
			
			$("#uniqueEntityNumber").on("blur", function() {
				// if user is an RO but not using the entity regnum under his name,
				// he will become a CPA instead of an RO
				if (uenSource.indexOf($(this).val()) == -1) {
					$("#ro-authorization-wrapper").show();
					$("#isUserRo").val(false);
				} else {
					$("#ro-authorization-wrapper").hide();
					$("#isUserRo").val(true);
				}
			});
		}
	}
}

/**
 * Handler for uploading registration related documents.
 * 
 * @param documentType
 * @param documentFile
 * @param elementIdPrefix
 */
function uploadRegistrationDocument(documentType, documentFile, elementIdPrefix) {
	var uploadData = new FormData();
	uploadData.append("registrationDocType", documentType);
	uploadData.append("registrationDocFile", documentFile);

	$.ajax({
		url: corppassContextPath + "/registration/uploadregistrationdocument",
		type: "POST",
		data: uploadData,
		dataType : "text",
		processData: false,
		contentType: false,
		success: function(response) {
			var obj = JSON.parse(response);
			if (obj.success) {
				// clear the error msg
				$("#"+elementIdPrefix+"Error").text("");
				// show the file table
				var fileTable = $("#"+elementIdPrefix+"Table");
				if (!fileTable.is(":visible")) {
					fileTable.show();
				}
				// append a row
				var data = obj.data.split(":");
				var filenameCol = "<td class='id-uploaded-file'><a href='javascript:downloadRegistrationDocument(\"" + documentType + "\", " + data[1] + ");'>" + data[0] + "</a></td>";
				var actionCol = "<td><span class='icon-reject' onclick='removeRegistrationDocument(\"" + documentType + "\", " + data[1] + ",\"" + elementIdPrefix + "\")'></span></td>";
				var row = "<tr>" + filenameCol + actionCol + "</tr>"
				$("#"+elementIdPrefix+"Table").append(row);
				$("#"+elementIdPrefix+"Id").text("");//Clear the Spring Error from Busines Layer
			} else {
				$("#"+elementIdPrefix+"Id").text("");//Clear the Spring Error from Busines Layer
				$("#"+elementIdPrefix+"Error").text(obj.data);
			}
		}
	});
}

/**
 * Handler for removing uploaded registration related documents.
 * 
 * @param documentType
 * @param idx
 * @param elementIdPrefix
 */
function removeRegistrationDocument(documentType, idx, elementIdPrefix){
	$.ajax({
		url: corppassContextPath + "/registration/removeregistrationdocument",
		type: "POST",
		data: {
			registrationDocType : documentType,
			registrationDocIdx : idx
		},
		dataType : "json",
		success: function(response) {
			var obj = response;
			if (obj.success) {
				// clear the error msg
				$("#"+elementIdPrefix+"Error").text("");
				$("#"+elementIdPrefix+"Table > tbody").html("");
				// redraw the table
				var dataArray = obj.data;
				var resLength = dataArray.length;
				for (var i = 0; i < resLength; i++) {
					var data = dataArray[i].split(":");
					var filenameCol = "<td class='id-uploaded-file'><a href='javascript:downloadRegistrationDocument(\"" + documentType + "\", " + data[1] + ");'>" + data[0] + "</a></td>";
					var actionCol = "<td><span class='icon-reject' onclick='removeRegistrationDocument(\"" + documentType + "\", " + data[1] + ",\"" + elementIdPrefix + "\")'></span></td>";
					var row = "<tr>" + filenameCol + actionCol + "</tr>"
					$("#"+elementIdPrefix+"Table").append(row);
				}
				// hide table if no files
				if (resLength == 0) {
					$("#"+elementIdPrefix+"Table").hide();
				}
			} else {
				$("#"+elementIdPrefix+"Error").text(obj.data);
			}
		}
	});
}

/**
 * Method handler for downloading uploaded registration docs.
 * 
 * @param documentType
 * @param idx
 */
function downloadRegistrationDocument(documentType, idx) {
	var downloadUrl = corppassContextPath + "/registration/downloadregistrationdocument?registrationDocType=" + documentType + "&registrationDocIdx=" + idx;
	CPDataDownloader.doDownload(downloadUrl);
}

/**
 * Method that will display what type of RO Authorization Option.
 * 
 * @param option
 */
function displayROAuthorizationOption(option) {
	if (option === "") {
		$('#option-1-wrapper').show();
		$('#option-2-wrapper').hide();
		$("#isUserRo").val(true);
	} else if (option === "RO") {
		$('#option-1-wrapper').show();
		$('#option-2-wrapper').hide();
	} else if (option === "CA") {
		$('#option-1-wrapper').hide();
		$('#option-2-wrapper').show();
		$("#isUserRo").val(false);
	}
}

function disableButton() {
	$('button').attr('disabled','disabled');
}

function submitRequest(action) {
	var form = $("#registrationForm");
	disableButton();
	form.attr("action",action);
	form.submit();
}

function addRoApproval(entityType) {
	var addroapprovalURI = corppassContextPath + "/registration/addroapproval?entityType="+entityType;
	var tableData = $("#ro-approval-list :input").serializeArray();
	$('#ro-approval-list').load(addroapprovalURI + " div#ro-approval-list > div", tableData);
	
	//Hide Add Another RO button when there is 2
	var numItems = $('#ro-approval-list #ro-approval-group').length;
	if (numItems == 1){
		$('#addRoDiv').hide();
	}
}

function removeRoApproval(entityType, idx) {
	var removeroapprovalURI = corppassContextPath + "/registration/removeroapproval?entityType="+entityType+"&idx=" + idx;
	var tableData = $("#ro-approval-list :input").serializeArray();
	$('#ro-approval-list').load(removeroapprovalURI + " div#ro-approval-list > div", tableData);
	
	$('#addRoDiv').show();
}