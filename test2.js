const puppeteer = require('puppeteer');

(async () => {
    const youtubeRegex = new RegExp('https:\/\/www\.youtube\.com\/');
    const browser = await puppeteer.launch({headless: false, defaultViewport: null, args: ['--start-maximized']}) // new option});
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.setViewport({ width: 1900, height: 1000});
    await page.goto('https://coinmarketcap.com/currencies/solana/', { waitUntil: "domcontentloaded" });
    console.log('');
    
    // Drop Down Button chat box handler logic
    const linkBtns = await page.$$('button.link-button')
    for (const btn of linkBtns){
        const content = await (await btn.getProperty("innerText")).jsonValue();
        if (content == 'Chat'){
            await btn.hover();
            const rootDropdown = await page.$('div[data-tippy-root]')
            // const dropDownBox = await page.$eval('div.tippy-box', el => el.getAttribute('class'))
            const dropDownContent = await page.$eval('div.tippy-content', el=>el)
            // const a = await page.$$eval('li > a.dropdownItem', els => {return els.map(el => el.getAttribute('href'))})
            const a = await page.$$('li > a.dropdownItem')
            // const test = await (await dropDownBox.getProperty('data-state')).jsonValue()
            // console.log(dropDownBox);
            // console.log(dropDownContent);
            for (const url of a){
                const hrefVal = await (await url.getProperty('href')).jsonValue();
                console.log(hrefVal);

            }
            
            // const lis = await rootDropdown.$$('div.tippy-content > div > ul > li > a[name="chat"]')
            // for (const li of lis){
            //     console.log(li)
            // }
            // const teleID = await (await rootDropdown.getProperty('id')).jsonValue()
            // console.log(teleID)

        }
        console.log(content)

    }
    // const ref = await aTags[5].getProperty('href')
    // let linkUrls = []
    // for (const tag of aTags){
    //     const ref = await tag.getProperty('href')
    //     linkUrls.push(await ref.jsonValue())
        
    // }
    // // console.log(linkUrls)
    // // console.dir(linkUrls, {'maxArrayLength': null});
    // linkUrls.forEach(link => {if(youtubeRegex.test(link)){
    //     console.log(link)
    // }
// })
    
    // await browser.close();
  })();