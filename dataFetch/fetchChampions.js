const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const connectDB = require('../db');
const Champion = require('../models/Champion');

const getChampionList = async () => {
    try {
        const url = "https://leagueoflegends.fandom.com/wiki/List_of_champions";
        const response = await axios.get(url);

        const $ = cheerio.load(response.data);

        const table = $('.article-table');

        const championNames = [];

        table.find('tr').each((index, element) => {
            const cells = $(element).find('td');
            
            const dataSortValue = $(cells[0]).attr('data-sort-value');

            const championName = dataSortValue;
            if (championName) { 
                const urlChampionName = championName.replace(/[^a-zA-Z0-9\s]/g, '')  
                                                    .replace(/\s+/g, '_');
                console.log(`Official name: ${championName}, urlName: ${urlChampionName}`);
                championNames.push({name: championName, urlName: urlChampionName});
            }
        });
        return championNames;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

const saveChampionsToDB = async (champions) => {
    try {
        await Champion.insertMany(champions);
        console.log('Champion data saved to database');
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

const main = async () => {
    await connectDB();
    const champions = await getChampionList();
    await saveChampionsToDB(champions);
    mongoose.connection.close();
};

main();