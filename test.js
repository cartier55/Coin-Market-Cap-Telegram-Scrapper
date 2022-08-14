const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    // const baseUrl = "https://coinmarketcap.com/"
    let totalTelegramLinks = []
    for (let i = 50; i < 101;i++){

        await page.goto(`https://coinmarketcap.com/?page=${i}`, {waitUntil : 'networkidle2' }).catch(e => void 0);
        console.log(`[+] Scraping Page ${i}`);
        
        
        await autoScroll(page);
        let allLinks = []
        const grabedTableLinks = await page.evaluate(() => {
            const aTags = Array.from(document.querySelectorAll('table.cmc-table tbody tr td div.sc-16r8icm-0.escjiH a.cmc-link'))
            return aTags.map(a=>a.getAttribute('href'))
        })
        // allLinks.push([...new Set([...grabedTableLinks, ...allLinks])])
        allLinks.push(...grabedTableLinks)
        await page.screenshot({
            path: 'yoursite.png',
            fullPage: true
        });
        // console.log(allLinks);
        console.log(allLinks.length);
        // const  await clickCoinLinks(page, allLinks)
        totalTelegramLinks.push(...(await clickCoinLinks(page, allLinks)))

        
    }
    saveToFile(totalTelegramLinks)
    console.log('\u0007')
        await browser.close();
    })();
    
    const telegramRegex = new RegExp('(?:http|https):\/\/(?:t\.me|telegram\.me)\/.*')
    const baseUrl = "https://coinmarketcap.com"

    async function autoScroll(page){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    
                    if(totalHeight >= scrollHeight - window.innerHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    async function clickCoinLinks(page, links){
        let navigations = 0
        let totalLinks = []
        for (const url of links){
            await page.goto(`${baseUrl}${url}`,{waitUntil : 'networkidle2' }).catch(e => void 0)
            navigations++
            const title = await page.title()
            // console.log('---------')
            // console.log(title)
            const simpleLinkBtns = await page.$$('a.link-button')
            let telegramLinks = await linkHandler(simpleLinkBtns, page)
            if (telegramLinks.length){
                totalLinks.push(...telegramLinks)
                // telegramLinks.forEach(link => console.log(link))
            }else{
                // console.log('[-] No Immediate Link');
                const hoverLinkBtns = await page.$$('button.link-button')
                telegramLinks = await dropdownBtnHandler(hoverLinkBtns, page)
                // console.log('Testing for dropdown link');

                if (telegramLinks.length) totalLinks.push(...telegramLinks);
                
                // telegramLinks ? telegramLinks.forEach(link => console.log(link)) : console.log('No dropdown Link either')
                
                    
            }
            

        }
        // console.log(totalLinks);
        return totalLinks
    }

const linkHandler = async (eleHandles, page)=>{
    let linkUrls = []
    for (const aTag of eleHandles){
        linkUrls.push(await (await aTag.getProperty('href')).jsonValue())
    }
    const telegramLink = testLinks(linkUrls, page)
    return telegramLink
   
}

async function dropdownBtnHandler(eleHandles, page){
    let linkUrls = []
    let telegramLink
    for (const btn of eleHandles){
        const btnText = await (await btn.getProperty('innerText')).jsonValue()
        if(btnText == 'Chat'){
            await btn.hover()
            const dropdownLinks = await page.$$('li > a.dropdownItem')
            for (const aTag of dropdownLinks){
                const hrefVal = await (await aTag.getProperty('href')).jsonValue();
                linkUrls.push(hrefVal)                
            }
             telegramLink = testLinks(linkUrls, page)


        }
    } 
    return telegramLink ? telegramLink : []
}

const testLinks = async (links, page) =>{
    const coin = await page.url().split('/').at(-2)
    let telegramLinks = []
    let coinLinks = []
    links.forEach(link => {
        if (telegramRegex.test(link)){
            coinLinks.push(link)
        }
    })
    // console.log(telegramLinks);
    if(coinLinks.length){
        const linkObj = {}
        linkObj['coin'] = coin
        linkObj['telegram_links'] = coinLinks
        telegramLinks.push(linkObj)
    }
    
    return telegramLinks

}

const saveToFile = async (links) =>{
    
    const csv = new ObjectsToCsv(links);
 
    // Save to file:
    await csv.toDisk('./telegram_links.csv');
   
    // Return the CSV file as string:
    // console.log(await csv.toString());

}