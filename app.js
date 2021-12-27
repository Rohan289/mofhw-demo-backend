// app.js
const express = require('express');
const cors = require('cors');
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
app.listen(process.env.PORT || 3000, () => console.log('running on port 3000!'));