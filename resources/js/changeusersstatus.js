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
	$('#warningMessageDiv').hide();
	if (status == 'Terminated') {
		$('#warningTitle').text("Are you sure you want to terminate these account(s)?");
		$('#warningMessage').text("The CorpPass Users will not be able to access their accounts upon termination.");
		$('#warningMessageDiv').show();
		
		$('#effectiveDateDiv').show();
		$('#expiryDateDiv').hide();
		$('#reasonForNewStatusDiv').show();
	} else if(status == 'Suspended'){
		$('#warningTitle').text("Are you sure you want to suspend these account(s)?");
		$('#warningMessage').html("These CorpPass User(s) will not be able to access their account(s) during the suspension.<br/> These account(s) will be only reinstated upon  reactivation or end of suspension.");
		$('#warningMessageDiv').show();
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
	} else {
		$('#effectiveDateDiv').hide();
		$('#expiryDateDiv').hide();
		$('#reasonForNewStatusDiv').show();
	}
}

function goToEditUser(event,uniqueIdentityNo){	
	if(event.preventDefault) event.preventDefault();
	event.returnValue = false;
	
	//prevents double click - start
	var $this = $(this);
	   var alreadyClicked = $this.data('clicked');
	   if (alreadyClicked) {
	      return false;
	   }
	$this.data('clicked', true);
	//prevents double click - end
    var form = $("#editUserForm");
    form.attr("action", 'edituser');
    form.append("<input type='hidden' id='cpPerson.uniqueIdentityNo' name='cpPerson.uniqueIdentityNo' value='"+uniqueIdentityNo+"'>");
    form.submit();

}

function disableButton() {
	$('button').attr('disabled','disabled');
}

function submitRequest(action) {
	var form = $("#editUserForm");
	disableButton();
	form.attr("action",action);
	form.submit();
}
function backButton(){
	window.location ='/corppass/manageusers/listofusers';
}