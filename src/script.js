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

let tag;

let template = {'<>':'div', 'class':'card', 'html':[
                {'<>':'h2', 'text':'${info.name}'},
                {'<>':'h3', 'class':function(){return this.info.severity},'text': '${info.severity}'},
                /*{'<>':'p', 'text':'Tags:'},
                {'<>':'ul', 'html': [
                   {'<>':'li', 'text':function(){return this.info.tag}, 'obj':function(){return this.info.tags}},
                ]},*/
                {'<>':'p', 'text':'CVE:'},
                {'<>':'ul', 'html': [
                   {'<>':'li', 'obj':function(){ this.info.tags.forEach(element => {
                       tag = element;
                   });}}, 
               ]},
]};


// little test
let html = json2html.render(parsedData, template);
console.log(html); 
fs.appendFileSync('./out/' + outFile, html, 'UTF-8', {'flags': 'a'});



// library-less hardcode solution if nuclei JSON output issue is not fixed, not yet discarded
// fs.appendFileSync('./out/' + outFile, '<h1> Found vulnerabilities for ' + outFileName.join('.') + '</h1>', 'UTF-8', {'flags': 'a'});
// for each file, append HTML tag and conditionally set color

/*
parsedData.forEach((element) => {
    fs.appendFileSync('./out/' + outFile, '<div class="card">', 'UTF-8', {'flags': 'a'});
    
    fs.appendFileSync('./out/' + outFile, '<h3 ' + 'class = ' + element.info.severity + '>' + element.info.severity + '</h3>', 'UTF-8', {'flags': 'a'});

    fs.appendFileSync('./out/' + outFile, '<h2>' + element.info.name + '</h2>', 'UTF-8', {'flags': 'a'});

    fs.appendFileSync('./out/' + outFile, '<p> TAGS: ' + element.info.tags, 'UTF-8', {'flags': 'a'});

    fs.appendFileSync('./out/' + outFile, '<p> CLASSIFICATION: ', 'UTF-8', {'flags': 'a'});
    element.info.tags.forEach((tag) => {
        fs.appendFileSync('./out/' + outFile, '<li>' + tag + '</li>', 'UTF-8', {'flags': 'a'});
    });

    if(element.info.description)
        fs.appendFileSync('./out/' + outFile, '<p>' + element.info.description + '</p>', 'UTF-8', {'flags': 'a'});
    
    fs.appendFileSync('./out/' + outFile, '</div>', 'UTF-8', {'flags': 'a'});
});
*/

console.log(input);
console.log(typeof parsedData);



//! modify run.sh to move classified JSON outputs to some other directory, same approach as other scripts
//! maybe delete the .txt output on achieving successful HTML conversion
