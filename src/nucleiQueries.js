/*********************************************************/
/*                      SCAN PHASE                       */
/*       Read and classify parsed output from nuclei     */
/*********************************************************/

// JSON and filesystem libraries
const jsonata = require('jsonata');
const fs = require('fs');

// due javascript's fault at parameter passing to scripts, i'm using an awful file approach
// bash script above this will create and then delete a file with the parameter'
const param = '';

// filtering JSON files in data folder
const files = fs
.readdirSync('../data/')
.filter((file) => file.endsWith('.json'));

console.log(files);

// reading and parsing JSON data
// for each file (currently console.log), extract, for each vulnerability:
    // template
    // description
    // severity
    // entire classification field (cve-id, cwe-id, cvss-metrics, cvss-score) into readable file

files.forEach((file) => {
    const rawData = fs.readFileSync('../data/' + file);
    const data = JSON.parse(rawData);
    
    console.log(data);
});
