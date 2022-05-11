/*********************************************************/
/*                  PRESENTATION PHASE                   */
/* Generate readable HTML file from previous classified  */
/*                          output                       */
/*********************************************************/

const fs = require('fs');
const { parse } = require('path');
const { ConsoleMessage } = require('puppeteer');
const { CLIENT_RENEG_LIMIT } = require('tls');
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

console.log(parsedData);

fs.appendFileSync('./out/' + outFile, '<h1> Found vulnerabilities for ' + outFileName + '</h1>', 'UTF-8', {'flags': 'a'});
// for each file, append HTML tag and conditionally set color
parsedData.forEach((element) => {
    fs.appendFileSync('./out/' + outFile, '<h2>' + element.info.name + '</h2>', 'UTF-8', {'flags': 'a'});
    // severity and color conditions should go here
    fs.appendFileSync('./out/' + outFile, '<p> TAGS: ' + element.info.tags + '</p>', 'UTF-8', {'flags': 'a'});
    fs.appendFileSync('./out/' + outFile, '<p>' + element.info.description + '</p>', 'UTF-8', {'flags': 'a'});

    // fs.appendFileSync('./out/' + outFile, '<p>' + element.info.description + '</p>', 'UTF-8', {'flags': 'a'});
    
});





console.log(input);
console.log(typeof inJSON);




//! modify run.sh to move classified JSON outputs to some other directory, same approach as other scripts
//! maybe delete the .txt output on achieving successful HTML conversion