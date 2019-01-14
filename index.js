// ---------------------------------------------------------------------------------
/**
 * TABLE ROWS
 */
// ---------------------------------------------------------------------------------
var stellarXRowOrder = [
	{
		sdex: 'DATE',
		tax: '"Date"',
	},
	{
		sdex: 'TYPE',
		tax: '"Action"'
	},
	{
		sdex: 'TOKEN',
		tax: '"Symbol"',
		overrides: {
			Mobius: '"MOBI"',
			Bitcoin: '"BTC"'
		}
	},
	{
		sdex: 'ISSUER',
		tax: null
	},
	{
		sdex: 'AMOUNT',
		tax: '"Volume"'
	},
	{
		sdex: 'FILLED',
		tax: null
	},
	{
		sdex: 'PRICE (XLM)',
		tax: '"Price"'
	},
	{
		sdex: 'TOTAL PRICE (XLM)',
		tax: null
	},
	{
		sdex: 'ACTION',
		tax: null
	}
];

var manualEntries = [
	{
		header: '"Currency"',
		value: '"XLM"'
	},
	{
		header: '"Source"',
		value: '"SDEX"'
	}
];


// ---------------------------------------------------------------------------------
/**
 * TABLE HEAD
 */
// ---------------------------------------------------------------------------------
var tableHeader = document.getElementsByClassName("DataTable__Row-sc-1p30sf7-4");
var headerChildren = tableHeader[0].childNodes;

function getHeaders() {
	var headers = [];

	for (var i = 0; i < headerChildren.length; i++) {
		var headerText = stellarXRowOrder[i].tax
		if (headerText !== null) headers.push(headerText); 
	} 

	// Manual Forced Pushes
	for (var i = 0; i < manualEntries.length; i++) {
		headers.push(manualEntries[i].header);
	}

	return headers
}

var headerData = getHeaders()
copy(headerData.join());


// ---------------------------------------------------------------------------------
/**
 * TABLE BODY
 */
// ---------------------------------------------------------------------------------
var tableBody = document.getElementsByClassName("DataTable__Body-sc-1p30sf7-3");
var tableRows = tableBody[0].childNodes;

function parseDate(str) {
	var month = str.slice(1, 3);
	var day = str.slice(4, 6);
	var year = str.slice(7, 11);
	var hour = str.slice(11, 13);
	var minute = str.slice(14, 16);

	var dateString = `${year}-${month}-${day}T${hour}:${minute}:00Z`;

	return dateString;
}

function loopRows() {
	var rowValues = [];

	for (var r = 0; r < tableRows.length; r++) {
		var rowChildren = tableRows[r].childNodes;
		var rowData = [];

		for (var c = 0; c < rowChildren.length; c++) {
			var cell = rowChildren[c];
			var useCellValue = stellarXRowOrder[c].tax === null ? false : true;
			var cellOverrides = stellarXRowOrder[c].overrides;
			var isDate = stellarXRowOrder[c].sdex === 'DATE';
			var cellText = cellOverrides != undefined ? cell.innerText.trim() : `"${cell.innerText.trim()}"`;

			if (useCellValue) {
				if (cellOverrides !== undefined) {
					rowData.push(cellOverrides[cellText]);
				} else if (isDate) {
					var date = parseDate(cellText);
					rowData.push(date);
				} else {
					rowData.push(cellText);
				}
			}
		}

		// Manual Forced Pushes
		for (var i = 0; i < manualEntries.length; i++) {
			rowData.push(manualEntries[i].value);
		}

		rowValues.push(rowData);
	}

	return rowValues;
}

var rowData = loopRows();
copy(rowData.map(item => item.join().toString()).join("\n"));


// ---------------------------------------------------------------------------------
/*
 * CONVERT TO CSV
 */
// ---------------------------------------------------------------------------------
// http://convertcsv.com/csv-to-csv.htm
// INPUT
// First Row Column Names
// Commman Delimiter

// OUTPUT
// Comma Delimiter
// YYYY-MM-DDTHH:MM:SS Z - Date Fomrmat