/*********************************************************/
/*                  PRESENTATION PHASE                   */
/* Generate readable HTML file from previous classified  */
/*                          output                       */
/*********************************************************/

const fs = require('fs');
const json2html = require('node-json2html');
const FileNumberError = require('../errors/tooManyFiles');

// filtering JSON files in data folder
var input = fs
.readdirSync('./filtered-JSON/')
.filter((file) => file.endsWith('.json'));


// making sure script only gets one parameter
if(input.length > 1) { throw new FileNumberError('Expected one JSON file, found ' + input.length) };

// removing file extension (.json) and storing file name in a string
const outFileName = input[0].split('.');
outFileName.splice(outFileName.length-1, 1);
outFileName.join('.');


// replacing .json with .html for name consistency, will be writing to that file
const outFile = outFileName.join('.') + '.html';

// reading and parsing JSON data
const rawData = fs.readFileSync('./filtered-JSON/' + input[0]);
const parsedData = JSON.parse(rawData);                 // type: object
const stringData = JSON.stringify(parsedData);

// directly writing the HTML file with file system library
// embedding css with bash script to make the file portable, but use this line if it fails for some reason
// fs.appendFileSync('./out/' + outFile, '<link rel="stylesheet" href="../src/styles.css">', 'UTF-8'); 
fs.appendFileSync('./out/' + outFile, '<h1> Found vulnerabilities for ' + outFileName.join('.') + '</h1>', 'UTF-8');


// dropped the library since it wouldn't read json arrays with no key
parsedData.forEach((element) => {
    
    // putting every vulnerability inside a card
    fs.appendFileSync('./out/' + outFile, '<div class="card">', 'UTF-8');
    
    // header with element name
    fs.appendFileSync('./out/' + outFile, '<h2>' + element.info.name + '</h2>');
    
    fs.appendFileSync('./out/' + outFile, '<h3 ' + 'class = ' + element.info.severity + '>' + element.info.severity + '</h3>');

    // tag list
    fs.appendFileSync('./out/' + outFile, '<p> TAGS: ', 'UTF-8', {'flags': 'a'});
    element.info.tags.forEach((tag) => {
        fs.appendFileSync('./out/' + outFile, '<li>' + tag + '</li>');
    });
    fs.appendFileSync('./out/' + outFile, '</p><br>');

    if(element.info.severity !== "low") {   // low severity vulnerabilities don't have a CVE classification
        // https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-6210
        fs.appendFileSync('./out/' + outFile, '<p> CVE CLASSIFICATION: ');
        element.info.classification.cve.forEach((cve) => {
            fs.appendFileSync('./out/' + outFile,           // link for more information
            '<li> <a href = https://cve.mitre.org/cgi-bin/cvename.cgi?name=' + cve.toUpperCase() + '>' + cve.toUpperCase() + '</a></li>', 'UTF-8', {'flags': 'a'});
        });
        fs.appendFileSync('./out/' + outFile, '</p><br>');
    }

    // providing reference for low severity elements since they aren't classified with CVE
    if(element.info.severity === "low"){
        if(element.info.reference) {
            fs.appendFileSync('./out/' + outFile, '<p> REFERENCES: ');
        
            element.info.reference.forEach((reference) => {
                fs.appendFileSync('./out/' + outFile, '<li><a href = ' + reference + '>' + reference + '</a></li>');
            });
            fs.appendFileSync('./out/' + outFile, '</p>');
        } else {
            fs.appendFileSync('./out/' + outFile, '<p> No reference provided </p>');
        }
    }

    if(element.info.description)
            fs.appendFileSync('./out/' + outFile, '<p>' + element.info.description + '</p>');

    fs.appendFileSync('./out/' + outFile, '</div>');
});


console.log(input);
console.log(typeof parsedData);


//! perhaps use bash script to write styles.css content into HTML output header 
//! modify run.sh to move classified JSON outputs to some other directory, same approach as other scripts
//! maybe delete the .txt output on achieving successful HTML conversion
