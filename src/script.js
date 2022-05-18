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
fs.appendFileSync('./out/' + outFile, '<link rel="stylesheet" href="../src/styles.css">', 'UTF-8', {'flags': 'a'});
fs.appendFileSync('./out/' + outFile, '<h1> Found vulnerabilities for ' + outFileName.join('.') + '</h1>', 'UTF-8', {'flags': 'a'});


// dropped the library since it wouldn't read json arrays with no key
parsedData.forEach((element) => {
    // putting every vulnerability inside a card
    fs.appendFileSync('./out/' + outFile, '<div class="card">', 'UTF-8', {'flags': 'a'});
    
    // header with element name
    fs.appendFileSync('./out/' + outFile, '<h2>' + element.info.name + '</h2>', 'UTF-8', {'flags': 'a'});
    
    fs.appendFileSync('./out/' + outFile, '<h3 ' + 'class = ' + element.info.severity + '>' + element.info.severity + '</h3>', 'UTF-8', {'flags': 'a'});

    // tag list
    fs.appendFileSync('./out/' + outFile, '<p> TAGS: ', 'UTF-8', {'flags': 'a'});
    element.info.tags.forEach((tag) => {
        fs.appendFileSync('./out/' + outFile, '<li>' + tag + '</li>', 'UTF-8', {'flags': 'a'});
    });
    fs.appendFileSync('./out/' + outFile, '</p><br>', 'UTF-8', {'flags': 'a'});

    // https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-6210
    fs.appendFileSync('./out/' + outFile, '<p> CVE CLASSIFICATION: ', 'UTF-8', {'flags': 'a'});
    element.info.classification.cve.forEach((element) => {
        fs.appendFileSync('./out/' + outFile,           // link for more information
        '<li> <a href = https://cve.mitre.org/cgi-bin/cvename.cgi?name=' + element.toUpperCase() + '>' + element.toUpperCase() + '</a></li>', 'UTF-8', {'flags': 'a'});
    });
    fs.appendFileSync('./out/' + outFile, '</p>', 'UTF-8', {'flags': 'a'});

    if(element.info.description)
        fs.appendFileSync('./out/' + outFile, '<p>' + element.info.description + '</p>', 'UTF-8', {'flags': 'a'});


    fs.appendFileSync('./out/' + outFile, '</div>', 'UTF-8', {'flags': 'a'});
});


console.log(input);
console.log(typeof parsedData);



//! modify run.sh to move classified JSON outputs to some other directory, same approach as other scripts
//! maybe delete the .txt output on achieving successful HTML conversion
