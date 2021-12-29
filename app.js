// app.js
const express = require('express');
const cors = require('cors');
const request = require("request-promise");
const cheerio = require("cheerio");
const { default: axios } = require('axios');
const app = express();
let covidDataStateWise = [];


const fetchCovidData = async () => {
    try {
      return await axios.get("https://www.mohfw.gov.in/data/datanew.json")
    } catch (error) {
      console.error(error)
    }
  }

  

app.use(cors());
app.get('/', (req, res) => res.send('Hello!'));
app.get("/list_covid_state_wise", async (req, res) => {
covidDataStateWise = await fetchCovidData();
   let response = [];
   covidDataStateWise.data.map((element) => {
    const changed_active = element.active - element.new_active;
    const changed_cured = element.cured - element.new_cured;
    const changed_death = element.death - element.new_death;
    let picked = {'state_name' : element.state_name,'new_active' : element.new_active, 'changed_active' : changed_active, 'new_cured' : element.new_cured,'changed_cured' : changed_cured, 'new_death': element.new_death,'changed_death' : changed_death};
    response.push(picked);
   });
   console.log("Response",response);
   res.status(200).send(response);
});
app.get("/filtered_list_covid_state_wise", async (req, res) => {
    covidDataStateWise = await fetchCovidData();
    if(covidDataStateWise && covidDataStateWise.data) {
        let response = [];
        covidDataStateWise.data.map((element) => {
         const changed_active = element.active - element.new_active;
         const changed_cured = element.cured - element.new_cured;
         const changed_death = element.death - element.new_death;
         let picked = {'state_name' : element.state_name,'new_active' : element.new_active, 'changed_active' : changed_active, 'new_cured' : element.new_cured,'changed_cured' : changed_cured, 'new_death': element.new_death,'changed_death' : changed_death};
         response.push(picked);
        });
    if(req.query.sort_by && req.query.sort_by in response[0]) {
    response.sort((a,b) => a[req.query.sort_by] - b[req.query.sort_by]);
    res.status(200).send(response);
    }
    else{
        res.status(400).send("Request parameter doesn't exist!");
    
    }
}
else{
    res.status(400).send("Data doesn't exist");
}
 });

 app.get("/search_details_covid_state", async (req, res) => {
    covidDataStateWise = await fetchCovidData();
    if(covidDataStateWise && covidDataStateWise.data && req.query.search_by) {
    let response = [];
    covidDataStateWise.data.map((element) => {
        response.push(element);
    });
    let result = response.filter((a) => a.state_name.match(req.query.search_by));
    res.status(200).send(result);
}
else{
    res.status(400).send("Request parameter doesn't exist");
}
 });

 app.get("/get_national_covid_details",async(req,res) => {
    const response = await request({uri : "https://www.mohfw.gov.in/", headers : {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9"
    }
     , gzip : true});
     let $ = cheerio.load(response);
     let activeDetails = $('div[class="col-xs-8 site-stats-count"] > ul > li[class="bg-blue"] > span[class="mob-show"] > strong').text().trim();
     const current_active = activeDetails.split("(")[0];
     const new_active = activeDetails.split("(")[1].slice(0, -1);
     let dischargeDetails = $('div[class="col-xs-8 site-stats-count"] > ul > li[class="bg-green"] > span[class="mob-show"] > strong').text().trim();
     const current_discharged = dischargeDetails.split("(")[0];
     const new_discharged = dischargeDetails.split("(")[1].slice(0, -1);
     let deathDetails = $('div[class="col-xs-8 site-stats-count"] > ul > li[class="bg-red"] > span[class="mob-show"] > strong').text().trim();
     const current_death = deathDetails.split("(")[0];
     const new_death = deathDetails.split("(")[1].slice(0, -1);
     let totalNationalVaccination = $('div[class="fullbol"]').children().eq(1).text().trim();
     let newNationalVaccination = $('div[class="fullbol"]').children().eq(2).text().slice(1,-1).split("(")[1];
     let nationalCovidDetails = {'current_active' : current_active,'new_active' : new_active,'current_discharged' : current_discharged, 'new_discharged' : new_discharged,'current_death' : current_death,'new_death' : new_death, 'total_vaccination' : totalNationalVaccination, 'new_vaccination' : newNationalVaccination};
     res.status(200).send(nationalCovidDetails)
 })



app.listen(process.env.PORT || 3000, () => console.log('running on port 3000!'));