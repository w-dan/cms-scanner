/*********************************************************/
/*                   DETECTION PHASE                     */
/*                   Detect site CMS                     */
/*********************************************************/

const puppeteer = require('puppeteer');

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

        //! very important: wait for page to reload after submitting imput, otherwise the script might try to scrape the landing site
        await page.waitForNavigation();

        // obtain cms name
        const grabCMS = await page.evaluate(() => {
            // currently, the desired result is inside some container-fluid inner-page div inside a header (h2) tag
            // which happens to be the first h2 tag, so querySelector will grab it (sensitive to site changes)
            const cmsTag = document.querySelector('h2');
            return cmsTag.innerText;
        });

        // evaluate function returns a string such as '{your-url} is built using {cms-name}
        // trimming result to filter {cms-name} out (sensitive to changes since site output might change)
        const resultWords = grabCMS.split(/\s+/);
        const cmsName = resultWords[resultWords.length - 1];

        console.log(cmsName);
        await browser.close();
    } catch(err) {
        console.log(err);
        return;
    }
})();
