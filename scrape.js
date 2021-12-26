const request = require("request-promise");
const cheerio = require("cheerio");


(async() => {
    const response = await request({uri : "https://www.mohfw.gov.in/", headers : {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9"
    }
     , gzip : true});
     let $ = cheerio.load(response);
     let covidData = [];
     let activePercentage = $('div[class="col-xs-8 site-stats-count"] > ul > li[class="bg-blue"] > span[class="mob-show"] > strong').text().trim();
     let activeNumber = $('div[class="col-xs-8 site-stats-count"] > ul > li[class="bg-blue"] > span[class="mob-show"] > span[class="active_per"]').text();
     
     let dischargedPercentage = $('div[class="col-xs-8 site-stats-count"] > ul > li[class="bg-green"] > span[class="mob-show"] > strong').text().trim();
     let totalVaccination = $('div[class="fullbol"] > span[class="coviddata"]').text().trim();
     let todaysVaccination = $('div[class="fullbol"] > span[class="coviddataval"]').text().trim();
     let covidDataState = $('table[class="statetable table table-striped"] > tbody').text();
     $('table[class="statetable table table-striped"] > tbody').each((index, element) => {
        console.log($(element).text());
      });
     





})()