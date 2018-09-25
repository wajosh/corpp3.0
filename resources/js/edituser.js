$(document).ready(function() {

	$("select[id=newStatus]").on("change", function() {
		displayStatusOption();
	});
	$('#effectiveDateDiv').hide();
	$('#expiryDateDiv').hide();
	$('#reasonForNewStatusDiv').hide();
	$('#warningMessageDiv').hide();
	displayStatusOption();
});

function displayStatusOption(){
	var status = $('option:selected', $('#newStatus')).text();
	var currentStatus = $('#currentStatus').val();
	var fullName = $('#fullName').val();
	$('#warningMessageDiv').hide();
	if (status == 'Terminated') {
		$('#warningTitle').text("Are you sure you want to terminate "+fullName +"?");
		$('#warningMessage').text("The CorpPass user will no longer be able to manage your entity's CorppPass account during termination. A new registration must be submitted to reinstate the account.");
		$('#warningMessageDiv').show();
		
		$('#effectiveDateDiv').show();
		$('#expiryDateDiv').hide();
		$('#reasonForNewStatusDiv').show();
		$("body,html").scrollTop($('#warningMessageDiv').offset().top);
	} else if(status == 'Suspended'){
		$('#warningTitle').text("Are you sure you want to suspend "+fullName +"?");
		$('#warningMessage').text("The CorpPass user will no longer be able to manage your entity's CorppPass account during suspension. The account will only be reinstated upon suspension expiry date.");
		$('#warningMessageDiv').show();
		$("body,html").scrollTop($('#warningMessageDiv').offset().top);
		if(currentStatus == 'Suspended'){
			$('#effectiveDateDiv').hide();
			$('#expiryDateDiv').show();
			$('#reasonForNewStatusDiv').show();
		}
		else if (currentStatus == 'Active'){
			$('#effectiveDateDiv').show();
			$('#expiryDateDiv').show();
			$('#reasonForNewStatusDiv').show();
		}
	}
	else if(status == 'Active' || status == 'Cancellation of Suspension/Termination'){
		$('#effectiveDateDiv').hide();
		$('#expiryDateDiv').hide();
		$('#reasonForNewStatusDiv').show();
	}
	else{
		$('#effectiveDateDiv').hide();
		$('#expiryDateDiv').hide();
		$('#reasonForNewStatusDiv').hide();
	}
}

function disableButton() {
	$('button').attr('disabled','disabled');
}
function backButton(action){
	var form = $("#editUserForm");
	disableButton();
	form.attr("action",action);
	form.submit();
}
function exportData(type){
    if (type=='csv'){
        window.location ='/corppass/manageusers/exportcsvuserstatushistory';
    }else if (type=='excel'){
        window.location ='/corppass/manageusers/exportuserstatushistory';
    }
}