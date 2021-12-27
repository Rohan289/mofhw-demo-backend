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
       response.push(element);
   });
   res.status(200).send(response);
});
app.get("/filtered_list_covid_state_wise", async (req, res) => {
    covidDataStateWise = await fetchCovidData();
    if(covidDataStateWise && covidDataStateWise.data && req.query.sort_by && req.query.sort_by in covidDataStateWise.data[0]) {
    let response = [];
    covidDataStateWise.data.map((element) => {
        response.push(element);
    });
    response.sort((a,b) => a[req.query.sort_by] - b[req.query.sort_by]);
    res.status(200).send(response);
}
else{
    res.status(400).send("Request parameter doesn't exist!");
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