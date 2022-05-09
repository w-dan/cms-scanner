/*********************************************************/
/*                      SCAN PHASE                       */
/*       Read and classify parsed output from nuclei     */
/*********************************************************/

// JSON query and filesystem libraries
const FileNumberError = require('../errors/tooManyFiles');
const fs = require('fs');

// due to javascript's fault at parameter passing to scripts, i'm using an awful file approach:
// bash script above this one will copy target file to the 'data' folder to work as a parameter
// the bash script will make sure that the 'data' folder contais exactly one file

try {
    // filtering JSON files in data folder
    const input = fs
    .readdirSync('./data/')
    .filter((file) => file.endsWith('.json'));

    console.log('Using input: ' + input);
    // even if the script makes sure only one file remains in the data folder, it's better to double
    // check, since the user may accidentally (or otherwise) move a file there before execution
    // the bash script will later empty the folder for the next execution
    if(input.length > 1) { throw new FileNumberError('Expected one JSON file, found ' + input.length) };

    // hard-coding output file name for the time being
    const outFileName = input[0].split('.');
    const outFile = outFileName[0] + '.txt';

    // reading and parsing JSON data
    const rawData = fs.readFileSync('./data/' + input);
    const parsedData = JSON.parse(rawData);                 // type: object

    // extract, for each vulnerability:
        // -template
        // -description
        // -severity
        // -entire classification field (cve-id, cwe-id, cvss-metrics, cvss-score) into readable file
    // where severity is higher than 'info'
    var outData = parsedData.filter(item => item.info.severity != 'info');

    // deleting some fields
    outData.forEach((item) => {
        delete item.info.author;
    });

    const stringData = JSON.stringify(outData, null, 2);

    // after query, use this:
    // const outData = JSON.stringify(queryResult);
    console.log(stringData);
    fs.appendFileSync('./out/' + outFile, stringData, 'UTF-8', {'flags': 'a'});
    
    console.log(typeof stringData);
    console.log(outFile);
} catch(err) {
    console.log(err);
}
