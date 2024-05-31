const puppeteer = require('puppeteer');

async function getChampionNames() {

}

async function scrapeContent(urlName) {
    const url = `https://leagueoflegends.fandom.com/wiki/${urlName}/LoL`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    console.log("In the goto section");

    const optionFn = (urlName) => {
        const selector = `select#lvl_${urlName} option`;
        console.log("selector: ", selector);
        const options = document.querySelectorAll(selector);
        console.log("options ", options);
        return Array.from(options).map(option => option.value);
    }

    const optionValues = await page.evaluate(
        `(
            ${optionFn.toString()}
        )(
            '${urlName}'
        )`
    );

    console.log("options: ", optionValues);

    const contentMap = {};

    const statsFn = (urlName) => {
        const health = document.querySelector(`#Health_${urlName}_lvl`).innerText.trim();
        console.log("Health: ", health);
        const mana = document.querySelector(`#ResourceBar_${urlName}_lvl`).innerText.trim();
        const healthRegen = document.querySelector(`#HealthRegen_${urlName}_lvl`).innerText.trim();
        const manaRegen = document.querySelector(`#ResourceRegen_${urlName}_lvl`).innerText.trim();
        const armor = document.querySelector(`#Armor_${urlName}_lvl`).innerText.trim();
        const attackDamage = document.querySelector(`#AttackDamage_${urlName}_lvl`).innerText.trim();
        const magicResist = document.querySelector(`#MagicResist_${urlName}_lvl`).innerText.trim();

        const critDamageElement = document.querySelector('div[data-source="critical damage"]').innerText.trim().match(/(\d+%)/);
        const critDamage = critDamageElement ? critDamageElement[1] : null; 
        const attackSpeedElement = document.querySelector('div[data-source="attack speed"]').innerText.trim().match(/(\d+\.\d+)/);
        const attackSpeed = attackSpeedElement ? attackSpeedElement[1] : null;
        const attackSpeedRatioElement = document.querySelector('div[data-source="as ratio"]').innerText.trim().match(/(\d+\.\d+)/);
        const attackSpeedRatio = attackSpeedRatioElement ? attackSpeedRatioElement[1] : null;
        const bonusAttackSpeed = document.querySelector(`#AttackSpeedBonus_${urlName}_lvl`).innerText.trim() + '%';
        const stats = {
            health,
            mana,
            healthRegen,
            manaRegen,
            armor,
            attackDamage,
            magicResist,
            critDamage,
            attackSpeed,
            attackSpeedRatio,
            bonusAttackSpeed
        }
        return stats;
    }

    // Loop through each option and extract content
    for (const value of optionValues) {
        await page.select(`select#lvl_${urlName}`, value);
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));
        const content = await page.evaluate( `(${statsFn.toString()})('${urlName}')`);
        contentMap[value] = content;
    }

    console.log(contentMap);

    await browser.close();
}

scrapeContent("Ahri");