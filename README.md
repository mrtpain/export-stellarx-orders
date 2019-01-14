# Rip StellarX Orders
## For use with Bitcoin.tax CSV imports

Easily rip, generate a csv, and upload all orders from StellarX to Bitcoin.tax. Using chrome dev tools, copy and paste a few commands to generate comma delimited data sets. Using online service at http://convertcsv.com/csv-to-csv.htm, generate csv file to import to bitcoin.tax.

### 1. Open Order Histroy
Navigate to your account in StellarX. Open the Activity page and view the All Orders tab.

### 2. Global Variables
Import variables used to organize datasets by column names by copying both `stellarXRowOrder` and `manualEntries` into the chrome dev tools console.

__For Each Coin Traded__ 

In stellarXRowOrder[2].overrides add each coin used to make trades. The property name is the exact output you see on StellarX order history, the value should be the coins abbreviation.

```console
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
```

### 3. Copy Table Headers
Copy the class name of `thead>tr` by right clicking, inspect element on the first table header, find the `tr` element directly under `thead` and copy the class name. Replace `CLASS_NAME` below. Copy entire code snippet into the same dev tools console and run. The output will be copied to the clipboard. Paste in any text editor.

```console
var tableHeader = document.getElementsByClassName("CLASS_NAME");
var headerChildren = tableHeader[0].childNodes;

function getHeaders() {
  var headers = [];

  for (var i = 0; i < headerChildren.length; i++) {
    var headerText = stellarXRowOrder[i].tax
    if (headerText !== null) headers.push(headerText); 
  }

  for (var i = 0; i < manualEntries.length; i++) {
    headers.push(manualEntries[i].header);
  }

  return headers
}

var headerData = getHeaders()
copy(headerData.join());
```

### 4. Rip Table Body Data
Find the classname of the `tbody` element. Copy it and replace `CLASS_NAME` in the snippet below. Copy and run the entire snippet in the same dev tools console. Paste results in text editor.

```console
var tableBody = document.getElementsByClassName("CLASS_NAME");
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
```

### 5. Generate CSV
  - Step 1. Copy all table headers and table body date to http://convertcsv.com/csv-to-csv.htm.
  - Step 2. Input Options,
    - Mark _First row is column names_ as checked.
    - Mark the `,` as the Field Separator.
    - All other options unchecked.
  - Step 3. Output Options
    - Display which fields positions should be `1,2,3,4,5,6,7`
    - Output Field Separator - `,`
    - Check `Always overwrite template when generating standard CSV`
    - Check `Replace value of NULL in CSV with an empty value`
  - Step 4. SKIP
  - Step 5. Click `Convert CSV To Delimited`
  - Name and save your result

### 6. Import to Bitcoin.Tax
Now you have a csv file of all StellarX trades. Import to bitcoin.tax as a csv file and double check all trades. 

