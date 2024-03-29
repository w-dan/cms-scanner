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

    // reading parameter file name and storing it in a string
    const outJSON = input[0].toString();
    console.log(outJSON);

    // reading and parsing JSON data
    const rawData = fs.readFileSync('./data/' + input);
    const parsedData = JSON.parse(rawData);                 // type: object

    // only vulnerabilities where severity is higher than 'info'
    var outData = parsedData.filter(item => item.info.severity != 'info');

    // deleting some bloaty fields
    outData.forEach((item) => {
        delete item.info.author;
    });

    // making it pretty
    const stringData = JSON.stringify(outData, null, 2);

    // saving as JSON for script.js to make it into HTML
    fs.appendFileSync('./filtered-JSON/' + outJSON, stringData, 'UTF-8', {'flags': 'a'});

} catch(err) {
    console.log(err);
}
