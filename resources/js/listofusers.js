$(document).ready(function() {
	// initialize Export DataTable
	$('#toolbar').find('select').change(function () {
		$("#"+tableId).bootstrapTable('destroy').bootstrapTable({
			exportDataType: $(this).val()
		});
	});
	
});

function goToEditUser(event,index){	
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
	$('#editUserSelected').val(index);
    var form = $("#editUserDTO");
    form.attr("action", 'edituser');
    form.submit();

}

function disableButton() {
	$('button').attr('disabled','disabled');
}

function submitRequest(action) {
	var form = $("#editUserDTO");
	disableButton();
	form.attr("action",action);
	form.submit();
}

/**
 * Helper method that will get the selected row.
 * 
 * @param tableId
 * @returns array of the selected row.
 */
function getSelectedRow(tableId) {
	return $.grep($("#"+tableId).bootstrapTable("getOptions").data, function (row) {
		return row.selected === true;
	});
}
/*************************************************************
 * Check Box Event End
 *************************************************************/

/*************************************************************
 * Row Click Event Start
 *************************************************************/
function initRowEventOnClickRow(tableId, clickRowCallbackFunction) {
	$("#"+tableId+" tbody tr").on("click", function (e) {
		// when user click on specific row
		if($(e.target).attr("onclick") === undefined) {
			$("#"+tableId+" tbody tr").removeClass("tbl-row-selected");
			$(this).addClass("tbl-row-selected");
			clickRowCallbackFunction($(this));
		} else {
			return;
		}
	});
} 
/*************************************************************
 * Row Click Event End
 *************************************************************/
function exportData(type){
    if (type=='csv'){
    	CPDataDownloader.doDownload('/corppass/manageusers/exportcsvlistofusers');
    }else if (type=='excel'){
    	CPDataDownloader.doDownload('/corppass/manageusers/exportlistofusers');
    }
}