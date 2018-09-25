/**
 * Global js variables here related to datatable-commons.js.
 */

$(document).ready(function() {
	// initialize Export DataTable
	$('#toolbar').find('select').change(function () {
		$("#"+tableId).bootstrapTable('destroy').bootstrapTable({
			exportDataType: $(this).val()
		});
	});
});

var CPDataTable = (function() {

	/**
	 * Constructor.
	 */
	function CPDataTable() {}

	/**
	 * Method that will initializes the datatable.
	 * 
	 * @param tableIdRef -
	 *            the id of the data table.
	 * @param initDefaultEvents -
	 *            determines if the default events will be initialized. The
	 *            value for this parameter can be either <b>true</b> or
	 *            <b>false</b> and this parameter is optional. The following
	 *            events will be initialized:
	 *            <ul>
	 *            <li><b>initCheckBoxEventOnTableRefresh()</b></li>
	 *            <li><b>initCheckBoxEventOnClickSelectAllCheckBox()</b></li>
	 *            <li><b>initCheckBoxEventOnClickRowCheckBox()</b></li>
	 *            <li><b>initRowEventOnClickRow()</b></li>
	 *            </ul>
	 */
	CPDataTable.prototype.initDataTable = function(tableIdRef, initDefaultEvents) {
		var parent = this;
		
		// initialize custom data search
		$("#"+tableIdRef).bootstrapTable("getOptions").customSearch = customDataSearch;
		
		// initialize the reference indexes
		$.each($("#"+tableIdRef).bootstrapTable("getData"), function (idx, data) {
			data.referenceDataIdx = idx;
		});
		
		if ($("#selectedIndexes").length != 0) {
			$.each($("#selectedIndexes").val().split(","), function(key, value) {
				if (value !== "") {
					// recheck the boxes
					$("#dataCheckboxState-"+value).prop("checked", true)
					var data = $("#" + tableIdRef).bootstrapTable("getOptions").data[value];
					data.selected = true;
				}
			});
			
			var selectAllChckBoxSelector = "#"+tableIdRef+" thead input[id='selectAllCheckboxState']";
			var dataChckBoxSelector = "#"+tableIdRef+" tbody input[id^='dataCheckboxState-']";
			
			if ($(dataChckBoxSelector).length == $(dataChckBoxSelector+":checked").length) {
				$(selectAllChckBoxSelector).prop("checked", true);
			} else {
				$(selectAllChckBoxSelector).prop("checked", false);
			}
			
			var currentCount = parent.getSelectedRow(tableIdRef).length;
			$("span[id='selectedItemCount']").text(currentCount);
		}
		
		// initiatize default events
		if (initDefaultEvents !== undefined && initDefaultEvents === true) {
			// checkbox events
			parent.initCheckBoxEventOnTableRefresh(tableIdRef);
			parent.initCheckBoxEventOnClickSelectAllCheckBox(tableIdRef);
			parent.initCheckBoxEventOnClickRowCheckBox(tableIdRef);
			// row events
			parent.initRowEventOnClickRow(tableIdRef);
		}
	};

	/**
	 * Method that will retrieve the selected row.
	 *
	 * @param tableIdRef -
	 *            the id of the data table.
	 * @returns array of the selected row.
	 */
	CPDataTable.prototype.getSelectedRow = function(tableIdRef) {
		return $.grep($("#"+tableIdRef).bootstrapTable("getOptions").data, function (row) {
			return row.selected === true;
		});
	};

	/*************************************************************
	 * Check Box Event Start
	 *************************************************************/
	/**
	 * Method that will initialize the event when user will click the select all checkbox.
	 * 
	 * @param tableIdRef -
	 *            the id of the data table.
	 * @param callbackFunction -
	 *            the callback function
	 */
	CPDataTable.prototype.initCheckBoxEventOnTableRefresh = function(tableIdRef, callbackFunction) {
		var parent = this;
		var selectAllChckBoxSelector = "#"+tableIdRef+" thead input[id='selectAllCheckboxState']";
		var dataChckBoxSelector = "#"+tableIdRef+" tbody input[id^='dataCheckboxState-']";
		
		$("#"+tableIdRef).on("post-body.bs.table", function (e) {
			// when user change the table page
			$.each($("#"+tableIdRef).bootstrapTable("getData", true), function (idx, data) {
				$("#dataCheckboxState-"+data.referenceDataIdx).prop("checked", data.selected);
			});
			
			if ($(dataChckBoxSelector+":checked").length == 0) {
				$(selectAllChckBoxSelector).prop("checked", false);
			} else if ($(dataChckBoxSelector).length == $(dataChckBoxSelector+":checked").length) {
				$(selectAllChckBoxSelector).prop("checked", true);
			} else {
				$(selectAllChckBoxSelector).prop("checked", false);
			}
			
			parent.initCheckBoxEventOnClickRowCheckBox(tableIdRef, callbackFunction);
			parent.initRowEventOnClickRow(tableIdRef, callbackFunction);
		});
	};

	/**
	 * Method that will initialize the event when user will click the select all checkbox.
	 * 
	 * @param tableIdRef -
	 *            the id of the data table.
	 * @param callbackFunction -
	 *            the callback function
	 */
	CPDataTable.prototype.initCheckBoxEventOnClickSelectAllCheckBox = function(tableIdRef, callbackFunction) {
		var parent = this;
		var selectAllChckBoxSelector = "#"+tableIdRef+" thead input[id='selectAllCheckboxState']";
		var dataChckBoxSelector = "#"+tableIdRef+" tbody input[id^='dataCheckboxState-']";
		
		// when the checkall checkbox is checked/unchecked
		$(selectAllChckBoxSelector).on("change", function(e) {
			var checked = this.checked;
			$.each($("#"+tableIdRef).bootstrapTable("getData", true), function (idx, data) {
				$("#dataCheckboxState-"+data.referenceDataIdx).prop("checked", checked);
				data.selected = checked;
				updateSelectedIndexes(data.referenceDataIdx, checked);
			});
			
			var currentCount = parent.getSelectedRow(tableIdRef).length;
			$("span[id='selectedItemCount']").text(currentCount);
			
			if (callbackFunction !== undefined) {
				callbackFunction();
			}
		});
	};

	/**
	 * Method that will initialize the event when user will click a row checkbox.
	 * 
	 * @param tableIdRef -
	 *            the id of the data table.
	 * @param callbackFunction -
	 *            the callback function
	 */
	CPDataTable.prototype.initCheckBoxEventOnClickRowCheckBox = function(tableIdRef, callbackFunction) {
		var parent = this;
		var selectAllChckBoxSelector = "#"+tableIdRef+" thead input[id='selectAllCheckboxState']";
		var dataChckBoxSelector = "#"+tableIdRef+" tbody input[id^='dataCheckboxState-']";
		
		// when one of the data checkbox is checked/unchecked
		$(dataChckBoxSelector).on("change", function(e) {
			if ($(dataChckBoxSelector+":checked").length == 0) {
				$(selectAllChckBoxSelector).prop("checked", false);
			} else if ($(dataChckBoxSelector).length == $(dataChckBoxSelector+":checked").length) {
				$(selectAllChckBoxSelector).prop("checked", true);
			} else {
				$(selectAllChckBoxSelector).prop("checked", false);
			}
			
			var checked = this.checked;
			var dataIdx = parseInt($(this).attr("id").replace("dataCheckboxState-", ""));
			$.each($("#"+tableIdRef).bootstrapTable("getData", true), function (idx, data) {
				if (data.referenceDataIdx === dataIdx) {
					data.selected = checked;
					var currentCount = parent.getSelectedRow(tableIdRef).length;
					$("span[id='selectedItemCount']").text(currentCount);
					updateSelectedIndexes(data.referenceDataIdx, checked);
					return false;
				}
			});
			
			if (callbackFunction !== undefined) {
				callbackFunction();
			}
		});
	};

	/**
	 * Helper method that updates the flag of the selected rows.
	 */
	updateSelectedIndexes = function(dataIdx, checked) {
		if ($("#selectedIndexes").length != 0) {
			var idxsArray = [];
			if ($("#selectedIndexes").val() !== "") {
				idxsArray = $("#selectedIndexes").val().split(",").map(Number);
			}
			var temp = idxsArray.indexOf(dataIdx);
			if (checked) {
				if (temp > -1) {
					idxsArray.splice(temp, 1);
					idxsArray.push(dataIdx);
				} else {
					idxsArray.push(dataIdx);
				}
			} else {
				if (temp > -1)
					idxsArray.splice(temp, 1);
			}
			if (idxsArray.length != 0)
				idxsArray.sort(comparatorIndexes);
			$("#selectedIndexes").val(idxsArray);
		}
	};

	/**
	 * Helper method for sorting the selected indexes.
	 */
	comparatorIndexes = function(a, b) {
		if (a < b) return -1; if (a > b) return 1; return 0;
	};
	/*************************************************************
	 * Check Box Event End
	 *************************************************************/


	/*************************************************************
	 * Row Click Event Start
	 *************************************************************/
	/**
	 * Event handler when clicking thr data table row.
	 * 
	 * @param tableIdRef -
	 *            the id of the data table.
	 * @param callbackFunction -
	 *            the callback function
	 */
	CPDataTable.prototype.initRowEventOnClickRow = function(tableIdRef, callbackFunction) {
		$("#"+tableIdRef+" tbody tr").on("click", function (e) {
			// when user click on specific row
			if($(e.target).attr("onclick") === undefined) {
				$("#"+tableIdRef+" tbody tr").removeClass("tbl-row-selected");
				$(this).addClass("tbl-row-selected");
				
				if (callbackFunction !== undefined) {
					callbackFunction($(this));
				}
			} else {
				return;
			}
		});
	};
	/*************************************************************
	 * Row Click Event End
	 *************************************************************/


	/*************************************************************
	 * Custom Data Search Start
	 *************************************************************/
	/**
	 * Handler for searching data in data table. This will only search valid 
	 * text (not including any HTML elements).
	 */
	customDataSearch = function() {
		var getCellText = function (cellElmnts) {
			var cellText = [];
			$.each(cellElmnts, function (idx, data) {
				cellText.push($(this).text());
			});
			return cellText.join("");
		};

		var getFieldIndex = function (columns, field) {
			var index = -1;
			$.each(columns, function (i, column) {
				if (column.field === field) {
					index = i;
					return false;
				}
				return true;
			});
			return index;
		};

		var calculateObjectValue = function (self, name, args, defaultValue) {
			var func = name;
			if (typeof name === 'string') {
				var names = name.split('.');
				if (names.length > 1) {
					func = window;
					$.each(names, function (i, f) {
						func = func[f];
					});
				} else {
					func = window[name];
				}
			}
			if (typeof func === 'object') {
				return func;
			}
			if (typeof func === 'function') {
				return func.apply(self, args);
			}
			if (!func && typeof name === 'string' && sprintf.apply(this, [name].concat(args))) {
				return sprintf.apply(this, [name].concat(args));
			}
			return defaultValue;
		};

		var that = this;
		var s = this.searchText && (this.options.escape ? escapeHTML(this.searchText) : this.searchText).toLowerCase();
		var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;

		// Check filter
		this.data = f ? $.grep(this.options.data, function (item, i) {
			for (var key in f) {
				if ($.isArray(f[key]) && $.inArray(item[key], f[key]) === -1 ||
					item[key] !== f[key]) {
					return false;
				}
			}
			return true;
		}) : this.options.data;

		this.data = s ? $.grep(this.data, function (item, i) {
			for (var j = 0; j < that.header.fields.length; j++) {
			
				if (!that.header.searchables[j]) {
					continue;
				}
				
				var key = $.isNumeric(that.header.fields[j]) ? parseInt(that.header.fields[j], 10) : that.header.fields[j];
				var column = that.columns[getFieldIndex(that.columns, key)];
				var value;
				
				if (typeof key === 'string') {
					value = item;
					var props = key.split('.');
					for (var prop_index = 0; prop_index < props.length; prop_index++) {
						value = value[props[prop_index]];
					}
				
					if (column && column.searchFormatter) {
						value = calculateObjectValue(column, that.header.formatters[j], [value, item, i], value);
					}
					
					// format the data
					var parsedHTML = $.parseHTML(value);
					if (parsedHTML != null)
						value = getCellText(parsedHTML);
				} else {
					value = item[key];
				}
				
				if (typeof value === 'string' || typeof value === 'number') {
					if (that.options.strictSearch) {
						if ((value + '').toLowerCase() === s) {
							return true;
						}
					} else {
						if ((value + '').toLowerCase().indexOf(s) !== -1) {
							return true;
						}
					}
				}
			}
			return false;
		}) : this.data;
	};
	/*************************************************************
	 * Custom Data Search End
	 *************************************************************/

	return new CPDataTable();
}());
