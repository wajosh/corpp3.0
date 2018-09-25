$(document).ready(function() {
	var page = $('#pageNumber').val();
	if(page == '1'){
		$('#mobileNumber').bind('keypress', function(e) {
			if (!(47 < e.which && e.which < 58)) {
				e.preventDefault();
			}
		});
	}
});

function clickBack(action){
	var form = $("#updateProfileForm");
	form.attr("action",action);
	form.submit();
}

function disableButton() {
	$('button').attr('disabled','disabled');
}

function submitRequest(action) {
	var form = $("#updateProfileForm");
	disableButton();
	form.attr("action",action);
	form.submit();
}

/*************************************************************
 * Check Box Event Start
 *************************************************************/
/**
 * Method that will initialize the event when user will click any of the page of the table pagination.
 * 
 * @param tableId
 */
function initCheckBoxEventOnPageChange(tableId) {
	var selectAllChckBoxSelector = "#"+tableId+" thead input[id='selectAllCheckboxState']";
	var dataChckBoxSelector = "#"+tableId+" tbody input[id^='dataCheckboxState-']";
	
	$("#"+tableId).on("page-change.bs.table", function (e, number, size) {
		// when user change the table page
		$(dataChckBoxSelector).each(function (e) {
			var dataIdx = Number($(this).attr("id").replace("dataCheckboxState-", ""));
			var data = $("#"+tableId).bootstrapTable("getOptions").data[dataIdx];
			$(this).prop("checked", data.selected);
		});
		
		if ($(dataChckBoxSelector).length == $(dataChckBoxSelector+":checked").length) {
			$(selectAllChckBoxSelector).prop("checked", true);
		} else {
			$(selectAllChckBoxSelector).prop("checked", false);
		}
		
		initCheckBoxEventOnSelectCheckBox(tableId);
	});
}

/**
 * Method that will initialize the event when user will click the checkbox to select a row.
 * 
 * @param tableId
 */
function initCheckBoxEventOnSelectCheckBox(tableId) {
	var selectAllChckBoxSelector = "#"+tableId+" thead input[id='selectAllCheckboxState']";
	var dataChckBoxSelector = "#"+tableId+" tbody input[id^='dataCheckboxState-']";
	
	// when the checkall checkbox is checked/unchecked
	$(selectAllChckBoxSelector).on("change", function(e) {
		var checked = this.checked;
		$(dataChckBoxSelector).each(function (e) {
			$(this).prop("checked", checked);
			var dataIdx = Number($(this).attr("id").replace("dataCheckboxState-", ""));
			var data = $("#"+tableId).bootstrapTable("getOptions").data[dataIdx];
			data.selected = checked;
			updateSelectedIndexes(dataIdx, checked);
		});
		var currentCount = getSelectedRow(tableId).length;
		$("span[id='selectedItemCount']").text(currentCount);
		$("span[id='selectedItemCountToRemove']").text(currentCount);
		
	});
	
	// when one of the data checkbox is checked/unchecked
	$(dataChckBoxSelector).on("change", function(e) {
		if ($(dataChckBoxSelector).length == $(dataChckBoxSelector+":checked").length) {
			$(selectAllChckBoxSelector).prop("checked", true);
		} else {
			$(selectAllChckBoxSelector).prop("checked", false);
		}
		var dataIdx = Number($(this).attr("id").replace("dataCheckboxState-", ""));
		var data = $("#"+tableId).bootstrapTable("getOptions").data[dataIdx];
		data.selected = this.checked;
		var currentCount = getSelectedRow(tableId).length;
		$("span[id='selectedItemCount']").text(currentCount);
		$("span[id='selectedItemCountToRemove']").text(currentCount);
		updateSelectedIndexes(dataIdx, this.checked);
	});
}

function updateSelectedIndexes(dataIdx, checked) {
	// update the selected idxs
	var selectedIdxs = $("#selectedIndexes").val();
	if (checked)
		$("#selectedIndexes").val(selectedIdxs + dataIdx + ",");
	else
		$("#selectedIndexes").val(selectedIdxs.replace(dataIdx + ",", ""));
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