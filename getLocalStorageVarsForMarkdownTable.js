/*
  1. Load all init scripts in `page.initialize-jimaworks`
  2. Paste result into: https://kdelmonte.github.io/json-to-markdown-table/
*/
var table = [];
Object.keys( localStorage )
  .sort()
  .forEach( el => (
    table.push( {
      "Variable Name": el,
      "Default Value": localStorage[el]
    } )
  )
);
JSON.stringify( table );