/*********************************************************/
/*                   DETECTION PHASE                     */
/*                   Detect site CMS                     */
/*********************************************************/

const puppeteer = require('puppeteer');
const fs = require('fs');

const input = fs
.readdirSync('./data/')
.filter((file) => file.endsWith('.json'));

console.log('Using input: ' + input);

// checking JSON input files
if(input.length > 1) { throw new FileNumberError('Expected one JSON file, found ' + input.length) };

// hard-coding output file name for the time being
const outFileName = input[0].split('.');
const outFile = outFileName[0] + '.txt';

(async function main() {
    try {
        const testURL = 'http://museo.etsisi.upm.es';
        // launch and go to cmsdetect
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://cmsdetect.com/detect');

        // type search parameters in and press enter, easier than clicking submit button, resistant to site changes
        await page.type('#url', testURL);
        await page.keyboard.press('Enter');                     //? await page.click('input[type = "submit"]');

        //! very important: wait for page to reload after submitting input, otherwise the script might try to scrape the landing site
        await page.waitForNavigation();

        // obtain cms name
        const grabCMS = await page.evaluate(() => {
            // currently, the desired result is inside some container-fluid inner-page div inside a header (h2) tag
            // which happens to be the first h2 tag, so querySelector will grab it (sensitive to site changes)
            const cmsTag = document.querySelector('h2');
            return cmsTag.innerText;
        });

        // evaluate function returns a string such as: {your-url} is built using {cms-name}
        // trimming result to filter {cms-name} out (sensitive to changes since site output might change)
        const resultWords = grabCMS.split(/\s+/);
        const cmsName = resultWords[resultWords.length - 1];

        console.log(cmsName);
        await browser.close();

        fs.writeFileSync('./out/' + outFile, 'Site is using: ' + cmsName + '\n', 'UTF-8', {'flags': 'a'});
    } catch(err) {
        console.log(err);
        return;
    }
})();
