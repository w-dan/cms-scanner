/*********************************************************/
/*                      SCAN PHASE                       */
/*       Read and classify parsed output from nuclei     */
/*********************************************************/

// JSON query and filesystem libraries
const FileNumberError = require('../errors/tooManyFiles');
const jsonQuery = require('json-query');               // https://www.npmjs.com/package/json-query
const fs = require('fs');

// due to javascript's fault at parameter passing to scripts, i'm using an awful file approach:
// bash script above this one will copy target file to the 'data' folder to work as a parameter
// the bash script will make sure that the 'data' folder contais exactly one file

try {
    // filtering JSON files in data folder
    const input = fs
    .readdirSync('../data/')
    .filter((file) => file.endsWith('.json'));


    console.log(input);
    // even if the script makes sure only one file remains in the data folder, it's better to double
    // check, since the user may accidentally (or otherwise) move a file there before execution
    // the bash script will later empty the folder for the next execution
    if(input.length > 1) { throw new FileNumberError('Expected one JSON file, found ' + input.length) };
    
    const outFileName = input[0].split('.');
    const outFile = outFileName[0] + '.txt';

    // reading and parsing JSON data
    const rawData = fs.readFileSync('../data/' + input);
    const parsedData = JSON.parse(rawData);
    const stringData = JSON.stringify(parsedData);      // perhaps toString()??


    /*  test with local json
    data = {
        "hi": "hi",
    };
    const dataTest = JSON.stringify(data);
    console.log(dataTest); */

    // extract, for each vulnerability:
        // -template
        // -description
        // -severity
        // -entire classification field (cve-id, cwe-id, cvss-metrics, cvss-score) into readable file
    const queryResult = jsonQuery('template-id', { data: stringData }).value;

    // after query, use this:
    const outData = JSON.stringify(queryResult);
    fs.writeFileSync(outFile, queryResult)

    console.log(parsedData);
    console.log(outFile);
} catch(err) {
    console.log(err);
}
