// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch({headless: false, defaultViewport: null, args: ['--start-maximized']}) // new option});
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setViewport({ width: 1900, height: 1000});
    // await page.goto('https://coinmarketcap.com/', { waitUntil: "domcontentloaded" });
    // console.log('');
    // 
    // const headerTest = await page.waitForSelector('.cmc-link')
    // const t = await page.waitForSelector('title')
    // const b = await page.waitForSelector('.sc-1ebmiy2-0 naMuB')
    // b[0].click()
    // console.log(b);
    
    // await browser.close();
//   })();

//   async  function run (){
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     // await page.setViewport({ width: 1900, height: 1000});
//     await page.goto('https://coinmarketcap.com/');
//     const navLinks = await page.evaluate(()=>{
//         const res = []
//         const nav = document.querySelectorAll('a.cmc-link')
//         console.log(nav)
//         nav.forEach(a => {
//             res.push({url:a.getAttribute('href')})
//         })
//         return res;
//     })
//     await browser.close()
//   }

//   run().then((res) => console.log(res))
const puppeteer = require('puppeteer');
async function run () {
        try {
            const browser = await puppeteer.launch({headless: false, defaultViewport: null, args: ['--start-maximized']});
            const page = await browser.newPage();
            await page.goto("https://coinmarketcap.com/");
            // await page.goto("https://stackoverflow.com/questions/65709377/capturing-all-links-in-a-scrollable-page-with-puppeteer-infinite-scroll");
            // let urls = await page.evaluate(() => {
            //     let results = [];
            //     let items = document.querySelectorAll('a.cmc-link');
            //     items.forEach((item) => {
            //         results.push({
            //             url:  item.getAttribute('href'),
            //             text: item.innerText,
            //         });
            //     });
            //     return results;
            // })
            // const data = await page.$$eval('table.cmc-table tbody tr td a.cmc-link', anchors => anchors.map((a) => {
            //     a.click()
            //     console.log(document.title)
            //     // return a.getAttribute('href');
            //   }));
            // console.log(data.length);
            // page.click('table.cmc-table tbody tr td a.cmc-link')
            // console.log(page.title())
            // while (true){
            const grabedTableLinks = await page.evaluate(() => {
            const aTags = Array.from(document.querySelectorAll('table.cmc-table tbody tr td div.sc-16r8icm-0.escjiH a.cmc-link'))
            return aTags.map(a=>({href:a.getAttribute('href')}))
            // })
            
                    // let res = []
                // let aTags = document.querySelectorAll('table.cmc-table tbody tr td div.sc-16r8icm-0.escjiH a.cmc-link')
                // aTags.forEach((item) => {
                //     res.push({
                //         href:item.getAttribute('href'),
                //     })
                // })
                console.log(res);
            
                return res
            
            // }
            })
            // await browser.close();
            return grabedTableLinks
            
        } catch (e) {
            return e;
        }
}
run().then(console.log).catch(console.error);
// run()
// function run () {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const browser = await puppeteer.launch();
//             const page = await browser.newPage();
//             await page.goto("https://coinmarketcap.com/");
//             let urls = await page.evaluate(() => {
//                 let results = [];
//                 let items = document.querySelectorAll('a.cmc-link');
//                 items.forEach((item) => {
//                     results.push({
//                         url:  item.getAttribute('href'),
//                         text: item.innerText,
//                     });
//                 });
//                 return results;
//             })
//             browser.close();
//             return resolve(urls);
//         } catch (e) {
//             return reject(e);
//         }
//     })
// }
// run().then(console.log).catch(console.error);