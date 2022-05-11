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

    console.log('[outputClassifier] Using input: ' + input);
    // even if the script makes sure only one file remains in the data folder, it's better to double
    // check, since the user may accidentally (or otherwise) move a file there before execution
    // the bash script will later empty the folder for the next execution
    if(input.length > 1) { throw new FileNumberError('Expected one JSON file, found ' + input.length) };

    // reading parameter file name and removing .json file extension, storing it in a string
    const outFileName = input[0].split('.');
    outFileName.splice(outFileName.length-1, 1);

    // joining previous split name and adding .txt extension
    const outFile = outFileName.join('.') + '.txt';

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

    // deleting some bloaty fields
    outData.forEach((item) => {
        delete item.info.author;
    });

    const stringData = JSON.stringify(outData, null, 2);

    // after query, use this:
    // const outData = JSON.stringify(queryResult);
    fs.appendFileSync('./out/' + outFile, stringData, 'UTF-8', {'flags': 'a'});

    // also saving as JSON for script.js to make it into HTML
    fs.appendFileSync('./filtered-JSON/' + input[0], stringData, 'UTF-8', {'flags': 'a'});

    console.log('Done! Check out/' + outFile + ' for scan results');
} catch(err) {
    console.log(err);
}
