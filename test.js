const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    // const baseUrl = "https://coinmarketcap.com/"
    await page.goto(baseUrl);
    // await page.setViewport({
        //     width: 1200,
        //     height: 800
        // });
        
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
        console.log(allLinks);
        await clickCoinLinks(page, allLinks)
        console.log(allLinks.length);
        
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
            await page.goto(`${baseUrl}${url}`)
            navigations++
            const title = await page.title()
            console.log('---------')
            console.log(title)
            const simpleLinkBtns = await page.$$('a.link-button')
            let telegramLinks = await linkHandler(simpleLinkBtns)
            if (telegramLinks.length){
                totalLinks.push(...telegramLinks)
                telegramLinks.forEach(link => console.log(link))
            }else{
                console.log('[-] No Immediate Link');
                const hoverLinkBtns = await page.$$('button.link-button')
                telegramLinks = await dropdownBtnHandler(hoverLinkBtns, page)
                console.log('Testing for dropdown link');

                if (telegramLinks.length) totalLinks.push(...telegramLinks);
                
                telegramLinks ? telegramLinks.forEach(link => console.log(link)) : console.log('No dropdown Link either')
                
                    
            }
            

        }
        console.log(totalLinks);
        
        saveToFile(totalLinks)
    }

const linkHandler = async (eleHandles)=>{
    let linkUrls = []
    for (const aTag of eleHandles){
        linkUrls.push(await (await aTag.getProperty('href')).jsonValue())
    }
    const telegramLink = testLinks(linkUrls)
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
             telegramLink = testLinks(linkUrls)


        }
    } 
    return telegramLink ? telegramLink : []
}

const testLinks = (links) =>{
    let telegramLinks = []
    links.forEach(link => {
        if (telegramRegex.test(link)){
            telegramLinks.push(link)
        }
    })
    // console.log(telegramLinks);
    
    return telegramLinks

}

const saveToFile = (links) =>{
    

const file = fs.createWriteStream('telegram_links.txt');
file.on('error', function(err) { /* error handling */; console.log(err) });
file.write(links.join(', \r\n'))
file.end();
}